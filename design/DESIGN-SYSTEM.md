# ArtiCYa Design System — "Resin & Pine"

## Narrative

A summer afternoon in Troodos, an hour before the light goes: sun-bleached
limestone and dry grass, dusty olive scrub, and one warm point of ochre where
the sun catches resin on a pine trunk. The site splits into two registers. The
home page is that afternoon: one continuous muted-earth world from the hero to
the footer, built on a single cream ground and lit by a single dusty ochre
accent — a ground that is unbroken by any band or panel, and never quite
still, carrying two slow drifting pools of its own light. The inner pages are
the same place at dusk: the Resin & Pine world below, where long-form text
sits on warm plaster and the greens go dark.

The palette is a place, not a badge. Everything in it is muted and shares one
warm undertone — no bright tech greens, no leaf iconography, no stark white or
pure black, and no decorative gradients. The only gradients are atmosphere
(see Atmospheric grounds).

## Palette

| Token | Hex | Role |
|---|---|---|
| `pine-950` | `#22301C` | Dark ground (inner-page heroes); text on light |
| `pine-900` | `#2D4024` | Soft raised surfaces/cards on dark; secondary text on light |
| `pine-800` | `#3E5433` | Muted surfaces, borders, hairlines and hover fills on dark |
| `lichen` | `#566350` | Green mid tone: section labels, icon strokes, captions on light |
| `resin` | `#E19A3C` | Warm accent — the single light source. Glows, large text, filled buttons |
| `resin-deep` | `#845110` | Text-safe accent on light grounds (links, labels, filled buttons) |
| `resin-light` | `#F2C177` | Text-safe accent on dark grounds (links, labels, key lines) |
| `sage` | `#A9B39A` | Quiet secondary: tag pills, card borders, dividers, icon strokes on dark |
| `plaster` | `#F2EFE6` | Light ground — the site default |
| `plaster-bright` | `#FAF8F2` | Cards on light; body text on dark |
| `plaster-muted` | `#E0E4CD` | Green-tinted alternating bands; secondary text on dark |

## Muted earth palette — the home page

The home page is one muted, warm, earthy family. Its tokens:

| Token | Hex | Role |
|---|---|---|
| `cream` | `#EFE9DA` | The **only** ground — a muted warm off-white, never stark white. Body, chrome, mission band, every section |
| `ochre` | `#C29055` | The one accent — dusty, not glossy. **Fill only**, never text |
| `ochre-deep` | `#8A5A22` | Accent text on cream: the finale headline, active nav labels, footer secondary, CTA button fills |
| `ink` | `#302E20` | **All** text — a warm near-black, never pure black |
| `ink-soft` | `#6E6A55` | Secondary text |
| `ochre-soft` | `#D3A468` | Glows and highlights only, never text |
| `olive` | `#4A5637` | Small structural marks only — globe dots, small icons |
| `hairline` | `rgba(48,46,32,.13)` | Rules, dividers, quiet borders |

There is deliberately no green in this list. `sage` (`#A9B39A`) belongs to the
inner pages' dusk palette and never appears on the home page — the home's only
green is `olive`, and only as small structural marks.

### Why these cohere

Two properties are doing the work, and both must hold for any token added later:

- **One shared warm undertone.** Every token is mixed toward the same warm
  yellow-red point. The near-black is `#302E20`, not `#000`; the off-white is
  `#EFE9DA`, not `#FFF`; even the green, `#4A5637`, is pulled toward olive
  rather than sitting at a forest hue. Nothing on the page is a true neutral,
  so nothing reads as cold against the rest.
- **One consistent degree of muting.** No token is fully saturated. The accent
  is a dusty `#C29055`, not a glossy amber; the ground is a warm `#EFE9DA`,
  not a bright off-white. Because every hue is pulled back by roughly the same
  amount, no single element out-punches its neighbours — which is what makes
  the page read as one family rather than a set of related colours.

