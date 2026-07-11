"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { useToast } from "@/components/admin/Toast";
import { Plus, Edit2, Trash2, Check, AlertTriangle, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductsClientProps {
  initialProducts: Product[];
}

export default function ProductsClient({ initialProducts }: ProductsClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToast();

  const handleDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      // 1. Delete product and its image via protected API route
      const res = await fetch(`/api/products/${productToDelete.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to delete product.");
      }

      // Update state
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      showToast("Product deleted successfully!", "success");
    } catch (error: unknown) {
      console.error(error);
      showToast(error instanceof Error ? error.message : "Failed to delete product.", "error");
    } finally {
      setIsDeleting(false);
      setProductToDelete(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-wide text-slate-900">Products</h1>
          <p className="text-sm font-sans text-slate-500 font-light mt-1">
            Manage your store creations, edit prices, descriptions, and upload images.
          </p>
        </div>
        {products.length > 0 && (
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white text-xs font-semibold uppercase tracking-wider px-5 py-3 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Product</span>
          </Link>
        )}
      </div>

      {/* Empty State */}
      {products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-16 text-center max-w-xl mx-auto my-8">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6">
            <ImageIcon className="text-slate-400" size={28} />
          </div>
          <h3 className="font-serif text-2xl text-slate-800 font-medium">No products yet.</h3>
          <p className="text-slate-500 text-sm font-sans font-light mt-2 mb-8 leading-relaxed">
            Get started by adding your first hand-painted plaque, custom cotton canvas pouch, or clay magnet.
          </p>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white text-xs font-semibold uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Add First Product</span>
          </Link>
        </div>
      ) : (
        /* Products List (Table layout with responsive styling) */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400 font-semibold font-sans">
                  <th className="py-4 px-6">Product Info</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6 text-center">Featured</th>
                  <th className="py-4 px-6 text-center">Customizable</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-sans text-slate-700">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Thumbnail + Title */}
                    <td className="py-4 px-6 flex items-center gap-4">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 shrink-0">
                        <Image
                          src={product.image_url}
                          alt={product.title}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <span className="font-semibold text-slate-800 block line-clamp-1">{product.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono tracking-tighter">ID: {product.id}</span>
                      </div>
                    </td>
                    
                    {/* Category */}
                    <td className="py-4 px-6">
                      <span className="capitalize text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                        {product.category === "mdf" ? "MDF Art" : product.category === "pouch" ? "Pouch" : product.category === "rakhis" ? "Rakhi" : "Magnet"}
                      </span>
                    </td>
                    
                    {/* Price */}
                    <td className="py-4 px-6 font-medium text-slate-800">
                      ₹{product.price.toLocaleString("en-IN")}
                    </td>
                    
                    {/* Featured badge */}
                    <td className="py-4 px-6 text-center">
                      {product.featured ? (
                        <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider bg-amber-500/10 text-amber-700 font-semibold px-2.5 py-1 rounded-sm">
                          <Check size={10} />
                          <span>Featured</span>
                        </span>
                      ) : (
                        <span className="inline-block text-[9px] uppercase tracking-wider bg-slate-100 text-slate-400 font-medium px-2.5 py-1 rounded-sm">
                          Standard
                        </span>
                      )}
                    </td>
                    
                    {/* Customizable badge */}
                    <td className="py-4 px-6 text-center">
                      {product.customizable ? (
                        <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider bg-purple-500/10 text-purple-700 font-semibold px-2.5 py-1 rounded-sm">
                          <Check size={10} />
                          <span>Customizable</span>
                        </span>
                      ) : (
                        <span className="inline-block text-[9px] uppercase tracking-wider bg-slate-100 text-slate-400 font-medium px-2.5 py-1 rounded-sm">
                          Fixed
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <button
                          onClick={() => setProductToDelete(product)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="block md:hidden divide-y divide-slate-100">
            {products.map((product) => (
              <div key={product.id} className="p-4 flex gap-4 hover:bg-slate-50/50 transition-colors items-start">
                {/* image */}
                <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 shrink-0">
                  <Image
                    src={product.image_url}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                {/* Product info */}
                <div className="flex-grow min-w-0 space-y-1.5">
                  <span className="font-semibold text-slate-800 block truncate text-base">{product.title}</span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="capitalize text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {product.category === "mdf" ? "MDF Art" : product.category === "pouch" ? "Pouch" : product.category === "rakhis" ? "Rakhi" : "Magnet"}
                    </span>
                    {product.featured && (
                      <span className="inline-flex items-center gap-0.5 text-[9px] uppercase tracking-wider bg-amber-500/10 text-amber-700 font-semibold px-1.5 py-0.5 rounded-sm">
                        <Check size={8} />
                        <span>Featured</span>
                      </span>
                    )}
                    {product.customizable && (
                      <span className="inline-flex items-center gap-0.5 text-[9px] uppercase tracking-wider bg-purple-500/10 text-purple-700 font-semibold px-1.5 py-0.5 rounded-sm">
                        <Check size={8} />
                        <span>Customizable</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-semibold text-slate-800 text-sm">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
                        title="Edit Product"
                      >
                        <Edit2 size={15} />
                      </Link>
                      <button
                        onClick={() => setProductToDelete(product)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                        title="Delete Product"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <AnimatePresence>
        {productToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
              onClick={() => !isDeleting && setProductToDelete(null)}
            />
            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 z-10 relative overflow-hidden"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-rose-50 text-rose-600 shrink-0">
                  <AlertTriangle size={24} />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-xl font-semibold text-slate-800">Delete Product?</h3>
                  <p className="text-slate-500 text-sm font-sans font-light leading-relaxed">
                    Are you sure you want to delete <span className="font-semibold text-slate-800">&quot;{productToDelete.title}&quot;</span>?
                    This will permanently remove the product from the catalog and delete its image from storage.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={() => setProductToDelete(null)}
                  disabled={isDeleting}
                  className="px-4 py-2 text-xs font-semibold tracking-wider text-slate-500 hover:bg-slate-50 border border-slate-200 uppercase rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 text-xs font-semibold tracking-wider text-white bg-rose-600 hover:bg-rose-700 uppercase rounded-xl shadow-xs transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Delete</span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
