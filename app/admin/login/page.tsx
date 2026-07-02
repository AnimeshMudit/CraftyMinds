"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/admin/Toast";
import { Lock, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      showToast("Please enter the password.", "error");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        showToast("Login successful!", "success");
        router.push("/admin");
        router.refresh();
      } else {
        const errorData = await response.json().catch(() => ({}));
        showToast(errorData.error || "Invalid password.", "error");
      }
    } catch (err) {
      console.error("Login submit error:", err);
      showToast("An unexpected error occurred.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-2xl p-8 shadow-md relative overflow-hidden">
      <div className="text-center space-y-2 mb-8">
        <h1 className="font-serif text-3xl font-semibold tracking-wide text-slate-900">
          Crafty Minds <span className="text-accent font-light italic">Admin</span>
        </h1>
        <p className="text-sm font-sans text-slate-500 font-light">
          Please enter the administrator password to continue.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="password" className="text-xs uppercase tracking-wider font-semibold text-slate-500">
            Password
          </label>
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-slate-400">
              <Lock size={18} />
            </span>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-hidden focus:border-accent font-sans text-sm text-slate-800 transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-accent hover:bg-accent/90 text-white text-xs font-semibold tracking-wider uppercase rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-75"
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Verifying...</span>
            </>
          ) : (
            <span>Log In</span>
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-100 flex justify-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-accent uppercase tracking-wider transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Store</span>
        </Link>
      </div>
    </div>
  );
}
