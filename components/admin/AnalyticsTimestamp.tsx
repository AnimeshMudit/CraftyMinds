"use client";

import React from "react";
import { Clock } from "lucide-react";

interface AnalyticsTimestampProps {
  timestamp: string;
}

export default function AnalyticsTimestamp({ timestamp }: AnalyticsTimestampProps) {
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "—";
    }
  };

  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-sans font-light">
      <Clock size={12} className="text-slate-300" />
      <span>Last Updated: {formatTime(timestamp)}</span>
    </div>
  );
}
