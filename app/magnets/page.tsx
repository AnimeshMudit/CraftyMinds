import React from "react";
import { getProducts } from "@/lib/supabase/products";
import ProductGrid from "@/components/ProductGrid";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Fridge Magnets | Crafty Mind Studio",
  description: "Browse our collection of hand-molded clay, painted pine slice, and wildflower resin fridge magnets.",
};

export default async function MagnetsCategoryPage() {
  const allProducts = await getProducts();
  const magnetProducts = allProducts.filter((p) => p.category === "magnet");

  return (
    <section className="pt-24 pb-12 md:pt-32 md:pb-24 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        
        {/* Category Header */}
        <div className="max-w-2xl border-b border-border-custom pb-6 md:pb-10 mb-8 md:mb-16 space-y-4">
          <span className="text-xs uppercase tracking-widest font-semibold text-accent">Collection</span>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl tracking-tight text-foreground">
            Fridge Magnets
          </h1>
          <p className="text-foreground/75 font-sans font-light leading-relaxed text-sm sm:text-base">
            Tiny details that make a house feel like home. Explore hand-sculpted polymer clay designs, painted wood-slices with natural bark textures, and glass mandalas with strong backing magnets.
          </p>
        </div>

        {/* Product Grid */}
        <ProductGrid products={magnetProducts} />

      </div>
    </section>
  );
}
