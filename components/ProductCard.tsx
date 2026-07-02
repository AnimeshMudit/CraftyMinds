"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Product } from "@/types/product";
import { Eye } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="group flex flex-col bg-white rounded-2xl border border-border-custom overflow-hidden shadow-xs hover:shadow-md transition-all duration-300"
    >
      
      {/* Product Image Frame - Large aspect ratio for focus */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-background">
        
        {/* Customization Badge */}
        {product.customizable && (
          <span className="absolute top-4 left-4 z-10 text-[8px] uppercase tracking-widest bg-accent-secondary/90 text-white font-medium px-2.5 py-1 rounded-sm shadow-xs">
            Customizable
          </span>
        )}

        <Image
          src={product.image_url}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-104"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Hover Quick actions overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Link
            href={`/product/${product.id}`}
            className="w-10 h-10 rounded-full bg-white text-foreground flex items-center justify-center hover:bg-accent hover:text-white transition-all duration-300 shadow-md transform translate-y-2 group-hover:translate-y-0"
            aria-label="View Details"
          >
            <Eye size={16} />
          </Link>
        </div>

      </div>

      {/* Product Text Details */}
      <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
        
        <div className="space-y-2">
          {/* Handcrafted Badge */}
          <div className="flex items-center justify-between">
            <span className="inline-block text-[9px] uppercase tracking-widest bg-accent/5 text-accent font-semibold px-2 py-0.5 rounded-sm">
              Handcrafted
            </span>
            <span className="font-serif text-base font-semibold text-foreground">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
          </div>

          <h3 className="font-serif text-lg tracking-wide text-foreground group-hover:text-accent transition-colors duration-300 line-clamp-1 pt-1">
            <Link href={`/product/${product.id}`}>{product.title}</Link>
          </h3>
        </div>

        {/* View Details Button */}
        <Link
          href={`/product/${product.id}`}
          className="w-full text-center py-2.5 border border-border-custom bg-white hover:bg-accent hover:border-accent hover:text-white text-[10px] uppercase tracking-widest font-semibold text-foreground/80 rounded-xl transition-all duration-300"
        >
          View Details
        </Link>
      </div>

    </motion.div>
  );
}
