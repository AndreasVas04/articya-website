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

**Three amendments, and all three are scoped to `GalleryFinale` by name.** They
are decisions taken on the About finale and they do not travel: nothing else on
the site may cite them, and a second component that wants one asks for it on its
own evidence.

- **The closing paragraph's entrance is scroll-scrubbed, and it is the one
  sanctioned scrub on the site.** The three groups complete on the scrollbar
  while the seven tiles gather around them, and the words hand the frame back on
  the scrollbar as the ring closes over the place they stood. That is the whole
  composition: words and tiles share every frame and complete together, and a
  clock would put the paragraph's last group on the screen at a moment decided
  by a timer rather than by the reader's thumb. The rule's own reason — a flick
  collapses a scrub and the text is gone before it can be read — is bought off
  here by the pin: the paragraph is held on a pinned frame for 0.44 of the
  section's travel with nothing else moving in the window, which is 0.9 of a
  viewport on a phone and 1.5 on a desktop of thumb, not 200ms.
- **The pin runs 2.00 viewports on a phone and 3.40 on a desktop**, against the
  1.2-viewport ceiling directly above. Accepted. The ceiling exists so a reader
  is never scrolling against a screen that does not change, and inside this pin
  something moves at every frame — the tiles arrive staggered, the words
  complete, the ring closes, the mosaic fans out. What it costs is real and is
  measured rather than waved at. Stepped at 5px through the whole of `/about/`
  in both engines, the finale's tail carries **no glyph at all for 1.374 /
  1.355 / 1.333 / 1.315 viewports** at 553 / 664 / 750 / 844 and **1.894** at
  1440×900 — 760 / 900 / 1000 / 1110 / 1705 px of scroll where the only words
  on the screen are the header's. The seven-tile wall it replaces ran one
  wordless stretch of 0.78–0.84 viewports at the same measurement. This is the
  larger of the two costs and it is accepted with the composition.
- **The closing paragraph's fade-out is the finale's own exit** and is exempt
  from *Text may not* be scroll-linked for the same reason: it is the handover,
  not an entrance.

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
nothing.

**The 3:4 is spent, and it will not come back.** On a phone the box is
**36svh tall and 1.11 of that wide**, which is the largest picture the rules
leave: wider than 1.11 and the ground beside it falls under the `3svh` the head,
the gap and the foot each take, and a photograph that reaches the frame's edges
stops being an object and becomes a background — the failure `c61f320` was
reverted for, one viewport down. The height is what is declared, so the panel's
total and all twelve of the page's keys are where they were and the whole gain
is 48% of width. Above `md` the box keeps the 3:4 and nothing changed at any
width.

The box is now wider than every frame in it, so cover crops the height and
**each frame carries its own anchor**, in `components/panel-photo.ts`:

- `AboutImage1` — **`50% 100%`**. Everything it is on the site for is low in the
  frame; what is above the banner is ceiling and roller-blind recess. The cut
  lands at 32.43% and clears the white tape at the banner's corners, at 35.47%,
  by three points of frame.
- `AboutImage2` — **`50% 50%`**. Centred it clears the conifer crown at 18.85%
  by 2.63 points at the top and the lowest shoe at 78.5% by 5.28 at the foot.
- `home-training` — **`50% 0%`**. Centred, the top cut crosses two participants
  through the head — their hair crowns are at 9.3% and 7.5% of the frame — so
  this one is anchored to the top and the bottom third goes instead.

Every band keeps 67.57% of its frame, seven and a half points over the 60%
floor. The five tracks, the −12svh lift and the numeral on the eyebrow row are
untouched. About's three story scenes share the classes and take all of it with
them.

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
twenty-one placements. A frame painted sharp and again out of focus as the
same page's ground — every inner page — is one placement, not two; so is the
home hero's poster and its own first slide.

**The About finale breaches the rule in both halves, and it is a decision.**
`AboutImage1`, `AboutImage2` and `home-training` each stand on the wall
directly beneath the story scene that shows them, so all three appear twice on
`/about/` and in zones the reader crosses one after the other; with the home
panels behind them, the first two reach three placements across the site and
`hero-2` keeps the third it already had. `home-youth` returns from retirement
to take the seventh slot.

The cost is named rather than implied. **Three photographs are fetched twice on
one page**, and it is two files rather than one only where the scene and the
tile resolve to different rungs of the ladder — the tile declares its own
painted width through `coverSizes()`, and where that lands on the rung the
scene already took, the second placement costs nothing at all. Measured on the
built output, the second rungs cost **191 KB at 375×553** (all three frames
doubled), **46 KB at 390×664 and 390×750** (`AboutImage1` only), **0 KB at
390×844** (every doubled frame lands on one rung) and **216 KB at 1440×900**
(`AboutImage2` and `home-training`). The rest of the
cost is compositional and is the point of the composition: the wall is the
story's own photographs coming back at the end, and a frame the reader has
just been shown is what makes it read as a recapitulation instead of as a
gallery. Substituting seven unseen frames is not available anyway — the set has
twelve usable pictures and this page alone would need eleven distinct ones.

