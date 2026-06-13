export interface SpotifyImage {
  url: string;
  height: number | null;
  width: number | null;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  genres: string[];
  images: SpotifyImage[];
  popularity: number;
  followers?: { total: number };
  external_urls: { spotify: string };
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ id: string; name: string }>;
  album: {
    id: string;
    name: string;
    images: SpotifyImage[];
  };
  popularity: number;
  duration_ms: number;
  external_urls: { spotify: string };
}

export interface AudioFeatures {
  id: string;
  danceability: number;
  energy: number;
  key: number;
  loudness: number;
  mode: number;
  speechiness: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  valence: number;
  tempo: number;
  duration_ms: number;
  time_signature: number;
}

export interface RecentlyPlayed {
  track: SpotifyTrack;
  played_at: string;
}

export interface SpotifyUser {
  id: string;
  display_name: string | null;
  email: string;
  images: SpotifyImage[];
  country: string;
  followers: { total: number };
  product: string;
}

export interface SpotifyTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  token_type: string;
  scope: string;
}

export interface SpotifyData {
  user: SpotifyUser | null;
  topTracks: SpotifyTrack[];
  topArtists: SpotifyArtist[];
  recentlyPlayed: RecentlyPlayed[];
  audioFeatures: AudioFeatures[];
  genres: string[];
  error?: string;
  isPartial?: boolean;
}

export type TimeRange = "short_term" | "medium_term" | "long_term";
