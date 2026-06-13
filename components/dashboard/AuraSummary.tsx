"use client";

import { motion } from "framer-motion";
import type { AuraType } from "@/types/personality";

interface Props {
  aura: AuraType;
  socialVibe: string;
}

export function AuraSummary({ aura, socialVibe }: Props) {
  return (
    <div className="glass rounded-2xl p-6 border border-white/10 h-full relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 opacity-10 rounded-2xl"
        style={{ background: aura.gradient }}
      />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${aura.color}20` }}>
            <span className="text-lg">{aura.emoji}</span>
          </div>
          <div>
            <h3 className="font-display font-bold text-white">Your Aura</h3>
            <p className="text-xs text-muted-foreground">Emotional frequency</p>
          </div>
        </div>

        {/* Aura circle */}
        <div className="flex items-center gap-5 mb-5">
          <motion.div
            className="w-20 h-20 rounded-full flex items-center justify-center text-3xl flex-shrink-0 border-2 border-white/10"
            style={{
              background: aura.gradient,
              boxShadow: `0 0 30px ${aura.color}50`,
            }}
            animate={{
              boxShadow: [
                `0 0 20px ${aura.color}40`,
                `0 0 40px ${aura.color}60`,
                `0 0 20px ${aura.color}40`,
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {aura.emoji}
          </motion.div>

          <div>
            <div className="font-display font-bold text-xl text-white mb-1">{aura.name}</div>
            <p className="text-sm text-muted-foreground leading-relaxed">{aura.description}</p>
          </div>
        </div>

        {/* Social vibe */}
        <div
          className="rounded-xl p-4 border border-white/5"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Social Vibe</div>
          <p className="text-sm text-white/80 leading-relaxed">{socialVibe}</p>
        </div>
      </div>
    </div>
  );
}
