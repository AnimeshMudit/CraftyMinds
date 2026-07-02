import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/utils/auth";
import { uploadImageServer } from "@/lib/supabase/products-server";

export async function POST(request: Request) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
    const filename = `${timestamp}_${sanitizedName}`;
    
    // Read file contents as ArrayBuffer
    const fileBuffer = await file.arrayBuffer();

    const publicUrl = await uploadImageServer(fileBuffer, filename, file.type);

    return NextResponse.json({ url: publicUrl });
  } catch (err) {
    console.error("POST /api/upload error:", err);
    const errorMessage = err instanceof Error ? err.message : "Failed to upload image";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
