# ArtiCYa Design System — "Resin & Pine"

> **STRIP — read this before anything below it.** The site was taken back to
> photography, type and one accent. What follows is still the palette, the
> contrast method and the grounds model, but four passages of it describe
> things that no longer exist:
>
> - **Every lift and every pool is deleted.** `.hero-sky-lift`,
>   `.hero-photo-lift`, `.hero-foot-pool`, `.ground-lift`, `.panel-pane`,
>   `.gold-pool` and the inner-page hero lift are gone, with the hero title
>   pool and the hint pill's fill. A local, soft-edged shape sitting behind a
>   block of type is a panel however long its ramp is, and the page now has
>   none. What carries text over a photograph is **`.plate-shade`**: one
>   full-width, top-to-bottom darkening built into the plate, tuned per use
>   through `--shade-top` / `--shade-mid` / `--shade-bottom` and the two mid
>   stops. It has no horizontal extent, so it can only ever read as a darker
>   photograph.
> - **The chrome is not a bar.** Header and footer carry no fill, no blur and
>   no amber hairline; the nav sits on the picture in `ink`, with `amber` on
>   the active item. What carries the labels is **`.chrome-shade`** — the same
>   construction pinned to the top of the *window* rather than to a plate,
>   because a gradient inside a photograph scrolls away from a fixed bar and
>   below the inner heroes there is no photograph at all. It grows while the
>   mobile menu is open. The inner-page hero's own bottom hairline went with
>   the chrome's.
> - **Four components are gone**: the dotted globe and its land data,
>   the lamp CTA (the closing section's frozen text now stands as plain type on
>   the plate), the resin embers, and the living atmosphere with its pointer
>   parallax and its two drifting glow layers. (The **Earth** of 2026-09-09
>   is not that globe: a lit planet beside "What we do", not a dot diagram —
>   see **The Earth** at the end of this document.) `.film-grain` is deleted
>   site-wide. The single-light-source thread therefore runs from the gains
>   trail and stops there; the trail's rail now dissolves at both ends.
> - **The type scale below is superseded** by the display ramp in **Typography
>   — the strip scale**.
>
> Everything else holds: the tokens, the stage and its plates, the gold field
> on the hero and the inner pages, the amber accent marks, the inset-ring
> frames and cards, the clock-based entrances, and the measurement method
> (glyph cores on the rendered composite, worst case swept across a whole
> traversal, both viewports).

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

> **DIRECTION CHANGE — the gold world is now a dark one.** The token *names*
> below are unchanged and still name the same roles; their **values** were
> swapped for the pine-dark set in the table that follows, site-wide. Nothing
> structural moved with them: no layout, no geometry, no timing, no opacity
> ramp, and every document height is identical to the pixel at 1440×900 and
> 390×844. A later mechanical pass renames the tokens.
>
> Everywhere below — and everywhere else in this document — that a passage
> says gold, cream, warm ground, *lift* or *lightening*, read it as naming
> the mechanism, not the direction: a lift is still a local, soft-edged,
> block-anchored pool spending its softness in the margin, but it now sinks
> the photograph toward the floor instead of raising it toward paper. The
> hex values in the prose and in the measured-contrast tables are stale.
>
> | Token | Was | Now |
> |---|---|---|
> | `gold-wash` | `#EDE2C8` | `#141C16` — deep pine, the floor |
> | `gold-anchor` | `#E9D9B4` | `#0E1510` — deepest, where photographs dissolve to |
> | `gold-chrome` | `#EFE4CB` | `#101811` — nav and footer |
> | `gold-card` | `#EFE1C7` | `#1A2419` — containers |
> | `ink` | `#2A3329` | `#EDE2C8` — primary text, now cream |
> | `ink-soft` | `#52594F` | `#B9B4A2` — secondary text |
> | `resin-deep` | `#845110` | `#D69A47` — lifted to read on dark |
> | `bark` | `#5C4B32` | `#C9BB9E` — resting nav label, lifted with it |
> | `pine` | `#285C3C` | `#7FA98A` — structural marks, lifted with it |
> | `hairline` | `rgba(42,51,41,.14)` | `rgba(237,226,200,.14)` — the same 14%, inverted |
> | `amber` · `amber-fill` · `amber-lit` · `amber-edge` · `amber-soft` | — | unchanged |
>
> `button-ink` (`#221A0C`) is new and is the one dark string left on the site:
> cream `ink` measures 2.06 on `amber-fill`, so the filled control keeps a dark
> label. The fill is a light object whatever the ground behind it is.
>
> Measured on the rendered composite at glyph cores, worst case swept across
> each page's whole traversal, both viewports: large text **3.12–4.51** against
> a 3.0 floor; body text **4.64–4.88** against 4.5 — with one exception, the
> offer panels' prose, which dipped to **3.06** (desktop) / **3.69** (mobile)
> during the ~18% of the pin where the reading wash was still at its 0.6 floor.
> That dip was not the swap's: measured on the pre-swap build at the same
> frames it was **3.41** / **3.94**, already under AA. It is now closed — the
> wash is gone with the rest of the panels' grounds, and the prose measures
> **8.50–8.75** / **9.55–9.69** across the whole pin (see **The stage**). The
> home figures in this passage predate the stage; the page's own worst
> readings are the ones tabulated there.

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

> **SUPERSEDED BELOW THE HOME HERO — the sections lost their grounds.** The
> home page below the hero now stands on one fixed photographic stage (see
> **The stage**) and no section under it paints a background at all. There are
> therefore no section edges on that stretch, and the whole apparatus of shared
> edges described in this passage — `.gold-field` on every section, the anchor
> both sides of a seam, `.gold-field-chrome-bottom`, `.gold-field-open-top` on
> the first panel — no longer applies there. What survives, and is still exactly
> as described: the classes themselves, which the **hero** and the **inner
> pages** still carry, and the reasoning, which the stage's own top and bottom
> darkening now discharges for every row of the page at once instead of for two
> named boundaries. The hero additionally takes `.gold-field-open-bottom`: below
> it there is no second edge left to meet.

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
another field edge, paints nothing: `.gold-field-open-top`, and downward
`.gold-field-open-bottom`. The anchor exists
so that two edges can meet on one value, and where there is no second edge it
has nothing to meet — it lands a step deeper than the ground beside it and
draws a full-width line across the page, and being opaque it also covers
whatever the row above it shows. On the built page the one edge still doing
this is the **hero's bottom**, which opens onto the stage.

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

### The strip scale

This supersedes the step table below it. Five rules, and they are floors:

| Step | Value | Where |
|---|---|---|
| Hero headline | `clamp(3.4rem, 11vw, 10rem)` / 0.94 | The home hero h1 and every inner-page hero h1 — 158.4px at 1440, 54.4px at 390 |
| Section heading | `clamp(2.3rem, 6vw, 5rem)` / 0.94 | "What we do", "What you gain", "Get in touch", the offer-panel titles, the closing line — 80 / 36.8px |
| Sub-heading | `clamp(1.9rem, 3.6vw, 3rem)` | The FAQ group headings and the gains trail items — 48 / 30.4px |
| Body | `clamp(17px, calc(16px + 100vw / 480), 20px)` / 1.5, `max-width: 44ch` | **Every** paragraph on the site, the FAQ questions and answers, the Contact channel values — 20px at 1920, 19px at 1440, 17px below 480. There is no second reading size |
| Tracking | `-0.025em` | All display type, the wordmark and the stat numerals included |

**One reading size, and it is the only one on the site.** There were two. The
body step ran 16px on a phone and 18.56px from 1428 up; the lead step put
every paragraph that opens a section on 22px at 1440 and 24px at 1920 and left
the closing statements, the offer panels and the FAQ answers where they were.
Read down a page — and About is the plain case, three scenes at 22 and a
closing paragraph at 18.56 — the two register as a mistake rather than as a
hierarchy, because the paragraphs are doing the same job. A lead is first in
its column and carries a rule above it; that is where its emphasis comes from,
and it does not need points as well.

**The ramp.** `clamp(17px, calc(16px + 100vw / 480), 20px)`: 1px per 480px of
window, which puts both reference viewports on exact integers — 19px at 1440,
20px at 1920 — and a 17px floor below 480, one point up from the phone's old
16 and one point clear of the 16 that is the floor for reading at all. Line
height is 1.5 at every width; the 1.66 the body step carried was tuned for
16px and reads loose at 19. `.type-body` in `app/globals.css` is the single
declaration site, which is why no block carries `max-w-[44ch]`,
`text-[clamp(...)]` or `leading-[1.66]` any more, and why `.type-lead` is
gone rather than aliased.

**Measure stays 44ch**, and the number is not the character count. `ch` is the
zero's advance and Instrument Sans sets it at 0.666em, so a track in `ch` runs
about half again as many rendered characters. Measured on the built page, 44ch
lands the longest scanned line at **35–49 characters at 390, 52–67 at 1440 and
55–67 at 1920** — inside the 70 a prose block gets, with the Contact lede and
the third offer panel the worst at 67. A wider cap was considered and
measured: 62ch would put every block near **93 characters**, which the measure
rule does not allow.

