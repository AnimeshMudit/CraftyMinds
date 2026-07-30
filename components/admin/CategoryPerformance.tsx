"use client";

import React from "react";

interface CategorySalesPoint {
  category: string;
  revenue: number;
  percentage: number;
}

interface CategoryPerformanceProps {
  categories: CategorySalesPoint[];
}

export default function CategoryPerformance({ categories }: CategoryPerformanceProps) {
  const getBarColor = (name: string) => {
    switch (name) {
      case "MDF Boards":
        return "bg-amber-500";
      case "Pouches":
        return "bg-purple-500";
      case "Magnets":
        return "bg-rose-500";
      case "Rakhis":
        return "bg-emerald-500";
      default:
        return "bg-slate-500";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
          <div>
            <h3 className="font-serif text-lg font-semibold text-slate-800">Category Performance</h3>
            <p className="text-xs text-slate-400 font-sans mt-0.5">Revenue distribution by product line</p>
          </div>
        </div>

        <div className="space-y-4">
          {categories.length === 0 ? (
            <div className="py-8 text-center text-slate-400 font-sans text-xs font-light">
              No category sales registered yet.
            </div>
          ) : (
            categories.map((item, index) => (
              <div key={index} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-sans">
                  <span className="font-medium text-slate-700">{item.category}</span>
                  <div className="space-x-1.5">
                    <span className="font-semibold text-slate-800">₹{item.revenue.toLocaleString("en-IN")}</span>
                    <span className="text-slate-400">({item.percentage}%)</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getBarColor(item.category)}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
