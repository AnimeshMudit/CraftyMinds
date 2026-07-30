"use client";

import React from "react";
import { TrendingUp, Calendar, Landmark, CreditCard } from "lucide-react";

interface SummaryData {
  averageOrderValue: number;
  revenueThisWeek: number;
  revenueThisMonth: number;
  revenueThisYear: number;
}

interface RevenueSummaryProps {
  summary: SummaryData;
}

export default function RevenueSummary({ summary }: RevenueSummaryProps) {
  const cards = [
    {
      label: "Average Order Value",
      value: summary.averageOrderValue,
      icon: CreditCard,
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      label: "Revenue This Week",
      value: summary.revenueThisWeek,
      icon: TrendingUp,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      label: "Revenue This Month",
      value: summary.revenueThisMonth,
      icon: Calendar,
      color: "bg-purple-50 text-purple-600 border-purple-100",
    },
    {
      label: "Revenue This Year",
      value: summary.revenueThisYear,
      icon: Landmark,
      color: "bg-amber-50 text-amber-600 border-amber-100",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs h-full flex flex-col justify-between">
      <div>
        <div className="border-b border-slate-100 pb-4 mb-4">
          <h3 className="font-serif text-lg font-semibold text-slate-800">Revenue Summary</h3>
          <p className="text-xs text-slate-400 font-sans mt-0.5">Aggregate performance metrics</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50/50 rounded-xl p-4 border border-slate-100 flex flex-col justify-between gap-3"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] md:text-xs text-slate-400 font-medium font-sans uppercase tracking-wider block">
                    {card.label}
                  </span>
                  <div className={`p-1.5 rounded-lg border ${card.color}`}>
                    <Icon size={14} />
                  </div>
                </div>
                <p className="text-base md:text-xl font-serif font-bold text-slate-800">
                  ₹{card.value.toLocaleString("en-IN")}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