**Every paragraph on the site, per breakpoint, after: 17 / 19 / 20 and
nothing else.** Verified by re-running the inventory that found the two steps
— 23 blocks across the four routes, every row identical at each width.

**What moved.** The document heights barely: home **3915 → 3909** at 390,
**5248 → 5244** at 1440, **6202 → 6200** at 1920; About and Contact identical
at all three; FAQ **2272 → 2296** at 390 and **2501 → 2508** at 1920, its 1440
height unchanged. Every stage is still exactly 1.00 vp. The two sections over
1.2 vp are the ones that were — the wrapper that holds the clearing's three
stages, and the FAQ's accordion list at 2.23 vp on a phone — and neither moved
at 1440.

**Contrast, swept per element at 20px over each page's whole traversal and
refined at 5px around every worst stop, judged at the glyph's own ink.** Both
viewports, all four routes, 81 elements: nothing under its floor except the
one element that was already under it. About's worst prose block is **4.99**
at 1440 and **5.11** at 390, Contact's **5.34** and **5.12**, the FAQ's
**4.73** and **4.94**, home's — the clearing's lead — **5.00** and above.

The exception is the home hero's statement on its way off the screen, and it
is the transit recorded below. Bounded to the hero's own travel and swept on
both builds, it reads **2.14 before and 2.42 after** at 1440: the one ramp
lifts it, because a shorter block clears the open photograph sooner. It is
still far under the 4.5 floor, it was under it before this change, and the fix
remains the card's foot ramp rather than the type.

**The clearing's visual weight went the other way, and the answer was the
disc.** Block area × mean ink contrast against disc area × mean disc
contrast: **1.705 → 1.135 at 1440** and **1.432 → 0.891 at 1920**. Under 1.0
the Earth is the first read, and at 1920 it was again — the reading the lead
step had been introduced to fix. The block's mean ink contrast never moved
(8.04 → 7.97 and 7.99 → 8.02); what fell was its area, 71296 → 47902 px² and
85120 → 52740 px². Points on the paragraph are not available — one size
everywhere is the rule now — so the disc came down instead, and only where
the ratio was short: 604.8 → **559px** at 1920, which reads **1.052**. 1440
keeps its 504px box and its **1.136**. See the box table above for what the
cap is written against and what it leaves alone.

The old **Hero statement** step is retired with the rest: one sentence in the
display face at its own size and its own weight was a step the ramp did not
need, and the home hero's tagline is body copy now. The **Stat numeral** keeps
its own clamp — it is the one monumental role that is neither a heading nor
prose — and takes the tracking with everything else.

The measure rule is unchanged in intent and enforced by a declaration rather
than by per-block tracks: `44ch` lands every prose block inside the
70-character ceiling at every viewport.

| Step | Size / line height | Font | Use |
|---|---|---|---|
| Display | `clamp(2.75rem, 6vw, 4.5rem)` / 1.05, −0.02em | Bricolage 600 | Page hero headline only |
| H2 | `clamp(2rem, 4vw, 3rem)` / 1.1, −0.01em | Bricolage 600 | Section headings, on every page: home "What we do" / "What you gain", home offer-panel titles, Contact "Get in touch", the FAQ question-group headings |
| FAQ question | Body / 1.45 | Instrument Sans 600 | The FAQ accordion questions — reading size, body face, separated from the answer by weight, colour and space |
| Stat numeral | `clamp(3.25rem, 8vw, 6.5rem)` / 1 desktop · `2.75rem` / 1 mobile | Bricolage 600 | Home stats only — `resin`, glowing. Monumental centered columns on desktop; compact ledger rows on mobile so all three share one screen |
| Showpiece | `clamp(2.25rem, 5vw, 3.75rem)` / 1.15, −0.01em | Bricolage 600 | One key line per page max — on the built site, the home closing line and nothing else |
| Trail item | `clamp(1.5rem, 2.5vw, 2.25rem)` / 1.2 | Bricolage 600 | Home gains sequence |
| Hero statement | `0.9375rem` mobile · `1.25rem` desktop / 1.35, −0.01em | Bricolage 500 | Home hero mission line only — a calm lead under the headline: **exactly 2 lines on desktop, 3 on mobile** |
| Body | `1rem` / 1.7 | Instrument Sans 400 | Default copy; the Contact channel values. The Lede step that stood beside it is retired — see the strip scale above |
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
  Courses right — and each block stands on a defocused copy of the stage's own
  plate, confined to the block (see **The stage**; the cream reading fade that
  used to run across the panel from the text's side is retired with the
  panels' own photographs). Held inside the 72rem column,
  a 576px block starts 400px in on a 1920 screen and reads as floating toward
  the middle instead of anchored to its edge. So these panels inset from the
  **viewport** instead, on a gutter that grows with the screen
  (`.offer-panel-inset`: 1rem, 4rem at `md`, then
  `clamp(5rem, 10.42vw - 60px, 10rem)` at `xl`) — measured 90px at 1440 and
  140px at 1920, clamped at both ends so a laptop keeps a frame and an
  ultrawide never drifts the block back inward. The inner side stays open:
  774px of gap at 1440, 1204px at 1920. Mobile keeps the stacked layout
  anchored to the bottom wash — a narrow screen cannot afford side placement.
  Moving the text outboard keeps it over the middle of its own pane rather
  than at the end of a fade: worst case swept across each panel's pinned
  range, **8.50** (`ink`, prose) against a 4.5 floor.
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
  reason: the fade has to complete inside the shorter section. (That ramp is
  now the hero's and the inner pages' — the home sections below the hero carry
  no field at all.)

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
  the taller globe column added a further stretch of it — with 96px of padding
  on top, a full empty gold band separated the card from the heading and the
  entrance played out where nobody was looking. There is still no top padding,
  and the self-centering is gone too (see **The Earth**, the declared rows):
  the rule now engages **162px** under the card's foot at 1440×900, where the
  centring left it at 232, so the sunrise starts while the card is still
  leaving the viewport — the two moments overlap instead of being separated by
  dead gold.

  Reverting also removed the reason for the mobile open-edge classes: the
  hero's bottom edge and the section's top edge meet again exactly, at every
  viewport, so both keep the anchor and neither paints nothing. Measured at
  that join after the revert: worst row-delta **2.37**, and its worst row sits
  36px off the boundary — gradient stepping, not an edge.
- **Ground is decided per page, not per section.**
  - **Home** is one continuous world from the header to the footer, and below
    the hero that world is **a photograph**: the stage carries the ground and
    no section carries any (see **The stage**). Above it the hero keeps its own
    field, `gold-chrome` holds the two bars, and the living atmosphere's amber
    pools are what warms the floor wherever the stage is quiet. No section may
    interrupt the run and none may read as neutral. Depth comes from the
    plates, the pools and the resin light — never from switching ground under a
    section.
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

**Two fixed states and a boundary between them — never a value interpolated
from both.** Interpolating one state's numbers toward another's manufactures a
third that belongs to neither, and the travel *holds* it: the hero's six
darkening stops read 62.97 / 40.97 / 51.05 / 15.01 / 49.98 at progress 0.6, one
flat veil over the whole picture for a fifth of the expansion. What crosses
between two grounds is a **boundary** — 40% of the window deep, with no line in
it to trace — so every row of every frame carries one state or the other and
neither is ever diluted. This is the polarised ledger (`REFERENCE-LANGUAGE.md`
§F1) stated as a mechanism rather than as a table of values.

**A scaling frame either reaches full window coverage or does not scale at
all.** Partial coverage makes the frame an object sitting on other objects. At
1.39 the About wall's centre tile covered 38.6% of the window: large enough to
overlap the six tiles around it, small enough that they still showed past it,
so it read as a hard-edged rectangle laid on other rectangles — which is the
collage this site rejected at the start. **This is the same polarisation as
plate strength, at the level of coverage**, and it makes the amplitude a
threshold rather than a taste question: the slot decides the number, and the
tighter of the two axes decides it. A 50vw × 40vh slot needs 2.5 and the height
is what sets it.

Two consequences follow, and both bit before the rule was written down.

- **A factor that cannot be paid for at ratio ≤ 1.0 must not be spent at all.**
  Reading the amplitude off the source — the largest factor a 2048px master can
  cover — lands in the forbidden band by construction. The answer is a
  photograph with the pixels, or no scale.
- **Reaching coverage is not holding it.** At exactly the threshold the window
  is covered on one frame and uncovered on the next, which is a coincidence
  rather than a beat. 2.60 crosses at three quarters of the eased rise and
  holds full coverage to the release.

**Encoder quality is chosen against the largest size a frame is ever *painted*,
not the largest rung it ships.** A scaling frame is the one place the two come
apart, and it is this rule's own consequence: the amplitude that buys coverage
also magnifies whatever the encoder left in the file. Density does not protect
it, because the density argument prices a rung by image pixels per CSS pixel at
rest, and a scaled frame is not at rest.

The measurement is the About wall's centre tile, the site's only placement
scaled past the window. Its rung is wide enough that the ordinary reasoning
said "dense, therefore cheap" — the same reasoning that took the 2880 full-bleed
rung to q50 and holds there. On this rung it is wrong: at 2.60× the dark canopy
visibly flattens at q50 where q62 still holds its leaf structure, and its
departure from the graded reference goes 5.95 → 8.34 on the test the two
full-bleed placements pass at 7.33 → 9.92 and 10.99 → 11.76. So the scaled rung
keeps q62 while the wider full-bleed rung below it takes q50 — a lower quality
on a *larger* file, which only reads as sane once quality is indexed to painted
size rather than to shipped width.

Stated as the check: before lowering a rung's quality, resolve every placement
that fetches it and multiply by any scale that placement applies. The number
that governs is that product.

**Type may sit inside the photograph's depth, but never inside a layer whose
mask or clip boundary travels. Where a boundary travels, type composites against
it, not within it. Verify by rendering the type at the boundary's midpoint, not
only at the ends of its travel.**

A boundary travels in two ways and only one of them looks like motion. The hero
carries both, and it was the still one that broke.

*The moving boundary is the easy case, and it is already clean.* §2.6's shade
crossing runs progress **0.60 → 1.00** on the plate wipe's own curve,
`cubic-bezier(0.65, 0, 0.35, 1)`, and the headline block — descending at full
ink and receding to 0.85 — steps to opacity 0 at exactly 0.60, on a frame
where it is already behind the land (headline and label ink 0 px at every
p ≥ 0.60, both heights). The two clocks meet on one number, and that is a
requirement rather than a coincidence: **if the headline's exit is ever
lengthened, the crossing's start moves with it.** (It ran 0.35 → 0.85 until
`9c851e9`.)

