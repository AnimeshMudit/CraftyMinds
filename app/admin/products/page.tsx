import React from "react";
import { getProductsServer } from "@/lib/supabase/products-server";
import ProductsClient from "./ProductsClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Manage Products | Crafty Minds Admin",
  description: "View, update, and manage your products.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminProductsPage() {
  const products = await getProductsServer();

  return <ProductsClient initialProducts={products} />;
}
