"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Music, AlertTriangle, RefreshCw, Home, ArrowRight } from "lucide-react";

const ERROR_MESSAGES: Record<string, { title: string; description: string; canRetry: boolean }> = {
  access_denied: {
    title: "Login Cancelled",
    description: "You cancelled the Spotify login. No worries — you can try again anytime.",
    canRetry: true,
  },
  auth_init_failed: {
    title: "Connection Failed",
    description: "We couldn't start the Spotify authentication process. Please check your internet and try again.",
    canRetry: true,
  },
  missing_params: {
    title: "Invalid Response",
    description: "We received an incomplete response from Spotify. This sometimes happens with browser extensions or ad blockers.",
    canRetry: true,
  },
  state_mismatch: {
    title: "Security Check Failed",
    description: "The authentication session expired or was intercepted. This can happen if you have multiple tabs open. Please try again.",
    canRetry: true,
  },
  token_exchange_failed: {
    title: "Authentication Error",
    description: "We couldn't verify your Spotify account. This might be a temporary issue with Spotify's servers.",
    canRetry: true,
  },
  UNAUTHORIZED: {
    title: "Session Expired",
    description: "Your Spotify session has expired. Please reconnect to continue.",
    canRetry: true,
  },
  REFRESH_FAILED: {
    title: "Session Refresh Failed",
    description: "We couldn't refresh your session. Please log in again.",
    canRetry: true,
  },
  network_error: {
    title: "Network Error",
    description: "We couldn't reach our servers. Please check your internet connection and try again.",
    canRetry: true,
  },
  FETCH_FAILED: {
    title: "Data Fetch Failed",
    description: "We had trouble fetching your Spotify data. This could be a temporary issue.",
    canRetry: true,
  },
  spotify_credentials_not_configured: {
    title: "Spotify API Key Missing",
    description: "The Spotify Developer credentials are not configured in your environmental variables. Copy '.env.example' to '.env.local' and add your Client ID & Secret from the Spotify Developer Dashboard.",
    canRetry: false,
  },
  default: {
    title: "Something Went Wrong",
    description: "An unexpected error occurred. We're sorry about that. Please try again.",
    canRetry: true,
  },
};

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason") || "default";
  const errorInfo = ERROR_MESSAGES[reason] || ERROR_MESSAGES.default;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{
            background: "radial-gradient(circle, #ef4444, transparent)",
            top: "20%",
            left: "30%",
          }}
        />
      </div>

      <motion.div
        className="relative z-10 max-w-md w-full text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #1db954, #22d366)" }}
          >
            <Music className="w-5 h-5 text-black" />
          </div>
          <span className="font-display font-bold text-xl text-white">EchoDNA</span>
        </div>

        {/* Error icon */}
        <motion.div
          className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
          style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)" }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <AlertTriangle className="w-10 h-10 text-red-400" />
        </motion.div>

        {/* Error content */}
        <h1 className="font-display font-bold text-3xl text-white mb-3">
          {errorInfo.title}
        </h1>
        <p className="text-muted-foreground leading-relaxed mb-8">
          {errorInfo.description}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {errorInfo.canRetry && (
            <Link
              href="/api/auth/spotify"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold transition-all hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #1db954, #22d366)",
                color: "#000",
              }}
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Link>
          )}

          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold glass border border-white/10 hover:border-white/20 transition-all"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* Help text */}
        <p className="text-xs text-muted-foreground mt-8">
          If the problem persists, try disabling browser extensions or using a different browser.
        </p>
      </motion.div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AuthErrorContent />
    </Suspense>
  );
}
