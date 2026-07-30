"use client";

import React from "react";

interface ProductPerf {
  productId: string;
  name: string;
  views: number | null;
  orders: number;
  revenue: number;
  conversion: number | null;
  lastPurchased: string | null;
}

interface ProductPerformanceProps {
  products: ProductPerf[];
}

export default function ProductPerformance({ products }: ProductPerformanceProps) {
  const formatDate = (isoString: string | null) => {
    if (!isoString) return "Never";
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="font-serif text-lg font-semibold text-slate-800">Product Performance</h3>
        <p className="text-xs text-slate-400 font-sans mt-0.5">Interaction and purchase funnel analytics per product</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse font-sans text-sm">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
              <th className="py-3.5 px-4">Product Name</th>
              <th className="py-3.5 px-4 text-center">Views</th>
              <th className="py-3.5 px-4 text-center">Orders</th>
              <th className="py-3.5 px-4 text-right">Revenue</th>
              <th className="py-3.5 px-4 text-center">Conversion</th>
              <th className="py-3.5 px-4 text-right">Last Purchased</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400 font-light text-xs">
                  No product data compiled yet.
                </td>
              </tr>
            ) : (
              products.map((item) => (
                <tr key={item.productId} className="hover:bg-slate-50/40 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-slate-800 max-w-[200px] truncate">
                    {item.name}
                  </td>
                  <td className="py-3.5 px-4 text-center text-slate-400 text-xs uppercase tracking-wider">
                    {item.views !== null ? item.views.toLocaleString() : "Coming Soon"}
                  </td>
                  <td className="py-3.5 px-4 text-center font-medium text-slate-800">
                    {item.orders}
                  </td>
                  <td className="py-3.5 px-4 text-right font-medium text-slate-800">
                    ₹{item.revenue.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3.5 px-4 text-center text-slate-400 text-xs uppercase tracking-wider">
                    {item.conversion !== null ? `${item.conversion.toFixed(1)}%` : "Coming Soon"}
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-500 text-xs">
                    {formatDate(item.lastPurchased)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
