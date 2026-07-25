import React from "react";
import { getProductsServer } from "@/lib/supabase/products-server";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const products = await getProductsServer();

  return <DashboardClient products={products} />;
}
