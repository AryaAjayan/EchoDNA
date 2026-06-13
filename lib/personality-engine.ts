/**
 * EchoDNA Personality Analysis Engine
 * 
 * This module contains the core deterministic scoring algorithms to calculate 
 * the user's musical genome (Genre DNA), emotional profile (Mood Spectrum), 
 * listening archetypes, and music alter ego.
 * 
 * Algorithm Steps:
 * 1. Extract, normalize, and frequency-sort listening genres.
 * 2. Calculate mean values for core audio features (valence, energy, tempo, etc.).
 * 3. Map values to 8 defined archetypes using Euclidean matching distances.
 * 4. Generate visual representation parameters (aura gradients, Recharts data shapes).
 */

import type {
  SpotifyData,
  SpotifyArtist,
  AudioFeatures,
} from "@/types/spotify";
import type {
  PersonalityResult,
  Archetype,
  AlterEgo,
  MoodProfile,
  AuraType,
  GenreSlice,
  ListeningStats,
} from "@/types/personality";
import {
  ARCHETYPES,
  GENRE_COLOR_PALETTE,
  GENRE_COLORS,
} from "@/lib/archetypes";

// Safe number helper — never return NaN or undefined
function safeNum(val: unknown, fallback = 0): number {
  const n = Number(val);
  return isNaN(n) || !isFinite(n) ? fallback : n;
}

// Clamp value between min and max
function clamp(val: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, val));
}

// Extract genres from artists with deduplication
function extractGenres(artists: SpotifyArtist[]): string[] {
  const genreCount: Record<string, number> = {};

  artists.forEach((artist) => {
    if (!Array.isArray(artist.genres)) return;
    artist.genres.forEach((genre) => {
      if (!genre || typeof genre !== "string") return;
      const normalized = genre.toLowerCase().trim();
      genreCount[normalized] = (genreCount[normalized] || 0) + 1;
    });
  });

  return Object.entries(genreCount)
    .sort((a, b) => b[1] - a[1])
    .map(([genre]) => genre);
}

// Build mood profile from audio features
function buildMoodProfile(features: AudioFeatures[]): MoodProfile {
  if (!features || features.length === 0) {
    return {
      energy: 0.5,
      danceability: 0.5,
      valence: 0.5,
      acousticness: 0.3,
      instrumentalness: 0.1,
      tempo: 120,
      speechiness: 0.1,
      liveness: 0.15,
    };
  }

  const valid = features.filter((f) => f && typeof f === "object");
  if (valid.length === 0) {
    return {
      energy: 0.5,
      danceability: 0.5,
      valence: 0.5,
      acousticness: 0.3,
      instrumentalness: 0.1,
      tempo: 120,
      speechiness: 0.1,
      liveness: 0.15,
    };
  }

  const avg = (key: keyof AudioFeatures) =>
    valid.reduce((sum, f) => sum + safeNum(f[key]), 0) / valid.length;

  return {
    energy: clamp(avg("energy")),
    danceability: clamp(avg("danceability")),
    valence: clamp(avg("valence")),
    acousticness: clamp(avg("acousticness")),
    instrumentalness: clamp(avg("instrumentalness")),
    tempo: clamp(avg("tempo"), 60, 200),
    speechiness: clamp(avg("speechiness")),
    liveness: clamp(avg("liveness")),
  };
}

