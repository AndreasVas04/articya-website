# ArtiCYa Design System — "Resin & Pine"

## Narrative

The hour after a summer hike in Troodos: pine forest going black-green as the
light drops, and one warm point of amber — resin catching the last sun, a
lantern at camp. The site splits into two registers. The home page is that
hour itself: one continuous pine-dusk world from the hero to the footer, where
photography burns through the dark and everything that glows — the lamp, the
stats, the trail, the globe, the final CTA — glows the same resin amber, as if
the whole page shares one light source. The inner pages are the same place in
daylight: warm plaster grounds where long-form text is comfortable to read,
with green present on every screen — lichen section labels, sage pills and
borders, soft green-tinted bands between plaster sections. The two registers
are one forest at two hours, never two sites: every page opens and closes in
the dusk — one pine header and footer bracket the whole site, and each inner
page's hero is the dusk hour itself, a photograph under the pine wash with
the same resin lamp glowing behind the headline — before the body steps into
daylight.

The palette is a place, not a badge: pine dusk, lichen, dried sage, resin,
sun-baked plaster. No bright tech greens, no leaf iconography, no decorative
gradients — the only gradients are atmosphere (see Atmospheric grounds).

## Palette

| Token | Hex | Role |
|---|---|---|
| `pine-950` | `#22301C` | Dark ground (the whole home page, inner-page heroes); text on light |
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

## Warm palette — the home page's living atmosphere

> **The home page is fully converted.** Every section — hero, "What we do"
> with the stats and the globe, both offer panels, "What you gain" and the
> closing lamp — now stands in the warm gold world described below, and this
> table is the direction of record for all of it. The dusk palette above still
> governs the inner pages. Passages elsewhere in this document that describe
> home as "one continuous pine-950 world" — the narrative, the signature
> element thread, parts of the atmospheric-ground table — are **stale for
> home and correct for the inner pages**; read them that way rather than
> resolving the conflict by reverting a section.

| Token | Hex | Role |
|---|---|---|
| `gold-wash` | `#EDE2C8` | The home page's gold floor — the ground every section stands on |
| `gold-anchor` | `#E9D9B4` | The same gold a shade deeper: the hero's tagline card, and every section's top and bottom edge |
| `gold-chrome` | `#EFE4CB` | The anchor lifted back toward paper — the header and footer only, so the two flat bars stay soft where the sections stay rich |
| `ink` | `#2A3329` | **All** body text, all headings, all large numerals |
| `ink-soft` | `#52594F` | Secondary text, labels, captions |
| `bark` | `#5C4B32` | Resting nav label on the chrome |
| `amber` | `#C88A3A` | The one accent, as a mark — accent bars, the nav underline, rules |
| `amber-fill` | `#CE9440` | Button fill: the accent lightened until `ink` on it clears AA (4.95) |
| `amber-lit` | `#D8A254` | Button hover fill — still clears AA under `ink` (5.75) |
| `amber-edge` | `#B87A28` | 1px border under the amber fills |
| `amber-soft` | `#E2AB52` | Glows and highlights only, never text |
| `pine` | `#285C3C` | Small structural marks only — globe dots, small icons |
| `hairline` | `rgba(42,51,41,.14)` | Rules, dividers, quiet borders |

**Gold on every section, no cream gaps.** The home page is one continuous
gold field from the header to the footer. `gold-wash` is the floor — the
living atmosphere paints it, so every section shows gold before it paints
anything of its own, and no stretch of the page may read as neutral cream.
Each section additionally carries `.gold-field`, which takes its top and
bottom edges to `gold-anchor`. Adjacent sections therefore meet in one
unbroken band of a single gold. Measured across every internal seam on the
built page, both viewports: `rgb(233,217,180)` — `gold-anchor` exactly — with
a maximum channel jump of 2 across the join.

The two edges that meet the **chrome** rather than another section are the
exception, and they end on `gold-chrome` instead: `.gold-field-chrome-top` on
the hero, `.gold-field-chrome-bottom` on the closing section. The chrome is a
lighter gold than the anchor, so an anchor edge against it lands a step darker
than the bar and draws a line straight across the page — exactly what the
shared gold exists to prevent. Ending these two edges on the bar's own value
puts the whole tone change inside the field's 150px ramp, where it reads as
the ground warming rather than as an edge. Every internal seam keeps the
anchor.

