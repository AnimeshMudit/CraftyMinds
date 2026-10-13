"use client";

import React, { useTransition, useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SortOption, SORT_OPTIONS, getValidSortOption } from "@/lib/utils/product-sort";
import { ArrowUpDown } from "lucide-react";

interface ProductSortProps {
  currentSort: SortOption;
}

export default function ProductSort({ currentSort }: ProductSortProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // Keep a local controlled state for instant UI response while transition pending
  const [selectedSort, setSelectedSort] = useState<SortOption>(currentSort);

  // Synchronize when currentSort prop or searchParams change (e.g. browser back/forward)
  useEffect(() => {
    const fromQuery = searchParams?.get("sort");
    if (fromQuery !== null && fromQuery !== undefined) {
      setSelectedSort(getValidSortOption(fromQuery));
    } else {
      setSelectedSort(currentSort);
    }
  }, [currentSort, searchParams]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextSort = getValidSortOption(e.target.value);
    setSelectedSort(nextSort);

    const params = new URLSearchParams(searchParams ? searchParams.toString() : "");
    params.set("sort", nextSort);

    const query = params.toString();
    const targetUrl = query ? `${pathname}?${query}` : pathname;

    startTransition(() => {
      router.replace(targetUrl, { scroll: false });
    });
  };

  return (
    <div className="flex items-center gap-2.5">
      <label
        htmlFor="product-sort-select"
        className="text-[11px] md:text-xs uppercase tracking-widest font-semibold text-foreground/70 flex items-center gap-1.5 shrink-0"
      >
        <ArrowUpDown size={13} className="text-accent" aria-hidden="true" />
        <span>Sort by</span>
      </label>
      <div className="relative">
        <select
          id="product-sort-select"
          value={selectedSort}
          onChange={handleSortChange}
          aria-label="Sort products by"
          className="appearance-none bg-white border border-border-custom rounded-lg pl-3 pr-8 py-1.5 text-xs md:text-sm font-sans text-foreground/85 hover:text-foreground hover:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all cursor-pointer shadow-2xs"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {/* Custom Chevron Indicator */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-foreground/50">
          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
