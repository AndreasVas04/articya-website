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

A second pass then repaired the defects this document had measured — the FAQ
measure and hierarchy, the cross-page heading inconsistency, the undocumented
steps and the flat Contact label/value pair. **Every number in this document
is post-repair.** "Before" columns throughout mean the state after the
typeface fix and before the repair; the repair itself is recorded under
[What the corrective pass changed](#what-the-corrective-pass-changed).

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
then-650px track at 16px, the two faces are within half a percent:

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
| Container | inner-page hero block is content-driven, not a fixed column: 576px (About, Contact), 942px (FAQ) inside the 1152px band | 358px |
| Measure | "are ArtiCYa" 11ch · "About ArtiCYa" 13ch · "Frequently Asked Questions" 26ch · "Contact" 7ch | — |

The inner-page hero block is a `flex flex-col items-center` child, so its
width is shrink-to-fit. On About and Contact the lede's `max-w-xl` (576px)
sets it; on FAQ the headline itself is wider (942px) and sets it instead.
Narrowing the lede from `max-w-2xl` therefore narrows the whole hero block
on those two pages — the headline is unaffected, and the lede now sits
inside the headline's width rather than outside it.

### Showpiece

| | 1440 | 390 |
|---|---|---|
| Where | Home closing line — the only Showpiece on the site | same |
| Font | Bricolage Grotesque 600 | Bricolage Grotesque 600 |
| Size | 60px | 36px |
| Line-height | 69px (1.15) | 41.4px (1.15) |
| Letter-spacing | −0.6px (−0.01em) | −0.36px |
| Colour | `resin-deep` | same |
| Alignment | centre | centre |
| Container | 768px (`max-w-3xl`) | 358px |

### Section heading (H2)

| | 1440 | 390 |
|---|---|---|
| Where | Home "What we do", "What you gain"; Home offer-panel titles (`<h3>`); Contact "Get in touch"; FAQ question-group headings (`<h2>`) | same |
| Font | Bricolage Grotesque 600 | Bricolage Grotesque 600 |
| Size | 48px | 32px |
| Line-height | 52.8px (1.1) | 35.2px (1.1) |
| Letter-spacing | −0.48px (−0.01em) | −0.32px |
| Colour | `ink` | `ink` |
| Alignment | left ("What we do", panel titles, FAQ rail) · centre ("What you gain", "Get in touch") | left / centre |
| Container | 536px in the 6-col track · 1152px band · 576px panel block · 896px (Contact) · 452px FAQ sticky rail, 388px beside its icon | 358px |

One role, one size, on all four pages. Contact's "Get in touch" rendered at
the 60px Showpiece step and the FAQ group headings at 24px before the
repair; both are section headings and both now take H2.

### H3 (block heading)

| | 1440 | 390 |
|---|---|---|
| Where | FAQ questions (`<h3>`, the accordion summaries) | same |
| Font | Bricolage Grotesque 600 | Bricolage Grotesque 600 |
| Size | 24px | 24px |
| Line-height | 30px (1.25) | 30px (1.25) |
| Letter-spacing | normal | normal |
| Colour | `ink` | `ink` |
| Alignment | left, in a 552px card | left, 358px |

The one role that does not change size between viewports. Before the repair
the FAQ questions rendered at 16px Instrument 600 — the Body size — and H3
as documented existed nowhere on the site.

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
| Container | 576px (`max-w-xl`, inner-page hero ledes) · 672px (`max-w-2xl`, home closing) · 536px (6-col track) | 358px |
| Measure | 57–64ch centred · 56ch left | 37–42ch |

20px at both viewports, and deliberately so: the reading layer — Lede, Body,
Caption, Label — is viewport-invariant across the whole site, because
legibility is absolute where presence is relative. The Lede's ratio to Body
is 1.25× at 1440 and 1.25× at 390. See "Display type scales; reading type
does not" in `DESIGN-SYSTEM.md`.

### Body

| | 1440 | 390 |
|---|---|---|
| Where | FAQ answers; Home offer-panel copy; About scene paragraphs; Contact channel values | same |
| Font | Instrument Sans 400 | Instrument Sans 400 |
| Size | 16px (FAQ, Contact values) · 20px (offer panels, About scenes) | 16px |
| Line-height | 27.2px (1.7) FAQ · 31px (1.55) panels/scenes · 24px (1.5) Contact values | 27.2px (1.7) |
| Letter-spacing | normal | normal |
| Colour | `ink-soft` (FAQ) · `ink` (panels, scenes, Contact values) | same |
| Alignment | left · centre (Contact values on `md`+) | left |
| Container | 552px card, 502px text track (FAQ) · 576px (panels) · 1152px band, text 462–560px (About) | 356px |
| Measure | **59–70ch** (FAQ) · 41–63ch (panels) · 53–65ch (About) | 40–50ch |

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

### Roles outside the ramp, now named in the scale

**Brand wordmark** — Bricolage 600, 20px at 1440 / 18px at 390, lh 28px,
ls −0.2px, `ink`, no uppercase and no tracking. 18px and 20px Bricolage
appear nowhere else in the ramp; the wordmark is now a **named role** in
`DESIGN-SYSTEM.md` rather than an undocumented step, on the grounds that a
logotype is sized to its bar and not to the reading ramp.

**Button** — 14px Instrument 600, lh 20px, ls +0.28px (+0.02em on the filled
gold control), `ink` on `amber-fill`, no uppercase. Also now a **named
role**: a control label is a role, not a step of the prose ramp, and the
absence of uppercase is what keeps it from reading as a Label.

**Hero hint pill** — "ArtiCYa Cyprus", 13px Instrument 600, lh 18.2px,
letter-spacing **normal**, `ink`. The Label step with its tracking and
uppercase dropped, per the brand-name rule.

**Contact channel value** — folded onto Body. "articya4youth@gmail.com" and
the two handles now render 16px Instrument **400**, lh 24px (1.5), ls normal,
`ink`, centred on `md`+. Before the repair this was 16px **600** — Body size
at a heading weight, a pairing that appeared nowhere else on the site and
sat 3px from its own 13px/600 label.

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
| 48 | Bricolage 600 | H2 — section headings, offer-panel titles, Contact "Get in touch", FAQ group headings | ✅ `clamp(2rem, 4vw, 3rem)` tops out at 48 |
| 36 | Bricolage 600 | Trail item | ✅ `clamp(1.5rem, 2.5vw, 2.25rem)` tops out at 36 |
| 24 | Bricolage 600 | H3 — FAQ questions | ✅ H3, `1.5rem` |
| 20 | Bricolage 600 | Brand wordmark | ✅ **Wordmark**, a named role |
| 20 | Bricolage 500 | Hero statement | ✅ documented at `1.25rem` desktop |
| 20 | Instrument 400 | Lede | ✅ Lede, `1.25rem` |
| 16 | Instrument 400 | Body, incl. Contact channel values | ✅ Body, `1rem` |
| 14 | Instrument 600 | Button label | ✅ **Button**, a named role |
| 14 | Instrument 400 | Caption | ✅ Caption, `0.875rem` |
| 13 | Instrument 600 | Label, eyebrow, nav | ✅ Label, `0.8125rem` |

**13 distinct size/family/weight combinations across 10 distinct pixel
sizes** — down from 14, and **every one of them is now documented**. The
combination that left is 16px Instrument 600: the FAQ question went up to
H3 and the Contact value down to Body weight, so nothing renders at Body
size in a heading weight any more.

### At 390

| px | Family / weight | Role |
|---|---|---|
| 44 | Bricolage 600 | Display **and** Stat numeral |
| 36 | Bricolage 600 | Showpiece |
| 32 | Bricolage 600 | H2 — section headings, offer-panel titles, Contact heading, FAQ group headings |
| 24 | Bricolage 600 | Trail item **and** H3 (FAQ questions) |
| 20 | Instrument 400 | Lede |
| 18 | Bricolage 600 | Brand wordmark |
| 16 | Instrument 400 | Body, incl. Contact channel values |
| 15 | Bricolage 500 | Hero statement |
| 14 | Instrument 600 | Button label |
| 14 | Instrument 400 | Caption |
| 13 | Instrument 600 | Label, eyebrow, nav |

**11 combinations across 10 pixel sizes** — down from 12, for the same
reason as at 1440.

### Divergences from the documented scale

1. **The `clamp()` ladder is correct at both ends.** Every clamped step
   lands exactly on its documented maximum at 1440 and interpolates as
   specified at 390. No clamp is mis-specified.
2. **None.** After the corrective pass the rendered scale and the documented
   scale are the same list. H3 exists (the FAQ questions, 24px Bricolage
   600); the wordmark and the button label are named roles rather than
   undocumented steps; the Contact value renders at Body; and the FAQ group
   headings take H2, the step their role already implied.

The one deliberate divergence from a naive ramp, recorded so it is not
re-flagged as a defect: **the reading layer does not scale.** Lede 20px,
Body 16px, Caption 14px and Label 13px hold one size at both viewports while
everything from Trail item upward is clamped. The Lede is therefore
viewport-invariant on purpose, and its 1.25× ratio to Body is identical at
1440 and 390 — Body does not scale either, so the distinction between them
never narrows.

### Near-duplicates

| Sizes | Distance | Doing the same job? |
|---|---|---|
| 13px label / 14px caption / 14px button | 1px | Three roles inside 1px. Separated by weight (600/400/600), tracking (+1.04 / normal / +0.28px), case, and context: an eyebrow, a footer line, and a filled control. Never adjacent to one another. |
| 20px Bricolage 600 / 20px Bricolage 500 / 20px Instrument 400 | 0px | **Three roles at one size**: wordmark, hero statement, Lede. Separated by family plus weight; the wordmark is chrome, the other two content. |
| @390: 44px Display / 44px Stat numeral | 0px | The two **monumental** roles. Not a ladder — on desktop the stat numeral is the larger of the two (104 against 72), so they are the same *level* rather than two rungs of one. A full screen apart, and one is a centred headline in a photographic card while the other is a numeral on a baseline opposite a 13px uppercase label. |
| @390: 24px Trail item / 24px H3 | 0px | Same level reached from two directions: both are block headings one step under a section heading. The trail item rises to 36px on desktop because the gains trail is a full-width set piece. |
| @390: 32px H2 / 32px FAQ group heading | 0px | **Not a collision — one role.** The FAQ group headings are section headings and take H2 at every viewport. |
| @390: 15px hero statement / 16px Body | 1px | Bricolage 500 against Instrument 400, 1px apart. The hero statement is sized to its line count, not to the ramp (see above). |

The 16px collision is gone: nothing renders at Body size in a heading weight
any more. What remains at 390 is **four roles on two sizes** (44, 24), each
pair documented above as one level carrying two roles rather than two levels
that failed to separate.

**What the corrective pass changed here:** at 1440 the combination count
drops from 14 to 13 and at 390 from 12 to 11, in both cases because 16px
Instrument 600 has left the site — the FAQ question went up to H3 and the
Contact value down to Body weight. The distinct *pixel* sizes are unchanged
at 10 in both viewports; the FAQ group heading vacated 24px for 48/32, and
the FAQ question moved into 24px behind it. Nothing that was separate has
merged in a way that costs a distinction.

---

## 2. Where is the measure wrong?

Threshold: over ~75 characters or under ~45, on the longest rendered line.

### At 1440 — over 75

**Nothing.** The site's longest prose line is now **70 characters**.

The eleven blocks that were over or at the threshold, before the corrective
pass and after it:

| Page · block | Before | After | Size | Track |
|---|---|---|---|---|
| FAQ — "Travel arrangements are usually organised by…" | **83** | 65 | 16px | 650 → 502px |
| FAQ — "No. Erasmus+ projects cover the main costs…" | **82** | 65 | 16px | 650 → 502px |
| FAQ — "Participants gain international experience…" | **82** | 62 | 16px | 650 → 502px |
| FAQ — "At the end of the project, participants…" | **81** | 68 | 16px | 650 → 502px |
| FAQ — "If selected, you will receive detailed…" | **81** | **70** | 16px | 650 → 502px |
| FAQ — "Erasmus+ opportunities are open to young…" | **80** | 65 | 16px | 650 → 502px |
| FAQ — "No previous experience is required…" | **78** | 64 | 16px | 650 → 502px |
| FAQ — "Each opportunity has its own application…" | **78** | 63 | 16px | 650 → 502px |
| Contact — hero lede | **77** | 64 | 20px | 672 → 576px |
| FAQ — "Yes. Projects are organised by accredited…" | **76** | 66 | 16px | 650 → 502px |
| FAQ — "Erasmus+ is a European Union programme that…" | 75 | 59 | 16px | 650 → 502px |

**The eleven FAQ answers now run 59–70 characters, against 75–83.** The
cause was structural and the cure was structural: the answer column went
from 7 of 12 grid columns to 6 (652 → 552px) and the card's desktop padding
from `px-6` to `px-8`, leaving a 502px text track — in line with the 576px
that every other 16px block on the site already sat in. The rail took the
freed column (4 → 5 of 12), so the gutter between rail and answers stays one
step rather than widening to two.

The Contact hero lede was the one non-FAQ block over the line, and it came
down the same way: the inner-page hero lede moved from `max-w-2xl` (672px)
to `max-w-xl` (576px), which also took About from 73 to 57 and the FAQ hero
from 62 to 59. Nothing else on the site changed measure.

**No block newly crossed above 75 — or above 70.** Two blocks land at 68 and
70; every other prose block on the site is 66 or under.

The longest blocks now, in order: FAQ "If selected, you will receive
detailed…" **70**, FAQ "At the end of the project…" **68**, About finale
closing text **66**, FAQ "Yes. Projects are organised…" **66**, About
"ArtiCYa contributes meaningfully…" **66**.

### The seven blocks that re-wrapped in the typeface fix

The complete list of line-count changes across both viewports — the whole
material effect of the *typeface swap* on layout. (The corrective pass
re-wrapped the FAQ answers and the three inner-page hero ledes as well, by
design; those are the tracks it deliberately narrowed.)

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
| FAQ answer card | 552px | FAQ answers (6 of 12 grid columns); 502px text track inside `px-8` |
| FAQ rail | 452px | FAQ group headings (5 of 12); 388px beside the icon medallion |
| `max-w-4xl` | 896px | Contact "Get in touch" band |
| `max-w-3xl` | 768px | Home closing showpiece |
| `max-w-2xl` | 672px | Home closing paragraph, About finale text |
| `max-w-xl` | 576px | Inner-page hero ledes |
| Offer panel block | 576px | Both offer panels |
| `max-w-[46rem]` | 736px | Hero statement |
| Footer band | 1024px | Footer |

`DESIGN-SYSTEM.md` no longer states a `ch` ceiling: no container on the site
is expressed in `ch`, so the rule is now stated and verified as a measured
one — no prose block over 70 characters on its longest rendered line, at
either viewport. The site's worst block is 70.

---

## 3. Where is hierarchy flat?

### The pairs that were flat, and what they read as now

**FAQ question vs FAQ answer** — was the flattest pair on the site; is now
one of the clearest.

| | Question — before | Question — after | Answer |
|---|---|---|---|
| Size | 16px | **24px** | 16px |
| Weight | 600 | 600 | 400 |
| Family | Instrument Sans | **Bricolage Grotesque** | Instrument Sans |
| Line-height | 22.4px (1.4) | 30px (1.25) | 27.2px (1.7) |
| Colour | `ink` | `ink` | `ink-soft` |

Before, the pair was identical in size and family and separated by weight,
colour and the accordion's border alone — and it had got *flatter*, because
until the typeface fix an accidental family mismatch had been doing the
hierarchy work. The question now takes H3: 1.5× the size, a different
family, a heavier weight and a darker ink. Four signals where there were
three, and the size one is doing the work at a glance.

**Contact channel label vs value** — was 13px/600 uppercase against
16px/600: 3px apart at the **same weight**, both inside the same card, with
the uppercase transform doing all the separating. The value now renders at
Body weight (16px/400), so the pair is a tracked uppercase 600 label in
`ink-soft` above a sentence-case 400 value in `ink` — the same
eyebrow-and-value relationship the stats ledger uses. Size was not the
available lever: at 20px the email address measures 239px against a 235px
card, and would break mid-address.

### Same size, different level

**Home H2 vs offer-panel title** — "What we do" (`<h2>`) and "Youth
Exchanges" (`<h3>`) both render at **48px Bricolage 600** with identical
line-height, tracking and colour. Two semantic levels, one visual level, and
sanctioned by `DESIGN-SYSTEM.md`. Kept: the panel titles are titles on
full-bleed photographic set pieces and are sized to the panel rather than to
the ramp, so demoting them would shrink a showpiece to populate a table. The
home page has no H3-level element by composition, not by omission.

**Contact "Get in touch" vs Home "What we do"** — **resolved.** Both are the
top heading of their page's one content section, and both now render at
**48px** (H2). Contact was 60px (Showpiece); Showpiece is now the home
closing line and nothing else, which is what "one key line per page max"
always meant.

### Adjacent levels too close to read as different levels

**@390: Display and Stat numeral both at 44px.** Kept, and reclassified: see
the near-duplicates table above. These are the two monumental roles rather
than two rungs of one ladder — on desktop the stat numeral is the *larger*
of the two — and they sit a full screen apart. Neither available fix earns
its cost: dropping Display to 40px leaves "are ArtiCYa" visibly short of the
hero card it is centred in, and raising the mobile stat numeral breaks the
documented constraint that all three ledger rows share one screen. Either
way the achievable gap is itself under the perceptual floor, which would
make the change technically present and perceptually absent.

**@390: Trail item and H3 both at 24px.** Kept, and reclassified as one
level carrying two roles: both are block headings one step under a section
heading, on different pages.

**@390: hero statement 15px vs Body 16px.** 1px apart, different families
and weights.

**Label 13px vs Caption 14px vs Button 14px.** Three roles within 1px.
Button and Caption are the same size and differ only in weight (600 vs 400)
and tracking (0.28px vs normal).

### Where hierarchy is strong

For contrast, the ratios that read clearly: Stat numeral to its label is
104→13 (8:1); Display to Lede is 72→20 (3.6:1); Showpiece to the paragraph
above it is 60→20 (3:1); and the FAQ's ladder is now 48→24→16 (2:1 then
1.5:1, the section heading to the question to the answer), where before the
bottom two rungs were 16→16.

