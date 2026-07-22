# Typography audit — what is on the page today

A description of the site as currently built, measured from the rendered
static export at 1440×900 and 390×844. Nothing here is a recommendation.
Where a number contradicts `DESIGN-SYSTEM.md`, the number is what the
browser reports.

The first pass of this audit found a bug rather than a design problem — the
body typeface was declared but never applied — and it has since been fixed.
Every number below is measured on the fixed build; the section that follows
records the bug, the fix, and which of this document's original findings the
fix changed.

## Method

The export in `out/` is served locally and walked in both viewports. Every
element holding its own text node is measured at the scroll position where
its centre sits nearest the viewport centre — the state a reader actually
sees it in. That matters on this site: the home hero expands under wheel
input rather than window scroll, and the offer panels and About scenes are
pinned, so a single scroll-0 snapshot reports geometry nobody ever sees. The
home hero was additionally driven with real wheel events until it reported
`data-expanded`, and measured there.

**Measure is reported as characters on the longest rendered line**, not as
an average. Average characters-per-line divides by the short final line and
under-reports the line a reader actually scans — on the FAQ answers the two
differ by up to 33 characters. The longest line is computed from the width
of each rendered line box and the mean character width across all of them.

188 text-element measurements, 22 composition blocks.

## The finding that reframed the rest: the body typeface was not loading

**Fixed.** This section records the bug, the fix and what re-measuring
showed. Every number elsewhere in this document is post-fix unless it is
labelled "before".

### The bug

Instrument Sans was applied to 20 of 188 measured text elements. 114
rendered in the browser's system UI stack. The mechanism was in
`app/globals.css`:

```css
@theme inline {
  --font-sans: var(--font-instrument-sans), ui-sans-serif, system-ui, sans-serif;
}

body { font-family: var(--font-sans); }
```

`@theme inline` tells Tailwind to inline the token into the utilities it
generates *instead of* emitting a `--font-sans` custom property. So the
`font-sans` utility class resolved correctly, but the hand-written
`body { font-family: var(--font-sans) }` read a variable that did not exist,
and body text fell through to Tailwind's preflight default. The only
elements getting Instrument Sans were the ten FAQ question headings, which
carry `font-sans` explicitly.

### The fix

The next/font variables moved from `<body>` to `<html>`, which lets the font
tokens leave `@theme inline` for a plain `@theme`. Tailwind now emits
`--font-sans` as a real custom property at `:root`, where it resolves
against `--font-instrument-sans` on the same element, so both the `font-sans`
utility and the `body` rule point at the same stack. Verified in the built
CSS: `--font-sans:var(--font-instrument-sans),ui-sans-serif,system-ui,sans-serif`.

Confirmed by rendered width rather than by computed strings — "Hamburgefonstiv
12345" set at 40px in each element's own resolved stack:

| Element | Before | After | Instrument Sans | system stack |
|---|---|---|---|---|
| FAQ answer `<p>` | **415.0px** | **436.5px** | 436.5px | 415.0px |
| FAQ question `<h3>` (`font-sans`) | 446.6px | 446.6px | 446.6px | 439.1px |

**All 188 elements now resolve to an intended family: 134 Instrument Sans,
54 Bricolage Grotesque, zero system stack.**

Layout shift on load is nil. next/font generates a metric-compatible
`Instrument Sans Fallback` from local Arial (`size-adjust: 102.74%`, with
ascent/descent overrides), so the swap moves nothing: with the webfont
delayed 600ms, the hero lede's box is pixel-identical before and after it
resolves (62px tall at 1440, 124px at 390 on every inner page). Worst CLS
across the four pages at both viewports is **0.0078** (FAQ at 390).

### What the wider face actually moved — much less than expected

The pre-fix note in this document predicted that measures "would shift
everywhere", on the grounds that Instrument is ~5% wider. **That prediction
was wrong, and the 5% figure was an artefact of the probe string.**
"Hamburgefonstiv 12345" is uppercase- and digit-heavy, which is exactly
where the two faces diverge most. Set in real lowercase prose, in the FAQ's
own 650px track at 16px, the two faces are within half a percent:

