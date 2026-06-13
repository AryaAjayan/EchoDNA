"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Headphones, Home, Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useAppStore } from "@/lib/store";

export function Navigation() {
  const pathname = usePathname();
  const { spotifyUser } = useAppStore();
  const { theme, setTheme, resolvedTheme } = useTheme();
  
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = pathname === "/";

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const activeTheme = mounted ? (theme === "system" ? resolvedTheme : theme) : "dark";

  const toggleTheme = () => {
    setTheme(activeTheme === "dark" ? "light" : "dark");
  };

  const navLinks = [
    { label: "Features", href: isHome ? "#features" : "/#features" },
    { label: "Archetypes", href: isHome ? "#archetypes" : "/#archetypes" },
  ];

  return (
    <>
      <header
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl rounded-full transition-all duration-500 border ${
          isScrolled
            ? "glass-strong py-2.5 px-6 shadow-[0_20px_50px_rgba(0,0,0,0.1)] scale-98 border-primary/20 backdrop-blur-2xl"
            : "glass py-4 px-6 border-white/5 shadow-sm"
        }`}
      >
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:rotate-12" style={{ background: "linear-gradient(135deg, var(--primary), var(--neon-purple))" }}>
              <Music className="w-4 h-4 text-black dark:text-black" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              EchoDNA
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors py-1.5 px-3 rounded-full hover:bg-secondary/40"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-secondary/80 hover:bg-secondary border border-border text-foreground transition-all hover:scale-105 active:scale-95 cursor-pointer relative overflow-hidden"
              aria-label="Toggle Theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                {activeTheme === "dark" ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, scale: 0, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: 90, scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <Sun className="w-4 h-4 text-amber-400" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: -90, scale: 0, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: 90, scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <Moon className="w-4 h-4 text-violet-500" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {!isHome && (
              <Link
                href="/"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border border-border bg-secondary/40 hover:bg-secondary/80 text-foreground transition-all hover:scale-105 active:scale-95"
              >
                <Home className="w-3.5 h-3.5" />
                Home
              </Link>
            )}

            {spotifyUser ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 px-4.5 py-2 rounded-full text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_4px_20px_var(--glow-green)] hover:shadow-[0_4px_30px_var(--glow-green)]"
                style={{ background: "linear-gradient(135deg, var(--primary), var(--neon-purple))", color: "#000" }}
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/api/auth/spotify"
                className="flex items-center gap-1.5 px-4.5 py-2 rounded-full text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_4px_20px_var(--glow-green)] hover:shadow-[0_4px_30px_var(--glow-green)]"
                style={{ background: "linear-gradient(135deg, var(--primary), var(--neon-green))", color: "#000" }}
              >
                <Headphones className="w-3.5 h-3.5" />
                Connect Spotify
              </Link>
            )}
          </div>

          {/* Mobile Menu Button + Theme Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-secondary/80 border border-border text-foreground transition-all"
              aria-label="Toggle Theme"
            >
              {activeTheme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-violet-500" />
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-secondary/80 border border-border text-foreground transition-all"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-22 left-4 right-4 z-40 p-5 rounded-3xl glass shadow-2xl border border-white/10 flex flex-col gap-4 md:hidden"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-left py-3 px-4 rounded-xl hover:bg-secondary/60 text-sm font-semibold tracking-wide text-foreground/80 hover:text-foreground transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="h-px bg-border w-full" />

            <div className="flex flex-col gap-3">
              {!isHome && (
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-secondary/40 transition-all"
                >
                  <Home className="w-4 h-4" />
                  Home
                </Link>
              )}

              {spotifyUser ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-3.5 px-4 rounded-xl text-sm font-bold text-center transition-all"
                  style={{ background: "linear-gradient(135deg, var(--primary), var(--neon-purple))", color: "#000" }}
                >
                  Go to Dashboard
                </Link>
              ) : (
                <Link
                  href="/api/auth/spotify"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-center transition-all"
                  style={{ background: "linear-gradient(135deg, var(--primary), var(--neon-green))", color: "#000" }}
                >
                  <Headphones className="w-4 h-4" />
                  Connect Spotify
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
