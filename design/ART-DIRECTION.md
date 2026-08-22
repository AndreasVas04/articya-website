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

**What we do** — was the weakest zone: type alone on flat dark, the one screen
on the site made of plain colour. It stands on `hero-1` at full strength now —
the group walking the track above the reservoir, the hero's own second slide, so
the picture costs no extra request. The clock entrance it already had did not
change; it only had nothing behind it. The plate carries its own darkening at
74/82/82 on `sky-anchor`, because the shared stage numbers were set for an
overcast road and this frame is a sunny one.

**Youth Exchanges / Training Courses** — the object photograph must show young
people on an Erasmus+ activity. `AboutImage1` (the group with the Cyprus and
Portugal flags) and `AboutImage2` (the circle of chairs outside the mountain
cabin) are the right subjects. A landscape portrait beside these headings says
nothing. The window cuts the frame now: the inner edge is the column-4 line and
the outer edge runs off the screen, 41vw rather than the column's 29%, which is
what finally puts the picture at §A2's 86% of the section instead of 62%. The
five tracks, the 3:4, the −12svh lift and the numeral on the eyebrow row are
untouched — the outer margin is the only thing that was spent. About's three
story scenes share the classes and take it with them.

**What you gain** — four lines currently sit stacked with no composition. It
needs structure: a rule, an order, an arrival, something that makes it a designed
element rather than four sentences placed on a page.

**Closing** — "Travel across Europe with all expenses covered…" has the same
problem as the lede. Under-designed.

**FAQ / Contact** — reading pages. Same world, quieter weather. Contact currently
scrolls only ~325px; it does not read as a page at all.

---

## 5 · Photographs

**A photograph appears once per page, twice at most across the site, and never
in two zones the reader crosses one after the other.** Twelve frames carry
twenty-one placements: one appears three times, eight twice, three once. A
frame painted sharp and again out of focus as the same page's ground — every
inner page — is one placement, not two; so is the home hero's poster and its
own first slide.

| File | Subject | Where it is |
|---|---|---|
| IMG_4585 | group on a path above the valley | home hero, poster and first slide — settled; About's finale, the lower-right 2.13:1 slot, cropped at 35% to the village and the far mountains |
| IMG_4619 | valley under open sky | as `-valley`: home's "What you gain" and the closing it dissolves into; as `-ridge`, a sub-rectangle of that crop with the sky off the top: About's finale, the upper-left 3.2:1 slot. Its bottom-right cable corner is cropped out of both |
| IMG_4582 | road between stone walls, overcast | as `-road`: home only, crossed at the panels' join. Fencing across rows 107–507, and no window on it holds a complete subject — see §8 |
| IMG_4739 | village at blue hour, cobbled lane | **off the site.** Both crops fail §2 from opposite ends: the whole frame carries overhead power cable across the sky, and the crop that removes the cable lands on railings, a satellite dish, a letterbox and a parked car |
| hero-1 | the group walking the track above the reservoir | the ground under "What we do", and About's finale centre tile, anchored to the foot of the frame so the walkers keep their legs. Uncropped it shows 84.8% of itself in a 16:10 window, it is a picture of the sentence it stands under, and at 1.356:1 it is the only frame in the set that clears §G's floor in the centre tile on a desktop without collapsing on a phone |
| IMG_4735 | cattle on a road at blue hour | as `-road`: the Contact ground, and About's finale, the lower-left 2.13:1 slot at 80% — one whole animal rather than a band across two of them. Cables cross the upper half; the published crop takes the lower two thirds |
| IMG_4721 | cattle under oaks | the About ground, and nowhere else. Cropped at `0% 70%`, which is the one pair that holds the near animal whole in a landscape window and in a portrait one. It carries the h1 there, against this table's older "never behind a heading" — the heading clears its floor at 5.33, so the note is recorded rather than enforced |
| IMG_4599 | moss-covered wall under trees | About's finale, the left upright slot, cropped low to the wall. The set's one hard-midday frame; graded to match the others. At 1:2.19 it is the only frame that suits an upright slot on a phone — and it is on the wall because the set runs one frame short of the page, not because it earns the slot. See §8 |
| hero-2 | the group walking a shaded forest road | home hero, second slide; the FAQ ground; About's finale, the right upright slot. **The one frame at three placements**, and it is there because nothing else is left — see §8 |
| hero-3 | participants talking on mossy rocks | home hero, third slide; About's finale, the lower-right 3.2:1 slot. At 2.14:1 it belongs in a wide slot and nowhere else — in an upright one it showed 13.5% of itself on a phone |
| home-training | a team-building game during a training course | About's third scene, and nowhere else |
| AboutImage1 | five young people, Cypriot food, Cyprus + Portugal flags | Youth Exchanges panel on home; About's first scene |
| AboutImage2 | twenty young people in a circle outside a cabin | Training Courses panel on home; About's second scene |

