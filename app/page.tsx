"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import {
  Sparkles, Music, Brain, Share2, ChevronRight, Play, Star,
  Headphones, Zap, Heart, Globe, ArrowRight, Activity, Disc
} from "lucide-react";
import { toast } from "sonner";
import { Navigation } from "@/components/navigation";

// ─── Dynamic Canvas Audio Waves (Hydration-Safe) ──────────────────────────────
function DynamicAudioWavesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let offset = 0;
    let mouse = { x: -1000, y: -1000, active: false };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
      mouse.active = false;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    // Layer settings: [amplitude, frequency, speed]
    const waves = [
      { amp: 55, freq: 0.003, speed: 0.010 },
      { amp: 40, freq: 0.005, speed: 0.015 },
      { amp: 28, freq: 0.007, speed: 0.008 },
      { amp: 16, freq: 0.010, speed: 0.020 },
    ];

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle horizontal design grid lines
      ctx.strokeStyle = "rgba(120, 120, 255, 0.012)";
      ctx.lineWidth = 1;
      const step = 45;
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      offset += 0.025;

      waves.forEach((w, index) => {
        ctx.beginPath();
        
        const isDark = document.documentElement.classList.contains("dark");
        let strokeColor = "";
        
        if (index === 0) {
          strokeColor = isDark ? "rgba(29, 185, 84, 0.15)" : "rgba(18, 184, 134, 0.15)";
        } else if (index === 1) {
          strokeColor = isDark ? "rgba(168, 85, 247, 0.12)" : "rgba(139, 92, 246, 0.12)";
        } else if (index === 2) {
          strokeColor = isDark ? "rgba(59, 130, 246, 0.12)" : "rgba(59, 130, 246, 0.12)";
        } else {
          strokeColor = isDark ? "rgba(236, 72, 153, 0.10)" : "rgba(236, 72, 153, 0.10)";
        }

        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1.8;

        for (let x = 0; x < width; x += 5) {
          const edgeFade = Math.sin((x / width) * Math.PI);
          let currentAmp = w.amp * edgeFade;

          if (mouse.active) {
            const dist = Math.abs(x - mouse.x);
            if (dist < 250) {
              const proximity = (250 - dist) / 250;
              currentAmp += 22 * proximity;
            }
          }

          const y = height * 0.5 + Math.sin(x * w.freq + offset * w.speed * 10) * currentAmp;

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, [mounted]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-70 dark:opacity-80 transition-opacity duration-1000 z-0"
    />
  );
}

// ─── Reusable Magnetic Wrapper ───────────────────────────────────────────────
function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = el.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;
    
    x.set(distanceX * 0.2);
    y.set(distanceY * 0.2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="relative z-10"
    >
      {children}
    </motion.div>
  );
}

// ─── Reusable 3D Tilt Card ───────────────────────────────────────────────────
function TiltCard({ children, className, glowColor = "var(--primary)" }: { children: React.ReactNode; className?: string; glowColor?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  
  const springConfig = { damping: 20, stiffness: 180 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = card.getBoundingClientRect();
    
    const relativeX = (clientX - left) / width - 0.5;
    const relativeY = (clientY - top) / height - 0.5;
    
    rotateX.set(-relativeY * 12);
    rotateY.set(relativeX * 12);

    const percentX = Math.round(((clientX - left) / width) * 100);
    const percentY = Math.round(((clientY - top) / height) * 100);
    setMousePos({ x: percentX, y: percentY });
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative rounded-3xl overflow-hidden glass border border-white/5 transition-shadow duration-300 ${className}`}
      whileHover={{
        boxShadow: `0 30px 60px -15px rgba(0, 0, 0, 0.4), 0 0 40px -10px ${glowColor}`,
        scale: 1.01
      }}
    >
      {/* Light spotlight reflection */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle 250px at ${mousePos.x}% ${mousePos.y}%, rgba(255, 255, 255, 0.12), transparent 80%)`,
        }}
      />
      <div className="relative z-10 h-full w-full" style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </motion.div>
  );
}