| FAQ answer | Total inline width, system | Total inline width, Instrument |
|---|---|---|
| "No. Erasmus+ projects cover the main costs…" | 2335px | 2332px |
| "Travel arrangements are usually organised by…" | 1350px | 1356px |
| "At the end of the project, participants…" | 1097px | 1104px |

So the face swap changed the *letterforms* far more than the *metrics*.
Across all 188 elements only **seven blocks re-wrapped** (listed under
Measure, below); everything else keeps its line count and its break points.

One caveat on the "before" column throughout: `system-ui` was measured in
headless Chromium, which need not resolve to the same face a visitor's
browser picks. That caveat applied equally to the pre-fix audit.

## Role inventory

Colour is given as the design-system token. `cplMax` is characters on the
longest rendered line.

### Display

| | 1440 | 390 |
|---|---|---|
| Where | Home hero title (two spans); About/FAQ/Contact `<h1>` | same |
| Font | Bricolage Grotesque 600 | Bricolage Grotesque 600 |
| Size | 72px | 44px |
| Line-height | 75.6px (1.05) | 46.2px (1.05) |
| Letter-spacing | −1.44px (−0.02em) | −0.88px (−0.02em) |
| Colour | `ink` | `ink` |
| Alignment | centre | centre |
| Container | inner-page hero block is content-driven, not a fixed column: 672px (About, Contact), 942px (FAQ) inside the 1152px band | 358px |
| Measure | "are ArtiCYa" 11ch · "About ArtiCYa" 13ch · "Frequently Asked Questions" 26ch · "Contact" 7ch | — |

The inner-page hero block is a `flex flex-col items-center` child, so its
width is shrink-to-fit. On About and Contact the lede's `max-w-2xl` (672px)
sets it; on FAQ the headline itself is wider (942px) and sets it instead.

### Showpiece

| | 1440 | 390 |
|---|---|---|
| Where | Home closing line; Contact "Get in touch" | same |
| Font | Bricolage Grotesque 600 | Bricolage Grotesque 600 |
| Size | 60px | 36px |
| Line-height | 69px (1.15) | 41.4px (1.15) |
| Letter-spacing | −0.6px (−0.01em) | −0.36px |
| Colour | `resin-deep` (home) · `ink` (contact) | same |
| Alignment | centre | centre |
| Container | 768px (home, `max-w-3xl`) · 896px (contact, `max-w-4xl`) | 358px |

### Section heading (H2)

| | 1440 | 390 |
|---|---|---|
| Where | Home "What we do", "What you gain"; Home offer-panel titles (`<h3>`) | same |
| Font | Bricolage Grotesque 600 | Bricolage Grotesque 600 |
| Size | 48px | 32px |
| Line-height | 52.8px (1.1) | 35.2px (1.1) |
| Letter-spacing | −0.48px (−0.01em) | −0.32px |
| Colour | `ink` | `ink` |
| Alignment | left ("What we do", panel titles) · centre ("What you gain") | left / centre |
| Container | 536px in the 6-col track · 1152px band · 576px panel block | 358px |

### Group heading (FAQ rail)

| | 1440 | 390 |
|---|---|---|
| Where | FAQ question-group headings (`<h2>`) | same |
| Font | Bricolage Grotesque 600 | Bricolage Grotesque 600 |
| Size | 24px | 24px |
| Line-height | 30px (1.25) | 28.8px (1.2) |
| Letter-spacing | normal | normal |
| Colour | `ink` | `ink` |
| Alignment | left, in a 352px sticky rail | left |

The one role that does not change size between viewports.

### Trail item

| | 1440 | 390 |
|---|---|---|
| Where | Home gains sequence, 4 items | same |
| Font | Bricolage Grotesque 600 | Bricolage Grotesque 600 |
| Size | 36px | 24px |
| Line-height | 43.2px (1.2) | 28.8px (1.2) |
| Letter-spacing | normal | normal |
| Colour | `ink` | `ink` |
| Alignment | alternating: right, left, right, left | left |
| Container | 576px columns | 294px |

### Stat numeral

| | 1440 | 390 |
|---|---|---|
| Where | Home stats ledger, 3 columns | same |
| Font | Bricolage Grotesque 600 | Bricolage Grotesque 600 |
| Size | 104px | 44px |
| Line-height | 104px (1.0) | 44px (1.0) |
| Letter-spacing | normal | normal |
| Colour | `ink` | `ink` |
| Alignment | centre in a 373px column | ledger row, numeral/label baseline |

