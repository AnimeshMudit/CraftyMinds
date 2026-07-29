import React, { Suspense } from "react";
import { getProductsServer } from "@/lib/supabase/products-server";
import ProductGrid from "@/components/ProductGrid";
import { ProductCardSkeleton } from "@/components/Skeletons";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "MDF Board Arts | Crafty Mind Studio",
  description: "Browse our collection of hand-painted wood plates, intricate mandalas, and bohemian geometric signs.",
};

export default function MdfCategoryPage() {
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

        {/* Product Grid inside Suspense */}
        <Suspense fallback={
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-10">
            {Array.from({ length: 6 }).map((_, idx) => (
              <ProductCardSkeleton key={idx} />
            ))}
          </div>
        }>
          <MdfProductsContent />
        </Suspense>

      </div>
    </section>
  );
}

async function MdfProductsContent() {
  const allProducts = await getProductsServer();
  const mdfProducts = allProducts.filter((p) => p.category === "mdf");
  return <ProductGrid products={mdfProducts} />;
}
