export const siteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://craftymindstudio.in",
  name: "Crafty Mind Studio",
  defaultTitle: "Crafty Mind Studio | Handcrafted with Love",
  defaultDescription: "Beautiful hand-painted MDF Board Arts, hand-painted pouches, and adorable fridge magnets. Lovingly handmade by a real artisan. Order securely on our website.",
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
