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
| `pine-950` | `#22301C` | Dark ground (dark sections); text on light |
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
and the first visible row sits a step below the bar. Measured at the chrome
joins on the built page: footer seam 2 (desktop) / 1 (mobile) maximum channel
jump. The **header** join is not a gold seam at all — the hero's backdrop
photograph runs to the section's top row, so the bar's hairline lands on the
picture (see the poster's top edge below). On desktop the expanded hero's
photograph passes under the header by design, for the same reason (see Don't).

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

On the inner pages the line lands against the full-bleed hero photograph rather
than gold, where it reads as a warm rule marking the threshold between chrome
and the picture — the same mark doing the same job over a photographic ground.
(The hero also carries the same amber hairline on its own lower edge, the
signed threshold where the photograph ends and the body begins.)

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

**The expanded hero card is full-bleed, square, and unframed.** At full
expansion the card — photograph and tagline panel as one object — measures the
**whole viewport width**. It used to stop at 95vw, which left a 36px gold strip
down each side at 1440 and 9.75px at 390; once the foot was dissolved those two
verticals were the hardest lines on the page — a ruled edge surviving at the
sides precisely because the base no longer had one. The growth ramp overshoots
the stage, so the strip was never the expansion falling short: it was the cap,
and the cap is now the stage's own width rather than a fraction of it.

**The ramp ends on a fraction of the window, not on a number of pixels.** The
desktop ramp used to run 300px → a flat 1550px. That is 1.0764 × the 1440
window it was tuned on, so it cleared the edge there and fell short of it on
anything wider: measured at 1698 the photograph stopped at 1550 with 74px of
gold down each side, at 1920 with 185px, at 2560 with 505px — the same ruled
verticals the full-bleed pass existed to remove, reappearing above ~1550px of
window. The end value is now that same **1.0764 fraction of the stage**
(`calc(300px + progress × (107.639% − 300px))`), so the ramp overshoots by the
same margin at every width and `maxWidth: 100%` still does the stopping.

Keeping the *fraction* rather than the pixel count is what preserves the pace.
At 1440 the expression resolves to 300 + 1250 × progress — the ramp it
replaces, to the pixel. Elsewhere the beat lands in the same place rather than
at the same width: the card reaches the sides at progress **0.912** at 1440,
0.915 at 1698, 0.917 at 1920 and 0.920 at 2560, so the moment the picture goes
full-bleed sits within 0.8% of progress of where it always did. A ramp that
ended exactly on the stage would have been 9% slower at 1440 and would have
arrived only on the last frame of the scroll.

Widening again costs the foot nothing, and again this was measured rather than
assumed — the ramp is a fixed px length up from the base and the arc's radius
is a percentage of the card, so neither reads the width. Measured at full
expansion, alpha-50% row above the base (median of nine columns, slide pinned):
**169 / 218 / 169** at 1440, **169 / 219 / 169** at 1698, 1920 and 2560 — one
pixel of spread across a card that grew from 1440 to 2560.

The **height** ramp is still absolute: 400px → 800px, capped at `85vh`. Below
about a 941px-tall window the cap binds and the card is nearly full-height
(765px at 1440×900); above it the ramp binds and the card is a band — 800px
inside a 1440-tall window at 2560, leaving gold above it as well as under the
foot. That is a separate constant from the width and has not been changed.

It carries **no gold frame**. The earlier build ringed the card with a 1px
`amber` hairline at 0.55 alpha along the top and both sides, its lower edge
dissolved away with everything else at the base. That frame worked while the
card stood inside gold and had gutters to sit in. Full-bleed it has none: the
two verticals land on the first and last column of the window and the top edge
passes under the chrome, so what is left is not a frame but two lines pinned to
the screen edges, reading as a viewport artifact rather than as an object. A
frame that cannot enclose is not a quieter frame, it is a stray mark — so it
was dropped whole rather than left as orphan verticals. The photograph's own
edges carry the card now, three of them, the fourth being the dissolve.

The corners stay **square** (`border-radius: 0`), and full-bleed the reason
only sharpens: the card is centered in the viewport, so on a short desktop
window its top edge and both top corners sit behind the fixed header. A rounded
corner's arc re-emerges mid-curve below the chrome and reads as cut, where a
straight line dies under the bar cleanly. The short rule above the tagline
stays as an internal accent at **1px `amber` at 0.55** — not the 1.25px
accent-mark weight: inside the picture a rule whispers where an accent mark
points.

**Widening costs the foot nothing, and this was measured rather than assumed.**
Both of the foot's masks are scale-invariant across the change: the ramp is a
fixed px length measured up from the base, and the arc is an ellipse whose
horizontal radius is a *percentage* of the card, so a corner sits at the same
fraction of that radius at 1368px as at 1440px. Measured on the built page at
both widths, the alpha-50% row above the base is unmoved — centre **228 → 224px**
desktop, **149 → 149px** mobile; mobile corners **110 → 113** and **110 → 112px**
(the desktop corners had no reading before, since gold stood where they now
fall). The edge still does not slide as the card grows: sampled at four
expansion steps the centre holds 219/220/219/223px on desktop, a 4px spread, and
143/142/142/152px on mobile, 10px — the same order of rounding the original
measurement reported. Full-bleed, the card's top edge becomes the hero's hardest
remaining line on mobile, where it was a card edge before; it is the
photograph's own boundary rather than a rule, and on desktop it stays hidden
under the chrome.

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
| H2 | `clamp(2rem, 4vw, 3rem)` / 1.1, −0.01em | Bricolage 600 | Section headings, on every page: home "What we do" / "What you gain", home offer-panel titles, Contact "Get in touch", the FAQ question-group headings |
| FAQ question | `1.0625rem` / 1.45 | Instrument Sans 600 | The FAQ accordion questions — reading size, body face, separated from the answer by weight, colour and space |
| Stat numeral | `clamp(3.25rem, 8vw, 6.5rem)` / 1 desktop · `2.75rem` / 1 mobile | Bricolage 600 | Home stats only — `resin`, glowing. Monumental centered columns on desktop; compact ledger rows on mobile so all three share one screen |
| Showpiece | `clamp(2.25rem, 5vw, 3.75rem)` / 1.15, −0.01em | Bricolage 600 | One key line per page max — on the built site, the home closing line and nothing else |
| Trail item | `clamp(1.5rem, 2.5vw, 2.25rem)` / 1.2 | Bricolage 600 | Home gains sequence |
| Hero statement | `0.9375rem` mobile · `1.25rem` desktop / 1.35, −0.01em | Bricolage 500 | Home hero mission line only — a calm lead under the headline: **exactly 2 lines on desktop, 3 on mobile** |
| Lede | `1.25rem` / 1.55 | Instrument Sans 400 | Intro paragraph under headings; offer-panel body on desktop, where plain Body reads too small against the full-bleed panel scale |
| Body | `1rem` / 1.7 | Instrument Sans 400 | Default copy; the Contact channel values |
| Caption | `0.875rem` / 1.5 | Instrument Sans 400 | Photo credits, footnotes, the footer copyright |
| Label | `0.8125rem` / 1.4, +0.08em, uppercase | Instrument Sans 600 | Section eyebrows (`lichen`), pills, the Contact channel labels |
| Button | `0.875rem` / 20px, +0.02em on the filled gold control | Instrument Sans 600 | Control labels — never uppercased, so a button never reads as a Label |
| Wordmark | `1.125rem` mobile · `1.25rem` desktop / 28px, −0.01em | Bricolage 600 | The header logotype only. A logotype is sized to its bar, not to the reading ramp, which is why it sits off the scale rather than on a step of it |

**The hero statement is sized to its line count, not to a ramp.** It is one
sentence inside a card, and the card is only a phone wide there — so the
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

**Display type scales with the viewport; reading type does not.** Everything
from Trail item upward is clamped and shrinks on a phone, because its job is
presence and presence is relative to the screen. Everything from Lede down —
Lede 20px, Body 16px, Caption 14px, Label 13px — holds one size at every
viewport, because its job is legibility and legibility is absolute: a
paragraph is not easier to read on a small screen for having been made
smaller. So the Lede staying at 20px on a phone is the rule, not an
oversight in it. Its neighbour Body is invariant too, and the ratio that
carries the distinction between them — 1.25× — is identical at 1440 and at
390. Shrinking the Lede to 18px would leave it 2px above Body at the same
weight and the same family, which is not a hierarchy; it would trade a
working distinction for a smaller number.

**Some steps carry more than one role, and that is a decision.** A shared
size is only a defect when the two roles are adjacent — when a reader has to
tell them apart in one glance. These pairs never are, and each is separated
by family, weight, or context rather than size:

| Step | Roles sharing it | What separates them |
|---|---|---|
| 20px desktop | Wordmark (Bricolage 600), Hero statement (Bricolage 500), Lede (Instrument 400) | Family and weight; the wordmark is chrome, the other two are content |
| 14px | Button (Instrument 600, +0.02em), Caption (Instrument 400) | Weight, and a filled control against a footer line |
| 44px @390 | Display, Stat numeral | Not a ladder — these are the two **monumental** roles, and on desktop the stat numeral is deliberately the larger of the two (104 against 72). They sit a full screen apart, one a centred headline in a photographic card, the other a numeral on a baseline opposite a 13px uppercase label |
| 32px @390 | H2 (the FAQ group heading no longer shares it) | The FAQ group heading was pulled off this step to a flat 1.75rem. It is a group label, not a section heading — a label that carries a set of rows sits between the page title and the rows, not level with a section heading — so it sits a notch below H2 on a step of its own |

**Hierarchy is built with space, weight, colour and rules first. A size step
is the last tool, not the first — and a display face is reserved for headings
that carry a section, never for repeated list items.**

This supersedes an earlier working rule that every level had to be *visible at
a glance* as a size difference. That rule came from a different problem — a
page where two adjacent roles rendered identically — and it does not transfer
to a list. Applied to the FAQ it produced ten 24px Bricolage questions in a
column, which read as shouting rather than as structure: at that size and in
that face each row claims to carry a section, and ten of them claim it at
once. The face is doing the work of a heading in a place that has no heading
to give.

**The FAQ question is the worked example.** It sits at 17px Instrument Sans
600 — a hair over the 16px answer, and below the 18.66px large-text threshold,
so nothing about it is a size event. The four levers carry it instead: the
answer is `ink-soft` against the question's `ink`, 400 against 600, and the
question's own top padding plus the 16px gap to the card above leaves **36px
of air over each question against 12px under it**, so the pair groups
downward and the eye reads question-then-answer rather than two peers. No
rule is drawn between the two: the card's amber border already encloses the
pair, and a hairline at the question/answer join would cut exactly where the
space is working to join. A rule earns its place when it separates things
nothing else separates — here nothing was left over for it to do. Measured
on the built page, the closed rows come out at one uniform height (70px at
1440, 70/91px at 390), which is what lets the list be scanned without being
read.

**There is no level between a section heading and body copy.** The FAQ is the
only page built as section → question → prose, and its questions are list
items, not a middle heading tier — so no page has a rendered step between H2
and Body, and none needs one. The home page runs Display → H2 → Trail item →
Lede → Body: its offer-panel titles are **not** demoted H2s waiting for a
middle level, they are titles on full-bleed photographic set pieces and are
sized to the panel, not to the ramp. A step down would shrink a showpiece to
fix a table.

## Layout & spacing

- 4px base grid; Tailwind spacing scale only, no arbitrary pixel values.
- Content max-width `72rem` (max-w-6xl).
- **Measure is a measured rule, verified on the rendered page.** With one
  exception the reading tracks are px, and the measure is checked by rendered
  character count rather than by the declaration: **no prose block may exceed
  70 characters on its longest rendered line**, at either viewport. The
  longest line is the one a reader actually scans; an average divides by the
  short final line and under-reports it by up to 33 characters on a block this
  size. Measured on the built page, the worst block on the site is 70 and the
  FAQ answers — once the worst offenders at 76–83 — run 59–70. The tracks that
  deliver it: no 16px block sits in more than **552px**, and the inner-page
  hero ledes are centred over the photograph in `max-w-[38.75rem]` (620px),
  which lands the longest rendered line inside the 70 a prose block gets — a
  count read off the built page, not inferred from the track width.
- **The hero title is the one container expressed in `ch`, at `16ch`.**
  Everywhere else the reading type holds a fixed size and its track is px; the
  title is the exception because its display size is clamped
  (`clamp(2.75rem, 6vw, 4.5rem)`). A `ch` value holds the same break at every
  viewport where a `px` cap would not — `16ch` breaks the longest title,
  "Frequently Asked Questions", onto two balanced lines and keeps that break
  identical at 72px on desktop and 44px on mobile, whereas a px width would let
  the break migrate as the clamp interpolates the glyph size up and down. The
  constraint travels with the type precisely because the type here is fluid.
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
  breathing room. So on mobile both "What we do" and "What you gain" open with
  **no top padding at all**, the offer panels close at `pb-10` and the lamp at
  `pb-20`. Desktop keeps the full rhythm — the wider frame earns it. The
  gold-field ramp is `72px` on mobile against `150px` on desktop for the same
  reason: the fade has to complete inside the shorter section.

  **A join is one beat, and the beat is measured where the reader is.** A
  section's own top padding is not the whole gap: the panel above already
  closes on its `pb-10`, and the panels are pinned, so the distance that
  matters is the one between two *rendered* beats mid-release, not between two
  resting section edges. Measured that way the Training Courses paragraph sat
  **113px** from the "What you gain" heading (40 panel `pb-10` + 48 section
  `pt-12` + 25 rule and its `mt-6`) with another **106px** below the heading
  before the first gain (`mt-14` plus the first station's own `py-10`) — a
  254px stretch carrying one heading and a 64px tick. Dropping the section's
  top padding and taking the trail's margin to `mt-6` leaves **65px** above
  the heading and **74px** below it: one beat each side, the panel's and the
  station's own padding doing the work. The gains-to-panel margin above the
  offer panels came down the same way (`mt-16` → `mt-10`), since that join is
  a photograph dissolving in rather than an edge.
- **The mobile first screen is the hero, and nothing else.** At 390×844,
  scroll 0, no part of "What we do" may be visible — not the heading, not its
  accent rule, not the section's top edge. The section begins exactly at the
  fold (measured on the built page: section top at 844, accent rule at 844,
  heading at 869).

  This costs gold below the hero card, and that gap is **accepted**. It
  belongs to the *hero's geometry* — the card is centered in its own screen,
  and that centering is scroll-choreography, not spacing to retune. A `-mt-16`
  pull-up was tried (cb6721b) to spend the gap and let the heading peek above
  the fold as an invitation to scroll; it was reverted, because a first screen
  that shows the top of the next section stops being one composed image. Dead
  gold below a centered card is the cheaper problem.

  Padding is the only lever allowed on it, and on mobile that lever is now
  **fully spent**: the section carries no top padding at all there, so the
  accent rule sits on the section's own top edge, which sits exactly at the
  fold. The one lever left after that is the expanded card's own resting
  drop, and it is spent to its floor too: the drop keeps **50px** clear of
  the fold (`50dvh − 350px`, down from 57px — 50 is the floor of the 50–65px
  band the clearance lives in), and the heading's rule-to-heading margin is
  `mt-4` below `md`. Measured on the built page at 390×844: card bottom 794,
  accent rule 844 — 50px, the clearance exactly; heading top 861.

  Desktop dropped its `pt-24` in the sunrise pass. The hero already leaves
  68px of gold under its card, and the left column's self-centering against
  the taller globe column adds ~90px more — with 96px of padding on top, a
  full empty gold band separated the card from the heading and the entrance
  played out where nobody was looking. With no top padding the heading area
  engages **158px** under the card block (measured at 1440×900), inside the
  120–160px window, and the sunrise starts while the card is still leaving
  the viewport — the two moments overlap instead of being separated by dead
  gold.

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
  - **Inner pages** (about, faq, contact) are text-heavy and keep `plaster`
    as the default background below their heroes; no dark section may appear
    there outside the hero. The hero is the **photograph full-bleed with the
    type centred over it** — heading, lede and accent rule vertically centred,
    the picture running edge to edge under the chrome. What carries the dark
    ink is **not** a full-frame veil: the old flat scrim at ~85–90% across the
    whole frame is what made the photographs read as ghosts and is retired. In
    its place a **local, vertically-graded `gold-wash` lift** sits only behind
    the words — the same technique as `.hero-sky-lift` and `.hero-photo-lift`,
    centred rather than edge-anchored — strong where the type falls and gone by
    the sides, so the left, right, top and bottom of every frame stay pure
    photograph. The lift is the *lowest* that clears the contrast floors (see
    below), the remaining margin spent on the picture. This supersedes an
    interim "two-part split" (type beside the photograph on gold), which read
    as taking too much space; and it is not the old veil it looks like — the
    lift is local and graded, not a wash over the picture.
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

- Durations — three system steps: **200ms** (hover, focus, small fades),
  **400ms** (reveals, card entrances, accordion), **700ms** (hero moments,
  scroll-linked transitions, the lamp/globe lighting up). Entrance
  choreographies compose these freely; two longer curves are sanctioned — the
  hero title card's frame settle at **1100ms**, the single master element of
  the first load (its veil warm-up, a glow rather than a moving object, may
  run to ~1200ms), and the "What we do" globe's rise, which settles over
  **1200ms** so its tail is the last, quietest motion of the clearing's
  arrival.
- Easings — exactly two: `--ease-out-quart` `cubic-bezier(0.25, 1, 0.5, 1)`
  for entrances and hovers; `--ease-in-out-cubic`
  `cubic-bezier(0.65, 0, 0.35, 1)` for continuous or scroll-linked motion.
- `prefers-reduced-motion` is always honored — the global rule in
  `globals.css` collapses animation and transition durations; scroll-linked
  components must additionally render their resting state.
- Nothing autoplays on loop except the globe's slow rotation and the lamp
  glow, both of which stop under reduced motion.

**Signature entrances play on the clock, not the scrollbar.** The page's two
set-piece moments — the hero's first-load title card and the "What we do"
stage entrance — are time-based and once per load. An earlier pass scrubbed
these choreographies by scroll progress; at a real flick speed the whole
performance elapsed inside ~200ms of finger travel and read as nothing at
all. The technique, not the tuning, was the failure. Entrances now trigger
once — page load for the hero, the first in-view crossing for sections — and
play on fixed durations, identical at any scroll speed; a visitor who blasts
past still finds every element settled where it belongs, because the
transitions run to their end states regardless of where the viewport went.

**The hero title card** (~1.4s from the first paint): the golden veil warms
up from 45% over 1200ms while the photo frame settles in on the one long
master curve (1100ms, opacity 0 → 1, scale 1.08 → 1, its shadow container
fading with it so no orphaned shadow ever floats alone); the headline's two
lines rise out of clipped masks, staggered 120/300ms; one glare sweeps the
glass (750–1850ms, resting opacity 0 at both ends); the amber strike draws
from its center at 850ms and the hint pill lands last at 1000ms. The
choreography is pure CSS keyed off a `hero-load` class the page's inline
script sets before the hero parses — it runs from the very first frame, a
no-JS visitor renders the resting state (the class never lands), and the
finished animations hold their fill instead of snapping when hydration
lands. Movement uses the individual `translate`/`scale` properties, never
`transform`: the expansion writes inline transforms on these elements or
their parents, and the two channels must compose rather than fight. The
same rule bans Tailwind translate utilities from any element a keyframe
translates — they set the same `translate` property, and the animation
silently overrides the utility for its whole run.

**The "What we do" stage entrance** (~1.5s, one event): a single
`StageScene` wraps the whole section — text, globe and stats ledger — arms
after hydration, and fires once, the first time the section rises 30% above
the viewport bottom, so a real share of the composition is on screen when
the wave starts. From that one cue everything plays as one arrival with
internal order, on the clock: the rule draws left-to-right (400ms) while
the whole text column lifts from 72px below (0ms); the heading additionally
surfaces out of its clipped line (80ms, 700ms); the globe takes the stage
at 200ms, rising from 120px below (88px mobile) — opacity a 200ms reveal,
the rise a long 1200ms settle, and nothing stacked on top of it: no scale,
no tilt, no glow; the lead's own 72px rise
follows at 250ms; and the ledger rows land last at 550/680/810ms, each
rising 72px, each counter still writing itself in over 700ms only when it
enters view (server HTML always carries the final frozen strings). The last
row settles at ~1.5s. Opacity fades are 200ms against the 700ms travels —
measured on the built page, an element is ~88% opaque with 43px of its
journey still to run, so the movement itself is what the eye sees, not a
fade. An earlier build gave text, globe and stats three separate observers
(-14%/-30%/-14%); on a steady scroll they fired ~220ms apart as three
disconnected drips, and the text scene fired with the heading at the fold's
last 180px, so its rise played clipped and finished before it was
comfortably visible. One trigger replaced them. Hidden states exist only
between arming and firing, so exported HTML carries everything at rest and
reduced motion never arms the scene at all. The globe's arrival finishes as
its own turn: on its first −30% crossing — its own, not the section's, so on
mobile, where the globe sits a screen below the heading, the spin plays with
the globe on screen rather than under the fold — the canvas carries ~58°/s
of extra rotation that bleeds off exponentially (τ ≈ 520ms) into the steady
4°/s, so the entrance emerges out of the rotation the globe never stops
making and settles into motion instead of stopping dead at a target. There
is no glow in the choreography at all: the earlier dawn flash cresting behind
the globe is gone — a glow behind a moving object is the plainest
cheap-motion tell — and the section ground is clean gold in every resting
frame. The worst rest-state pixels behind text keep `ink` ≥ 9.1 and
`ink-soft` ≥ 4.88 on both viewports.

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

**The thread is one stroke, and nothing is painted ahead of its tip.** From
the first gain node to wherever the line has currently drawn to, it must read
as a single continuous stroke; past the tip there is nothing at all. Two rules
follow, and both were once broken at the same time.

No undrawn "track". The trail's rail and the lamp's descent path each used to
paint a `hairline` line under the amber, so the remainder showed as grey and
the eye read the change of colour as the line ending — the one stroke became a
warm piece and a cold piece with a visible join.

One clock. The rail and the descent are two elements, so they are also two
scroll ranges, and they only look like one line if their ends coincide: the
rail must be *finished* at the instant the descent starts drawing. Ending the
rail at `end 0.5` while the descent began at `start 0.8` let the descent run
ahead, and the finale showed a drawn stretch, a gap, and a second drawn
stretch below it. The rail now ends at `end 0.8` — the descent's own start —
which also pins the drawn tip to a fixed screen line for the whole walk down.

The lamp's blade is the third piece and is not part of the stroke: unlit it
holds at **0.2 opacity**, the dark bar the fixture hangs from. At full
strength it read as the far end of a line that had not arrived yet, and the
undrawn descent between them read as a gap in it.

**Ignition is visual contact, not a shared number.** The lamp fires when the
descending thread has *visibly landed* on its node — so the thread completes
its draw at a fixed lead ahead of the ignition threshold (85% of the way to
it) rather than on the threshold itself. Drawn and fired on one value the two
events happen in the same frame, and the bloom covers the contact it exists
to confirm; on a phone, where the whole descent plays out inside the last
screen of scroll, that reads as the words arriving while the line is still
short of the junction. The lead buys a beat the eye can actually read —
measured on the built page, contact lands **56px** of scroll before ignition
on mobile and **60px** on desktop. Two guards keep it honest: the threshold
is clamped never to exceed the progress the page can deliver at its natural
scroll bottom, so a short viewport still ignites; and the document-end
fallback waits for the same contact point, so it can never fire on a line
still in the air. Under reduced motion the thread renders fully drawn and the
lamp is lit from the start — connected, trivially.

**The finale is short, and it must not end on the scrollbar.** The descent is
a bare amber line over open gold: every pixel of it is page with nothing to
read, so it is kept to **64px** on mobile and **96px** on desktop. At 112/144
it left the bottom half of the screen empty while the last gain scrolled
away, which is the whole of what "the finale drags" meant — the scroll cost
was never the problem, and cannot be: ignition can never land past the
document's own bottom, which caps the runway at about a third of a screen
whatever the geometry. Measured from the last gain node reaching centre:
contact at **0.13** (mobile) / **0.17** (desktop) viewports, ignition at
**0.20** / **0.23**.

The clamp is what makes that cap bite, and it used to bite all the way. The
descent's scroll range ends on `end 0.45` rather than `end 0.35` because the
closing section carries only about 0.64 of a screen below the junction:
demanding the junction climb to the top third left the arrival unreachable
until the document's last pixel, so the lamp fired exactly as the page ran
out and a 2px shortfall left it dark. Ending at 0.45 puts ignition **46px**
(mobile) / **92px** (desktop) inside the scroll bottom, with the paragraph,
the closing line and the button all in frame when it fires. The stage and its
bottom padding shortened with it (`h-44`, `-mt-32`, `pb-16`/`pb-28`), which
pulls the words up into the pool rather than leaving them to be found below
it. The gold stays continuous across the shortened section: worst adjacent
row delta **3** at both viewports, top edge landing on `gold-anchor` exactly.

The inner pages no longer carry a placement of their own. Their heroes lead
with the photograph at full strength and set the headline **centred over it**,
carried by a local `gold-wash` lift rather than a dusk wash or a halo — so
there is no glow to place, and there are no glows on light grounds, ever. The
one warm thing behind an inner headline is that lift: a cream lightening that
settles the ground the words sit on, not resin light.

So the thread is now the home page's alone — one hue, one temperature, from
the hero lamp to the closing line, and nowhere else.

## Atmospheric grounds

Dark stretches are built as layered environments, never as painted surfaces:
one of our own photographs sunk under the pine scrim, the lamp's light
falling with direction, and film grain over the top. The shared layers are
defined once in `globals.css`; environment photographs are art-directed per
section. Nothing else may put a gradient or texture on a ground:

| Class | What it is | Where it may sit |
|---|---|---|
| `.dusk-light` | Top-down wash of `pine-900` fading out — the sky a shade lighter than the ground it settles into | Top of dark sections |
| `.dusk-ambient` | Centered radial pocket of `pine-900` | Behind content on long dark stretches |
| `.lamp-falloff` | The seam lamp given direction: a warm whisper directly under the halo inside a wider `pine-800` light dome, shading the ground from lit to deep | Astride the home hero seam only — mirrored above it inside the hero, falling away below it, so the two grounds meet with no edge |
| `.hero-photo-lift` / `-pool` | Soft-edged `gold-wash` pool **anchored to the block of type**, its falloff a fade across multiplied by a fade down — a **local** lightening, not a band across the frame. The model for every lift on the site (`.hero-sky-lift`, the inner-page hero lift): strong where the words fall, gone by the edges, ending on the zero-alpha gold so the ramp never pulls through grey | Behind the home hero intro only, so dark ink reads low inside the photograph while the rest of the frame stays at full strength (4.5 floor; **6.04/8.33** measured on the composite) |
| `.hero-sky-lift` | The poster opening's version: a top-anchored `gold-wash` fall, **held across the headline band** and released to zero toward the frame's sides and into the sky by mid-frame | Behind the home collapsed headline, over the full-strength `home-hero.jpg` vista — carries the dark headline while the sky at the sides and the mountains and lake below stay at full strength (headline is large type, see the floors below; **6.0/6.2** measured) |
| Inner-page hero lift | A **vertically graded** `gold-wash` pool: lighter across the large heading (3.0 floor), full behind the body-size lede (4.5 floor), masked to a central ellipse so the sides stay pure photograph. Two profiles, split by `md`, because the lede sits at a different height on the two viewports | Behind the centred type on the About/FAQ/Contact heroes only — the local lift that replaced the old full-frame scrim (measured: heading **3.7–3.9**, lede **4.6–4.75**) |
| `.hero-foot-fade` | The card's foot: an eased bottom ramp taking the photograph and the intro's lift to nothing over `--hero-foot` (280px desktop / 176px mobile). `--foot-halo` inflates the mask box past the border box on the card, so the drop shadow's lower edge goes with it and the other three sides keep theirs | The expanded hero card and its intro lift — the elements the expansion sizes, never a parent |
| `.hero-foot-arc` | A second mask nested inside the ramp, an ellipse reaching `--hero-foot-arc` (340/230px) up from the base, so the picture retreats higher at the centre than at the corners and the foot is a curve rather than a line | The hero frame only |
| `.hero-foot-pool` | The light the picture leaves on the ground: `amber-soft` cresting just above the card's base, gathered in the middle rather than run across the width, gone by the section's last row so the seam below is untouched | Anchored to the home hero's lower edge, behind the backdrop photograph |
| `.photo-vignette` | Edges falling toward `pine-950` | Inside photographic frames and hero photos only |
| `.film-grain` | Fine tiled SVG grain at 5% opacity, killing the flat digital-paint feel | Over dark grounds and photographic frames |
| `.ground-parallax` / `.ground-plate` | The photographic ground under the "What we do" clearing: one of our own photographs, blurred and lifted, travelling at a fraction of the page's scroll rate behind the block. The mask belongs to the block, the plate moves inside it | Behind the "What we do" stage only — the one scroll-linked layer on the site (see The travelling ground) |
| `.ground-lift` / `-pool` | The gold a block of type stands on once a photograph is under it: a soft-edged pool anchored to the block, its falloff a fade across multiplied by a fade down, its bleeds kept short so the ground beside the block stays photographic | Over the "What we do" type column and its stats ledger only |
| `.gold-field` | Top and bottom edges at `gold-anchor`, falling to it at zero alpha toward the middle where the `gold-wash` floor takes over | Every home section, and every full-bleed offer panel — it is what makes the seams continuous |
| `.gold-field-chrome-top` / `-bottom` | The same field with that one edge ending on `gold-chrome` instead, and — on the top variant — held flat for the header's height before the ramp starts | The hero (top) and the closing section (bottom) only: the two edges that meet a chrome bar rather than another section |
| `.gold-field-open-top` | The same field with its top edge painting nothing at all | A section or panel whose top opens onto its own section's floor rather than onto another field edge — the first offer panel only |
| Hero title pool | Soft `gold-wash` ellipse at ~26%, heavily blurred, inside the poster's lift layer | Behind the home collapsed headline only, concentrating a little more light where the words sit (`.hero-glass-veil` and the old 25% pool are retired) |
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

**The home hero's backdrop is the poster vista, and the sky lift carries the
headline.** The collapsed opening is a full-strength graded photograph —
`home-hero.jpg`, the Gerês reservoir vista from the same shoot as the card
slides — read as the *place* the page opens on, not a texture. It is the
first slide too, so the poster cross-dissolves into the gallery as the card
grows rather than being swapped for it.

**The poster meets the chrome, and carries no top fade.** It used to be masked
in below the bar — held at 32% at the header's own height and full 170px later,
on the reasoning that the picture would otherwise arrive all at once along the
bar's lower edge. It cannot: the layer starts at the section's top, which the
fixed header covers, so every row the ramp spends softening is a row nobody
sees except the ones just below the bar, where it reads as the photograph being
washed out against the chrome. That is what left a gold strip under the nav —
measured at the bar's lower edge, `rgb(217,208,183)` at 1440 and
`rgb(215,207,182)` at 390, still climbing 170px later. Unfaded, the first row
below the bar is the picture itself: `rgb(179,180,168)` / `rgb(174,178,167)`,
within 3 channels of the same column 170px down, so the band under the chrome
is one continuous photograph rather than a fade with a floor. The header join
is therefore a picture edge, not a gold seam, exactly as on the inner pages —
the amber hairline lands on the photograph and marks the threshold.

The **expanded** card meets the bar the same way at desktop widths (its top
edge sits above the header's lower edge at 1440×900 and 1232×820). On a phone
it does not, and that is the mobile composition rather than a gap to close: the
card is centred in its own screen and dropped by `--hero-card-drop` to spend
the gold the fold decision strands beneath it, which leaves ~129px of
`gold-chrome` between the bar and the card's top edge at 390×844. Closing it
means moving the card, which is the growth ramp's geometry and the fold
decision behind it, not the poster's fade.

Dark ink cannot sit over the centre of this photograph, and this was measured
before it was built: the frame's middle is the dark ridge and pine, and even
the graded sky is a *saturated medium blue*, not a gold field — a centred
headline there needs a **40–64%** gold pool poured onto the exact patch the
eye lands on first, which is the wash-out the page exists to undo. So the
headline is anchored **high**, over the sky, where the frame is calmest and
lightest — chosen by measuring the frame, not by eye — and it is carried by
`.hero-sky-lift`: a top-anchored `gold-wash` fall, held across the headline
band and easing into the sky by mid-frame, so the words clear their floor
while the vista below keeps the photograph at full strength. Edge-anchored
from the top, it reads as morning light gathering in the sky, never a panel.
A thinned title pool (`gold-wash`, ~26%, heavily blurred) concentrates a
little more light on exactly where the words sit. Measured on the rendered
composite, worst case at glyph cores: headline **6.0** (desktop) / **6.2**
(mobile), both clear.

**The fall is held across the headline, not across the width.** It used to run
the full frame, so a headline occupying a quarter of the picture took the whole
sky down with it: measured in the poster's left ridge, well clear of the words,
the picture kept **35%** of the RMS contrast and an eighth of the saturation it
has with the layer off (0.037 against 0.105 at 1440; 0.017 against 0.078 at
390). A fade across now holds it over the headline's own width — 23.5rem
desktop, 14.25rem mobile — and releases it to zero either side, so the frame's
left and right sky are the photograph.

The ramp either side is **160px**, and that length is the whole of what keeps
this a lift. The intro's pool sits on a dust road already near the gold and
can afford a short ramp; this one sits on saturated blue, where a 56% gold edge
draws a line wherever it lands. Tried at 48px — the bound the intro's pool
answers to — the narrowed fall read as a **grey rectangle** behind the words,
which is the panel the edge-anchored full-width version existed to avoid.
Spending the same overlay over three times the distance makes the sides read
as haze thinning into the sky. The cost is the geometric bound: the layer's
measured footprint is **1.83×** the headline block's width at 1440 and 1.72× at
390, against the 1.25× every other lift on the page holds. On a phone that
bound is not reachable at all — a 227px headline in a 390px frame leaves 82px
of margin, and any ramp soft enough not to draw an edge reaches the frame's
sides first. Height lands inside it: **1.49×** at 1440.

The headline hands off to the expanded state by **fading and settling up on
the scroll clock**, not by splitting apart — the old 180vw slide whipped the
two lines off inside a single flick and read as an instant vanish on a phone.

This supersedes the earlier golden-glass reading, where the backdrop was the
photograph sunk to **18% under a warm `.hero-glass-veil`** so the first screen
read as a frosted-gold pane and the picture as a faint texture. That treatment
kept the gold leading at the cost of the photograph, which never read as a
place; the poster keeps both — the gold leads in the sky band, the place leads
below it. `.hero-glass-veil` and the 25% headline pool it describes are
retired.

**Large-text and body-text floors govern the lifts.** Every lift is tuned to
the *lowest* strength that clears the AA floor of the text it carries, and the
floor depends on the size of that text. A hero heading is large display type
(clamp to 4.5rem, 600 weight, always ≥ the 24px / 18.66px-bold large-text
threshold) and answers to **3.0:1**; a lede or body line answers to
**4.5:1**. Where a lift carries both — the inner-page heroes — it is **graded
vertically**: lighter across the heading rows (3.0), full behind the lede rows
(4.5), so the photograph reads strongest under the largest, most present
element and the small print still holds its floor. Neither line is landed on
its floor exactly: the heading is kept **comfortably above 3.0** (measured
3.7–3.9) because it falls on busy photographic detail rather than a flat
field, and the eye is the final judge — if a heading starts to fight the
picture, the lift on that page comes up regardless of the meter. The home
collapsed headline is large type on the same principle; its `.hero-sky-lift`
is presently tuned to the 4.5 reading (measured 5.6/6.0), so it has room to
lighten toward the 3.0 floor and let the vista read stronger — a change to
weigh, not yet made.

**The card's foot — the one join on this page that was a handover.** The
expanded hero used to stop on a ruled line: photograph, hairline and drop
shadow all ending in the same row (the gold frame of the day ended there too),
with the gold floor starting underneath it. Everywhere else on the page two grounds meet on one value and
the seam disappears; here a picture ended and a floor began, and the eye read
it as one system finishing and another starting. The card's base is now
**dissolved** instead, by three things working together:

- **A ramp** on the elements the expansion sizes — the card and the intro's
  lift — so the edge stays pinned to the card's own base through the whole
  growth instead of sliding up through the picture. Measured on the
  built page at successive expansion steps, the alpha-50% row holds at
  **216–218px** above the base while the card grows 573 → 765px, and at
  **141–142px** while it grows 486 → 600px on a phone: ±2px, which is
  rounding.
- **An arc**, a second mask nested inside the ramp on the frame itself, taking
  the picture higher at the centre than at the corners. So the foot is a
  shallow curve with the gold gathering up into the middle where the words
  sit, not a ruled edge softened. Measured depth: **220 / 321 / 215px**
  (left corner, centre, right corner) at 1440, **145 / 210 / 144px** at 390.
- **A pool** — the light the picture leaves on the ground. `amber-soft`
  cresting a little above the card's base where the dissolve is thinnest, gone
  again by the section's last row so the seam below still meets "What we do"
  on one `gold-anchor`. Measured on the composite, the ground at the crest is
  **ΔE76 10.7** (desktop) / **11.1** (mobile) warmer than the same page
  renders without it.

Both masks **mask rather than paint**, for the reason `photo-edge-dissolve`
does: the ground here is the living atmosphere under the field's own ramp, so
a flat repaint would land a shade off whatever is really behind and draw back
the seam it was meant to erase. Masking resolves to the real ground, which can
never differ from itself. Measured through the whole handoff on the built page,
worst adjacent row delta **2.6** (desktop) / **2.0** (mobile) — the same order
as every seam on the page that already reads as continuous. Nothing about this
is scroll-linked: the masks are fixed lengths on the card's own box and the
pool is a static layer, so the handoff costs one clock the page already keeps
and none of its own. Before the card grows the whole thing is invisible —
the pool sits under the backdrop photograph and the masks have nothing but
gold to act on — measured **zero differing pixels** in the collapsed opening.

**The expanded card carries its intro inside the photograph.** Once the card
opens, the lede and the Contact Us button sit **low in the frame over the
photograph itself**, not on a gold band beneath it — the old band read as a
card stuck under a picture. A local `.hero-photo-lift` carries the dark ink:
a soft-edged `gold-wash` pool anchored to the block of type. It is the same
local-lightening technique the lamp CTA uses, applied to a photograph rather
than the dark ground — a **lift, not a veil**, so the rest of the frame stays
at full photographic strength. Ink text throughout, on every slide.

**The lift is anchored to the block, not to the card, and that is the
difference between a photograph and a backdrop.** It used to be a band across
the card's whole lower half — `inset-x-0 bottom-0 h-[56%]`, 1440×428 at 1440
and 390×336 at 390, against a text block of 736×137 and 358×144. Every pixel of
that surplus fell on the walkers in the lower half of the picture, and it did
not fall alone: the expansion wash held a **0.15** `gold-wash` veil over the
entire frame for as long as the card was open. Measured in the card's
lower-left, clear of the foot dissolve and a long way from any text:

| Stage, hero-1 at 1440 | RMS contrast | mean luminance | black point |
|---|---|---|---|
| Ungraded original | 1.311 | 0.118 | 0.0033 |
| Graded master (resinHour) | 1.151 | 0.170 | 0.0032 |
| Rendered, every overlay off | 1.054 | 0.169 | 0.0073 |
| Rendered as it shipped | **0.592** | 0.279 | **0.0764** |

The grade and the encoder together cost 20% of the ceiling and are not in
question. The overlays cost the remaining **44%**, and they lifted the black
point **tenfold** — which is exactly what "the figures have gone" means: not a
softer picture but a shadow range flattened onto the gold.

So the wash now runs to **zero** by full expansion instead of bottoming out at
0.15 — the headline has finished its handoff by progress 0.35 and there is
nothing left for it to carry — and the pool is given the block's own box. The
statement's own track sets that box, so it tracks the words at every viewport
by construction and lands inside **1.25×** their width and **1.5×** their
height at both viewports. Its falloff is a fade across multiplied by a fade
down, nested rather than composited, for the reason `.ground-lift`'s is.

**The ramp lengths are declared apart from the box, and that is what keeps it a
pool rather than a panel.** Bleed alone holds full strength over the whole block
and spends its softness only outside it, which lands a soft-edged rectangle on
the picture. The block is a *track*, not an ink extent — the statement's two
rendered lines run 574px inside a 736px track — so the ramps start inboard of
the box and the held region is the words themselves: the same total footprint,
three times the softness.

Measured after, same region and same crop: RMS **1.082** (from 0.592, **+83%**)
at 1440 and **0.947** (from 0.623, **+52%**) at 390 — **82.5%** and **88.1%** of
the ungraded ceiling, against 45.1% and 57.9% before, and level with the
overlays-off reading, which is to say the photograph there now carries no
overlay at all. The black point returns to **0.0055** / 0.0024. Across the
lower-left quadrant *including* the untouched foot dissolve: 0.373 → 0.588 and
0.415 → 0.583.

The text is not paid for by any of it. At the statement's glyph cores on the
rendered composite: **8.33** (desktop, from 7.52) / **6.04** (mobile, from
5.93); the button's label on its own `amber-fill` is unchanged at **4.89**. The
pool holds 60% on desktop and 66% on a phone — a phone crops the same
photograph tighter and lands the statement over busier ground, where the
desktop alpha reads 2.8 points of ratio lower.

The three intro elements rise **56px** into place — the rule at 0ms, the
statement at 100 and the button at 300, each over 700ms. They used to travel
24px, which finished before the eye had picked up that anything was moving.
The band is clipped to the card, so the first part of each rise now plays
inside the dissolve and the words surface out of the foot rather than
appearing on a fixed lower edge.

Rules, in order of precedence:

- **Static only, with one named exception.** Every layer is painted once and
  never animated, never scroll-linked, never repainted — atmosphere is free on
  the GPU and needs no reduced-motion variant. The single exception is the
  travelling ground below, which earns it by being the one place the page has
  to express *depth* rather than light, and which does carry a reduced-motion
  variant.
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

## The travelling ground

**"What we do" stands on photographic ground, not on flat gold.** The hero's
card dissolves its picture into the gold at its foot; below the seam the
section used to be colour and nothing else, so the eye read one world ending
and a flat field beginning. `hero-2.jpg` — the tree-lined road from the same
walk as the hero slides, the only photograph in the graded set that is
landscape, has real depth and carries no readable faces — now sits behind the
block and moves at a fraction of the page's rate. Depth is **0.30** on desktop
and **0.18** on a phone, measured over the block's own traversal rather than
the document's, and centred on it, so the plate's travel is symmetric.

**Nothing about it captures the scroll.** There is no pin, no clamp, no
delay, no progression gated on an animation. A passive listener coalesces into
one `requestAnimationFrame`, and that frame writes a single transform read from
`window.scrollY`. Layout is measured on resize, never per frame. Under
`prefers-reduced-motion` the effect never arms: the plate renders untransformed,
which is the mid-traversal frame, and the lift is unchanged.

**The mask belongs to the block, the plate moves inside it.** That is what
makes the layer's own edge unreachable: what fades is always the same two rows
of the section, over the same **72px / 150px** the gold field's own edge ramp
takes, so the ground arriving and the anchor edge falling are one event rather
than two ramps crossing. The plate is over-sized 280px (mobile) / 560px
(desktop) vertically and 96px horizontally — the horizontal figure set by the
blur's own soft edge, not by the travel. Measured at thirteen viewports from
320×480 to 2560×1440, twenty-seven scroll positions each: minimum plate
overhang **96px**, never exposed. Both seams are untouched — hero → section and
ground → first panel measure **3** and **2** at both viewports, identical with
the layer present and absent.

**Blur is priced by area, not by radius, and that decided the construction.**
At 1440 this plate is ~1584×1942. Applied at full size, `blur(16px)` put **66
of 145 frames over 24ms** with a 50ms p95 through the section; `blur(4px)` still
put 54 there. Blurring a quarter-size box and scaling it back by 4 gives the
identical 16px result off a sixteenth of the pixels: **10 of 180 frames**,
against **9 of 178** for the same page with the layer removed. The globe, which
shares this zone, is no longer the cost it once was — measured with and without
its canvas, the difference through the section is inside the noise.

**The lift's falloff is separable, and that is measured rather than
stylistic.** A radial's alpha at the *corners* of a wide block of type is far
below its centre: over the 606px lead column, an ellipse sized to the block
delivered its full strength at the middle and about **0.15** at the ends of the
lines — which is exactly where the contrast failed. Sizing the ellipse until
the corners held would have taken it past 2000px across, which is the
full-frame veil this may never be. A fade across multiplied by a fade down
holds the declared alpha over the whole block and spends its softness in the
margin. The two masks multiply by nesting rather than by `mask-composite`, so
no browser can fall back to one axis and draw a hard edge on the other.

**The margin is where the softness lives, so its length is what decides how
much text-free ground the pool lightens.** At 96px each way the ledger's pool
ran 1485×390 for a block of 1293×198 and reached a third of the way up the
section either side of it. The held region is the block whatever the bleed is —
the fade length *is* the bleed — so shortening the ramps costs the type nothing
and gives the photograph back the margins: **72px** sideways and **44px**
vertically on desktop, 44px both ways on a phone (the flush-top variant keeps
its 48px, which is tuned to the lead's own start). The pools then measure
750×277 for the 606×189 type column and 1437×286 for the ledger's 1293×198, both
inside 1.25× wide and 1.5× tall. Measured across the section's whole traversal,
twenty scroll positions, resting frames only, before and against after: heading
**9.25/9.32**, lead **5.08/5.16**, numerals **9.15/9.24**, labels **5.11/5.12** —
identical to the digit on both viewports, which is the point.

The pool is anchored to the **block**, not the section: the content column caps
at 84rem while the viewport does not, so a pool placed at a fraction of the
viewport sits under the heading at 1440 and nine points of screen width off it
at 2560. Below `md` the heading sits on the section's own top row and the
section clips, so that pool sits flush and spends its fade downward — bleeding
upward past that edge cut the fade exactly on the hero seam and took the join
from 3 to **18**.

**Strength was set by measurement, in the steps the brief allows.** The pool
started at 0.62 and missed: the lead measured 4.28 against its 4.5 floor. It
sits at **0.74** now, still under the 0.78 ceiling, and the plate carries a
black-point lift (`contrast(0.72)`) because raising the pool alone bought only
+0.2 of ratio across that whole range — at 20% opacity the photograph's
mid-tones barely move the gold, but its deepest shadows still pulled the ground
under 17px `ink-soft`, which starts with only 5.62 on bare gold and has nothing
to give.

**This plate's strength is capped by what it is, not by the pools over it.**
Measured in the section's right third with the globe and every text box carved
out — 150k pixels of pure ground at 1440 — the layer renders at **7%** of what
the ungraded `hero-2` measures through nothing (RMS 0.144 against 2.070), and
turning the pools off entirely moves it to 0.149. The gap is the
environment-photograph rule itself: 20% opacity, 16px of blur, `saturate(0.45)`
and the black-point lift, which are what let a photograph sit under body copy on
gold at all. So the travelling ground is the one photographic surface on the
page that cannot be brought toward full strength — the ceiling is the rule, and
the rule is what the lead's 4.5 rests on. What the pools *can* give back is the
margin around the type, and they now do.

Measured at glyph cores on the rendered composite, worst case swept across the
section's whole traversal at twenty scroll positions, both viewports:

| Element | Token | Floor | Desktop | Mobile |
|---|---|---|---|---|
| "What we do" heading | `ink` | 3.0 | **7.46** | **7.55** |
| Lead paragraph | `ink-soft` | 4.5 | **4.52** | **4.60** |
| Stat numerals | `ink` | 3.0 | **7.40–7.47** | **7.45–7.47** |
| Stat labels | `ink-soft` | 4.5 | **4.60–4.66** | **4.57–4.61** |

The ground costs **no image bytes**: the plate resolves to the same variant the
hero slideshow has already fetched for its third slide (`hero-2-1366.avif` at
390, `hero-2-1536.avif` at 1440) — one request serves both. The whole layer
adds **~1.1 KB gzipped**: +363 B of HTML, +464 B of CSS, ~+300 B of route JS,
with First Load JS unchanged.

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
- Square a card's corners when its edge has to cross the fixed header. A round
  corner interrupted by the chrome reads as a cut arc; a straight edge passing
  under the bar reads as nothing at all. This is why the expanded hero card is
  square — see the card spec above.
- Drop an outline entirely when a card goes full-bleed, rather than keeping the
  sides it can still draw. An outline earns its place by enclosing; with no
  gutters left the verticals sit on the window's own first and last column and
  read as an artifact of the viewport. Two thirds of a frame is not a subtler
  frame — see the expanded hero card.

**Don't**

- Don't give a **rounded** outline to a card whose edge passes under the fixed
  header. The expanded hero card is centered in the viewport, so on a short
  desktop window its top edge and both top corners sit behind the chrome. Any
  line it carries works only because the card is square: a straight edge simply
  vanishes under the bar, where an arc would re-emerge mid-curve below the
  chrome and read as broken.
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