The top edge additionally **holds** its gold flat for the header's height
(`--gold-hold`, 64px mobile / 80px desktop) before the ramp begins. The header
is fixed, so it covers the first 80px of that section: without the hold the
ramp has already fallen most of the way to the floor by the time it emerges,
and the first visible row sits a step below the bar. The hero's backdrop
photograph carries `.hero-backdrop-fade` for the same reason — it too starts
at the section's top, hidden behind the bar, and would otherwise appear all at
once along the bar's lower edge. Measured at the chrome joins on the built
page: footer seam 2 (desktop) / 1 (mobile) maximum channel jump, header seam 6
/ 7 at rest. On desktop the expanded hero's
photograph passes under the header by design — that edge is a photograph, not
a gold seam (see Don't).

A section edge that opens onto its **own section's floor**, rather than onto
another field edge, paints nothing: `.gold-field-open-top`. The anchor exists
so that two edges can meet on one value, and where there is no second edge it
has nothing to meet — it lands a step deeper than the ground beside it and
draws a full-width line across the page, and being opaque it also covers the
living atmosphere the row above it shows. The one place this happens is the
first offer panel, which starts partway down the "What we do" section with the
floor above it; its top edge is therefore open, the real ground runs straight
through the join, and the panel's `photo-edge-dissolve` carries the
photograph across on its own. Measured at that join on the built page: 1
(desktop) / 2 (mobile) maximum channel jump, against 8 / 9 when the edge
painted the anchor. Every internal seam on the page now measures 3 or under at
both viewports.

Because the seam does the joining, **no section carries a rule at its edge**.
A hairline between two sections would draw exactly the line the shared gold
exists to erase. The two **chrome** bars are the exception, and for the
opposite reason — see the amber hairline below: their line is not a seam being
patched but a mark being made.

**The chrome is soft, not a frame.** Header and footer are both
`gold-chrome`, one value across the two bars, and the hero's tagline card is
`gold-anchor` — the same family a half-step deeper, so the card reads as the
richer surface it is without the chrome reading as a saturated band. So the
gold that opens the page is the gold that closes it, and there is no dark bar
bracketing the site. On the chrome the working set is the warm palette's own:
`ink` for the wordmark (10.36), `ink-soft` for secondary text and icon strokes
(5.74), `bark` for the resting nav label (6.63), `resin-deep` for the active
and hover nav label (5.25), and `amber` for the nav underline as a decorative
mark. Every one of these improved when the bars lifted to `gold-chrome`. The
underline never carries the active state alone — `resin-deep` on the label
does — since `amber` measures 2.32 on `gold-chrome` and, as everywhere on the
warm ground, is a mark and never text.

**The chrome signs itself with one amber hairline.** The header carries it on
its bottom edge and the footer on its top: **1.25px solid `amber` at 0.5
alpha**, the accent marks' own weight and alpha family. This is the one rule
allowed on an edge of the gold field, and it is decorative rather than
structural — a55c04c removed the *old* chrome hairlines because they were
neutral borders sitting exactly where the shared gold was working to erase a
seam. This line does the opposite: it is the same amber that draws the heading
bars, the offer panels' accents, the hero rule and the nav underline, so the
two flat bars stop reading as untreated chrome and join the gold-line system.
Rendered, it composites to `rgb(219,183,130)` over `gold-chrome` — measured
identical on both viewports and on all four pages. At 1× the 1.25px declaration
rasterizes to a crisp single device row, which is the intent: a hairline that
resolves sharp, never a soft 2px band.

The mobile nav panel carries the same hairline on **its** lower edge. The open
`<ul>` is absolutely positioned against the header's padding box, so it covers
the bar's own line; giving the panel the line instead means the chrome closes
on the signature wherever the menu happens to end, open or shut.

On the inner pages the line lands against the pine-dusk hero rather than gold,
where it reads as a warm rule marking the threshold between chrome and the dark
— the same mark doing the same job on a darker ground.

**Decorative amber lines are thin.** Amber's structural role on the home page
is the short accent mark: heading bars, the offer panels' card accents, the
hero rule, the nav underline, and the chrome's own hairline. Each is solid
`amber` at **1.25px** — sharp-ended, never rounded, faded or bolder. Two
exceptions: the nav underline at 1.5px, where the mark also has to read as an
interactive affordance, and the chrome hairline at 0.5 alpha, where a
full-strength line across the whole viewport would read as a border rather
than a signature. These are minimal-luxury rules, not bars: at 3–4px the same marks
read as heavy blocks and the accent starts competing with the type instead of
pointing at it. Amber never draws a full-width line between two sections;
there are no section dividers on this page at all, and no horizontal rules
anywhere on it — the lamp's light blade is the light source, not a rule. The
stats ledger accordingly carries no border of its own: its only lines are the
desktop columns' vertical `hairline` dividers, and the mobile ledger rows are
structured by the numeral/label baseline alone, fading straight into the gold
below.

The trail thread is not one of these rules and keeps its 2px weight: the gains
trail's descending line, its nodes and the lamp's line and cone are the
signature light source (see below), not decoration, and thinning them would
break the continuity from the trail into the lamp.

**The expanded hero card is framed — whole, and square.** The expanded hero
card — photograph and tagline panel as one object — carries a single hairline
gold frame around its full perimeter: **1px `amber` at 0.55 alpha**, painted
as an inset ring on the card overlay's own topmost layer (see Do) so nothing
covers it. The frame fades in with the intro and shares its pre-hydration
veil; the resting collapsed card stays frameless. The card's corners are
**square** (`border-radius: 0`), deliberately: the card is centered in the
viewport, so on a short desktop window its top edge passes under the fixed
header — a rounded frame's corner arcs re-emerge mid-curve below the chrome
and read as cut, where straight lines die under the bar cleanly. A crisp
square corner beats a broken arc. The short rule above the tagline stays as
an internal accent at the frame's own weight — 1px `amber` at 0.55 — not the
1.25px accent-mark weight: a frame whispers where an accent mark points.

**Quiet borders on the gold ground lean green.** A decorative circle or
border framing a green mark takes `pine/30` rather than the neutral
`hairline`, matching the offer panels' icon medallions — so the gains trail's
icon rings and the panels' read as the same object family, and the green
note carries through the borders instead of only the strokes inside them.

Color-role rules, in order of precedence:

- **Ink is text.** Every heading, every paragraph and every numeral is `ink`;
  secondary text is `ink-soft`. No other token carries text on the warm ground.
- **No white text anywhere.** No `#fff`, no `rgb(255…)`, and no cream, gold
  or paper value — including `gold-wash`, `gold-anchor` and
  `plaster-bright` — may be set as a `color:` on the home page or in the
  shared header and footer.
  Every string is a dark token: `ink`, `ink-soft`, `bark` or `resin-deep`.
  Cream stays a surface. Where a control needs to read as filled, the fill
  carries the color and `ink` sits on top of it.
- **Amber is the only accent.** One accent hue, nothing competing with it.
- **Pine is structural, never typographic.** Small marks only — it may never
  carry large text, numerals, or a background.
- **Same role, same color everywhere.** A numeral is one color, never
  two-tone; the stats are `ink` across all three columns.

### Measured contrast on the gold ground

Four grounds matter: the `gold-wash` floor, the `gold-anchor` section edges
and tagline card, the `gold-chrome` header and footer, and — because the
atmosphere's amber pools warm the floor where they drift over it — the
**warmest composite** the page actually renders, sampled at `rgb(231,214,184)`.
Text is signed off against that last column, not against the flat token;
`ink-soft` was deepened from `#5C6359` to `#52594F` precisely because it
measured 4.35 there while passing on paper. The chrome column is exact rather
than composite: the header is fixed above the atmosphere and the footer sits
outside it, so both bars render their flat token — sampled on the built page
at `rgb(239,228,203)`, `gold-chrome` exactly.

| Foreground | on `gold-wash` | on `gold-anchor` | on `gold-chrome` | on warmest composite | Rule |
|---|---|---|---|---|---|
| `ink` | 10.17 | 9.38 | 10.36 | 9.17 | Body text, headings, numerals ✓ |
| `ink-soft` | 5.62 | 5.19 | 5.74 | 5.07 | Secondary text, labels, chrome icon strokes ✓ |
| `bark` | 6.51 | 6.00 | 6.63 | 5.87 | Chrome resting nav label ✓ |
| `resin-deep` | 5.15 | 4.75 | 5.25 | 4.65 | Chrome active/hover nav label, closing headline ✓ |
| `pine` | 6.07 | 5.60 | 6.19 | 5.48 | Passes, but pine stays structural by role, not contrast |
| `amber` | **2.28** | **2.10** | **2.32** | **2.06** | ✗ **FAILS** — see the ceiling below |

The `gold-chrome` column is measured on the rendered composite as well as
computed: sampling the active nav label's darkest glyph pixel against the bar
behind it on the built page gives `#845110` on `rgb(239,228,203)` — **5.25**,
clearing AA with room to spare.

| Foreground | Background | Ratio | Rule |
|---|---|---|---|
| `ink` | `amber-fill` | 4.95 | Filled button label ✓ |
| `ink` | `amber-lit` | 5.75 | Filled button label, hover ✓ |
| `ink` | `amber` | 4.46 | ✗ just under AA — `amber` is not a button fill |

**The amber text ceiling.** `amber` measures 2.28:1 on `gold-wash`, 2.10:1 on
`gold-anchor` and 2.32:1 on `gold-chrome`, failing AA for normal text (4.5)
*and* for large text (3.0). So
amber never carries text on the warm ground — not eyebrows, not links, not a
nav label. It is a **mark**: accent bars, the nav underline, rules.

Amber's other role is a **fill**, where the contrast that matters is `ink`
sitting on top of it. `#C88A3A` measures 4.46 under `ink` — a hair short — so
buttons take `amber-fill` (`#CE9440`, 4.95) and `amber-lit` (`#D8A254`, 5.75)
on hover, the same accent lightened one notch until the label clears AA. The
rule **amber is a fill, never text** holds with one surviving exception: the
hero hint pill's middle separator dot, an `amber` glyph carrying no
information, which measures 2.06 on the composite. Any section that wants
amber-colored *text* uses `resin-deep` (`#845110`, 5.25 on the chrome, 5.77
on plaster) instead.

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
| Stat numeral | `clamp(3.25rem, 8vw, 6.5rem)` / 1 desktop · `2.75rem` / 1 mobile | Bricolage 600 | Home stats only — `resin`, glowing. Monumental centered columns on desktop; compact ledger rows on mobile so all three share one screen |
| Showpiece | `clamp(2.25rem, 5vw, 3.75rem)` / 1.15, −0.01em | Bricolage 600 | One key line per page max (e.g. the home closing line) |
| Trail item | `clamp(1.5rem, 2.5vw, 2.25rem)` / 1.2 | Bricolage 600 | Home gains sequence |
| Hero statement | `0.9375rem` mobile · `1.25rem` desktop / 1.35, −0.01em | Bricolage 500 | Home hero mission line only — a calm lead under the headline: **exactly 2 lines on desktop, 3 on mobile** |
| Lede | `1.25rem` / 1.55 | Instrument Sans 400 | Intro paragraph under headings; offer-panel body on desktop, where plain Body reads too small against the full-bleed panel scale |
| Body | `1rem` / 1.7 | Instrument Sans 400 | Default copy |
| Label | `0.8125rem` / 1.4, +0.08em, uppercase | Instrument Sans 600 | Section eyebrows (`lichen`), pills |

**The hero statement is sized to its line count, not to a ramp.** It is one
sentence inside a card, and the card is only 95vw wide on a phone — so the
size that matters is the one that lands the sentence on even lines, not the
one a `clamp()` interpolates to. At 17px it broke to four ragged lines
(258/226/285/195px) and stopped reading as a sentence at all. 15px with
`text-wrap: balance`, in a band whose padding drops to `px-4` below `md` to
give back the last 16px, settles it to three (275/325/254px). **15px is the
floor** — below it the line stops being comfortable at arm's length, and the
fix for a longer sentence would be the card, not the type. Desktop is
untouched at 20px and stays at two lines, 4px apart.

The brand name always renders as "ArtiCYa" — never CSS-uppercased. An
element carrying the brand name (header wordmark, hero hint pill) drops the
Label step's uppercase and tracking; section labels and other non-brand
text keep them.
| Caption | `0.875rem` / 1.5 | Instrument Sans 400 | Photo credits, footnotes |

## Layout & spacing

- 4px base grid; Tailwind spacing scale only, no arbitrary pixel values.
- Content max-width `72rem` (max-w-6xl); text blocks max `65ch`.
- **The full-bleed offer panels are the one exception to the content column.**
  Their text alternates sides on `md`+ — Youth Exchanges left, Training
  Courses right — and each block sits over a reading fade anchored to **its**
  side, so legibility comes from the gradient rather than from a scrim: the
  wash direction always follows the text (`bg-gradient-to-r` under a left
  block, `bg-gradient-to-l` under a right one). Held inside the 72rem column,
  a 576px block starts 400px in on a 1920 screen and reads as floating toward
  the middle instead of anchored to its edge. So these panels inset from the
  **viewport** instead, on a gutter that grows with the screen
  (`.offer-panel-inset`: 1rem, 4rem at `md`, then
  `clamp(5rem, 10.42vw - 60px, 10rem)` at `xl`) — measured 90px at 1440 and
  140px at 1920, clamped at both ends so a laptop keeps a frame and an
  ultrawide never drifts the block back inward. The inner side stays open:
  774px of gap at 1440, 1204px at 1920. Mobile keeps the stacked layout
  anchored to the bottom wash — a narrow screen cannot afford side placement.
  Moving the text outboard puts it *deeper* into the opaque end of its own
  fade, so contrast improves rather than degrades: worst case over the faded
  photograph, swept across each panel's pinned range, **7.26** (`ink`, at
  1440 on Training Courses) against a 4.5 floor.
