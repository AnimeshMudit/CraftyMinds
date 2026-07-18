"use client";

import React, { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { Product } from "@/types/product";
import { ShoppingBag, Check } from "lucide-react";
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
    </div>
  );
}