---

## 4. How many weights are in play?

Element measurements, both viewports, 190 total.

| Family | Weight | Elements | Roles carried |
|---|---|---|---|
| Bricolage Grotesque | **600** | 72 of 74 | Display, Showpiece, H2, H3, trail item, stat numeral, wordmark |
| Bricolage Grotesque | **500** | 2 of 74 | Hero statement only (one element per viewport) |
| Instrument Sans | **400** | 80 of 116 | Lede, Body, Caption, contact values |
| Instrument Sans | **600** | 36 of 116 | Label, eyebrow, nav, button |

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
- **Instrument Sans 400** carries the whole reading layer — Lede, Body,
  Caption and now the contact values, 80 elements. Before the typeface fix
  it carried nothing at all.
- **Instrument Sans 600** is now purely the labelling layer — Label,
  eyebrow, nav and button, 36 elements. It shed the two roles that had put
  a heading weight at reading size: the contact value went to 400 and the
  FAQ question moved to Bricolage 600 at H3.

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
| 19 | faq | Q&A groups | **Two-column, asymmetric** (rail 5 / answers 6) | 452 + 552 in 1152px | 144 / 144 | stacked, 358px |
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
(576, 768, 896, 1024). The site has six distinct content-column widths
across twenty-two blocks.

---

