# ART-DIRECTION.md

Design notes for the site. This file records what the site must feel like, what
has been tried and rejected, and the rules that came out of those attempts.

`DESIGN-SYSTEM.md` owns tokens and mechanisms. `REFERENCE-LANGUAGE.md` owns
measured composition. This file owns intent and the list of dead ends.

---

## 1 · The target

The bar is a site that would win an award — not a competent site. Judged by eye,
not by numbers. The two questions are: *would anyone read this?* and *does this
look professional?*

Reference set: MNTN · Природный парк Ергаки · Trafalgar Discover Tours ·
Grand Canyon (CanyonTravel) · Forest Excursions. Motion reference: the Wandr
"Cabin Fever" recording and the Namibia/Morocco/Slovakia travel recording.
Scroll feel: izanami-official.com, coffee-tech, wolverine.

What those share, and what this site must have: **the photograph is the page.**
Type is refined and small relative to the image. Nothing is bolted on. The
whole thing reads as one continuous world, not a stack of sections.

---

## 2 · Non-negotiable rules

**Photography**
- Photographs everywhere. No screen may be plain colour with no image.
- No horizontal line where one background ends and the next begins. Backgrounds
  dissolve into each other; they never cut.
- All photographs must read as one set — one light, one grade.
- No photograph cropped below 60% of its original frame area.
- No power cables, fencing or roof clutter in a rendered frame.
- No stock photography. Every image is ours.

**Text**
- Every visible character is frozen. `npm run verify:text` must pass on all four
  pages against `scripts/parity/`. Text may move; it may never change.
- "ArtiCYa" with a capital Y. Never CSS-uppercased.
- **Never a local shape behind text.** No rectangle, oval, blob, tile, card fill
  or frosted panel. The ground for text is either the dark floor, the same
  photograph defocused, or a gradient spanning the full width of the frame.
- Contrast on the rendered composite at glyph cores: large display 3.0:1,
  body 4.5:1.
- Contrast is fixed by lowering the photograph's strength in that zone — never
  by a brightness filter, never by cropping, never by a shape.

**Motion**
- Text entrances are clock-based: in-view trigger, 1.2–1.6s, staggered, once per
  load. Never scroll-scrubbed — a flick collapses a scrub into 200ms and the
  text becomes invisible.
- Backgrounds may be scroll-linked. Text may not.
- No stall. Every scroll gesture must advance visible content. No section holds
  the viewport longer than 1.2 viewport heights. No passage over 1.0 viewport
  where only the background changes.

**Code**
- Every class touched in `globals.css` goes inside `@layer components`. An
  unlayered rule has silently beaten a utility four separate times.
- The hero's mechanics are frozen: scroll-expansion, slideshow, hydration gate,
  scrollRestoration, `window.scrollTo`, the foot dissolve. Its visual treatment
  is open.

---

## 3 · Rejected — do not reintroduce

Each of these was built and thrown away. They are listed so the same ground is
not covered twice.

**Structure**
- Per-section background photographs joined by amber seams. Reads as a collage —
  "like a ten-year-old made it". This is the single worst outcome.
- Sections at full viewport height with a small photograph inside them. Produces
  large empty bands above and below the content.
- A full screen given to a photograph with no content on it at all.
- Two consecutive passages of quiet dark ground.
- Background photographs held at anything between 0.00 and 1.00. At 0.05–0.74 a
  photograph is neither a picture nor a clean ground — it is a grey-green haze
  with ghost shapes in it — and 0.90, which replaced it, is a picture with a
  veil on. Strength is 1.00 or 0.00; the only numbers in between are the
  crossfades themselves. See `REFERENCE-LANGUAGE.md` §F1.

**Treatments**
- Any panel, tile, card or frosted box behind text.
- Gold or any foreign colour washed over a photograph to carry text. It reads as
  a stain and it kills the photograph underneath.
- A sawtooth or zigzag mask at the foot of a photograph.
- Dotted globe, lamp CTA, floating amber particles, film grain, the gains trail
  with its glow and nodes, accordion card fills on FAQ, channel card fills on
  Contact.

**Typography**
- A high-contrast serif display face. Tried and rejected.
- Display type at normal website scale. It must read as large.

**Content**
- Any invented copy. Eyebrow labels and numerals must be CSS pseudo-content so
  the DOM text stays frozen — and even then, invented words are unwelcome.
- Nature photographs used as the object beside a programme section. The object
  photograph must show the activity it names. The *background* may be landscape;
  the *subject* may not.

---

## 4 · Section-by-section notes

**Hero** — settled. IMG_4585, the group on the path above the valley, and the
plate is now painted twice with the h1 between the copies (§8). The five frozen
mechanics stay frozen; the crop, the block's height in the frame and the mask
are the three numbers that place the words on the skyline and they are tuned
together — move one and re-measure the other two.

**The lede** — "A youth organization connecting young people in Cyprus…" is
currently under-weighted. It needs more presence in the composition. It must not
get a box.

**What we do** — the weakest zone. Currently type alone with large empty space
above and below. It needs an image or a piece of motion carrying it, and it needs
its vertical space tightened.

**Youth Exchanges / Training Courses** — the object photograph must show young
people on an Erasmus+ activity. `AboutImage1` (the group with the Cyprus and
Portugal flags) and `AboutImage2` (the circle of chairs outside the mountain
cabin) are the right subjects. A landscape portrait beside these headings says
nothing.

**What you gain** — four lines currently sit stacked with no composition. It
needs structure: a rule, an order, an arrival, something that makes it a designed
element rather than four sentences placed on a page.