- Section rhythm: `py-24` desktop / `py-16` mobile. Adjacent plaster sections
  alternate `plaster` / `plaster-muted` so light stretches read green, never
  neutral cream.
- **The home page's mobile rhythm is tighter than that default**, because its
  joins are not section-edge to section-edge: a full-bleed panel already ends
  in its own bottom dissolve, the hero card is centered in its own screen and
  leaves ~120px of gold below it, and the lamp's pool spreads well past the
  button. Stacking `py-16` on top of that reads as dead gold rather than as
  breathing room. So on mobile the "What we do" section opens at `pt-6`, the
  gains section at `pt-12`, the offer panels close at `pb-10` and the lamp at
  `pb-20`; the joins then measure 88–146px rather than 160–186px. Desktop
  keeps the full rhythm — the wider frame earns it. The gold-field ramp is
  `72px` on mobile against `150px` on desktop for the same reason: the fade
  has to complete inside the shorter section.
- **The mobile first screen is the hero, and nothing else.** At 390×844,
  scroll 0, no part of "What we do" may be visible — not the heading, not its
  accent rule, not the section's top edge. The section begins exactly at the
  fold (measured on the built page: section top at 844, accent rule at 892,
  heading at 917).

  This costs ~120px of gold below the hero card, and that gap is **accepted**.
  It belongs to the *hero's geometry* — the card is centered in its own screen,
  and that centering is scroll-choreography, not spacing to retune. A `-mt-16`
  pull-up was tried (cb6721b) to spend the gap and let the heading peek above
  the fold as an invitation to scroll; it was reverted, because a first screen
  that shows the top of the next section stops being one composed image. Dead
  gold below a centered card is the cheaper problem. Padding is the only lever
  allowed on it — the section still opens at `pt-6` on mobile, which keeps the
  gap at that baseline rather than letting it grow.

  Reverting also removed the reason for the mobile open-edge classes: the
  hero's bottom edge and the section's top edge meet again exactly, at every
  viewport, so both keep the anchor and neither paints nothing. Measured at
  that join after the revert: worst row-delta **2.37**, and its worst row sits
  36px off the boundary — gradient stepping, not an edge.
