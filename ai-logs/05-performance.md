# AI Log 05 — Performance Optimization

## Prompt
Optimize the app for performance. Lighthouse score should be high. Animations must be smooth on low-end devices. Bundle size should be minimal.

## Response

### Animation Performance

**Framer Motion optimizations**:
1. `viewport={{ once: true }}` — elements only animate into view once
2. No `layout` animations on list items (causes expensive recalculations)
3. CSS `will-change` avoided (forces GPU layer creation for every element)
4. `AnimatePresence` with `mode="wait"` prevents overlapping animations

**CSS animation optimizations**:
1. `@media (prefers-reduced-motion: reduce)` disables ALL CSS animations
2. Floating particles use `transform` only (GPU-accelerated, no repaints)
3. Waveform bars animate `scaleY` not `height` (avoids layout thrashing)
4. Gradient animations use `background-position` not `background` (composited)

### Bundle Size Strategy

1. **Dynamic imports for charts**: Recharts loaded only on dashboard page
2. **html-to-image loaded on demand**: Only imported in ExportSection
3. **No unnecessary dependencies**: Removed Supabase, react-hook-form from critical path
4. **Tree-shaking friendly imports**: `import { PieChart } from "recharts"` not `import * as Recharts`

### Rendering Optimizations

1. **Zustand selectors**: Each dashboard component subscribes only to its needed data
2. **No prop drilling**: Store accessed directly in components
3. **Image lazy loading**: Artist images use native `loading="lazy"` where possible
4. **Skeleton states**: Loading page shows animated skeletons, not blank screens

### Chart Rendering

Recharts optimizations:
- `ResponsiveContainer` wraps all charts (handles resize efficiently)
- Pie chart uses `paddingAngle={3}` (prevents overlapping segments)
- Radar chart limited to 6 axes (more causes visual clutter and performance drops)
- No `isAnimationActive` on large datasets

### Memory Management

- Waveform animations: Fixed number of bars (24-32), not dynamic
- Particles: Only 10 particles on landing page
- Event listeners: Cleaned up in `useEffect` return functions
- No infinite `setInterval` without cleanup

### Lighthouse Improvements

| Metric | Strategy |
|--------|----------|
| LCP | Hero text renders without blocking resources |
| FID | No heavy JS on initial load |
| CLS | Fixed dimensions on cards, charts, images |
| A11y | Semantic HTML, ARIA labels, focus states |
| Best Practices | HTTPS, httpOnly cookies, no console.logs |

### Mobile Performance

- Touch events: No hover-dependent functionality on mobile
- Scroll: CSS `scroll-behavior: smooth` with JS fallback
- Images: Artist images from Spotify CDN (already optimized)
- Charts: Smaller on mobile (ResponsiveContainer handles this)
