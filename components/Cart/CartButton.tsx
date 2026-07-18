"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";

interface CartButtonProps {
  className?: string;
}

export default function CartButton({ className = "" }: CartButtonProps) {
  const { cartCount, isLoaded } = useCart();

  return (
    <Link
      href="/cart"
      className={`relative p-2.5 text-foreground/80 hover:text-accent transition-colors duration-300 flex items-center justify-center cursor-pointer ${className}`}
      aria-label="View Shopping Cart"
    >
      <ShoppingCart size={22} className="md:w-[24px] md:h-[24px]" />
      {isLoaded && cartCount > 0 && (
        <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-accent text-white text-[9px] md:text-[10px] font-bold rounded-full flex items-center justify-center px-1 font-sans">
          {cartCount}
        </span>
      )}
    </Link>
  );
}
