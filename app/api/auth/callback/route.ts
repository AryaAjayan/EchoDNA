import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { exchangeCodeForTokens } from "@/lib/spotify";

export async function GET(request: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const { searchParams } = new URL(request.url);

  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  // Handle user cancellation
  if (error === "access_denied") {
    return NextResponse.redirect(`${appUrl}/?auth=cancelled`);
  }

  // Handle other OAuth errors
  if (error) {
    return NextResponse.redirect(`${appUrl}/auth-error?reason=${encodeURIComponent(error)}`);
  }

  // Validate required params
  if (!code || !state) {
    return NextResponse.redirect(`${appUrl}/auth-error?reason=missing_params`);
  }

  // Validate CSRF state
  const cookieStore = await cookies();
  const storedState = cookieStore.get("spotify_auth_state")?.value;

  if (!storedState || storedState !== state) {
    return NextResponse.redirect(`${appUrl}/auth-error?reason=state_mismatch`);
  }

  // Clear state cookie
  cookieStore.delete("spotify_auth_state");

  // Exchange code for tokens
  const tokens = await exchangeCodeForTokens(code);

  if (!tokens) {
    return NextResponse.redirect(`${appUrl}/auth-error?reason=token_exchange_failed`);
  }

  // Store tokens in secure cookies
  cookieStore.set("spotify_access_token", tokens.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 3600,
    path: "/",
  });

  cookieStore.set("spotify_refresh_token", tokens.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 3600, // 30 days
    path: "/",
  });

  cookieStore.set("spotify_expires_at", String(tokens.expires_at), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 3600,
    path: "/",
  });

  // Redirect to loading page
  return NextResponse.redirect(`${appUrl}/loading`);
}