The practical test for a new colour: desaturate the page and it should still
look deliberate; raise any one token's saturation and it will immediately look
foreign.

**The chrome is soft, not a frame.** The header and footer sit on the same
`cream` as the body, so they are not set apart by surface at all — a
`hairline` rule does the whole job. No bar, dark or colored, brackets the
site, and the ground reads continuous from the top of the nav to the bottom
of the footer.

**One ground, no bands.** Cream is the only surface on the home page; ochre is
the only accent. No section may introduce a second surface color — the rhythm
top to bottom is cream nav → cream hero photograph with a cream mission band →
cream "What we do" → cream offer panels → cream "What you gain" → cream finale
→ cream footer. Separation between beats comes from photography, spacing, the
ochre accent bars and the living atmosphere, never from a colored band. This
matters most at the finale: the ochre glow is the subject there, and any
cooler ground under it would cool the one light the page has been following.

Color-role rules, in order of precedence:

- **Ink is text.** Every heading, paragraph and numeral is `ink`; secondary
  text is `ink-soft` and accent text is `ochre-deep`.
- **Ochre is the only accent.** One accent hue, nothing competing with it.
- **Olive is structural, never typographic.** Small marks only — never large
  text, numerals, or a background.
- **Same role, same color everywhere.** A numeral is one color, never
  two-tone; the stats are `ink` across all three columns.

### Measured contrast

Measured on the flat tokens; every pair was then re-verified against the
**rendered composite** at 1440×900 and 390×844 (screenshot pixel sampling
behind each text zone), because the living atmosphere puts real pixel values
between the tokens. Every pair holds on the composite except `ink-soft`, which
sits at 4.50 flat and so falls to 4.16–4.34 once the atmosphere shades the
ground beneath it. It is the one pair with no headroom: either the atmosphere
comes back up or `ink-soft` goes a step darker — see the note under the table.

Because there is only one ground, there is only one column of pairs to check.

| Foreground | Background | Ratio | Rule |
|---|---|---|---|
| `ink` | `cream` | 11.28 | Body text, headings, numerals, nav labels, wordmark, mission statement, trail labels ✓ |
| `ink-soft` | `cream` | 4.50 | Secondary text — passes flat, **fails on the composite** (4.16–4.34); see below |
| `ochre-deep` | `cream` | 4.86 | Finale headline, active/hover nav label, footer secondary ✓ |
| `cream` | `ochre-deep` | 4.86 | CTA button label on its fill ✓ |
| `ink` | `ochre` | 4.82 | Button label on the hover fill ✓ |
| `olive` | `cream` | 6.48 | Structural marks ✓ (structural by role, not by contrast) |
| `ochre` | `cream` | 2.34 | ✗ Fill only — the nav underline and trail line are `aria-hidden` decoration |

**The ochre text ceiling.** `ochre` fails AA for normal *and* large text. It is
a **fill**: accent bars, decorative marks, button backgrounds — places where
the contrast that matters is what sits on top of it. Accent *text* is always
`ochre-deep`. The nav underline stays `ochre` as decoration and never carries
the active state alone; the active label's own color change does that.

**The `ink-soft` shortfall.** `ink-soft` is exactly at the 4.5 AA floor against
flat `cream`, which leaves it no headroom: the atmosphere's two pools are both
darker than the ground, so wherever they pass under secondary text the measured
composite lands at 4.16–4.34. The two places this bites are the "What we do"
lead paragraph and the stat labels. Flat-token maths hides it; only composite
sampling shows it. Fixing it means either pulling the atmosphere pools back
until the darkest composite clears `#EFE9DA` minus a hair, or taking `ink-soft`
one step darker (about `#65614D`, which clears 4.5 against the darkest sampled
ground). Until one of those lands, this is a known AA miss — do not add new
`ink-soft` text in the meantime.

## Measured contrast (WCAG 2.1) — dusk palette

All ratios measured on the final hex values. AA thresholds: 4.5:1 for normal
text, 3.0:1 for large text (≥24px, or ≥18.66px bold) and graphical objects.