- **Ground is decided per page, not per section.**
  - **Home** is one continuous gold world from the header to the footer — the
    `gold-wash` floor everywhere, `gold-anchor` at every section edge and
    `gold-chrome` in the two bars. No section may interrupt it and none may read as neutral
    cream. Depth inside the gold comes from the living atmosphere's amber
    pools, full-bleed photography and the resin light, never from switching
    ground.
  - **Inner pages** (about, faq, contact) are text-heavy and
    keep `plaster` as the default background below their heroes; no dark
    section may appear there outside the hero. The hero itself is the bridge
    to the home world: the same pine-dusk photograph treatment (`pine-950`
    wash) with the resin halo behind the headline, so navigating home → an
    inner page reads as the same forest at a different hour.
  - **Header and footer** are one `gold-chrome` surface site-wide, solid on every
    page and never transparent over a hero — so navigation reads the same
    everywhere. The first and last sections fade to this same gold, so chrome
    and body meet as one band; the amber hairline on the shared edge is the
    only rule either bar carries, and it is a signature, not a seam.
- Every page's first screen must read "green outdoors": photography plus at
  least two green token roles above the fold. On light grounds those are
  lichen labels, sage pills/borders, plaster-muted bands; on the dark home
  ground they are sage strokes/pills and the pine-green surface family.

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

