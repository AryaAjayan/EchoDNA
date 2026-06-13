"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Share2, Copy, Check, X, Loader2 } from "lucide-react";
import { toPng } from "html-to-image";
import type { PersonalityResult } from "@/types/personality";

interface Props {
  result: PersonalityResult;
  userName?: string;
  profileImage?: string;
}

function StoryCard({
  result,
  userName,
  profileImage,
  cardRef,
}: Props & { cardRef: React.RefObject<HTMLDivElement | null> }) {
  const { archetype, aura, genreDNA, alterEgo, moodProfile } = result;

  return (
    <div
      ref={cardRef}
      className="story-card rounded-3xl relative flex flex-col justify-between overflow-hidden"
      style={{
        background: archetype.colors.gradient,
        fontFamily: "'Inter', 'Space Grotesk', system-ui, sans-serif",
      }}
    >
      {/* Top glow */}
      <div
        className="absolute top-0 left-0 w-full h-64 opacity-40"
        style={{
          background: `radial-gradient(ellipse at top, ${archetype.colors.primary}80, transparent)`,
        }}
      />

      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      <div className="relative z-10 flex flex-col justify-between h-full p-7">
        {/* Header */}
        <div>
          {/* Brand */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                style={{
                  background: "linear-gradient(135deg, #1db954, #22d366)",
                  color: "#000",
                }}
              >
                E
              </div>
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: 15,
                  color: "#fff",
                }}
              >
                EchoDNA
              </span>
            </div>
            <div className="text-white/40 text-xs">echodna.vercel.app</div>
          </div>

          {/* User */}
          <div className="flex items-center gap-3 mb-6">
            {profileImage ? (
              <img
                src={profileImage}
                alt=""
                className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg border-2 border-white/20">
                {userName?.[0]?.toUpperCase() || "🎵"}
              </div>
            )}
            <div>
              <div className="text-white/50 text-xs">Personality of</div>
              <div className="text-white font-semibold text-sm truncate max-w-[200px]">
                {userName || "Music Lover"}
              </div>
            </div>
          </div>

          {/* Archetype */}
          <div className="text-center py-4">
            <div className="text-6xl mb-3">{archetype.emoji}</div>
            <div className="text-white/50 text-xs uppercase tracking-widest mb-2">
              Your Archetype
            </div>
            <h2
              className="text-white text-3xl mb-2"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
            >
              {archetype.title}
            </h2>
            <p className="text-white/60 text-sm italic">&quot;{archetype.tagline}&quot;</p>
          </div>
        </div>

        {/* Middle: Stats */}
        <div className="space-y-4 my-4">
          {/* Aura */}
          <div className="flex items-center gap-3 rounded-xl p-3" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
              style={{ background: aura.gradient }}
            >
              {aura.emoji}
            </div>
            <div>
              <div className="text-white/40 text-[10px] uppercase tracking-wider">Aura</div>
              <div className="text-white text-sm font-semibold">{aura.name}</div>
            </div>
          </div>

          {/* Top genres */}
          <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div className="text-white/40 text-[10px] uppercase tracking-wider mb-2">Genre DNA</div>
            <div className="flex flex-wrap gap-1.5">
              {genreDNA.slice(0, 5).map((g) => (
                <span
                  key={g.genre}
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium"
                  style={{ background: `${g.color}25`, color: g.color, border: `1px solid ${g.color}40` }}
                >
                  {g.genre} {g.percentage}%
                </span>
              ))}
            </div>
          </div>

          {/* Mood bars */}
          <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div className="text-white/40 text-[10px] uppercase tracking-wider mb-2">Mood Spectrum</div>
            <div className="space-y-1.5">
              {[
                { key: "energy", label: "⚡ Energy" },
                { key: "valence", label: "😊 Joy" },
                { key: "danceability", label: "🕺 Groove" },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center gap-2">
                  <span className="text-white/50 text-[10px] w-16">{label}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(moodProfile[key as keyof typeof moodProfile] as number) * 100}%`,
                        background: "linear-gradient(90deg, #1db954, #a855f7)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alter ego quote */}
          <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div className="text-white/40 text-[10px] uppercase tracking-wider mb-1">Alter Ego</div>
            <div className="text-white font-semibold text-sm mb-1">{alterEgo.name}</div>
            <p className="text-white/60 text-xs italic leading-relaxed">
              &quot;{alterEgo.quote}&quot;
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-auto">
          <div className="text-white/30 text-[10px]">Analyze yours free →</div>
          <div className="flex items-center gap-1.5">
            <div
              className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold"
              style={{ background: "linear-gradient(135deg, #1db954, #22d366)", color: "#000" }}
            >
              E
            </div>
            <span className="text-white/50 text-xs font-semibold">echodna.vercel.app</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ExportSection({ result, userName, profileImage }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const exportAsPng = useCallback(async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    setExportError(null);

    try {
      // Wait a frame for fonts
      await new Promise((r) => setTimeout(r, 200));

      const dataUrl = await toPng(cardRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: "#080810",
      });

      const link = document.createElement("a");
      link.download = `echodna-${(userName || "personality").toLowerCase().replace(/\s+/g, "-")}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
      setExportError("Export failed. Please try again.");

      // Fallback: try without high quality
      try {
        if (!cardRef.current) return;
        const dataUrl = await toPng(cardRef.current, {
          quality: 0.8,
          pixelRatio: 1,
          cacheBust: true,
        });
        const link = document.createElement("a");
        link.download = `echodna-${(userName || "personality").toLowerCase().replace(/\s+/g, "-")}.png`;
        link.href = dataUrl;
        link.click();
        setExportError(null);
      } catch {
        setExportError("Export failed. Try using a desktop browser.");
      }
    } finally {
      setIsExporting(false);
    }
  }, [userName]);

  const copyShareText = useCallback(() => {
    const text = `I'm a ${result.archetype.title} ${result.archetype.emoji}\n\n"${result.archetype.tagline}"\n\nMy music alter ego is ${result.alterEgo.name}. My aura: ${result.aura.name} ${result.aura.emoji}\n\nDiscover yours → echodna.vercel.app\n\n#EchoDNA #SpotifyWrapped #MusicPersonality`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        setExportError("Copy failed. Try selecting text manually.");
      }
      document.body.removeChild(textarea);
    });
  }, [result]);

  return (
    <>
      <div className="glass rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
            <Share2 className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-bold text-white">Share Your Sound</h3>
            <p className="text-xs text-muted-foreground">Download your story card or copy to share</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all hover:scale-[1.02]"
            style={{
              background: "linear-gradient(135deg, #1db954, #22d366)",
              color: "#000",
            }}
          >
            <Download className="w-5 h-5" />
            Download Story Card
          </button>

          <button
            onClick={copyShareText}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold border border-white/10 hover:border-white/20 transition-all hover:scale-[1.02]"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            {copied ? (
              <>
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-green-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-5 h-5 text-white" />
                <span className="text-white">Copy Share Text</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Story Card Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />

            <motion.div
              className="relative z-10 flex flex-col items-center gap-4 max-h-[95vh] overflow-y-auto pb-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              {/* Close button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute -top-2 -right-2 z-20 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4 text-white" />
              </button>

              {/* The card */}
              <StoryCard
                result={result}
                userName={userName}
                profileImage={profileImage}
                cardRef={cardRef}
              />

              {/* Export button */}
              <button
                onClick={exportAsPng}
                disabled={isExporting}
                className="flex items-center justify-center gap-2 px-8 py-3 rounded-full font-bold transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                style={{
                  background: "linear-gradient(135deg, #1db954, #22d366)",
                  color: "#000",
                }}
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Download PNG
                  </>
                )}
              </button>

              {/* Error */}
              {exportError && (
                <div className="text-sm text-red-400 text-center flex items-center gap-2">
                  {exportError}
                  <button
                    onClick={exportAsPng}
                    className="underline hover:text-red-300 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