**The opening's range and its settle, as they stand at 2026-09-07.** The
wheel gain is 0.0025, so the poster opens in **400 wheel units**; the touch
gains (0.005 / 0.008, 200 finger px) and every box ramp and threshold are
frozen. The settle completes an opening the input has left mid-way: it starts
after an idle read against the hand's own cadence (1.5 × the last gap,
floored at 120 ms, capped at 600), or at once on a trackpad's momentum tail —
four events ≤ 20 ms apart with strictly shrinking deltas — or on touchend. It
runs to 1 from p ≥ 0.20 over 400 + 500·(1 − p) ms, or back to 0 over 300 ms,
on `cubic-bezier(0.22, 1, 0.36, 1)`; the target takes the sign of the last
input (negative settles back unless p ≥ 0.80). Any input that is not the tail
coasting cancels it, and no new settle starts for 250 ms after a cancel. A
deliberate slow scroll — deltaY 1 every 80 ms, or a notch every 200–300 ms —
is never taken over.

**The way back into the opening is a close on a clock — 2026-09-09.** Past
the release at p = 1 the *driver* does not re-engage: its wheel/touch capture
is not re-armed and no delta of the reader's is ever read into progress at the
top of the page. What can happen there is a close, and it is a different
machine.

**There is no threshold, and no speed a hand can scroll up at the top and not
close the hero.** That is the owner's decision, taken on the third report of
the same thing: scrolling back up from the lede stopped at "A youth
organization…" on the laptop and on the phone. At scrollY 0 and page scale 1,
any upward input — wheel `deltaY < 0`, or a finger moving down the glass —
that adds up to **8 px** (a jitter floor, nothing a reader would call a
scroll) runs progress **1 → 0 over 700 ms** on `cubic-bezier(0.22, 1, 0.36,
1)`, through the same `applyProgress` path the driver uses, so the ramps, the
thresholds, the crossing and the poster/ridge register are read exactly as
they are on the way up. It starts exactly once; no partial state is ever held:
the close either completes or is cancelled, and **a downward input during it
cancels it and settles back to 1 on the existing settle** (`settleDuration(p,
1)`, the same curve). From the closed state the driver takes over from 0 and
the opening plays as it does on a fresh load, because this effect is gone by
then. While a close runs the page is pinned at 0, exactly as it is during the
opening.

**Arming is the same rule, read away from the top.** An upward gesture past
the 8 px that is made anywhere on the page arms the close, wheel or finger
alike; every further upward event and every frame the page climbs refreshes
the arm for 600 ms; the frame the page reaches 0 fires it, whether or not a
single input event is delivered there; and the arm dies once the page has
stopped climbing for 600 ms, so a reader who comes to rest short of the top
and reads on never meets one. Any downward input drops the arm and the sum.
A touch move that repeats the finger's row is nothing, not a reversal — it used
to zero the sum, which un-armed a flick on its way out.

What this replaces (`7d22d83` / `be755a8`): **60 wheel px inside a 400 ms
window, or 40 px of finger, and a "slow hand does nothing" rule** built on
the window. Reproduced as the owner makes the gestures, on the build before
this one:

| gesture, as the owner makes it | before | why | after |
|---|---|---|---|
| (a) trackpad: down 900, then up at −3 every 30 ms through the top and 30 events past it | **open** | 29 events at the top summed 87 px over 1.97 s, but no 400 ms window ever held 60 — a slow hand delivers 39 | closes 92 ms after the top |
| (b) trackpad: brisk up with a shrinking tail that lands the page on 0 with 4 px left in it | **open** | 2 events at the top summed 2 px; a wheel gesture was never armed, only a finger's | closes on arrival |
| (c) touch: flick to the top under momentum, then a second slow 60 px swipe at the top | closes (arm of `be755a8`) | — | closes on arrival |
| (d) touch: one slow drag from scrollY 200 through 0 | closes | — | closes on arrival |

(c) and (d) already closed in Chromium's emulation, so the phone's failure is
not reproduced there; what the decision removes on the phone is the 40 px a
short second swipe has to find at the top, the zero-delta reset, and the arm
being dropped by a finger landing during the run-out. §7 stands: the phone is
confirmed on the phone.

Measured at 390×664 and 1440×900, sampled every frame on three channels that
are each monotone in the opening by construction — the card's box, the poster's
own strength, and the headline block's descent. Sign flips in each channel's
difference sequence, and the state transitions, against the fresh-load opening
as the control:

| series (at scrollY 0 unless stated) | card | poster | headline | hero-open | showContent | register |
|---|---|---|---|---|---|---|
| CONTROL: opening, fresh load | 500px / 0 flips | 1.00 / 0 | 391px / 0 | ×1 | ×1 | 0.000px |
| −1 every 80 ms ×120 — **closes, by decision** | 500px / 0 | 1.00 / 0 | 391px / 0 | ×1 | ×1 | 0.000px |
| −4 every 200 ms ×40 — closes | 500px / 0 | 1.00 / 0 | 391px / 0 | ×1 | ×1 | 0.000px |
| −8 once — the floor exactly, closes | 500px / 0 | 1.00 / 0 | 391px / 0 | ×1 | ×1 | 0.000px |
| −4 once — under the floor, nothing | 0 / 0 | 0 / 0 | 0 / 0 | ×0 | ×0 | 0.000px |
| −1 every 80 ms from scrollY 120 — climbs, closes on arrival | 500px / 0 | 1.00 / 0 | 391px / 0 | ×1 | ×1 | 0.000px |
| −40 every 16 ms ×8 (flick) | 500px / 0 | 1.00 / 0 | 391px / 0 | ×1 | ×1 | 0.000px |
| −120 once (one notch) | 500px / 0 | 1.00 / 0 | 391px / 0 | ×1 | ×1 | 0.000px |
| 200px touch flick down | 500px / 0 | 1.00 / 0 | 391px / 0 | ×1 | ×1 | 0.000px |
| re-open, +1 every 80 ms ×500 | 500px / 0 | 1.00 / 0 | 391px / 0 | ×1 | ×1 | 0.000px |
| re-open, +4 every 200 ms ×120 | 500px / 0 | 1.00 / 0 | 391px / 0 | ×1 | ×1 | 0.000px |
| re-open, 200px touch flick up | 500px / 0 | 1.00 / 0 | 391px / 0 | ×1 | ×1 | 0.000px |
| flick down, then up at 200 ms | 500px / **1** | 1.00 / **1** | 391px / **1** | ×2 | ×2 | 0.000px |

390×664 gives the same table at its own spans (264px card, 154.22px headline).
The headline's span is 391px on the desktop rather than the 330 of the earlier
table because the poster dropped to 27% the same day and the descent is
measured off the same variable. The one flip in the last row is the cancel,
which is what a cancel is. The poster and its land copy hold **0.000 px of
register and 0.000 of opacity difference on every frame of every series**,
and the page never leaves scrollY 0 while a close is running. `hero-open` and
`showContent` change on one commit together.

Chromium's mobile emulation divides a wheel delta by the device ratio, so the
390 series are sent pre-multiplied by 3 to make the *received* deltas the ones
named. A phone has no wheel; this is the harness and not the product.

The opening still runs in full on every fresh load and on reload, and the
logo-on-home reset still returns the hero to it. What is *not* coming back is
the old reversal, which handed progress to the driver in reverse: the poster
and its land copy came back in front of the card at every pause between
notches and the same gesture gave four different answers at four speeds.
Nothing in the close reads a delta into progress.

