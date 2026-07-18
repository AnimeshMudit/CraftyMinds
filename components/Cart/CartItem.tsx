"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { CartItem as CartItemType } from "@/context/CartContext";
import { useCart } from "@/hooks/useCart";
import QuantitySelector from "./QuantitySelector";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;

  const handleDecrease = () => {
    updateQuantity(product.id, quantity - 1);
  };

  const handleIncrease = () => {
    updateQuantity(product.id, quantity + 1);
  };

  const lineTotal = product.price * quantity;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 py-5 border-b border-border-custom/60 last:border-b-0">
      {/* Product Image */}
      <div className="relative aspect-[3/4] w-28 sm:w-20 md:w-24 rounded-2xl overflow-hidden border border-border-custom bg-white shrink-0">
        <Image
          src={product.image_url}
          alt={product.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 112px, (max-width: 768px) 80px, 96px"
        />
      </div>

      {/* Product Info & Controls */}
      <div className="flex-grow flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full text-center sm:text-left">
        <div className="space-y-1">
          <Link
            href={`/product/${product.id}`}
            className="font-serif text-base md:text-lg font-medium text-foreground hover:text-accent transition-colors line-clamp-2 leading-tight block"
          >
            {product.title}
          </Link>
          <div className="flex items-center justify-center sm:justify-start gap-2 text-xs md:text-sm text-foreground/60 font-sans">
            <span>₹{product.price.toLocaleString("en-IN")}</span>
            <span>•</span>
            <span className="text-accent-secondary bg-accent-secondary/5 px-2 py-0.5 rounded text-[10px] md:text-xs uppercase tracking-wider font-semibold">
              {product.category === "mdf"
                ? "MDF Art"
                : product.category === "pouch"
                ? "Pouch"
                : product.category === "rakhis"
                ? "Rakhi"
                : "Magnet"}
            </span>
          </div>
        </div>

        {/* Quantity and Subtotal Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-end gap-4 sm:gap-6 md:gap-12">
          {/* Quantity Selector */}
          <QuantitySelector
            quantity={quantity}
            onDecrease={handleDecrease}
            onIncrease={handleIncrease}
          />

          {/* Line Total and Trash */}
          <div className="flex items-center gap-4 sm:min-w-[100px] justify-center sm:justify-end">
            <span className="font-serif text-base md:text-lg font-medium text-foreground">
              ₹{lineTotal.toLocaleString("en-IN")}
            </span>
            <button
              onClick={() => removeFromCart(product.id)}
              className="p-2 text-foreground/40 hover:text-red-500 hover:bg-red-50/50 rounded-xl transition-all duration-300 cursor-pointer"
              aria-label={`Remove ${product.title} from cart`}
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
