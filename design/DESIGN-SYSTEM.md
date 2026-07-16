# ArtiCYa Design System — "Resin & Pine"

## Narrative

The hour after a summer hike in Troodos: pine forest going black-green as the
light drops, and one warm point of amber — resin catching the last sun, a
lantern at camp. The site lives mostly in warm plaster daylight, where the
photography does the talking. Green is present on every screen before any dark
section appears: lichen section labels, sage pills and borders, and soft
green-tinted bands between plaster sections. Three moments drop into pine
dusk, and everything that glows there — the lamp, the globe, the final CTA —
glows the same resin amber, as if the whole site shares one light source.

The palette is a place, not a badge: pine dusk, lichen, dried sage, resin,
sun-baked plaster. No bright tech greens, no leaf iconography, no gradients.

## Palette

| Token | Hex | Role |
|---|---|---|
| `pine-950` | `#131A12` | Dark ground (the three dark sections); text on light |
| `pine-900` | `#1D2718` | Raised surfaces/cards on dark; secondary text on light |
| `pine-800` | `#2C3A26` | Borders and hover fills on dark |
| `lichen` | `#566350` | Green mid tone: section labels, icon strokes, captions on light |
| `resin` | `#E19A3C` | Warm accent — the single light source. Glows, large text, filled buttons |
| `resin-deep` | `#845110` | Text-safe accent on light grounds (links, labels, filled buttons) |
| `resin-light` | `#F2C177` | Text-safe accent on dark grounds (links, labels, key lines) |
| `sage` | `#A9B39A` | Quiet secondary: tag pills, card borders, dividers, icon strokes on dark |
| `plaster` | `#F2EFE6` | Light ground — the site default |
| `plaster-bright` | `#FAF8F2` | Cards on light; body text on dark |
| `plaster-muted` | `#E0E4CD` | Green-tinted alternating bands; secondary text on dark |

## Measured contrast (WCAG 2.1)

All ratios measured on the final hex values. AA thresholds: 4.5:1 for normal
text, 3.0:1 for large text (≥24px, or ≥18.66px bold) and graphical objects.

| Foreground | Background | Ratio | Rule |
|---|---|---|---|
| `plaster-bright` | `pine-950` | 16.70 | Body text on dark ✓ |
| `plaster-bright` | `pine-900` | 14.59 | Body text on dark cards ✓ |
| `plaster-bright` | `pine-800` | 11.36 | Body text on dark hover fills ✓ |
| `plaster-muted` | `pine-950` | 13.64 | Secondary text on dark ✓ |
| `plaster-muted` | `pine-900` | 11.91 | Secondary text on dark cards ✓ |
| `resin-light` | `pine-950` | 10.70 | Links/labels on dark ✓ |
| `resin-light` | `pine-900` | 9.35 | Links/labels on dark cards ✓ |
| `resin` | `pine-950` | 7.51 | Large text and glows on dark ✓ (never body-size text) |
| `pine-950` | `plaster` | 15.42 | Body text on light ✓ |
| `pine-950` | `plaster-bright` | 16.70 | Body text on light cards ✓ |
| `pine-950` | `plaster-muted` | 13.64 | Body text on green bands ✓ |
| `pine-900` | `plaster` | 13.47 | Secondary text on light ✓ |
| `lichen` | `plaster` | 5.54 | Section labels/captions on light ✓ |
| `lichen` | `plaster-bright` | 6.00 | Section labels on light cards ✓ |
| `lichen` | `plaster-muted` | 4.90 | Section labels on green bands ✓ |
| `resin-deep` | `plaster` | 5.77 | Links on light ✓ |
| `resin-deep` | `plaster-bright` | 6.25 | Links on light cards ✓ |
| `resin-deep` | `plaster-muted` | 5.10 | Links on green bands ✓ |
| `pine-950` | `sage` | 8.11 | Text on sage pills ✓ |
| `sage` | `pine-950` | 8.11 | Icon strokes on dark ✓ |
| `plaster-bright` | `resin-deep` | 6.25 | Filled button (light sections) ✓ |
| `pine-950` | `resin` | 7.51 | Filled amber button (dark sections) ✓ |

Usage rules derived from the table:

- `resin` is never body-size text on any ground. Large text, glows, buttons only.
- On light grounds, accent text is always `resin-deep`; on dark, `resin-light`.
- `sage` is never text on light grounds (decorative there: borders, dividers,
  pill backgrounds). On dark it may carry icon strokes and graphics.
- `lichen` is the only green that may carry small text, and only on the
  plaster family.

## Typography

Display: **Bricolage Grotesque** · Body: **Instrument Sans** — both loaded via
`next/font`, exposed as `font-display` and `font-sans`.

