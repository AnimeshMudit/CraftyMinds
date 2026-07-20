import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import crypto from "crypto";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getCustomerSession } from "@/lib/auth/customer-session-server";
import { Order } from "@/types/order";
import { CheckCircle2, ShoppingBag, PhoneCall, AlertTriangle } from "lucide-react";

interface RouteParams {
  params: Promise<{ orderNumber: string }>;
}

export default async function OrderConfirmationPage({ params }: RouteParams) {
  const { orderNumber } = await params;

  let order: Order | null = null;
  let fetchError = null;

  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("order_number", orderNumber)
      .maybeSingle();

    if (error) {
      throw error;
    }

    order = data as Order | null;
  } catch (err) {
    console.error("Error fetching order in confirmation screen:", err);
    fetchError = err;
  }

  // Security Authorization Check
  let isAuthorized = false;

  if (order) {
    // 1. Try validating as a guest user using the signed cookie
    const cookieStore = await cookies();
    const guestConfirmCookie = cookieStore.get(`guest_confirm_${orderNumber}`)?.value;

    if (guestConfirmCookie) {
      const secret = process.env.CUSTOMER_SESSION_SECRET;
      if (!secret) {
        console.error(
          `[Configuration Error] CUSTOMER_SESSION_SECRET environment variable is missing on the server. Unable to verify guest confirmation signature for order ${orderNumber}.`
        );
      } else {
        const expectedSignature = crypto
          .createHmac("sha256", secret)
          .update(orderNumber)
          .digest("hex");

        const expectedBuffer = Buffer.from(expectedSignature, "utf8");
        const clientBuffer = Buffer.from(guestConfirmCookie, "utf8");

        if (expectedBuffer.length === clientBuffer.length) {
          isAuthorized = crypto.timingSafeEqual(expectedBuffer, clientBuffer);
        }
      }
    }

    // 2. If guest authorization failed, try validating as the authenticated owner of the order
    if (!isAuthorized) {
      const customerSession = await getCustomerSession();
      if (customerSession && order.user_id === customerSession.user.id) {
        isAuthorized = true;
      }
    }
  }

  // Handle empty state (order not found) or unauthorized access
  if (!order || fetchError || !isAuthorized) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center pt-24 pb-12 px-4 bg-slate-50/50 font-sans">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-12 text-center max-w-md mx-auto shadow-xs space-y-6">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
            <AlertTriangle size={32} />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-semibold text-slate-800">Order not found</h2>
            <p className="text-slate-500 text-sm font-sans font-light">
              We couldn&apos;t retrieve the details for order number <strong className="font-semibold">{orderNumber}</strong>. Please check the URL or return to home.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-accent hover:bg-accent/90 text-white font-medium rounded-full text-sm transition-all shadow-xs hover:shadow-md cursor-pointer"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(order.created_at).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <div className="min-h-screen bg-slate-50/50 pt-28 pb-16 font-sans text-slate-800">
      <div className="max-w-3xl mx-auto px-4 space-y-8">
        
        {/* Success Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 size={36} />
          </div>
          <div className="space-y-2">
            <h1 className="font-serif text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight">Order Confirmed</h1>
            <div className="max-w-md mx-auto font-sans text-slate-500 text-sm font-light leading-relaxed">
              <p>Thank you for your purchase!</p>
              <p className="mt-1">We&apos;ve received your payment and your order is now being prepared.</p>
            </div>
          </div>
        </div>

        {/* Card 1: Order Details */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 md:p-8 space-y-6">
          <h3 className="font-serif text-lg font-semibold text-slate-900 border-b border-slate-100 pb-3">
            Order Information
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-sans">
            <div className="space-y-1">
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Order Number</span>
              <p className="text-sm font-bold text-slate-800">{order.order_number}</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Order Date</span>
              <p className="text-sm font-semibold text-slate-800">{formattedDate}</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Payment Status</span>
              <div>
                <span className="inline-flex items-center text-[9px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                  Paid
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Order Status</span>
              <div>
                <span className="inline-flex items-center text-[9px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/50">
                  {order.order_status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Customer & Shipping Details */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            
            {/* Customer Details */}
            <div className="space-y-4">
              <h4 className="font-serif text-base font-semibold text-slate-900">Customer Details</h4>
              <div className="space-y-2 text-sm text-slate-600 font-sans">
                <p className="font-semibold text-slate-800">{order.customer_name}</p>
                <p>Email: {order.email}</p>
                <p>Phone: {order.phone}</p>
              </div>
            </div>

            {/* Shipping Details */}
            <div className="space-y-4 pt-6 md:pt-0 md:pl-8">
              <h4 className="font-serif text-base font-semibold text-slate-900">Shipping Address</h4>
              <div className="space-y-1.5 text-sm text-slate-700 font-sans">
                <p className="font-medium text-slate-800">{order.house_flat}, {order.street}</p>
                {order.landmark && <p className="text-slate-500 italic text-xs">Landmark: {order.landmark}</p>}
                <p>{order.city}, {order.state} - {order.pin_code}</p>
              </div>
            </div>

          </div>
        </div>

        {/* Card 3: Items Purchased */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 md:p-8 space-y-6">
          <h3 className="font-serif text-lg font-semibold text-slate-900 border-b border-slate-100 pb-3">
            Items Purchased
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

        {/* Card 4: Summary Totals */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 md:p-8 space-y-4">
          <div className="space-y-2 text-sm text-slate-600 font-sans">
            <div className="flex justify-between items-center">
              <span>Subtotal</span>
              <span className="font-medium text-slate-800">₹{order.subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Delivery Charges</span>
              <span className="text-emerald-600 font-semibold uppercase tracking-wider text-[11px]">Free</span>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
            <span className="font-serif text-base font-semibold text-slate-900">Grand Total</span>
            <span className="font-serif text-xl font-bold text-slate-900">₹{order.total.toLocaleString("en-IN")}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-accent hover:bg-accent/90 text-white text-sm font-semibold rounded-full shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <ShoppingBag size={16} />
            <span>Continue Shopping</span>
          </Link>
          <Link
            href="/#contact"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-full transition-all"
          >
            <PhoneCall size={16} />
            <span>Contact Us</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
