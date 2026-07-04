import React from "react";
import Link from "next/link";
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
    <section className="pt-24 pb-12 md:pt-32 md:pb-24 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        
        {/* Category Header */}
        <div className="max-w-2xl border-b border-border-custom pb-6 md:pb-10 mb-8 md:mb-16 space-y-4">
          <span className="text-xs uppercase tracking-widest font-semibold text-accent">Collection</span>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl tracking-tight text-foreground">
            MDF Board Arts
          </h1>
          <p className="text-foreground/75 font-sans font-light leading-relaxed text-sm sm:text-base">
            Detailed, hand-painted wooden panels and circular plates styled with folk motifs, celestial art, and mandalas. Every stroke is painted with love and sealed for a premium gloss finish.
          </p>
        </div>

        {/* Category Navigation Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar scrollbar-none">
          <Link
            href="/"
            className="shrink-0 px-4 py-2 rounded-full text-[10px] uppercase tracking-wider font-semibold border bg-white border-border-custom text-foreground/75 hover:border-foreground/30 transition-all duration-300"
          >
            All Collections
          </Link>
          <Link
            href="/mdf"
            className="shrink-0 px-4 py-2 rounded-full text-[10px] uppercase tracking-wider font-semibold border bg-accent border-accent text-white transition-all duration-300"
          >
            MDF Arts
          </Link>
          <Link
            href="/pouches"
            className="shrink-0 px-4 py-2 rounded-full text-[10px] uppercase tracking-wider font-semibold border bg-white border-border-custom text-foreground/75 hover:border-foreground/30 transition-all duration-300"
          >
            Pouches
          </Link>
          <Link
            href="/magnets"
            className="shrink-0 px-4 py-2 rounded-full text-[10px] uppercase tracking-wider font-semibold border bg-white border-border-custom text-foreground/75 hover:border-foreground/30 transition-all duration-300"
          >
            Magnets
          </Link>
        </div>

        {/* Product Grid */}
        <ProductGrid products={mdfProducts} />

      </div>
    </section>
  );
}
