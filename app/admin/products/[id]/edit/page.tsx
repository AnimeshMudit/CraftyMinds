import React from "react";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/supabase/products";
import EditProductFormClient from "./EditProductFormClient";

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit Product | Crafty Minds Admin",
  description: "Update product features, price, description and replace image.",
};

export default async function AdminEditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return <EditProductFormClient product={product} />;
}