Scoped to `GalleryFinale`. Everywhere else the two-placement rule stands as
written.

| File | Subject | Where it is |
|---|---|---|
| IMG_4585 | group on a path above the valley | home hero, poster and first slide, and nowhere else. It was the seven-tile wall's centre tile in the composition that stood here between `9e62d5e` and this one; the finale is back on the scattered mosaic and the mosaic's centre is `hero-1` |
| IMG_4619 | valley under open sky | as `-valley`: home's "What you gain" and the closing it dissolves into, and nowhere else. Its bottom-right cable corner is cropped out. The `-ridge` sub-rectangle is still published by `scripts/responsive-images.mjs` and is **off the site** — it existed for the wall's upper-left 3.2:1 slot and that slot is gone |
| IMG_4582 | road between stone walls, overcast | as `-road`: home only, crossed at the panels' join. Fencing across rows 107–507, and no window on it holds a complete subject — see §8 |
| IMG_4739 | village at blue hour, cobbled lane | **off the site.** Both crops fail §2 from opposite ends: the whole frame carries overhead power cable across the sky, and the crop that removes the cable lands on railings, a satellite dish, a letterbox and a parked car |
| hero-1 | the group walking the track above the reservoir | the ground under "What we do", and About's finale, the **centre tile** — the last to arrive, in the place the words stood, and the one the fan-out carries furthest. Uncropped it shows 84.8% of itself in a 16:10 window and it is a picture of the sentence it stands under. At 3024×2230 since the 2026-08-30 ingest, so the mosaic's own 4× is paid down to **0.990 against its source** at 1440×900 DPR 2 at the peak, measured. It is the one tile that declares the window rather than its slot — `100vw`, which takes the peak from 3.90 to **1.040** against fetched and costs 487 KB on a desktop; `OPEN-ITEMS.md` §12.1 |
| IMG_4735 | cattle on a road at blue hour | as `-road`: the Contact ground, and nowhere else. Cables cross the upper half; the published crop takes the lower two thirds |
| IMG_4721 | cattle under oaks | the About ground, and nowhere else. Cropped at `0% 70%`, which is the one pair that holds the near animal whole in a landscape window and in a portrait one. It carries the h1 there, against this table's older "never behind a heading" — the heading clears its floor at 5.33, so the note is recorded rather than enforced |
| IMG_4599 | moss-covered wall under trees | **off the site.** It was on the seven-tile wall under protest — the set's one hard-midday frame, there because the wall ran a photograph short rather than because it earned a slot — and the mosaic does not need it |
| hero-2 | the group walking a shaded forest road | home hero, second slide; the FAQ ground; About's finale, the bottom-left small slot. **Three placements**, recorded above |
| hero-3 | participants talking on mossy rocks | home hero, third slide; About's finale, the right tall slot. At 2.14:1 in a slot that is 1.17:1 on a desktop and 0.45:1 on a phone it is the mosaic's hardest fit — 26% of its width shows there on a phone — and it is the slot the composition gives it |
| home-training | a team-building game during a training course | About's third scene, and About's finale, the bottom wide slot directly under it |
| AboutImage1 | five young people, Cypriot food, Cyprus + Portugal flags | Youth Exchanges panel on home; About's first scene; About's finale, the left tall slot |
| AboutImage2 | twenty young people in a circle outside a cabin | Training Courses panel on home; About's second scene; About's finale, the top wide slot |
| home-youth | hands joined by a rope web during a group exercise | About's finale, the top-right small slot, and nowhere else |

`home-youth` was retired for two reasons and only one of them survives the
mosaic. It is a macro — no place, no horizon — and at the home hero's
full-window size a close-up of forearms read as a texture; that is why it is
not a hero slide and it stays true. The other reason was that on the
seven-tile *wall*, where the frame filled the window and every tile was equal,
it was the only one that was neither a landscape nor people. The mosaic is not
that composition: its tiles are small objects on a field at seven different
sizes, and this one is 274×180 CSS px on a desktop and 78×106 on a phone,
where a pair of hands on a rope is a legible thing to put in a small
rectangle.

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
  **Amended for `GalleryFinale`, and there only.** The seven tiles of About's
  finale keep a 12px radius and a 1px amber ring at 55%. The reason is what the
  composition is: seven photographs of seven different sizes floating on the
  page's own ground with air around each of them, which is a field of objects
  and not a wall. Unframed, they read as a pile of rectangles dropped on a dark
  floor; framed, they read as prints laid out on it, which is the thing Andreas
  approved. The rule stands everywhere a photograph is a *ground* or a single
  object beside type — every panel, every scene, every plate — and it is those
  the rule was written for.
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

