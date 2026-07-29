import React, { Suspense } from "react";
import { getProductsServer } from "@/lib/supabase/products-server";
import ProductGrid from "@/components/ProductGrid";
import { ProductCardSkeleton } from "@/components/Skeletons";

import { getCanonicalUrl } from "@/lib/seo";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Handmade Pouches",
  description: "Browse beautiful quilted block-print zipper pouches, cosmetic bags, and fabric organizers, hand-sewn and decorated with original hand-painted artwork.",
  alternates: {
    canonical: getCanonicalUrl("/pouches"),
  },
  openGraph: {
    type: "website",
    url: getCanonicalUrl("/pouches"),
    title: "Handmade Pouches | Crafty Mind Studio",
    description: "Browse beautiful quilted block-print zipper pouches, cosmetic bags, and fabric organizers, hand-sewn and decorated with original hand-painted artwork.",
  },
};

export default function PouchesCategoryPage() {
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

        {/* Product Grid inside Suspense */}
        <Suspense fallback={
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-10">
            {Array.from({ length: 6 }).map((_, idx) => (
              <ProductCardSkeleton key={idx} />
            ))}
          </div>
        }>
          <PouchesProductsContent />
        </Suspense>

      </div>
    </section>
  );
}

async function PouchesProductsContent() {
  const allProducts = await getProductsServer();
  const pouchProducts = allProducts.filter((p) => p.category === "pouch");
  return <ProductGrid products={pouchProducts} />;
}