| Foreground | Background | Ratio | Rule |
|---|---|---|---|
| `plaster-bright` | `pine-950` | 13.12 | Body text on dark ✓ |
| `plaster-bright` | `pine-900` | 10.57 | Body text on dark cards ✓ |
| `plaster-bright` | `pine-800` | 7.84 | Body text on dark hover fills ✓ |
| `plaster-muted` | `pine-950` | 10.71 | Secondary text on dark ✓ |
| `plaster-muted` | `pine-900` | 8.63 | Secondary text on dark cards ✓ |
| `resin-light` | `pine-950` | 8.40 | Links/labels on dark ✓ |
| `resin-light` | `pine-900` | 6.77 | Links/labels on dark cards ✓ |
| `resin` | `pine-950` | 5.90 | Large text and glows on dark ✓ (never body-size text) |
| `pine-950` | `plaster` | 12.12 | Body text on light ✓ |
| `pine-950` | `plaster-bright` | 13.12 | Body text on light cards ✓ |
| `pine-950` | `plaster-muted` | 10.71 | Body text on green bands ✓ |
| `pine-900` | `plaster` | 9.77 | Secondary text on light ✓ |
| `lichen` | `plaster` | 5.54 | Section labels/captions on light ✓ |
| `lichen` | `plaster-bright` | 6.00 | Section labels on light cards ✓ |
| `lichen` | `plaster-muted` | 4.90 | Section labels on green bands ✓ |
| `resin-deep` | `plaster` | 5.77 | Links on light ✓ |
| `resin-deep` | `plaster-bright` | 6.25 | Links on light cards ✓ |
| `resin-deep` | `plaster-muted` | 5.10 | Links on green bands ✓ |
| `pine-950` | `sage` | 6.37 | Text on sage pills ✓ |
| `sage` | `pine-950` | 6.37 | Icon strokes on dark ✓ |
| `plaster-bright` | `resin-deep` | 6.25 | Filled button (light sections) ✓ |
| `pine-950` | `resin` | 5.90 | Filled amber button (dark sections) ✓ |
| `resin` | `pine-900` | 4.75 | Large text and glows on dark cards ✓ (never body-size text) |
| `resin` | `pine-800` | 3.53 | Large text on dark hover fills ✓ (never body-size text) |
| `resin-light` | `pine-800` | 5.03 | Links/labels on dark hover fills ✓ |
| `sage` | `pine-900` | 5.13 | Icon strokes/graphics on dark cards ✓ |
| `sage` | `pine-800` | 3.81 | Icon strokes on dark hover fills ✓ |
| `plaster-muted` | `pine-800` | 6.41 | Secondary text on dark hover fills ✓ |
| `lichen` | `pine-950` | 2.19 | ✗ FAILS — `lichen` never carries text on dark grounds |

Usage rules derived from the table:

- `resin` is never body-size text on any ground. Large text, glows, buttons only.
- On light grounds, accent text is always `resin-deep`; on dark, `resin-light`.
- `sage` is never text on light grounds (decorative there: borders, dividers,
  pill backgrounds). On dark it may carry icon strokes and graphics.
- `lichen` is the only green that may carry small text, and only on the
  plaster family. On dark grounds it is never text; the green accent roles
  there belong to `sage` (strokes, graphics) and the pine surfaces.
- On dark grounds the working set is: `pine-900`/`pine-800` for soft and muted
  surfaces, `sage` for strokes and graphics, `resin-light` for readable accent
  text, `resin` for large numerals, glows and filled buttons.

## Typography

Display: **Bricolage Grotesque** · Body: **Instrument Sans** — both loaded via
`next/font`, exposed as `font-display` and `font-sans`.

