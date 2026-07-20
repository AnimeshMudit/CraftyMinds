"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Package, Loader2 } from "lucide-react";

interface CustomerOrder {
  id: string;
  order_number: string;
  customer_name: string;
  email: string;
  phone: string;
  total: number;
  subtotal: number;
  payment_status: string;
  order_status: string;
  created_at: string;
  items: Array<{ product: { title: string }; quantity: number }>;
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await fetch("/api/customer/orders");
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Unable to load orders.");
        }

        setOrders(data.orders ?? []);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load orders.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadOrders();
  }, []);

  return (
    <section className="pt-28 pb-16 md:pt-36 md:pb-24 bg-background min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 space-y-8">
        <div className="space-y-2">
          <Link href="/profile" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-foreground/50 hover:text-accent transition-colors">
            <ArrowLeft size={12} />
            Back to Profile
          </Link>
          <h1 className="font-serif text-4xl sm:text-5xl tracking-tight text-foreground">My Orders</h1>
          <p className="text-sm sm:text-base text-foreground/70 max-w-2xl">
            Only orders linked to your logged-in customer account are shown here.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-foreground/60">
            <Loader2 size={28} className="animate-spin text-accent" />
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-3xl border border-border-custom bg-white p-8 text-center shadow-xs space-y-3">
            <Package size={28} className="mx-auto text-accent" />
            <h2 className="font-serif text-2xl text-foreground">No orders yet</h2>
            <p className="text-sm text-foreground/60">When you place an order while signed in, it will appear here.</p>
            <Link href="/" className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-accent text-white text-xs uppercase tracking-wider font-semibold">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <article key={order.id} className="bg-white border border-border-custom rounded-3xl shadow-xs p-6 md:p-8 space-y-5">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-widest text-foreground/40">Order Number</p>
                    <h2 className="font-serif text-2xl text-foreground">{order.order_number}</h2>
                    <p className="text-sm text-foreground/60">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-wider font-semibold">
                    <span className="px-3 py-1.5 rounded-full bg-accent/10 text-accent">{order.payment_status}</span>
                    <span className="px-3 py-1.5 rounded-full bg-foreground/5 text-foreground/60">{order.order_status}</span>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4 text-sm text-foreground/70">
                  <div className="rounded-2xl border border-border-custom/70 bg-background/60 p-4">
                    <p className="text-xs uppercase tracking-widest text-foreground/40 mb-1">Customer</p>
                    <p className="font-medium text-foreground">{order.customer_name}</p>
                    <p>{order.email}</p>
                  </div>
                  <div className="rounded-2xl border border-border-custom/70 bg-background/60 p-4">
                    <p className="text-xs uppercase tracking-widest text-foreground/40 mb-1">Phone</p>
                    <p className="font-medium text-foreground">{order.phone}</p>
                  </div>
                  <div className="rounded-2xl border border-border-custom/70 bg-background/60 p-4">
                    <p className="text-xs uppercase tracking-widest text-foreground/40 mb-1">Total</p>
                    <p className="font-medium text-foreground">₹{order.total.toLocaleString("en-IN")}</p>
                    <p className="text-xs text-foreground/50">Subtotal ₹{order.subtotal.toLocaleString("en-IN")}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-widest text-foreground/40">Items</p>
                  <div className="divide-y divide-border-custom/60 rounded-2xl border border-border-custom/70 overflow-hidden">
                    {(order.items || []).map((item, index) => (
                      <div key={`${order.id}-${index}`} className="flex items-center justify-between gap-4 px-4 py-3 bg-white">
                        <span className="text-sm text-foreground/75">{item.product?.title ?? "Item"}</span>
                        <span className="text-xs uppercase tracking-wider text-foreground/50">Qty {item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
