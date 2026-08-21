import Razorpay from "razorpay";

/**
 * Server-only Razorpay client helper.
 * Instantiates the official Razorpay SDK using server environment variables.
 * Never exposed to client-side code or bundles.
 */
export function getRazorpayServerClient(): Razorpay {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Missing server-side Razorpay API credentials (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET).");
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}