| Step | Size / line height | Font | Use |
|---|---|---|---|
| Display | `clamp(2.75rem, 6vw, 4.5rem)` / 1.05, −0.02em | Bricolage 600 | Page hero headline only |
| H2 | `clamp(2rem, 4vw, 3rem)` / 1.1, −0.01em | Bricolage 600 | Section headings; home offer-panel titles |
| H3 | `1.5rem` / 1.25 | Bricolage 600 | Card and block headings |
| Stat numeral | `clamp(3.25rem, 8vw, 6.5rem)` / 1 desktop · `2.75rem` / 1 mobile | Bricolage 600 | Home stats only — `ink`, with an `ink-soft` label. Monumental centered columns on desktop; compact ledger rows on mobile so all three share one screen |
| Showpiece | `clamp(2.25rem, 5vw, 3.75rem)` / 1.15, −0.01em | Bricolage 600 | One key line per page max (e.g. the home closing line) |
| Trail item | `clamp(1.5rem, 2.5vw, 2.25rem)` / 1.2 | Bricolage 600 | Home gains sequence |
| Hero statement | `clamp(0.95rem, 1.3vw, 1.2rem)` / 1.4, −0.01em | Bricolage 500 | Home hero mission line only — a calm lead under the headline. Held to two balanced lines on desktop by a wide `62rem` measure rather than a small one, so the band stays shallow and the photograph above it keeps the frame |
| Lede | `1.25rem` / 1.55 | Instrument Sans 400 | Intro paragraph under headings; offer-panel body on desktop, where plain Body reads too small against the full-bleed panel scale |
| Body | `1rem` / 1.7 | Instrument Sans 400 | Default copy |
| Label | `0.8125rem` / 1.4, +0.08em, uppercase | Instrument Sans 600 | Section eyebrows (`lichen` on inner pages; on the home page a section opens with an `ochre` bar rather than an eyebrow), pills, nav labels |

The brand name always renders as "ArtiCYa" — never CSS-uppercased. An
element carrying the brand name (header wordmark, hero hint pill) drops the
Label step's uppercase and tracking; section labels and other non-brand
text keep them.
| Caption | `0.875rem` / 1.5 | Instrument Sans 400 | Photo credits, footnotes |

## Layout & spacing

- 4px base grid; Tailwind spacing scale only, no arbitrary pixel values.
- Content max-width `72rem` (max-w-6xl); text blocks max `65ch`.
- Section rhythm: `py-24` desktop / `py-16` mobile. Adjacent plaster sections
  alternate `plaster` / `plaster-muted` so light stretches read green, never
  neutral cream.
- **Ground is decided per page, not per section.**
  - **Home** is one continuous muted-earth world from the hero to the footer —
    no dusk section may interrupt it. `cream` is the ground; depth comes from
    the living atmosphere, full-bleed photography and the ochre light. There
    is no second surface — no band, panel or chrome bar changes the ground
    anywhere between the top of the nav and the bottom of the footer.
  - **Inner pages** (about, faq, contact) are text-heavy and
    keep `plaster` as the default background below their heroes; no dark
    section may appear there outside the hero. The hero itself is the bridge
    to the home world: the same pine-dusk photograph treatment (`pine-950`
    wash) with the resin halo behind the headline, so navigating home → an
    inner page reads as the same forest at a different hour.
  - **Header and footer** are one `cream` surface site-wide, solid on every
    page and never transparent over a hero — so navigation reads the same
    everywhere, and a hairline alone marks the chrome off from the body.
- Every page's first screen must read "green outdoors". On the home page that
  is carried by the photography itself plus `olive` structural marks — the
  ground stays cream; on the inner pages, by lichen labels, sage
  pills/borders and plaster-muted bands.

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

One warm light, treated identically everywhere it appears: same hue, soft
long-radius glow (blur ≥ 40px, opacity falling to 0). The site should be
remembered as "the one where the same light follows you down the page." On the
home page that light is `ochre` / `ochre-soft` over cream; on the inner pages
it is `resin` over `pine-950`. Same role, one temperature, two grounds.

Sanctioned placements — one continuous thread. On the home page it leads the
eye down the cream toward the closing line:

