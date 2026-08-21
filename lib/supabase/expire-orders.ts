import { SupabaseClient } from "@supabase/supabase-js";
import { getRazorpayServerClient } from "@/lib/payment/razorpay";
import { reconcileOrderPayment } from "@/lib/payment/reconcile";

/**
 * Production-Safe Order Expiration Sweep.
 * 
 * 1. Checks pending orders older than 30 minutes.
 * 2. Cross-checks Razorpay API for orders with razorpay_order_id.
 *    - If paid on Razorpay: auto-reconciles order to 'paid'.
 *    - If unpaid on Razorpay or missing gateway order: marks 'expired'.
 *    - If Razorpay API call fails: leaves as 'pending' for next retry.
 * 3. Never permanently deletes orders (preserves full auditability & late reconciliation).
 */
export async function expirePendingOrders(supabase: SupabaseClient): Promise<void> {
  try {
    const now = new Date();
    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000).toISOString();

    // 1. Fetch pending orders older than 30 minutes
    const { data: pendingOrders, error: fetchError } = await supabase
      .from("orders")
      .select("id, order_number, razorpay_order_id, payment_status")
      .eq("payment_status", "pending")
      .lt("created_at", thirtyMinutesAgo);

    if (fetchError) {
      console.error("[Order Expiration Sweep] Error fetching pending orders:", fetchError);
      return;
    }

    if (!pendingOrders || pendingOrders.length === 0) {
      return;
    }

    // 2. Process each pending order safely
    for (const order of pendingOrders) {
      // Case A: Missing Razorpay order ID (never initiated payment gateway order)
      if (!order.razorpay_order_id) {
        const { error: expireError } = await supabase
          .from("orders")
          .update({
            payment_status: "expired",
            updated_at: new Date().toISOString(),
          })
          .eq("id", order.id)
          .eq("payment_status", "pending");

        if (expireError) {
          console.error(`[Order Expiration Sweep] Error expiring order ${order.order_number}:`, expireError);
        }
        continue;
      }

      // Case B: Has razorpay_order_id -> Cross-check status with Razorpay
      try {
        const razorpay = getRazorpayServerClient();
        const rzpOrder = await razorpay.orders.fetch(order.razorpay_order_id);

        if (rzpOrder && rzpOrder.status === "paid") {
          // Fetch payment(s) to obtain a verified captured payment ID
          let capturedPaymentId: string | null = null;
          try {
            const payments = await razorpay.orders.fetchPayments(order.razorpay_order_id);
            const capturedPayment = payments?.items?.find(
              (p: { id?: unknown; status?: unknown }) =>
                p.status === "captured" &&
                typeof p.id === "string" &&
                p.id.startsWith("pay_")
            );
            if (capturedPayment?.id) {
              capturedPaymentId = capturedPayment.id as string;
            }
          } catch (payErr) {
            console.warn(
              `[Order Expiration Sweep] Could not fetch payments list for ${order.razorpay_order_id}:`,
              payErr instanceof Error ? payErr.message : "Fetch payments error"
            );
          }

          // Payment ID Guard: Only reconcile if a verified captured payment ID exists
          if (capturedPaymentId) {
            console.log(
              `[Order Expiration Sweep] Order ${order.order_number} (${order.razorpay_order_id}) verified with captured payment ${capturedPaymentId}. Auto-reconciling...`
            );

            // Idempotently reconcile order to 'paid'
            await reconcileOrderPayment({
              orderId: order.id,
              orderNumber: order.order_number,
              razorpay_order_id: order.razorpay_order_id,
              razorpay_payment_id: capturedPaymentId,
            });
          } else {
            // Razorpay reports order as paid, but no captured payment ID could be confirmed.
            // DO NOT reconcile with empty ID, DO NOT expire, and DO NOT send email.
            // Leave payment_status = pending so the next sweep or webhook can retry.
            console.warn(
              `[Order Expiration Sweep] Order ${order.order_number} (${order.razorpay_order_id}) is marked paid in Razorpay, but no verified captured payment ID (pay_...) was found. Keeping as pending for retry.`
            );
          }
        } else {
          // Order is not paid on Razorpay (attempted, created, etc.)
          // Safely expire with concurrency protection (only update if still pending)
          const { error: expireError } = await supabase
            .from("orders")
            .update({
              payment_status: "expired",
              updated_at: new Date().toISOString(),
            })
            .eq("id", order.id)
            .eq("payment_status", "pending");

          if (expireError) {
            console.error(`[Order Expiration Sweep] Error expiring order ${order.order_number}:`, expireError);
          }
        }
      } catch (rzpErr) {
        // Razorpay API failure (timeout, rate limit, network/server error).
        // CRITICAL: DO NOT EXPIRE THE ORDER. Leave payment_status = pending.
        console.error(
          `[Order Expiration Sweep] Razorpay API check failed for order ${order.order_number} (${order.razorpay_order_id}). Keeping as pending:`,
          rzpErr instanceof Error ? rzpErr.message : "API error"
        );
      }
    }
  } catch (err) {
    console.error("[Order Expiration Sweep] Unexpected failure during pending orders sweep:", err);
  }
}

