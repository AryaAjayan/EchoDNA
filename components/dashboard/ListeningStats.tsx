"use client";

import { motion } from "framer-motion";
import type { ListeningStats as ListeningStatsType } from "@/types/personality";

interface Props {
  stats: ListeningStatsType;
}

function StatBox({ icon, value, label, delay }: { icon: string; value: string; label: string; delay: number }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center p-4 rounded-xl border border-white/5 text-center"
      style={{ background: "rgba(255,255,255,0.02)" }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ scale: 1.03, borderColor: "rgba(29,185,84,0.2)" }}
    >
      <div className="text-2xl mb-1">{icon}</div>
      <div className="font-display font-bold text-xl text-white">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
    </motion.div>
  );
}

export function ListeningStats({ stats }: Props) {
  const formatMinutes = (min: number) => {
    if (min > 60) return `${Math.round(min / 60)}h`;
    return `${min}m`;
  };

  const statBoxes = [
    { icon: "⏱️", value: formatMinutes(stats.totalMinutes), label: "Tracked" },
    { icon: "🎤", value: String(stats.uniqueArtists), label: "Artists" },
    { icon: "🎵", value: String(stats.uniqueGenres), label: "Genres" },
    { icon: "⭐", value: String(stats.avgPopularity), label: "Avg Popularity" },
  ];

  return (
    <div className="glass rounded-2xl p-6 border border-white/10 h-full">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
          <span className="text-lg">📊</span>
        </div>
        <div>
          <h3 className="font-display font-bold text-white">Listening Habits</h3>
          <p className="text-xs text-muted-foreground">Your musical footprint</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {statBoxes.map((s, i) => (
          <StatBox key={s.label} {...s} delay={i * 0.08} />
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Top Era</span>
          <span className="text-white font-medium">{stats.topDecade}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Listening Time</span>
          <span className="text-white font-medium capitalize">{stats.listeningTime} listener</span>
        </div>
      </div>
    </div>
  );
}
