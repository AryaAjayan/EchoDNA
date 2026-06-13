export interface Archetype {
  id: string;
  title: string;
  emoji: string;
  description: string;
  tagline: string;
  strengths: string[];
  weaknesses: string[];
  vibe: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    glow: string;
    gradient: string;
  };
  cinematicFeeling: string;
  icon: string;
  traits: string[];
}

export interface AlterEgo {
  name: string;
  summary: string;
  fashionAesthetic: string;
  cinematicVibe: string;
  favoriteEnvironment: string;
  quote: string;
  emoji: string;
}

export interface MoodProfile {
  energy: number;         // 0-1
  danceability: number;   // 0-1
  valence: number;        // 0-1 (happiness)
  acousticness: number;   // 0-1
  instrumentalness: number; // 0-1
  tempo: number;          // BPM
  speechiness: number;    // 0-1
  liveness: number;       // 0-1
}

export interface AuraType {
  name: string;
  color: string;
  gradient: string;
  description: string;
  emoji: string;
}

export interface GenreSlice {
  genre: string;
  percentage: number;
  color: string;
}

export interface ListeningStats {
  totalMinutes: number;
  uniqueArtists: number;
  uniqueGenres: number;
  avgPopularity: number;
  topDecade: string;
  listeningTime: string; // morning/afternoon/evening/night
}

export interface PersonalityResult {
  archetype: Archetype;
  alterEgo: AlterEgo;
  moodProfile: MoodProfile;
  aura: AuraType;
  genreDNA: GenreSlice[];
  stats: ListeningStats;
  summary: string;
  socialVibe: string;
  compatibleWith: string[];
  cinematicSummary: string;
  topArtistNames: string[];
  topTrackNames: string[];
  generatedAt: string;
}

export type PersonalityState =
  | "idle"
  | "connecting"
  | "fetching"
  | "analyzing"
  | "generating"
  | "complete"
  | "error";
