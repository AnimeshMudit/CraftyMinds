import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getCustomerSession } from "@/lib/auth/customer-session-server";
import { expirePendingOrders } from "@/lib/supabase/expire-orders";

export async function GET() {
  try {
    const session = await getCustomerSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    // Clean up any abandoned pending orders
    await expirePendingOrders(supabase);

    if (session.user.email) {
      await supabase
        .from("orders")
        .update({ user_id: session.user.id })
        .eq("email", session.user.email)
        .is("user_id", null);
    }

    const { data, error } = await supabase
      .from("orders")
      .select("id, order_number, customer_name, email, phone, total, subtotal, payment_status, order_status, created_at, items")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, orders: data ?? [] });
  } catch (error) {
    console.error("Load customer orders error:", error);
    return NextResponse.json({ success: false, error: "Unable to load orders." }, { status: 500 });
  }
}