Sanctioned placements — one continuous thread. On the home page it leads the
eye down the dark toward the closing line:

1. **Hero** — the lamp beam and its halo.
2. **Stats** — the monumental numerals glow resin out of the dark.
3. **Gains trail** — the drawn line and its nodes.
4. **Globe section** — the globe's dots and arcs read as lit points of the
   same lamp.
5. **Final CTA** — the lamp itself, the source of the whole thread: its line,
   cone and glow deliver "Your adventure starts here." and the primary
   button.

**Ignition is visual contact, not a shared number.** The lamp fires when the
descending thread has *visibly landed* on its node — so the thread completes
its draw at a fixed lead ahead of the ignition threshold (85% of the way to
it) rather than on the threshold itself. Drawn and fired on one value the two
events happen in the same frame, and the bloom covers the contact it exists
to confirm; on a phone, where the whole descent plays out inside the last
screen of scroll, that reads as the words arriving while the line is still
short of the junction. The lead buys a beat the eye can actually read —
measured on the built page, contact lands **32px** of scroll before ignition
on mobile and **40px** on desktop. Two guards keep it honest: the threshold
is clamped never to exceed the progress the page can deliver at its natural
scroll bottom, so a short viewport still ignites; and the document-end
fallback waits for the same contact point, so it can never fire on a line
still in the air. Under reduced motion the thread renders fully drawn and the
lamp is lit from the start — connected, trivially.

