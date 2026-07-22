import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { CustomerSessionPayload, CustomerProfileData } from "@/lib/auth/customer-session";
import { setCustomerSession, clearCustomerSession } from "@/lib/auth/customer-session-server";

function getAnonSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase client-side environment variables.");
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function toProfilePayload(session: CustomerSessionPayload, avatarUrl: string | null): CustomerProfileData {
  return {
    id: session.user.id,
    fullName: session.user.fullName,
    email: session.user.email,
    avatarUrl,
    createdAt: session.user.createdAt,
    updatedAt: new Date().toISOString(),
  };
}

async function bootstrapCustomerData(session: CustomerSessionPayload) {
  const serviceSupabase = createServerSupabaseClient();
  const fullName = session.user.fullName ?? session.user.email?.split("@")[0] ?? null;

  const { error: profileError } = await serviceSupabase
    .from("profiles")
    .upsert(
      {
        id: session.user.id,
        full_name: fullName,
        email: session.user.email,
        avatar_url: session.user.avatarUrl,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

  if (profileError) {
    console.error("Failed to bootstrap customer profile:", profileError);
  }

  return toProfilePayload(session, session.user.avatarUrl);
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const incomingSession = body.session as CustomerSessionPayload | null | undefined;

    if (!incomingSession) {
      await clearCustomerSession();
      return NextResponse.json({ success: true, session: null });
    }

    const anonSupabase = getAnonSupabaseClient();
    const { data, error } = await anonSupabase.auth.getUser(incomingSession.accessToken);

    if (error || !data.user || data.user.id !== incomingSession.user.id) {
      await clearCustomerSession();
      return NextResponse.json({ success: false, error: "Invalid session." }, { status: 401 });
    }

    const validatedSession: CustomerSessionPayload = {
      accessToken: incomingSession.accessToken,
      refreshToken: incomingSession.refreshToken,
      expiresAt: incomingSession.expiresAt,
      user: {
        id: data.user.id,
        email: data.user.email ?? incomingSession.user.email,
        fullName:
          (data.user.user_metadata?.full_name as string | undefined) ??
          (data.user.user_metadata?.name as string | undefined) ??
          incomingSession.user.fullName,
        avatarUrl:
          (data.user.user_metadata?.avatar_url as string | undefined) ??
          (data.user.user_metadata?.picture as string | undefined) ??
          incomingSession.user.avatarUrl,
        createdAt: data.user.created_at ?? incomingSession.user.createdAt,
      },
    };

    await setCustomerSession(validatedSession);
    const profile = await bootstrapCustomerData(validatedSession);

    return NextResponse.json({ success: true, session: validatedSession, profile });
  } catch (error) {
    console.error("Customer session sync error:", error);
    return NextResponse.json({ success: false, error: "Unable to sync session." }, { status: 500 });
  }
}
