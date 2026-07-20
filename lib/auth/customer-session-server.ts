import { cookies } from "next/headers";
import {
  CUSTOMER_SESSION_COOKIE_NAME,
  CustomerSessionPayload,
  decryptCustomerSession,
  encryptCustomerSession,
} from "./customer-session";

const SESSION_MAX_AGE_BUFFER_SECONDS = 60;

export async function getCustomerSession(): Promise<CustomerSessionPayload | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(CUSTOMER_SESSION_COOKIE_NAME)?.value;
  if (!sessionToken) return null;

  const session = await decryptCustomerSession(sessionToken);
  if (!session) return null;

  if (Date.now() >= session.expiresAt) {
    return null;
  }

  return session;
}

export async function setCustomerSession(payload: CustomerSessionPayload) {
  const cookieStore = await cookies();
  const token = await encryptCustomerSession(payload);
  const maxAge = Math.max(SESSION_MAX_AGE_BUFFER_SECONDS, Math.floor((payload.expiresAt - Date.now()) / 1000));

  cookieStore.set(CUSTOMER_SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}

export async function clearCustomerSession() {
  const cookieStore = await cookies();
  cookieStore.delete(CUSTOMER_SESSION_COOKIE_NAME);
}
