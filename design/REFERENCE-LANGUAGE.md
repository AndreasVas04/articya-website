# REFERENCE-LANGUAGE.md

Measured from Andreas's five reference screenshots and two screen recordings.
Every number here was read off the actual pixels, not remembered.

This file is authoritative for composition. `DESIGN-SYSTEM.md` remains
authoritative for tokens, contrast floors and frozen mechanisms. Where they
disagree on layout, this file wins.

---

## A. The alternating section — measured from MNTN

The single most important pattern. It appears three times on MNTN and is the
model for ArtiCYa's offer panels.

### A1. Column geometry, desktop

| | value |
|---|---|
| Text column width | **32%** of viewport |
| Photograph width | **29%** of viewport |
| Gap between them | **10%** of viewport |
| Outer margin, text side | **17%** |
| Outer margin, photo side | **12%** |
| Section height | **1.0 viewport**, never pinned |

Sides **alternate**: section 01 text-left/photo-right, section 02
photo-left/text-right, section 03 text-left/photo-right.

**Built, and the pin is gone with it.** ArtiCYa's panels were 200svh sections
with the frame stuck to the viewport for a full screen of scroll. That bought
nothing the composition was not already doing — the photograph's −12svh lift
and the numeral's overlap are what break the horizontal band — and cost two
screens in which nothing on the page moved. Each panel is now `min-h-svh`,
scrolled straight through, and home lost 1800px at 1440×900 and 1531px at
390×844 for it. The layout is the one reduced motion always saw.

**This geometry also settles what the panels cannot take.** The heading and the
photograph are in different columns by construction, so "type inside the depth"
(§6 of ART-DIRECTION) has nowhere to land here: vertical occlusion needs the
type *on* the picture, and horizontal occlusion eats whole letters — burying
enough of the Training Courses heading to read, ~110px at 85px type, hides the
"T" and the "C" outright, and both lines are left-aligned to the same x. The
device belongs to full-bleed frames. Do not buy it by moving this geometry: the
alternation is worth more than one occlusion.

### A2. The photograph

**The photograph in an alternating section is an object standing on ground. It
is not the section's background.** That sentence is the rule; every number
below is a way of holding it.

An object is something the eye takes in whole, with floor visible around it. A
background is something the frame runs out of. The moment a photograph reaches
an edge of the window it has stopped being the first and become the second —
and this section already has a background: §A6, solid dark, no photograph
behind it at all. Two grounds in one section is one too many, and the one that
loses is the picture, because a picture that fills the screen has nothing left
to be *placed* against.

| | value |
|---|---|
| Aspect ratio | **3:4 portrait** |
| Width | **29% of the viewport width** — this is the measurement that governs |
| Height | whatever the width and the ratio give: **38.7% of the viewport width** |
| Vertical offset | starts **~12% of a viewport ABOVE** the text block's top edge |
| Border / ring / shadow / radius | **none**, all four |

**The frame is measured against the window, never against the section.** That
is the part that has to survive being copied into a layout with different
proportions, and it is the part that was lost. Write the size as a fraction of
the section's height and the same rule produces a different picture in every
section it is used in; write it as a fraction of the viewport's width and it
produces the same picture everywhere, because the window is what the reader is
looking at and the section is only how far they have to scroll.

**The test, at any section height.** At the scroll position where the frame
comes to rest, both must hold:

1. **Ground on all four sides.** Unbroken section ground between every edge of
   the photograph and every edge of the window.
2. **Not more than two thirds of the window's height.** Past that the ground
   above and below stops reading as floor and starts reading as a band, which
   is §3's own rejected item.

The width rule produces both on its own at any normal window ratio — the second
is how you check the first is still the one in charge. If either fails, the
photograph has become a ground and the composition is a full-bleed one, which
is a different section with different rules.

**Where 86% came from, and why it does not transfer.** This table used to read
*Height — 86% of section height*. That number is real and it was measured off
MNTN correctly. It does not survive the journey, because **MNTN's alternating
sections are 43.5vw tall and ArtiCYa's are a full viewport**. On MNTN, 86% of
43.5vw is 37.4vw, which is the same frame the 29% column gives at 3:4 — the two
numbers describe one picture and either can be used. On a full-viewport section
86% is 86vh: at 1440×900 a photograph 787px tall in a 900px window, 1.4× the
frame the column gives, touching the top and bottom of the screen. Read as a
target, the height rule builds the background this section is not allowed to
have. See §8 of `ART-DIRECTION.md`.

