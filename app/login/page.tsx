"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, Lock, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useCustomerAuth } from "@/context/CustomerAuthContext";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { syncSession } = useCustomerAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const nextPath = searchParams.get("next") || "/";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        await syncSession(data.session);
        router.replace(nextPath);
        router.refresh();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unable to log in.";
      setMessage(
        errorMessage.toLowerCase().includes("invalid") || errorMessage.toLowerCase().includes("credentials")
          ? "Invalid email or password. Please try again."
          : errorMessage
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setMessage(null);
    setIsLoading(true);

    try {
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Google login failed.";
      setMessage(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <section className="pt-28 pb-16 md:pt-36 md:pb-24 bg-background min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 grid lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-6 max-w-xl">
          <Link href="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-foreground/50 hover:text-accent transition-colors">
            <ArrowLeft size={12} />
            Back to Store
          </Link>
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-widest font-semibold text-accent">Customer Login</span>
            <h1 className="font-serif text-4xl sm:text-5xl tracking-tight text-foreground">Welcome back.</h1>
            <p className="text-sm sm:text-base text-foreground/70 leading-relaxed max-w-lg">
              Sign in to view your profile, review your orders, and keep your customer details synced across devices.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 text-sm text-foreground/70">
            <div className="rounded-2xl border border-border-custom bg-white p-4 shadow-xs">
              <p className="font-semibold text-foreground mb-1">Fast access</p>
              <p>Resume your orders and profile without changing guest checkout.</p>
            </div>
            <div className="rounded-2xl border border-border-custom bg-white p-4 shadow-xs">
              <p className="font-semibold text-foreground mb-1">Google login</p>
              <p>Continue with Google if you want one-tap sign in and profile avatars.</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-border-custom rounded-3xl shadow-xs p-6 sm:p-8 md:p-10">
          <div className="space-y-2 mb-8">
            <h2 className="font-serif text-3xl text-foreground">Login</h2>
            <p className="text-sm text-foreground/60">Use your Crafty Minds customer account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="login-email" className="text-xs uppercase tracking-wider font-semibold text-foreground/60">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-3.5 text-foreground/35" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-border-custom focus:outline-hidden focus:border-accent font-sans text-sm text-foreground transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="login-password" className="text-xs uppercase tracking-wider font-semibold text-foreground/60">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-3.5 text-foreground/35" />
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-border-custom focus:outline-hidden focus:border-accent font-sans text-sm text-foreground transition-colors"
                  required
                />
              </div>
            </div>

            {message && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50/80 px-4 py-3 text-sm text-rose-700">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-accent hover:bg-accent/90 text-white text-xs font-semibold tracking-wider uppercase rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-75"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <span>Login</span>
              )}
            </button>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-border-custom text-xs font-semibold tracking-wider uppercase text-foreground hover:bg-background/60 transition-colors disabled:opacity-75"
            >
              Continue with Google
            </button>

            <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-wider font-semibold pt-1">
              <Link href={`/forgot-password?next=${encodeURIComponent(nextPath)}`} className="text-foreground/50 hover:text-accent transition-colors">
                Forgot Password
              </Link>
              <Link href={`/signup?next=${encodeURIComponent(nextPath)}`} className="text-accent hover:text-accent/80 transition-colors">
                Create Account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-28 pb-16 md:pt-36 md:pb-24 bg-background" />}>
      <LoginContent />
    </Suspense>
  );
}