And on the inner pages, exactly one placement:

6. **Inner-page hero** — the halo behind the hero headline, the lamp meeting
   the visitor at every page's dusk threshold before daylight.

One thread, one hue, one temperature. Nowhere else — below their heroes the
inner pages are light grounds, and there are no glows on light grounds, ever.

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
| `.film-grain` | Fine tiled SVG grain at 5% opacity, killing the flat digital-paint feel | Over dark grounds and photographic frames |
| `.gold-field` | Top and bottom edges at `gold-anchor`, falling to it at zero alpha toward the middle where the `gold-wash` floor takes over | Every home section, and every full-bleed offer panel — it is what makes the seams continuous |
| `.gold-field-chrome-top` / `-bottom` | The same field with that one edge ending on `gold-chrome` instead, and — on the top variant — held flat for the header's height before the ramp starts | The hero (top) and the closing section (bottom) only: the two edges that meet a chrome bar rather than another section |
| `.gold-field-open-top` | The same field with its top edge painting nothing at all | A section or panel whose top opens onto its own section's floor rather than onto another field edge — the first offer panel only |
| Hero headline pool | Soft `gold-wash` ellipse, heavily blurred, inside the hero backdrop layer | Behind the home hero headline only, so it keeps AA over the now-fully-present backdrop photograph |
| `.hero-backdrop-fade` | Top-down mask over a hero backdrop layer, held at 32% at the header's own height and full 170px later | The home hero's backdrop photograph, so it does not appear all at once along the fixed header's lower edge — while still reading as a photograph from the hero's first visible row |
| `.plaster-light` | Soft pool of `plaster-bright` | Behind the About scenes and the finale mosaic |
| `.print-shadow` | Soft `pine-950` drop shadow | Under framed prints on plaster; the raised state of interactive cards (open accordion, hovered contact card) |