// Score each archetype based on mood profile and genres
function scoreArchetype(
  archetypeId: string,
  mood: MoodProfile,
  genres: string[]
): number {
  let score = 0;
  const genreStr = genres.join(" ").toLowerCase();

  switch (archetypeId) {
    case "midnight_dreamer":
      score += (1 - mood.energy) * 30;
      score += mood.acousticness * 20;
      score += (1 - mood.valence) * 15;
      if (genreStr.includes("lo-fi") || genreStr.includes("ambient") || genreStr.includes("sleep")) score += 25;
      if (genreStr.includes("indie") || genreStr.includes("dream")) score += 15;
      break;

    case "neon_rebel":
      score += mood.energy * 35;
      score += mood.danceability * 15;
      score += (1 - mood.acousticness) * 15;
      if (genreStr.includes("electronic") || genreStr.includes("edm") || genreStr.includes("techno")) score += 20;
      if (genreStr.includes("rock") || genreStr.includes("punk") || genreStr.includes("metal")) score += 15;
      break;

    case "indie_philosopher":
      score += mood.acousticness * 20;
      score += (1 - mood.danceability) * 10;
      if (genreStr.includes("indie") || genreStr.includes("alternative")) score += 35;
      if (genreStr.includes("folk") || genreStr.includes("singer-songwriter")) score += 20;
      break;

    case "emotional_astronaut":
      score += mood.valence * 10;
      score += mood.energy * 20;
      score += (1 - mood.acousticness) * 10;
      if (genreStr.includes("pop") || genreStr.includes("anthemic")) score += 20;
      if (genreStr.includes("k-pop") || genreStr.includes("dance")) score += 15;
      if (mood.energy > 0.6 && mood.valence > 0.5) score += 20;
      break;

    case "chaos_curator":
      // High genre diversity
      const uniqueGenreCount = genres.length;
      score += Math.min(uniqueGenreCount * 3, 40);
      score += mood.danceability * 15;
      if (uniqueGenreCount > 8) score += 20;
      break;

    case "vintage_romantic":
      score += mood.acousticness * 25;
      score += (1 - mood.energy) * 15;
      if (genreStr.includes("jazz") || genreStr.includes("soul") || genreStr.includes("blues")) score += 35;
      if (genreStr.includes("classic") || genreStr.includes("oldies") || genreStr.includes("motown")) score += 20;
      break;

    case "sonic_explorer":
      // High genre variety, world music
      score += Math.min(genres.length * 2, 30);
      if (genreStr.includes("world") || genreStr.includes("latin") || genreStr.includes("afro")) score += 25;
      if (genreStr.includes("reggae") || genreStr.includes("bossa") || genreStr.includes("flamenco")) score += 20;
      score += mood.acousticness * 10;
      break;

    case "melancholy_poet":
      score += (1 - mood.valence) * 35;
      score += mood.acousticness * 20;
      score += (1 - mood.energy) * 20;
      if (genreStr.includes("sad") || genreStr.includes("emo") || genreStr.includes("slowcore")) score += 25;
      if (genreStr.includes("indie folk") || genreStr.includes("chamber")) score += 15;
      break;
  }

  return score;
}

// Determine archetype from mood and genres
function determineArchetype(mood: MoodProfile, genres: string[]): Archetype {
  const scores = Object.keys(ARCHETYPES).map((id) => ({
    id,
    score: scoreArchetype(id, mood, genres),
  }));

  scores.sort((a, b) => b.score - a.score);
  const winner = scores[0];

  return ARCHETYPES[winner.id] || ARCHETYPES.emotional_astronaut;
}

