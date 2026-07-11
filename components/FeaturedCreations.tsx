"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { getProducts } from "@/lib/supabase/products";
import { Product } from "@/types/product";
import { ArrowUpRight } from "lucide-react";

export default function FeaturedCreations() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((products) => {
        setFeatured(products.filter((p) => p.featured).slice(0, 6));
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-white border-b border-border-custom/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="h-8 w-48 bg-gray-200 animate-pulse rounded mb-4" />
          <div className="h-12 w-96 bg-gray-200 animate-pulse rounded mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="aspect-[4/5] bg-gray-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (featured.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-white border-b border-border-custom/50">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="max-w-2xl mb-16 space-y-4">
          <span className="text-xs uppercase tracking-widest font-semibold text-accent-secondary">Featured Creations</span>
          <h2 className="font-serif text-4xl sm:text-5xl tracking-tight text-foreground">
            Handcrafted with Heart
          </h2>
          <p className="text-foreground/75 font-sans font-light leading-relaxed text-sm sm:text-base">
            A small window into our studio. Every piece is patiently hand-painted or sewn individually, making them truly one of a kind.
          </p>
        </div>

        {/* Large Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
          {featured.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="group cursor-pointer"
            >
              <Link href={`/product/${product.id}`} className="block space-y-5">
                {/* Image Box - Image First */}
                <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden border border-border-custom bg-background shadow-xs transition-shadow duration-500 group-hover:shadow-lg">
                  <Image
                    src={product.image_url}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-104"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  {/* Subtle Badge */}
                  {product.customizable && (
                    <span className="absolute top-4 left-4 z-10 text-[9px] uppercase tracking-widest bg-accent-secondary/90 text-white font-medium px-2.5 py-1 rounded-xs">
                      Customizable
                    </span>
                  )}
                  {/* Hover Overlay Arrow */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xs p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md">
                    <ArrowUpRight size={16} className="text-accent" />
                  </div>
                </div>

                {/* Text - Minimal & Elegant */}
                <div className="space-y-1.5 px-1">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-serif text-xl sm:text-2xl tracking-wide text-foreground group-hover:text-accent transition-colors duration-300">
                      {product.title}
                    </h3>
                    <span className="font-serif text-lg text-foreground/80 pl-2">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <p className="text-[10px] uppercase tracking-widest text-foreground/50 font-medium">
                    {product.category === "mdf" ? "MDF Board Art" : product.category === "pouch" ? "Hand-painted Pouch" : product.category === "rakhis" ? "Handmade Rakhi" : "Fridge Magnet"}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
