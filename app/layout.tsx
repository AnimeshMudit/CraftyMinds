import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { CartProvider } from "@/context/CartContext";
import { CustomerAuthProvider } from "@/context/CustomerAuthContext";
import { siteConfig } from "@/lib/seo";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.defaultTitle,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.defaultDescription,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.author.name, url: siteConfig.author.url }],
  creator: siteConfig.author.name,
  publisher: siteConfig.brandName,
  category: "Shopping",
  keywords: siteConfig.keywords,
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.defaultTitle,
    description: siteConfig.defaultDescription,
    images: [
      {
        url: siteConfig.defaultOgImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - Handcrafted Wood Art and Pouches`,
      },
    ],
  },
  twitter: {
    card: siteConfig.twitterCard,
    title: siteConfig.defaultTitle,
    description: siteConfig.defaultDescription,
    images: [siteConfig.defaultOgImage],
  },
};

import { generateOrganizationSchema, generateWebsiteSchema } from "@/lib/schema";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  }>) {
  const orgSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();

  return (
    <html lang="en" className={`scroll-smooth ${inter.variable} ${cormorant.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body
        className="antialiased bg-background text-foreground min-h-screen flex flex-col font-sans"
        suppressHydrationWarning
      >
        <CustomerAuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
            <FloatingWhatsApp />
          </CartProvider>
        </CustomerAuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