// ─── Custom Dynamic Waveform ──────────────────────────────────────────────────
function Waveform({ color = "var(--primary)", count = 28 }: { color?: string; count?: number }) {
  return (
    <div className="flex items-end gap-[4px] h-18 py-2" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => {
        const stableHeight = 10 + ((i * 17) % 45);
        const stableDuration = 0.6 + ((i * 11) % 10) * 0.08;
        return (
          <motion.div
            key={i}
            className="rounded-full w-[4px]"
            style={{ background: color }}
            animate={{ scaleY: [0.15, 1, 0.15], opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: stableDuration,
              repeat: Infinity,
              delay: i * 0.04,
              ease: "easeInOut",
            }}
            initial={{ height: stableHeight }}
          />
        );
      })}
    </div>
  );
}

// ─── Stat Counter ─────────────────────────────────────────────────────────────
function StatCounter({ value, label, delay }: { value: string; label: string; delay: number }) {
  return (
    <motion.div
      className="text-center p-4"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="text-3xl md:text-4xl font-display font-bold gradient-text-green">{value}</div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground mt-2 font-semibold">{label}</div>
    </motion.div>
  );
}

// ─── Main Redesigned Landing Page ─────────────────────────────────────────────
export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  // Parallax effects
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 500], [1, 0.96]);
  const heroY = useTransform(scrollY, [0, 500], [0, 50]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("logout") === "true") {
      toast("Logged out of EchoDNA", {
        description: "To use a different Spotify account, click below to log out from Spotify's website first.",
        action: {
          label: "Log out Spotify",
          onClick: () => window.open("https://accounts.spotify.com/en/logout", "_blank"),
        },
        duration: 10000,
      });
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const headlineWords = "Your music taste says more about you than you think.".split(" ");

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 25, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring" as const,
        damping: 18,
        stiffness: 90,
      },
    },
  };

  const archetypes = [
    { emoji: "🌙", title: "Midnight Dreamer", desc: "Rainy nights, neon streets, and 3 AM soundtracks.", tags: ["Vaporwave", "Lo-Fi", "Late Night Synth"], gradient: "linear-gradient(135deg, #1e1b4b, #2d1b69)" },
    { emoji: "⚡", title: "Neon Rebel", desc: "High voltage. Heavy distorted bass. Pure adrenaline.", tags: ["Indie Rock", "Industrial", "Synthwave"], gradient: "linear-gradient(135deg, #2b0c03, #4c0519)" },
    { emoji: "🚀", title: "Emotional Astronaut", desc: "Deep ambient structures. Float away into starry acoustics.", tags: ["Post-Rock", "Ambient", "Dream Pop"], gradient: "linear-gradient(135deg, #0f172a, #0c4a6e)" },
    { emoji: "🎭", title: "Indie Philosopher", desc: "Meaning resides deep inside the obscure, raw B-sides.", tags: ["Folk", "Alternative", "Singer-Songwriter"], gradient: "linear-gradient(135deg, #022c22, #064e3b)" },
    { emoji: "🖋️", title: "Melancholy Poet", desc: "Sorrow holds a soft, beautiful melody. Heartfelt acoustic.", tags: ["Chamber Pop", "Indie Folk", "Classical Piano"], gradient: "linear-gradient(135deg, #180828, #312e81)" },
    { emoji: "✨", title: "Sonic Explorer", desc: "Boundaries don't exist. Genre-defying experimental beats.", tags: ["Hyperpop", "Experimental Electronica", "Glitch"], gradient: "linear-gradient(135deg, #1f2937, #111827)" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden select-none bg-background text-foreground transition-colors duration-700">
      
      {/* ── Background Glow Auras ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden="true">
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-15 dark:opacity-20 blur-[130px] animate-pulse-glow"
          style={{
            background: "radial-gradient(circle, var(--primary), transparent)",
            top: "-10%",
            left: "-10%",
            animationDuration: "8s",
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-12 dark:opacity-15 blur-[110px] animate-pulse-glow"
          style={{
            background: "radial-gradient(circle, var(--neon-purple), transparent)",
            top: "30%",
            right: "-5%",
            animationDuration: "12s",
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-10 dark:opacity-12 blur-[90px] animate-pulse-glow"
          style={{
            background: "radial-gradient(circle, var(--neon-pink), transparent)",
            bottom: "10%",
            left: "25%",
            animationDuration: "10s",
          }}
        />
      </div>

      {/* ── Header ── */}
      <Navigation />

      {/* ── Hero Section ── */}
      <motion.section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 md:pt-32 z-10"
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
      >
        <DynamicAudioWavesBackground />

        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/10 w-4 h-4 rounded-full bg-primary/20 blur-sm animate-float hidden md:block" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/3 right-1/10 w-6 h-6 rounded-full bg-neon-purple/20 blur-sm animate-float hidden md:block" style={{ animationDelay: "3s" }} />

        {/* Premium Badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 text-xs font-semibold uppercase tracking-wider text-primary mb-8 shadow-[0_4px_30px_rgba(0,0,0,0.05)]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
        >
          <Sparkles className="w-3.5 h-3.5 animate-spin-slow text-primary" />
          <span>Spotify × AI Listening Archetype Analysis</span>
        </motion.div>

        {/* Staggered Word Reveal Headline */}
        <motion.h1
          className="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight max-w-4xl mb-6 relative"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {headlineWords.map((word, idx) => {
            const isHighlight = ["says", "more", "about", "you"].includes(word.toLowerCase().replace(/[^a-z]/g, ""));
            return (
              <motion.span
                key={idx}
                variants={wordVariants}
                className={`inline-block mr-[0.25em] ${
                  isHighlight ? "gradient-text-hero font-extrabold" : "text-foreground"
                }`}
              >
                {word}
              </motion.span>
            );
          })}
        </motion.h1>

        {/* Blur-In Subheading */}
        <motion.p
          className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed mb-8 px-4"
          initial={{ opacity: 0, filter: "blur(4px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Unlock your deep musical DNA. Connect your Spotify account to decipher your core archetype, aura spectrum, custom alter ego, and download a gorgeous shareable story card.
        </motion.p>

        {/* Magnetic CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4.5 z-20">
          <Magnetic>
            <Link
              href="/api/auth/spotify"
              id="hero-cta"
              className="group flex items-center gap-2.5 px-8 py-4 rounded-full text-sm font-extrabold uppercase tracking-wider transition-all duration-300 shadow-[0_8px_30px_var(--glow-green)] hover:shadow-[0_8px_45px_var(--glow-green)] cursor-pointer"
              style={{ background: "linear-gradient(135deg, var(--primary), var(--neon-green))", color: "#000" }}
            >
              <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              Analyze My Spotify
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Magnetic>

          <Magnetic>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold uppercase tracking-wider glass border border-border hover:bg-secondary/40 transition-all cursor-pointer text-foreground shadow-sm hover:border-foreground/20"
            >
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              Try Demo Vibe
            </Link>
          </Magnetic>
        </div>

        {/* Dynamic Waveform Visualizer */}
        <motion.div
          className="mt-14"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 1 }}
        >
          <Waveform color="var(--primary)" count={32} />
        </motion.div>

        {/* Metric Stats */}
        <div className="mt-12 max-w-2xl w-full border-t border-border pt-6 grid grid-cols-3 divide-x divide-border/60">
          <StatCounter value="8+" label="Archetypes" delay={0.8} />
          <StatCounter value="100%" label="Secure" delay={0.9} />
          <StatCounter value="&lt; 30s" label="Analyze Time" delay={1.0} />
        </div>
      </motion.section>

      {/* ── Asymmetric How It Works Section ── */}
      <section className="relative py-28 px-6 bg-secondary/10 dark:bg-black/20 border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-18">
            <motion.div
              className="max-w-xl"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/80 border border-border text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-4">
                <Zap className="w-3.5 h-3.5 text-primary" /> Process Workflow
              </div>
              <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tight text-foreground">
                Three steps to map your <span className="gradient-text-green">sonic genome</span>
              </h2>
            </motion.div>
            <motion.p
              className="text-muted-foreground text-sm max-w-sm md:mt-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              We run a client-side calculation to profile your tracks, genres, and audio features instantly. Your personal account data is never stored on a server.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {[
              { step: "01", title: "Secure Handshake", desc: "Connect using official Spotify OAuth. We read parameters completely in-memory.", icon: "🔑", color: "var(--primary)" },
              { step: "02", title: "DNA Synthesis", desc: "Our engine maps your listening genres, tempo, energy, and acoustic levels.", icon: "🧬", color: "var(--neon-purple)" },
              { step: "03", title: "Identity Reveal", desc: "Instantly unlock your archetype card, alter ego personality description, and share it.", icon: "🪐", color: "var(--neon-pink)" },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                className="relative p-8 rounded-3xl border border-white/5 bg-card text-card-foreground group transition-all duration-300"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -6, borderColor: `${item.color}40`, boxShadow: "0 20px 45px rgba(0, 0, 0, 0.05)" }}
              >
                <div className="absolute top-4 right-6 text-7xl font-display font-extrabold opacity-5 select-none transition-opacity duration-300 group-hover:opacity-10" style={{ color: item.color }}>
                  {item.step}
                </div>
                <div className="text-4xl mb-5">{item.icon}</div>
                <h3 className="font-display font-bold text-xl text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section with Custom Live Visual Mockups ── */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-4 tracking-tight">
              Six dimensions of your <span className="gradient-text-purple">music personality</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
              A comprehensive analytical layout exploring every corner of your listening landscape.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Feature 1: Listening Archetypes (Col 1-7, Row span 2) */}
            <TiltCard className="md:col-span-7 md:row-span-2 p-8 flex flex-col justify-between min-h-[420px] group/card" glowColor="rgba(168, 85, 247, 0.2)">
              <div className="flex flex-col md:flex-row items-start justify-between gap-6 w-full h-full">
                <div className="max-w-md flex flex-col justify-between h-full">
                  <div>
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-6 bg-purple-500/10 border border-purple-500/30 text-purple-400">
                      <Brain className="w-5 h-5" />
                    </div>
                    <h3 className="font-display font-bold text-2xl mb-3 text-foreground">Listening Archetypes</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                      Analyze your core acoustic characteristics. We map your listening profile to one of our 8 bespoke archetypes, detailing your structural taste dynamics.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {["🌙 Midnight Dreamer", "⚡ Neon Rebel", "🚀 Astronaut"].map((txt, idx) => (
                      <span key={idx} className="px-3.5 py-1.5 rounded-full glass border border-white/10 text-xs font-semibold text-foreground/80">
                        {txt}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sliding Vinyl Record Disc */}
                <div className="hidden lg:flex items-center justify-center relative w-44 h-44 ml-auto select-none mt-6 shrink-0">
                  <div className="absolute inset-0 rounded-2xl bg-black/85 border border-white/10 flex items-center justify-center shadow-lg group-hover/card:translate-x-3 transition-transform duration-500 z-10">
                    <span className="font-display text-[9px] font-bold tracking-widest text-primary/80 uppercase rotate-90">ECHODNA</span>
                  </div>
                  <div className="absolute w-40 h-40 rounded-full bg-[#141416] border border-neutral-800/80 shadow-2xl flex items-center justify-center group-hover/card:-translate-x-6 group-hover/card:rotate-180 transition-all duration-700 select-none animate-spin-slow">
                    <div className="absolute inset-2 rounded-full border border-neutral-900/30" />
                    <div className="absolute inset-5 rounded-full border border-neutral-900/30" />
                    <div className="absolute inset-8 rounded-full border border-neutral-900/30" />
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-neon-purple flex items-center justify-center border border-black/40">
                      <div className="w-3 h-3 rounded-full bg-[#080810]" />
                    </div>
                  </div>
                </div>
              </div>
            </TiltCard>

            {/* Feature 2: Genre DNA Card (Col 8-12, Row span 1) */}
            <TiltCard className="md:col-span-5 p-8 flex flex-col justify-between min-h-[200px]" glowColor="rgba(29, 185, 84, 0.2)">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    <Music className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-xl mb-1 text-foreground">Genre DNA Graph</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed max-w-[220px]">
                    Your musical profile charted as a radial double-helix genome mapping.
                  </p>
                </div>
                {/* Spiral Ring DNA mockup */}
                <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                  <div className="absolute w-full h-full rounded-full border-2 border-dashed border-primary/20 animate-spin-slow" />
                  <div className="absolute w-12 h-12 rounded-full border-2 border-dashed border-neon-purple/30 animate-spin-slow" style={{ animationDirection: "reverse", animationDuration: "12s" }} />
                  <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-primary to-neon-purple shadow-lg" />
                </div>
              </div>
            </TiltCard>

            {/* Feature 3: Mood Spectrum (Col 8-12, Row span 1) */}
            <TiltCard className="md:col-span-5 p-8 flex flex-col justify-between min-h-[200px]" glowColor="rgba(236, 72, 153, 0.2)">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4 bg-pink-500/10 border border-pink-500/30 text-pink-400">
                    <Heart className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-xl mb-1 text-foreground">Mood Spectrum</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed max-w-[220px]">
                    Radar analysis plotting valence, energy, and acoustic levels.
                  </p>
                </div>
                {/* SVG radar preview */}
                <div className="relative w-18 h-18 flex items-center justify-center shrink-0" aria-hidden="true">
                  <svg className="w-full h-full text-pink-500/30 overflow-visible" viewBox="0 0 100 100">
                    <polygon points="50,10 90,50 50,90 10,50" fill="none" stroke="currentColor" strokeWidth="1" />
                    <polygon points="50,25 75,50 50,75 25,50" fill="none" stroke="currentColor" strokeWidth="1" />
                    <polygon points="50,20 80,45 65,70 30,60" fill="var(--neon-pink)" fillOpacity="0.25" stroke="var(--neon-pink)" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </TiltCard>

            {/* Feature 4: Alter Ego Large Card (Col 1-5, Row span 1) */}
            <TiltCard className="md:col-span-5 p-6 flex flex-col justify-between min-h-[220px]" glowColor="rgba(247, 103, 7, 0.2)">
              <div>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4 bg-orange-500/10 border border-orange-500/30 text-orange-400">
                  <Sparkles className="w-4.5 h-4.5" />
                </div>
                <h3 className="font-display font-bold text-lg mb-1 text-foreground">Music Alter Ego</h3>
                <p className="text-muted-foreground text-xs leading-relaxed mb-4">
                  Meet your fictional artist persona, generated with biographical quotes.
                </p>
              </div>
              {/* Spotify Player Block */}
              <div className="rounded-xl glass border border-white/5 p-3 flex items-center gap-3 bg-secondary/20 shadow-sm">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-orange-500/20 text-orange-400 select-none">
                  <Disc className="w-4.5 h-4.5 animate-spin-slow" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-bold text-foreground truncate">Retro Synthwave Producer</div>
                  <div className="text-[9px] text-muted-foreground truncate">“Glow of neon wires in deep grid space.”</div>
                </div>
                <div className="w-6 h-6 rounded-full flex items-center justify-center bg-foreground/5 border border-border">
                  <Play className="w-2.5 h-2.5 text-foreground fill-foreground" />
                </div>
              </div>
            </TiltCard>

            {/* Feature 5: Aura Color Reading (Col 6-8, Row span 1) */}
            <TiltCard className="md:col-span-3 p-6 flex flex-col justify-between min-h-[220px]" glowColor="rgba(59, 130, 246, 0.2)">
              <div>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4 bg-blue-500/10 border border-blue-500/30 text-blue-400">
                  <Globe className="w-4.5 h-4.5" />
                </div>
                <h3 className="font-display font-bold text-lg mb-1 text-foreground">Aura Colors</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Synthesizes your emotional color field based on playlist acoustic features.
                </p>
              </div>
              <div className="flex items-center justify-center relative py-2">
                <div className="w-12 h-12 rounded-full bg-blue-500/25 blur-md animate-pulse-glow" style={{ background: "radial-gradient(circle, var(--neon-blue), transparent)" }} />
                <div className="absolute w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-600 border border-white/20 shadow-inner" />
              </div>
            </TiltCard>

            {/* Feature 6: Shareable Story Card (Col 9-12, Row span 1) */}
            <TiltCard className="md:col-span-4 p-6 flex flex-col justify-between min-h-[220px]" glowColor="rgba(34, 211, 102, 0.2)">
              <div>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4 bg-green-500/10 border border-green-500/30 text-green-400">
                  <Share2 className="w-4.5 h-4.5" />
                </div>
                <h3 className="font-display font-bold text-lg mb-1 text-foreground">Instagram Story Card</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Download high-resolution vertical graphics showing your statistics instantly.
                </p>
              </div>
              <div className="inline-flex items-center gap-1 text-[11px] text-primary font-bold hover:underline cursor-pointer">
                Export Layout Preview <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </TiltCard>

          </div>
        </div>
      </section>

      {/* ── Premium Archetypes Preview Grid ── */}
      <section id="archetypes" className="py-28 px-6 bg-secondary/5 dark:bg-black/10 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/80 border border-border text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-4">
              <Star className="w-3.5 h-3.5 text-yellow-400" /> Archetype Catalog
            </div>
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-4 tracking-tight">
              Which frequency are <span className="gradient-text-green">you tuning into?</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-sm">
              Discover which of our 8 musical personas fits your listening history.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {archetypes.map((a, i) => (
              <motion.div
                key={a.title}
                className="relative rounded-3xl p-6 overflow-hidden border border-white/5 cursor-pointer flex flex-col justify-between group min-h-[220px]"
                style={{ background: a.gradient }}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ scale: 1.02, y: -4 }}
              >
                {/* Backdrop blur layer */}
                <div className="absolute inset-0 bg-black/45 dark:bg-black/35 backdrop-blur-[2px] transition-all duration-300 group-hover:bg-black/20" />
                
                <div className="relative z-10">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 inline-block">{a.emoji}</div>
                  <h3 className="font-display font-bold text-white text-xl mb-2">{a.title}</h3>
                  <p className="text-white/70 text-xs leading-relaxed mb-4">{a.desc}</p>
                </div>

                <div className="relative z-10 flex flex-wrap gap-1.5">
                  {a.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-full bg-white/10 text-[9px] font-bold text-white/90">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link
              href="/api/auth/spotify"
              className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full border border-primary/30 text-xs font-bold uppercase tracking-wider text-primary hover:bg-primary/10 transition-all hover:scale-105"
            >
              Analyze my catalog <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Final Glowing CTA Section ── */}
      <section className="relative py-36 px-6 overflow-hidden border-t border-border">
        {/* Massive Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-15 dark:opacity-20 blur-[150px] pointer-events-none -z-10" style={{ background: "radial-gradient(circle, var(--primary), var(--neon-purple), transparent)" }} />
        
        <motion.div
          className="max-w-3xl mx-auto text-center relative z-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="relative inline-block mb-10">
            <div className="absolute inset-0 rounded-full blur-3xl opacity-30 bg-gradient-to-r from-primary to-neon-purple animate-pulse" />
            <div className="relative glass rounded-3xl px-8 py-4 border border-primary/20 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
              <Waveform color="var(--primary)" count={20} />
            </div>
          </div>

          <h2 className="font-display font-bold text-4xl sm:text-6xl text-foreground mb-6 leading-tight tracking-tight">
            Ready to discover <br />
            your <span className="gradient-text-green font-extrabold">sonic DNA?</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base mb-10 max-w-xl mx-auto leading-relaxed">
            Fast, secure, and 100% free. Connect your Spotify profile to unveil your dashboard and shareable details.
          </p>

          <Magnetic>
            <Link
              href="/api/auth/spotify"
              id="bottom-cta"
              className="group inline-flex items-center gap-2.5 px-10 py-5 rounded-full text-base font-extrabold uppercase tracking-wider transition-all duration-300 shadow-[0_8px_30px_var(--glow-green)] hover:shadow-[0_8px_45px_var(--glow-green)] cursor-pointer"
              style={{ background: "linear-gradient(135deg, var(--primary), var(--neon-green))", color: "#000" }}
            >
              <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              Connect My Spotify
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Magnetic>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-border py-12 px-6 bg-card/40">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--primary), var(--neon-purple))" }}>
              <Music className="w-4 h-4 text-black" />
            </div>
            <span className="font-display font-bold text-foreground text-sm tracking-tight">EchoDNA</span>
          </div>
          <p className="text-center text-[10px] uppercase tracking-wider text-muted-foreground max-w-md leading-relaxed">
            Built for the 8x Engineer contest. Not affiliated with Spotify. We process data strictly client-side.
          </p>
          <div className="flex items-center gap-6 text-[10px] uppercase tracking-wider font-semibold">
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
