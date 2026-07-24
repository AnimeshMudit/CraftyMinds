"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Order } from "@/types/order";
import { 
  CheckCircle2, 
  ShoppingBag, 
  AlertTriangle, 
  Mail, 
  Truck, 
  MapPin
} from "lucide-react";
import { motion } from "framer-motion";

interface OrderConfirmationContentProps {
  orderNumber: string | undefined;
}

export default function OrderConfirmationContent({ orderNumber }: OrderConfirmationContentProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderNumber) {
      setError("No order number specified.");
      setIsLoading(false);
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`/api/customer/orders/detail?order=${orderNumber}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          setError(data.error || "Order not found.");
        } else {
          setOrder(data.order);
        }
      } catch (err) {
        console.error("Error loading order details:", err);
        setError("Unable to load order details.");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchOrderDetails();
  }, [orderNumber]);

  // Loading skeleton matching the structure of the confirmation page
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-28 pb-16 md:pt-36 md:pb-24 font-sans text-foreground">
        <div className="max-w-4xl mx-auto px-4 space-y-8 animate-pulse">
          {/* Header Skeleton */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-border-custom mx-auto" />
            <div className="h-8 bg-border-custom rounded-md w-64 mx-auto" />
            <div className="h-4 bg-border-custom rounded-md w-96 mx-auto" />
          </div>

          {/* Cards Grid Skeleton */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {/* Order Info & Items */}
              <div className="bg-card border border-border-custom rounded-3xl p-6 md:p-8 space-y-6">
                <div className="h-6 bg-border-custom rounded-md w-40" />
                <div className="space-y-3">
                  <div className="h-12 bg-border-custom/50 rounded-2xl w-full" />
                  <div className="h-12 bg-border-custom/50 rounded-2xl w-full" />
                </div>
              </div>

              {/* Shipping & Customer */}
              <div className="bg-card border border-border-custom rounded-3xl p-6 md:p-8 space-y-6">
                <div className="h-6 bg-border-custom rounded-md w-48" />
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="h-24 bg-border-custom/50 rounded-2xl" />
                  <div className="h-24 bg-border-custom/50 rounded-2xl" />
                </div>
              </div>
            </div>

            {/* Sidebar Summary Skeleton */}
            <div className="space-y-6">
              <div className="bg-card border border-border-custom rounded-3xl p-6 space-y-4">
                <div className="h-5 bg-border-custom rounded-md w-32" />
                <div className="space-y-2">
                  <div className="h-4 bg-border-custom/60 rounded-md w-full" />
                  <div className="h-4 bg-border-custom/60 rounded-md w-full" />
                  <div className="h-px bg-border-custom" />
                  <div className="h-6 bg-border-custom rounded-md w-3/4" />
                </div>
              </div>
              <div className="h-12 bg-border-custom rounded-xl w-full" />
              <div className="h-12 bg-border-custom rounded-xl w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Friendly Error Page for Order Not Found/Unauthorized
  if (error || !order) {
    return (
      <section className="min-h-[80vh] flex items-center justify-center bg-background px-4 py-24 font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-card border border-border-custom rounded-3xl p-8 md:p-12 text-center max-w-md w-full shadow-xs space-y-6"
        >
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto border border-rose-100 shadow-xs">
            <AlertTriangle size={32} />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold text-foreground">We couldn&apos;t find this order.</h2>
            <p className="text-foreground/60 text-sm font-sans font-light leading-relaxed">
              The order details are unavailable. It might be due to an invalid order number, a temporary database error, or unauthorized access.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full px-6 py-3.5 bg-accent hover:bg-accent/90 text-white text-xs uppercase tracking-widest font-semibold rounded-full shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            Return to Home
          </Link>
        </motion.div>
      </section>
    );
  }

  // Format creation date
  const orderDateText = new Date(order.created_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  return (
    <section className="min-h-screen bg-background pt-28 pb-16 md:pt-36 md:pb-24 font-sans text-foreground">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 space-y-10">
        
        {/* Success Header Area */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 10 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm"
          >
            <CheckCircle2 size={44} className="stroke-[2]" />
          </motion.div>
          
          <div className="space-y-1.5">
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground"
            >
              Order Confirmed
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-foreground/75 text-sm sm:text-base max-w-lg mx-auto font-light"
            >
              Thank you for your purchase!
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="inline-flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-foreground/60 font-sans border-t border-border-custom/50 pt-4 mt-2 w-full max-w-2xl mx-auto"
          >
            <span className="font-semibold text-foreground">Order #{order.order_number}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-foreground/20 hidden sm:inline" />
            <span className="font-medium text-emerald-600 bg-emerald-50 border border-emerald-200/50 px-3 py-0.5 rounded-full uppercase tracking-wider text-[10px]">
              {order.payment_status === "paid" ? "Paid Successfully" : "Payment Pending"}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-foreground/20 hidden sm:inline" />
            <span>Placed on {orderDateText}</span>
          </motion.div>
        </div>

        {/* Email Info Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="flex gap-4 p-5 rounded-3xl bg-white border border-border-custom shadow-2xs items-start max-w-4xl mx-auto"
        >
          <div className="p-2.5 rounded-xl bg-accent/5 text-accent shrink-0 border border-accent/10">
            <Mail size={18} />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground/50">Email Notice</p>
            <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed font-light">
              A confirmation email has been sent to your registered email address <strong>{order.email}</strong>.
            </p>
          </div>
        </motion.div>

        {/* Two-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Ordered Items (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Section 3 – Ordered Items */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-card border border-border-custom rounded-3xl p-6 md:p-8 space-y-6 shadow-2xs"
            >
              <h3 className="font-serif text-xl font-bold text-foreground border-b border-border-custom/50 pb-3 flex items-center gap-2">
                <ShoppingBag size={18} className="text-accent" />
                <span>Ordered Items</span>
              </h3>

              <div className="divide-y divide-border-custom/40 font-sans">
                {order.items.map((item, index) => {
                  const lineTotal = item.product.price * item.quantity;
                  return (
                    <div key={`item-${index}`} className="py-5 flex items-start sm:items-center justify-between gap-4 first:pt-0 last:pb-0">
                      <div className="flex items-start sm:items-center gap-4 min-w-0">
                        {item.product.image_url && (
                          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-border-custom/50 bg-background shrink-0 shadow-3xs">
                            <Image
                              src={item.product.image_url}
                              alt={item.product.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 64px, 80px"
                            />
                          </div>
                        )}
                        <div className="space-y-1 min-w-0">
                          <h4 className="font-semibold text-sm sm:text-base text-foreground truncate">{item.product.title}</h4>
                          <p className="text-xs text-accent font-medium capitalize tracking-wide">
                            {item.product.category === "mdf" 
                              ? "MDF Arts" 
                              : item.product.category === "pouch" 
                              ? "Pouches" 
                              : item.product.category === "magnet" 
                              ? "Fridge Magnets" 
                              : "Handmade Rakhis"}
                          </p>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-foreground/60">
                            <span>Qty: {item.quantity}</span>
                            <span className="text-foreground/30">•</span>
                            <span>₹{item.product.price.toLocaleString("en-IN")} each</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-serif font-bold text-base text-foreground">₹{lineTotal.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
            
          </div>

          {/* Right Column: Address, Summary, Delivery Info (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Section 2 – Delivery Address */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="bg-card border border-border-custom rounded-3xl p-6 md:p-8 space-y-4 shadow-2xs font-sans"
            >
              <h4 className="font-serif text-lg font-bold text-foreground flex items-center gap-2 border-b border-border-custom/50 pb-3">
                <MapPin size={16} className="text-accent" />
                <span>Delivery Address</span>
              </h4>
              <div className="space-y-3 text-sm text-foreground/80 leading-relaxed font-light">
                <div className="space-y-0.5">
                  <p className="text-[10px] uppercase tracking-wider text-foreground/40 font-semibold">Recipient Name</p>
                  <p className="font-semibold text-foreground text-base">{order.customer_name}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] uppercase tracking-wider text-foreground/40 font-semibold">Phone Number</p>
                  <p className="font-medium text-foreground">{order.phone}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] uppercase tracking-wider text-foreground/40 font-semibold">Street Address</p>
                  <p className="font-medium text-foreground">{order.house_flat}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] uppercase tracking-wider text-foreground/40 font-semibold">Area</p>
                  <p className="font-medium text-foreground">{order.street}</p>
                  {order.landmark && (
                    <p className="text-xs text-foreground/50 italic mt-0.5">
                      Landmark: {order.landmark}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-0.5 col-span-2">
                    <p className="text-[10px] uppercase tracking-wider text-foreground/40 font-semibold">City & State</p>
                    <p className="font-medium text-foreground">{order.city}, {order.state}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] uppercase tracking-wider text-foreground/40 font-semibold">Postal Code</p>
                    <p className="font-medium text-foreground">{order.pin_code}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Section 4 – Order Summary */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="bg-card border border-border-custom rounded-3xl p-6 md:p-8 space-y-4 shadow-2xs font-sans"
            >
              <h4 className="font-serif text-lg font-bold text-foreground border-b border-border-custom/50 pb-3">
                Order Summary
              </h4>
              
              <div className="space-y-3 text-sm text-foreground/75">
                <div className="flex justify-between items-center">
                  <span>Subtotal</span>
                  <span className="font-semibold text-foreground">₹{order.subtotal.toLocaleString("en-IN")}</span>
                </div>
                
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <span>Shipping Charges</span>
                    <span className="text-foreground/50 text-xs italic">Calculated after confirmation</span>
                  </div>
                  <p className="text-[10px] text-foreground/40 leading-normal italic font-light">
                    Will be communicated via email/mobile.
                  </p>
                </div>
                
                <div className="border-t border-border-custom/50 pt-3 flex justify-between items-center font-semibold">
                  <span className="font-serif text-base text-foreground">Total Paid</span>
                  <span className="font-serif text-lg text-accent">₹{order.total.toLocaleString("en-IN")}</span>
                </div>
                
                <div className="border-t border-border-custom/40 pt-3 space-y-2 text-xs text-foreground/60">
                  <div className="flex justify-between items-center">
                    <span>Payment Method</span>
                    <span className="font-medium text-foreground">Razorpay</span>
                  </div>
                  {order.razorpay_payment_id && (
                    <div className="flex justify-between items-center font-mono text-[10px]">
                      <span>Payment ID</span>
                      <span className="text-foreground/50">{order.razorpay_payment_id}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Section 5 – Delivery Information */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="bg-accent/5 border border-accent/10 rounded-3xl p-6 md:p-8 space-y-4 shadow-3xs font-sans text-foreground/85 leading-relaxed"
            >
              <h4 className="font-serif text-lg font-bold text-accent flex items-center gap-2 border-b border-accent/15 pb-3">
                <Truck size={18} />
                <span>Delivery Information</span>
              </h4>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-foreground/50 font-semibold">Estimated delivery</p>
                  <p className="font-bold text-accent text-base">10–12 business days</p>
                </div>
                <p className="text-xs text-foreground/75 font-light">
                  This timeline includes processing, quality checks, packaging and shipping.
                </p>
                <p className="text-xs text-foreground/65 italic font-light pt-2 border-t border-border-custom/20">
                  Shipping charges (if pending) will be communicated via your registered email address or mobile number after order confirmation.
                </p>
              </div>
            </motion.div>

          </div>

        </div>

        {/* Section 6 – Need Help? */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="bg-white border border-border-custom rounded-3xl p-8 text-center space-y-6 shadow-xs max-w-4xl mx-auto w-full font-sans"
        >
          <div className="space-y-2">
            <h4 className="font-serif text-lg font-bold text-foreground">Questions about your order?</h4>
            <p className="text-xs sm:text-sm text-foreground/60 font-light">
              We&apos;re here to help you. Reach out to us or track your shipment at any time.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/#contact"
              className="w-full sm:w-auto px-6 py-3.5 bg-white border border-border-custom hover:bg-border-custom/30 text-foreground text-xs uppercase tracking-widest font-bold rounded-full transition-all text-center shadow-3xs cursor-pointer"
            >
              Contact Us
            </Link>
            <Link
              href="/track-order"
              className="w-full sm:w-auto px-6 py-3.5 bg-white border border-border-custom hover:bg-border-custom/30 text-foreground text-xs uppercase tracking-widest font-bold rounded-full transition-all text-center shadow-3xs cursor-pointer"
            >
              Track Order
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3.5 bg-accent hover:bg-accent/90 text-white text-xs uppercase tracking-widest font-bold rounded-full transition-all text-center shadow-xs hover:shadow-md cursor-pointer"
            >
              Continue Shopping
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
