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
 */
export function verifyPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.error("ADMIN_PASSWORD is not configured on the server.");
    return false;
  }
  return password === adminPassword;
}
