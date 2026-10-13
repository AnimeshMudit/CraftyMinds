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
  title: "Crochet",
  description: "Beautifully handcrafted crochet creations made with love and attention to detail. Shop for amigurumi, accessories, and home decor.",
  alternates: {
    canonical: getCanonicalUrl("/crochet"),
  },
  openGraph: {
    type: "website",
    url: getCanonicalUrl("/crochet"),
    title: "Crochet | Crafty Mind Studio",
    description: "Beautifully handcrafted crochet creations made with love and attention to detail. Shop for amigurumi, accessories, and home decor.",
  },
};

interface CategoryPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CrochetCategoryPage({ searchParams }: CategoryPageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const currentSort = getValidSortOption(resolvedParams?.sort);

  const breadcrumbsSchema = generateBreadcrumbSchema([
    { name: "Home", item: siteConfig.url },
    { name: "Crochet", item: `${siteConfig.url}/crochet` },
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
            Crochet
          </h1>
          <p className="text-foreground/75 font-sans font-light leading-relaxed text-sm sm:text-base">
            Beautifully handcrafted crochet creations made with love and attention to detail. Explore our range of amigurumi, accessories, and charming home decor pieces.
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
          <CrochetProductsContent sort={currentSort} />
        </Suspense>

      </div>
    </section>
  );
}

async function CrochetProductsContent({ sort }: { sort: SortOption }) {
  const allProducts = await getProductsServer();
  const crochetProducts = allProducts.filter((p) => p.category === "crochet");
  const sortedProducts = sortProducts(crochetProducts, sort);
  return <ProductGrid products={sortedProducts} />;
}
