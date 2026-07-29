import React from "react";

// Individual Product Card Skeleton
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-white rounded-2xl border border-border-custom overflow-hidden shadow-xs">
      {/* Image Placeholder */}
      <div className="relative aspect-[3/4] w-full skeleton-shimmer bg-background" />

      {/* Content Area */}
      <div className="p-3 md:p-5 flex flex-col flex-grow justify-between space-y-3.5 md:space-y-4">
        <div className="space-y-2">
          {/* Badge & Price Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="h-4.5 w-16 rounded-sm skeleton-shimmer" />
            <div className="h-5.5 w-12 rounded-sm skeleton-shimmer align-self-end" />
          </div>
          {/* Title Placeholder */}
          <div className="h-5.5 md:h-7 w-3/4 rounded-md skeleton-shimmer pt-1" />
        </div>

        {/* Button Placeholder */}
        <div className="h-8 md:h-10 w-full rounded-lg md:rounded-xl skeleton-shimmer" />
      </div>
    </div>
  );
}

// Product Grid / Category Page Skeleton
export function ProductGridSkeleton({ categoryName = "Collection" }: { categoryName?: string }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 page-fade-in py-24 md:py-32">
      {/* Category Header */}
      <div className="max-w-2xl border-b border-border-custom pb-6 md:pb-10 mb-8 md:mb-16 space-y-4">
        <div className="h-4 w-20 rounded-md skeleton-shimmer" />
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl tracking-tight text-foreground">
          {categoryName === "Collection" ? (
            <div className="h-10 sm:h-14 md:h-16 w-60 rounded-lg skeleton-shimmer" />
          ) : (
            categoryName
          )}
        </h1>
        <div className="space-y-2 pt-2">
          <div className="h-4 w-full rounded-md skeleton-shimmer" />
          <div className="h-4 w-5/6 rounded-md skeleton-shimmer" />
          <div className="h-4 w-2/3 rounded-md skeleton-shimmer" />
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-10">
        {Array.from({ length: 6 }).map((_, idx) => (
          <ProductCardSkeleton key={idx} />
        ))}
      </div>
    </div>
  );
}

// Product Details Page Skeleton
export function ProductDetailsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-24 pb-12 md:pt-32 md:pb-24 page-fade-in">
      {/* Back Link Breadcrumb */}
      <div className="h-4 w-36 rounded-md skeleton-shimmer mb-6 md:mb-10" />

      {/* Product Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-20 items-start pb-10 md:pb-20 border-b border-border-custom/50">
        
        {/* Left Column: Image placeholder */}
        <div className="lg:col-span-6 w-full">
          <div className="aspect-[4/5] w-full rounded-3xl skeleton-shimmer max-h-[380px] sm:max-h-none" />
        </div>

        {/* Right Column: Metadata */}
        <div className="lg:col-span-6 flex flex-col space-y-6 md:space-y-8 w-full">
          {/* Header Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-4 w-24 rounded-md skeleton-shimmer" />
              <div className="h-4 w-24 rounded-md skeleton-shimmer" />
            </div>
            {/* Title */}
            <div className="h-10 sm:h-12 lg:h-14 w-5/6 rounded-lg skeleton-shimmer" />
            {/* Price & Made to Order badge */}
            <div className="flex items-center gap-4 pt-2">
              <div className="h-8 lg:h-10 w-24 rounded-md skeleton-shimmer" />
              <div className="h-7 w-28 rounded-md skeleton-shimmer" />
            </div>
          </div>

          {/* Customization box */}
          <div className="h-28 w-full rounded-2xl skeleton-shimmer" />

          {/* Skeletons of collapsibles */}
          <div className="space-y-4 pt-2">
            <div className="h-12 w-full rounded-xl skeleton-shimmer" />
            <div className="h-12 w-full rounded-xl skeleton-shimmer" />
            <div className="h-12 w-full rounded-xl skeleton-shimmer" />
          </div>

          {/* CTAs */}
          <div className="space-y-4 pt-4 border-t border-border-custom/50">
            <div className="flex items-center gap-4">
              <div className="h-12 w-20 rounded-xl skeleton-shimmer shrink-0" />
              <div className="h-12 w-full rounded-full skeleton-shimmer" />
            </div>
            <div className="h-12 w-full rounded-full skeleton-shimmer" />
          </div>
        </div>

      </div>
    </div>
  );
}

