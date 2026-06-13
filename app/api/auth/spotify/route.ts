import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSpotifyAuthUrl } from "@/lib/spotify";
import { randomBytes } from "crypto";

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  try {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

    const isPlaceholder = !clientId || !redirectUri || clientId.includes("your_") || redirectUri.includes("your_");

    if (isPlaceholder) {
      return NextResponse.redirect(
        new URL("/auth-error?reason=spotify_credentials_not_configured", appUrl)
      );
    }

    // Generate state for CSRF protection
    const state = randomBytes(16).toString("hex");

    // Store state in cookie
    const cookieStore = await cookies();
    cookieStore.set("spotify_auth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600, // 10 minutes
      path: "/",
    });

    const authUrl = getSpotifyAuthUrl(state);

    return NextResponse.redirect(authUrl);
  } catch {
    return NextResponse.redirect(
      new URL("/auth-error?reason=auth_init_failed", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000")
    );
  }
}
