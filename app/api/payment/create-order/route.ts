import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, orderId } = body;

    // 1. Validate: amount must be a positive number
    if (typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid amount. Must be a positive number." },
        { status: 400 }
      );
    }

    // 2. Validate: orderId must be a valid non-empty string
    if (!orderId || typeof orderId !== "string" || orderId.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Invalid orderId. Must be a non-empty string." },
        { status: 400 }
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const publicKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

    if (!keyId || !keySecret) {
      console.error("Missing server-side Razorpay API credentials.");
      return NextResponse.json(
        { success: false, error: "Razorpay credentials are not configured on the server." },
        { status: 500 }
      );
    }

    if (!publicKey) {
      throw new Error("Missing NEXT_PUBLIC_RAZORPAY_KEY_ID.");
    }

    // 3. Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    // 4. Convert amount to paise (1 Rupee = 100 Paise)
    const amountInPaise = Math.round(amount * 100);

    // 5. Create a Razorpay Order
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: orderId,
      notes: {
        internal_order_id: orderId,
      },
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // 6. Return JSON response
    return NextResponse.json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: amount,
      amountInPaise: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: publicKey,
    });
  } catch (err: unknown) {
    console.error("Failed to create Razorpay order:", err);
    const errorMessage = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
