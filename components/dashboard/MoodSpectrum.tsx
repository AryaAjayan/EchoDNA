"use client";

import { motion } from "framer-motion";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { MoodProfile } from "@/types/personality";

interface Props {
  moodProfile: MoodProfile;
}

const DESCRIPTORS: Record<string, { low: string; high: string; label: string }> = {
  energy: { low: "Calm", high: "Energetic", label: "Energy" },
  danceability: { low: "Still", high: "Groovy", label: "Dance" },
  valence: { low: "Dark", high: "Joyful", label: "Mood" },
  acousticness: { low: "Electric", high: "Acoustic", label: "Acoustic" },
  instrumentalness: { low: "Vocal", high: "Instrumental", label: "Instru." },
  speechiness: { low: "Musical", high: "Spoken", label: "Speech" },
};

function getMoodLabel(profile: MoodProfile): string {
  const { energy, valence, acousticness, danceability } = profile;
  if (energy > 0.7 && danceability > 0.65) return "High-Energy Dancer";
  if (valence < 0.35 && acousticness > 0.5) return "Melancholic Dreamer";
  if (energy > 0.6 && valence > 0.6) return "Euphoric Optimist";
  if (acousticness > 0.6 && energy < 0.5) return "Gentle Soul";
  if (danceability > 0.7 && energy > 0.6) return "Pure Groove Machine";
  if (valence < 0.4 && energy > 0.5) return "Complex Emotional";
  return "Balanced Listener";
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number; name: string }> }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-3 py-2 border border-white/10 text-xs">
      <div className="font-semibold text-white">{payload[0].name}</div>
      <div className="text-primary">{Math.round(payload[0].value)}%</div>
    </div>
  );
};

export function MoodSpectrum({ moodProfile }: Props) {
  const chartData = Object.entries(DESCRIPTORS).map(([key, desc]) => ({
    subject: desc.label,
    value: Math.round((moodProfile[key as keyof MoodProfile] as number) * 100),
    fullMark: 100,
  }));

  const moodLabel = getMoodLabel(moodProfile);

  const moodBars = [
    { key: "energy", label: "Energy", icon: "⚡" },
    { key: "danceability", label: "Groove", icon: "🕺" },
    { key: "valence", label: "Positivity", icon: "😊" },
    { key: "acousticness", label: "Acoustic", icon: "🎸" },
  ];

  return (
    <div className="glass rounded-2xl p-6 border border-white/10 h-full">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center">
          <span className="text-lg">🎭</span>
        </div>
        <div>
          <h3 className="font-display font-bold text-white">Mood Spectrum</h3>
          <p className="text-xs text-muted-foreground">{moodLabel}</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
          <PolarGrid stroke="rgba(255,255,255,0.08)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
          />
          <Radar
            name="Mood"
            dataKey="value"
            stroke="#1db954"
            fill="#1db954"
            fillOpacity={0.2}
            strokeWidth={2}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>

      {/* Bar indicators */}
      <div className="space-y-3 mt-2">
        {moodBars.map(({ key, label, icon }, i) => {
          const value = moodProfile[key as keyof MoodProfile] as number;
          return (
            <div key={key} className="flex items-center gap-3">
              <span className="text-sm w-4">{icon}</span>
              <span className="text-xs text-muted-foreground w-16">{label}</span>
              <div className="flex-1 h-1.5 rounded-full bg-white/5">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, #1db954, #a855f7)`,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${value * 100}%` }}
                  transition={{ delay: i * 0.1 + 0.3, duration: 0.8, ease: "easeOut" }}
                />
              </div>
              <span className="text-xs text-white/50 w-8 text-right">{Math.round(value * 100)}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