The direction hysteresis of `9a612e4` / `7c13e14` stays, and is still
reachable: it governs a reversal *inside* the opening, before the release,
which is untouched. What went with the re-entry is only the code that ran
after it.

**The strike, and marks generally.** The amber strike under the label is a
mark and answers to the **3.0** floor at its own ink; the poster plate's mid
darkening is 76 (from 66) so that it reads 3.20 / 3.25 / 3.38 over the sky at
664 / 553 / 1440×900 across the whole of its leg. The gains' amber numerals
are pseudo-content and marks too — **display marks, floor 3.0**, never body
text. The thread — the mark that travelled from the hero's block into the
clearing — was removed at `984e9ff`: each block draws its own 96 × 2 rule
where it stands, and the strike goes behind the land with the words.

*The still boundary is the one that bit.* A mask sitting at a fixed place in the
frame still travels relative to the type whenever the two are registered to
different coordinate systems, and the reader is the one who moves them — by
being on a different screen. The hero's land silhouette is `mask-size: cover` on
a 3000×4000 mask, which a phone fits by height at every window it can show, so
its skyline holds a constant **0.4175 of the window**. The headline's second
line sat at `23.5%` of the same window *plus a 110.6px stack* of label, strike,
margin and first line, every pixel of it fixed. The clearance between them is
therefore `0.1825·H − 110.6`, and it collapses as the window shortens: 43.5px at
390×844 — the feet, which is the treatment — 26.4 at 750, **10.6 at 664, where
89% of the line is behind the land**, and negative at 553, where all of it is.
390×844 is the phone's screen; Safari's chrome means a page never gets it.

So the rule has a second half, and it is the one that has to be checked:
**a boundary expressed as a fraction of the window and type positioned partly in
px are two clocks, and they only agree at the height they were tuned on.** Where
type composites against a boundary, the offset that places it is `a·H − b`, not
a percentage and not a pixel count — the fraction is the boundary's own and the
constant is the px the type carries. Verify at the shortest window the device
can produce, not at its screen size.

**The desktop half of the same rule — 2026-09-09.** Above `md` the mask is
fitted by *width*, so the skyline is `0.33·H + 0.117·W` — it climbs as the
window shortens — while the block stands at `15%` plus a fixed 340px stack to
the second line's last ink row, which does not. The two agree at 1920×1080
(56px of clearance) and disagree at every laptop: at 1440×900 the last **21px**
of "are ArtiCYa" were behind the land's 0.10 line, at **1440×780** — the window
a laptop's browser actually leaves of a 900 screen — **42px and 22% of the
line's ink**, and at 1280×650 **53px and 41%**, which is the "lower half"
the owner reported. Lifting the block cannot close it: at 780 the words would
have to start 57px from the top, under the 80px nav. So the *land* goes down.
`--hero-poster-y` is **27% above `md`** (33% stays below, where cover fits by
height and the number is inert): the picture and its land copy move together
by 0.06 of the overflow — 61px at 1440×900, 68 at 780, 89 at 1920×1080 — and
every glyph now clears the 0.10 line by **38 / 144 / 23 / 9px** at 1440×900 /
1920×1080 / 1440×780 / 1280×650. The descent grows by the same 61px at 1440×900
(330 → 391) because it is measured off the same variable; the twelve keys, the
phone's poster and expanded frames (byte-identical) and the poster's contrast
(label 7.68, strike 3.47, headline 7.16–7.53 at ink) do not move.

**The About closing paragraph is on the clock too — 2026-09-09.** It was the
one sanctioned scrubbed entrance (`ART-DIRECTION.md` §2, first amendment, now
withdrawn): three word groups completing on the scrollbar between scrollY 2472
and 2732 at 390×664, 3520 and 3800 at 1440×900, with the rule drawing ahead of
them over 80 and 60px of scroll. The owner saw three stalls. The whole
paragraph now enters once, on the site's own clock — **56px rise over 1.4s on
`--ease-out-quart`, a 400ms fade, the rule drawing from its centre on the same
clock** — cued the first time the block rises 14% above the window's foot,
which is scrollY 2332 at 390×664 and 3220 at 1440×900, a screen before the pin
engages (2672 / 3600). The tiles' gather, settle and zoom, the foot mask and
the words' dissolve (2912–2972 / 4020–4120) are untouched and hash-identical at
20px steps across 390×553, 390×664, 390×750 and 1440×900. Scrubbed text on the
site is now only the finale's own exit.

