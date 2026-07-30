"use client";

import React from "react";

interface TrafficSource {
  name: string;
  visitors: number;
  percentage: number;
}

interface TrafficSourcesProps {
  sources: TrafficSource[] | null;
}

export default function TrafficSources({ sources }: TrafficSourcesProps) {
  const defaultSources = [
    { name: "Google", visitors: 0, percentage: 0 },
    { name: "Instagram", visitors: 0, percentage: 0 },
    { name: "WhatsApp", visitors: 0, percentage: 0 },
    { name: "Direct", visitors: 0, percentage: 0 },
    { name: "Other", visitors: 0, percentage: 0 },
  ];

  const data = sources || defaultSources;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs h-full flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
          <div>
            <h3 className="font-serif text-lg font-semibold text-slate-800">Traffic Sources</h3>
            <p className="text-xs text-slate-400 font-sans mt-0.5">Top referrer sites and channels</p>
          </div>
          {!sources && (
            <span className="text-[8px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded font-sans uppercase font-medium">
              Coming Soon
            </span>
          )}
        </div>

        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-sans">
                <span className="font-medium text-slate-700">{item.name}</span>
                <span className="text-slate-400 font-medium">
                  {sources ? `${item.visitors.toLocaleString()} (${item.percentage}%)` : "Coming Soon"}
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent/40 rounded-full transition-all duration-500"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
