# AI Log 02 — Personality Engine Design

## Prompt
Design the personality engine algorithm. It needs to:
- Take Spotify data (top artists, tracks, audio features) as input
- Output: listening archetype, alter ego, mood profile, aura type, genre DNA
- Be deterministic (same data = same result)
- Handle edge cases: empty data, missing fields, null values
- Feel "surprisingly accurate" to users

## Response

### Algorithm Overview

The personality engine uses a **weighted scoring system** rather than ML or AI APIs. This was an intentional decision:

1. **Speed**: No API latency — analysis completes in <10ms
2. **Consistency**: Same data always produces the same result
3. **Offline capability**: Works without any external service
4. **Cost**: Zero API costs for the core product

### Step 1: Genre Extraction & Normalization
- Extract genres from all top artists
- Deduplicate and normalize (lowercase, trim)
- Sort by frequency (most common first)
- This becomes the "Genre DNA"

### Step 2: Mood Profile Calculation
- Average all audio features across top tracks:
  - `energy` (0-1): How intense the music feels
  - `danceability` (0-1): Rhythm strength
  - `valence` (0-1): Happiness/positivity
  - `acousticness` (0-1): Acoustic vs electronic
  - `instrumentalness` (0-1): Instrumental vs vocal
  - `tempo` (BPM): Speed/pace
- Every value null-coalesced with `safeNum()` helper
- Clamped to valid ranges with `clamp()`

### Step 3: Archetype Scoring
Each of the 8 archetypes is scored (0-100) based on:
- **Mood profile weights**: Different archetypes weight different features
- **Genre keyword matching**: Genre strings checked for relevant keywords
- **Diversity bonus**: Chaos Curator and Sonic Explorer get bonus for high genre variety

Example scoring for "Midnight Dreamer":
```
score += (1 - energy) * 30      // Low energy = dreamy
score += acousticness * 20       // Acoustic feel
score += (1 - valence) * 15      // Melancholic tendency
if genres include "lo-fi"/"ambient": score += 25
if genres include "indie"/"dream": score += 15
```

The highest-scoring archetype wins.

### Step 4: Alter Ego Generation
Each archetype maps to a pre-crafted alter ego with:
- Fictional name (e.g., "Luna Vale")
- Summary, fashion aesthetic, cinematic vibe
- Favorite environment, signature quote

### Step 5: Aura Determination
Conditional matching based on mood profile:
- High energy + high valence → Solar Aura ☀️
- Low energy + high acousticness → Lunar Aura 🌙
- Low valence → Indigo Aura 💜
- High danceability → Prism Aura ✨

### Edge Case Handling
| Edge Case | Solution |
|-----------|----------|
| No audio features | Default mood profile (0.5 for all) |
| Empty artist list | "Genre Explorer" fallback genre |
| NaN/undefined values | `safeNum()` returns 0 |
| No genres at all | Chaos Curator scored via diversity=0 |
| Single dominant genre | Naturally scores highest for matching archetype |

### Why It Feels Accurate
The secret is that the archetypes are **broadly relatable**. Most people:
1. Listen to music that matches a clear pattern (indie=philosopher, EDM=rebel)
2. See themselves in the "strengths" of any archetype
3. Feel validated by specific language ("romanticizes city lights", "finds meaning in B-sides")

The Barnum effect + genuine audio feature data = perceived accuracy.