It survives as a **ceiling** and nothing else — the case where the window is
wide enough that a 29% column would stand the picture taller than its own
section. That is what `min(100%, 64.5svh)` in `globals.css` is: the same 86%
turned around at 3:4, binding only above about a 2.2:1 window and idle below
it, where the column is the smaller number and decides.

**As built**, and the numbers to check against: at 1440×900 the frame is
**29.0vw × 61.9vh** — 417.6 × 556.8 — which is 61.9% of the section, with
20.5% of the section as ground above it and 17.6% below. On a phone the layout
stacks and the frame is 66.1vw × 40.7vh, 38–40% of its section. Both clear the
test at both viewports.

The vertical offset is the other half of the composition and is separate from
all of the above: the photograph is not aligned to the text — it enters the
section earlier and breaks the horizontal band. That is what stops the pair
reading as a row of a grid.

### A3. The ghosted numeral

| | value |
|---|---|
| Position | **IN FRONT of** the heading, not behind |
| Overlap | the numeral's right ~40% sits under the heading's first word |
| Size | **2.6×** the heading's cap height |
| Colour | cream at **8%** alpha |
| Baseline | numeral's vertical centre aligns with the **eyebrow row**, i.e. ABOVE the heading |
| Font | same display face, weight 700 |

Currently ArtiCYa paints it behind and centred on the heading. Wrong on both.

### A4. The eyebrow row

Reading left to right: **numeral** → **rule** → **eyebrow text**.

| | value |
|---|---|
| Rule | 1.25px, amber, **48px** long |
| Rule position | to the **LEFT** of the eyebrow text, on the same baseline |
| Eyebrow | 11px, letter-spacing **0.22em**, uppercase, amber |
| Gap rule→text | 14px |

Currently ArtiCYa puts the rule ABOVE the heading. Wrong axis.

### A5. Typography inside the section

| | value |
|---|---|
| Heading | **2 lines**, forced. Never 1, never 3. |
| Heading size | register B — **3.5%** of viewport width |
| Heading line-height | **1.12** |
| Body | 5 lines max, width **44ch** |
| Body size | ~62% of heading size |
| Link | lowercase `read more` + **34px arrow rule**, amber |

The 5.9% this table carried was the heading's *em size* read off the capture
(40px in 683px). Re-measured by cap height — 16px, which is a 24px font, ≈46px
at 1440 — MNTN's section heading is **3.2%**, and every other beside-the-
paragraph heading in the set lands 3.2–5.0%. 5.9% put ArtiCYa's panel titles
half again larger than the reference they were measured from. See §H.

### A6. Ground

Solid dark. **No photograph behind the section at all.** The photograph in the
section is the only image. This is the alternation ArtiCYa lost when every
quiet zone went to 0.00 — MNTN's quiet zones are quiet *because* the hero above
them was loud.

---

## B. The frosted panel — measured from Trafalgar

Used where text must sit ON a photograph rather than beside it.

| | value |
|---|---|
| Panel width | **38%** of viewport |
| Panel height | **86%** of viewport |
| Panel top | flush to viewport top, no gap |
| Backdrop | `backdrop-filter: blur(22px)` |
| Fill | vertical gradient, **rgba(ground, 0.18)** at top → **rgba(ground, 0.62)** at bottom |
| Edges | **hard vertical cut** on both sides — not feathered |
| Border | none |

The photograph continues **unblurred** on both sides of the panel. The panel is
a window onto the same picture, softened.

Text inside: heading at **8.6%** of viewport width, uppercase, 2 lines.
Body 4 lines at 44ch. Button is a **white rectangle with dark text**, 
width 42% of panel.

### B1. The vertical ghost word

