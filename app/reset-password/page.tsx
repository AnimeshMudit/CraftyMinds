"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, Lock } from "lucide-react";
import { supabase } from "@/lib/supabase";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hasSession, setHasSession] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const nextPath = searchParams.get("next") || "/profile";

  useEffect(() => {
    const syncSession = async () => {
      const { data } = await supabase.auth.getSession();
      setHasSession(Boolean(data.session));
    };

    void syncSession();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);

    if (password.length < 8) {
      setMessage("Password should be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        throw error;
      }

      setMessage("Password updated successfully.");
      router.replace(nextPath);
      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unable to update password.";
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
            <span className="text-xs uppercase tracking-widest font-semibold text-accent">Reset Password</span>
            <h1 className="font-serif text-3xl text-foreground">Set a new password</h1>
            <p className="text-sm text-foreground/60">
              {hasSession
                ? "Choose a new secure password for your account."
                : "Open this page from the recovery email link to continue."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="reset-password" className="text-xs uppercase tracking-wider font-semibold text-foreground/60">
                New Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-3.5 text-foreground/35" />
                <input
                  id="reset-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-border-custom focus:outline-hidden focus:border-accent font-sans text-sm text-foreground transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="reset-confirm" className="text-xs uppercase tracking-wider font-semibold text-foreground/60">
                Confirm Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-3.5 text-foreground/35" />
                <input
                  id="reset-confirm"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Repeat your password"
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
              disabled={isLoading || !hasSession}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-accent hover:bg-accent/90 text-white text-xs font-semibold tracking-wider uppercase rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-75"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Updating password...</span>
                </>
              ) : (
                <span>Update Password</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-28 pb-16 md:pt-36 md:pb-24 bg-background" />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
