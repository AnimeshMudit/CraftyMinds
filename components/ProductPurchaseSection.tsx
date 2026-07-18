"use client";

import React, { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { Product } from "@/types/product";
import { MessageSquare, ShoppingBag, Check } from "lucide-react";
import QuantitySelector from "./Cart/QuantitySelector";

interface ProductPurchaseSectionProps {
  product: Product;
}

export default function ProductPurchaseSection({ product }: ProductPurchaseSectionProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
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
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const waNumber = "919140194290";
  const waBaseUrl = "https://wa.me/";
  const messageText = `Hi Crafty Mind Studio! I am interested in ordering the "${product.title}" (Product ID: ${product.id}, Price: ₹${product.price}). Is it available?`;
  const whatsappUrl = `${waBaseUrl}${waNumber}?text=${encodeURIComponent(messageText)}`;

  return (
    <div className="space-y-6">
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
            className={`w-full flex items-center justify-center gap-2.5 py-3 md:py-4 rounded-full font-semibold uppercase tracking-widest text-xs transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer ${
              isAdded
                ? "bg-accent-secondary text-white hover:bg-accent-secondary/90"
                : "bg-foreground text-white hover:bg-foreground/90 hover:-translate-y-0.5"
            }`}
          >
            {isAdded ? (
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

      {/* WhatsApp Button */}
      <div className="space-y-4">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-3 py-4 lg:py-5 rounded-full bg-accent hover:bg-accent/90 text-white font-medium uppercase tracking-widest text-xs transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
        >
          <MessageSquare size={18} className="text-white" />
          <span>Place Order via WhatsApp</span>
        </a>
        <p className="text-[10px] uppercase tracking-widest text-foreground/40 text-center font-sans">
          Instant checkout and customization details can also be finalized directly in chat.
        </p>
      </div>
    </div>
  );
}
