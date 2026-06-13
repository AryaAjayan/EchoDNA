# AI Log 04 — Spotify Integration & Edge Cases

## Prompt
Implement Spotify OAuth and data fetching with production-grade error handling. The app must never crash. Handle every edge case: cancelled login, expired tokens, empty data, rate limits, network failures, etc.

## Response

### OAuth Flow Design

```
User clicks CTA → GET /api/auth/spotify
  → Generate CSRF state token → store in httpOnly cookie
  → Redirect to Spotify authorize URL

Spotify redirects → GET /api/auth/callback
  → Validate state token (CSRF protection)
  → Exchange code for access + refresh tokens
  → Store tokens in httpOnly cookies
  → Redirect to /loading
```

**Security decisions**:
- Tokens never touch client-side JavaScript (httpOnly cookies)
- CSRF state verified on callback (prevents session fixation)
- State cookie expires in 10 minutes (prevents stale auth)
- Cookies use `secure: true` in production

### Edge Case Matrix

| Scenario | Detection | Response |
|----------|-----------|----------|
| User cancels login | `error=access_denied` in callback | Redirect to `/` with toast |
| Popup blocked | N/A (we use redirect, not popup) | No issue — redirect flow |
| Invalid redirect URI | Spotify returns error | Error page with retry |
| Expired token | 401 from Spotify API | Auto-refresh via refresh token |
| Refresh token invalid | Refresh request fails | Redirect to re-auth |
| Rate limited | 429 from Spotify API | Return null, mark data partial |
| Network timeout | AbortController after 8s | Graceful null return |
| Empty listening history | Empty arrays from API | Default mood profile (0.5) |
| Missing audio features | Null items in array | Filter nulls, use defaults |
| Corrupt API response | JSON parse fails | Return null for that endpoint |
| Multiple tabs auth | State mismatch | Error page with explanation |

### Spotify API Client Design

```typescript
class SpotifyClient {
  // Every method returns T | null — never throws
  async getTopArtists(): SpotifyArtist[] // empty array on failure
  async getTopTracks(): SpotifyTrack[]   // empty array on failure  
  async getAudioFeatures(): AudioFeatures[] // empty array on failure
}
```

**Key principle**: Every API method catches its own errors and returns a safe default. The caller never needs try/catch.

### Data Fetching Strategy

All data fetched in **parallel** via `Promise.allSettled()`:
```typescript
const [user, artists, tracks, recent] = await Promise.allSettled([
  client.getUser(),
  client.getTopArtists(),
  client.getTopTracks(),
  client.getRecentlyPlayed(),
]);
```

**Why `allSettled` not `all`?**
- `Promise.all` fails if ANY request fails
- `allSettled` returns all results, even if some failed
- We mark `isPartial: true` if any failed — dashboard still renders

### Token Refresh Logic

Before making API calls:
1. Check `spotify_expires_at` cookie
2. If within 30 seconds of expiry → refresh
3. If refresh succeeds → update cookies, continue
4. If refresh fails → return 401 → client redirects to re-auth

The 30-second buffer prevents race conditions where the token expires between check and use.

## Prompt
What about users with no listening data at all?

## Response

### Empty Data Handling

If a user has no top artists/tracks (brand new Spotify account):

1. **Genre DNA**: Shows single item — "Genre Explorer" at 100%
2. **Mood Profile**: All values default to 0.5 (balanced)
3. **Archetype**: Chaos Curator scores highest (high diversity bonus with zero genres = baseline)
4. **Alter Ego**: Mapped from archetype as usual
5. **Stats**: Show zeros — "0 artists, 0 genres"

**The dashboard never shows**:
- `undefined` or `NaN`
- Empty charts with no data
- Broken layouts from missing arrays
- "null" strings in any text

Every text interpolation uses null coalescing:
```typescript
const name = artist.name || "Unknown Artist";
const genres = artist.genres?.slice(0, 2).join(", ") || "Artist";
```
