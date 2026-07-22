import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { decryptSession } from "./lib/auth/session";
import {
  CUSTOMER_SESSION_COOKIE_NAME,
  CustomerSessionPayload,
  decryptCustomerSession,
  encryptCustomerSession,
  isCustomerSessionExpired,
} from "./lib/auth/customer-session";

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

function isCustomerProtectedPath(pathname: string) {
  return (
    pathname === "/checkout" ||
    pathname.startsWith("/checkout/") ||
    pathname === "/profile" ||
    pathname.startsWith("/profile/") ||
    pathname === "/my-orders" ||
    pathname.startsWith("/my-orders/")
  );
}

function copyCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach((cookie) => {
    to.cookies.set(cookie.name, cookie.value, {
      path: cookie.path,
      domain: cookie.domain,
      maxAge: cookie.maxAge,
      secure: cookie.secure,
      httpOnly: cookie.httpOnly,
      sameSite: cookie.sameSite as any,
    });
  });
  return to;
}

function redirectToLogin(request: NextRequest, supabaseResponse: NextResponse) {
  const loginUrl = new URL("/login", request.url);
  const nextPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  loginUrl.searchParams.set("next", nextPath);
  const response = NextResponse.redirect(loginUrl);
  
  // Copy cookies from supabaseResponse (which has the refreshed Supabase session)
  copyCookies(supabaseResponse, response);
  
  response.cookies.delete(CUSTOMER_SESSION_COOKIE_NAME);
  return response;
}

async function refreshCustomerSession(payload: CustomerSessionPayload) {
  const supabase = getAnonSupabaseClient();
  const { data, error } = await supabase.auth.refreshSession({
    refresh_token: payload.refreshToken,
  });

  if (error || !data.session) {
    return null;
  }

  return {
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token ?? payload.refreshToken,
    expiresAt: (data.session.expires_at ?? Math.floor(Date.now() / 1000)) * 1000,
    user: {
      id: data.session.user.id,
      email: data.session.user.email ?? payload.user.email,
      fullName:
        (data.session.user.user_metadata?.full_name as string | undefined) ??
        (data.session.user.user_metadata?.name as string | undefined) ??
        payload.user.fullName,
      avatarUrl:
        (data.session.user.user_metadata?.avatar_url as string | undefined) ??
        (data.session.user.user_metadata?.picture as string | undefined) ??
        payload.user.avatarUrl,
      createdAt: data.session.user.created_at ?? payload.user.createdAt,
    },
  } satisfies CustomerSessionPayload;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey) {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    // Refresh the Supabase SSR session if necessary
    await supabase.auth.getUser();
  }

  // Protect every route beginning with /admin, EXCEPT /admin/login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const sessionToken = request.cookies.get("admin_session")?.value;

    if (!sessionToken) {
      return copyCookies(supabaseResponse, NextResponse.redirect(new URL("/admin/login", request.url)));
    }

    const payload = await decryptSession(sessionToken);
    if (!payload) {
      return copyCookies(supabaseResponse, NextResponse.redirect(new URL("/admin/login", request.url)));
    }
  }

  if (isCustomerProtectedPath(pathname)) {
    const sessionToken = request.cookies.get(CUSTOMER_SESSION_COOKIE_NAME)?.value;

    if (!sessionToken) {
      return redirectToLogin(request, supabaseResponse);
    }

    const payload = await decryptCustomerSession(sessionToken);
    if (!payload) {
      return redirectToLogin(request, supabaseResponse);
    }

    if (isCustomerSessionExpired(payload)) {
      const refreshedSession = await refreshCustomerSession(payload);
      if (!refreshedSession) {
        return redirectToLogin(request, supabaseResponse);
      }

      const response = copyCookies(supabaseResponse, NextResponse.next());
      response.cookies.set(CUSTOMER_SESSION_COOKIE_NAME, await encryptCustomerSession(refreshedSession), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: Math.max(60, Math.floor((refreshedSession.expiresAt - Date.now()) / 1000)),
      });
      return response;
    }
  }

  return supabaseResponse;
}

// Config to run middleware only on relevant paths
export const config = {
  matcher: ["/admin/:path*", "/profile/:path*", "/my-orders/:path*", "/checkout/:path*"],
};

