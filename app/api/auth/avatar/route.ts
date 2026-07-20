import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getCustomerSession } from "@/lib/auth/customer-session-server";

export async function POST(request: Request) {
  try {
    const session = await getCustomerSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("avatar");

    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, error: "Please choose an image file." }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ success: false, error: "Only image files are allowed." }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: "Image must be smaller than 5 MB." }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    const bucketName = "customer-avatars";
    const extension = file.name.split(".").pop() || "png";
    const filePath = `${session.user.id}/${Date.now()}.${extension}`;
    const buffer = await file.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json({ success: false, error: uploadError.message }, { status: 500 });
    }

    const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
    const avatarUrl = data.publicUrl;

    const { data: updatedProfile, error: profileError } = await supabase
      .from("profiles")
      .upsert(
        {
          id: session.user.id,
          full_name: session.user.fullName,
          email: session.user.email,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      )
      .select("id, full_name, email, avatar_url, created_at, updated_at")
      .single();

    if (profileError) {
      return NextResponse.json({ success: false, error: profileError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, avatarUrl, profile: updatedProfile });
  } catch (error) {
    console.error("Avatar upload error:", error);
    return NextResponse.json({ success: false, error: "Unable to upload avatar." }, { status: 500 });
  }
}