### Hero statement

| | 1440 | 390 |
|---|---|---|
| Where | Home hero mission line only | same |
| Font | Bricolage Grotesque **500** | Bricolage Grotesque **500** |
| Size | 20px | 15px |
| Line-height | 27px (1.35) | 20.25px (1.35) |
| Letter-spacing | −0.2px (−0.01em) | −0.15px |
| Colour | `ink` | `ink` |
| Alignment | centre | centre |
| Container | 736px (`max-w-[46rem]`), fills it | 339px of a 480px max |
| Measure | **2 lines**, cplMax 60 | **3 lines**, cplMax 46 |

Measured in the expanded card. The line counts match what
`DESIGN-SYSTEM.md` specifies exactly (2 desktop, 3 mobile).

### Lede

| | 1440 | 390 |
|---|---|---|
| Where | Inner-page hero ledes; Home "What we do" lead; Home closing paragraph; About finale closing text | same |
| Font | Instrument Sans 400 | Instrument Sans 400 |
| Size | 20px | 20px |
| Line-height | 31px (1.55) | 31px (1.55) |
| Letter-spacing | normal | normal |
| Colour | `ink` (hero ledes, closing) · `ink-soft` ("What we do" lead) | same |
| Alignment | centre (heroes, closing) · left ("What we do" lead) | same |
| Container | 672px (`max-w-2xl`) · 536px (6-col track) | 358px |
| Measure | 72–77ch centred · 56ch left | 37–42ch |

The only role that does not shrink between viewports — 20px at both.

### Body

| | 1440 | 390 |
|---|---|---|
| Where | FAQ answers; Home offer-panel copy; About scene paragraphs | same |
| Font | Instrument Sans 400 | Instrument Sans 400 |
| Size | 16px (FAQ) · 20px (offer panels, About scenes) | 16px |
| Line-height | 27.2px (1.7) FAQ · 31px (1.55) panels/scenes | 27.2px (1.7) |
| Letter-spacing | normal | normal |
| Colour | `ink-soft` (FAQ) · `ink` (panels, scenes) | same |
| Alignment | left | left |
| Container | 650px (FAQ) · 576px (panels) · 1152px band, text 462–560px (About) | 356px |
| Measure | **76–83ch** (FAQ) · 41–63ch (panels) · 53–65ch (About) | 40–50ch |

At 1440 the offer panels and About scenes run at the 20px Lede step, not at
16px Body. Only FAQ uses 16px on desktop.

### Caption

| | 1440 | 390 |
|---|---|---|
| Where | Footer copyright | same |
| Font | Instrument Sans 400 | same |
| Size | 14px | 14px |
| Line-height | 20px (1.43) | 20px |
| Colour | `ink-soft` | `ink-soft` |
| Alignment | left, inside a centred 1024px band | left |
| Measure | 36ch | 36ch |

### Eyebrow / label

| | 1440 | 390 |
|---|---|---|
| Where | Stat labels; Contact channel labels | same |
| Font | Instrument Sans 600 | same |
| Size | 13px | 13px |
| Line-height | 18.2px (1.4) | 18.2px |
| Letter-spacing | +1.04px (+0.08em) | +1.04px |
| Transform | uppercase | uppercase |
| Colour | `ink-soft` | `ink-soft` |
| Alignment | centre | left (stats) / centre |

### Nav

| | 1440 | 390 |
|---|---|---|
| Where | Header nav links | mobile panel |
| Font | Instrument Sans 600 | same |
| Size | 13px | 13px |
| Line-height | 18.2px (1.4) | 18.2px |
| Letter-spacing | +1.04px (+0.08em) | +1.04px |
| Transform | uppercase | uppercase |
| Colour | `bark` resting · `resin-deep` active/hover | same |

Identical to the eyebrow/label role in every metric; only colour separates
them.

### Button

