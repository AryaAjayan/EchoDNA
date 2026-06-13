"use client";

import { motion } from "framer-motion";
import { ARCHETYPES } from "@/lib/archetypes";
import type { Archetype } from "@/types/personality";

interface Props {
  archetype: Archetype;
  compatibleWith: string[];
}

export function CompatibilitySection({ archetype, compatibleWith }: Props) {
  const allArchetypes = Object.values(ARCHETYPES);

  return (
    <div className="glass rounded-2xl p-6 border border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center">
          <span className="text-lg">💞</span>
        </div>
        <div>
          <h3 className="font-display font-bold text-white">Sonic Compatibility</h3>
          <p className="text-xs text-muted-foreground">How you vibe with other archetypes</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {allArchetypes.slice(0, 8).map((a, i) => {
          const isMe = a.id === archetype.id;
          const isCompatible = compatibleWith.includes(a.title);
          
          // Generate a stable compatibility percentage based on the archetype's name characters
          const charSum = a.title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
          const compatibility = isMe 
            ? 100 
            : isCompatible 
            ? 80 + (charSum % 16) 
            : 30 + (charSum % 41);

          return (
            <motion.div
              key={a.id}
              className={`relative rounded-xl p-4 border text-center cursor-default ${
                isMe ? "border-primary/40" : isCompatible ? "border-white/15" : "border-white/5"
              }`}
              style={{
                background: isMe
                  ? `${archetype.colors.primary}15`
                  : isCompatible
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(255,255,255,0.01)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.04 }}
            >
              {isMe && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-primary text-black text-[10px] font-bold whitespace-nowrap">
                  YOU
                </div>
              )}
              <div className="text-2xl mb-2">{a.emoji}</div>
              <div className="text-xs font-medium text-white leading-tight mb-2">{a.title}</div>
              <div className="h-1 rounded-full bg-white/5 mb-1">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: isMe
                      ? "linear-gradient(90deg, #1db954, #22d366)"
                      : isCompatible
                      ? "linear-gradient(90deg, #a855f7, #ec4899)"
                      : "rgba(255,255,255,0.2)",
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${compatibility}%` }}
                  transition={{ delay: i * 0.08 + 0.3, duration: 0.8, ease: "easeOut" }}
                />
              </div>
              <div className="text-[10px] text-muted-foreground">{Math.round(compatibility)}%</div>
            </motion.div>
          );
        })}
      </div>

      {compatibleWith.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/5">
          <p className="text-sm text-muted-foreground">
            You vibe best with{" "}
            {compatibleWith.map((c, i) => (
              <span key={c}>
                <span className="text-white font-semibold">{c}</span>
                {i < compatibleWith.length - 1 ? " and " : ""}
              </span>
            ))}{" "}
            personalities.
          </p>
        </div>
      )}
    </div>
  );
}