**A route change is a wipe — 2026-09-09.** Measured before this at 390×664 on
4G: a client-side `Link` committed the new route **86–88 ms** after the tap,
painted it on the next frame, reset the scroll on the commit, kept the header
node (it is the root layout's) and re-mounted the stage and `main`; CLS 0.000
and no motion of any kind — one page replaced by another between two frames,
and on a cold cache the photograph landed 1.0 s after the ground. It now goes
the way every other crossing on the site goes. Where `document.startViewTransition`
exists and motion is not reduced, an internal link is taken through it: the old
page holds on the glass while the new route commits and its photograph decodes,
then the destination **wipes over it top to bottom — one boundary, the plate
wipe's 40% feather, `--route-wipe` 0 → 140% over 480 ms on
`cubic-bezier(0.65, 0, 0.35, 1)`** — with layer opacity only ever 0 or 1 (the
root pair is `isolation: auto`, `mix-blend-mode: normal`, no cross-fade) and
the header as its own named snapshot, swapped rather than animated, so it
never moves. The destination's text (`Reveal`, `StageScene`) waits for the
transition's `finished` before it arms, so it enters on its own clock after
the wipe and never underneath the old snapshot. Reduced motion and browsers
without the API get the instant swap as before; WebKit 26 runs it with no
errors.

**The wipe never shows ground before the photograph unless the photograph
is not there.** The update callback waits for the destination's
high-priority image to decode, at most 300 ms; on a warm cache — the intent
and idle prefetches have put the file there — the decode resolves inside the
commit, `ready` lands at **86 ms** and the wipe finishes at **579 ms** after
the tap, and at 240 ms into it the revealed rows 0–28% of the window are
**0.00% different** from the destination at rest, header included. Cold (the
cache cleared after the prefetch), `ready` lands at **333 ms** — the 300 ms
gate — the wipe runs over the ground and the photograph lands at 1.1 s, as
before. From an inner page, whose idle queue does not run, a tap on another
inner page is the cold case unless the finger's own intent prefetch beats
300 ms: About → FAQ measured `ready` at 325 ms and the photograph at 830 ms.

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
lines rise out of clipped masks, staggered 120/300ms; the amber strike draws
from its center at 850ms and the hint pill lands last at 1000ms. There is no
glare: `.hero-sheen` swept a 70% `plaster-bright` band across the card, which
on the dark ground read as plaster brightness on a photograph and as the
plainest cheap-motion tell the page had. It is deleted. The
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
| `.photo-stage` / `.stage-plate` / `.stage-plate-frame` | The page's ground below the hero: one fixed full-viewport layer holding three photographic plates that crossfade on the scrollbar, each settling from 1.07 to 1.00 as it arrives | The home page only — the one scroll-linked layer on the site (see The stage) |
| `.stage-plate-shade` | A plate's own darkening, and the whole of it: flat `gold-anchor` held for the height of each chrome bar at the top and bottom of the window, a per-plate floor between them. Rides inside the plate, so it fades with it | Inside every stage plate — there is no scrim, veil or wash anywhere else on the home page |
| `.panel-pane` / `.panel-pane-plate` / `.panel-pane-blur` | The offer panels' reading ground: the stage's own plate out of focus (blur 28px, brightness 0.40, saturate 0.8), confined to the text block by a lift's two crossed fades, its ramps starting well inboard so it reads as haze rather than as a soft-edged rectangle | Behind the offer panels' type only |
| `.ground-lift` / `-pool` | The gold a block of type stands on once a photograph is under it: a soft-edged pool anchored to the block, its falloff a fade across multiplied by a fade down, its bleeds kept short so the ground beside the block stays photographic. `--lift-ramp-x` / `--lift-ramp-y` set the ramp lengths apart from the bleeds, so a pool can spend more softness than its box reaches | Over the "What we do" type column and its stats ledger; the box and the fades are also what `.panel-pane` is built on |
| `.gold-field` | Top and bottom edges at `gold-anchor`, falling to it at zero alpha toward the middle where the `gold-wash` floor takes over | The home **hero** and the inner pages. No home section below the hero carries a ground of any kind — the stage is the ground there |
| `.gold-field-chrome-top` / `-bottom` | The same field with that one edge ending on `gold-chrome` instead, and — on the top variant — held flat for the header's height before the ramp starts | The home hero's top, and the inner pages' closing sections. The home closing section no longer needs it: the stage's own bottom darkening lands the footer join on `gold-anchor` at every scroll position |
| `.gold-field-open-top` / `-open-bottom` | The same field with that edge painting nothing at all | An edge with no second edge to meet. On the built page: the home hero's bottom, which opens onto the stage |
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
  photographic **stage** below, which earns it by being the page's ground
  rather than a layer on one, and which does carry a reduced-motion variant
  (the crossfade stays, the arrival scale goes).
- **Measured on the composite.** Layered grounds create pixel values between
  tokens, so text contrast is verified against the actual rendered composite
  (screenshot sampling behind each text zone), not against the flat token.
  Working ceiling: no composite behind text may exceed `pine-800` lightness —
  the lightest ground every dark-ground pair still passes on. Gradient layers
  mix only existing grounds; photo layers respect the ceiling through their
  opacity and brightness caps.
- **A ground that passes the page-ground test can still read as an empty
  screen.** Zero visible page ground is **necessary and not sufficient**. The
  page-ground test asks whether anything is showing *through* the composition;
  it cannot see a composition that covers the window with picture nobody can
  read. A defocused frame under a darkening gradient passes it perfectly and
  measures, on the site's own rejected build, a **local luminance range of
  1.9–2.1** against a sharp frame's **79–118** — two orders of magnitude, and
  invisible to a test that only counts holes. Where the question is whether a
  screen reads as a picture, measure **local structure** and report three
  numbers: the share of the window carrying identifiable photographic content,
  the largest contiguous region carrying none, and **that region's mean
  luminance** — the last is what tells a flat bright sky apart from a black
  screen, and without it the two score the same. Paint the glyphs out first;
  white type on near-black is a step of 200 and will score as picture.
- **Judge a preview at the states the reader passes through, not at three
  canonical moments.** A composition verified at rest, at its pin and at its
  peak can be empty for a viewport and a half of scroll between them and every
  canonical frame will still pass. The states a reader crosses are the states
  that have to be measured, and a contact sheet of the whole timeline is the
  cheapest way to be unable to miss one.
- **One light.** `.lamp-falloff`'s warm whisper is the falloff of the same
  resin lamp at the hero seam — direction for the existing light, never a
  second source. Everything else is pine and plaster, and every layer stays
  too faint to read as glow, shape, or blob (whisper-level; if a screenshot
  shows a hard edge, it is too strong).
## Viewport heights

**The mobile test heights are 553, 664 and 750.** 664 is what a 390-wide iPhone
gives a page with Safari's URL bar showing and 750 with it collapsed; 553 is the
iPhone SE with its chrome. **390×844 is the device's screen, not a viewport iOS
Safari ever gives a page, and it is retired as a verification height.** It stays
in this document for one reason only: the contrast reference set at `3749c92` is
recorded at it, and a ratchet has to be measured against the thing it was
written on. Everywhere else it is a number with nothing behind it.

**Anything measured only at 844 is unmeasured.** Three defects were signed off
at that height and were broken at every height the device produces — the
headline behind the land silhouette, the hero lede under its floor, the offer
panels overrunning the screen — and in each case the number at 844 was the only
one that passed.

**A px quantity registered inside a `vh` quantity holds its size while the ramp
around it changes.** That is the whole mechanism behind all three. A mask fitted
to the window sits at a constant *fraction* of it; a stack of labels, margins
and line boxes above the type is a constant *number* of pixels; the clearance
between them is `a·H − b`, which is only the value it was tuned on at one
height. The same is true of a block anchored to the foot of a frame whose
darkening runs from a percentage of that frame, and of a photograph whose height
comes from its width sitting inside a section sized against the window.

So: **every fixed offset inside a viewport-relative system is checked at the
shortest height the device produces, not the tallest.** And where the two have
to hold a relationship, the offset that places one against the other is `a·H −
b` — the fraction is the viewport-relative thing's own and the constant is the
px the other one carries. §2.18 and §2.20 are the two worked examples.

**A height produced by an aspect ratio is a fixed length, because it is derived
from a width.** `aspect-ratio: 3 / 4` on a box whose width is a share of the
screen gives a height that does not move when the window's height moves — it is
as fixed as a `px` and it must be counted as one. Measured on the offer panels:
the photograph is **343.7px tall at 553, 600, 664, 700, 750 and 844**, and it
changes only when the *width* changes. The corollary is that such a height can
only be traded against another px quantity: a share of the width and a length
scale differently, so a redistribution that has to hold a total at more than one
device width needs the length on both sides of the trade.

**The same identity read backwards is why the stacked panel now declares a
height and not a ratio.** With a ratio alive, `max-width` clamps the width and
the ratio shortens the height with it, so a rule about the *width* reaches the
panel's total and every scroll key under it. Declared as `height: 36svh` with
the width free, nothing in the vertical stack can hear the width at any value —
which is what let the panel photograph grow 48% without a single key moving.

**One basis for the document, and it is `svh`.** Everything in flow — every
section's height, every marker offset, every band inside a panel — names the
small viewport, which is the one height a phone holds at both chrome states.
`dvh` belongs to exactly two kinds of element, and neither is in flow: a fixed
or sticky layer whose job is to cover the window. `lvh` is what an undeclared
box silently gets and is right for nothing. The rule has a second half that is
easy to miss: **anything that computes a scroll key must read the same basis**.
A document laid out entirely in `svh` still slides under the reader's finger if
its keys are computed against `innerHeight`, because half the toolbar's height
goes straight into every one of them.

**A scroll key is declared, never inherited from a content height.** A zone is
keyed at its own middle, so a marker that *is* a section keys at half whatever
that section happens to measure — and on a phone a stacked section's height is
a stack of px. Every key on the home page is now an `svh` offset from the top
row of the thing it belongs to, written as a zero-height marker, and the spans
between them are therefore shares of the window rather than shares of a
photograph's aspect ratio. Six of the eleven used to change length as the
window did; the worst changed by 0.31 of a viewport between 553 and 844.

**Where a px residue cannot be removed, it goes in a hold, never in a ramp.** A
span that starts inside one block and ends inside the next *is* that block's
own height, so while the block is taller than the screen no expression makes
that span a share of one. What is free to choose is *which* span carries it,
and the answer is always a hold: a hold is a still frame, so its length
changing with the window is not a change of pace, where a ramp's length is
exactly what pace means. §2.26 is the worked example — the road's full hold and
the quiet run out of the second panel carry it, and no ramp on the page carries
px.

**Frozen reading copy is the ceiling on any block that has to fit the screen.**
Reading type does not scale with the viewport, so a paragraph is a fixed number
of pixels — and the offer panels' longest is 337.6px, which is **50.8% of a 664
screen**. Every other band of that block can be made a share of the window; the
paragraph cannot, and what is left over after it is all the composition has to
spend. That is why the panels' photograph is 179px wide at 664 and not 300: a
stacked panel showing its paragraph and a whole 3:4 picture on one screen has
half a screen of height for the picture, and half a screen of height at 3:4 is
a little under half a screen of width. **Measure the copy first and design the
rest of the block into the remainder** — the reverse order is how a block ends
up fitting exactly one window, and never the window the device makes.

That ceiling is on the *height* and nothing else, and the free direction it
leaves is width. The picture is 36svh tall — 265 × 239 at 664 rather than the
179 × 239 the frame's own 3:4 gave — because the box is 1.11 rather than 3:4
below `md`, which is the largest the ground beside it allows. What the
paragraph forbids and what it leaves alone are two different axes, and only the
first is fixed.

## The stage

**The home page has one ground below the hero, and it is a photograph.** Every
section under the hero used to paint its own: the gold field's edges, a
travelling plate behind "What we do", a full-bleed photograph inside each offer
panel with a cream reading wash built over it. Each of those is a surface with
a boundary, and a boundary between two surfaces is a line — the shared
`gold-anchor` edge existed to make those lines meet on one value, which is
managing seams rather than not having them.

There are no section grounds now. One **fixed, full-viewport layer** sits
behind all home content, below every section and above the body's floor, and it
holds **three photographic plates** that crossfade as the reader scrolls. A
section does not begin or end as far as the ground is concerned; what changes
down the page is which photograph is showing, and a crossfade has no edge. This
is what removed every horizontal seam rather than softening it.

**The plates, and what stands on them.** Strength is declared in the markup, on
the block it belongs to (`data-stage-plate`, `data-stage-strength`), so the page
decides what stands on what and the layer only measures and blends:

| Zone | Plate | Strength |
|---|---|---|
| "What we do" | `hero-2.jpg` — the tree-lined road | 0.90 |
| Stats ledger | `hero-2.jpg` | 0.90 |
| Offer panel 1 | `home-youth.jpg` — the rope, close | 0.18 |
| Offer panel 2 | `home-youth.jpg` | 0.18 |
| "What you gain" | `hero-1.jpg` — the walk out to the reservoir | 0.55 |
| Closing | `hero-1.jpg` | 0.95 |

The two 0.18 entries are the model's other half: **the ground is allowed to go
quiet**. Through the panels the stage falls to a whisper and the dark floor
carries the passage on its own, which is a beat the page could not play at all
while every section owned a surface. And the two plates that repeat across
adjacent zones give a **plateau**, not a spike — the value holds flat for the
whole of both panels and for the whole clearing, so the ground is still while
the words are being read and only turns between them.

The page costs **one new photograph** for all of this: `hero-1` and `hero-2` are
hero slides the browser has already fetched, and the panels' own two pictures
(`home-youth`, `FAQ`) are gone, one of them replaced by the plate.

**Opacity is read off the scrollbar, and it is the one thing on this page
allowed to be.** Every text entrance is forbidden to scrub — at a real flick
speed a scrubbed choreography elapses inside 200ms of finger travel and reads as
nothing. That rule is about text. This is background: the reader is meant to
feel the ground turning under them at exactly their own rate, and a clock here
would put the wrong photograph behind the words whenever the scroll speed and
the clock disagreed. Each plate also **settles from 1.07 to 1.00** as it
arrives, and holds at 1.00 once it has — the scale plays on the plate's own
first ramp, not on every crossing, so a plate never swells again on the way
out.

Nothing about it captures the scroll: a passive listener coalesces into one
`requestAnimationFrame`, and that frame writes three opacities and three
scales. Layout is read on mount and from a `ResizeObserver` on the document —
the pinned panels take their full height only after they mount — never per
frame. Under `prefers-reduced-motion` the **crossfade stays** and the arrival
scale does not: a fade carries no travel to be sensitive to, and freezing the
ground on one plate would put the wrong photograph under two thirds of the
page. Without JavaScript every plate rests at zero and the dark floor carries
the whole page, which is a state the model already sanctions.

**Each plate carries its own darkening, and that is the whole of it.** There is
no scrim, veil or wash anywhere else on the home page. The shade holds flat
`gold-anchor` for exactly the height of a chrome bar at the top and bottom of
the **window** — not of a section — so the header's lower edge and the footer's
upper edge meet the ground on one value at every scroll position and on every
plate. Two named boundaries used to need `gold-field-chrome-top`/`-bottom` for
this; anchored to the window it is true of every row of the page at once.
Measured on the built page at nine scroll positions, both viewports: **footer
join 4** maximum channel jump, against the 1–2 the old gold seam measured. The
**header** join is a picture edge rather than a gold seam, exactly as it always
was over the hero and on the inner pages: the bar's amber hairline lands on the
photograph, and the hold is what keeps the darkest case at 4.

Between the two ramps the shade holds a **floor, and the floor is per plate**
(`--plate-shade`: 0.50, 0.52, 0.64). A photograph behind text answers to the
working ceiling — no composite behind text may exceed `pine-800` lightness —
and a dark picture reaches that ceiling with less darkening than a bright one.
`hero-1` opens on a bright sky and needs 0.64 where the road under the pines
needs 0.50; spending more than a picture needs only throws the picture away.

**The offer panels' reading wash is gone, and what replaced it is not a
colour.** The wash was a cream ramp built across the whole panel from the text's
own side — a flat colour laid over a photograph, which is exactly the thing that
puts an edge back on a page built to have none, and it was also the page's worst
measured text: `3.06` desktop / `3.69` mobile through the first fifth of each
pin, where the ramp was still at its 0.6 floor. In its place the words stand on
a **defocused copy of the plate behind them** — blur 28px, brightness 0.40,
saturate 0.8 — confined to the text block by a lift's two crossed fades. The
blur is rasterized at a quarter size and magnified by a composited scale, the
same construction the travelling plate used, because a blur is priced by the
area it rasterizes and not by its radius.

Its ramps start well **inboard** of its box (`--lift-ramp-x` 232px against a
96px bleed on desktop), and that is the difference between haze and a panel.
Held at full strength over its whole box the pane read as a soft-edged
rectangle sitting on the picture — the same failure the hero's sky lift found at
48px and answered with 160. Same footprint, several times the softness.
Measured after: the panels' prose comes out at **8.50–8.75** (desktop) and
**9.55–9.69** (mobile) against a 4.5 floor, and their titles at **5.12–7.35** /
**6.02–8.44** against 3.0.

**Measured across the whole page, glyph cores on the rendered composite, worst
case swept across every element's own traversal, both viewports.** The floor is
4.5 for body-size text and 3.0 for large:

| | Desktop | Mobile |
|---|---|---|
| Worst body-size text on the page | **7.18** ("What we do" lead) | **7.20** |
| Worst large text on the page | **5.12** (Youth Exchanges title) | **6.02** |
| Closing headline, `resin-deep` | 6.62 | 6.34 |
| Closing lede | 9.24 | 9.91 |
| "What you gain" heading and trail | 8.64–10.54 | 6.75–7.96 |
| Stat numerals / labels | 10.97–11.16 / 7.07–7.21 | 11.10–11.15 / 7.08–7.19 |

Nothing on the page is inside a point of its floor, which was not true before:
the panels' prose used to spend part of every pin under AA.

**Document height is unchanged to the pixel** — 7743 at 1440×900 and 5887 at
390×844, before and after. Nothing here is in flow.

**A ground is `dvh`; content is `svh`. A ground may never be left to inherit
its height.** The stage used to be `fixed inset-0`, which is a fixed box with no
height of its own, and a fixed box resolves against the initial containing
block — which a phone browser holds at the *large* viewport while the visible
one shrinks under the URL bar. So the layer that carries every photograph below
the hero was painted **86px taller than the screen at 390 wide** whenever the
bar was showing, 13% of its height below the fold and 21% at the peak of an
arrival, taking the shade's bottom hold — anchored to the bottom of the
*window* — off the bottom with it.

The three units are not interchangeable and each one is right for exactly one
job. **`svh` is what content answers to**: sized to the smallest viewport, a
block always fits at both chrome states, which is why every section on the home
page keeps it. **`lvh` is what a box with no declaration silently gets**, and it
is right for nothing here. **`dvh` is the viewport as it currently is**, which
is the only correct answer for something whose job is to cover the window.

**The hero went to `svh` with the rest of the document, and that is the
amendment.** A ground and a document height are two different jobs, and the hero
section was doing both: in flow it is the first term of every scroll offset
below it, so at `dvh` it grew by the toolbar's own 86px as the bar animated and
moved all twelve of the stage's keys mid-gesture. It costs the hero nothing,
because the state it is composed for is the state `svh` names — the expansion
holds the page at scroll 0, and iOS only collapses the bar on a scroll the hero
is preventing. **`dvh` now belongs to exactly two elements, and neither is in
flow**: `PhotoStage`'s fixed layer and the About wall's sticky frame.

**And the key basis is `svh` too.** A zone is keyed at
`zoneTop + zoneHeight/2 − basis/2`. With every other term on the small viewport,
a basis of `innerHeight` puts the toolbar back into all twelve keys on its own —
the document holds still and the keys still slide, by half the bar's height. The
layer reads its basis off a `100svh` probe. The cost is that with the bar
collapsed a zone's middle sits 43px above the window's middle at its own key:
7% of a 500px ramp, constant, against a key that used to move.

No emulator can show the difference: headless has no browser chrome, so `svh`,
`lvh`, `dvh` and an inherited fixed box all resolve to `innerHeight`. This is
therefore a correction that no measurement moves, and it was verified that way —
every Section 2 key, every document height, every rendered-against-fetched ratio
and every arrival scale identical in both engines at 664, 750 and 844. The one
number that is not identical is WebKit's own: it resolves `100dvh` at an 844
window to **843.984375**, a 1/64px quantisation, which the bottom-row scan shows
as a ±1 channel resample of the photograph and not as a row of exposed floor.

## The grounds and the crop floor — 2026-09-08

**A cover-fitted frame shows `boxAspect / frameAspect` of its width (or the
inverse of its height); `object-position` chooses which slice, never how
much.** The 60% floor is therefore a statement about two aspects, and it can
be solved before a photograph is chosen. A 16:10 window shows 60% of a frame
only at A ≥ 0.96; a 390×664 phone only at A ≤ 0.979; 750 (0.520) only at
A ≤ 0.867, which no desktop box accepts. The band that passes both budget
windows is **0.96–0.98**, and the two inner grounds are cut to it: `IMG_4721-
oaks` (About) and `IMG_3004-reservoir` (FAQ), each rows 22.5–100% of a 3:4
frame, 0.968:1, showing 60.5% on a desktop and 60.7% / 70.1% at 664 / 553.
The convention in force is the published crop as the frame — the valley
shows 46% of its master, `hero-1` 47% of `IMG_8626` — and these two hold to
it the same way.

**The gains' box is the screen below `md` and a fifth more above it.** The
valley is 0.978:1, so a 120svh phone box showed 57.8% / 50.1% of it at 553 /
664; the one-screen box shows 69.4% / 60.1%. The plate-shade's mid stops are
20% / 60% on the phone box and 16.667% / 50% on the taller desktop one — the
same rows either way. `gainSizes` follows the box through `coverSizes` and
resolves to `(min-width: 768px) 100vw, 211.7vw`.

**A new frame enters through `MATCH`, solved.** `IMG_3004` was fitted on its
own non-sky, non-skin content to the mean a\* / b\* of the five on-site
Portugal frames with L\* and C\* held inside the set's range: `wb [1.10, 1,
1.14]`, gamma 0.888, satScale 0.825, and a shoulder of 0.95 set by the clip
guard at full resolution (the blue gain blows the sky from 0.25% to 0.70% of
the frame without one). `hero-2` and this frame are the two that carry a
shoulder.

**Contrast is read at the glyph's own ink.** The diff-gated sweep admits
antialiased pixels down to about 54% coverage, so on a near-black ground its
worst pixel is a fringe pixel and every element reads 4.7–4.9 whatever the
picture behind it; it is a lower bound, not the reading. The FAQ's answers
with a `<details>` open read **4.97** at the ink at 390×664 (floor 4.5),
which is why the sharp plate's 79/80 stays.

**Placements as of 2026-09-08.** 26 KNOWN rows in `verify:placements`:
`IMG_3004-reservoir|1920x900@2` and `IMG_4721-oaks|1920x900@2` at 1.334 join
the 2880-cap family; `IMG_4721|1920x900@2` leaves with the whole frame.
`hero-2` stands at two placements (slide 2 and a finale tile).

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

## Composited layers, and what a pinch costs — 2026-09-09

**The rule: a layer that paints nothing does not exist.** Not opacity 0, not
`will-change` held against a change that is not coming — `display: none`, or
not rendered at all. On iOS every composited layer holds a backing store at
the device ratio, and a page scale re-rasters all of them at the *square* of
that scale: at 2.5× a full-bleed layer costs 6.25 times what it costs at rest.
The WebContent process has a hard budget on the order of a few hundred MB, and
past it Safari does not drop a frame, it kills the tab — *"A problem
repeatedly occurred."*

Chromium's `LayerTree` CDP domain emits nothing in the build this repo is
measured on (0 events, headless and headed, with GPU raster forced), and
Blink's layerisation is not WebKit's anyway. So the census is by **promotion
rule off the DOM**: `will-change`, a 3D transform, `position: fixed`, `filter`,
`backdrop-filter`, a mask, a canvas — each element's painted rect × 4 bytes ×
DPR², summed, with decoded image bitmaps counted separately and deduplicated by
URL (a bitmap does not scale with the page). It is an upper bound on the
backing store, and the owner's Web Inspector memory timeline is the gate.

Measured at **390×664 DPR 3**, before and after:

| route / state | layers | backing store | at 2.5× pinch (+ decoded) |
|---|---|---|---|
| home, scroll top | 23 → **13** | 186.7 → **95.2 MB** | 1299 → **728 MB** |
| home, hero open | 23 → **10** | 194.9 → **76.8 MB** | 1351 → **613 MB** |
| home, over the Earth | 23 → **9** | 194.9 → **67.9 MB** | 1351 → **557 MB** |
| /about/, scroll top | 6 → **5** | 47.9 → **39.0 MB** | 375 → **339 MB** |
| /about/, the finale | 6 → **4** | 45.3 → **27.5 MB** | 359 → **267 MB** |
| /faq/, scroll top | 5 → **4** | 39.0 → **30.1 MB** | 269 → **214 MB** |
| /contact/, scroll top | 5 → **4** | 39.0 → **30.1 MB** | 272 → **216 MB** |

At 1440×900 DPR 1 the same four commits take home from 24 layers / 110.7 MB to
10 / 37.0 MB, and the inner pages from 21.6 to 16.7.

**Four causes, in the order of their weight, and the Earth was not the first
of them.** The canvas is **2.97 MB** — 1.5% of home's backing at 390 — and its
buffer does not re-raster on a pinch at all. What the loop costs during a
gesture is main thread and GPU contention, which is real and is why it stops
(above); it is not the memory.

1. **The hero's two extra copies of the poster** (`3177352`). The opening
   paints the photograph three times — the plate, the copy masked to its own
   land, the card's window — and past the release two of them stood at opacity
   0 for the whole of the reading page below. Not rendered now, and back with
   the poster's own strength. *−26.7 MB at 390.*
2. **The gains' ground** (same commit). The sharp valley, the four defocused
   copies over it and its mask are six window-sized layers that stood in the
   tree from the moment home parsed. Painted only while the section is within
   a viewport (`NearGround`). *−53.3 MB at 390.*
3. **Plates that paint nothing** (`5b4d621`). A plate has strength only
   between the key before its first zone and the key after its last; outside
   that range plus **a viewport of lead** it is `display: none`. The lead is
   the browser's decode back before the plate has any strength to show it at.
4. **`will-change` held at rest** (`ddbc72a`). `.stage-plate-frame` carried the
   hint and an identity `translate3d` for the life of the page. Both are
   written by the arrival and cleared at the end of it; settled, the transform
   was the identity, so clearing it paints what writing it painted.

**The two blurred copies keep their hint, and it is not for the promotion.**
`.stage-plate-soft` and `.gain-defocus` are promoted by their own filters
either way. What `will-change: transform` buys them is the compositor
rasterizing them at the scale they are magnified to; taken off, the defocus
resamples — measured, the contact page's worst pixel moved ΔL 0.045 on a dark
ground, which on a 4.5 pair is 4.50 → 2.88.

**What the fourth commit costs, stated exactly.** Taking a layer out of the
compositor changes where it is rasterized, and that is a rounding. Measured
across 36 frames at both viewports: **every subpixel that moves does so by 1–3
steps**, except 20 of 3.9 million on `/contact/` at 1440, at 14–20, on
antialias edges under the blur. The frame's mean luminance is unmoved (47.15 →
47.12). It is not byte-identical and it is not visible; the trade is against a
crash.

**The floor, and it is the photograph.** An inner page bottoms out at four
layers — the fixed stage box, the defocused copy, the page's own foot mask and
the header — and one decoded bitmap of 26 MB. That residue is what the page
shows; it does not come out without changing the picture. `/faq/` and
`/contact/` sit at 214–216 MB under a 2.5× pinch against the ~200 MB target,
`/about/` at 267 because its ground is the largest rung on the site.

## The Earth — 2026-09-09

**"What we do" carries an object again, and it is the planet.** The owner
rejected the clearing-as-split (`58c0a06`, `b5a9982`, reverted at `85d68e2`
and `53a3e35`) and asked for a spinning Earth — realistic, detailed, in the
colours of the section, with bullets on the countries the projects reach.
The dotted globe stays rejected (`ART-DIRECTION.md` §3); this is a different
object, and the owner's verdict on the duotone first draft is what set its
terms: *an Earth in the site's two tones read as an impostor; amber arcs
read as hand-drawn.* The real skin, and points not lines.

**Where it stands.** The grid's right six of twelve columns at `md+`, the
ledger under both columns in a `col-span-12` row; below `md` the same grid
stacks and the Earth goes last, under the stats. Never behind a glyph — the
no-shape-behind-text rule applies to a sphere too, and it is measured across
the traversal, not at rest:

| | 1440×900 | 1920×1080 | 390×664 | 375×553 |
|---|---|---|---|---|
| the box (`min(100%, 56svh, 559px)` at `md+`; 0.82 of the column below) | 504 | 559 | 293.5 | 281.3 |
| the disc (0.90 of the box; the atmosphere takes the rest) | 454 | 503 | 264 | 253 |
| gap under the ledger's last row (phones) | — | — | 36px | 36px |
| section | 1.000 vp | 1.000 vp | 1.017 vp | **1.199 vp** |
| closest a glyph comes to the disc, parallax live, 20px steps | 46.5px | 48.6px | 47.9px | 31.3px |

36px is the largest phone gap that keeps the shortest window's section
under 1.2 screens; the parallax is bound to 33px so the drift can never
close it.

**The 559px cap, and it is a weight rather than a size.** `56svh` puts the
box at 604.8px on a 1080 screen, where the block-to-disc reading below came
to 0.892 — under 1.0, so the Earth is what the eye takes first. 559px is the
largest diameter that holds the ratio at 1.05 there (**1.051** swept, against
1.048 at 560), and the cap is expressed in px precisely because it must bind
on tall windows and nowhere else: `56svh` reaches 559 at a window 998px tall,
so 1440×900's 504px box is untouched and so is every phone. The margin is
half the shrink, `max(0px, (56svh − 559px) / 2)`, taken above *and* below, so
the column keeps the row it had. Measured before and after at 1920×1080: the
disc's centre stays on **408.0**, the box top moves 105.6 → 128.5, the
heading block stays on 203.6, the lead's foot on 399.3, the ledger's first
numeral on 782, the section on 1.000 vp and the document on 6200. The
clearance can only grow — 22.9px on every side — and swept at 20px over the
traversal it reads **66.7 → 87.3px** on this harness. 1440×900, 390×664 and
375×553 are identical in every one of those readings.

**The rows, declared — 2026-09-09, second pass.** Above `md` the block used
to float: the scene centred its grid in `min-h-svh` and the words centred
themselves again inside the Earth's own 504px row, so the sky over the
heading was whatever the two centrings left — **25.8% of a 900 screen and
29.0% of a 1080 one**, with 157px of it spent inside the row before the rule
was drawn. The reader stopped on a screen that was mostly sky. Both centrings
are gone above `md` and the two rows are declared instead: the scene opens
its grid at **9svh** (`md:justify-start md:pt-[9svh]`), the Earth stands at
that row, and the text column takes a further **9svh** — so the rule is at
**18svh of every desktop window**, and the space above it is a share of the
screen rather than a residue. Below `md` nothing changes: the phone still
centres, and both phone heights are byte-identical to the commit before,
pixel for pixel, keys and document height included.

| row, at the scroll that puts the section's top at the window's | 1440×900 | 1920×1080 |
|---|---|---|
| the rule | 232.2 → **162.0** (25.8% → **18.0%**) | 313.2 → **194.4** (29.0% → **18.0%**) |
| the title's cap line | 249.7 → **179.6** (27.8% → 20.0%) | 333.1 → **214.3** (30.9% → 19.8%) |
| the lead's last baseline | 415.7 → **345.6** | 514.6 → **395.8** |
| the Earth's box, top | 82.3 → **88.0** | 121.8 → **105.6** |
| the disc's centre | 334.3 → **340.0** | 424.2 → **408.0** |
| the ledger, top → bottom | 626.9–825.1 → **633.0–831.2** | 767.3–965.5 → **750.0–948.2** |
| the section | 1.000 vp → **1.000 vp** | 1.000 vp → **1.000 vp** |

The section's height is unchanged because `min-h-svh` still binds: the grid
needs `9svh + 56svh + 48 + 198` of the window, which is under a screen while
the window is **704px tall or more**. Under that — a desktop window shorter
than the shortest phone this site is measured at — the section grows instead
of clipping: 1.02 vp at 660.

**Why the words and the disc no longer share a centre line.** They did, to
within the parallax's own 7px, and it cost the heading its row. They cannot
have both. The ledger is a full-width row wholly below the Earth, so the
block's centre — the rule's row to the ledger's foot — sits at least half the
ledger's own stack, `(48 + 198.2) / 2 = 123px`, under the disc's; closing
that gap needs the disc's foot to reach past the ledger's top row, which puts
it over `15+ / COUNTRIES`. Solving the two together at 1440×900 wants a
ledger foot at 1054px of a 900 screen. So the axis is not the constraint that
gets satisfied: it is read, recorded and left — **−194.3 → −156.6px** at
1440×900 and **−215.2 → −163.3px** at 1920×1080, the disc's centre above the
block's in every case. What the lift buys instead is the heading's row, and
what it costs is the quiet band between the lead's foot and the ledger, which
opens from 205 to 281px at 1440 — photograph, and the walking group is in it.

**The skin** (`scripts/globe-texture.mjs`, the outputs committed under
`public/globe/`): NASA's Blue Marble Next Generation for **July** with
topography and bathymetry, graded toward the section — saturation 0.84, the
water pulled 0.34 toward `#102c3a` in proportion to its own level, the whole
×0.9 — at **4096×2048 q76 (348 KB)** for a desktop's disc and **2048×1024
q80 (138 KB)** for a phone's, the rung chosen by the canvas's backing size.
A second 2048×1024 map at q70 (**312 KB**) packs the night lights (Black
Marble 2016, on a 0.7 gamma) in R, the clouds in G, the water mask in B.

