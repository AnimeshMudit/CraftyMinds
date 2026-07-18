"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Menu, X, ArrowLeft, ClipboardList } from "lucide-react";
import { ToastProvider } from "@/components/admin/Toast";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: ShoppingBag },
    { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  ];

  if (pathname === "/admin/login") {
    return (
      <ToastProvider>
        <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-4 font-sans">
          {children}
        </div>
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-50/50 flex text-slate-800 font-sans">
        
        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-40 px-6 flex items-center justify-between">
          <Link href="/admin" className="font-serif text-lg font-semibold tracking-wide">
            Crafty Minds <span className="text-accent font-light italic">Admin</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Sidebar backdrop for mobile */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-slate-900/20 backdrop-blur-xs z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-0 left-0 bottom-0 w-64 bg-white border-r border-slate-200 z-50 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } h-screen`}
        >
          <div>
            {/* Sidebar Logo Header */}
            <div className="h-20 border-b border-slate-100 px-6 flex items-center justify-between">
              <Link href="/admin" className="font-serif text-xl font-semibold tracking-wide">
                Crafty Minds <span className="text-accent font-light italic">Admin</span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Sidebar Menu */}
            <nav className="p-4 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname?.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? "bg-accent/10 text-accent font-semibold"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer Link back to public site */}
          <div className="p-4 border-t border-slate-100 space-y-2">
            <button
              onClick={async () => {
                try {
                  const res = await fetch("/api/admin/logout", { method: "POST" });
                  if (res.ok) {
                    window.location.href = "/admin/login";
                  }
                } catch (err) {
                  console.error("Logout failed:", err);
                }
              }}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-rose-200 hover:bg-rose-50/50 text-xs font-semibold text-rose-600 tracking-wider uppercase transition-colors cursor-pointer"
            >
              <span>Log Out</span>
            </button>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-600 tracking-wider uppercase transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Store</span>
            </Link>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-grow flex flex-col min-h-screen">
          <main className="flex-grow p-4 md:p-6 lg:p-10 pt-20 lg:pt-10 overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