| | 1440 | 390 |
|---|---|---|
| Where | Home hero CTA; Home closing CTA | same |
| Font | Instrument Sans 600 | same |
| Size | 14px | 14px |
| Line-height | 20px (1.43) | 20px |
| Letter-spacing | +0.28px (+0.02em) | +0.28px |
| Transform | none | none |
| Colour | `ink` on `amber-fill` | same |
| Box | 128px wide | 128px wide |

### Roles that do not fit the documented scale

**Brand wordmark** — Bricolage 600, 20px at 1440 / 18px at 390, lh 28px,
ls −0.2px, `ink`, no uppercase and no tracking. Correct per the brand-name
rule, but 18px and 20px are steps that exist nowhere else in the scale.

**Hero hint pill** — "ArtiCYa Cyprus", 13px Instrument 600, lh 18.2px,
letter-spacing **normal**, `ink`. The Label step with its tracking and
uppercase dropped, per the brand-name rule.

**Contact channel value** — "articya4youth@gmail.com" and the two handles.
16px system **600**, lh 24px (1.5), ls normal, `ink`, centred. Body size at
a heading weight; this pairing appears nowhere else on the site.

---

## 1. What type scale is actually in use?

Every distinct rendered size, sorted, with the family and weight it appears
at and the role it carries.

### At 1440

| px | Family / weight | Role | In `DESIGN-SYSTEM.md`? |
|---|---|---|---|
| 104 | Bricolage 600 | Stat numeral | ✅ `clamp(3.25rem, 8vw, 6.5rem)` tops out at 104 |
| 72 | Bricolage 600 | Display | ✅ `clamp(2.75rem, 6vw, 4.5rem)` tops out at 72 |
| 60 | Bricolage 600 | Showpiece | ✅ `clamp(2.25rem, 5vw, 3.75rem)` tops out at 60 |
| 48 | Bricolage 600 | H2 + offer-panel titles | ✅ `clamp(2rem, 4vw, 3rem)` tops out at 48 |
| 36 | Bricolage 600 | Trail item | ✅ `clamp(1.5rem, 2.5vw, 2.25rem)` tops out at 36 |
| 24 | Bricolage 600 | FAQ group heading | ✅ H3, `1.5rem` |
| 20 | Bricolage 600 | Brand wordmark | ❌ **undocumented step** |
| 20 | Bricolage 500 | Hero statement | ✅ documented at `1.25rem` desktop |
| 20 | Instrument 400 | Lede | ✅ Lede, `1.25rem` |
| 16 | Instrument 600 | FAQ question **and** Contact channel value | ❌ **undocumented** — H3 is documented as 24px Bricolage, and the contact value has no step at all |
| 16 | Instrument 400 | Body | ✅ Body, `1rem` |
| 14 | Instrument 600 | Button label | ❌ **undocumented step** |
| 14 | Instrument 400 | Caption | ✅ Caption, `0.875rem` |
| 13 | Instrument 600 | Label, eyebrow, nav | ✅ Label, `0.8125rem` |

**14 distinct size/family/weight combinations across 10 distinct pixel
sizes** (15 before the fix — 16px system 600 and 16px Instrument 600 were
the same step described twice).

### At 390

| px | Family / weight | Role |
|---|---|---|
| 44 | Bricolage 600 | Display **and** Stat numeral |
| 36 | Bricolage 600 | Showpiece |
| 32 | Bricolage 600 | H2 + offer-panel titles |
| 24 | Bricolage 600 | Trail item **and** FAQ group heading |
| 20 | Instrument 400 | Lede |
| 18 | Bricolage 600 | Brand wordmark |
| 16 | Instrument 600 | FAQ question **and** Contact channel value |
| 16 | Instrument 400 | Body |
| 15 | Bricolage 500 | Hero statement |
| 14 | Instrument 600 | Button label |
| 14 | Instrument 400 | Caption |
| 13 | Instrument 600 | Label, eyebrow, nav |

**12 combinations across 10 pixel sizes** (13 before the fix, for the same
reason).

### Divergences from the documented scale

1. **The `clamp()` ladder is correct at both ends.** Every clamped step
   lands exactly on its documented maximum at 1440 and interpolates as
   specified at 390. No clamp is mis-specified.
