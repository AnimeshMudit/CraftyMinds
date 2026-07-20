"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { CustomerSessionPayload } from "@/lib/auth/customer-session";

export interface CustomerProfileState {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

interface CustomerAuthContextValue {
  session: Session | null;
  user: User | null;
  profile: CustomerProfileState | null;
  isLoading: boolean;
  refreshProfile: (sessionOverride?: Session | null) => Promise<void>;
  syncSession: (session: Session | null) => Promise<void>;
  signOut: () => Promise<void>;
}

const CustomerAuthContext = createContext<CustomerAuthContextValue | undefined>(undefined);

export function buildCustomerSessionPayload(session: Session): CustomerSessionPayload {
  return {
    accessToken: session.access_token,
    refreshToken: session.refresh_token ?? "",
    expiresAt: (session.expires_at ?? Math.floor(Date.now() / 1000)) * 1000,
    user: {
      id: session.user.id,
      email: session.user.email ?? null,
      fullName:
        (session.user.user_metadata?.full_name as string | undefined) ??
        (session.user.user_metadata?.name as string | undefined) ??
        session.user.email ?? null,
      avatarUrl:
        (session.user.user_metadata?.avatar_url as string | undefined) ??
        (session.user.user_metadata?.picture as string | undefined) ??
        null,
      createdAt: session.user.created_at ?? null,
    },
  };
}

async function pushSessionToServer(session: Session | null) {
  await fetch("/api/auth/session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ session: session ? buildCustomerSessionPayload(session) : null }),
  });
}

async function clearSessionOnServer() {
  await fetch("/api/auth/logout", {
    method: "POST",
  });
}

async function syncSessionToServerIfNeeded(
  session: Session | null,
  lastSyncedAccessTokenRef: React.MutableRefObject<string | null>
) {
  if (!session) {
    lastSyncedAccessTokenRef.current = null;
    await clearSessionOnServer();
    return;
  }

  if (lastSyncedAccessTokenRef.current === session.access_token) {
    return;
  }

  // The loop came from re-registering the auth listener on every session change,
  // which caused Supabase to immediately emit the current session again.
  // We only sync when the access token actually changes.
  await pushSessionToServer(session);
  lastSyncedAccessTokenRef.current = session.access_token;
}

export function CustomerAuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<CustomerProfileState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const sessionRef = useRef<Session | null>(null);
  const lastSyncedAccessTokenRef = useRef<string | null>(null);

  const user = session?.user ?? null;
  sessionRef.current = session;

  const refreshProfile = useCallback(async (sessionOverride?: Session | null) => {
    const activeSession = sessionOverride ?? sessionRef.current;

    if (!activeSession?.user) {
      setProfile(null);
      return;
    }

    try {
      const response = await fetch("/api/customer/profile", { method: "GET" });
      if (!response.ok) {
        throw new Error("Failed to load profile.");
      }

      const data = await response.json();
      setProfile(data.profile ?? null);
    } catch (error) {
      console.error("Failed to refresh profile:", error);
      setProfile({
        id: activeSession.user.id,
        full_name: activeSession.user.user_metadata?.full_name ?? activeSession.user.email ?? null,
        email: activeSession.user.email ?? null,
        avatar_url: activeSession.user.user_metadata?.avatar_url ?? activeSession.user.user_metadata?.picture ?? null,
        created_at: activeSession.user.created_at ?? null,
        updated_at: null,
      });
    }
  }, []);

  const syncSession = useCallback(async (nextSession: Session | null) => {
    setSession(nextSession);
    sessionRef.current = nextSession;

    if (nextSession) {
      await syncSessionToServerIfNeeded(nextSession, lastSyncedAccessTokenRef);
      await refreshProfile(nextSession);
      return;
    }

    setProfile(null);
    lastSyncedAccessTokenRef.current = null;
    await clearSessionOnServer();
  }, [refreshProfile]);

  useEffect(() => {
    let isActive = true;

    const initialize = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!isActive) return;

        const initialSession = data.session ?? null;
        setSession(initialSession);
        sessionRef.current = initialSession;

        if (initialSession) {
          await syncSessionToServerIfNeeded(initialSession, lastSyncedAccessTokenRef);
          await refreshProfile(initialSession);
        }
      } catch (error) {
        console.error("Failed to initialize customer auth session:", error);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void initialize();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, nextSession) => {
      if (!isActive) return;

      if (event === "SIGNED_OUT") {
        setSession(null);
        sessionRef.current = null;
        setProfile(null);
        lastSyncedAccessTokenRef.current = null;
        await clearSessionOnServer();
        return;
      }

      if (nextSession) {
        setSession(nextSession);
        sessionRef.current = nextSession;
        await syncSessionToServerIfNeeded(nextSession, lastSyncedAccessTokenRef);
        await refreshProfile(nextSession);
      }
    });

    return () => {
      isActive = false;
      authListener.subscription.unsubscribe();
    };
  }, [refreshProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    sessionRef.current = null;
    setProfile(null);
    lastSyncedAccessTokenRef.current = null;
    await clearSessionOnServer();
  }, []);

  const value = useMemo<CustomerAuthContextValue>(
    () => ({
      session,
      user,
      profile,
      isLoading,
      refreshProfile,
      syncSession,
      signOut,
    }),
    [session, user, profile, isLoading, refreshProfile, syncSession, signOut]
  );

  return <CustomerAuthContext.Provider value={value}>{children}</CustomerAuthContext.Provider>;
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error("useCustomerAuth must be used within a CustomerAuthProvider");
  }

  return context;
}