**Closing** — "Travel across Europe with all expenses covered…" has the same
problem as the lede. Under-designed.

**FAQ / Contact** — reading pages. Same world, quieter weather. Contact currently
scrolls only ~325px; it does not read as a page at all.

---

## 5 · Photographs

| File | Subject | Use |
|---|---|---|
| IMG_4585 | group on a path above the valley | home hero — settled |
| IMG_4619 | valley under open sky | strongest open frame; needs its bottom-right cable corner cropped |
| IMG_4582 | road between stone walls, overcast | quiet ground, wide |
| IMG_4739 | village at blue hour, cobbled lane | atmosphere |
| IMG_4735 | cattle on a road at blue hour | character; cables cross the upper half — crop to the lower two thirds |
| IMG_4721 | cattle under oaks | texture only, never behind a heading |
| IMG_4599 | forest path, moss | the set's one hard-midday frame; graded to match the others |
| AboutImage1 | five young people, Cypriot food, Cyprus + Portugal flags | Youth Exchanges |
| AboutImage2 | twenty young people in a circle outside a cabin | Training Courses |

`IMG_4564` is excluded. The stock interiors — `About.jpg`, `Contact.jpg`,
`FAQ.jpg`, `home-hero.jpg` — are retired.

Grading: `resinHour` was built for the light-gold world and is no longer used. It
stays in `scripts/grade-photos.mjs` unchanged. New frames go through the MATCH
path, which pulls a frame's white balance and luminance toward the set mean.

---

## 6 · The devices from the reference set

These are what the references actually do. They are intent, not a checklist —
bolting them on individually has produced worse results than leaving them out.

- **Alternating sections.** Text one side, photograph the other, sides swap each
  time. Photograph enters the section higher than the text block so the two never
  form a horizontal band.
- **Ghosted numeral** in front of the heading, its centre on the eyebrow row,
  its right edge overlapping the heading's first word.
- **Eyebrow row** reading left to right: numeral → short rule → tiny wide-tracked
  caps. The rule sits beside the label, not above the heading.
- **Photographs with no frame.** No border, no ring, no shadow, no radius.
- **Dissolve and rebirth.** A photograph fades toward the dark ground, text
  crosses on the dark, the next photograph rises out of the same dark.
- **Vertical wipe** between frames rather than a crossfade, bottom to top.
- **Type inside the depth** — the headline sits between two layers of the same
  photograph so foreground objects pass in front of it.
- **A title that transforms** — a large heading shrinks and travels to become the
  small label of the section below, as one element, not two crossfading.
- **The split** — one photograph, defocused on the text side, sharp on the other,
  with a deliberate seam.
- **Edge furniture** — a vertical ghosted word on one edge, a section index rail
  on the other.

---

## 7 · Working method

- Preview before code for any contested visual decision.
- One section per change, committed separately.
- Amplitude always in numbers. "Subtle", "calm" and "tasteful" have produced
  invisible results every time they were used.
- Verification is what the reader sees on the rendered page at natural scroll
  speed on a real device — not mechanism state, not emulated checks.
- Emulation does not reproduce mobile. Anything touch-related is confirmed on the
  actual phone in Safari with flick scrolling.

---

## 8 · Current state

`9647a04`. The dark world, the Portugal set, the alternating panels and the
measured geometry are all in, and four things have landed on top of them.

**The panels are unpinned.** 200svh and the sticky frame are gone; each panel is
one viewport, scrolled through. Home lost 1800px at 1440×900 and 1531px at
390×844 — 9.34 viewports down to 7.32.

**The ledger is polarised.** 1.00 or 0.00 and nothing held in between; 0.90 is
struck out with the rest. Reading down: loud, quiet, loud, quiet, loud, quiet.
Numbers in `REFERENCE-LANGUAGE.md` §F1.

**The road passage carries words.** It was 0.98 of a viewport of photograph with
nothing to read on it. It now carries the sentence the panel above it ends on —
"Receive a Youthpass certificate recognizing your learning." — as a statement at
3.5% of the viewport width with its own last clause under it. Nothing was
written and nothing moved in the document: text can only be given to a zone
adjacent to it in the source, because parity compares each page as one ordered
string. That constraint decides every future move of this kind.

**The hero is split.** The poster is painted twice with the h1 between the
copies — the reference set's "type inside the depth" (§6) — the front copy
masked to the land traced off the frame's own skyline, so the hills cross the
headline's feet. The label reads above the headline now, as an eyebrow: it has
to, or the land swallows it. The five frozen mechanics are untouched.

The contrast sweep is clean: 188 text elements over four pages, both viewports,
worst pixel per element across every scroll position, none below its floor. The
old 2.22/1.78 headline defect is closed — 5.27/5.27 desktop, 5.34/6.28 mobile.

What is still open:

- **The lede, "What you gain", the closing** — §4 above. Under-designed, and the
  panels' geometry is now the only part of home that is settled.
- **Fencing in the road frame.** `IMG_4582-road` carries a chain-link fence in
  its top-left corner, and the passage is now a screen the reader stops and
  reads on, so it is in the frame the longest of anything on the page. It breaks
  the second photography rule in §2. The crop is already 56% of the original
  area, under the 60% floor, so this cannot be cropped out — it needs a
  different frame or a different pan.
- **The home h1 under reduced motion.** The hero renders expanded, so the
  headline and the label sit at opacity 0. Pre-existing, still open.
- **Real-device confirmation.** Everything above is measured in a headless
  browser at 1440×900 and 390×844. §7 stands: emulation does not reproduce the
  phone, and the unpinned panels, the shortened passage and the hero's split
  have not been through a real one.