2. **H3 does not exist as documented.** `DESIGN-SYSTEM.md` defines H3 as
   `1.5rem` Bricolage 600 for "card and block headings". On the built site
   24px Bricolage appears only as the FAQ *group* heading. The two roles
   that are structurally H3s — the home offer-panel titles and the FAQ
   question headings — use neither: the panel titles render at the **H2**
   step (48px Bricolage), and the FAQ questions render at **16px Instrument
   600**, the Body size.
3. **Four sizes carry roles the scale does not document**: 20px Bricolage
   600 (wordmark), 18px Bricolage 600 (wordmark, mobile), 16px Instrument 600
   (contact values), 14px Instrument 600 (button labels).
4. **The Lede step never shrinks.** 20px at 1440 and 20px at 390 — the only
   role in the system that is viewport-invariant while everything around it
   scales. At 390 the Lede (20px) is larger than the Body (16px) by the same
   ratio as at 1440, but it now sits 4px under the mobile Body of the offer
   panels, which also render at 16px.

### Near-duplicates

| Sizes | Distance | Doing the same job? |
|---|---|---|
| 13px label / 14px caption / 14px button | 1px | Three roles inside 1px. The 13px label and 14px caption differ in size by 1px, in weight by 200, and in tracking by 0.76px. |
| 16px Instrument 400 / 16px Instrument 600 | 0px | **Two roles at one size**, now separated by weight alone. Before the fix this was a three-way collision at 16px whose third member, the FAQ question, was distinguished only by the family accident. |
| 20px Bricolage 600 / 20px Bricolage 500 / 20px Instrument 400 | 0px | **Three roles at one size**: wordmark, hero statement, Lede. Unchanged by the fix — the separation was already family plus weight. |
| @390: 44px Display / 44px Stat numeral | 0px | The page's largest type serves two unrelated roles at the same size. |
| @390: 24px Trail item / 24px FAQ group heading | 0px | Same size, same family, same weight, different roles on different pages. |
| @390: 15px hero statement / 16px Body | 1px | Bricolage 500 against Instrument 400, 1px apart. |

At 390 the scale has compressed enough that **six roles collide onto three
sizes** (44, 24, 16).

**What the fix changed here:** one collision was retired, and no new one
appeared. At 1440 the combination count drops from 15 to 14 and at 390 from
13 to 12 — in both cases because 16px system 600 (the contact channel value)
and 16px Instrument 600 (the FAQ question) were two combinations describing
one size and weight, and are now literally the same combination. The
distinct *pixel* sizes are unchanged at 10 in both viewports. Nothing that
was separate has merged in a way that costs a distinction: the contact value
and the FAQ question never appear on the same page.

---

## 2. Where is the measure wrong?

Threshold: over ~75 characters or under ~45, on the longest rendered line.

### At 1440 — over 75

| Page · block | cplMax | Before | Size | Container |
|---|---|---|---|---|
| FAQ — "Travel arrangements are usually organised by…" | **83** | 83 | 16px | 650px |
| FAQ — "No. Erasmus+ projects cover the main costs…" | **82** | 81 | 16px | 650px |
| FAQ — "Participants gain international experience…" | **82** | 82 | 16px | 650px |
| FAQ — "At the end of the project, participants…" | **81** | 81 | 16px | 650px |
| FAQ — "If selected, you will receive detailed…" | **81** | 81 | 16px | 650px |
| FAQ — "Erasmus+ opportunities are open to young…" | **80** | 80 | 16px | 650px |
| FAQ — "No previous experience is required…" | **78** | 78 | 16px | 650px |
| FAQ — "Each opportunity has its own application…" | **78** | 78 | 16px | 650px |
| Contact — hero lede | **77** | 77 | 20px | 672px |
| FAQ — "Yes. Projects are organised by accredited…" | **76** | 76 | 16px | 650px |
| FAQ — "Erasmus+ is a European Union programme that…" | 75 | **81** | 16px | 650px |

**Nine of the eleven FAQ answers still exceed 75 characters**, plus the
Contact hero lede — ten blocks over the line, against eleven before. Worst
on the site is unchanged at 83. The cause is structural and the face swap
did not touch it: the answers sit in a 650px track at 16px, while every
other 16px block on the site sits in a 576px track or narrower.

