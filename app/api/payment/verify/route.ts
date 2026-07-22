import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { sendOrderEmails } from "@/lib/email/resend";
import { Order } from "@/types/order";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    // 1. Validate payload: ensure all parameters exist
    if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Missing required payload fields." },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      console.error("Missing RAZORPAY_KEY_SECRET on the server.");
      return NextResponse.json(
        { success: false, error: "Razorpay credentials are not configured on the server." },
        { status: 500 }
      );
    }

    // 2. Signature Verification
    // Razorpay signature formula: HMAC_SHA256(razorpay_order_id + "|" + razorpay_payment_id, secret)
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    // Timing-safe comparison to prevent timing attacks.
    // timingSafeEqual throws an error if buffers have different lengths.
    const expectedBuffer = Buffer.from(expectedSignature, "utf8");
    const clientBuffer = Buffer.from(razorpay_signature, "utf8");

    let isSignatureValid = false;
    if (expectedBuffer.length === clientBuffer.length) {
      isSignatureValid = crypto.timingSafeEqual(expectedBuffer, clientBuffer);
    }

    if (!isSignatureValid) {
      return NextResponse.json(
        { success: false, error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // 3. Database Update
    const supabase = createServerSupabaseClient();

    // Perform updates only on pending, failed, or expired payments
    const { data: updatedOrder, error: updateError } = await supabase
      .from("orders")
      .update({
        payment_status: "paid",
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .in("payment_status", ["pending", "failed", "expired"])
      .select("*")
      .maybeSingle();

    if (updateError) {
      console.error("Failed to update order status in Supabase:", updateError);
      return NextResponse.json(
        { success: false, error: "Failed to update order payment record." },
        { status: 500 }
      );
    }

    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, error: "Order not found or payment status is not pending." },
        { status: 400 }
      );
    }



    // 4. Send customer & admin order verification emails (asynchronous operational notifications)
    // Email transmission failures are caught internally and will NOT block successful client responses.
    await sendOrderEmails(updatedOrder as Order);

    return NextResponse.json({
      success: true
    });
  } catch (err: unknown) {
    console.error("Error inside payment verification API:", err);
    const errorMessage = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
