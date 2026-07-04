"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function CollapsibleSection({ title, children }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // On desktop, it is always open
  const showContent = !isMobile || isOpen;

  return (
    <div className="border-b border-border-custom/40 pb-3 lg:pb-0 lg:border-none">
      <button
        onClick={() => isMobile && setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-2.5 lg:py-0 text-left cursor-pointer lg:cursor-default lg:pointer-events-none focus:outline-none"
        disabled={!isMobile}
      >
        <h3 className="text-xs uppercase tracking-widest font-semibold text-foreground/80 lg:text-foreground/60">
          {title}
        </h3>
        {isMobile && (
          <ChevronDown
            size={14}
            className={`text-foreground/50 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        )}
      </button>
      
      {showContent && (
        <div className="pt-2 lg:pt-3">
          {children}
        </div>
      )}
    </div>
  );
}