// Generate alter ego based on archetype
function generateAlterEgo(
  archetype: Archetype,
  topArtists: string[]
): AlterEgo {
  const alterEgos: Record<string, AlterEgo> = {
    midnight_dreamer: {
      name: "Luna Vale",
      summary: "A neon-lit night wanderer who romanticizes city lights and rainy midnight drives, turning every quiet moment into a cinematic memory.",
      fashionAesthetic: "Oversized vintage coats, silver jewelry, dark academia meets streetwear",
      cinematicVibe: "Lost in Translation meets Drive",
      favoriteEnvironment: "24-hour diners, empty rooftops at 3am, rain-soaked alleyways",
      quote: "The city speaks in frequencies most people sleep through.",
      emoji: "🌙",
    },
    neon_rebel: {
      name: "Zyx Voltage",
      summary: "A high-voltage sonic rebel who turns up every room they walk into. Rules are suggestions; tempo is law.",
      fashionAesthetic: "Leather jackets, neon accents, chrome accessories",
      cinematicVibe: "Mad Max meets Blade Runner 2049",
      favoriteEnvironment: "Underground clubs, festival mosh pits, abandoned warehouses with strobes",
      quote: "If it doesn't shake the walls, turn it up.",
      emoji: "⚡",
    },
    indie_philosopher: {
      name: "Ori Sage",
      summary: "A quietly brilliant taste-maker whose playlists read like philosophical manifestos. Finds meaning where algorithms see noise.",
      fashionAesthetic: "Thrifted flannels, vintage band tees, round wire-frame glasses",
      cinematicVibe: "Eternal Sunshine of the Spotless Mind",
      favoriteEnvironment: "Independent bookshops, art gallery openings, vinyl record stores",
      quote: "Every B-side is someone's favorite song.",
      emoji: "🎭",
    },
    emotional_astronaut: {
      name: "Nova Stellis",
      summary: "Floating through emotions like a cosmonaut through galaxies — awed by everything, afraid of nothing, feeling it all simultaneously.",
      fashionAesthetic: "Bright colors that clash beautifully, statement pieces, unashamed shine",
      cinematicVibe: "Interstellar meets a stadium concert",
      favoriteEnvironment: "Open fields under stars, rooftop sunrises, first rows at concerts",
      quote: "I never apologize for feeling too much. That's just being alive.",
      emoji: "🚀",
    },
    chaos_curator: {
      name: "Echo Riot",
      summary: "Genre is a cage. Echo Riot has the key. Their playlist is an unsolved equation that somehow equals perfection.",
      fashionAesthetic: "Deliberately clashing patterns, DIY punk meets Y2K fashion",
      cinematicVibe: "Everything Everywhere All at Once",
      favoriteEnvironment: "Art installations, experimental pop-up events, anywhere unexpected",
      quote: "My playlist is a mood board for a movie that doesn't exist yet.",
      emoji: "🎲",
    },
    vintage_romantic: {
      name: "Scarlet Muse",
      summary: "A time traveler who chose to stay in every beautiful era simultaneously. Their love language is a perfectly curated vinyl set.",
      fashionAesthetic: "Vintage silhouettes, warm textures, red lipstick, timeless classics",
      cinematicVibe: "La La Land meets Midnight in Paris",
      favoriteEnvironment: "Jazz clubs, candlelit restaurants, libraries with velvet chairs",
      quote: "Some sounds never get old because some feelings never do.",
      emoji: "🌹",
    },
    sonic_explorer: {
      name: "Atlas Ravi",
      summary: "A sonic cartographer mapping the world one sound at a time. No border can contain a playlist this boundless.",
      fashionAesthetic: "Global-inspired textiles, travel patches, comfortable and cultural",
      cinematicVibe: "Baraka meets a world music festival documentary",
      favoriteEnvironment: "Airport lounges, rooftop bars in foreign cities, anywhere new",
      quote: "Every sound is a passport stamp.",
      emoji: "🌍",
    },
    melancholy_poet: {
      name: "Grey Cipher",
      summary: "Transforms sadness into something so beautiful it almost hurts less. Their music isn't about despair — it's about the grace in feeling deeply.",
      fashionAesthetic: "Soft grays and blacks, poetry books in back pockets, minimalist layers",
      cinematicVibe: "Call Me by Your Name meets Manchester by the Sea",
      favoriteEnvironment: "Rainy windows, empty museums, quiet cafés in November",
      quote: "The ache is where the art lives.",
      emoji: "🖋️",
    },
  };

  return alterEgos[archetype.id] || alterEgos.emotional_astronaut;
}

// Determine aura type
function determineAura(mood: MoodProfile, archetype: Archetype): AuraType {
  const auras = [
    {
      condition: mood.energy > 0.7 && mood.valence > 0.6,
      aura: {
        name: "Solar Aura",
        color: "#FFC107",
        gradient: "linear-gradient(135deg, #FF6B35, #FFC107, #FFE082)",
        description: "Radiating warmth and unstoppable positive energy. You light up every room.",
        emoji: "☀️",
      },
    },
    {
      condition: mood.energy < 0.4 && mood.acousticness > 0.5,
      aura: {
        name: "Lunar Aura",
        color: "#C4B5FD",
        gradient: "linear-gradient(135deg, #4C1D95, #7C3AED, #C4B5FD)",
        description: "Quietly powerful and deeply reflective. You carry moonlight wherever you go.",
        emoji: "🌙",
      },
    },
    {
      condition: mood.valence < 0.35,
      aura: {
        name: "Indigo Aura",
        color: "#6366F1",
        gradient: "linear-gradient(135deg, #1E1B4B, #4338CA, #818CF8)",
        description: "Beautiful and complex — you feel the world more intensely than most dare to.",
        emoji: "💜",
      },
    },
    {
      condition: mood.danceability > 0.7,
      aura: {
        name: "Prism Aura",
        color: "#EC4899",
        gradient: "linear-gradient(135deg, #831843, #EC4899, #F9A8D4)",
        description: "Electric and magnetic — when you enter, the whole room shifts its orbit.",
        emoji: "✨",
      },
    },
    {
      condition: mood.acousticness > 0.6 && mood.energy < 0.5,
      aura: {
        name: "Forest Aura",
        color: "#10B981",
        gradient: "linear-gradient(135deg, #064E3B, #059669, #6EE7B7)",
        description: "Grounded and genuine — as authentic as an acoustic guitar in a quiet room.",
        emoji: "🌿",
      },
    },
    {
      condition: mood.energy > 0.6 && mood.valence < 0.5,
      aura: {
        name: "Storm Aura",
        color: "#0EA5E9",
        gradient: "linear-gradient(135deg, #0C4A6E, #0EA5E9, #7DD3FC)",
        description: "Turbulent and beautiful — channeling intensity into something magnificent.",
        emoji: "⚡",
      },
    },
  ];

  const matched = auras.find((a) => a.condition);
  if (matched) return matched.aura;

  return {
    name: "Nova Aura",
    color: "#F97316",
    gradient: "linear-gradient(135deg, #431407, #F97316, #FED7AA)",
    description: "A rare and singular energy — undefined by any single emotion, defying all boxes.",
    emoji: "🌟",
  };
}

