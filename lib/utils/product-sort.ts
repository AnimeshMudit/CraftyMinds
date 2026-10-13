import { Product } from "@/types/product";

export type SortOption = "newest" | "featured" | "price_asc" | "price_desc" | "title_asc";

export const DEFAULT_SORT: SortOption = "newest";

export interface SortOptionItem {
  value: SortOption;
  label: string;
}

export const SORT_OPTIONS: SortOptionItem[] = [
  { value: "newest", label: "Newest first" },
  { value: "featured", label: "Featured first" },
  { value: "price_asc", label: "Price: Low to high" },
  { value: "price_desc", label: "Price: High to low" },
  { value: "title_asc", label: "Name: A–Z" },
];

const VALID_SORT_SET = new Set<string>(SORT_OPTIONS.map((opt) => opt.value));

/**
 * Validates whether a given value is a known SortOption.
 */
export function isValidSortOption(value: unknown): value is SortOption {
  return typeof value === "string" && VALID_SORT_SET.has(value);
}

/**
 * Returns a valid SortOption, falling back to DEFAULT_SORT ("newest") if missing or invalid.
 */
export function getValidSortOption(value: unknown): SortOption {
  if (isValidSortOption(value)) {
    return value;
  }
  return DEFAULT_SORT;
}

/**
 * Deterministic comparator for created_at descending.
 * Uses ISO date parsing with id as secondary tie-breaker.
 */
function compareCreatedAtDesc(a: Product, b: Product): number {
  const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
  const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
  if (timeB !== timeA) {
    return timeB - timeA;
  }
  const idA = a.id ?? "";
  const idB = b.id ?? "";
  return idA.localeCompare(idB);
}

/**
 * Sorts an array of products deterministically based on the chosen sort option.
 * Returns a new array without mutating the input array.
 */
export function sortProducts(products: Product[], sort: SortOption): Product[] {
  if (!Array.isArray(products) || products.length <= 1) {
    return products ? [...products] : [];
  }

  const items = [...products];

  switch (sort) {
    case "featured":
      return items.sort((a, b) => {
        const featA = a.featured ? 1 : 0;
        const featB = b.featured ? 1 : 0;
        if (featB !== featA) {
          return featB - featA; // featured (1) before standard (0)
        }
        return compareCreatedAtDesc(a, b);
      });

    case "price_asc":
      return items.sort((a, b) => {
        const priceA = typeof a.price === "number" && !isNaN(a.price) ? a.price : 0;
        const priceB = typeof b.price === "number" && !isNaN(b.price) ? b.price : 0;
        if (priceA !== priceB) {
          return priceA - priceB;
        }
        return compareCreatedAtDesc(a, b);
      });

    case "price_desc":
      return items.sort((a, b) => {
        const priceA = typeof a.price === "number" && !isNaN(a.price) ? a.price : 0;
        const priceB = typeof b.price === "number" && !isNaN(b.price) ? b.price : 0;
        if (priceB !== priceA) {
          return priceB - priceA;
        }
        return compareCreatedAtDesc(a, b);
      });

    case "title_asc":
      return items.sort((a, b) => {
        const titleA = (a.title ?? "").trim();
        const titleB = (b.title ?? "").trim();
        const titleComparison = titleA.localeCompare(titleB, undefined, { sensitivity: "base" });
        if (titleComparison !== 0) {
          return titleComparison;
        }
        return compareCreatedAtDesc(a, b);
      });

    case "newest":
    default:
      return items.sort(compareCreatedAtDesc);
  }
}
