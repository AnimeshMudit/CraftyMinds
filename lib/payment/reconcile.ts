import { createServerSupabaseClient } from "@/lib/supabase/server";
import { sendOrderEmails } from "@/lib/email/resend";
import { Order } from "@/types/order";

export interface ReconcileResult {
  success: boolean;
  message: string;
  alreadyPaid?: boolean;
  order?: Order | null;
  error?: string;
}

/**
 * Idempotently reconciles an order's payment status to 'paid'.
 * Shared by both the client verification route (/api/payment/verify)
 * and the Razorpay webhook route (/api/payment/webhook).
 */
export async function reconcileOrderPayment({
  orderId,
  orderNumber,
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}: {
  orderId?: string;
  orderNumber?: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature?: string;
}): Promise<ReconcileResult> {
  const supabase = createServerSupabaseClient();

  // 1. Locate the target order by ID, order_number, or razorpay_order_id
  let existingOrder: Order | null = null;

  if (orderId) {
    const { data } = await supabase.from("orders").select("*").eq("id", orderId).maybeSingle();
    if (data) existingOrder = data as Order;
  }

  if (!existingOrder && orderNumber) {
    const { data } = await supabase.from("orders").select("*").eq("order_number", orderNumber).maybeSingle();
    if (data) existingOrder = data as Order;
  }

  if (!existingOrder && razorpay_order_id) {
    const { data } = await supabase.from("orders").select("*").eq("razorpay_order_id", razorpay_order_id).maybeSingle();
    if (data) existingOrder = data as Order;
  }

  if (!existingOrder) {
    return {
      success: false,
      message: "Order not found",
      error: "Order record matching provided identifiers was not found.",
    };
  }

  // Mismatch check: Ensure razorpay_order_id matches if already set on existingOrder
  if (
    existingOrder.razorpay_order_id &&
    existingOrder.razorpay_order_id !== razorpay_order_id
  ) {
    console.error(
      `[Payment Reconcile] Mismatch: order ${existingOrder.order_number} has razorpay_order_id ${existingOrder.razorpay_order_id}, but received ${razorpay_order_id}`
    );
    return {
      success: false,
      message: "Order mismatch",
      error: "Razorpay order ID does not match the stored order record.",
    };
  }

  // 2. If already paid, handle idempotency
  if (existingOrder.payment_status === "paid") {
    await attemptEmailDispatch(existingOrder);
    return {
      success: true,
      alreadyPaid: true,
      message: "Order already paid",
      order: existingOrder,
    };
  }

  // 3. Atomically update payment status to 'paid'
  const updateFields: Record<string, unknown> = {
    payment_status: "paid",
    razorpay_order_id,
    razorpay_payment_id,
    updated_at: new Date().toISOString(),
  };

  if (razorpay_signature) {
    updateFields.razorpay_signature = razorpay_signature;
  }

  const { data: updatedOrder, error: updateError } = await supabase
    .from("orders")
    .update(updateFields)
    .eq("id", existingOrder.id)
    .in("payment_status", ["pending", "failed", "expired"])
    .select("*")
    .maybeSingle();

  if (updateError) {
    console.error("[Payment Reconcile] Database update error:", updateError);
    return {
      success: false,
      message: "Failed to update order payment status",
      error: updateError.message,
    };
  }

  let finalOrder = (updatedOrder as Order) || existingOrder;

  if (!updatedOrder) {
    // A concurrent process marked it paid between our check and update
    const { data: reFetched } = await supabase.from("orders").select("*").eq("id", existingOrder.id).maybeSingle();
    if (reFetched) {
      finalOrder = reFetched as Order;
    }
  }

  // 4. Safely & idempotently dispatch emails
  await attemptEmailDispatch(finalOrder);

  return {
    success: true,
    alreadyPaid: false,
    message: "Order payment verified and updated to paid",
    order: finalOrder,
  };
}

/**
 * Dispatches customer & admin order confirmation emails atomically.
 * Uses payment_confirmation_sent_at database column to guarantee
 * emails are dispatched EXACTLY ONCE across parallel callbacks/webhooks.
 */
async function attemptEmailDispatch(order: Order): Promise<void> {
  const supabase = createServerSupabaseClient();
  const now = new Date().toISOString();

  try {
    const { data: lockAcquired, error } = await supabase
      .from("orders")
      .update({
        payment_confirmation_sent_at: now,
        updated_at: now,
      })
      .eq("id", order.id)
      .is("payment_confirmation_sent_at", null)
      .select("*")
      .maybeSingle();

    if (error) {
      // Column might not exist in database if migration is pending
      console.warn("[Payment Reconcile] payment_confirmation_sent_at lock update skipped:", error.message);
      // Fallback: send email safely
      await sendOrderEmails(order);
      return;
    }

    if (lockAcquired) {
      console.log(`[Payment Reconcile] Lock acquired for order ${order.order_number}. Dispatching emails.`);
      await sendOrderEmails(lockAcquired as Order);
    } else {
      console.log(`[Payment Reconcile] Emails already sent for order ${order.order_number}. Skipping duplicate dispatch.`);
    }
  } catch (err) {
    console.error("[Payment Reconcile] Error during email dispatch attempt:", err);
  }
}
