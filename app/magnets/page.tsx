import React, { Suspense } from "react";
import { getProductsServer } from "@/lib/supabase/products-server";
import ProductGrid from "@/components/ProductGrid";
import { ProductCardSkeleton } from "@/components/Skeletons";

import { getCanonicalUrl } from "@/lib/seo";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Fridge Magnets",
  description: "Browse hand-sculpted polymer clay magnets, painted wood slices with natural bark textures, and glass mandalas. Adorable details to warm up everyday spaces.",
  alternates: {
    canonical: getCanonicalUrl("/magnets"),
  },
  openGraph: {
    type: "website",
    url: getCanonicalUrl("/magnets"),
    title: "Fridge Magnets | Crafty Mind Studio",
    description: "Browse hand-sculpted polymer clay magnets, painted wood slices with natural bark textures, and glass mandalas. Adorable details to warm up everyday spaces.",
  },
};

export default function MagnetsCategoryPage() {
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

        {/* Product Grid inside Suspense */}
        <Suspense fallback={
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-10">
            {Array.from({ length: 6 }).map((_, idx) => (
              <ProductCardSkeleton key={idx} />
            ))}
          </div>
        }>
          <MagnetsProductsContent />
        </Suspense>

      </div>
    </section>
  );
}

async function MagnetsProductsContent() {
  const allProducts = await getProductsServer();
  const magnetProducts = allProducts.filter((p) => p.category === "magnet");
  return <ProductGrid products={magnetProducts} />;
}
