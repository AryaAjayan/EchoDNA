# AI Log 01 — Architecture & Design Decisions

## Prompt
Design the architecture for a Spotify Wrapped-style music personality analyzer web app. It needs to:
1. Connect to Spotify OAuth
2. Fetch user's listening data (top tracks, artists, audio features)
3. Run a personality analysis engine
4. Generate archetypes, alter egos, mood spectrums, genre DNA
5. Display results in a premium dashboard
6. Export shareable story cards as PNG

Key constraints:
- Build on the 8x Engineer starter template (Next.js 16, React 19, Tailwind v4, shadcn/ui)
- Must be production-grade with edge case handling
- Prioritize visual polish — screenshots are the most important judging criteria
- Mobile-first responsive design

## Response

### Architecture Decision: Client-Side vs Server-Side Personality Engine

**Decision: Server-side API route with client-side rendering**

The personality engine runs server-side in Next.js API routes for several reasons:
1. **Security**: Spotify tokens stay server-side in httpOnly cookies, never exposed to client
2. **Performance**: Data fetching and analysis happen in a single API call, reducing round trips
3. **Edge case handling**: Server can gracefully handle token refresh, rate limits, and partial failures before the client even knows
4. **Simplicity**: One `/api/spotify/analyze` endpoint returns everything the dashboard needs

### State Management: Zustand vs Context API

**Decision: Zustand**

For a personality analyzer that needs to pass data between loading → dashboard → export flows:
- Zustand's `create` store is simpler than React Context + useReducer
- No provider wrapping needed — state is globally accessible
- Perfect for the "fetch once, display everywhere" pattern
- Built-in selector support prevents unnecessary rerenders in dashboard sections

### Data Flow

```
Landing Page → Spotify OAuth → Callback → Loading Page → API Analyze → Dashboard
                                              ↓
                              - Fetch Spotify data (parallel requests)
                              - Run personality engine
                              - Return results JSON
```

### File Structure

```
/app
  page.tsx              ← Landing page (no auth required)
  layout.tsx            ← Root layout, dark theme
  /loading/page.tsx     ← Animated loading/sync experience
  /dashboard/page.tsx   ← Results dashboard
  /auth-error/page.tsx  ← Error handling for all auth edge cases
  /api/
    /auth/spotify/      ← OAuth initiation
    /auth/callback/     ← OAuth callback + token storage
    /spotify/analyze/   ← Main data fetch + personality engine

/components/dashboard/
  HeroCard.tsx          ← Archetype reveal
  GenreDNA.tsx          ← Pie chart (Recharts)
  MoodSpectrum.tsx      ← Radar chart (Recharts)
  AlterEgoCard.tsx      ← Fictional alter ego
  TopArtistsGrid.tsx    ← Artist cards
  AuraSummary.tsx       ← Aura color + description
  ListeningStats.tsx    ← Stat counters
  ExportSection.tsx     ← Story card + PNG export
  CompatibilitySection.tsx ← Archetype compatibility

/lib/
  spotify.ts            ← Spotify API client with retry/timeout
  personality-engine.ts ← Core analysis algorithm
  archetypes.ts         ← 8 archetype definitions
  store.ts              ← Zustand global store
```

### Key Design Decisions
1. **Deterministic personality engine** — no AI dependency for core analysis; works offline, fast, predictable
2. **Progressive enhancement** — demo mode works without Spotify auth; real data enhances the experience
3. **Graceful degradation** — every API call wrapped in try/catch with null-coalescing fallbacks
4. **Cookie-based auth** — httpOnly cookies for Spotify tokens; no localStorage exposure
