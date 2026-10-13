import React, { Suspense } from "react";
import { getProductsServer } from "@/lib/supabase/products-server";
import ProductGrid from "@/components/ProductGrid";
import ProductSort from "@/components/ProductSort";
import { ProductCardSkeleton } from "@/components/Skeletons";
import { SortOption, getValidSortOption, sortProducts } from "@/lib/utils/product-sort";

import { getCanonicalUrl, siteConfig } from "@/lib/seo";
import { generateBreadcrumbSchema } from "@/lib/schema";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Handmade Rakhis",
  description: "Explore a curated collection of handcrafted rakhis made with premium silk threads, delicate beads, crochet details, and hand-painted centerpiece charms.",
  alternates: {
    canonical: getCanonicalUrl("/rakhis"),
  },
  openGraph: {
    type: "website",
    url: getCanonicalUrl("/rakhis"),
    title: "Handmade Rakhis | Crafty Mind Studio",
    description: "Explore a curated collection of handcrafted rakhis made with premium silk threads, delicate beads, crochet details, and hand-painted centerpiece charms.",
  },
};

interface CategoryPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function RakhisCategoryPage({ searchParams }: CategoryPageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const currentSort = getValidSortOption(resolvedParams?.sort);

  const breadcrumbsSchema = generateBreadcrumbSchema([
    { name: "Home", item: siteConfig.url },
    { name: "Handmade Rakhis", item: `${siteConfig.url}/rakhis` },
  ]);

  return (
    <section className="pt-24 pb-12 md:pt-32 md:pb-24 min-h-screen bg-background">
      {/* Breadcrumb JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
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

        {/* Toolbar: Sort */}
        <div className="flex items-center justify-end mb-6 md:mb-8">
          <ProductSort currentSort={currentSort} />
        </div>

        {/* Product Grid inside Suspense */}
        <Suspense fallback={
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-10">
            {Array.from({ length: 6 }).map((_, idx) => (
              <ProductCardSkeleton key={idx} />
            ))}
          </div>
        }>
          <RakhisProductsContent sort={currentSort} />
        </Suspense>

      </div>
    </section>
  );
}

async function RakhisProductsContent({ sort }: { sort: SortOption }) {
  const allProducts = await getProductsServer();
  const rakhiProducts = allProducts.filter((p) => p.category === "rakhis");
  const sortedProducts = sortProducts(rakhiProducts, sort);
  return <ProductGrid products={sortedProducts} />;
}
