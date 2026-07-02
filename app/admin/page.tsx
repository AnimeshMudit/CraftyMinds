import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/supabase/products";
import { ShoppingBag, Box, Clipboard, Compass, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const products = await getProducts();

  const totalProducts = products.length;
  const mdfCount = products.filter((p) => p.category === "mdf").length;
  const pouchCount = products.filter((p) => p.category === "pouch").length;
  const magnetCount = products.filter((p) => p.category === "magnet").length;

  // Take the 5 most recent products
  const recentProducts = products.slice(0, 5);

  const stats = [
    {
      title: "Total Products",
      value: totalProducts,
      icon: Box,
      color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    },
    {
      title: "MDF Board Arts",
      value: mdfCount,
      icon: Compass,
      color: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    },
    {
      title: "Hand-painted Pouches",
      value: pouchCount,
      icon: ShoppingBag,
      color: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    },
    {
      title: "Fridge Magnets",
      value: magnetCount,
      icon: Clipboard,
      color: "bg-rose-500/10 text-rose-600 border-rose-500/20",
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex items-center justify-between transition-all hover:shadow-md"
            >
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-medium font-sans uppercase tracking-wider">
                  {stat.title}
                </span>
                <p className="text-3xl font-serif font-semibold text-slate-800">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-xl border ${stat.color} shrink-0`}>
                <Icon size={22} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Products Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-serif text-xl font-semibold text-slate-800">Recent Creations</h2>
          <Link
            href="/admin/products"
            className="text-xs uppercase tracking-wider font-semibold text-accent hover:text-accent/80 transition-colors"
          >
            View All Products
          </Link>
        </div>

        {recentProducts.length === 0 ? (
          <div className="p-12 text-center text-slate-400 font-light text-sm font-sans">
            No products uploaded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
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
                {recentProducts.map((product) => (
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
                        {product.category === "mdf" ? "MDF Art" : product.category === "pouch" ? "Pouch" : "Magnet"}
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
        )}
      </div>

    </div>
  );
}
