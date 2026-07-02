import React from "react";
import { getProducts } from "@/lib/supabase/products";
import ProductsClient from "./ProductsClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Manage Products | Crafty Minds Admin",
  description: "View, update, and manage your products.",
};

export default async function AdminProductsPage() {
  const products = await getProducts();

  return <ProductsClient initialProducts={products} />;
}
