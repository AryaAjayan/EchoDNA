import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { fetchSpotifyData, refreshAccessToken } from "@/lib/spotify";
import { analyzePersonality } from "@/lib/personality-engine";

export async function GET() {
  try {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("spotify_access_token")?.value;
    const refreshToken = cookieStore.get("spotify_refresh_token")?.value;
    const expiresAt = cookieStore.get("spotify_expires_at")?.value;

    // No tokens — not authenticated
    if (!accessToken && !refreshToken) {
      return NextResponse.json({ error: "NOT_AUTHENTICATED" }, { status: 401 });
    }

    let token = accessToken;

    // Check if token is expired
    if (expiresAt && Date.now() > Number(expiresAt) - 30000) {
      if (!refreshToken) {
        return NextResponse.json({ error: "TOKEN_EXPIRED" }, { status: 401 });
      }

      const newTokens = await refreshAccessToken(refreshToken);
      if (!newTokens) {
        return NextResponse.json({ error: "REFRESH_FAILED" }, { status: 401 });
      }

      token = newTokens.access_token;

      // Update cookies
      cookieStore.set("spotify_access_token", newTokens.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 3600,
        path: "/",
      });
      cookieStore.set("spotify_expires_at", String(newTokens.expires_at), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 3600,
        path: "/",
      });
    }

    if (!token) {
      return NextResponse.json({ error: "NO_TOKEN" }, { status: 401 });
    }

    const spotifyData = await fetchSpotifyData(token);

    if (spotifyData.error === "UNAUTHORIZED") {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const personality = analyzePersonality(spotifyData);

    return NextResponse.json({
      spotify: spotifyData,
      personality,
    });
  } catch {
    return NextResponse.json(
      { error: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

// Sign out — clear tokens
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("spotify_access_token");
  cookieStore.delete("spotify_refresh_token");
  cookieStore.delete("spotify_expires_at");
  return NextResponse.json({ success: true });
}
