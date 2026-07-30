"use client";

import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Clock, 
  Users, 
  ClipboardList 
} from "lucide-react";
import RevenueChart from "@/components/admin/RevenueChart";
import BestSellingProducts from "@/components/admin/BestSellingProducts";
import CategoryPerformance from "@/components/admin/CategoryPerformance";
import RevenueSummary from "@/components/admin/RevenueSummary";
import TopCustomers from "@/components/admin/TopCustomers";
import VisitorOverview from "@/components/admin/VisitorOverview";
import TrafficSources from "@/components/admin/TrafficSources";
import DeviceBreakdown from "@/components/admin/DeviceBreakdown";
import TopPages from "@/components/admin/TopPages";
import GeoDistribution from "@/components/admin/GeoDistribution";
import ProductPerformance from "@/components/admin/ProductPerformance";
import AnalyticsTimestamp from "@/components/admin/AnalyticsTimestamp";

export default function AnalyticsClient() {
  const [analytics, setAnalytics] = useState<{
    kpis: {
      ordersToday: number;
      pendingOrders: number;
      revenueToday: number;
      visitorsToday: number | null;
    };
    revenue30Days: { date: string; revenue: number }[];
    recentOrders: {
      id: string;
      order_number: string;
      customer_name: string;
      total: number;
      order_status: string;
      payment_status: string;
      created_at: string;
    }[];
    bestSellingProducts: {
      name: string;
      quantity: number;
      revenue: number;
      category: string;
    }[];
    categoryPerformance: {
      category: string;
      revenue: number;
      percentage: number;
    }[];
    topCustomers: {
      name: string;
      orders: number;
      spent: number;
    }[];
    summary: {
      averageOrderValue: number;
      revenueThisWeek: number;
      revenueThisMonth: number;
      revenueThisYear: number;
    };
    traffic: {
      visitorsToday: number | null;
      pageViewsToday: number | null;
      uniqueVisitors: number | null;
      bounceRate: number | null;
      averageSessionDuration: number | null;
    };
    sources: {
      name: string;
      visitors: number;
      percentage: number;
    }[] | null;
    devices: {
      type: string;
      percentage: number;
    }[] | null;
    countries: {
      country: string;
      visitors: number;
    }[] | null;
    topPages: {
      path: string;
      views: number;
    }[] | null;
    productPerformance: {
      productId: string;
      name: string;
      views: number | null;
      orders: number;
      revenue: number;
      conversion: number | null;
      lastPurchased: string | null;
    }[];
    lastUpdated: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch("/api/admin/analytics");
        if (!res.ok) {
          throw new Error("Failed to fetch business analytics");
        }
        const data = await res.json();
        setAnalytics(data);
      } catch (err) {
        console.error("Error loading admin analytics page:", err);
        setError(err instanceof Error ? err.message : "Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-10 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-wide text-slate-900">Store Analytics</h1>
          <p className="text-sm text-slate-500 font-light mt-1 mb-2">
            Comprehensive overview of store sales, product performance, and visitor activity.
          </p>
          {analytics && <AnalyticsTimestamp timestamp={analytics.lastUpdated} />}
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200/80 animate-pulse h-28" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 animate-pulse h-64" />
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 animate-pulse h-64" />
          </div>
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 text-rose-600 text-sm flex items-center gap-3">
          <span>Failed to load store business analytics. Please reload the page.</span>
        </div>
      ) : analytics ? (
        <div className="space-y-8">
          {/* Sales Overview KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {/* KPI 1: Orders Today */}
            <div className="bg-white rounded-2xl p-4 md:p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] md:text-xs text-slate-400 font-medium uppercase tracking-wider block">
                  Orders Today
                </span>
                <p className="text-xl md:text-3xl font-serif font-semibold text-slate-800">
                  {analytics.kpis.ordersToday}
                </p>
              </div>
              <div className="p-2 md:p-3 rounded-xl border bg-amber-500/10 text-amber-600 border-amber-500/20 shrink-0">
                <ClipboardList size={18} />
              </div>
            </div>

            {/* KPI 2: Revenue Today */}
            <div className="bg-white rounded-2xl p-4 md:p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] md:text-xs text-slate-400 font-medium uppercase tracking-wider block font-sans">
                  Revenue Today
                </span>
                <p className="text-xl md:text-3xl font-serif font-semibold text-slate-800">
                  ₹{analytics.kpis.revenueToday.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="p-2 md:p-3 rounded-xl border bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shrink-0">
                <TrendingUp size={18} />
              </div>
            </div>

            {/* KPI 3: Pending Orders */}
            <div className="bg-white rounded-2xl p-4 md:p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] md:text-xs text-slate-400 font-medium uppercase tracking-wider block font-sans">
                  Pending Orders
                </span>
                <p className="text-xl md:text-3xl font-serif font-semibold text-slate-800">
                  {analytics.kpis.pendingOrders}
                </p>
              </div>
              <div className="p-2 md:p-3 rounded-xl border bg-blue-500/10 text-blue-600 border-blue-500/20 shrink-0">
                <Clock size={18} />
              </div>
            </div>

            {/* KPI 4: Visitors Today */}
            <div className="bg-white rounded-2xl p-4 md:p-6 border border-slate-200/80 shadow-xs flex items-center justify-between relative overflow-hidden">
              <div className="space-y-1">
                <span className="text-[10px] md:text-xs text-slate-400 font-medium uppercase tracking-wider block">
                  Visitors Today
                </span>
                <p className={`font-serif font-semibold ${analytics.traffic.visitorsToday === null ? "text-xs text-slate-400 uppercase tracking-wider font-sans" : "text-xl md:text-3xl text-slate-800"}`}>
                  {analytics.traffic.visitorsToday !== null ? analytics.traffic.visitorsToday.toLocaleString() : "Coming Soon"}
                </p>
              </div>
              <div className="p-2 md:p-3 rounded-xl border bg-slate-50 text-slate-400 border-slate-100 shrink-0">
                <Users size={18} />
              </div>
            </div>
          </div>

          {/* Revenue chart & Revenue summary Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <RevenueChart data={analytics.revenue30Days} />
            </div>
            <div className="lg:col-span-5">
              <RevenueSummary summary={analytics.summary} />
            </div>
          </div>

          {/* Business Intelligence Row (Phase 2) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <BestSellingProducts products={analytics.bestSellingProducts} />
            <CategoryPerformance categories={analytics.categoryPerformance} />
            <TopCustomers customers={analytics.topCustomers} />
          </div>

          {/* Traffic Overview & Details Row (Phase 3) */}
          <div className="space-y-6 border-t border-slate-100 pt-6">
            <div>
              <h3 className="font-serif text-lg font-semibold text-slate-800">Traffic & Visitor Insights</h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">Visitor behavior, channels, and product interaction funnel</p>
            </div>
            
            <VisitorOverview traffic={analytics.traffic} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TrafficSources sources={analytics.sources} />
              <DeviceBreakdown devices={analytics.devices} />
              <GeoDistribution countries={analytics.countries} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4">
                <TopPages pages={analytics.topPages} />
              </div>
              <div className="lg:col-span-8">
                <ProductPerformance products={analytics.productPerformance} />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