| | value |
|---|---|
| Position | left edge, **x = 2.1%** of viewport |
| Orientation | `writing-mode: vertical-rl`, reading bottom-to-top |
| Size | **4.2%** of viewport width |
| Letter-spacing | **0.34em** |
| Colour | cream at **14%** |
| Vertical span | centred, spans ~78% of viewport height |

ArtiCYa has this. It is currently too small and too faint. Raise to these values.

---

## C. The split — measured from Forest Excursions and Grand Canyon

One photograph, two treatments, **hard vertical seam at 48%**.

| | value |
|---|---|
| Seam position | **48%** from left |
| Seam | 1px cream at 30% alpha — a visible line, deliberate |
| Left treatment | same image, `blur(18px) brightness(0.72)` |
| Right treatment | same image, sharp, unmodified |
| Scene border | 1.25px cream at 40%, **around the whole scene**, radius 4px |
| Scene inset | 12% from viewport edges on all sides |

Grand Canyon differs in one way worth copying: its **right side carries a
vertical rail with the section number** at x=93%, a 1px vertical line with
`01` beside it.

Text sits on the **left, blurred** side:
- heading **7.4%** of viewport width, 2 lines
- a **1px rule under the heading, 62% of the text column width**
- link below the rule, centred on the rule's width

ArtiCYa's "What you gain" currently has a *gradient* ramp with no seam. The
reference has a **hard seam**. Change it.

---

## D. The organic mask — measured from Ергаки

Where a photograph must end, it ends on **a shape, never a straight line**.

Two masks in the reference:
1. **Pine silhouette** — the hero photograph's bottom edge is a row of
   irregular conifer silhouettes, ~14% of the photograph's height, 
   ~9 trees across the viewport, varying heights.
2. **Torn paper** — the second image has ragged edges on all four sides,
   irregularity amplitude ~3% of the image's width.

Implement as `mask-image` with an SVG shape. Never `border-radius`, never a
gradient fade.

---

## E. Motion — measured from the two recordings

### E1. Dissolve to black and rebirth (s3, "Cabin Fever")

The defining move. Sequence over ~3 viewport heights:

| scroll | plate opacity |
|---|---|
| 0.0 | 1.00 — photograph full |
| 0.6 | 0.35 |
| 1.0 | **0.00** — pure dark ground, text alone |
| 1.6 | 0.00 — held |
| 2.0 | 0.35 — next photograph rising |
| 2.6 | 1.00 — next photograph full |

Crossfade duration: **1.0 viewport height** per direction.
The photograph also **scales 1.06 → 1.00** as it arrives.
Text on the dark passage is **clock-based**, never scrubbed.

### E2. The vertical wipe (s7, travel site)

Between destinations the new photograph enters as a **vertical wipe from the
bottom**, not a crossfade:

| | value |
|---|---|
| Direction | bottom → top |
| Duration | **900ms** |
| Easing | `cubic-bezier(0.76, 0, 0.24, 1)` |
| Implementation | `clip-path: inset(100% 0 0 0)` → `inset(0 0 0 0)` |

### E3. Type inside the depth (s7)

The destination name sits **behind foreground objects** in the photograph — 
behind a tree, behind a ridgeline. Implemented by splitting the photograph into
two layers with the type between them.

| | value |
|---|---|
| Type size | **26%** of viewport width — enormous |
| Weight | 800 |
| Colour | cream, no shadow, no scrim |
| Position | vertically centred, horizontally centred |
| Foreground layer | a masked copy of the same photograph, ~30% of its height from the bottom |

### E4. Title transformation (s7)

When a destination section ends, its huge title **scales down and moves** to
become the small label of the section below.

| | value |
|---|---|
| Scale | 1.00 → **0.16** |
| Duration | 800ms |
| Path | centre → bottom-left, ending at x=6%, y=88% |
| Easing | `cubic-bezier(0.65, 0, 0.35, 1)` |

This is a single element animating, not two elements crossfading.

---

## F. Rhythm — the rule that governs all of the above

Reading down any reference page, the ground alternates:

**LOUD → QUIET → LOUD → QUIET → LOUD**

- LOUD = photograph at **1.00**
- QUIET = clean dark ground at **0.00**

**Never two QUIET zones in a row.** Every LOUD zone must be **≥ 0.8 viewport
heights** so it registers as a breath, not a flash.

