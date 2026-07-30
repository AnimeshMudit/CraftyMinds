"use client";

import React from "react";
import { Laptop, Smartphone, Tablet } from "lucide-react";

interface DeviceItem {
  type: string;
  percentage: number;
}

interface DeviceBreakdownProps {
  devices: DeviceItem[] | null;
}

export default function DeviceBreakdown({ devices }: DeviceBreakdownProps) {
  const defaultDevices = [
    { type: "Desktop", percentage: 0 },
    { type: "Mobile", percentage: 0 },
    { type: "Tablet", percentage: 0 },
  ];

  const data = devices || defaultDevices;

  const getIcon = (type: string) => {
    switch (type) {
      case "Desktop":
        return Laptop;
      case "Mobile":
        return Smartphone;
      default:
        return Tablet;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs h-full flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
          <div>
            <h3 className="font-serif text-lg font-semibold text-slate-800">Device Breakdown</h3>
            <p className="text-xs text-slate-400 font-sans mt-0.5">Visitor device category shares</p>
          </div>
          {!devices && (
            <span className="text-[8px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded font-sans uppercase font-medium">
              Coming Soon
            </span>
          )}
        </div>

        <div className="space-y-4">
          {data.map((item, index) => {
            const Icon = getIcon(item.type);
            return (
              <div key={index} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0 last:pb-0 font-sans">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                    <Icon size={14} />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{item.type}</span>
                </div>
                <span className="text-sm font-semibold text-slate-800">
                  {devices ? `${item.percentage}%` : "—"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