**Environment photographs.** A dark stretch may sink one of our own
photographs into its ground as atmosphere: blurred (≥ 14px), desaturated,
darkened, at ≤ 20% opacity — the home hero's backdrop is the one sanctioned
exception, see below — and masked so it dissolves into pure `pine-950`
at both ends of its stretch — it never touches a seam, and is felt more
than seen. The home page carries
two: the forest canopy behind the "What we do" clearing, and a faint band of
mountains over water behind the gains trail, faded out before the closing
line so the glow zone keeps its measured contrast. Always our own outdoor
photography from `/public/images` — never stock textures, generic forest
wallpaper, or leaf patterns.

The home hero's backdrop is the one that **breaks** the cap rather than
sitting under it: **40% opacity at a 20px blur, saturated 1.1**, where the
others run nearer 10% at 64px and desaturated. It has a job the others do not
— the collapsed hero is the first screen anyone sees, and it has to read as
our photographs behind frosted glass: shapes recognizable, the hillsides and
water legible as themselves, softly blurred and calm. Inside the envelope it
could not do that job. At 10%/64px the picture dissolved into an even gold
and the page opened on an empty field; at 18%/32px it was still a suggestion
rather than a photograph. Saturation is lifted above 1 for the same reason —
desaturated to 0.6 the greens went to a warm gray and the glass read as an
abstract wash.

**What the gold ground will and will not give back.** The greens can read as
*vegetation* here; they cannot read as *forest green*. The ground under this
layer is `gold-wash`, whose channels run R>G>B by roughly 37, and any
photograph composited over it at glass-level opacity inherits that bias: the
composite lands as a darker, cooler gold rather than as green. Measured on
the built page at 40%, every sample across both viewports is warm-leaning
(green excess −14 to +5), and swapping in the page's most saturated forest
photograph moved nothing — it only made the blur read as mottled khaki and
cost the picture its recognizable shapes. Green above the fold on this page
therefore comes from the token roles that carry it — the pine marks, the
sage strokes — and from the card photograph itself, not from the backdrop.
Raising opacity further to chase it would spend the contrast budget below
without buying the hue.

Because the photograph now reads at full strength, the headline needs a
ground of its own: `We are ArtiCYa` is wider than the collapsed card, so the
outer end of the second line lands on open photograph, where the darkest
patch of hillside took `ink` to **3.48** — under AA. A soft cream pool sits
inside the backdrop layer, blurred well past its own box, and lifts exactly
that patch. It sits inside the backdrop rather than behind the words on
purpose: the card is painted after it, so the pool only ever touches the
photograph the headline overhangs, and it fades out on the backdrop's own
opacity as the card expands and the headline slides away — no second piece of
scroll logic. Measured on the rendered composite at the top state, worst case
over the whole text box: headline **5.44** mobile / **4.60** desktop, hint
pill **4.82** / **4.67**. All clear AA.

Rules, in order of precedence:

- **Static only.** Every layer is painted once and never animated, never
  scroll-linked, never repainted — atmosphere is free on the GPU and needs no
  reduced-motion variant.
- **Measured on the composite.** Layered grounds create pixel values between
  tokens, so text contrast is verified against the actual rendered composite
  (screenshot sampling behind each text zone), not against the flat token.
  Working ceiling: no composite behind text may exceed `pine-800` lightness —
  the lightest ground every dark-ground pair still passes on. Gradient layers
  mix only existing grounds; photo layers respect the ceiling through their
  opacity and brightness caps.
- **One light.** `.lamp-falloff`'s warm whisper is the falloff of the same
  resin lamp at the hero seam — direction for the existing light, never a
  second source. Everything else is pine and plaster, and every layer stays
  too faint to read as glow, shape, or blob (whisper-level; if a screenshot
  shows a hard edge, it is too strong).

## Do / Don't

**Do**

