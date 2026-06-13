# EchoDNA — Your Music. Your DNA.

EchoDNA is a music personality analyzer that connects to your Spotify, analyzes your listening patterns, and generates your unique listening archetype, genre DNA, mood spectrum, music alter ego, and shareable story cards.

![EchoDNA](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8) ![Framer Motion](https://img.shields.io/badge/Framer%20Motion-11-purple)

---

## Architectural Features

EchoDNA is a cinematic, mobile-first music personality analyzer that provides a premium, interactive personality breakdown based on actual Spotify listening history.

### Core Features
- **Spotify OAuth Integration**: Secure authentication flow utilizing cookie-stored credentials, automated token refresh, and edge-case error recovery.
- **Personality Engine**: A deterministic analysis algorithm running on top-tracks and artists metadata.
- **Genre DNA Visualizer**: Radial-styled breakdown graphing your musical genres.
- **Mood Spectrum Mapping**: Interactive radar chart plotting valence, energy, acousticness, and danceability.
- **Listening Archetypes**: Maps users to one of 8 distinct listening types (e.g., Midnight Dreamer, Neon Rebel, Indie Philosopher, Emotional Astronaut, Vintage Romantic, Sonic Explorer, Melancholy Poet).
- **Music Alter Ego**: Generates a fictional musician persona matching your core aesthetic.
- **Aura Identification**: Creates a responsive gradient representing the emotional tone of your library.
- **Compatibility Index**: Visual comparison displaying how well your profile aligns with other archetypes.
- **Story Card Exporter**: High-resolution 9:16 vertical PNG layouts optimized for social sharing.
- **Detailed Metrics**: Numerical counters displaying artist counts, genre diversity, and popularity indices.

### Visual & Interactive Highlights
- Premium dark-theme layout with dynamic light-mode transition variables.
- Fluid soundwave canvas animation reacting to user mouse movements.
- Staggered word-by-word entrance animations and magnetic button wrappers.
- Three-dimensional card hover tilt transformations.
- Complete responsive design optimized for mobile viewports.
- Integrated Demo Mode allowing instant feature validation without Spotify login.
- Keyboard navigation and reduced-motion styling for accessibility.

---

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| Next.js 16 + React 19 | Application framework and server rendering |
| TypeScript | Type safety and schema enforcement |
| Tailwind CSS v4 | Utility classes and theme design tokens |
| Framer Motion | Smooth springs and transition physics |
| Recharts | Interactive radar and circular graphics |
| html-to-image | Client-side PNG rendering and export |
| Zustand | Unified client application state management |

---

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or pnpm package managers

### 1. Installation

```bash
git clone https://github.com/AryaAjayan/EchoDNA.git
cd EchoDNA
npm install
```

### 2. Configure Spotify Application

1. Open the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Select **Create App**
3. Configure the **Redirect URI** to: `http://localhost:3000/api/auth/callback`
4. Copy your **Client ID** and **Client Secret** credentials

### 3. Environment Variables Setup

Create a local environment file:

```bash
cp .env.example .env.local
```

Edit the values in `.env.local`:

```env
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
SPOTIFY_REDIRECT_URI=http://localhost:3000/api/auth/callback
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Running the App

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) inside your browser.

### 5. Offline Demo Validation
You can bypass the Spotify authentication requirement by navigating directly to `/dashboard` to view the demo data layout.

---

## Directory Structure

```
/app
  page.tsx                    ← Redesigned landing page (canvas background, bento grid)
  layout.tsx                  ← Root layout config, theme provider, fonts, SEO
  /loading/page.tsx           ← Animated visual syncing status
  /dashboard/page.tsx         ← Results analysis dashboard
  /auth-error/page.tsx        ← Error display for invalid states or credentials
  /api/
    /auth/spotify/route.ts    ← Initiates Spotify authorization redirect
    /auth/callback/route.ts   ← Exchanges authorization code for tokens
    /spotify/analyze/route.ts ← Resolves listening history and computes profile

/components/dashboard/
  HeroCard.tsx                ← Displays listening archetype with auric backgrounds
  GenreDNA.tsx                ← Custom radial genre graph
  MoodSpectrum.tsx            ← Mood radar chart
  AlterEgoCard.tsx            ← Visual musician persona block
  TopArtistsGrid.tsx          ← Grid items containing artist graphics
  AuraSummary.tsx             ← Auric visual details
  ListeningStats.tsx          ← Value counters
  ExportSection.tsx           ← Story layout preview and PNG exporter
  CompatibilitySection.tsx    ← Match index visualizer

/lib/
  spotify.ts                  ← Spotify client with rate-limiting and token refresh
  personality-engine.ts       ← Core profile matching calculations
  archetypes.ts               ← 8 metadata definitions
  store.ts                    ← Global state store

/types/
  spotify.ts                  ← Spotify API data shapes
  personality.ts              ← Personality types
```

---

## Authorization & API Specifications

### OAuth Protocol
1. User requests analysis via the connection CTA.
2. The server generates an anti-CSRF state token and stores it in an httpOnly cookie.
3. User is redirected to Spotify's authorization server.
4. On user approval, Spotify forwards an authorization code to our callback API.
5. The callback service exchanges the code for access/refresh tokens and stores them in httpOnly cookies.
6. The client is redirected to the dashboard processing page.

### Data Collection Scope
- User Profile: `user-read-private`, `user-read-email`
- Top Artists: `user-top-read` (medium-term span)
- Top Tracks: `user-top-read` (medium-term span)
- Audio Features: Resolved for all top tracks
- Recently Played: `user-read-recently-played`

### Error Tolerances
- **Auth Rejection**: Redirects back to home page displaying explaining toast.
- **Token Expiry**: Handled on-the-fly via silent refresh requests.
- **Rate-Limiting (429)**: Backs off and falls back to partial metadata rendering safely.
- **Network Interruptions**: Requests are bound by an 8-second client-side timeout wrapper.
- **Empty History**: Fails over to "Sonic Embryo" status instead of returning structural crashes.

---

## Personality Calculation Engine

The profile scoring operates deterministically:

1. **Genre Extraction**: Extracts genres from top artists, sorts by frequency weightings, and filters out duplicates.
2. **Mood Profile**: Calculates mean values for audio features (energy, valence, tempo, acousticness, danceability).
3. **Archetype Mapping**: Evaluates the mean features against the reference criteria defined for each of the 8 archetypes.
4. **Alter Ego Selection**: Retrieves the alter ego archetype containing name metadata, quotes, and visual references.
5. **Aura Resolution**: Evaluates valence and acoustics to assign color coordinates.

The system relies entirely on deterministic mapping, executing in under 10ms with zero external API calls.

---

## Design System Specifications

- **Theme Variable System**: Transitions CSS variables from Dark mode (base `#080810`) to Light mode (base `#f7f8fc`) seamlessly.
- **Frosted Glass (Glassmorphism)**: Controlled by variables `--glass-bg`, `--glass-border`, and `--glass-blur` to adapt visibility.
- **Fine-Grain Overlay**: Set at `0.028` opacity in dark mode and `0.015` opacity in light mode.
- **Transitional Easing**: Bound to `.6s` cubic-bezier transitions for background, border, color, and shadow properties.
- **Accessibility Compliance**: Implements aria role tags, checks system settings for reduced-motion limits, and maintains color contrasts.

---

## Deployment Instructions

### Vercel Deployment

1. Commit changes to your Git repository and push.
2. Link the repository inside your [Vercel Dashboard](https://vercel.com).
3. Configure the environment variables:
   - `SPOTIFY_CLIENT_ID`
   - `SPOTIFY_CLIENT_SECRET`
   - `SPOTIFY_REDIRECT_URI` (pointing to your Vercel callback endpoint)
   - `NEXT_PUBLIC_APP_URL` (pointing to your Vercel deployment URL)
4. Update redirect URIs in the Spotify Developer Dashboard to match.
5. Deploy.

---

## Video Walkthrough

A video demonstration covers:
1. Animated landing page interface
2. Complete Spotify authentication flow
3. Cinematic progress loader
4. Dashboard and archetype visualizations
5. Bento grid interactive components
6. Instagram Story PNG export utility
7. Mobile responsive layout testing

---

## Future Scope

Planned upgrades:
- Dynamic, AI-curated personality summaries using Gemini API.
- Shared URLs to test listening compatibility with friends.
- Personalized playlist curation based on computed archetypes.
- Swipable visual story card presentation modes.
- Edge-rendered Open Graph (OG) dynamic card images.
- Integration tests using Playwright.
- Internationalization (i18n) settings.
