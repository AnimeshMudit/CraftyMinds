import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/api",
        "/login",
        "/signup",
        "/forgot-password",
        "/reset-password",
        "/profile",
        "/cart",
        "/checkout",
        "/order-confirmation",
      ],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
