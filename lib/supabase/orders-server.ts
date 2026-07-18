import { createServerSupabaseClient } from "./server";
import { Order } from "@/types/order";

/**
 * Fetch all customer orders on the server, ordered by created_at desc.
 */
export async function getOrdersServer(): Promise<Order[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Server error fetching orders:", error);
    throw new Error(error.message);
  }

  // Cast return type safely
  return (data || []) as Order[];
}
