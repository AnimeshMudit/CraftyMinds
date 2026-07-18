import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/utils/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: RouteParams) {
  let id = "";
  try {
    // 1. Authenticate check
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    id = (await params).id;
    const body = await request.json();
    const { order_status } = body;

    // 2. Validate order status parameter
    const allowedStatuses = ["pending", "processing", "shipped", "delivered"];
    if (!order_status || !allowedStatuses.includes(order_status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be pending, processing, shipped, or delivered." },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();

    // 3. Perform database update
    const { data: updatedOrder, error: updateError } = await supabase
      .from("orders")
      .update({
        order_status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .maybeSingle();

    if (updateError) {
      console.error(`Database error updating order ${id}:`, updateError);
      return NextResponse.json(
        { error: "Failed to update order status in the database." },
        { status: 500 }
      );
    }

    if (!updatedOrder) {
      return NextResponse.json(
        { error: "Order not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (err) {
    console.error(`PUT /api/admin/orders/${id} error:`, err);
    const errorMessage = err instanceof Error ? err.message : "Failed to update order status";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
