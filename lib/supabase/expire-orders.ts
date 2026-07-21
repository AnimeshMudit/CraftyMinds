import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Automatically transitions pending orders older than 30 minutes to 'expired',
 * and deletes failed or expired orders older than 24 hours.
 */
export async function expirePendingOrders(supabase: SupabaseClient): Promise<void> {
  try {
    const now = new Date();
    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000).toISOString();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

    // 1. Transition pending orders older than 30 minutes to 'expired'
    const { error: expireError } = await supabase
      .from("orders")
      .update({
        payment_status: "expired",
        updated_at: now.toISOString(),
      })
      .eq("payment_status", "pending")
      .lt("created_at", thirtyMinutesAgo);

    if (expireError) {
      console.error("Database error during pending orders auto-expiration:", expireError);
    }

    // 2. Clean up failed or expired orders older than 24 hours
    // Safety check: order must be unpaid (payment_status failed or expired) and order_status is 'pending'
    const { error: cleanupError } = await supabase
      .from("orders")
      .delete()
      .in("payment_status", ["failed", "expired"])
      .eq("order_status", "pending")
      .lt("created_at", twentyFourHoursAgo);

    if (cleanupError) {
      console.error("Database error during abandoned orders cleanup:", cleanupError);
    }
  } catch (err) {
    console.error("Failed to execute pending orders auto-expiration and cleanup:", err);
  }
}
