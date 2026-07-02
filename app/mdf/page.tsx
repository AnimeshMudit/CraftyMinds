import React from "react";
import { getProducts } from "@/lib/supabase/products";
import ProductGrid from "@/components/ProductGrid";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "MDF Board Arts | Crafty Mind Studio",
  description: "Browse our collection of hand-painted wood plates, intricate mandalas, and bohemian geometric signs.",
};

export default async function MdfCategoryPage() {
  const allProducts = await getProducts();
  const mdfProducts = allProducts.filter((p) => p.category === "mdf");

  return (
    <section className="pt-32 pb-24 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Category Header */}
        <div className="max-w-2xl border-b border-border-custom pb-10 mb-16 space-y-4">
          <span className="text-xs uppercase tracking-widest font-semibold text-accent">Collection</span>
          <h1 className="font-serif text-5xl md:text-6xl tracking-tight text-foreground">
            MDF Board Arts
          </h1>
          <p className="text-foreground/75 font-sans font-light leading-relaxed text-base">
            Detailed, hand-painted wooden panels and circular plates styled with folk motifs, celestial art, and mandalas. Every stroke is painted with love and sealed for a premium gloss finish.
          </p>
        </div>

        {/* Product Grid */}
        <ProductGrid products={mdfProducts} />

      </div>
    </section>
  );
}
