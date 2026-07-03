import React from "react";
import { getProducts } from "@/lib/supabase/products";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const products = await getProducts();

  return <DashboardClient products={products} />;
}
