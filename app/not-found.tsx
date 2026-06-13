import Link from "next/link";
import { Music, Home, ArrowRight } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{
            background: "radial-gradient(circle, #a855f7, transparent)",
            top: "20%",
            left: "30%",
          }}
        />
      </div>

      <div className="relative z-10 max-w-md w-full text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #1db954, #22d366)",
            }}
          >
            <Music className="w-5 h-5 text-black" />
          </div>
          <span
            className="font-bold text-xl text-white"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            EchoDNA
          </span>
        </div>

        <div className="text-8xl mb-6">🎵</div>

        <h1
          className="text-4xl font-bold text-white mb-3"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Lost in the mix
        </h1>

        <p className="text-muted-foreground leading-relaxed mb-8">
          This page doesn&apos;t exist — but your music personality does. Let&apos;s
          find it.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold transition-all hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #1db954, #22d366)",
              color: "#000",
            }}
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold border border-white/10 hover:border-white/20 transition-all"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            Try Demo
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