// Build genre DNA slices
function buildGenreDNA(genres: string[]): GenreSlice[] {
  if (!genres || genres.length === 0) {
    return [{ genre: "Genre Explorer", percentage: 100, color: GENRE_COLOR_PALETTE[0] }];
  }

  const top = genres.slice(0, 8);
  const total = top.length;

  // Weighted distribution (more weight to top genres)
  const weights = top.map((_, i) => Math.pow(0.65, i));
  const weightSum = weights.reduce((a, b) => a + b, 0);

  return top.map((genre, i) => {
    const percentage = Math.round((weights[i] / weightSum) * 100);
    const colorKey = Object.keys(GENRE_COLORS).find(
      (k) => genre.includes(k) || k.includes(genre.split(" ")[0])
    );
    const color = colorKey
      ? GENRE_COLORS[colorKey]
      : GENRE_COLOR_PALETTE[i % GENRE_COLOR_PALETTE.length];

    return {
      genre: genre
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      percentage,
      color,
    };
  });
}

// Build listening stats
function buildStats(data: SpotifyData): ListeningStats {
  const totalMinutes = data.topTracks.reduce(
    (sum, t) => sum + safeNum(t.duration_ms) / 60000,
    0
  );

  const uniqueArtists = new Set(
    data.topTracks.flatMap((t) => t.artists.map((a) => a.id))
  ).size;

  const avgPopularity =
    data.topArtists.length > 0
      ? Math.round(
          data.topArtists.reduce((sum, a) => sum + safeNum(a.popularity), 0) /
            data.topArtists.length
        )
      : 50;

  return {
    totalMinutes: Math.round(totalMinutes),
    uniqueArtists: Math.max(uniqueArtists, data.topArtists.length),
    uniqueGenres: data.genres.length,
    avgPopularity,
    topDecade: "2020s", // Could be computed from release dates
    listeningTime: "night", // Could be computed from timestamps
  };
}

