"use client";

import React from "react";
import { Map } from "lucide-react";

interface CountryVisitor {
  country: string;
  visitors: number;
}

interface GeoDistributionProps {
  countries: CountryVisitor[] | null;
}

export default function GeoDistribution({ countries }: GeoDistributionProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs h-full flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
          <div>
            <h3 className="font-serif text-lg font-semibold text-slate-800">Geographic Distribution</h3>
            <p className="text-xs text-slate-400 font-sans mt-0.5">Top visitor regions and countries</p>
          </div>
          {!countries && (
            <span className="text-[8px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded font-sans uppercase font-medium">
              Coming Soon
            </span>
          )}
        </div>

        <div className="divide-y divide-slate-100 pr-1">
          {!countries ? (
            <div className="py-8 text-center text-slate-400 font-sans text-xs font-light">
              Geographic analytics unavailable.
            </div>
          ) : (
            countries.map((item, index) => (
              <div key={index} className="py-2.5 flex items-center justify-between gap-4 first:pt-0 font-sans">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                    <Map size={14} />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{item.country}</span>
                </div>
                <span className="text-xs font-semibold text-slate-800">
                  {item.visitors.toLocaleString()} visitors
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