**Which blocks crossed the line, in either direction:** exactly one moved.
"Erasmus+ is a European Union programme that…" dropped from 81 to 75 and is
now under the threshold. **No block newly crossed above 75.** One more
shifted without crossing: "No. Erasmus+ projects cover the main costs…" went
81 → 82. Every other block over 75 holds its exact previous number.

Just under the line and worth the number: FAQ "Erasmus+ is a European Union
programme…" **75**, About finale closing text **74**, About hero lede
**73**, FAQ hero lede **72**, Home closing paragraph **72**.

### The seven blocks that re-wrapped

The complete list of line-count changes across both viewports — the whole
material effect of the swap on layout:

| Page · viewport | Block | Lines |
|---|---|---|
| home @1440 | "We work with young people in Cyprus and across Europe…" (Lede, 20px) | 3 → **4** |
| home @1440 | "Travel across Europe with all expenses covered…" (panel, 20px) | 1 → **2** |
| home @390 | "International group experiences for young people…" (panel, 16px) | 4 → **5** |
| about @1440 | "Over the years, the organization has demonstrated…" (20px) | 4 → **5** |
| about @1440 | "and to create safe, open and respectful spaces for…" (20px) | 3 → **2** |
| about @1440 | "fostering European values, solidarity and lifelong…" (20px) | 1 → **2** |
| about @390 | "fostering European values, solidarity and lifelong…" (20px) | 2 → **3** |

Six gained a line and one lost one. All seven are 16–20px prose in flexible
containers; none is a headline, a numeral, a button or a nav label, and none
sits on a fixed track.

### At 1440 — under 45 (prose only)

| Page · block | cplMax | Note |
|---|---|---|
| Home — offer panel "Participate through workshops…" | **41** | 519px box at 20px |
| Home — offer panel "No prior experience needed." | 19 | 27-character sentence; container is not the constraint |
| Footer — copyright | 36 | 36-character string |

Only one genuine short-measure case at 1440: the second Youth Exchanges
paragraph at 41.

### At 390

Nothing exceeds 75. The longest line on the whole site at 390 is **50**
(Home offer panel 1) — unchanged by the face swap. Twenty-two prose blocks
measure under 45, ranging 32–44.

This is a ceiling, not a choice: at 390 with 16px in a 356px column the
maximum achievable line is ~50 characters, and at 20px it is ~42. **No
mobile prose block can reach 45 characters at the current sizes**, so the
under-45 count at 390 is a property of the viewport and the type size, not
of the containers.

### Container widths, for reference

| Container | Width @1440 | Used by |
|---|---|---|
| `max-w-6xl` | 1152px | Site content column: header, most sections |
| FAQ answer track | 650px | FAQ answers (7 of 12 grid columns) |
| `max-w-4xl` | 896px | Contact "Get in touch" band |
| `max-w-3xl` | 768px | Home closing showpiece |
| `max-w-2xl` | 672px | Hero ledes, closing paragraph, About finale text |
| Offer panel block | 576px | Both offer panels |
| `max-w-[46rem]` | 736px | Hero statement |
| Footer band | 1024px | Footer |

`DESIGN-SYSTEM.md` states "text blocks max `65ch`". No container on the site
is expressed in `ch`, and the FAQ answer track renders at up to 83ch.

---

## 3. Where is hierarchy flat?

### Same size, weight-only separation

**FAQ question vs FAQ answer** — the flattest pair on the site.

| | Question | Answer |
|---|---|---|
| Size | 16px | 16px |
| Weight | 600 | 400 |
| Family | Instrument Sans | Instrument Sans |
| Line-height | 22.4px (1.4) | 27.2px (1.7) |
| Colour | `ink` | `ink-soft` |

Identical size. Separation is carried entirely by weight, colour and the
accordion's own border.

**This pair got flatter, and it is the one place the fix cost a
distinction.** Before, the question and the answer were set in two different
typefaces — the only place on the site where two adjacent text levels were —
and that mismatch was doing real separating work, accidentally. With both
now in Instrument Sans, the pair is down to weight (600 vs 400), colour
(`ink` vs `ink-soft`) and line-height. It is the flattest pair on the site
and the strongest remaining candidate for a designed fix.

