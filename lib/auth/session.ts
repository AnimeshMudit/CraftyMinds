import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "admin_session";
const SESSION_EXPIRY = 7 * 24 * 60 * 60; // 7 days in seconds

const encoder = new TextEncoder();

async function getCryptoKey(secret: string): Promise<CryptoKey> {
  const keyData = encoder.encode(secret);
  return await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function encryptSession(payload: Record<string, unknown>): Promise<string> {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) {
    throw new Error("ADMIN_PASSWORD environment variable is not set.");
  }
  
  const payloadStr = JSON.stringify(payload);
  const data = encoder.encode(payloadStr);
  const key = await getCryptoKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, data);
  
  const signatureHex = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
    
  const payloadBase64 = btoa(payloadStr);
  return `${payloadBase64}.${signatureHex}`;
}

export async function decryptSession(token: string): Promise<Record<string, unknown> | null> {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) {
    throw new Error("ADMIN_PASSWORD environment variable is not set.");
  }

  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [payloadBase64, signatureHex] = parts;
    
    const payloadStr = atob(payloadBase64);
    const payload = JSON.parse(payloadStr) as Record<string, unknown>;
    
    // Check expiration
    if (payload.exp && typeof payload.exp === "number" && Date.now() > payload.exp) {
      return null;
    }
    
    const sigArray = new Uint8Array(
      signatureHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
    );
    
    const key = await getCryptoKey(secret);
    const data = encoder.encode(payloadStr);
    const isValid = await crypto.subtle.verify("HMAC", key, sigArray, data);
    
    if (!isValid) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionToken) return null;
  return await decryptSession(sessionToken);
}

export async function setSession(payload: Record<string, unknown>) {
  const expiryDate = Date.now() + SESSION_EXPIRY * 1000;
  const token = await encryptSession({
    ...payload,
    exp: expiryDate,
  });
  
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_EXPIRY,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
