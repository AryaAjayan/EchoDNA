"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Music, RefreshCw } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { generateDemoPersonality } from "@/lib/personality-engine";
import { HeroCard } from "@/components/dashboard/HeroCard";
import { GenreDNA } from "@/components/dashboard/GenreDNA";
import { MoodSpectrum } from "@/components/dashboard/MoodSpectrum";
import { AlterEgoCard } from "@/components/dashboard/AlterEgoCard";
import { TopArtistsGrid } from "@/components/dashboard/TopArtistsGrid";
import { AuraSummary } from "@/components/dashboard/AuraSummary";
import { ListeningStats } from "@/components/dashboard/ListeningStats";
import { ExportSection } from "@/components/dashboard/ExportSection";
import { CompatibilitySection } from "@/components/dashboard/CompatibilitySection";
import type { PersonalityResult } from "@/types/personality";

interface NavProps {
  userName?: string;
  onLogout: () => void;
}

function DashboardNav({ userName, onLogout }: NavProps) {
  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/5 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1db954, #22d366)" }}>
            <Music className="w-4 h-4 text-black" />
          </div>
          <span className="font-display font-bold text-white">EchoDNA</span>
        </div>
        <div className="flex items-center gap-3">
          {userName && (
            <span className="hidden sm:block text-sm text-white/60 font-medium mr-2">
              {userName}
            </span>
          )}
          <a
            href="/api/auth/spotify"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold glass border border-white/10 hover:border-primary/40 transition-all text-white/80 hover:text-white"
          >
            <RefreshCw className="w-3 h-3" />
            Re-analyze
          </a>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/30 transition-all cursor-pointer"
          >
            Log Out
          </button>
        </div>
      </div>
    </nav>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 my-4">
      <div className="flex-1 h-px bg-white/5" />
      <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest">{label}</span>
      <div className="flex-1 h-px bg-white/5" />
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { personality, spotifyData, setPersonality, reset } = useAppStore();
  const [isDemo, setIsDemo] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // If no personality data, generate demo
    if (!personality) {
      const demo = generateDemoPersonality();
      setPersonality(demo);
      setIsDemo(true);
    }
    setIsVisible(true);
  }, [personality, setPersonality]);

  const handleLogout = async () => {
    try {
      await fetch("/api/spotify/analyze", { method: "DELETE" });
      reset();
      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const result: PersonalityResult | null = personality;

  if (!result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your personality...</p>
        </div>
      </div>
    );
  }

  const userName = spotifyData?.user?.display_name || undefined;
  const profileImage = spotifyData?.user?.images?.[0]?.url || undefined;
  const topArtists = spotifyData?.topArtists || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient */}
      <div
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{ background: `radial-gradient(ellipse at top, ${result.archetype.colors.primary}20, transparent 60%)` }}
      />

      <DashboardNav userName={userName} onLogout={handleLogout} />

      {/* Demo banner */}
      <AnimatePresence>
        {isDemo && (
          <motion.div
            className="relative z-40 text-center py-3 px-6"
            style={{ background: "linear-gradient(90deg, rgba(168,85,247,0.2), rgba(29,185,84,0.2))", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <span className="text-sm text-white/80">
              🎭 This is a demo profile.{" "}
              <a href="/api/auth/spotify" className="text-primary underline font-semibold hover:text-green-400 transition-colors">
                Connect Spotify
              </a>{" "}
              to get your real personality analysis.
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Hero Card — archetype reveal */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <HeroCard result={result} userName={userName} profileImage={profileImage} />
        </motion.div>

        {/* Aura + Stats row */}
        <div className="grid md:grid-cols-2 gap-5">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <AuraSummary aura={result.aura} socialVibe={result.socialVibe} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            <ListeningStats stats={result.stats} />
          </motion.div>
        </div>

        <SectionDivider label="Musical Identity" />

        {/* Genre DNA + Mood Spectrum */}
        <div className="grid md:grid-cols-2 gap-5">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <GenreDNA genreDNA={result.genreDNA} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.25, duration: 0.6 }}
          >
            <MoodSpectrum moodProfile={result.moodProfile} />
          </motion.div>
        </div>

        <SectionDivider label="Your Alter Ego" />

        {/* Alter Ego */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <AlterEgoCard alterEgo={result.alterEgo} archetype={result.archetype} />
        </motion.div>

        {/* Top Artists */}
        {topArtists.length > 0 && (
          <>
            <SectionDivider label="Your Sonic Universe" />
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.35, duration: 0.6 }}
            >
              <TopArtistsGrid artists={topArtists} topTrackNames={result.topTrackNames} />
            </motion.div>
          </>
        )}

        {/* Compatibility */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <CompatibilitySection archetype={result.archetype} compatibleWith={result.compatibleWith} />
        </motion.div>

        <SectionDivider label="Share Your Sound" />

        {/* Export section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.45, duration: 0.6 }}
        >
          <ExportSection result={result} userName={userName} profileImage={profileImage} />
        </motion.div>

        <div className="h-8" />
      </main>
    </div>
  );
}
