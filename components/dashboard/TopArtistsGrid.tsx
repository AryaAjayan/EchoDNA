"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import type { SpotifyArtist } from "@/types/spotify";

interface Props {
  artists: SpotifyArtist[];
  topTrackNames: string[];
}

function ArtistCard({ artist, rank, delay }: { artist: SpotifyArtist; rank: number; delay: number }) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = artist.images?.[0]?.url;
  const genres = artist.genres?.slice(0, 2).join(", ") || "Artist";

  return (
    <motion.div
      className="group flex items-center gap-4 p-4 rounded-xl border border-white/5 hover:border-white/15 transition-all cursor-pointer"
      style={{ background: "rgba(255,255,255,0.02)" }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ x: 4, background: "rgba(255,255,255,0.04)" }}
    >
      <div className="text-2xl font-display font-bold text-white/10 w-8 text-center flex-shrink-0">
        {rank}
      </div>

      {/* Artist image */}
      <div className="w-12 h-12 rounded-full overflow-hidden bg-white/5 flex-shrink-0 relative">
        {imageUrl && !imgError ? (
          <img
            src={imageUrl}
            alt={artist.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xl">
            🎵
          </div>
        )}
      </div>

      {/* Name + genre */}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-white truncate text-sm">{artist.name}</div>
        <div className="text-xs text-muted-foreground truncate capitalize">{genres}</div>
      </div>

      {/* Popularity bar */}
      <div className="hidden sm:block w-16">
        <div className="h-1 rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-primary opacity-60"
            style={{ width: `${artist.popularity || 50}%` }}
          />
        </div>
        <div className="text-xs text-muted-foreground text-right mt-0.5">{artist.popularity || "—"}</div>
      </div>

      <a
        href={artist.external_urls?.spotify || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()}
        aria-label={`Open ${artist.name} on Spotify`}
      >
        <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
      </a>
    </motion.div>
  );
}

export function TopArtistsGrid({ artists, topTrackNames }: Props) {
  const displayArtists = artists.slice(0, 8);

  return (
    <div className="glass rounded-2xl p-6 border border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
          <span className="text-lg">⭐</span>
        </div>
        <div>
          <h3 className="font-display font-bold text-white">Your Sonic Universe</h3>
          <p className="text-xs text-muted-foreground">Top artists defining your DNA</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-2">
        {displayArtists.map((artist, i) => (
          <ArtistCard
            key={artist.id}
            artist={artist}
            rank={i + 1}
            delay={i * 0.06}
          />
        ))}
      </div>

      {/* Top tracks mention */}
      {topTrackNames.length > 0 && (
        <div className="mt-6 pt-4 border-t border-white/5">
          <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Currently spinning</div>
          <div className="flex flex-wrap gap-2">
            {topTrackNames.slice(0, 5).map((name) => (
              <span
                key={name}
                className="px-3 py-1 rounded-full text-xs border border-white/8 text-white/60"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                🎵 {name.length > 30 ? name.slice(0, 27) + "..." : name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
