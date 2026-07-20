import { NextResponse } from "next/server";
import { clearCustomerSession } from "@/lib/auth/customer-session-server";

export async function POST() {
  try {
    await clearCustomerSession();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Customer logout error:", error);
    return NextResponse.json({ success: false, error: "Unable to log out." }, { status: 500 });
  }
}
