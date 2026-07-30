import { Product } from "@/types/product";
import { siteConfig } from "./seo";
import { contactConfig } from "./contact";

/**
 * Generates schema.org Product structured data markup.
 */
export function generateProductSchema(product: Product) {
  const cleanDescription = product.description || `Buy ${product.title} from Crafty Mind Studio. Handcrafted, high-quality, and hand-painted in India.`;
  
  return {
    "@context": "https://schema.org" as const,
    "@type": "Product" as const,
    "name": product.title,
    "image": product.image_url,
    "description": cleanDescription,
    "brand": {
      "@type": "Brand" as const,
      "name": siteConfig.brandName,
    },
    "offers": {
      "@type": "Offer" as const,
      "url": `${siteConfig.url}/product/${product.id}`,
      "priceCurrency": "INR",
      "price": product.price,
      "availability": "https://schema.org/InStock" as const,
      "itemCondition": "https://schema.org/NewCondition" as const,
    },
    "category": product.category,
  };
}

/**
 * Generates schema.org Organization structured data markup.
 */
export function generateOrganizationSchema() {
  const socialLinks = [
    contactConfig.instagramUrl,
  ].filter(Boolean);

  return {
    "@context": "https://schema.org" as const,
    "@type": "Organization" as const,
    "name": siteConfig.brandName,
    "url": siteConfig.url,
    "logo": siteConfig.defaultOgImage,
    "sameAs": socialLinks,
    "contactPoint": {
      "@type": "ContactPoint" as const,
      "telephone": contactConfig.whatsAppDisplay,
      "contactType": "customer support",
      "email": contactConfig.supportEmail,
    }
  };
}

/**
 * Generates schema.org WebSite structured data markup.
 */
export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org" as const,
    "@type": "WebSite" as const,
    "name": siteConfig.name,
    "url": siteConfig.url,
  };
}

/**
 * Generates schema.org BreadcrumbList structured data markup.
 */
export function generateBreadcrumbSchema(items: { name: string; item: string }[]) {
  return {
    "@context": "https://schema.org" as const,
    "@type": "BreadcrumbList" as const,
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem" as const,
      "position": index + 1,
      "name": item.name,
      "item": item.item,
    })),
  };
}
