# EchoDNA — Your Music. Your DNA.

> **A Spotify Wrapped–style music personality analyzer** that connects to your Spotify, analyzes your listening patterns, and generates your unique listening archetype, genre DNA, mood spectrum, music alter ego, and shareable story cards.

![EchoDNA](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8) ![Framer Motion](https://img.shields.io/badge/Framer%20Motion-11-purple)

---

## ✨ What I Built

**EchoDNA** is a cinematic, mobile-first music personality analyzer that feels like Spotify Wrapped meets a premium personality test.

### Core Features
- 🎵 **Spotify OAuth** — secure login with token refresh, error recovery
- 🧠 **Personality Engine** — deterministic analysis from your actual listening data
- 🧬 **Genre DNA** — animated pie chart of your musical genome
- 🎭 **Mood Spectrum** — radar chart of your emotional audio features
- 🌙 **8 Listening Archetypes** — Midnight Dreamer, Neon Rebel, Indie Philosopher, Emotional Astronaut, Chaos Curator, Vintage Romantic, Sonic Explorer, Melancholy Poet
- 🎲 **Music Alter Ego** — fictional persona with name, quote, aesthetic
- ✨ **Aura Reading** — emotional aura based on mood profile
- 💞 **Compatibility** — how you vibe with other archetypes
- 📸 **Story Cards** — PNG export for Instagram/Twitter sharing
- 📊 **Listening Stats** — artist count, genre diversity, popularity score

### Design Highlights
- Premium dark theme with neon accents and glassmorphism
- Cinematic animations with Framer Motion
- Floating particles, animated waveforms, gradient text
- Mobile-first responsive design
- Demo mode (works without Spotify login)
- Reduced-motion support for accessibility

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| Next.js 16 + React 19 | Framework & rendering |
| TypeScript | Type safety |
| Tailwind CSS v4 | Design system |
| Framer Motion | Animations |
| Recharts | Genre DNA & Mood charts |
| html-to-image | PNG story card export |
| Zustand | Global state management |
| shadcn/ui | Base UI components |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/echodna.git
cd echodna
npm install
```

### 2. Set Up Spotify App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Click **Create App**
3. Set **Redirect URI** to: `http://localhost:3000/api/auth/callback`
4. Note your **Client ID** and **Client Secret**

### 3. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
SPOTIFY_REDIRECT_URI=http://localhost:3000/api/auth/callback
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Demo Mode

The app works without Spotify credentials — visit `/dashboard` directly to see the demo personality profile.

---

## 📁 Architecture

```
/app
  page.tsx                    ← Landing page (hero, features, testimonials)
  layout.tsx                  ← Root layout, dark theme, SEO
  /loading/page.tsx           ← Animated sync experience
  /dashboard/page.tsx         ← Full results dashboard
  /auth-error/page.tsx        ← Error handling for auth edge cases
  /api/
    /auth/spotify/route.ts    ← OAuth initiation
    /auth/callback/route.ts   ← OAuth callback + token storage
    /spotify/analyze/route.ts ← Data fetch + personality analysis

/components/dashboard/
  HeroCard.tsx                ← Archetype reveal
  GenreDNA.tsx                ← Pie chart (Recharts)
  MoodSpectrum.tsx            ← Radar chart
  AlterEgoCard.tsx            ← Fictional persona
  TopArtistsGrid.tsx          ← Artist cards with images
  AuraSummary.tsx             ← Emotional aura
  ListeningStats.tsx          ← Stat counters
  ExportSection.tsx           ← Story card + PNG export
  CompatibilitySection.tsx    ← Archetype compatibility

/lib/
  spotify.ts                  ← Spotify API client (retry, timeout, refresh)
  personality-engine.ts       ← Core analysis algorithm
  archetypes.ts               ← 8 archetype definitions
  store.ts                    ← Zustand global store

/types/
  spotify.ts                  ← Spotify API types
  personality.ts              ← Personality result types

/ai-logs/                     ← AI conversation logs (required for contest)
```

---

## 🔐 Spotify Integration

### OAuth Flow
1. User clicks "Analyze My Spotify"
2. Server generates CSRF state → stores in httpOnly cookie
3. Redirect to Spotify authorize URL
4. Spotify redirects back with auth code
5. Server exchanges code for tokens → httpOnly cookies
6. Redirect to loading page → fetch + analyze → dashboard

### Data Fetched
- Top artists (medium term, 20)
- Top tracks (medium term, 20)
- Audio features (all top tracks)
- Recently played (20)
- User profile

### Edge Cases Handled
- Cancelled login → friendly error page with retry
- Expired tokens → auto-refresh via refresh token
- Rate limits → graceful null return, partial data flag
- Network timeout → 8-second AbortController
- Empty listening history → default personality profile
- Missing audio features → null-coalesced to 0.5

---

## 🧠 Personality Engine

The personality engine uses a **weighted scoring algorithm**:

1. **Extract genres** from top artists (deduplicated, frequency-sorted)
2. **Build mood profile** by averaging audio features across tracks
3. **Score 8 archetypes** based on mood weights + genre keyword matching
4. **Select highest scorer** as primary archetype
5. **Map archetype → alter ego** with name, quote, aesthetic
6. **Determine aura** from mood profile conditional matching
7. **Build genre DNA** with weighted distribution + color coding

No external AI API required — 100% deterministic, <10ms execution time.

---

## 🎨 Design System

- **Background**: #080810 (near-black with blue undertone)
- **Primary**: #1db954 (Spotify green)
- **Typography**: Inter + Space Grotesk
- **Effects**: Glassmorphism, neon glow, gradient text
- **Animations**: Framer Motion + CSS keyframes
- **Accessibility**: Reduced motion, ARIA labels, semantic HTML

---

## 📱 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Update `SPOTIFY_REDIRECT_URI` to `https://your-domain.vercel.app/api/auth/callback`
5. Add the production redirect URI in Spotify Developer Dashboard
6. Deploy

---

## 📋 AI Logs

See `/ai-logs/` for detailed AI conversation logs covering:
- `01-architecture.md` — Architecture & design decisions
- `02-personality-engine.md` — Personality algorithm design
- `03-ui-design.md` — UI design system & visual strategy
- `04-spotify-integration.md` — OAuth & edge case handling
- `05-performance.md` — Performance optimization strategies

---

## 🎥 Loom Walkthrough

[Link to Loom walkthrough video] — 5 minute demo covering:
1. Landing page visual design
2. Spotify login flow
3. Loading animation experience
4. Dashboard personality reveal
5. Genre DNA & Mood Spectrum charts
6. Alter ego & aura reading
7. Story card export flow
8. Mobile responsiveness

---

## ✅ What I'd Improve With More Time

See [REFLECTION.md](./REFLECTION.md) for detailed reflection.

Quick summary:
- Add Gemini AI for dynamic personality summaries
- Friend compatibility with shared links
- Playlist recommendation engine
- Story mode (swipeable personality reveal)
- Server-side OG image generation for social sharing
- E2E tests with Playwright
- Internationalization (i18n)
