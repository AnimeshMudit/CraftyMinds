import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { expirePendingOrders } from "@/lib/supabase/expire-orders";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderNumber, email } = body;

    // 1. Validation: check that both parameters exist
    if (!orderNumber || !email) {
      return NextResponse.json(
        { success: false, error: "Order not found." },
        { status: 404 }
      );
    }

    const trimmedOrderNumber = orderNumber.trim();
    const trimmedEmail = email.trim();

    if (trimmedOrderNumber === "" || trimmedEmail === "") {
      return NextResponse.json(
        { success: false, error: "Order not found." },
        { status: 404 }
      );
    }

    const supabase = createServerSupabaseClient();

    // Clean up any abandoned pending orders
    await expirePendingOrders(supabase);

    // 2. Query Supabase: match both order_number and email case-insensitively
    // We select only tracking-relevant fields. Never expose signatures, IDs, or metadata.
    const { data: order, error } = await supabase
      .from("orders")
      .select(`
        order_number,
        created_at,
        customer_name,
        email,
        phone,
        house_flat,
        street,
        landmark,
        city,
        state,
        pin_code,
        items,
        subtotal,
        total,
        payment_status,
        order_status
      `)
      .eq("order_number", trimmedOrderNumber)
      .ilike("email", trimmedEmail)
      .maybeSingle();

    if (error) {
      console.error("Database error during order tracking:", error);
      return NextResponse.json(
        { success: false, error: "Order not found." },
        { status: 404 }
      );
    }

    // 3. Prevent information leak (never return 200 with empty data)
    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (err: unknown) {
    console.error("Tracking API error:", err);
    return NextResponse.json(
      { success: false, error: "Order not found." },
      { status: 404 }
    );
  }
}
