"use client";

import React, { useState } from "react";

interface RevenueDataPoint {
  date: string;
  revenue: number;
}

interface RevenueChartProps {
  data: RevenueDataPoint[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 font-sans text-sm">
        No revenue data available
      </div>
    );
  }

  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1000);
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);

  // SVG dimensions
  const width = 600;
  const height = 240;
  const paddingLeft = 60;
  const paddingRight = 20;
  const paddingTop = 30;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Calculate coordinates
  const points = data.map((d, index) => {
    const x = paddingLeft + (index / (data.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - (d.revenue / maxRevenue) * chartHeight;
    return { x, y, data: d };
  });

  // Construct SVG Path
  const linePath = points.reduce((path, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    return `${path} L ${p.x} ${p.y}`;
  }, "");

  // Area path closes at bottom of chart
  const areaPath = linePath
    ? `${linePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`
    : "";

  // Grid lines
  const gridLinesCount = 4;
  const gridLines = Array.from({ length: gridLinesCount }).map((_, i) => {
    const value = (maxRevenue / (gridLinesCount - 1)) * i;
    const y = paddingTop + chartHeight - (value / maxRevenue) * chartHeight;
    return { y, value };
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <div>
          <h3 className="font-serif text-lg font-semibold text-slate-800">Revenue Performance</h3>
          <p className="text-xs text-slate-400 font-sans mt-0.5">Last 30 days of sales</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium font-sans">Total Sales</span>
          <p className="text-2xl font-serif font-bold text-accent">₹{totalRevenue.toLocaleString("en-IN")}</p>
        </div>
      </div>

      <div className="relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto font-sans text-[10px] text-slate-400 select-none overflow-visible"
        >
          {/* Y Axis Grid Lines & Labels */}
          {gridLines.map((line, idx) => (
            <g key={idx} className="opacity-70">
              <line
                x1={paddingLeft}
                y1={line.y}
                x2={width - paddingRight}
                y2={line.y}
                stroke="#F1F5F9"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
              <text x={paddingLeft - 10} y={line.y + 3} textAnchor="end" className="fill-slate-400 font-medium">
                ₹{line.value >= 1000 ? `${(line.value / 1000).toFixed(1)}k` : line.value}
              </text>
            </g>
          ))}

          {/* Area Path */}
          {areaPath && (
            <path
              d={areaPath}
              fill="url(#chart-gradient)"
              className="opacity-40"
            />
          )}

          {/* Line Path */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="#D2B48C"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Gradients */}
          <defs>
            <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D2B48C" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#D2B48C" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Interactive vertical hover line */}
          {hoveredIndex !== null && points[hoveredIndex] && (
            <g>
              <line
                x1={points[hoveredIndex].x}
                y1={paddingTop}
                x2={points[hoveredIndex].x}
                y2={paddingTop + chartHeight}
                stroke="#E2E8F0"
                strokeWidth={1.5}
                strokeDasharray="2 2"
              />
              <circle
                cx={points[hoveredIndex].x}
                cy={points[hoveredIndex].y}
                r={6}
                fill="#D2B48C"
                stroke="#FFFFFF"
                strokeWidth={2}
              />
            </g>
          )}

          {/* X Axis Labels */}
          {data.map((d, index) => {
            if (index % 5 !== 0 && index !== data.length - 1) return null;
            const x = paddingLeft + (index / (data.length - 1)) * chartWidth;
            return (
              <text
                key={index}
                x={x}
                y={height - 15}
                textAnchor="middle"
                className="fill-slate-400 font-medium"
              >
                {d.date}
              </text>
            );
          })}

          {/* Invisible interactive hover columns */}
          {points.map((p, index) => {
            const colWidth = chartWidth / (data.length - 1);
            return (
              <rect
                key={index}
                x={p.x - colWidth / 2}
                y={paddingTop}
                width={colWidth}
                height={chartHeight}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}
        </svg>

        {/* Floating Tooltip */}
        {hoveredIndex !== null && points[hoveredIndex] && (
          <div
            className="absolute bg-slate-900 text-white rounded-lg p-2.5 shadow-xl text-xs font-sans pointer-events-none space-y-0.5 border border-slate-800 z-10"
            style={{
              left: `${((points[hoveredIndex].x - paddingLeft) / chartWidth) * 100}%`,
              top: `${((points[hoveredIndex].y - paddingTop) / chartHeight) * 100 - 30}%`,
              transform: "translate(-50%, -100%)",
              whiteSpace: "nowrap",
            }}
          >
            <p className="font-semibold text-slate-300">{points[hoveredIndex].data.date}</p>
            <p className="text-sm font-bold text-white">₹{points[hoveredIndex].data.revenue.toLocaleString("en-IN")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