1. **Hero** — the halo behind the frame.
2. **Globe section** — the globe's dots read as lit points of the same light.
3. **Gains trail** — the drawn line and its nodes.
4. **Final CTA** — the source of the whole thread: its line, pool and glow
   deliver "Your adventure starts here." and the primary button.

And on the inner pages, exactly one placement:

5. **Inner-page hero** — the resin halo behind the hero headline, meeting the
   visitor at every page's dusk threshold before daylight.

One thread, one temperature. Nowhere else — below their heroes the inner pages
are plaster grounds, and there are no glows on plaster, ever.

## Atmospheric grounds

Dark stretches are built as layered environments, never as painted surfaces:
one of our own photographs sunk under the pine scrim, the lamp's light
falling with direction, and film grain over the top. The shared layers are
defined once in `globals.css`; environment photographs are art-directed per
section. Nothing else may put a gradient or texture on a ground:

| Class | What it is | Where it may sit |
|---|---|---|
| `.dusk-light` | Top-down wash of `pine-900` fading out — the sky a shade lighter than the ground it settles into | Top of dark sections and inner-page heroes |
| `.dusk-ambient` | Centered radial pocket of `pine-900` | Behind content on long dark stretches |
| `.lamp-falloff` | The seam lamp given direction: a warm whisper directly under the halo inside a wider `pine-800` light dome, shading the ground from lit to deep | Astride the home hero seam only — mirrored above it inside the hero, falling away below it, so the two grounds meet with no edge |
| `.dusk-scrim` | Graded photo wash — most open where the lamp halo sits, near-solid pine at the edges and base of the frame | Inner-page hero photographs |
| `.photo-vignette` | Edges falling toward `pine-950` | Inside photographic frames and hero photos only |
| `.film-grain` | Fine tiled SVG grain, killing the flat digital-paint feel. Opacity is `var(--grain, 0.05)` so a caller over a light ground can pull it back | Over any ground and inside photographic frames |
| `.atmosphere-glow-a` / `-b` | The living atmosphere's two drifting pools — `ochre` at 7% and `ochre-soft` at 8%, each a closest-side circle tiled at 840px, the second offset half a tile so the grids interleave. Both are the page's one light, so the ground never picks up a second hue | The home page ground only, via `LivingAtmosphere` |
| `.photo-grade` | Filter-only warm grade (`saturate .85 · sepia .14 · contrast .97 · brightness 1.01`) bringing photographs into the muted family | Every photograph on the home page |
| `.plaster-light` | Soft pool of `plaster-bright` | Behind the About scenes and the finale mosaic |
| `.print-shadow` | Soft `pine-950` drop shadow | Under framed prints on plaster; the raised state of interactive cards (open accordion, hovered contact card) |

**Environment photographs.** A dark stretch may sink one of our own
photographs into its ground as atmosphere: blurred (≥ 14px), desaturated,
darkened, at ≤ 20% opacity, and masked so it dissolves into pure `pine-950`
at both ends of its stretch — it never touches a seam, and is felt more
than seen. The home page carries one, behind the hero frame, sunk to 10%
opacity under a heavy blur so the atmosphere drifts through it rather than
being sealed out. Always our own outdoor photography from `/public/images` —
never stock textures, generic forest wallpaper, or leaf patterns.

Rules, in order of precedence:

- **Painted once, transformed only.** Every layer's pixels are painted once
  and never repainted. The home page's two atmosphere pools are the sole
  exception to stillness, and they move only by `transform` — a 40s and a 56s
  drift on `alternate` (the second reversed) plus an 18px pointer lean — so
  the compositor does the work and nothing re-rasterizes. Both stop under
  `prefers-reduced-motion`. No layer is ever scroll-linked.
- **Measured on the composite.** Layered grounds create pixel values between
  tokens, so text contrast is verified against the actual rendered composite
  (screenshot sampling behind each text zone at both viewports), not against
  the flat token. On dark grounds the ceiling is `pine-800` lightness. On the
  home ground the floor is the flat-token table above — the atmosphere may
  shade the cream but never below the value those pairs were measured at.