`home-youth` — hands joined by a rope web — is **off the site**. It was the
home hero's second slide and a finale tile, and it is a macro in both: no
place, no horizon, and at the hero's full-window size a close-up of forearms
reads as a texture. It was also the only tile on the wall that was neither a
landscape nor people.

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

**The road passage is gone and its sentence is back in its paragraph.** Giving
it the panel's last line was the right shape on the wrong content: one sentence
spending 1.4 viewports, with a wordless screen at each end — 15 scroll positions
on desktop and 9 on a phone where the glass carried no words at all. The screen
is deleted, "Receive a Youthpass certificate recognizing your learning." is the
fifth sentence of Youth Exchanges again, and the road now crosses the join
between the two panels at full strength for 0.36 of a viewport with no height of
its own. Home went from 7.27 viewports to 5.84. Nothing moved in the document
either way: the split was a re-wrapping of the same characters in the same
order, which is still the only kind of move parity allows.

**The hero is split.** The poster is painted twice with the h1 between the
copies — the reference set's "type inside the depth" (§6) — the front copy
masked to the land traced off the frame's own skyline, so the hills cross the
headline's feet. The label reads above the headline now, as an eyebrow: it has
to, or the land swallows it. The five frozen mechanics are untouched.

The contrast sweep is clean: 188 text elements over four pages, both viewports,
worst pixel per element across every scroll position, none below its floor. The
old 2.22/1.78 headline defect is closed — 5.27/5.27 desktop, 5.34/6.28 mobile.

**A measured number from a reference is not a rule until the geometry it was
measured in is written down beside it.** `REFERENCE-LANGUAGE.md` §A2 carried
*the panel photograph is 86% of the section height*, read off MNTN and correct
there. MNTN's alternating sections are 43.5vw tall, so 86% of one is 37.4vw —
the same frame its 29% column gives at 3:4, two numbers for one picture. Ours
are a full viewport, where 86% is 86vh: at 1440×900 a photograph 787px tall in
a 900px window, 1.4× the frame the column gives, touching the top and bottom of
the screen.

`c61f320` followed the document exactly and widened the frame to 41vw so it
reached 87.4% of the section, with the window cutting its outer edge. Every
step of that was sound against what §A2 said, and the result read as *less*
design work rather than more: a photograph that fills the screen is a
background, and the section already has one — §A6's solid dark, which is the
alternation the whole pattern exists for. It was reverted at `f95f35e` and §A2
is rewritten to state the constraint that actually holds instead of the
proportion that happened to hold on MNTN — the photograph is an object with
ground on all four sides, sized from the *window's width*, never from the
section's height.

The general form, for the next number taken off a screenshot: record what the
number was a fraction *of*, and check whether that thing is the same size here.
Where it is not, carry the ratio the reference's own composition implies, not
the percentage its markup happened to use.

**The set is one photograph short of the site.** Thirteen frames are usable —
fourteen less `IMG_4739`, which no crop clears. The About page alone needs
eleven distinct ones: a ground, three scene objects and seven tiles. Taking out
the three tiles that did not stand on their own leaves ten. So one slot on the
wall has no photograph for it, and two compromises pay for that: `hero-2` takes
a third placement against this section's own two-at-most rule, and `IMG_4599`
stays on the wall re-cut rather than replaced. Both are photography, not code —
the wall's geometry is sound and shrinking it would cost the interlock the
whole composition is built on.

What is still open:

- **The lede, "What you gain", the closing** — §4 above. Under-designed, and the
  panels' geometry is now the only part of home that is settled.
- **Overhead cable in `hero-2`.** It enters the top-left corner and runs down to
  a pole a third of the way across. The About tile is cropped clear of it; the
  home hero slide and the FAQ ground are not, and at both viewports it is
  visible against the canopy. §2, and only a different frame closes it.
- **Fencing in the road frame.** `IMG_4582-road` carries a chain-link fence
  across rows 107–507 of its 1020, and a 16:10 window shows 854 of them, so no
  pan clears it; the bottom-anchored one in use clears the most. The crop is
  56% of the original and a 16:10 window shows 46.9% of it, under the 60% floor.
  Both are still true. What changed is the exposure: the frame is crossed at the
  panels' join for 0.36 of a viewport instead of holding a screen the reader
  stops and reads on, so it is now the shortest hold on the page rather than the
  longest. It still needs a different frame to close.
- **The home h1 under reduced motion.** The hero renders expanded, so the
  headline and the label sit at opacity 0. Pre-existing, still open.
- **Real-device confirmation.** Everything above is measured in a headless
  browser at 1440×900 and 390×844. §7 stands: emulation does not reproduce the
  phone, and the unpinned panels, the shortened passage and the hero's split
  have not been through a real one.
