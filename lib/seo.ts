export const siteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.craftymindstudio.in",
  name: "Crafty Mind Studio",
  brandName: "Crafty Mind Studio",
  defaultTitle: "Crafty Mind Studio | Handcrafted with Love",
  defaultDescription: "Beautiful hand-painted MDF Board Arts, hand-painted pouches, and adorable fridge magnets. Lovingly handmade by a real artisan. Order securely on our website.",
  defaultOgImage: "https://buswdznodxyugbipflnc.supabase.co/storage/v1/object/public/product-images/1783099587508_ChatGPT_Image_Jul_3__2026__10_55_05_PM.png",
  twitterCard: "summary_large_image" as const,
  locale: "en_IN",
  keywords: [
    "handmade crafts",
    "MDF Board Art",
    "hand-painted pouches",
    "fridge magnets",
    "handmade Rakhis",
    "home decor India",
    "artisan shop",
    "handcrafted gifts",
    "personalized plaques",
    "quilted cotton pouches"
  ],
  author: {
    name: "Crafty Mind Studio Team",
    url: "https://www.craftymindstudio.in"
  }
};

/**
 * Helper to generate a standardized canonical URL for any route path.
 * Ensures consistent domain prefixes and eliminates trailing slash issues.
 */
export function getCanonicalUrl(path = "") {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  // Remove trailing slash if present (except for root homepage)
  const formattedPath = cleanPath === "/" ? "" : cleanPath.replace(/\/$/, "");
  return `${siteConfig.url}${formattedPath}`;
}