- **The cream stays clean.** Both pools are *darker* than `cream`, so they can
  only subtract light: pushed too far they stop reading as atmosphere and
  start reading as dirty tan. The bar is clean-and-alive, and it is settled by
  sampling, not by taste — mean sampled cream must stay within ~6 of `#EFE9DA`
  with the warm R−B spread intact (measured: `#ECE6D6`, spread 22 vs the
  token's 21). Grain over this ground is `soft-light`, never `multiply`:
  multiply can only darken and pulled every channel down about five levels.
- **One light.** Every warm layer is the falloff of the page's single light,
  never a second source, and stays too faint to read as glow, shape, or blob
  (whisper-level; if a screenshot shows a hard edge, it is too strong).

## Do / Don't

**Do**

- Let photography carry the outdoors; grade every home photo with
  `.photo-grade` so none of them out-punches the palette around it.
- Use `plaster-muted` bands so inner-page light sections visibly lean green.
- Keep every glow one hue at one temperature — ochre on cream, resin on pine.
- Use sage borders instead of gray borders on inner-page light grounds, and
  `hairline` for every rule and quiet border on the home page.
- Check the contrast tables before introducing any new fg/bg pair.

**Don't**

- Don't use pure black, pure white, or any gray — the neutrals are the muted
  earth, pine and plaster families.
- Don't use bright/tech greens, leaf icons, or gradients outside the
  atmospheric-ground layers.
- Don't set `ochre` or `resin` as text, or `sage` as text on light grounds.
- Don't break the home page's cream ground — not with a dusk section, and not
  with a colored band, panel or chrome bar of any kind. Don't put a dark
  section on an inner page below its hero. No second accent hue.
- Don't introduce new font weights beyond 400/500/600, or new
  durations/easings. 500 is Bricolage only, and only for the home hero
  statement, where 600 at that size reads heavier than the line deserves.

## Component token mapping

Token assignments for the four animated components. Every hardcoded color in
the source components maps as follows; no exceptions. The three that live on
the home page take muted-earth tokens; the zoom parallax is an inner-page
component and stays on the dusk palette.

| Component | Hardcoded value | Token |
|---|---|---|
| Scroll-expansion hero | `black` background | `cream` |
| Scroll-expansion hero | `white` text | `ink` |
| Scroll-expansion hero | `blue-200` subtext | `ink` on the cream mission band |
| Zoom parallax | `neutral` grounds/gaps | `plaster` (section), `plaster-muted` (image gaps) |
| Zoom parallax | any neutral text | `pine-950` |
| D3 globe | `black` ocean fill | none — transparent, the section's `cream` ground is the ocean |
| D3 globe | `#999` halftone land dots | `olive` (alpha ramped 0.5→0.95 by latitude band) |
| D3 globe | `white` land outlines | `olive` at 0.16 alpha |
| D3 globe | `white` graticule/sphere stroke | `ink` at 0.18 (sphere) and 0.08 (graticule) |
| D3 globe | Europe/Mediterranean dots | `olive` at the top of the alpha ramp — the warm heart of the globe |
| Lamp | `slate-950` background | `cream` |
| Lamp | `cyan-500` glow | `ochre` |
| Lamp | `cyan-400` glow | `ochre-soft` |
| Lamp | `white` headline | `ochre-deep` — the one place the accent carries text, on cream |
| Lamp | `slate-950` cover bars shaping the cone | none — the cone halves fade to transparency via `mask-image`; the two bars that remain (above the line, under the cone) are `cream` on the section's ground |
| Lamp | demo headline (`slate-300`→`slate-500` gradient text) | none — stripped; the section carries the frozen closing content in the type scale's own styles |

The globe and lamp share `resin`/`resin-light` deliberately — they are the
same light source (see signature element).
