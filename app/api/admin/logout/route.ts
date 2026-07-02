import { NextResponse } from "next/server";
import { clearSession } from "@/lib/auth/session";

export async function POST() {
  try {
    await clearSession();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Logout API error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
