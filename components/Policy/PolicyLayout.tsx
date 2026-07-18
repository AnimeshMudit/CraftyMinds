import React from "react";

interface PolicyLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export default function PolicyLayout({ title, lastUpdated, children }: PolicyLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50/50 pt-28 pb-16 font-sans text-slate-800">
      <div className="max-w-3xl mx-auto px-4 space-y-8 animate-fadeIn">
        
        {/* Page Hero */}
        <div className="text-center bg-white border border-slate-200/60 rounded-3xl p-8 md:p-12 shadow-xs space-y-3">
          <span className="text-[10px] uppercase tracking-widest text-accent font-bold">Studio Policies</span>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">{title}</h1>
          <p className="text-slate-400 text-xs font-light">Last Updated: {lastUpdated}</p>
        </div>

        {/* Content container */}
        <div className="bg-white border border-slate-200/60 rounded-3xl p-6 md:p-10 shadow-xs space-y-6">
          {children}
        </div>

      </div>
    </div>
  );
}