**The set was one photograph short of the wall, and the finale no longer asks
the question that way.** The seven-tile wall filled the window with seven equal
frames, so every one of them had to stand on its own and the page needed eleven
distinct pictures — a ground, three scene objects and seven tiles — against ten
that qualified. The scattered mosaic reinstated at `19.0` does not: its tiles
are objects of seven different sizes on the page's own ground, the smallest
274×180 CSS px on a desktop, and it takes the three story photographs back plus
`home-youth`. `IMG_4599` and `IMG_4619-ridge` leave the site with the wall;
`hero-2`'s third placement stays, now as a decision rather than as a shortage.

What that does not close is the standing debt underneath it. **The set still
holds no activity frame with the people large in the frame** — the same debt
`PHOTO-MANIFEST.md` §D carries as its fifth — and the mosaic works around it
rather than answering it.

What is still open:

- **The lede, "What you gain", the closing** — §4 above. Under-designed, and the
  panels' geometry is now the only part of home that is settled.
- **Overhead cable in `hero-2`, and it is now a rectangle rather than a
  description.** Fitted on the 3024 master, which carries no EXIF orientation
  and so is its own display frame: a single straight line, `x = 783.4 +
  0.1856·y` px, entering the top edge at **col 25.91%** and coherent down to
  **row 35.17%** at col 34.61%. Bounding rectangle **cols 25.50–34.99%, rows
  0–35.17%**, 13–23 px thick. The home hero slide and the FAQ ground carry it,
  and so does the mosaic's bottom-left tile.
  **No `object-position` closes that tile, on either axis, at any phone
  height** — at 664, 750 and 844 the slot is proportionally taller than the
  frame, so cover fits by height and the tile opens the *whole* of it and y is
  inert; at 553 y is live over 11.98 points against a cable that runs to 35.17;
  and the widest crop x can take off the frame anywhere is 22.79 points, which
  never reaches a column at 25.50–34.99%. The desktop slot is 1.52:1 and takes
  rows 25.33–74.67%, so it **overlaps the cable by 9.84 points** — the earlier
  note that the band sits below it was wrong — but the segment inside that band
  is the part behind canopy, with no sky in the flanking window, and the
  rendered tile shows no line. The phone tile shows it crossing the open sky
  gap. The mosaic reproduces `b256c30`'s own centred crop, so this is a
  reproduced defect rather than a new one, made more legible by the 3024
  decode. §2, and **only a different frame closes it.** Measured in
  `OPEN-ITEMS.md` §12.3.
- **The finale's amber rule at 375×553.** It stands on the `AboutImage2` tile
  instead of the dark floor and reads **1.00** at its own ink, in both engines,
  where every other height reads 4.43–4.66 on the floor. The frame is short
  enough that the centred text block's top — which is the rule — rises to
  151.38 while the gathered top band's bottom edge sits at 165.19, so the mark
  is 12.56 px inside the photograph. Clearance is −13.81 / +16.2 / +39.4 /
  +64.8 px at 553 / 664 / 750 / 844, monotone in the window's height. It is not
  §10.1's painted-weight finding — 553 is where the mark paints *heaviest* and
  reads *worst*, and a whole-pixel declaration leaves it exactly there. The
  levers are the band's inset (which is holding the header off at the same
  height), the block's height, and the rule's place in the block. Measured in
  `OPEN-ITEMS.md` §12.4, and open.
- **Fencing in the road frame.** `IMG_4582-road` carries a chain-link fence
  across rows 107–507 of its 1020, and a 16:10 window shows 854 of them, so no
  pan clears it; the bottom-anchored one in use clears the most. The crop is
  56% of the original and a 16:10 window shows 46.9% of it, under the 60% floor.
  Both are still true. What changed is the exposure: the frame is crossed at the
  panels' join for 0.36 of a viewport instead of holding a screen the reader
  stops and reads on, so it is now the shortest hold on the page rather than the
  longest. It still needs a different frame to close.
- **An activity frame with the people large in the frame.** The offer panels
  and About's story scenes want a photograph that *shows* young people on an
  Erasmus+ activity, and showing is a matter of scale on the screen rather than
  of what is in the shot. The slot renders **179 CSS px wide at 390×664**, so a
  figure that is a twentieth of the frame is 9 px there. `IMG_2865` was priced
  for it and refused on exactly that: three walkers whole, 21 × 37 CSS px
  between them, while the timber railing behind them reads clearly. The frame
  has to hold the people large, in a bright register, and stand beside
  `AboutImage1` and `AboutImage2` as a pair. `PHOTO-MANIFEST.md` §D carries it
  as the fifth standing debt.
- **The home h1 under reduced motion.** The hero renders expanded, so the
  headline and the label sit at opacity 0. Pre-existing, still open.
- **Real-device confirmation.** Everything above is measured in a headless
  browser at 1440×900 and 390×844. §7 stands: emulation does not reproduce the
  phone, and the unpinned panels, the shortened passage and the hero's split
  have not been through a real one.
