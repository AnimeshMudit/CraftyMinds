"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Order } from "@/types/order";
import { 
  CheckCircle2, 
  ShoppingBag, 
  UserRound, 
  AlertTriangle, 
  Mail, 
  Truck, 
  Phone, 
  MapPin, 
  CreditCard,
  Hash
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
  const orderDate = new Date(order.created_at).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });

  return (
    <section className="min-h-screen bg-background pt-28 pb-16 md:pt-36 md:pb-24 font-sans text-foreground">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 space-y-8">
        
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
          
          <div className="space-y-2">
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground"
            >
              Thank you for your order!
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-foreground/75 text-sm sm:text-base max-w-lg mx-auto font-light"
            >
              Your payment has been received successfully.
            </motion.p>
          </div>
        </div>

        {/* Email & Preparing Order Notices */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="grid sm:grid-cols-2 gap-4"
        >
          {/* Email Info Box */}
          <div className="flex gap-4 p-5 rounded-2xl bg-white border border-border-custom shadow-2xs items-start">
            <div className="p-2.5 rounded-xl bg-accent/5 text-accent shrink-0 border border-accent/10">
              <Mail size={18} />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground/50">Email Notice</p>
              <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed font-light">
                A confirmation email has been sent to your registered email address.
              </p>
            </div>
          </div>

          {/* Shipping Message */}
          <div className="flex gap-4 p-5 rounded-2xl bg-white border border-border-custom shadow-2xs items-start">
            <div className="p-2.5 rounded-xl bg-accent-secondary/5 text-accent-secondary shrink-0 border border-accent-secondary/10">
              <Truck size={18} />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground/50">Shipping Update</p>
              <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed font-light">
                We&apos;re preparing your handmade products with care. You&apos;ll receive another email once your order has been shipped.
              </p>
              <p className="text-xs text-accent font-semibold pt-1">
                Estimated delivery: 10–12 business days
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main Grid Content */}
        <div className="grid md:grid-cols-3 gap-8 items-start">
          
          {/* Left / Main Section */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Card: Order Meta Details */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-card border border-border-custom rounded-3xl p-6 md:p-8 space-y-6 shadow-2xs"
            >
              <h3 className="font-serif text-xl font-bold text-foreground border-b border-border-custom/50 pb-3 flex items-center gap-2">
                <Hash size={18} className="text-accent" />
                <span>Order Information</span>
              </h3>

              <div className="grid grid-cols-2 gap-y-6 gap-x-4 text-sm font-sans">
                <div className="space-y-1">
                  <span className="text-foreground/40 font-semibold uppercase tracking-widest text-[9px]">Order Number</span>
                  <p className="font-bold text-foreground tracking-wide">{order.order_number}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-foreground/40 font-semibold uppercase tracking-widest text-[9px]">Order Date</span>
                  <p className="font-medium text-foreground">{orderDate}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-foreground/40 font-semibold uppercase tracking-widest text-[9px]">Payment Status</span>
                  <div>
                    {order.payment_status === "paid" ? (
                      <span className="inline-flex items-center text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Paid
                      </span>
                    ) : order.payment_status === "pending" ? (
                      <span className="inline-flex items-center text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        Pending
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                        Failed
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-foreground/40 font-semibold uppercase tracking-widest text-[9px]">Payment Method</span>
                  <p className="font-medium text-foreground flex items-center gap-1.5">
                    <CreditCard size={14} className="text-foreground/50" />
                    <span>Razorpay</span>
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Card: Items Breakdown */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="bg-card border border-border-custom rounded-3xl p-6 md:p-8 space-y-6 shadow-2xs"
            >
              <h3 className="font-serif text-xl font-bold text-foreground border-b border-border-custom/50 pb-3 flex items-center gap-2">
                <ShoppingBag size={18} className="text-accent" />
                <span>Items Ordered</span>
              </h3>

              <div className="divide-y divide-border-custom/40">
                {order.items.map((item, index) => {
                  const lineTotal = item.product.price * item.quantity;
                  return (
                    <div key={`item-${index}`} className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-4">
                        {item.product.image_url && (
                          <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-border-custom/50 bg-background shrink-0 shadow-3xs">
                            <Image
                              src={item.product.image_url}
                              alt={item.product.title}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>
                        )}
                        <div className="space-y-1">
                          <h4 className="font-semibold text-sm text-foreground line-clamp-1">{item.product.title}</h4>
                          <p className="text-xs text-foreground/40 capitalize tracking-wide">Category: {item.product.category}</p>
                          <p className="text-xs text-foreground/60 font-medium">
                            {item.quantity} × ₹{item.product.price.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-sm text-foreground">₹{lineTotal.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Card: Customer & Shipping Address */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="bg-card border border-border-custom rounded-3xl p-6 md:p-8 shadow-2xs"
            >
              <div className="grid md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-border-custom/50">
                {/* Customer Info */}
                <div className="space-y-4">
                  <h4 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
                    <UserRound size={16} className="text-accent" />
                    <span>Customer Details</span>
                  </h4>
                  <div className="space-y-1 text-sm text-foreground/80 leading-relaxed font-light">
                    <p className="font-semibold text-foreground">{order.customer_name}</p>
                    <p className="flex items-center gap-1.5">
                      <Mail size={12} className="text-foreground/40" />
                      <span>{order.email}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Phone size={12} className="text-foreground/40" />
                      <span>{order.phone}</span>
                    </p>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="space-y-4 pt-6 md:pt-0 md:pl-8">
                  <h4 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
                    <MapPin size={16} className="text-accent" />
                    <span>Shipping Address</span>
                  </h4>
                  <div className="space-y-1 text-sm text-foreground/80 leading-relaxed font-light">
                    <p className="font-medium text-foreground">{order.house_flat}, {order.street}</p>
                    {order.landmark && (
                      <p className="text-foreground/50 text-xs italic">
                        Landmark: {order.landmark}
                      </p>
                    )}
                    <p>{order.city}, {order.state} - {order.pin_code}</p>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Right Sidebar Area: Totals & Quick Actions */}
          <div className="space-y-6">
            
            {/* Totals Summary */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="bg-card border border-border-custom rounded-3xl p-6 space-y-4 shadow-2xs"
            >
              <h4 className="font-serif text-lg font-bold text-foreground">Payment Summary</h4>
              <div className="space-y-2 text-sm text-foreground/70 font-sans">
                <div className="flex justify-between items-center">
                  <span>Subtotal</span>
                  <span className="font-medium text-foreground">₹{order.subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <span>Shipping</span>
                    <span className="text-foreground/50 text-xs italic">Calculated after confirmation</span>
                  </div>
                  <p className="text-[11px] text-foreground/50 leading-normal text-right">
                    Shipping charges depend on your delivery location and will be shared with you via email or your registered phone number after order confirmation.
                  </p>
                </div>
              </div>
              
              <div className="border-t border-border-custom/50 pt-4 flex justify-between items-center">
                <span className="font-serif text-base font-bold text-foreground">Grand Total</span>
                <span className="font-serif text-xl font-bold text-foreground">₹{order.total.toLocaleString("en-IN")}</span>
              </div>
            </motion.div>

            {/* Quick Actions Panel */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="flex flex-col gap-3"
            >
              <Link
                href="/"
                className="flex items-center justify-center gap-2 px-6 py-4 bg-accent hover:bg-accent/90 text-white text-xs uppercase tracking-widest font-bold rounded-full transition-all shadow-xs hover:shadow-md cursor-pointer"
              >
                <ShoppingBag size={14} />
                <span>Continue Shopping</span>
              </Link>
              <Link
                href="/my-orders"
                className="flex items-center justify-center gap-2 px-6 py-4 bg-white border border-border-custom hover:bg-border-custom/30 text-foreground text-xs uppercase tracking-widest font-bold rounded-full transition-all shadow-3xs cursor-pointer"
              >
                <UserRound size={14} />
                <span>View My Orders</span>
              </Link>
            </motion.div>

          </div>

        </div>

      </div>
    </section>
  );
}