- Let photography carry the outdoors; frame it with plaster, sage and lichen.
- Use `plaster-muted` bands so light sections visibly lean green.
- Keep every glow the same resin amber; one light source, one temperature.
- Use sage borders instead of gray borders everywhere on light grounds.
- Check this table before introducing any new fg/bg pair.
- Outline a card with an inset ring on its own topmost layer, not a `border`.
  A border sits under an absolutely positioned fill, and an inset shadow on
  the card itself paints under its children — either way the fill covers it.
  Where a parent clips the card, the card takes `border-radius: inherit`
  rather than restating the value: these frames are sized in fractional
  pixels, so a hand-matched radius rasterizes its arc on a different subpixel
  boundary than the clip and the corner reads chipped.
- Square a card's corners when a gold frame has to cross the fixed header. A
  round corner interrupted by the chrome reads as a cut arc; a straight edge
  passing under the bar reads as nothing at all. This is why the expanded hero
  card is square — see the frame spec above.

**Don't**

- Don't give a **rounded** gold outline to a card whose edge passes under the
  fixed header. The expanded hero card is centered in the viewport, so on a
  short desktop window its top edge and both top corners sit behind the
  chrome. Its hairline gold frame works because the card is square: the two
  vertical lines simply vanish under the bar. Rounded, the same frame's arcs
  would re-emerge mid-curve below the chrome and read as broken.
- Don't use pure black, pure white, or any gray — the neutrals are the pine
  and plaster families.
- Don't use bright/tech greens, leaf icons, or gradients outside the
  atmospheric-ground layers.
- Don't set `resin` as body-size text, or `sage` as text on light grounds.
- Don't break the home page's dark ground with a light section, and don't put
  a dark section on an inner page below its hero. No second accent hue.
- Don't introduce new font weights beyond 400/500/600, or new
  durations/easings. 500 is Bricolage only, and only for the home hero
  statement, where 600 at that size reads heavier than the line deserves.

## Component token mapping

Token assignments for the four animated components to be integrated. Every
hardcoded color in the source components maps as follows; no exceptions at
integration time.

| Component | Hardcoded value | Token |
|---|---|---|
| Header / footer | chrome surface | `gold-chrome`, 1.25px `amber`/0.5 hairline on the edge shared with the body |
| Header | wordmark | `ink` |
| Header | resting nav label | `bark` |
| Header | active + `:hover` nav label | `resin-deep` |
| Header | nav underline (decorative, 200ms) | `amber` |
| Footer | copyright, social icon strokes | `ink-soft`, `resin-deep` on hover |
| Home CTA (`gold` button) | fill · label · border | `amber-fill` · `ink` · `amber-edge` |
| Home CTA | `:hover` fill · label | `amber-lit` · `ink` |
| Scroll-expansion hero | `black` background | `pine-950` |
| Scroll-expansion hero | `white` text | `plaster-bright` |
| Scroll-expansion hero | `blue-200` subtext | `resin-light` |
| Zoom parallax | `neutral` grounds/gaps | `plaster` (section), `plaster-muted` (image gaps) |
| Zoom parallax | any neutral text | `pine-950` |
| D3 globe | `black` ocean fill | none — transparent, the section's `pine-950` ground is the ocean |
| D3 globe | `#999` halftone land dots | `resin` |
| D3 globe | `white` land outlines | `resin-light` (low alpha) |
| D3 globe | `white` graticule/sphere stroke | `pine-800` (low alpha) |
| D3 globe | Europe/Mediterranean dots | `resin-light`, brighter and larger — the warm heart of the globe |
| Lamp | `slate-950` background | `pine-950` |
| Lamp | `cyan-500` glow | `resin` |
| Lamp | `cyan-400` glow | `resin-light` |
| Lamp | `white` headline | `plaster-bright` |
| Lamp | `slate-950` cover bars shaping the cone | none — the cone halves fade to transparency via `mask-image`; the two bars that remain (above the line, under the cone) are `pine-950` on the section's flat ground |
| Lamp | demo headline (`slate-300`→`slate-500` gradient text) | none — stripped; the section carries the frozen closing content in the type scale's own styles |

The globe and lamp share `resin`/`resin-light` deliberately — they are the
same light source (see signature element).
