"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import CartItem from "@/components/Cart/CartItem";
import CartSummary from "@/components/Cart/CartSummary";

export default function CartPage() {
  const { cart, isLoaded, cartCount } = useCart();

  if (!isLoaded) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center pt-24 bg-background">
        <div className="animate-pulse space-y-4 text-center">
          <div className="w-12 h-12 rounded-full bg-border-custom/50 mx-auto" />
          <div className="h-4 w-32 bg-border-custom/50 rounded mx-auto" />
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <section className="pt-28 pb-16 md:pt-36 md:pb-24 bg-background min-h-[80vh] flex items-center">
        <div className="max-w-md mx-auto px-4 text-center space-y-6">
          <div className="w-20 h-20 bg-white border border-border-custom rounded-full flex items-center justify-center mx-auto shadow-xs">
            <ShoppingBag size={32} className="text-accent/60" />
          </div>
          <div className="space-y-2">
            <h1 className="font-serif text-3xl tracking-wide text-foreground">
              Your Cart is Empty
            </h1>
            <p className="text-foreground/60 text-sm font-sans font-light leading-relaxed">
              Add some of our lovingly handcrafted creations to start your collection.
            </p>
          </div>
          <div className="pt-4 space-y-3">
            <Link
              href="/"
              className="w-full block text-center py-4 rounded-full bg-accent hover:bg-accent/90 text-white font-medium uppercase tracking-widest text-xs transition-all duration-300 shadow-sm cursor-pointer"
            >
              Explore Creations
            </Link>
            <div className="grid grid-cols-2 gap-2 text-[10px] uppercase tracking-wider font-semibold font-sans pt-2">
              <Link href="/mdf" className="p-2.5 border border-border-custom rounded-xl hover:bg-white hover:text-accent transition-colors text-center cursor-pointer">
                MDF Arts
              </Link>
              <Link href="/pouches" className="p-2.5 border border-border-custom rounded-xl hover:bg-white hover:text-accent transition-colors text-center cursor-pointer">
                Pouches
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-28 pb-16 md:pt-36 md:pb-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-border-custom/50 pb-6 mb-8 md:mb-12">
          <div className="space-y-1.5">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-foreground/50 hover:text-accent font-semibold mb-2 transition-colors duration-300 group cursor-pointer"
            >
              <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
              <span>Continue Shopping</span>
            </Link>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-wide text-foreground">
              Shopping Cart
            </h1>
          </div>
          <p className="text-sm text-foreground/60 font-sans mt-2 md:mt-0">
            {cartCount} {cartCount === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-border-custom p-6 md:p-8 shadow-xs divide-y divide-border-custom/60">
            {cart.map((item) => (
              <CartItem key={item.product.id} item={item} />
            ))}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <CartSummary />
          </div>
        </div>
      </div>
    </section>
  );
}
