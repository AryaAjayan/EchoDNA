"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { GenreSlice } from "@/types/personality";

interface Props {
  genreDNA: GenreSlice[];
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: GenreSlice }> }) => {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="glass rounded-xl px-4 py-3 border border-white/10 text-sm">
      <div className="font-semibold text-white">{data.genre}</div>
      <div style={{ color: data.color }}>{data.percentage}% of your DNA</div>
    </div>
  );
};

const CustomLegend = ({ data }: { data: GenreSlice[] }) => (
  <div className="grid grid-cols-2 gap-2 mt-4">
    {data.map((item) => (
      <div key={item.genre} className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
        <span className="text-xs text-muted-foreground truncate">{item.genre}</span>
        <span className="text-xs font-semibold ml-auto" style={{ color: item.color }}>{item.percentage}%</span>
      </div>
    ))}
  </div>
);

export function GenreDNA({ genreDNA }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (!genreDNA || genreDNA.length === 0) {
    return (
      <div className="glass rounded-2xl p-6 border border-white/10 h-full flex items-center justify-center">
        <p className="text-muted-foreground text-sm">No genre data available</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6 border border-white/10 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <span className="text-lg">🧬</span>
        </div>
        <div>
          <h3 className="font-display font-bold text-white">Genre DNA</h3>
          <p className="text-xs text-muted-foreground">Your musical genome</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={genreDNA}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            dataKey="percentage"
            nameKey="genre"
            paddingAngle={3}
            onMouseEnter={(_, i) => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {genreDNA.map((entry, i) => (
              <Cell
                key={entry.genre}
                fill={entry.color}
                opacity={activeIndex === null || activeIndex === i ? 1 : 0.5}
                stroke={activeIndex === i ? entry.color : "transparent"}
                strokeWidth={2}
                style={{ cursor: "pointer", filter: activeIndex === i ? `drop-shadow(0 0 6px ${entry.color})` : "none", transition: "all 0.2s" }}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <CustomLegend data={genreDNA} />
    </div>
  );
}
