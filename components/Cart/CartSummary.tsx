"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";

interface CartSummaryProps {
  showCheckoutButton?: boolean;
}

export default function CartSummary({ showCheckoutButton = true }: CartSummaryProps) {
  const { cartSubtotal } = useCart();
  
  const shipping = 0; // Free delivery
  const total = cartSubtotal + shipping;

  return (
    <div className="bg-white rounded-3xl border border-border-custom p-6 md:p-8 space-y-6 shadow-xs">
      <h3 className="font-serif text-xl md:text-2xl tracking-wide text-foreground border-b border-border-custom/60 pb-4">
        Order Summary
      </h3>

      <div className="space-y-4 font-sans text-sm">
        <div className="flex justify-between items-center text-foreground/75">
          <span>Subtotal</span>
          <span className="font-medium text-foreground">
            ₹{cartSubtotal.toLocaleString("en-IN")}
          </span>
        </div>
        
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-foreground/75">
            <span>Shipping</span>
            <span className="text-foreground/50 font-medium text-xs italic">
              Calculated after confirmation
            </span>
          </div>
          <p className="text-[11px] text-foreground/50 leading-normal italic font-light">
            Shipping charges depend on your delivery location and will be shared with you via email or your registered phone number after order confirmation.
          </p>
        </div>

        <div className="border-t border-border-custom/60 pt-4 flex justify-between items-end">
          <span className="font-serif text-lg font-medium text-foreground">Total</span>
          <div className="text-right">
            <span className="font-serif text-2xl font-semibold text-foreground">
              ₹{total.toLocaleString("en-IN")}
            </span>
            <p className="text-[10px] text-foreground/40 mt-0.5">Inclusive of all taxes</p>
          </div>
        </div>
      </div>

      {showCheckoutButton && (
        <Link
          href="/checkout"
          className="w-full block text-center py-4 rounded-full bg-accent hover:bg-accent/90 text-white font-medium uppercase tracking-widest text-xs transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
        >
          Proceed to Checkout
        </Link>
      )}
    </div>
  );
}
