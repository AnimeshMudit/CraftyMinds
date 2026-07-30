"use client";

import React from "react";
import { Eye, Users, MousePointer } from "lucide-react";

interface TrafficData {
  visitorsToday: number | null;
  pageViewsToday: number | null;
  uniqueVisitors: number | null;
  bounceRate: number | null;
  averageSessionDuration: number | null;
}

interface VisitorOverviewProps {
  traffic: TrafficData | null;
}

export default function VisitorOverview({ traffic }: VisitorOverviewProps) {
  const visitorsToday = traffic?.visitorsToday ?? "Coming Soon";
  const pageViews = traffic?.pageViewsToday ?? "Coming Soon";
  const uniqueVisitors = traffic?.uniqueVisitors ?? "Coming Soon";

  const cards = [
    {
      label: "Visitors Today",
      value: visitorsToday,
      icon: Users,
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      label: "Page Views Today",
      value: pageViews,
      icon: Eye,
      color: "bg-purple-50 text-purple-600 border-purple-100",
    },
    {
      label: "Unique Visitors",
      value: uniqueVisitors,
      icon: MousePointer,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        const isString = typeof card.value === "string";
        return (
          <div
            key={idx}
            className="bg-white rounded-2xl p-4 md:p-6 border border-slate-200/80 shadow-xs flex items-center justify-between"
          >
            <div className="space-y-1">
              <span className="text-[10px] md:text-xs text-slate-400 font-medium font-sans uppercase tracking-wider block">
                {card.label}
              </span>
              <p className={`font-serif font-semibold ${isString ? "text-sm text-slate-400 uppercase tracking-wider" : "text-xl md:text-3xl text-slate-800"}`}>
                {card.value}
              </p>
            </div>
            <div className={`p-2 md:p-3 rounded-xl border ${card.color} shrink-0`}>
              <Icon size={18} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
