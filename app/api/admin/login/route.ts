import { NextResponse } from "next/server";
import { setSession } from "@/lib/auth/session";
import {
  verifyPassword,
  isLoginRateLimited,
  recordFailedLoginAttempt,
  clearLoginAttempts,
} from "@/lib/utils/auth";

function getClientIdentifier(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return "unknown";
}

export async function POST(request: Request) {
  try {
    const identifier = getClientIdentifier(request);

    if (isLoginRateLimited(identifier)) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429 }
      );
    }

    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: "Password is required." }, { status: 400 });
    }

    if (!verifyPassword(password)) {
      recordFailedLoginAttempt(identifier);
      return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
    }

    // Correct password, set session
    clearLoginAttempts(identifier);
    await setSession({ admin: true });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Login API error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