| Step | Size / line height | Font | Use |
|---|---|---|---|
| Display | `clamp(2.75rem, 6vw, 4.5rem)` / 1.05, −0.02em | Bricolage 600 | Page hero headline only |
| H2 | `clamp(2rem, 4vw, 3rem)` / 1.1, −0.01em | Bricolage 600 | Section headings |
| H3 | `1.5rem` / 1.25 | Bricolage 600 | Card and block headings |
| Lede | `1.25rem` / 1.55 | Instrument Sans 400 | Intro paragraph under headings |
| Body | `1rem` / 1.7 | Instrument Sans 400 | Default copy |
| Label | `0.8125rem` / 1.4, +0.08em, uppercase | Instrument Sans 600 | Section eyebrows (`lichen`), pills |
| Caption | `0.875rem` / 1.5 | Instrument Sans 400 | Photo credits, footnotes |

## Layout & spacing

- 4px base grid; Tailwind spacing scale only, no arbitrary pixel values.
- Content max-width `72rem` (max-w-6xl); text blocks max `65ch`.
- Section rhythm: `py-24` desktop / `py-16` mobile. Adjacent plaster sections
  alternate `plaster` / `plaster-muted` so light stretches read green, never
  neutral cream.
- **`plaster` is the site default background.** Dark (`pine-950`) sections are
  capped at exactly three per site: the hero, the globe section, and the
  final CTA. No other section may go dark.
- Every page's first screen must read "green outdoors" before any dark
  section: photography plus at least two green token roles (lichen label,
  sage pill/border, or a plaster-muted band) above the fold.

## Motion

- Durations — exactly three: **200ms** (hover, focus, small fades),
  **400ms** (reveals, card entrances, accordion), **700ms** (hero moments,
  scroll-linked transitions, the lamp/globe lighting up).
- Easings — exactly two: `--ease-out-quart` `cubic-bezier(0.25, 1, 0.5, 1)`
  for entrances and hovers; `--ease-in-out-cubic`
  `cubic-bezier(0.65, 0, 0.35, 1)` for continuous or scroll-linked motion.
- `prefers-reduced-motion` is always honored — the global rule in
  `globals.css` collapses animation and transition durations; scroll-linked
  components must additionally render their resting state.
- Nothing autoplays on loop except the globe's slow rotation and the lamp
  glow, both of which stop under reduced motion.

## Signature element — the single light source

One amber light, `resin`, treated identically everywhere it appears: same hue,
soft long-radius glow (blur ≥ 40px, opacity falling to 0), always warm against
`pine-950`. The site should be remembered as "the one where the same light
follows you down the page."

Sanctioned placements — at most these three, matching the three dark sections:

1. **Hero** — the lamp beam and its halo.
2. **Globe section** — the globe's dots and arcs read as lit points of the
   same lamp.
3. **Final CTA** — a resin glow behind the primary button.

Nowhere else. No glows on light grounds, ever.

## Do / Don't

**Do**

- Let photography carry the outdoors; frame it with plaster, sage and lichen.
- Use `plaster-muted` bands so light sections visibly lean green.
- Keep every glow the same resin amber; one light source, one temperature.
- Use sage borders instead of gray borders everywhere on light grounds.
- Check this table before introducing any new fg/bg pair.

**Don't**

- Don't use pure black, pure white, or any gray — the neutrals are the pine
  and plaster families.
- Don't use bright/tech greens, leaf icons, or gradient backgrounds.
- Don't set `resin` as body-size text, or `sage` as text on light grounds.
- Don't add a fourth dark section or a second accent hue.
- Don't introduce new font weights beyond 400/600, or new durations/easings.

## Component token mapping

Token assignments for the four animated components to be integrated. Every
hardcoded color in the source components maps as follows; no exceptions at
integration time.

| Component | Hardcoded value | Token |
|---|---|---|
| Scroll-expansion hero | `black` background | `pine-950` |
| Scroll-expansion hero | `white` text | `plaster-bright` |
| Scroll-expansion hero | `blue-200` subtext | `resin-light` |
| Zoom parallax | `neutral` grounds/gaps | `plaster` (section), `plaster-muted` (image gaps) |
| Zoom parallax | any neutral text | `pine-950` |
| D3 globe | `black` background | `pine-950` |
| D3 globe | `white` land dots | `resin` |
| D3 globe | `white` arcs/lines | `resin-light` |
| D3 globe | graticule/sphere stroke | `pine-800` |
| Lamp | `slate-950` background | `pine-950` |
| Lamp | `cyan-500` glow | `resin` |
| Lamp | `cyan-400` glow | `resin-light` |
| Lamp | `white` headline | `plaster-bright` |

The globe and lamp share `resin`/`resin-light` deliberately — they are the
same light source (see signature element).
