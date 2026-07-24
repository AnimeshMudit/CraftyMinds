"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Order } from "@/types/order";
import { 
  Search, 
  Calendar, 
  PhoneCall, 
  AlertCircle, 
  Check,
  ClipboardList
} from "lucide-react";
import { useCustomerAuth } from "@/context/CustomerAuthContext";

export default function TrackOrderPage() {
  const { user, isLoading } = useCustomerAuth();
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);

  // Form submission handler
  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (orderNumber.trim() === "" || email.trim() === "") {
      setErrorMsg("Please enter both Order Number and Email Address.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderNumber: orderNumber.trim(),
          email: email.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Order not found.");
      }

      setOrder(data.order);
    } catch (err) {
      console.error("Tracking lookup error:", err);
      setErrorMsg("We couldn't find an order matching those details. Please check and try again.");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  // Reset tracking state to perform a new search
  const handleTrackAnother = () => {
    setOrder(null);
    setOrderNumber("");
    setEmail("");
    setErrorMsg(null);
  };

  // Formatting helper for Date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Timeline Step Helper
  const getTimelineSteps = (ord: Order) => {
    const isPaid = ord.payment_status === "paid";
    const status = ord.order_status;

    return [
      {
        title: "Order Confirmed",
        description: "Order registered in our system",
        isCompleted: true, // Always true since they have a valid order
        isActive: status === "pending" && !isPaid,
      },
      {
        title: "Payment Received",
        description: "Transaction verified successfully",
        isCompleted: isPaid,
        isActive: status === "pending" && isPaid,
      },
      {
        title: "Processing",
        description: "Our artists are preparing your handmade creations",
        isCompleted: ["processing", "shipped", "delivered"].includes(status),
        isActive: status === "processing",
      },
      {
        title: "Shipped",
        description: "Package is in transit with our logistics partner",
        isCompleted: ["shipped", "delivered"].includes(status),
        isActive: status === "shipped",
      },
      {
        title: "Delivered",
        description: "Handed over to recipient successfully",
        isCompleted: status === "delivered",
        isActive: status === "delivered",
      }
    ];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 bg-background animate-pulse">
        <div className="w-12 h-12 rounded-full bg-border-custom/50 mx-auto" />
        <div className="h-4 w-32 bg-border-custom/50 rounded mx-auto mt-4" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50/50 pt-28 pb-16 font-sans text-slate-800 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-3xl border border-slate-200/85 p-8 text-center shadow-xs space-y-6 font-sans">
          <div className="w-16 h-16 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto">
            <AlertCircle size={32} />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-semibold text-slate-800">Sign In Required</h2>
            <p className="text-slate-500 text-sm font-sans font-light">
              You must be logged in to track your orders. Sign in to view and track your purchase history.
            </p>
          </div>
          <Link
            href="/login?next=/track-order"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-accent hover:bg-accent/90 text-white font-medium rounded-full text-sm transition-all shadow-xs hover:shadow-md cursor-pointer"
          >
            Sign In to Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pt-28 pb-16 font-sans text-slate-800">
      <div className="max-w-3xl mx-auto px-4 space-y-8">
        
        {/* If Order is Loaded, show tracking results screen */}
        {order ? (
          <div className="space-y-8 animate-fadeIn">
            {/* Header info block */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/85 shadow-xs">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tracking Order</span>
                <h1 className="font-serif text-2xl font-semibold text-slate-900">{order.order_number}</h1>
                <p className="text-xs text-slate-500 font-light flex items-center gap-1.5 mt-0.5">
                  <Calendar size={13} className="text-slate-400" />
                  Ordered on {formatDate(order.created_at)}
                </p>
              </div>

              {/* Status Badges */}
              <div className="flex items-center gap-2">
                {order.payment_status === "paid" && (
                  <span className="inline-flex items-center text-[9px] font-bold tracking-wide uppercase px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                    Paid
                  </span>
                )}
                {order.payment_status === "pending" && (
                  <span className="inline-flex items-center text-[9px] font-bold tracking-wide uppercase px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/50">
                    Pending
                  </span>
                )}
                {order.payment_status === "failed" && (
                  <span className="inline-flex items-center text-[9px] font-bold tracking-wide uppercase px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200/50">
                    Failed
                  </span>
                )}
                {order.payment_status === "expired" && (
                  <span className="inline-flex items-center text-[9px] font-bold tracking-wide uppercase px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200/50">
                    Expired
                  </span>
                )}
                <span className="inline-flex items-center text-[9px] font-bold tracking-wide uppercase px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/50 capitalize">
                  {order.order_status}
                </span>
              </div>
            </div>

            {/* Visual Timeline Section */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/85 shadow-xs space-y-6">
              <h3 className="font-serif text-lg font-semibold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <ClipboardList size={18} className="text-accent" />
                Delivery Timeline
              </h3>

              {/* Responsive Timeline Grid */}
              <div className="relative pl-6 md:pl-0 md:grid md:grid-cols-5 gap-4">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-[18px] left-[10%] right-[10%] h-[2px] bg-slate-100 -z-1" />

                {/* Connecting Line (Mobile) */}
                <div className="md:hidden absolute top-[10px] bottom-[10px] left-[7px] w-[2px] bg-slate-100" />

                {getTimelineSteps(order).map((step, index) => {
                  let bubbleClass = "bg-slate-100 text-slate-400";
                  let textClass = "text-slate-500 font-light";
                  let titleClass = "text-slate-800 font-medium";

                  if (step.isCompleted) {
                    bubbleClass = "bg-emerald-500 text-white shadow-xs";
                    titleClass = "text-slate-800 font-semibold";
                  } else if (step.isActive) {
                    bubbleClass = "bg-accent text-white ring-4 ring-accent/20";
                    titleClass = "text-accent font-bold";
                    textClass = "text-slate-700 font-medium";
                  }

                  return (
                    <div 
                      key={`step-${index}`}
                      className="relative flex md:flex-col items-start md:items-center text-left md:text-center pb-6 md:pb-0 gap-4 md:gap-3"
                    >
                      {/* Status Bubble indicator */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 z-10 transition-all ${bubbleClass}`}>
                        {step.isCompleted ? <Check size={14} /> : <span>{index + 1}</span>}
                      </div>

                      {/* Details block */}
                      <div className="space-y-0.5 mt-0.5 md:mt-0 font-sans">
                        <h4 className={`text-xs md:text-sm ${titleClass}`}>{step.title}</h4>
                        <p className={`text-[10px] md:text-xs leading-normal ${textClass}`}>{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Customer & Shipping Grid */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                {/* Customer block */}
                <div className="space-y-4">
                  <h4 className="font-serif text-base font-semibold text-slate-900">Customer details</h4>
                  <div className="space-y-2 text-sm text-slate-600 font-sans">
                    <p className="font-semibold text-slate-800">{order.customer_name}</p>
                    <p>Email: {order.email}</p>
                    <p>Phone: {order.phone}</p>
                  </div>
                </div>

                {/* Shipping destination */}
                <div className="space-y-4 pt-6 md:pt-0 md:pl-8">
                  <h4 className="font-serif text-base font-semibold text-slate-900">Shipping destination</h4>
                  <div className="space-y-1.5 text-sm text-slate-700 font-sans">
                    <p className="font-medium text-slate-800">{order.house_flat}, {order.street}</p>
                    {order.landmark && <p className="text-slate-500 italic text-xs">Landmark: {order.landmark}</p>}
                    <p>{order.city}, {order.state} - {order.pin_code}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Purchased Items block */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 md:p-8 space-y-6">
              <h3 className="font-serif text-lg font-semibold text-slate-900 border-b border-slate-100 pb-3">
                Ordered Items
              </h3>
              <div className="divide-y divide-slate-100 font-sans">
                {order.items.map((item, index) => {
                  const lineTotal = item.product.price * item.quantity;
                  return (
                    <div key={`confirm-item-${index}`} className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shrink-0">
                          <Image
                            src={item.product.image_url}
                            alt={item.product.title}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-semibold text-sm text-slate-800 line-clamp-1">{item.product.title}</h4>
                          <p className="text-xs text-slate-400 capitalize">Category: {item.product.category}</p>
                          <p className="text-xs text-slate-500 font-medium">Qty: {item.quantity} × ₹{item.product.price.toLocaleString("en-IN")}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-sm text-slate-900">₹{lineTotal.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Subtotal totals Summary card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 md:p-8 space-y-4">
              <div className="space-y-2 text-sm text-slate-600 font-sans">
                <div className="flex justify-between items-center">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-800">₹{order.subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <span>Delivery Charges</span>
                    <span className="text-slate-500 font-semibold text-xs italic">Calculated after confirmation</span>
                  </div>
                  <p className="text-[11px] text-slate-500 italic leading-normal text-right">
                    Shipping charges depend on your delivery location and will be shared with you via email or your registered phone number after order confirmation.
                  </p>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                <span className="font-serif text-base font-semibold text-slate-900">Grand Total</span>
                <span className="font-serif text-xl font-bold text-slate-900">₹{order.total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Help / Contact Section */}
            <div className="text-center space-y-4 p-8 bg-slate-50 border border-slate-200 rounded-3xl">
              <p className="text-sm text-slate-500">Need help with your order or fulfillment details?</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={handleTrackAnother}
                  className="w-full sm:w-auto px-6 py-3 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider rounded-full transition-all cursor-pointer"
                >
                  Track Another Order
                </button>
                <Link
                  href="/#contact"
                  className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-accent hover:bg-accent/90 text-white text-xs font-semibold uppercase tracking-wider rounded-full shadow-xs hover:shadow-md transition-all"
                >
                  <PhoneCall size={14} />
                  <span>Contact Us</span>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Search form interface */
          <div className="max-w-md mx-auto bg-white rounded-3xl border border-slate-200/85 p-6 md:p-8 shadow-xs space-y-6">
            <div className="text-center space-y-2">
              <h1 className="font-serif text-2xl md:text-3xl font-semibold text-slate-900">Track Your Order</h1>
              <p className="font-sans text-xs text-slate-400 font-light leading-relaxed">
                Enter your Order Number and Email Address to view your order status.
              </p>
            </div>

            {errorMsg && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-2.5 text-xs text-red-700 leading-normal font-sans">
                <AlertCircle className="shrink-0 mt-0.5 text-red-500" size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleTrackSubmit} className="space-y-4 font-sans text-xs">
              {/* Order Number Field */}
              <div className="space-y-1.5">
                <label htmlFor="orderNumber" className="font-semibold text-slate-500 uppercase tracking-wider">
                  Order Number
                </label>
                <input
                  type="text"
                  id="orderNumber"
                  disabled={loading}
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="e.g. CM-1001"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed placeholder-slate-300 transition-all"
                />
              </div>

              {/* Email Address Field */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="font-semibold text-slate-500 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  disabled={loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. customer@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed placeholder-slate-300 transition-all"
                />
              </div>

              {/* Submit Trigger */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-accent hover:bg-accent/90 text-white font-semibold uppercase tracking-wider rounded-xl transition-all shadow-xs hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
                    <span>Finding Your Order...</span>
                  </>
                ) : (
                  <>
                    <Search size={15} />
                    <span>Track Order</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
