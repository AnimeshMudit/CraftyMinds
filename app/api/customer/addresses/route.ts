import { NextResponse } from "next/server";
import { createServerUserClient } from "@/lib/supabase/server";

// GET /api/customer/addresses
export async function GET() {
  try {
    const supabase = await createServerUserClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, addresses: data || [] });
  } catch (error) {
    console.error("Fetch addresses error:", error);
    return NextResponse.json({ success: false, error: "Unable to fetch addresses." }, { status: 500 });
  }
}

// POST /api/customer/addresses
export async function POST(request: Request) {
  try {
    const supabase = await createServerUserClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const { fullName, phone, houseFlat, street, landmark, city, state, pinCode, isDefault } = body;

    if (!fullName || !phone || !houseFlat || !street || !city || !state || !pinCode) {
      return NextResponse.json({ success: false, error: "Missing required fields." }, { status: 400 });
    }

    // If isDefault is true, set all other addresses for this user to is_default = false
    if (isDefault) {
      const { error: resetError } = await supabase
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", user.id);
      if (resetError) {
        console.error("Reset default addresses error:", resetError);
      }
    }

    const { data, error } = await supabase
      .from("addresses")
      .insert({
        user_id: user.id,
        full_name: fullName.trim(),
        phone: phone.trim(),
        house_flat: houseFlat.trim(),
        street: street.trim(),
        landmark: landmark ? landmark.trim() : null,
        city: city.trim(),
        state: state.trim(),
        pin_code: pinCode.trim(),
        is_default: Boolean(isDefault)
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, address: data });
  } catch (error) {
    console.error("Create address error:", error);
    return NextResponse.json({ success: false, error: "Unable to create address." }, { status: 500 });
  }
}

// PATCH /api/customer/addresses
export async function PATCH(request: Request) {
  try {
    const supabase = await createServerUserClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const { id, fullName, phone, houseFlat, street, landmark, city, state, pinCode, isDefault } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Address ID is required." }, { status: 400 });
    }

    // Verify address ownership first
    const { data: existingAddress, error: checkError } = await supabase
      .from("addresses")
      .select("id")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (checkError || !existingAddress) {
      return NextResponse.json({ success: false, error: "Address not found or unauthorized." }, { status: 404 });
    }

    // If isDefault is true, set all other addresses for this user to is_default = false
    if (isDefault) {
      const { error: resetError } = await supabase
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", user.id);
      if (resetError) {
        console.error("Reset default addresses error:", resetError);
      }
    }

    const updatePayload: Record<string, unknown> = {};
    if (fullName !== undefined) updatePayload.full_name = fullName.trim();
    if (phone !== undefined) updatePayload.phone = phone.trim();
    if (houseFlat !== undefined) updatePayload.house_flat = houseFlat.trim();
    if (street !== undefined) updatePayload.street = street.trim();
    if (landmark !== undefined) updatePayload.landmark = landmark ? landmark.trim() : null;
    if (city !== undefined) updatePayload.city = city.trim();
    if (state !== undefined) updatePayload.state = state.trim();
    if (pinCode !== undefined) updatePayload.pin_code = pinCode.trim();
    if (isDefault !== undefined) updatePayload.is_default = Boolean(isDefault);

    const { data, error } = await supabase
      .from("addresses")
      .update(updatePayload)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, address: data });
  } catch (error) {
    console.error("Update address error:", error);
    return NextResponse.json({ success: false, error: "Unable to update address." }, { status: 500 });
  }
}

// DELETE /api/customer/addresses?id=uuid
export async function DELETE(request: Request) {
  try {
    const supabase = await createServerUserClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Address ID is required." }, { status: 400 });
    }

    const { error } = await supabase
      .from("addresses")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete address error:", error);
    return NextResponse.json({ success: false, error: "Unable to delete address." }, { status: 500 });
  }
}

