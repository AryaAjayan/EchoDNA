"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Music } from "lucide-react";
import { useAppStore } from "@/lib/store";
import type { PersonalityResult } from "@/types/personality";
import type { SpotifyData } from "@/types/spotify";

const LOADING_STEPS = [
  { id: "connecting", label: "Connecting to Spotify", sub: "Establishing secure connection...", duration: 800 },
  { id: "fetching", label: "Fetching your music data", sub: "Pulling top tracks, artists & audio features...", duration: 1800 },
  { id: "analyzing", label: "Analyzing your patterns", sub: "Decoding your genre DNA & mood spectrum...", duration: 1500 },
  { id: "generating", label: "Generating your personality", sub: "Crafting your unique archetype & alter ego...", duration: 1200 },
  { id: "finalizing", label: "Finalizing your profile", sub: "Almost there — putting the final touches...", duration: 600 },
];

const FACTS = [
  "People who listen to sad music tend to score higher in openness and empathy.",
  "Your top genre is often linked to your dominant personality trait.",
  "Night owls statistically prefer higher BPM tracks after midnight.",
  "Listening to music with lyrics uses a different part of your brain than instrumental.",
  "People with diverse music tastes often score higher in creativity tests.",
  "Your music tempo preferences can reveal your natural energy levels.",
];

function WaveformVisualizer({ color = "#1db954" }: { color?: string }) {
  return (
    <div className="flex items-end gap-1 h-20" aria-label="Music waveform animation">
      {Array.from({ length: 32 }, (_, i) => {
        // Deterministic but random-looking scaleY and duration parameters
        const stableScaleY = [0.2, 0.3 + ((i * 11) % 7) * 0.1, 0.2];
        const stableDuration = 0.6 + ((i * 17) % 9) * 0.05;
        return (
          <motion.div
            key={i}
            className="rounded-full flex-1"
            style={{ background: color, maxWidth: 6 }}
            animate={{
              scaleY: stableScaleY,
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: stableDuration,
              repeat: Infinity,
              delay: i * 0.03,
              ease: "easeInOut",
            }}
            initial={{ height: 8 }}
          />
        );
      })}
    </div>
  );
}

function CircularProgress({ progress }: { progress: number }) {
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-36 h-36">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
        <motion.circle
          cx="60"
          cy="60"
          r="54"
          stroke="url(#progressGrad)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1db954" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-display font-bold text-3xl text-white">{Math.round(progress)}%</span>
      </div>
    </div>
  );
}

export default function LoadingPage() {
  const router = useRouter();
  const { setPersonality, setSpotifyData, setSpotifyUser, setError } = useAppStore();

  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [factIdx, setFactIdx] = useState(0);
  const [hasFetched, setHasFetched] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Rotate fun facts
  useEffect(() => {
    const interval = setInterval(() => {
      setFactIdx((i) => (i + 1) % FACTS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Simulate step progression
  useEffect(() => {
    let stepIdx = 0;
    let elapsed = 0;
    const totalDuration = LOADING_STEPS.reduce((sum, s) => sum + s.duration, 0);

    const interval = setInterval(() => {
      elapsed += 50;
      const progressPercent = Math.min((elapsed / totalDuration) * 85, 85);
      setProgress(progressPercent);

      // Move to next step
      let acc = 0;
      for (let i = 0; i < LOADING_STEPS.length; i++) {
        acc += LOADING_STEPS[i].duration;
        if (elapsed < acc) {
          setCurrentStepIdx(i);
          break;
        }
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Fetch real data
  const fetchData = useCallback(async () => {
    if (hasFetched) return;
    setHasFetched(true);

    try {
      const res = await fetch("/api/spotify/analyze");

      if (res.status === 401) {
        setApiError("not_authenticated");
        return;
      }

      if (!res.ok) {
        // Try to get error message
        const body = await res.json().catch(() => ({ error: "unknown" }));
        setApiError(body.error || "fetch_failed");
        return;
      }

      const data = await res.json() as {
        spotify: SpotifyData;
        personality: PersonalityResult;
      };

      setSpotifyData(data.spotify);
      setPersonality(data.personality);
      if (data.spotify.user) setSpotifyUser(data.spotify.user);

      // Animate to 100% then redirect
      setProgress(100);
      setTimeout(() => {
        router.push("/dashboard");
      }, 800);

    } catch {
      setApiError("network_error");
    }
  }, [hasFetched, router, setPersonality, setSpotifyData, setSpotifyUser]);

  // Start fetch after short delay
  useEffect(() => {
    const timer = setTimeout(fetchData, 600);
    return () => clearTimeout(timer);
  }, [fetchData]);

  // Handle errors
  useEffect(() => {
    if (!apiError) return;

    if (apiError === "not_authenticated" || apiError === "UNAUTHORIZED") {
      router.push("/?auth=expired");
    } else {
      setError(apiError);
      router.push(`/auth-error?reason=${apiError}`);
    }
  }, [apiError, router, setError]);

  const currentStep = LOADING_STEPS[currentStepIdx];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-15"
          style={{ background: "radial-gradient(circle, #1db954, transparent)", top: "10%", left: "10%" }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-80 h-80 rounded-full blur-3xl opacity-10"
          style={{ background: "radial-gradient(circle, #a855f7, transparent)", bottom: "15%", right: "10%" }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.15, 0.08] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md text-center">
        {/* Logo */}
        <motion.div
          className="flex items-center justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1db954, #22d366)" }}>
            <Music className="w-5 h-5 text-black" />
          </div>
          <span className="font-display font-bold text-xl text-white">EchoDNA</span>
        </motion.div>

        {/* Waveform */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <WaveformVisualizer color="#1db954" />
        </motion.div>

        {/* Progress ring */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <CircularProgress progress={progress} />
        </motion.div>

        {/* Current step */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.id}
            className="mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="font-display font-bold text-2xl text-white mb-2">
              {currentStep.label}
            </h2>
            <p className="text-muted-foreground text-sm">{currentStep.sub}</p>
          </motion.div>
        </AnimatePresence>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {LOADING_STEPS.map((step, i) => (
            <motion.div
              key={step.id}
              className="h-1 rounded-full transition-all duration-500"
              style={{
                width: i === currentStepIdx ? 32 : 8,
                background: i <= currentStepIdx
                  ? "linear-gradient(90deg, #1db954, #22d366)"
                  : "rgba(255,255,255,0.1)",
              }}
            />
          ))}
        </div>

        {/* Fun fact */}
        <div className="glass rounded-2xl p-4 border border-white/10">
          <div className="text-xs text-primary font-semibold uppercase tracking-wider mb-2">
            Did you know?
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={factIdx}
              className="text-sm text-muted-foreground leading-relaxed"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.4 }}
            >
              {FACTS[factIdx]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