**The light, and the hour.** The section's ground is a blue-hour
photograph, and the Earth is lit for the same hour — the owner's second
verdict, *it must feel part of the section*, was answered here and not by
moving it: a first pass with a high sun (35° / 45°), full exposure and a
tight halo read as an object placed on the section. One key light from the
left and low — **24° above the view axis, 58° to its left**, in the
camera's frame — so the terminator crosses the disc and the night side is
a real share of it, with a 0.18 wrap on a smoothstep; the night holds 0.06
of the day and its cities come up in `--color-resin`, the site's one accent
as light. The day side is held down to **0.70** and takes **8%** of the sky
colour — the far things in the photograph behind it are cooler and softer
than the near ones, and so is this. A glint on the water only (pow 110,
0.22). Clouds on a second sphere at 1.006 R at **0.45**, lit by the same
light, drifting a fifth faster than the ground. The atmosphere twice: an
inner Fresnel limb on the globe (sky `#8fbce6` warmed to `#f2d7a8` on the
sun side) and an outer back-face shell at **1.10 R**, a ring³ strongest
against the planet and dissolving over the whole shell rather than ending
in a line, 0.08 on the dark side to 0.42 in the sun — the hard circle
against the photograph was the loudest "pasted" cue. Camera elevation 18°,
FOV 26°, axis tilt 23.4°. The levers are named constants at the top of
`components/earth-scene.ts`: `EXPOSURE`, `HAZE`, `NIGHT`, `TERMINATOR_WRAP`,
`LIGHT_ELEVATION` / `LIGHT_AZIMUTH`, `HALO_THICKNESS`.

