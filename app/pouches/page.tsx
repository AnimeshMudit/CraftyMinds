import React from "react";
import { getProducts } from "@/lib/supabase/products";
import ProductGrid from "@/components/ProductGrid";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Handmade Pouches | Crafty Mind Studio",
  description: "Browse our collection of hand-stitched quilted cotton pouches, linen makeup bags, and tech organizers.",
};

export default async function PouchesCategoryPage() {
  const allProducts = await getProducts();
  const pouchProducts = allProducts.filter((p) => p.category === "pouch");

  return (
    <section className="pt-24 pb-12 md:pt-32 md:pb-24 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        
        {/* Category Header */}
        <div className="max-w-2xl border-b border-border-custom pb-6 md:pb-10 mb-8 md:mb-16 space-y-4">
          <span className="text-xs uppercase tracking-widest font-semibold text-accent">Collection</span>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl tracking-tight text-foreground">
            Handmade Pouches
          </h1>
          <p className="text-foreground/75 font-sans font-light leading-relaxed text-sm sm:text-base">
            Quilted utility bags, cosmetic cases, and linen organizers, individually cut, hand-sewn, and finished with sturdy zippers. Crafted using beautiful indigo block prints and intricate hand embroideries.
          </p>
        </div>

        {/* Product Grid */}
        <ProductGrid products={pouchProducts} />

      </div>
    </section>
  );
}
