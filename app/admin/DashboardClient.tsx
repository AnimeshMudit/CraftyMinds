"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { ShoppingBag, Box, Clipboard, Compass, Plus } from "lucide-react";

interface DashboardClientProps {
  products: Product[];
}

export default function DashboardClient({ products }: DashboardClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const totalProducts = products.length;
  const mdfCount = products.filter((p) => p.category === "mdf").length;
  const pouchCount = products.filter((p) => p.category === "pouch").length;
  const magnetCount = products.filter((p) => p.category === "magnet").length;

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const stats = [
    {
      id: "all",
      title: "Total Products",
      value: totalProducts,
      icon: Box,
      color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      activeBorder: "border-blue-500",
      activeBg: "bg-blue-500/[0.04]",
      activeRing: "focus:ring-blue-500/40",
    },
    {
      id: "mdf",
      title: "MDF Board Arts",
      value: mdfCount,
      icon: Compass,
      color: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      activeBorder: "border-amber-500",
      activeBg: "bg-amber-500/[0.04]",
      activeRing: "focus:ring-amber-500/40",
    },
    {
      id: "pouch",
      title: "Hand-painted Pouches",
      value: pouchCount,
      icon: ShoppingBag,
      color: "bg-purple-500/10 text-purple-600 border-purple-500/20",
      activeBorder: "border-purple-500",
      activeBg: "bg-purple-500/[0.04]",
      activeRing: "focus:ring-purple-500/40",
    },
    {
      id: "magnet",
      title: "Fridge Magnets",
      value: magnetCount,
      icon: Clipboard,
      color: "bg-rose-500/10 text-rose-600 border-rose-500/20",
      activeBorder: "border-rose-500",
      activeBg: "bg-rose-500/[0.04]",
      activeRing: "focus:ring-rose-500/40",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-wide text-slate-900">Dashboard</h1>
          <p className="text-sm font-sans text-slate-500 font-light mt-1">
            Overview of your Crafty Minds Studio store catalog and inventory.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white text-xs font-semibold uppercase tracking-wider px-5 py-3 rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isActive = selectedCategory === stat.id;
          return (
            <button
              key={stat.id}
              onClick={() => setSelectedCategory(stat.id)}
              className={`w-full text-left bg-white rounded-2xl p-4 md:p-6 flex items-center justify-between transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 ${stat.activeRing} border
                ${
                  isActive
                    ? `${stat.activeBorder} ${stat.activeBg} shadow-md scale-[1.02]`
                    : "border-slate-200/80 hover:border-slate-300 hover:shadow-md hover:scale-[1.02] active:scale-[0.99]"
                }
              `}
              aria-pressed={isActive}
              type="button"
            >
              <div className="space-y-1">
                <span className="text-[10px] md:text-xs text-slate-400 font-medium font-sans uppercase tracking-wider block">
                  {stat.title}
                </span>
                <p className="text-xl md:text-3xl font-serif font-semibold text-slate-800">
                  {stat.value}
                </p>
              </div>
              <div className={`p-2 md:p-3 rounded-xl border ${stat.color} shrink-0 transition-transform duration-300 group-hover:scale-110`}>
                <Icon size={18} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Recent Products Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="font-serif text-lg md:text-xl font-semibold text-slate-800">
              {selectedCategory === "all"
                ? "Recent Creations"
                : `Recent Creations: ${
                    selectedCategory === "mdf"
                      ? "MDF Board Arts"
                      : selectedCategory === "pouch"
                      ? "Hand-painted Pouches"
                      : "Fridge Magnets"
                  }`}
            </h2>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Showing {filteredProducts.length} of {totalProducts} {totalProducts === 1 ? "product" : "products"}
            </p>
          </div>
          <Link
            href="/admin/products"
            className="text-xs uppercase tracking-wider font-semibold text-accent hover:text-accent/80 transition-colors"
          >
            View All Products
          </Link>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-slate-400 font-light text-sm font-sans">
            No products in this category yet.
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400 font-semibold font-sans">
                    <th className="py-4 px-6">Product</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6">Price</th>
                    <th className="py-4 px-6 text-center">Featured</th>
                    <th className="py-4 px-6 text-center">Customizable</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm font-sans text-slate-700">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Image & Title */}
                      <td className="py-4 px-6 flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 shrink-0">
                          <Image
                            src={product.image_url}
                            alt={product.title}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <span className="font-medium text-slate-800 hover:text-accent transition-colors">
                          <Link href={`/admin/products`}>{product.title}</Link>
                        </span>
                      </td>
                      {/* Category */}
                      <td className="py-4 px-6">
                        <span className="capitalize text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                          {product.category === "mdf"
                            ? "MDF Art"
                            : product.category === "pouch"
                            ? "Pouch"
                            : "Magnet"}
                        </span>
                      </td>
                      {/* Price */}
                      <td className="py-4 px-6 font-medium text-slate-800">
                        ₹{product.price.toLocaleString("en-IN")}
                      </td>
                      {/* Featured */}
                      <td className="py-4 px-6 text-center">
                        {product.featured ? (
                          <span className="inline-block text-[9px] uppercase tracking-wider bg-amber-500/10 text-amber-700 font-semibold px-2.5 py-0.5 rounded-sm">
                            Yes
                          </span>
                        ) : (
                          <span className="inline-block text-[9px] uppercase tracking-wider bg-slate-100 text-slate-400 font-semibold px-2.5 py-0.5 rounded-sm">
                            No
                          </span>
                        )}
                      </td>
                      {/* Customizable */}
                      <td className="py-4 px-6 text-center">
                        {product.customizable ? (
                          <span className="inline-block text-[9px] uppercase tracking-wider bg-purple-500/10 text-purple-700 font-semibold px-2.5 py-0.5 rounded-sm">
                            Yes
                          </span>
                        ) : (
                          <span className="inline-block text-[9px] uppercase tracking-wider bg-slate-100 text-slate-400 font-semibold px-2.5 py-0.5 rounded-sm">
                            No
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="block md:hidden divide-y divide-slate-100">
              {filteredProducts.map((product) => (
                <div key={product.id} className="p-4 flex gap-4 hover:bg-slate-50/50 transition-colors items-center">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 shrink-0">
                    <Image
                      src={product.image_url}
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-grow min-w-0 space-y-1.5">
                    <span className="font-semibold text-slate-800 block truncate text-sm">
                      <Link href="/admin/products">{product.title}</Link>
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="capitalize text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {product.category === "mdf" ? "MDF Art" : product.category === "pouch" ? "Pouch" : "Magnet"}
                      </span>
                      {product.featured && (
                        <span className="inline-block text-[9px] uppercase tracking-wider bg-amber-500/10 text-amber-700 font-semibold px-1.5 py-0.5 rounded-sm">
                          Featured
                        </span>
                      )}
                      {product.customizable && (
                        <span className="inline-block text-[9px] uppercase tracking-wider bg-purple-500/10 text-purple-700 font-semibold px-1.5 py-0.5 rounded-sm">
                          Customizable
                        </span>
                      )}
                    </div>
                    <div className="font-semibold text-slate-800 text-xs">
                      ₹{product.price.toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
