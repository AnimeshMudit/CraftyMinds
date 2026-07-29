"use client";

import React, { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { Product } from "@/types/product";
import { ShoppingBag, Check, MessageCircle } from "lucide-react";
import QuantitySelector from "./Cart/QuantitySelector";
import { getProductWhatsAppLink } from "@/lib/contact";

interface ProductPurchaseSectionProps {
  product: Product;
}

export default function ProductPurchaseSection({ product }: ProductPurchaseSectionProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = () => {
    if (isAdding || isAdded) return;
    setIsAdding(true);
    setTimeout(() => {
      addToCart(product, quantity);
      setIsAdding(false);
      setIsAdded(true);
      setTimeout(() => {
        setIsAdded(false);
      }, 2000);
    }, 400);
  };

  return (
    <div className="space-y-4">
      {/* Quantity Selector and Add to Cart Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4">
        {/* Quantity control */}
        <div className="flex flex-col gap-2 shrink-0">
          <span className="text-[10px] uppercase tracking-widest text-foreground/50 font-semibold font-sans">
            Quantity
          </span>
          <QuantitySelector
            quantity={quantity}
            onDecrease={handleDecrease}
            onIncrease={handleIncrease}
          />
        </div>

        {/* Add to Cart button */}
        <div className="flex-grow">
          <button
            onClick={handleAddToCart}
            disabled={isAdding || isAdded}
            className={`w-full flex items-center justify-center gap-2.5 py-3 md:py-4 rounded-full font-semibold uppercase tracking-widest text-xs transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer ${
              isAdded
                ? "bg-accent-secondary text-white hover:bg-accent-secondary/90"
                : "bg-foreground text-white hover:bg-foreground/90 hover:-translate-y-0.5"
            } ${isAdding ? "opacity-80 cursor-not-allowed" : ""}`}
          >
            {isAdding ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                <span>Adding...</span>
              </>
            ) : isAdded ? (
              <>
                <Check size={16} />
                <span>Added to Cart</span>
              </>
            ) : (
              <>
                <ShoppingBag size={16} />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Ask on WhatsApp CTA */}
      <a
        href={getProductWhatsAppLink(product.title)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Ask about "${product.title}" on WhatsApp`}
        className="w-full flex items-center justify-center gap-2.5 py-3 md:py-4 rounded-full border border-border-custom hover:border-accent/40 text-foreground/80 hover:text-accent font-semibold uppercase tracking-widest text-xs transition-all duration-300 shadow-xs hover:shadow-sm cursor-pointer text-center bg-white"
      >
        <MessageCircle size={16} className="text-[#25D366] transition-transform duration-300 hover:scale-110" />
        <span>Ask on WhatsApp</span>
      </a>
    </div>
  );
}
