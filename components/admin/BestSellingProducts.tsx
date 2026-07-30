"use client";

import React from "react";

interface BestProduct {
  name: string;
  quantity: number;
  revenue: number;
  category: string;
}

interface BestSellingProductsProps {
  products: BestProduct[];
}

export default function BestSellingProducts({ products }: BestSellingProductsProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
          <div>
            <h3 className="font-serif text-lg font-semibold text-slate-800">Best Selling Products</h3>
            <p className="text-xs text-slate-400 font-sans mt-0.5">Top 5 items ranked by quantity sold</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 pr-1">
          {products.length === 0 ? (
            <div className="py-8 text-center text-slate-400 font-sans text-xs font-light">
              No product sales registered yet.
            </div>
          ) : (
            products.map((item, index) => (
              <div key={index} className="py-3.5 flex items-center justify-between gap-4 first:pt-0">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-slate-100 text-slate-500 w-5 h-5 rounded-full flex items-center justify-center font-bold font-sans">
                      {index + 1}
                    </span>
                    <p className="font-medium text-slate-800 text-sm font-sans truncate max-w-[180px]">
                      {item.name}
                    </p>
                  </div>
                  <span className="capitalize text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 ml-7">
                    {item.category === "mdf" ? "MDF Art" : item.category === "pouch" ? "Pouch" : item.category === "rakhis" ? "Rakhi" : "Magnet"}
                  </span>
                </div>
                <div className="text-right shrink-0 space-y-0.5">
                  <p className="text-sm font-semibold text-slate-800 font-sans">
                    ₹{item.revenue.toLocaleString("en-IN")}
                  </p>
                  <p className="text-[10px] text-slate-400 font-sans">
                    {item.quantity} {item.quantity === 1 ? "unit" : "units"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
