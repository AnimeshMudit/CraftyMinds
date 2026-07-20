export const CUSTOMER_SESSION_COOKIE_NAME = "customer_session";

const encoder = new TextEncoder();

export interface CustomerProfileData {
  id: string;
  fullName: string | null;
  email: string | null;
  avatarUrl: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface CustomerSessionPayload {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: {
    id: string;
    email: string | null;
    fullName: string | null;
    avatarUrl: string | null;
    createdAt: string | null;
  };
}

function getSecret(): string {
  const secret = process.env.CUSTOMER_SESSION_SECRET;
  if (!secret) {
    throw new Error("CUSTOMER_SESSION_SECRET environment variable is not set.");
  }

  return secret;
}

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

function encodeBase64(value: string): string {
  return btoa(value);
}

function decodeBase64(value: string): string {
  return atob(value);
}

export function isCustomerSessionExpired(payload: CustomerSessionPayload): boolean {
  return Date.now() >= payload.expiresAt;
}

export async function encryptCustomerSession(payload: CustomerSessionPayload): Promise<string> {
  const secret = getSecret();
  const payloadStr = JSON.stringify(payload);
  const data = encoder.encode(payloadStr);
  const key = await getCryptoKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, data);

  const signatureHex = Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return `${encodeBase64(payloadStr)}.${signatureHex}`;
}

export async function decryptCustomerSession(token: string): Promise<CustomerSessionPayload | null> {
  const secret = getSecret();

  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [payloadBase64, signatureHex] = parts;
    const payloadStr = decodeBase64(payloadBase64);
    const payload = JSON.parse(payloadStr) as CustomerSessionPayload;

    const signatureBytes = signatureHex.match(/.{1,2}/g);
    if (!signatureBytes) return null;

    const sigArray = new Uint8Array(signatureBytes.map((byte) => parseInt(byte, 16)));
    const key = await getCryptoKey(secret);
    const data = encoder.encode(payloadStr);
    const isValid = await crypto.subtle.verify("HMAC", key, sigArray, data);

    if (!isValid) return null;
    if (!payload?.accessToken || !payload?.refreshToken || !payload?.user?.id || !payload?.expiresAt) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
