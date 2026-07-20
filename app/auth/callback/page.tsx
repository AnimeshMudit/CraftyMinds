"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { buildCustomerSessionPayload } from "@/context/CustomerAuthContext";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const code = searchParams.get("code");
        if (!code) {
          throw new Error("Missing authorization code.");
        }

        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          throw exchangeError;
        }

        const { data } = await supabase.auth.getSession();
        if (data.session) {
          await fetch("/api/auth/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session: buildCustomerSessionPayload(data.session) }),
          });
        }

        const nextPath = searchParams.get("next") || "/";
        router.replace(nextPath);
        router.refresh();
      } catch (err) {
        console.error("Auth callback error:", err);
        setError(err instanceof Error ? err.message : "Unable to complete sign in.");
      }
    };

    void run();
  }, [router, searchParams]);

  return (
    <section className="min-h-screen pt-28 pb-16 flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-white border border-border-custom rounded-3xl p-8 shadow-xs text-center space-y-4">
        {error ? (
          <>
            <h1 className="font-serif text-3xl text-foreground">Login Error</h1>
            <p className="text-sm text-foreground/70">{error}</p>
          </>
        ) : (
          <>
            <Loader2 size={28} className="mx-auto animate-spin text-accent" />
            <h1 className="font-serif text-3xl text-foreground">Signing you in</h1>
            <p className="text-sm text-foreground/70">Please wait while we restore your session.</p>
          </>
        )}
      </div>
    </section>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <section className="min-h-screen pt-28 pb-16 flex items-center justify-center bg-background px-4">
          <div className="w-full max-w-md bg-white border border-border-custom rounded-3xl p-8 shadow-xs text-center space-y-4">
            <Loader2 size={28} className="mx-auto animate-spin text-accent" />
            <h1 className="font-serif text-3xl text-foreground">Signing you in</h1>
            <p className="text-sm text-foreground/70">Please wait while we restore your session.</p>
          </div>
        </section>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
