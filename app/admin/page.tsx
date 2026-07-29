import React from "react";
import type { Metadata } from "next";
import { getProductsServer } from "@/lib/supabase/products-server";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const products = await getProductsServer();

  return <DashboardClient products={products} />;
}
