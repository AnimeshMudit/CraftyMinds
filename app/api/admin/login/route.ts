import { NextResponse } from "next/server";
import { setSession } from "@/lib/auth/session";
import { verifyPassword } from "@/lib/utils/auth";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: "Password is required." }, { status: 400 });
    }

    if (!verifyPassword(password)) {
      return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
    }

    // Correct password, set session
    await setSession({ admin: true });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Login API error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
