import React from "react";
import { getOrdersServer } from "@/lib/supabase/orders-server";
import { Order } from "@/types/order";
import OrdersClient from "./OrdersClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Manage Orders | Crafty Minds Admin",
  description: "View, update, and manage customer orders and payment records.",
};

export default async function AdminOrdersPage() {
  let initialOrders: Order[] = [];
  let errorMsg: string | null = null;
  try {
    initialOrders = await getOrdersServer();
  } catch (err) {
    console.error("Failed to load orders for admin dashboard:", err);
    errorMsg = err instanceof Error ? err.message : "Failed to load orders. Please verify database connectivity.";
  }

  return <OrdersClient initialOrders={initialOrders} errorMsg={errorMsg} />;
}