**The marks.** Twenty-one points of `--color-resin` on the sphere — the
twenty countries and Cyprus — a bright core inside a soft halo at 0.5, 15px
and 22px, the home mark breathing ±12% on a 5.7 s cycle; the far side fades
on `smoothstep(0, 0.3, n·v)`. They light in the brief's order 70 ms apart,
260 ms each, 300 ms after the scene fires. No labels: the marks carry no
words, and the countries stat beside them carries the meaning.

**Motion.** One revolution in **90 s**, Cyprus facing the reader at the
moment the scene fires; the box rises with the clearing's wave on the
sanctioned 200 ms / 1200 ms settle (`.stage-globe`, 120px, 88 on a phone).
The box drifts at **0.06 of the scroll** from its reading position, bound to
±33px — background may be scroll-linked, and this is the ground's side of
the section. Under reduced motion: no spin, no drift, the Cyprus frame with
every mark lit. Without WebGL: nothing rendered, the box gone, the section
as it was.

**The drag is free in any direction — 2026-09-09.** Yaw was the only axis.
It is now yaw about the globe's own poles and pitch about the screen's
horizontal (world X carried into the tilt group's frame), composed
**pitch-after-yaw** so the turn is free while the planet never rolls. Both
axes carry inertia at the same 0.92 per 60 Hz frame; the auto-spin still adds
to **yaw alone**, so it resumes about whatever up-axis the reader left the
planet on rather than snapping back to one, still 4 s after the hand over
600 ms. Pitch is clamped at **±75°**, short of the far pole coming over the
top, and the clamp takes the velocity with it so a release never pushes into
the stop. A pixel of hand is the same angle on both axes: the disc's radius
subtends a quarter turn.

**How the finger is divided with the page.** A mouse or a pen grabs on the
press and turns freely from there, with no threshold. A touch declares itself
first: inside **12 px** it has said nothing; a finger still inside that after
**150 ms** is a grab, and one that leaves it **horizontally** is a grab at
once. A finger that leaves it vertically first is the page, and the globe
lets go of it. Once it is a grab the page is locked by cancelling every
cancelable `touchmove` — `touch-action` cannot do this, because `pan-y
pinch-zoom` is what keeps the pinch reachable and it would scroll on the
vertical half of a free rotation. A second finger ends the grab on the frame
it lands.

The touch half runs on **touch events and not pointer events**, and
`cancelable` is why. Once the browser has committed a finger to scrolling it
stops delivering `pointermove` and marks `touchmove` non-cancelable — so on a
flick the pointer path saw nothing, the 150 ms hold fired into a scroll that
was already running, and the globe turned under a gesture that was moving the
page. `cancelable` is the browser saying whether a grab is still available,
and it is only on the touch event. Measured at 390×664, mean channel step over
the disc against a no-hand control of the same clock (the canvas is
transparent, so the page must be put back to its scroll before the disc is
read, or a gesture that scrolled is measured against a different ground):

| gesture over the Earth | disc | no-hand control | page |
|---|---|---|---|
| vertical swipe, no hold, 200px | 2.52 | 5.47 | scrolls 185px |
| hold 150 ms, then vertical 200px | 9.55 | 5.01 | held |
| horizontal first, 200px | 5.95 | 3.08 | held |
| hold, then diagonal 140/140 | 10.52 | 3.71 | held |
| two fingers, panned 200px | 3.00 | 4.93 | held, grab released |
| mouse, horizontal 200px (1440) | 8.39 | 4.15 | held |
| mouse, vertical 200px (1440) | 9.14 | 3.04 | held |
| mouse, diagonal 140/140 (1440) | 11.86 | 4.54 | held |

**A page scale is not a frame to render.** While `visualViewport.scale > 1`
the render loop stops, and once the gesture has been still for **250 ms** the
drawing buffer is re-cut to DPR 1 — a quarter of the pixels — until the
reader is back at scale 1, when the same wait restores the full ratio. The
delay is the point: `setPixelRatio` reallocates the drawing buffer, which is
the one operation on this canvas that can cost the context (`a54c437`), and
the middle of a live gesture is the worst moment on the page to ask for
memory.

**Cost.** three.js loads on demand a viewport ahead of the section: two
chunks, 83.1 + 50.7 KB gzip, none of it on first load (166 kB, +1 for the
loader). Textures 660 KB on a desktop, 450 KB on a phone, on demand. On the
machine's GPU under a 4× CPU throttle the entrance costs under **0.5 ms** of
main thread per frame and no long task; headless Chromium's software rasterizer
reads 9.7 ms, which is the swap stalling and is recorded as such. The loop
runs only while the box is on screen and only while something moves.