**Contact channel label vs value** — 13px/600 uppercase against 16px/600.
3px of size difference, **same weight**, both inside the same card. The
uppercase transform and tracking do most of the separating.

### Same size, different level

**Home H2 vs offer-panel title** — "What we do" (`<h2>`) and "Youth
Exchanges" (`<h3>`) both render at **48px Bricolage 600** with identical
line-height, tracking and colour. Two semantic levels, one visual level.
`DESIGN-SYSTEM.md` sanctions this ("Section headings; home offer-panel
titles" share the H2 step), so it is documented rather than accidental — but
on the page it means the home page has no visual level between its section
headings and its panel titles.

**Contact "Get in touch" vs Home "What we do"** — both are the top heading
of the page's one content section. Contact renders at **60px** (Showpiece),
home at **48px** (H2). The same structural level takes two different steps
on two pages.

### Adjacent levels too close to read as different levels

**@390: Display and Stat numeral both at 44px.** The hero headline and the
stats numerals — the two largest things on the page — are the same size on
mobile, with the same family and weight. Only line-height (46.2 vs 44) and
letter-spacing (−0.88 vs normal) differ.

**@390: Trail item and FAQ group heading both at 24px.** Different pages, so
never adjacent, but the two roles are indistinguishable in isolation.

**@390: hero statement 15px vs Body 16px.** 1px apart, different families
and weights.

**Label 13px vs Caption 14px vs Button 14px.** Three roles within 1px.
Button and Caption are the same size and differ only in weight (600 vs 400)
and tracking (0.28px vs normal).

### Where hierarchy is strong

For contrast, the ratios that read clearly: Stat numeral to its label is
104→13 (8:1); Display to Lede is 72→20 (3.6:1); Showpiece to the paragraph
above it is 60→20 (3:1); FAQ group heading to question is 24→16 (1.5:1,
and the only place a Bricolage/Instrument pairing separates two levels
cleanly).

---

## 4. How many weights are in play?

Element measurements, both viewports, 188 total.

| Family | Weight | Elements | Roles carried |
|---|---|---|---|
| Bricolage Grotesque | **600** | 52 of 54 | Display, Showpiece, H2, group heading, trail item, stat numeral, wordmark |
| Bricolage Grotesque | **500** | 2 of 54 | Hero statement only (one element per viewport) |
| Instrument Sans | **400** | 74 of 134 | Lede, Body, Caption |
| Instrument Sans | **600** | 60 of 134 | Label, eyebrow, nav, button, contact value, FAQ question |

**Three weights are in play — 400, 500 and 600 — which is exactly what
`DESIGN-SYSTEM.md` sanctions**, and no weight outside that set appears
anywhere.

Whether each earns its place, as measured:

- **Bricolage 600** carries seven roles and is unambiguously load-bearing.
- **Bricolage 500** exists for exactly one element, the home hero
  statement, at two viewports. This is precisely what the design system
  specifies ("500 is Bricolage only, and only for the home hero statement").
  It earns its place by the letter of the rule; it is also the single
  narrowest use of any weight on the site.
- **Instrument Sans 400** carries the whole reading layer — Lede, Body and
  Caption, 74 elements. Before the fix it carried nothing at all.
- **Instrument Sans 600** carries the whole labelling layer — Label,
  eyebrow, nav, button and contact value — plus the FAQ question, 60
  elements. Before the fix it carried the FAQ question alone.

**Per family, in practice: Bricolage 2 weights, Instrument 2.** The intent —
Bricolage 500/600 and Instrument 400/600 — is now exactly what ships, and
the system UI stack has left the site entirely.

---

## 5. Composition census

Every section on every page. "Centred band" means a max-width container with
equal left and right gutters and its content centred or filling that band.
Gutters are measured at 1440.

| # | Page | Section | Composition @1440 | Content column | Gutters | @390 |
|---|---|---|---|---|---|---|
| 1 | all | Header | **Centred band** (full-bleed bar) | 1152px | 144 / 144 | full-width, space-between |
| 2 | home | Hero — expanding card | **Centred** (full-bleed photo, centred card) | statement 736px | centred | centred, 358px |
| 3 | home | What we do — text + globe | **Two-column, symmetric** | 1152px band, 536 + 536 | 144 / 144 | stacked, 358px |
| 4 | home | Stats ledger | **Centred band** (3 equal columns, each centred) | 1152px band, 373 × 3 | 144 / 144 | stacked ledger rows |
| 5 | home | Offer panel 1 — Youth Exchanges | **Full-bleed, asymmetric** (text left) | 576px block at L90 | 90 / 774 | stacked, 358px |
| 6 | home | Offer panel 2 — Training Courses | **Full-bleed, asymmetric** (text right) | 576px block at L774 | 774 / 90 | stacked, 358px |
| 7 | home | What you gain — heading | **Centred band** | 1152px band, `text-center` | 144 / 144 | centred, 358px |
| 8 | home | Gains trail | **Two-column, alternating** | 1152px band, 576 + 576 | 144 / 144 | single column, 294px |
| 9 | home | Closing lamp CTA | **Centred band** | 768px / 672px, `text-center` | 336 / 336 | centred, 358px |
| 10 | about | Page hero | **Centred band** | 672px, `text-center` | 384 / 384 | centred, 358px |
| 11 | about | Story scene 1 | **Two-column, asymmetric** (image 5 / text 6) | 467 + 560 in 1152px | 144 / 144 | stacked, 358px |
| 12 | about | Story scene 2 | **Two-column, asymmetric, flipped** | 560 + 467 | 144 / 144 | stacked, 358px |
| 13 | about | Story scene 3 | **Two-column, asymmetric** | 467 + 560 | 144 / 144 | stacked, 358px |
| 14 | about | Story scene 4 | **Two-column, asymmetric, flipped** | 560 + 467 | 144 / 144 | stacked, 358px |
| 15 | about | Story scene 5 | **Two-column, asymmetric** | 467 + 560 | 144 / 144 | stacked, 358px |
| 16 | about | Gallery finale — closing text | **Centred band** | 672px, `text-center` | 384 / 384 | centred, 358px |
| 17 | about | Gallery finale — mosaic | **Full-bleed** (3-col grid, edge to edge) | 1440px | 0 / 0 | 2-col grid, full-bleed |
| 18 | faq | Page hero | **Centred band** | 942px, `text-center` | 249 / 249 | centred, 358px |
| 19 | faq | Q&A groups | **Two-column, asymmetric** (rail 4 / answers 7) | 352 + 652 in 1152px | 144 / 144 | stacked, 358px |
| 20 | contact | Page hero | **Centred band** | 672px, `text-center` | 384 / 384 | centred, 358px |
| 21 | contact | Get in touch — cards | **Centred band** (3 equal cards) | 896px band, 283 × 3 | 272 / 272 | stacked, 358px |
| 22 | all | Footer | **Centred band** | 1024px, items centred | 208 / 208 | full-width, centred |

### Totals

| Composition | Count | Share |
|---|---|---|
| **Centred band / centred** | **11** | **50%** |
| Two-column (symmetric, asymmetric or alternating) | 8 | 36% |
| Full-bleed asymmetric | 2 | 9% |
| Full-bleed edge-to-edge | 1 | 5% |
| **Total blocks** | **22** | |

Counting the five About story scenes as one repeated pattern rather than
five blocks: **11 centred of 18 blocks = 61%.**

Excluding the two chrome bars, which have no compositional choice to make:
**9 centred of 20 = 45%** (or 9 of 16 = 56% with the scenes collapsed).

### Two further facts from the census

**At 390, the census collapses to a single answer.** Every two-column
layout stacks, every asymmetric panel becomes full-width, and every section
renders as one 358px column inside a 390px viewport (or full-bleed at 390).
**22 of 22 blocks are a single centred column at 390** — there is no
compositional variation on mobile at all.

**Every section on the site is a full-bleed element.** All 22 blocks span
the full 1440px viewport width; the composition differences above are
entirely a matter of what the inner container does. Only three blocks let
content actually reach the viewport edge: the two offer panels (on one side
each) and the About mosaic (both sides).

**The 1152px band dominates.** Eleven of the twenty-two blocks use
`max-w-6xl` with 144/144 gutters. Four more use a narrower centred band
(672, 768, 896, 1024). The site has six distinct content-column widths
across twenty-two blocks.