// Main personality engine
export function analyzePersonality(data: SpotifyData): PersonalityResult {
  const isEmptyHistory = (!data.topTracks || data.topTracks.length === 0) &&
                        (!data.topArtists || data.topArtists.length === 0) &&
                        (!data.recentlyPlayed || data.recentlyPlayed.length === 0);

  if (isEmptyHistory) {
    const emptyArchetype: Archetype = {
      id: "blank_slate",
      title: "Sonic Embryo",
      emoji: "🥚",
      description: "It looks like this Spotify account is brand new or hasn't listened to enough music recently! Start playing some songs, then refresh to see your real musical archetype.",
      tagline: "A blank slate waiting for the first beat.",
      strengths: ["Infinite Potential", "Open Mindedness"],
      weaknesses: ["No streaming history", "Quiet profile"],
      vibe: "Silence & Anticipation",
      colors: {
        primary: "#9ca3af",
        secondary: "#6b7280",
        accent: "#f3f4f6",
        glow: "#d1d5db",
        gradient: "linear-gradient(135deg, #1f2937, #111827)",
      },
      cinematicFeeling: "The quiet before the concert starts.",
      icon: "Circle",
      traits: ["Blank Slate", "Silent", "Mystery"],
    };

    const emptyAlterEgo: AlterEgo = {
      name: "The Silent Listener",
      summary: "Waiting for the first note to define your style.",
      fashionAesthetic: "Minimalist black and white, clean lines",
      cinematicVibe: "A quiet room at dawn",
      favoriteEnvironment: "A quiet park, early morning study desks",
      quote: "Silence is a source of great strength.",
      emoji: "🤫",
    };

    return {
      archetype: emptyArchetype,
      alterEgo: emptyAlterEgo,
      moodProfile: {
        energy: 0,
        danceability: 0,
        valence: 0,
        acousticness: 0,
        instrumentalness: 0,
        tempo: 0,
        speechiness: 0,
        liveness: 0,
      },
      aura: {
        name: "Neutral Aura",
        color: "#9ca3af",
        gradient: "linear-gradient(135deg, #4b5563, #9ca3af)",
        description: "Your aura is waiting for your music selection to light up.",
        emoji: "⚪",
      },
      genreDNA: [{ genre: "Silent Space", percentage: 100, color: "#9ca3af" }],
      stats: {
        totalMinutes: 0,
        uniqueArtists: 0,
        uniqueGenres: 0,
        avgPopularity: 0,
        topDecade: "None",
        listeningTime: "None",
      },
      summary: "Your Spotify profile has no active listening history. Stream some music to generate your EchoDNA!",
      socialVibe: "You're the quiet one in the conversation, taking it all in.",
      compatibleWith: ["Sonic Explorer"],
      cinematicSummary: "The quiet before the concert starts.",
      topArtistNames: [],
      topTrackNames: [],
      generatedAt: new Date().toISOString(),
    };
  }

  // Extract and normalize data
  const genres = extractGenres(data.topArtists || []);
  const allGenres = [...new Set([...genres, ...(data.genres || [])])];

  const mood = buildMoodProfile(data.audioFeatures || []);
  const archetype = determineArchetype(mood, allGenres);
  const alterEgo = generateAlterEgo(
    archetype,
    (data.topArtists || []).slice(0, 3).map((a) => a.name)
  );
  const aura = determineAura(mood, archetype);
  const genreDNA = buildGenreDNA(allGenres);
  const stats = buildStats(data);

  const topArtistNames = (data.topArtists || [])
    .slice(0, 5)
    .map((a) => a.name)
    .filter(Boolean);

  const topTrackNames = (data.topTracks || [])
    .slice(0, 5)
    .map((t) => t.name)
    .filter(Boolean);

  const energyDesc =
    mood.energy > 0.65
      ? "high-energy"
      : mood.energy > 0.35
      ? "balanced"
      : "introspective";

  const valenceDesc =
    mood.valence > 0.65
      ? "joyful"
      : mood.valence > 0.35
      ? "complex"
      : "melancholic";

  const summary = `Your music taste reveals a ${energyDesc}, ${valenceDesc} personality with a deep ${allGenres[0] || "eclectic"} DNA. You gravitate toward ${archetype.vibe} vibes and your emotional spectrum spans ${aura.description.toLowerCase()}`;

  const socialVibe =
    mood.energy > 0.6
      ? "You bring the energy to every room — the one who sets the vibe."
      : mood.valence < 0.4
      ? "You're the one people come to when they need to feel understood."
      : "You're the friend who always has the perfect song for the moment.";

  const compatibleWith = [
    Object.values(ARCHETYPES)
      .filter((a) => a.id !== archetype.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2)
      .map((a) => a.title),
  ].flat();

  return {
    archetype,
    alterEgo,
    moodProfile: mood,
    aura,
    genreDNA,
    stats,
    summary,
    socialVibe,
    compatibleWith,
    cinematicSummary: archetype.cinematicFeeling,
    topArtistNames,
    topTrackNames,
    generatedAt: new Date().toISOString(),
  };
}

// Generate demo personality result for unauthenticated users
export function generateDemoPersonality(): PersonalityResult {
  const demoData: SpotifyData = {
    user: null,
    topTracks: [],
    topArtists: [
      {
        id: "demo1",
        name: "The Weeknd",
        genres: ["r&b", "pop", "dark pop"],
        images: [],
        popularity: 95,
        external_urls: { spotify: "#" },
      },
      {
        id: "demo2",
        name: "Billie Eilish",
        genres: ["indie pop", "electropop", "dark pop"],
        images: [],
        popularity: 90,
        external_urls: { spotify: "#" },
      },
    ],
    recentlyPlayed: [],
    audioFeatures: [
      {
        id: "demo1",
        danceability: 0.6,
        energy: 0.45,
        key: 1,
        loudness: -7,
        mode: 0,
        speechiness: 0.05,
        acousticness: 0.3,
        instrumentalness: 0.01,
        liveness: 0.12,
        valence: 0.35,
        tempo: 100,
        duration_ms: 210000,
        time_signature: 4,
      },
    ],
    genres: ["dark pop", "indie pop", "r&b", "electropop"],
  };

  return analyzePersonality(demoData);
}
