"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";

function ForgotPasswordContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const nextPath = searchParams.get("next") || "/profile";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setIsLoading(true);

    try {
      const redirectTo = `${window.location.origin}/reset-password?next=${encodeURIComponent(nextPath)}`;
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo,
      });

      if (error) {
        throw error;
      }

      setMessage("Password reset email sent. Check your inbox for the recovery link.");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unable to send reset email.";
      setMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="pt-28 pb-16 md:pt-36 md:pb-24 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-12">
        <Link href={`/login?next=${encodeURIComponent(nextPath)}`} className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-foreground/50 hover:text-accent transition-colors mb-8">
          <ArrowLeft size={12} />
          Back to Login
        </Link>

        <div className="bg-white border border-border-custom rounded-3xl shadow-xs p-6 sm:p-8 md:p-10 max-w-xl mx-auto">
          <div className="space-y-2 mb-8">
            <span className="text-xs uppercase tracking-widest font-semibold text-accent">Forgot Password</span>
            <h1 className="font-serif text-3xl text-foreground">Recover your account</h1>
            <p className="text-sm text-foreground/60">We’ll send a secure recovery email through Supabase.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="forgot-email" className="text-xs uppercase tracking-wider font-semibold text-foreground/60">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-3.5 text-foreground/35" />
                <input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-border-custom focus:outline-hidden focus:border-accent font-sans text-sm text-foreground transition-colors"
                  required
                />
              </div>
            </div>

            {message && (
              <div className="rounded-2xl border border-border-custom bg-background/80 px-4 py-3 text-sm text-foreground/70">
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
                  <span>Sending recovery email...</span>
                </>
              ) : (
                <span>Send Reset Link</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-28 pb-16 md:pt-36 md:pb-24 bg-background" />}>
      <ForgotPasswordContent />
    </Suspense>
  );
}