### F1. Home, as built

The ledger is polarised: 1.00 or 0.00 and no value in between held anywhere.
0.90 was struck out with the rest — a photograph at 0.90 is a picture with a
veil on it, not a picture and not a floor. Sampled every quarter viewport down
the page:

| zone | ground | carries |
|---|---|---|
| hero | **1.00** | headline, label, intro |
| clearing + panel 01 | **0.00** | heading, lead, ledger, panel prose |
| the road | **1.00** | the statement the panel above ends on |
| panel 02 | **0.00** | panel prose |
| what you gain | **1.00** | heading, four lines |
| closing | **0.00** | statement, line, CTA |

**Every sample is 1.00 or 0.00 on desktop** (0 of 27 in between). One sample on
a phone reads 0.07, inside the finale's own 0.74-viewport dissolve. Nothing is
*held* between 0.05 and 0.90 anywhere on the page.

The road passage is the one screen where words stand on a photograph at full
strength, and two numbers make that possible. Its four zone keys give ramps of
0.18 viewport each, holding the plate under 0.35 for as long as either panel's
prose is on screen, and ≥0.9 for 0.87 of a viewport (desktop) / 0.80 (mobile) —
the floor above, with no headroom left. And `.stage-plate-shade` releases to
**62%** through the middle rather than 16%: a scrolling block passes through
every row of the window, so the plate's own full-width ramp has to carry the
type everywhere, not only where it comes to rest. At 16% cream measured 1.31 on
the brightest pixel of that road against a 4.5 floor.

### F2. No screen without words

The corollary of F, and the harder half. A LOUD zone with nothing written on it
is a stall however short it is kept. Home has none now: the longest stretch on
the page with nothing painted is **175px desktop / 225px mobile** — 0.19 and
0.27 of a viewport, the handover while one clock entrance has left and the next
has not yet fired. It was 0.98 of a viewport before the road took its sentence.

Text may only be given to a new zone that is **adjacent to it in the document**
— `scripts/verify-text-parity.mjs` compares each page's whole visible text as
one ordered string, so a line that moves across the order fails parity on that
page. The road's sentence works because the passage sits immediately after the
first panel in the markup. Nothing else on home could have been put there.

---

## G. What is forbidden, restated

- No local shape behind text — no rectangle, oval, blob, tile or card fill.
- No horizontal line where one background meets another.
- No plate strength between 0.05 and 0.74.
- No amber as body text. Amber is a mark: rules, underlines, the CTA fill.
- No photograph that has been cropped below 60% of its frame area.
- No brightness filter used to fix contrast. Use plate strength.
- No section pinned longer than 1.2 viewports.
- No passage over 1.0 viewport where only the background changes.

---

## H. The two type registers

Every site in the set runs two, about 4× apart, with nothing between them.

| register | what it is | reference | ArtiCYa |
|---|---|---|---|
| **A — title bound to a photograph** | owns the frame it sits on; occluded by it, or read through it | Cabin Fever 14%, Namibia 20%, Slovakia 28% of viewport width | **14%** — the three inner-page h1s |
| **B — heading beside a paragraph** | labels the words under or next to it | MNTN 3.2%, Cabin Fever's dark passage 3.5%, Grand Canyon 4.8%, Forest 5.0% | **3.5%** — panel titles, section headings, the road statement |

ArtiCYa ran one ramp: 11.0% → 5.9% → 5.56% → 3.33% → 1.29%. The h1 was
stranded in it — too large to be a heading, half the size of a title that owns
a photograph, and only 1.9× the heading below it, so the eye had no gap to fall
through.

Coming down to 3.5% is **not** §3's rejected "display type at normal website
scale", and the measurement is the argument: at 1440 register B is 50px, 2.7×
the body copy, and register A is 202px.

Both registers live in `globals.css` as `.type-title` and `.type-heading`. The
panels' ghosted numeral rides register B by ratio — 2.498× the heading's own
size, which is 2.6× its cap height — so the two can never drift.

**The home hero is exempt.** It stays at 11% of viewport width. It is the one
frame that is signed off, and its headline is bound into the photograph's depth
already, which is what register A is for.
