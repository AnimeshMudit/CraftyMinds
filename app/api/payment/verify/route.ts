import { NextRequest, NextResponse } from "next/server";
import { reconcileOrderPayment } from "@/lib/payment/reconcile";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    // 1. Validate payload fields
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
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

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

    // 3. Idempotently reconcile order & trigger email dispatch
    const result = await reconcileOrderPayment({
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      alreadyPaid: result.alreadyPaid || false,
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
