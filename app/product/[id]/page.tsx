import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProduct, getProducts } from "@/lib/supabase/products";
import ProductCard from "@/components/ProductCard";
import CollapsibleSection from "@/components/CollapsibleSection";
import { MessageSquare, Shield, Sparkles, RefreshCw, ChevronLeft } from "lucide-react";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function ProductDetailsPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  // Get related products from same category, excluding current product
  const allProducts = await getProducts();
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  // Generate category-specific features
  const getFeatures = (category: string) => {
    switch (category) {
      case "mdf":
        return [
          "Base Material: Premium high-density MDF wood board",
          "Paint Details: Fine artist-grade professional acrylic paint",
          "Protective Coat: Sealing gloss varnish (water-resistant, anti-fade)",
          "Hanging Hardware: Heavy-duty pre-installed wall mount hook included",
        ];
      case "pouch":
        return [
          "Exterior fabric: Quilted natural cotton or premium linen",
          "Inner structure: Fully lined with lightweight splash-resistant padding",
          "Hardware details: Smooth brass zipper with rustic leather pull tab",
          "Maintenance: Hand-wash in cold water, air dry flat",
        ];
      case "magnet":
        return [
          "Base Material: Natural pine wood slice or sculpted polymer clay",
          "Magnetic backing: Ultra-strong neodymium magnet (holds up to 4 papers)",
          "Protective finish: Glossy or matte clear glaze coat",
          "Scratch Protection: Velvet felt layer to prevent fridge scratches",
        ];
      default:
        return [
          "100% handcrafted in small batches",
          "Premium materials sourced locally",
          "Quality checked and carefully wrapped for gifting",
        ];
    }
  };

  const getCareInstructions = (category: string) => {
    switch (category) {
      case "mdf":
        return "Wipe gently with a dry or slightly damp microfiber cloth. Do not submerge in water or use harsh chemical cleaners. Keep away from direct, prolonged sunlight to prevent color fading.";
      case "pouch":
        return "Hand-wash in cold water with mild detergent. Do not wring or tumble dry. Shape and dry flat in shade. Iron on reverse side on low heat if needed.";
      case "magnet":
        return "Clean with a dry cloth. Do not drop on hard surfaces as clay or pine slices can chip. Store in a dry place away from direct moisture.";
      default:
        return "Handle with care as this is an original hand-painted creation. Clean with a soft, dry cloth. Keep away from direct moisture and water.";
    }
  };

  const features = getFeatures(product.category);
  const careInstructions = getCareInstructions(product.category);

  // Formulate WhatsApp message URL
  const waNumber = "919140194290";
  const waBaseUrl = "https://wa.me/";
  const messageText = `Hi Crafty Mind Studio! I am interested in ordering the "${product.title}" (Product ID: ${product.id}, Price: ₹${product.price}). Is it available?`;
  const whatsappUrl = `${waBaseUrl}${waNumber}?text=${encodeURIComponent(messageText)}`;

  return (
    <section className="pt-24 pb-12 md:pt-32 md:pb-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        
        {/* Back Link */}
        <Link
          href={`/${product.category}`}
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-foreground/50 hover:text-accent font-medium mb-6 md:mb-10 transition-colors duration-300 group"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to {product.category === "mdf" ? "MDF Arts" : product.category === "pouch" ? "Hand-painted Pouches" : "Fridge Magnets"}</span>
        </Link>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-20 items-start pb-10 md:pb-20 border-b border-border-custom/50">
          
          {/* Left: Product Images Frame */}
          <div className="lg:col-span-6 relative lg:sticky lg:top-28 self-start w-full">
            <div className="relative aspect-[4/5] w-full max-h-[380px] sm:max-h-none rounded-3xl overflow-hidden border border-border-custom shadow-xs bg-white group">
              <Image
                src={product.image_url}
                alt={product.title}
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-101"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Right: Product Meta Data */}
          <div className="lg:col-span-6 flex flex-col space-y-6 md:space-y-8">
            
            {/* Header info */}
            <div className="space-y-3 order-1 lg:order-1">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest text-accent font-semibold">
                  {product.category === "mdf" ? "MDF Board Art" : product.category === "pouch" ? "Hand-painted Pouch" : "Fridge Magnet"}
                </span>
                <span className="text-[9px] text-foreground/40">•</span>
                <span className="text-[10px] uppercase tracking-wider text-accent-secondary font-medium">
                  100% Handcrafted
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight text-foreground leading-[1.12]">
                {product.title}
              </h1>
              <div className="flex items-center gap-4 pt-2">
                <span className="font-serif text-2xl lg:text-3xl font-medium text-foreground">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                <span className="text-[9px] uppercase tracking-widest font-semibold text-accent-secondary bg-accent-secondary/5 px-3 py-1.5 rounded-sm">
                  Made to Order
                </span>
              </div>
            </div>

            {/* Customization Note Box */}
            {product.customizable && (
              <div className="bg-accent-secondary/5 border border-accent-secondary/10 rounded-2xl p-5 flex items-start gap-4 order-3 lg:order-2">
                <Sparkles className="text-accent-secondary shrink-0 mt-0.5" size={20} />
                <div className="space-y-1">
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-accent-secondary">Customizable Design</h4>
                  <p className="text-foreground/80 text-xs sm:text-sm font-light font-sans leading-relaxed">
                    This design is hand-painted to order. You can request custom colors, family names, dimensions, or custom inscriptions when you contact us on WhatsApp!
                  </p>
                </div>
              </div>
            )}

            {/* Story & Details (Collapsible on Mobile) */}
            <div className="order-4 lg:order-3">
              <CollapsibleSection title="Story & Details">
                <p className="text-foreground/75 text-sm sm:text-base font-light leading-relaxed font-sans">
                  {product.description}
                </p>
              </CollapsibleSection>
            </div>

            {/* Specifications (Collapsible on Mobile) */}
            <div className="order-5 lg:order-4 pt-2 lg:pt-0">
              <CollapsibleSection title="Specifications">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-foreground/70 font-light font-sans">
                  {features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CollapsibleSection>
            </div>

            {/* Care Instructions (Collapsible on Mobile) */}
            <div className="order-6 lg:order-5 pt-2 lg:pt-0">
              <CollapsibleSection title="Care Instructions">
                <p className="text-foreground/75 text-sm sm:text-base font-light leading-relaxed font-sans">
                  {careInstructions}
                </p>
              </CollapsibleSection>
            </div>

            {/* Large WhatsApp Order CTA and Trust factors grouped */}
            <div className="order-2 lg:order-6 space-y-6 pt-2 lg:pt-0">
              {/* Button */}
              <div className="space-y-4">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 py-4 lg:py-5 rounded-full bg-accent hover:bg-accent/90 text-white font-medium uppercase tracking-widest text-xs transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5"
                >
                  <MessageSquare size={18} className="text-white" />
                  <span>Place Order via WhatsApp</span>
                </a>
                <p className="text-[10px] uppercase tracking-widest text-foreground/40 text-center font-sans">
                  Secure checkout and customization details will be finalized directly in chat.
                </p>
              </div>

              {/* Trust factors */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border-custom/50 text-[10px] uppercase tracking-widest text-foreground/50 text-center font-medium font-sans">
                <div className="flex flex-col items-center gap-2">
                  <Shield size={16} className="text-accent-secondary" />
                  <span>Secure Order</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Sparkles size={16} className="text-accent-secondary" />
                  <span>Unique Art</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <RefreshCw size={16} className="text-accent-secondary" />
                  <span>Made to order</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Suggested / Related Products Section */}
        <div className="pt-12 md:pt-20 space-y-8 md:space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-widest font-semibold text-accent">Curated For You</span>
            <h2 className="font-serif text-2.5xl sm:text-3xl tracking-tight text-foreground">
              Suggested Products
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-8">
            {relatedProducts.map((relatedProd) => (
              <ProductCard key={relatedProd.id} product={relatedProd} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
