import { create } from "zustand";
import type { PersonalityResult } from "@/types/personality";
import type { SpotifyData, SpotifyUser } from "@/types/spotify";

interface AppState {
  // Spotify
  spotifyData: SpotifyData | null;
  setSpotifyData: (data: SpotifyData) => void;

  // Personality
  personality: PersonalityResult | null;
  setPersonality: (result: PersonalityResult) => void;

  // User
  spotifyUser: SpotifyUser | null;
  setSpotifyUser: (user: SpotifyUser | null) => void;

  // Loading state
  loadingStep: string;
  setLoadingStep: (step: string) => void;

  // Error state
  error: string | null;
  setError: (error: string | null) => void;

  // Reset
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  spotifyData: null,
  setSpotifyData: (data) => set({ spotifyData: data }),

  personality: null,
  setPersonality: (result) => set({ personality: result }),

  spotifyUser: null,
  setSpotifyUser: (user) => set({ spotifyUser: user }),

  loadingStep: "",
  setLoadingStep: (step) => set({ loadingStep: step }),

  error: null,
  setError: (error) => set({ error }),

  reset: () =>
    set({
      spotifyData: null,
      personality: null,
      spotifyUser: null,
      loadingStep: "",
      error: null,
    }),
}));
