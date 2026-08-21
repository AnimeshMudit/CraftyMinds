import { NextRequest, NextResponse } from "next/server";
import { getRazorpayServerClient } from "@/lib/payment/razorpay";
import { createServerSupabaseClient } from "@/lib/supabase/server";

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

    const publicKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    if (!publicKey) {
      throw new Error("Missing NEXT_PUBLIC_RAZORPAY_KEY_ID.");
    }

    // 3. Initialize Razorpay
    const razorpay = getRazorpayServerClient();

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

    // 6. Persist razorpay_order_id to Supabase orders table immediately
    try {
      const supabase = createServerSupabaseClient();
      let updateQuery = supabase
        .from("orders")
        .update({
          razorpay_order_id: razorpayOrder.id,
          updated_at: new Date().toISOString(),
        });

      if (orderId.startsWith("CM-")) {
        updateQuery = updateQuery.eq("order_number", orderId);
      } else {
        updateQuery = updateQuery.eq("id", orderId);
      }

      const { error: updateError } = await updateQuery;
      if (updateError) {
        console.warn("[Payment Create-Order] Could not immediately persist razorpay_order_id:", updateError.message);
      }
    } catch (dbErr) {
      console.warn("[Payment Create-Order] Non-fatal DB error persisting razorpay_order_id:", dbErr);
    }

    // 7. Return JSON response
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
