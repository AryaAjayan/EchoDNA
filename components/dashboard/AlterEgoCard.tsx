"use client";

import { motion } from "framer-motion";
import type { AlterEgo, Archetype } from "@/types/personality";

interface Props {
  alterEgo: AlterEgo;
  archetype: Archetype;
}

export function AlterEgoCard({ alterEgo, archetype }: Props) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden border border-white/10"
      style={{ background: `linear-gradient(135deg, ${archetype.colors.secondary}, ${archetype.colors.primary}15)` }}
    >
      {/* Glow */}
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20"
        style={{ background: archetype.colors.primary }}
      />

      <div className="relative z-10 p-8">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-white/50">Your Music Alter Ego</span>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left: Persona */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-5xl mb-3">{alterEgo.emoji}</div>
              <h2 className="font-display font-bold text-3xl text-white mb-2">
                {alterEgo.name}
              </h2>
              <p className="text-white/70 leading-relaxed mb-6 max-w-md">
                {alterEgo.summary}
              </p>

              {/* Quote */}
              <div
                className="rounded-xl p-5 border border-white/10"
                style={{ background: "rgba(255,255,255,0.04)" }}
              >
                <div className="text-2xl mb-2 text-white/30">&ldquo;</div>
                <p className="text-white/90 italic font-medium leading-relaxed">
                  {alterEgo.quote}
                </p>
                <div className="text-right text-2xl mt-2 text-white/30">&rdquo;</div>
                <div className="text-xs text-white/40 mt-1">— {alterEgo.name}</div>
              </div>
            </motion.div>
          </div>

          {/* Right: Details */}
          <div className="md:w-64 space-y-4">
            {[
              { icon: "👗", label: "Aesthetic", value: alterEgo.fashionAesthetic },
              { icon: "🎬", label: "Cinematic Vibe", value: alterEgo.cinematicVibe },
              { icon: "🌍", label: "Favorite Place", value: alterEgo.favoriteEnvironment },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                className="rounded-xl p-4 border border-white/10"
                style={{ background: "rgba(255,255,255,0.04)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">{item.icon}</span>
                  <span className="text-xs text-white/40 uppercase tracking-wider">{item.label}</span>
                </div>
                <p className="text-sm text-white/80 leading-relaxed">{item.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
