import React from "react";
import { getProducts } from "@/lib/supabase/products";
import ProductGrid from "@/components/ProductGrid";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Handmade Rakhis | Crafty Mind Studio",
  description: "Explore handcrafted rakhis made with love and traditional artistry by Crafty Mind Studio.",
};

export default async function RakhisCategoryPage() {
  const allProducts = await getProducts();
  const rakhiProducts = allProducts.filter((p) => p.category === "rakhis");

  return (
    <section className="pt-24 pb-12 md:pt-32 md:pb-24 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        
        {/* Category Header */}
        <div className="max-w-2xl border-b border-border-custom pb-6 md:pb-10 mb-8 md:mb-16 space-y-4">
          <span className="text-xs uppercase tracking-widest font-semibold text-accent">Collection</span>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl tracking-tight text-foreground">
            Handmade Rakhis
          </h1>
          <p className="text-foreground/75 font-sans font-light leading-relaxed text-sm sm:text-base">
            Celebrate the sacred bond of love and protection. Explore our collection of beautifully handcrafted rakhis, made with vibrant silk threads, premium beads, and hand-painted charms designed to make your celebrations truly special.
          </p>
        </div>

        {/* Product Grid */}
        <ProductGrid products={rakhiProducts} />

      </div>
    </section>
  );
}
