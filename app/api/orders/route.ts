import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { getCustomerSession } from "@/lib/auth/customer-session-server";

// Helper to generate a sequential order number
async function generateOrderNumber(supabase: SupabaseClient): Promise<string> {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("order_number")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error fetching latest order number:", error);
      // Safe fallback using timestamp slice in case query fails
      return `CM-${Date.now().toString().slice(-6)}`;
    }

    if (!data || !data.order_number) {
      return "CM-1001";
    }

    // Match sequential order numbers in format CM-XXXX
    const match = data.order_number.match(/CM-(\d+)/);
    if (match) {
      const lastNum = parseInt(match[1], 10);
      return `CM-${lastNum + 1}`;
    }

    return "CM-1001";
  } catch (err) {
    console.error("Failed to generate order number:", err);
    return `CM-${Date.now().toString().slice(-6)}`;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer, address, items, subtotal, total } = body;
    const customerSession = await getCustomerSession();

    if (!customerSession) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Guest checkout is not allowed." },
        { status: 401 }
      );
    }

    // 1. Validation: Required customer fields exist
    if (!customer || !customer.fullName || !customer.email || !customer.phone) {
      return NextResponse.json(
        { success: false, error: "Missing customer information (fullName, email, phone)." },
        { status: 400 }
      );
    }

    // 2. Validation: Required shipping address fields exist
    if (
      !address ||
      !address.houseFlat ||
      !address.street ||
      !address.city ||
      !address.state ||
      !address.pinCode
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required shipping address details." },
        { status: 400 }
      );
    }

    // 3. Validation: Items array is not empty
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Items list cannot be empty." },
        { status: 400 }
      );
    }

    // 4. Validation: Subtotal and total are valid positive numbers
    if (typeof subtotal !== "number" || subtotal < 0) {
      return NextResponse.json(
        { success: false, error: "Invalid subtotal amount." },
        { status: 400 }
      );
    }

    if (typeof total !== "number" || total < 0) {
      return NextResponse.json(
        { success: false, error: "Invalid total amount." },
        { status: 400 }
      );
    }

    // Create the server-side Supabase client using Service Role key
    const supabase = createServerSupabaseClient();

    // Insert order into Supabase with retry logic for unique constraint violations
    let insertedOrder = null;
    let insertError = null;
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      attempts++;
      // Generate sequential order number
      const orderNumber = await generateOrderNumber(supabase);

      // Prepare Database Record structure mapping target schema
      const orderRecord = {
        customer_name: customer.fullName,
        email: customer.email,
        phone: customer.phone,
        user_id: customerSession.user.id,
        house_flat: address.houseFlat,
        street: address.street,
        landmark: address.landmark || null,
        city: address.city,
        state: address.state,
        pin_code: address.pinCode,
        items: items, // Direct JSON array insertion
        subtotal: subtotal,
        total: total,
        payment_status: "pending",
        order_status: "pending",
        order_number: orderNumber,
      };

      const { data, error } = await supabase
        .from("orders")
        .insert([orderRecord])
        .select("id, order_number")
        .single();

      if (error) {
        insertError = error;
        // Check for Postgres unique key violation (23505)
        if (error.code === "23505") {
          console.warn(`Order number collision detected on attempt ${attempts} (order_number: ${orderNumber}). Retrying...`);
          // Small delay before retrying (exponential backoff)
          await new Promise((resolve) => setTimeout(resolve, Math.random() * 100));
          continue;
        }
        break;
      }

      insertedOrder = data;
      insertError = null;
      break;
    }

    if (insertError || !insertedOrder) {
      console.error("Failed to insert order in Supabase after multiple attempts:", insertError);
      return NextResponse.json(
        { success: false, error: "Internal server error. Failed to save order record." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: insertedOrder.id,
      orderNumber: insertedOrder.order_number,
    });
  } catch (err) {
    console.error("Server-side error in order creation API:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error. Processing failed." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, payment_status, customer, address } = body;
    const customerSession = await getCustomerSession();

    if (!customerSession) {
      return NextResponse.json(
        { success: false, error: "Unauthorized." },
        { status: 401 }
      );
    }

    if (!orderId || !payment_status) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: orderId and payment_status." },
        { status: 400 }
      );
    }

    const allowedPaymentStatuses = ["pending", "failed", "expired"];
    if (!allowedPaymentStatuses.includes(payment_status)) {
      return NextResponse.json(
        { success: false, error: "Invalid payment_status. Can only transition to pending, failed, or expired." },
        { status: 400 }
      );
    }

    const updateFields: Record<string, unknown> = {
      payment_status,
      updated_at: new Date().toISOString(),
    };

    if (customer) {
      if (customer.fullName) updateFields.customer_name = customer.fullName;
      if (customer.email) updateFields.email = customer.email;
      if (customer.phone) updateFields.phone = customer.phone;
    }

    if (address) {
      if (address.houseFlat) updateFields.house_flat = address.houseFlat;
      if (address.street) updateFields.street = address.street;
      updateFields.landmark = address.landmark || null;
      if (address.city) updateFields.city = address.city;
      if (address.state) updateFields.state = address.state;
      if (address.pinCode) updateFields.pin_code = address.pinCode;
    }

    const supabase = createServerSupabaseClient();
    const { data: updatedOrder, error: updateError } = await supabase
      .from("orders")
      .update(updateFields)
      .eq("id", orderId)
      .eq("user_id", customerSession.user.id)
      .select("id, order_number, payment_status")
      .maybeSingle();

    if (updateError) {
      console.error("Failed to update order payment status:", updateError);
      return NextResponse.json(
        { success: false, error: "Failed to update order payment record." },
        { status: 500 }
      );
    }

    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, error: "Order not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: updatedOrder
    });
  } catch (err) {
    console.error("Error in PATCH /api/orders:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}