// Homepage Loading Skeleton
export function HomepageSkeleton() {
  return (
    <div className="space-y-16 md:space-y-24 page-fade-in pt-16">
      {/* Hero Section Placeholder */}
      <div className="w-full min-h-[70vh] md:min-h-[85vh] skeleton-shimmer flex items-center justify-center">
        <div className="max-w-3xl text-center space-y-6 px-4">
          <div className="h-5 w-28 rounded-md skeleton-shimmer mx-auto bg-white/20" />
          <div className="h-12 sm:h-16 md:h-20 w-3/4 rounded-lg skeleton-shimmer mx-auto bg-white/20" />
          <div className="h-4.5 sm:h-6 w-1/2 rounded-md skeleton-shimmer mx-auto bg-white/20" />
          <div className="h-12 w-44 rounded-full skeleton-shimmer mx-auto bg-white/20 pt-4" />
        </div>
      </div>

      {/* About Section Placeholder */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center py-12">
        <div className="aspect-[4/5] rounded-3xl skeleton-shimmer" />
        <div className="space-y-4">
          <div className="h-4.5 w-24 rounded-md skeleton-shimmer" />
          <div className="h-10 w-2/3 rounded-md skeleton-shimmer" />
          <div className="space-y-2 pt-2">
            <div className="h-4 w-full rounded-md skeleton-shimmer" />
            <div className="h-4 w-full rounded-md skeleton-shimmer" />
            <div className="h-4 w-4/5 rounded-md skeleton-shimmer" />
          </div>
        </div>
      </div>

      {/* Collections Section Placeholder */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-12">
        <div className="max-w-xl mb-12 space-y-4">
          <div className="h-4 w-28 rounded-md skeleton-shimmer" />
          <div className="h-10 w-1/2 rounded-md skeleton-shimmer" />
          <div className="h-4 w-3/4 rounded-md skeleton-shimmer" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="flex flex-col bg-white rounded-3xl border border-border-custom overflow-hidden p-6 space-y-4">
              <div className="aspect-[4/5] rounded-2xl skeleton-shimmer" />
              <div className="h-6 w-3/4 rounded-md skeleton-shimmer" />
              <div className="h-4 w-full rounded-md skeleton-shimmer" />
              <div className="h-4.5 w-20 rounded-md skeleton-shimmer" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Checkout Page Loading Skeleton
export function CheckoutSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-24 pb-12 md:pt-32 md:pb-24 page-fade-in">
      {/* Header */}
      <div className="border-b border-border-custom/50 pb-6 mb-8 md:mb-12">
        <div className="h-4 w-28 rounded-md skeleton-shimmer mb-3" />
        <div className="h-10 sm:h-12 w-64 rounded-lg skeleton-shimmer" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
        {/* Left Column - Shipping & Customer Info */}
        <div className="lg:col-span-7 space-y-8">
          {/* Customer info card */}
          <div className="bg-white rounded-3xl border border-border-custom p-6 md:p-8 space-y-6">
            <div className="h-7 w-48 rounded-md skeleton-shimmer border-b border-border-custom/60 pb-3" />
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="h-4 w-20 rounded-md skeleton-shimmer" />
                <div className="h-11 w-full rounded-xl skeleton-shimmer" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-24 rounded-md skeleton-shimmer" />
                <div className="h-11 w-full rounded-xl skeleton-shimmer" />
              </div>
            </div>
          </div>
          {/* Address card */}
          <div className="bg-white rounded-3xl border border-border-custom p-6 md:p-8 space-y-6">
            <div className="h-7 w-48 rounded-md skeleton-shimmer border-b border-border-custom/60 pb-3" />
            <div className="h-40 w-full rounded-xl skeleton-shimmer" />
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-border-custom p-6 md:p-8 space-y-6">
            <div className="h-7 w-40 rounded-md skeleton-shimmer border-b border-border-custom/60 pb-3" />
            <div className="space-y-3">
              <div className="flex gap-4 items-center">
                <div className="aspect-[3/4] w-12 rounded-lg skeleton-shimmer" />
                <div className="space-y-1.5 flex-grow">
                  <div className="h-4.5 w-32 rounded-md skeleton-shimmer" />
                  <div className="h-3.5 w-20 rounded-md skeleton-shimmer" />
                </div>
                <div className="h-4.5 w-10 rounded-md skeleton-shimmer" />
              </div>
            </div>
            <div className="border-t border-border-custom/60 pt-4 space-y-3">
              <div className="flex justify-between">
                <div className="h-4 w-16 rounded-md skeleton-shimmer" />
                <div className="h-4 w-12 rounded-md skeleton-shimmer" />
              </div>
              <div className="flex justify-between">
                <div className="h-4.5 w-24 rounded-md skeleton-shimmer" />
                <div className="h-4.5 w-16 rounded-md skeleton-shimmer" />
              </div>
            </div>
            <div className="h-12 w-full rounded-full skeleton-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Fallback Generic Page Loader
export function GenericPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-28 pb-12 min-h-screen page-fade-in flex flex-col justify-center items-center">
      <div className="space-y-6 w-full max-w-xl text-center">
        <div className="h-12 w-2/3 rounded-lg skeleton-shimmer mx-auto animate-pulse" />
        <div className="h-4 w-full rounded-md skeleton-shimmer mx-auto animate-pulse" />
        <div className="h-4 w-5/6 rounded-md skeleton-shimmer mx-auto animate-pulse" />
        <div className="h-4 w-2/3 rounded-md skeleton-shimmer mx-auto animate-pulse" />
      </div>
    </div>
  );
}
