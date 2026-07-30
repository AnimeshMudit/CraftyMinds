import crypto from "crypto";
import { getSession } from "@/lib/auth/session";

/**
 * Checks if the current user session is authenticated.
 * Returns true if authenticated, false otherwise.
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}

/**
 * Verifies if the provided password matches the ADMIN_PASSWORD environment variable.
 * Uses a constant-time comparison to avoid leaking password length/content via timing.
 */
export function verifyPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.error("ADMIN_PASSWORD is not configured on the server.");
    return false;
  }

  const providedBuffer = Buffer.from(password, "utf8");
  const expectedBuffer = Buffer.from(adminPassword, "utf8");

  if (providedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(providedBuffer, expectedBuffer);
}

const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_ATTEMPT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

interface LoginAttemptEntry {
  count: number;
  windowStart: number;
}

// In-memory per-instance limiter. Resets on server restart/redeploy and is not
// shared across serverless instances, but stops naive/scripted brute-forcing
// of a single admin credential without requiring new infrastructure.
const loginAttempts = new Map<string, LoginAttemptEntry>();

/**
 * Returns true if the given identifier (e.g. client IP) has exceeded the
 * allowed number of failed admin login attempts within the current window.
 */
export function isLoginRateLimited(identifier: string): boolean {
  const entry = loginAttempts.get(identifier);
  if (!entry) return false;

  if (Date.now() - entry.windowStart > LOGIN_ATTEMPT_WINDOW_MS) {
    loginAttempts.delete(identifier);
    return false;
  }

  return entry.count >= MAX_LOGIN_ATTEMPTS;
}

/**
 * Records a failed admin login attempt for the given identifier.
 */
export function recordFailedLoginAttempt(identifier: string): void {
  const now = Date.now();
  const entry = loginAttempts.get(identifier);

  if (!entry || now - entry.windowStart > LOGIN_ATTEMPT_WINDOW_MS) {
    loginAttempts.set(identifier, { count: 1, windowStart: now });
    return;
  }

  entry.count += 1;
}

/**
 * Clears failed login attempts for the given identifier (call on success).
 */
export function clearLoginAttempts(identifier: string): void {
  loginAttempts.delete(identifier);
}
