"use client";

import { motion } from "framer-motion";
import { Sparkles, Star } from "lucide-react";
import type { PersonalityResult } from "@/types/personality";

interface Props {
  result: PersonalityResult;
  userName?: string;
  profileImage?: string;
}

export function HeroCard({ result, userName, profileImage }: Props) {
  const { archetype, aura } = result;

  return (
    <div
      className="relative rounded-3xl overflow-hidden border border-white/10"
      style={{ background: archetype.colors.gradient }}
    >
      {/* Glow overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{ background: `radial-gradient(ellipse at top right, ${archetype.colors.glow}, transparent 60%)` }}
      />

      {/* Animated grid */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
        backgroundSize: "40px 40px"
      }} />

      <div className="relative z-10 p-8 md:p-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Left: User + archetype */}
          <div className="flex-1">
            {/* Profile */}
            {(profileImage || userName) && (
              <div className="flex items-center gap-3 mb-6">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={userName || "User"}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xl">
                    {userName?.[0]?.toUpperCase() || "🎵"}
                  </div>
                )}
                <div>
                  <p className="text-white/60 text-sm">Your EchoDNA results for</p>
                  <p className="font-semibold text-white">{userName || "Anonymous Listener"}</p>
                </div>
              </div>
            )}

            {/* Archetype label */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white/80 text-xs font-medium mb-4">
              <Star className="w-3 h-3" />
              Listening Archetype
            </div>

            {/* Archetype title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              <div className="text-6xl md:text-7xl mb-3">{archetype.emoji}</div>
              <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-3">
                {archetype.title}
              </h1>
              <p className="text-white/70 text-lg font-medium mb-4 italic">
                &quot;{archetype.tagline}&quot;
              </p>
              <p className="text-white/60 text-sm leading-relaxed max-w-lg">
                {archetype.description}
              </p>
            </motion.div>
          </div>

          {/* Right: Trait badges + aura */}
          <div className="flex flex-col items-center gap-6">
            {/* Aura badge */}
            <motion.div
              className="flex flex-col items-center gap-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-4xl border-4 border-white/20"
                style={{
                  background: aura.gradient,
                  boxShadow: `0 0 40px ${aura.color}60, 0 0 80px ${aura.color}20`
                }}
              >
                {aura.emoji}
              </div>
              <div className="text-center">
                <div className="text-white/50 text-xs uppercase tracking-wider">Your Aura</div>
                <div className="text-white font-semibold">{aura.name}</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Traits */}
        <motion.div
          className="mt-8 flex flex-wrap gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {archetype.traits.map((trait, i) => (
            <motion.span
              key={trait}
              className="px-4 py-1.5 rounded-full text-xs font-medium bg-white/10 text-white/80 border border-white/10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              {trait}
            </motion.span>
          ))}
        </motion.div>

        {/* Cinematic feeling */}
        <motion.div
          className="mt-6 flex items-start gap-2 text-white/50 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
          <span>Feels like: <span className="text-white/70 italic">{archetype.cinematicFeeling}</span></span>
        </motion.div>
      </div>
    </div>
  );
}
