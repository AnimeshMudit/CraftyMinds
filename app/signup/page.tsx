"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, Lock, Mail, UserRound } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useCustomerAuth } from "@/context/CustomerAuthContext";

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { syncSession } = useCustomerAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const nextPath = searchParams.get("next") || "/profile";

  const validate = () => {
    if (fullName.trim().length < 2) return "Please enter your full name.";
    if (!email.trim()) return "Email is required.";
    if (password.length < 8) return "Password should be at least 8 characters.";
    if (password !== confirmPassword) return "Passwords do not match.";
    return null;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);

    const validationMessage = validate();
    if (validationMessage) {
      setMessage(validationMessage);
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        await syncSession(data.session);
        router.replace(nextPath);
        router.refresh();
        return;
      }

      setMessage("Account created. Please check your email to verify your account before logging in.");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unable to create account.";
      setMessage(
        errorMessage.toLowerCase().includes("already")
          ? "An account already exists with this email address."
          : errorMessage.toLowerCase().includes("password")
          ? "Please choose a stronger password."
          : errorMessage
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
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
      const errorMessage = error instanceof Error ? error.message : "Google signup failed.";
      setMessage(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <section className="pt-28 pb-16 md:pt-36 md:pb-24 bg-background min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 grid lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-6 max-w-xl order-2 lg:order-1">
          <Link href="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-foreground/50 hover:text-accent transition-colors">
            <ArrowLeft size={12} />
            Back to Store
          </Link>
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-widest font-semibold text-accent">Create Account</span>
            <h1 className="font-serif text-4xl sm:text-5xl tracking-tight text-foreground">Join Crafty Minds.</h1>
            <p className="text-sm sm:text-base text-foreground/70 leading-relaxed max-w-lg">
              Create a customer account to save your profile, speed up future orders, and keep a record of your purchases.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 text-sm text-foreground/70">
            <div className="rounded-2xl border border-border-custom bg-white p-4 shadow-xs">
              <p className="font-semibold text-foreground mb-1">Profile sync</p>
              <p>Name and avatar stay with your account across devices.</p>
            </div>
            <div className="rounded-2xl border border-border-custom bg-white p-4 shadow-xs">
              <p className="font-semibold text-foreground mb-1">Orders</p>
              <p>View only the orders tied to your account from your dashboard.</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-border-custom rounded-3xl shadow-xs p-6 sm:p-8 md:p-10 order-1 lg:order-2">
          <div className="space-y-2 mb-8">
            <h2 className="font-serif text-3xl text-foreground">Signup</h2>
            <p className="text-sm text-foreground/60">Create your Crafty Minds customer account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="signup-name" className="text-xs uppercase tracking-wider font-semibold text-foreground/60">
                Full Name
              </label>
              <div className="relative">
                <UserRound size={16} className="absolute left-4 top-3.5 text-foreground/35" />
                <input
                  id="signup-name"
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Your full name"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-border-custom focus:outline-hidden focus:border-accent font-sans text-sm text-foreground transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="signup-email" className="text-xs uppercase tracking-wider font-semibold text-foreground/60">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-3.5 text-foreground/35" />
                <input
                  id="signup-email"
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
              <label htmlFor="signup-password" className="text-xs uppercase tracking-wider font-semibold text-foreground/60">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-3.5 text-foreground/35" />
                <input
                  id="signup-password"
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
              <label htmlFor="signup-confirm" className="text-xs uppercase tracking-wider font-semibold text-foreground/60">
                Confirm Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-3.5 text-foreground/35" />
                <input
                  id="signup-confirm"
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
                  <span>Creating account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>

            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-border-custom text-xs font-semibold tracking-wider uppercase text-foreground hover:bg-background/60 transition-colors disabled:opacity-75"
            >
              Continue with Google
            </button>

            <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-wider font-semibold pt-1">
              <span className="text-foreground/50">Already have an account?</span>
              <Link href={`/login?next=${encodeURIComponent(nextPath)}`} className="text-accent hover:text-accent/80 transition-colors">
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-28 pb-16 md:pt-36 md:pb-24 bg-background" />}>
      <SignupContent />
    </Suspense>
  );
}