## What the corrective pass changed

Every change was a size, weight, line-height or track width. No section was
restructured, no element moved, no component changed shape, and no word of
copy changed — `npm run verify:text` passes unchanged on all four pages.

| # | Defect | Change | Measured before → after |
|---|---|---|---|
| B1 | FAQ answers ran 76–83 characters in a 650px track | Answer column 7 → 6 of 12 grid columns, rail 4 → 5, card padding `px-6` → `px-8` on `md`+ | Track 650 → 502px; measure **75–83 → 59–70ch** |
| B2 | FAQ question and answer both 16px Instrument, separated by weight and colour alone | Question 16px Instrument 600 → **24px Bricolage 600** (H3) | Question:answer **1:1 → 1.5:1**, plus a family and a weight change |
| B3 | Contact's section heading 60px where the same role on home is 48px | Contact "Get in touch" Showpiece → **H2** | 60 → **48px**; Showpiece now the home closing line only |
| B4 | No level between H2 and body on home; documented H3 existed nowhere | H3 assigned to the FAQ questions; home's offer-panel titles kept at H2 and the reason documented | H3 goes from 0 rendered elements to the FAQ's ten questions |
| B5 | Wordmark, contact value and button label outside the documented scale | Contact value folded onto **Body**; wordmark and button named as roles in `DESIGN-SYSTEM.md` | Undocumented steps **4 → 0** |
| B6 | Three roles at 16px, three at 20px; collisions worse at 390 | 16px Instrument 600 eliminated site-wide; the remaining shared steps documented as one level carrying two roles | Combinations **14 → 13** @1440, **12 → 11** @390; sizes carrying more than one family/weight **3 → 2** and **2 → 1** |
| B7 | The Lede never shrinks between viewports | None — kept, and the principle documented | Lede:Body is 1.25× at both viewports because Body does not scale either |
| B8 | Contact label and value 3px apart at the same weight | Value 16px/**600** → 16px/**400** | Weight gap **0 → 200**; size was unavailable, as 20px measures 239px against a 235px card |

Verified on the built export at 1440×900 and 390×844: **zero prose blocks
over 75 characters** at either viewport, against ten before; no element
overflows its box; no console errors or page errors on any of the four
pages at either viewport; and `verify:text` passes on all four.
