import type { SpotifyData, SpotifyTokens, SpotifyArtist, SpotifyTrack, AudioFeatures, RecentlyPlayed, SpotifyUser } from "@/types/spotify";

const SPOTIFY_BASE = "https://api.spotify.com/v1";
const TOKEN_URL = "https://accounts.spotify.com/api/token";

// Safe fetch with timeout and retry
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs = 8000
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

// Refresh Spotify access token
export async function refreshAccessToken(refreshToken: string): Promise<SpotifyTokens | null> {
  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;

  if (!clientId || !clientSecret) return null;

  try {
    const res = await fetchWithTimeout(TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();

    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token || refreshToken,
      expires_at: Date.now() + data.expires_in * 1000,
      token_type: data.token_type,
      scope: data.scope,
    };
  } catch {
    return null;
  }
}

// Spotify API client
class SpotifyClient {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  private async get<T>(path: string): Promise<T | null> {
    try {
      const res = await fetchWithTimeout(`${SPOTIFY_BASE}${path}`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });

      if (res.status === 401) throw new Error("UNAUTHORIZED");
      if (res.status === 429) {
        // Rate limited — return null gracefully
        return null;
      }
      if (!res.ok) return null;

      const text = await res.text();
      if (!text) return null;

      return JSON.parse(text) as T;
    } catch (err) {
      if (err instanceof Error && err.message === "UNAUTHORIZED") throw err;
      return null;
    }
  }

  async getUser(): Promise<SpotifyUser | null> {
    return this.get<SpotifyUser>("/me");
  }

  async getTopArtists(timeRange = "medium_term", limit = 20): Promise<SpotifyArtist[]> {
    const data = await this.get<{ items: SpotifyArtist[] }>(
      `/me/top/artists?time_range=${timeRange}&limit=${limit}`
    );
    return Array.isArray(data?.items) ? data.items : [];
  }

  async getTopTracks(timeRange = "medium_term", limit = 20): Promise<SpotifyTrack[]> {
    const data = await this.get<{ items: SpotifyTrack[] }>(
      `/me/top/tracks?time_range=${timeRange}&limit=${limit}`
    );
    return Array.isArray(data?.items) ? data.items : [];
  }

  async getRecentlyPlayed(limit = 20): Promise<RecentlyPlayed[]> {
    const data = await this.get<{ items: RecentlyPlayed[] }>(
      `/me/player/recently-played?limit=${limit}`
    );
    return Array.isArray(data?.items) ? data.items : [];
  }

  async getAudioFeatures(trackIds: string[]): Promise<AudioFeatures[]> {
    if (!trackIds || trackIds.length === 0) return [];

    // Spotify allows max 100 IDs per request
    const ids = trackIds.slice(0, 50).join(",");
    const data = await this.get<{ audio_features: (AudioFeatures | null)[] }>(
      `/audio-features?ids=${ids}`
    );

    if (!Array.isArray(data?.audio_features)) return [];
    return data.audio_features.filter(
      (f): f is AudioFeatures => f !== null && typeof f === "object"
    );
  }
}

// Main function to fetch all Spotify data
export async function fetchSpotifyData(accessToken: string): Promise<SpotifyData> {
  const client = new SpotifyClient(accessToken);

  const result: SpotifyData = {
    user: null,
    topTracks: [],
    topArtists: [],
    recentlyPlayed: [],
    audioFeatures: [],
    genres: [],
    isPartial: false,
  };

  try {
    // Fetch all data in parallel with individual error handling
    const [user, topArtists, topTracks, recentlyPlayed] = await Promise.allSettled([
      client.getUser(),
      client.getTopArtists("medium_term", 20),
      client.getTopTracks("medium_term", 20),
      client.getRecentlyPlayed(20),
    ]);

    result.user = user.status === "fulfilled" ? user.value : null;
    result.topArtists = topArtists.status === "fulfilled" ? (topArtists.value ?? []) : [];
    result.topTracks = topTracks.status === "fulfilled" ? (topTracks.value ?? []) : [];
    result.recentlyPlayed = recentlyPlayed.status === "fulfilled" ? (recentlyPlayed.value ?? []) : [];

    // Check if we have partial data
    const anyFailed = [user, topArtists, topTracks, recentlyPlayed].some(
      (r) => r.status === "rejected"
    );
    if (anyFailed) result.isPartial = true;

    // Fetch audio features if we have tracks
    if (result.topTracks.length > 0) {
      const trackIds = result.topTracks.map((t) => t.id).filter(Boolean);
      try {
        result.audioFeatures = await client.getAudioFeatures(trackIds);
      } catch {
        result.isPartial = true;
      }
    }

    // Extract genres from artists
    const genreSet = new Set<string>();
    result.topArtists.forEach((artist) => {
      if (Array.isArray(artist.genres)) {
        artist.genres.forEach((g) => {
          if (g && typeof g === "string") genreSet.add(g.toLowerCase());
        });
      }
    });
    result.genres = Array.from(genreSet);

    return result;
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return { ...result, error: "UNAUTHORIZED" };
    }

    return { ...result, error: "FETCH_FAILED", isPartial: true };
  }
}

// Build Spotify auth URL
export function getSpotifyAuthUrl(state: string): string {
  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI!;

  const scopes = [
    "user-top-read",
    "user-read-recently-played",
    "user-read-private",
    "user-read-email",
  ].join(" ");

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope: scopes,
    redirect_uri: redirectUri,
    state,
    show_dialog: "true",
  });

  return `https://accounts.spotify.com/authorize?${params}`;
}

// Exchange auth code for tokens
export async function exchangeCodeForTokens(code: string): Promise<SpotifyTokens | null> {
  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI!;

  try {
    const res = await fetchWithTimeout(TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: Date.now() + data.expires_in * 1000,
      token_type: data.token_type,
      scope: data.scope,
    };
  } catch {
    return null;
  }
}
