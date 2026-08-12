import { NextRequest, NextResponse } from "next/server";
import { reconcileOrderPayment } from "@/lib/payment/reconcile";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    // 1. Read raw request body as text BEFORE any JSON parsing
    const rawBody = await req.text();

    // 2. Extract headers
    const signature = req.headers.get("x-razorpay-signature");
    const eventId = req.headers.get("x-razorpay-event-id");

    if (!signature) {
      return NextResponse.json(
        { success: false, error: "Missing X-Razorpay-Signature header." },
        { status: 400 }
      );
    }

    // 3. Obtain webhook secret from environment (MUST NOT use RAZORPAY_KEY_SECRET)
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("[Razorpay Webhook] Missing RAZORPAY_WEBHOOK_SECRET environment variable.");
      return NextResponse.json(
        { success: false, error: "Razorpay webhook secret is not configured on the server." },
        { status: 500 }
      );
    }

    // 4. Verify webhook signature using HMAC-SHA256 over raw request body
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature, "utf8");
    const clientBuffer = Buffer.from(signature, "utf8");

    let isSignatureValid = false;
    if (expectedBuffer.length === clientBuffer.length) {
      isSignatureValid = crypto.timingSafeEqual(expectedBuffer, clientBuffer);
    }

    if (!isSignatureValid) {
      console.error("[Razorpay Webhook] Webhook signature verification failed.");
      return NextResponse.json(
        { success: false, error: "Invalid webhook signature" },
        { status: 400 }
      );
    }

    // 5. Parse JSON payload only after valid signature verification
    const payload = JSON.parse(rawBody);
    const event = payload.event;

    console.log(`[Razorpay Webhook] Received valid event: ${event} (Event ID: ${eventId || "none"})`);

    // 6. Check for duplicate event using X-Razorpay-Event-Id header
    if (eventId) {
      const supabase = createServerSupabaseClient();
      try {
        const { error: eventError } = await supabase
          .from("webhook_events")
          .insert([{ id: eventId, event_type: event }]);

        if (eventError && eventError.code === "23505") {
          console.log(`[Razorpay Webhook] Event ${eventId} already processed. Returning 200 OK.`);
          return NextResponse.json(
            { success: true, message: "Event already processed" },
            { status: 200 }
          );
        }
      } catch (err) {
        console.warn("[Razorpay Webhook] Could not query webhook_events table:", err);
      }
    }

    // 7. Handle target events
    if (event === "order.paid") {
      const orderEntity = payload.payload?.order?.entity;
      const paymentEntity = payload.payload?.payment?.entity;

      const razorpayOrderId = orderEntity?.id;
      const razorpayPaymentId = paymentEntity?.id || orderEntity?.payment_id || "";
      const orderNumber =
        orderEntity?.receipt ||
        orderEntity?.notes?.internal_order_id ||
        orderEntity?.notes?.order_number;
      const orderId = orderEntity?.notes?.orderId || orderEntity?.notes?.id;

      if (!razorpayOrderId) {
        return NextResponse.json(
          { success: false, error: "Missing razorpay_order_id in order.paid payload" },
          { status: 400 }
        );
      }

      const result = await reconcileOrderPayment({
        orderId,
        orderNumber,
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: razorpayPaymentId,
      });

      return NextResponse.json(
        { success: true, message: result.message, alreadyPaid: result.alreadyPaid },
        { status: 200 }
      );
    }

    if (event === "payment.captured") {
      const paymentEntity = payload.payload?.payment?.entity;
      const razorpayOrderId = paymentEntity?.order_id;
      const razorpayPaymentId = paymentEntity?.id;
      const orderNumber =
        paymentEntity?.notes?.internal_order_id || paymentEntity?.notes?.order_number;
      const orderId = paymentEntity?.notes?.orderId || paymentEntity?.notes?.id;

      if (!razorpayOrderId || !razorpayPaymentId) {
        return NextResponse.json(
          { success: false, error: "Missing Razorpay identifiers in payment.captured payload" },
          { status: 400 }
        );
      }

      const result = await reconcileOrderPayment({
        orderId,
        orderNumber,
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: razorpayPaymentId,
      });

      return NextResponse.json(
        { success: true, message: result.message, alreadyPaid: result.alreadyPaid },
        { status: 200 }
      );
    }

    if (event === "payment.failed") {
      const paymentEntity = payload.payload?.payment?.entity;
      const razorpayOrderId = paymentEntity?.order_id;
      const orderNumber =
        paymentEntity?.notes?.internal_order_id || paymentEntity?.notes?.order_number;

      if (razorpayOrderId || orderNumber) {
        const supabase = createServerSupabaseClient();
        let query = supabase
          .from("orders")
          .update({
            payment_status: "failed",
            updated_at: new Date().toISOString(),
          })
          .eq("payment_status", "pending");

        if (orderNumber) {
          query = query.eq("order_number", orderNumber);
        } else if (razorpayOrderId) {
          query = query.eq("razorpay_order_id", razorpayOrderId);
        }
        await query;
      }

      return NextResponse.json(
        { success: true, message: "Payment failure recorded" },
        { status: 200 }
      );
    }

    // Unhandled event types respond with HTTP 200 OK so Razorpay does not retry unnecessarily
    return NextResponse.json(
      { success: true, message: `Event ${event} received and acknowledged` },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("Error processing Razorpay webhook:", err);
    const errorMessage = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
