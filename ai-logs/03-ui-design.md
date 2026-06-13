# AI Log 03 — UI Design & Visual System

## Prompt
Design the visual system for EchoDNA. It should feel like Spotify Wrapped meets a premium personality test. The contest prioritizes screenshots above all else — every screen must look like it belongs to a funded startup.

Design inspirations: Spotify Wrapped, Linear, Apple, Raycast, Vercel.

## Response

### Brand Identity: EchoDNA

**Name reasoning**: "Echo" = music/sound reflection. "DNA" = deeply personal, genetic-level understanding. Together: "Your music echoes reveal your sonic DNA."

**Tagline**: "Your music. Your DNA."

### Color System

```css
--background: #080810     /* Near-black with blue undertone */
--foreground: #f0f0ff     /* Warm white */
--neon-green: #1db954     /* Spotify green — primary CTA */
--neon-purple: #a855f7    /* Secondary accent */
--neon-pink: #ec4899      /* Tertiary highlight */
--neon-blue: #3b82f6      /* Info/data */
```

**Why these colors?**
- #080810 (not pure black) creates depth — pure black feels flat
- Spotify green (#1db954) provides instant familiarity
- Purple and pink add warmth and personality (Wrapped-esque)
- All colors are high-saturation for screenshot impact

### Typography

- **Display/Headlines**: Space Grotesk — geometric, techy, premium
- **Body**: Inter — extremely readable, professional
- **Weight range**: 300-900 for strong hierarchy

### Glass Morphism Implementation

```css
.glass {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
```

**Why 0.04 opacity?** Lower than typical glassmorphism — creates subtle layering without looking "frosted glass cliché." The blur does most of the work.

### Glow Effects

Each archetype has its own glow color:
- Midnight Dreamer: purple glow (#7C3AED)
- Neon Rebel: orange glow (#F97316)
- Emotional Astronaut: blue glow (#0EA5E9)

Glows are applied via:
1. `box-shadow` on cards
2. `radial-gradient` background orbs
3. `text-shadow` on hero text
4. `filter: drop-shadow` on chart elements

### Animation Strategy

**Framer Motion** for:
- Page transitions (fade + slide up)
- Stagger reveal on dashboard sections
- Hover effects (scale, glow)
- Chart data animations (progress bars)

**CSS animations** for:
- Floating particles (infinite, lightweight)
- Waveform bars (keyframe-based, low GPU cost)
- Gradient shifting (background-position animation)
- Shimmer loading effects

**Performance guardrails**:
- `prefers-reduced-motion` query disables all CSS animations
- Framer Motion's `viewport={{ once: true }}` prevents re-animation
- No `transform: translate3d` on large elements (avoid layer promotion)

### Screenshot-Optimized Decisions

1. **Hero card uses archetype gradient background** — instant visual wow
2. **Story card is exactly 9:16 ratio** — fits Instagram Stories perfectly
3. **Charts use bright colors on dark bg** — high contrast = screenshot clarity
4. **Font sizes are generous** — readable even in compressed screenshots
5. **Whitespace is intentional** — breathing room = premium feel

## Prompt
How should we handle the export/share flow for story cards?

## Response

### Export Architecture

**Library**: `html-to-image` (toPng function)
- Captures DOM element as PNG
- Supports custom pixel ratio for retina
- Much more reliable than html2canvas

**Rendering approach**:
1. Story card rendered in modal (visible to user)
2. Card uses inline styles (not Tailwind classes) for export reliability
3. Fonts embedded via `@import` in CSS
4. `pixelRatio: 2` for retina quality

**Fallback chain**:
1. Try `toPng()` at quality=0.95, pixelRatio=2
2. If fails → retry at quality=0.8, pixelRatio=1
3. If fails → show error with "Try desktop browser" suggestion

**Mobile download**: Uses `<a download>` with blob URL — works on iOS Safari and Android Chrome.
