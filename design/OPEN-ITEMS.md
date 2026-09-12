# OPEN-ITEMS.md

The live punch list, and nothing else. `ART-DIRECTION.md` owns intent and the
rejected list, `REFERENCE-LANGUAGE.md` owns measured composition,
`DESIGN-SYSTEM.md` owns every published number, and the session run logs in
`design/refs/` (kept out of the repository) carry the measurements a change was
made against. This file carries only what is still open and what closed the
rest.

**Every item here has either a hash or a number.** A closed item names the
commit that closed it. An open item carries a number, what would close it, and
what it is measured against. Nothing is recorded as open without both, and the
narratives this file used to carry are in git history — `git log -p
design/OPEN-ITEMS.md` before `2026-09-12` — and in `DESIGN-SYSTEM.md`.

Rewritten against `083aa8d`, 2026-09-12.

---

## Open

### Photography — four frames, and not one of them is code

No `sizes` declaration and no ladder rung supplies a pixel a file does not
contain, and no `object-position` changes how much of a frame a cover-fitted
box shows. These four are the whole of the photography list.

**P1 · A ground for "What you gain".** Aspect **0.80–0.98**, subject carried
across the frame's width, at least **2880px** on the painted axis. The frame
standing there now is sky: 6.5% photographic content whole-window at 1440 and
0% under the lines, by the defocus ramp's own construction. This is the item
`E` below is about, and the two close together.

**P2 · An activity frame for the offer panels.** People at **≥ 0.4 of the
frame's height**. Every candidate in the set puts them at 56–295 px at 1440
and 8–46 px at 664, which is a landscape with figures in it rather than a
photograph of people. This is the item `IA` below is about.

**P3 · `hero-3`, re-shot.** Its master is **2316px** and was corrected down
from a declared 2560 — 244 of those columns were interpolation. It is the
owner of six of the twenty-six rows in `scripts/verify-placements.mjs`'s
`KNOWN` table, at 1.717–2.414, and it is the only row on that table no
declaration can move. `PHOTO-MANIFEST.md §B` closes the delivery question: no
incoming file improves it.

**P4 · A frame without the cable, and one without the fence.** The overhead
cable crosses `hero-2`'s sky, which is the home hero's second slide; the
chain-link fence is in `IMG_4582-road` at the offer panels' join, and every pan
that reaches the landscape reaches the fence. Both placements are the whole
frame full-bleed, so neither can be cropped clear the way About's tile is.

### E · "What you gain" needs a photograph, not code

The gains section's own copy holds its frame to within 140px of its foot and
the stage plate under it is under a hundredth by the time the closing's first
line is centred, so the schedule is not the defect — the picture is. Measured
at the scroll that centres each block: plate strength 0.000–0.036 and
photographic content **0.0%** of every block's rect at 553, 664 and 750. What
closes it is **P1**. What does not close it is any further work on the box:
the crop floor is `boxAspect / frameAspect` and the gains box has been at one
screen below `md` since `c18731d` for exactly that reason.

### IA · The offer panels

`REFERENCE-LANGUAGE.md §A2` was corrected after `c61f320` widened the panel
photograph until it filled the screen, and the panels have been reopened and
awaiting a design decision since. The geometry underneath them is sound and
must not be discarded. Two things are measured and neither is a layout defect:
the panel's total height is pixels all the way down on a phone (`min-h-svh`
never binds below 950, and the head and the picture trade 1:1), so making a
panel fit one screen costs four transitions; and the people in the picture are
**P2**.

### 1 · The FAQ footer's dither, at 0.717

The dither's target is a mean absolute contribution under **0.6** of a code
value, and every region measures 0.18–0.59 except the FAQ footer at
**0.7173** in both engines. It is structural rather than a miss: where a
window-pinned ramp lies over a plate — the top 130/150 px under the chrome, and
the footer's last band on an inner page — two independently dithered layers land
on one pixel, and two independent ±1 layers cannot sum to ±1. Accepted rather
than solved, because the alternative is a real contour under the nav and the
footer, and two steps out of 255 is 0.8% of full scale at a spatial frequency
above the eye's cutoff. It closes only by dithering the two layers from one
noise field, which means one paint for both, which is not what they are.

### 2 · The hero's slow-scroll flicker — closed as the reporting browser's artefact, recorded so it is not re-opened

Reported as a flicker in the opening under a slow scroll and never reproduced:
the video recorder, the screencast and the stepped sweep all failed to see it,
in both engines, at every window. **The owner's finding, 2026-09-11: it is
Brave's software rasteriser. Safari on the Mac and Safari on the iPhone are
clean.** There is no page defect here and no commit closes it, because there was
nothing in the page to change. This entry exists so the next reader does not
spend a session on it again.

### 3 · The rules still declared at 1.25px

`7215223` and `b1420a6` took the finale's two rules to 2px, and the argument
holds for the rest: a fractional length paints 1.00 or 2.00 CSS px in Chromium
and 1.00, 1.33 or 1.67 in WebKit depending on where the element lands, so only
whole numbers paint what they declare. Still at `1.25px`: the About hero's rule
and the three story-scene rules (`components/page-hero.tsx`,
`components/story-scene.tsx`), Contact's rule and its `divide-y`
(`app/contact/page.tsx`), the FAQ's group border (`app/faq/page.tsx`), the 404
page's rule (`app/not-found.tsx`) and the `1.25px` height in `app/globals.css`.
Closed by declaring each at a whole number and re-measuring its contrast at
553, 664 and 1440.

### 4 · The home h1 under reduced motion

With `prefers-reduced-motion: reduce` the hero renders expanded, so "We are
ArtiCYa" and the hint label sit at opacity 0 and the page opens with no
headline. Pre-existing, and not fixed because the hero's opening is frozen;
closing it means giving the reduced-motion branch its own resting state rather
than letting it inherit the expanded one.

### 5 · The load, on a slow pipe

Fast 3G at 664: FCP 2.34 s, LCP the headline at 2.35 s, CLS 0 — and the hero's
first rung (1984, 715 KB) completes at **21.3 s** (8.6 s on 4G) because the
stage's plates and the third slide, in a fixed in-view layer, share the pipe.
`11c4086` and `1f7fb5c` took the plates, the later slides and the Earth off the
load, which is most of this; what is left is that an in-view plate still
competes with the hero's own rung. `fetchpriority=low` on those images moved
nothing measurable over HTTP/1.1 and was not committed. Closed by holding the
plates until the hero has painted, which is a mechanic and not a number.

### 6 · 750 shows 52–54% of every full-bleed ground

By arithmetic, for every aspect a desktop accepts: a frame at A ≥ 0.96 passes a
16:10 window, a 390×664 phone needs A ≤ 0.979 and a 390×750 phone needs
A ≤ 0.867, so no single frame passes all three. The 0.96–0.98 band the grounds
are cut to passes the two heights the measurement budget names. Recorded, not
chased: the alternative moves the failure onto the other phone.

### 7 · The About and FAQ reading grounds carry no sharp region

11–19% photographic content where Contact carries a sharp fifth. The split does
not transfer, because both layouts run their text across the full width. Layout,
not treatment, and not a contrast defect — every line on both pages is over its
floor.

### 8 · The Earth, unjudged on a device

Built at `cfefe1c` + `b5723ef` on the owner's call and judged on screenshots at
1440 and 664 and on a scratch page; the object has not turned under a thumb.
The levers are named at the top of `components/earth-scene.ts` — `EXPOSURE`
(0.70) and `HAZE` (0.08) first — and the texture grade is in
`scripts/globe-texture.mjs`. Also unmeasured there: WebKit, 750, and the
no-WebGL path on a browser that actually lacks it. Its phone payload is 450 KB
of texture on demand (138 day + 312 pack); a 1536×768 phone rung would be
≈175 KB and is not built, because the lights are the channel that suffers at
lower sizes and the night side is the point. At 375×553 the section stands at
**1.199 screens**, inside the 1.2 line by a pixel's worth.

### 9 · A domain of its own

Not actionable from this repository: it needs a domain ArtiCYa owns. When there
is one — (a) `public/CNAME` holding the bare hostname, so every deploy
re-asserts it; (b) the same custom domain in the repository's Pages settings,
and *Enforce HTTPS* once the certificate has issued; (c) at the registrar, a
`CNAME` from `www` to `andreasvas04.github.io`, or the four Pages `A` records
and the `AAAA` records for the apex; (d) drop the `/articya-website` base path
in `next.config.ts` and point `siteUrl` in `lib/metadata.ts` at the new origin,
which moves every canonical, the social cards, the sitemap and the schema with
it. Until then `robots.txt` sits under the repository path, which a crawler
never reads — the root of `andreasvas04.github.io` is not this project's — so
the sitemap is submitted by hand in Search Console and the file states a policy
it cannot enforce.

### 10 · No real-device pass since the dark world landed, and no real Actions run of the cache step

Nothing has been pushed since `b256c30`. The close, the re-entry, the pinch
guards, the route wipe, the prefetch and the cue have all been measured in two
headless engines and none of them has been under a thumb. The variant cache
(`24b4b6a`) has never run in Actions.

### 11 · Deploy weight

**122.7 MB** at `build:pages` on `083aa8d` — WebP 62.8, AVIF 38.3, JPEG 18.4,
JS 1.5, everything else under 0.4 — against 112 MB at `9a612e4`. The ten
heaviest files are 1.52–3.33 MB each and nine of the ten are WebP: the 2880 /
2560 / 1984 / 1920 rungs of `hero-2`, the 2880 / 2560 of `IMG_4585`, and the
2880 rungs of `IMG_4582-road`, `IMG_3004-reservoir` and `IMG_4721-oaks`. The
decision to keep the WebP tier stands; this is recorded so the number is
watched, not so it is cut.

### 12 · Two placements the declaration cannot close

`AboutImage2` and `home-training` each stand at a story scene and on the About
wall, and the wall asks for a rung **above** the scene's, so `/about/` fetches
both files: 1366 beside 1024 for each at 1440×900 DPR 2. `ad24ae0` closed the
third of these the other way round, because `AboutImage1`'s slot was the one
where the scene's box is the wider of the two at every window. These two close
only by raising the **scene's** declaration to the wall's, which buys the tile's
rung for the scene as well — a trade, not a fix, and it is not taken here.

### 13 · The FAQ's accordion chevron is under the text floor

Found by the 2026-09-12 sweep, and it is the only element on the site measured
below its floor over a photograph. The `▼` in each question's ring reads
**3.33** at 375×553 and 3.56–4.38 at 390×664 and 1440×900, in both engines, at
the glyph's own ink over 93–231 scored pixels, against a 4.5 text floor. As a
**mark**, judged against the 3.0 floor this site gives its rules and numerals,
it clears everywhere with 0.33 to spare. The decorative-glyph exemption is not
available: it takes all four conditions and this fails two — 231 px of
population against the 200 allowed, and visible for the whole of its zone's
travel against the 5% allowed. So it is a repair, and what closes it is the
glyph's own weight or colour, not the ground: `9d9bc09` already moved it off the
light-ground amber token and it sits at 10px in `ink-soft` inside an `amber/45`
ring.

---

## Closed

### 2026-09-12

- **The About wall's duplicate download.** `AboutImage1` was fetched at two
  rungs on `/about/` — the scene's 1024 and, from the wall's warm queue, a 640
  that nothing painted. The left tall tile now declares the scene's own string.
  4087923 → 4040752 bytes of image at 390×664 DPR 3 and the same 47171 at
  1440×900 DPR 2; `currentSrc` identical at all thirteen finale stops in both
  viewports and both engines. `ad24ae0`.
- **The README screenshot**, retaken with the cue and the dither on it, the
  hero closed at rest and the wave pinned at 640ms of its loop. `083aa8d`.
- **`AGENTS.md` out of `git status`.** `786f348`.
- **The strike's first leg, re-measured and confirmed closed.** `84031e0` took
  it to the mark's own ink in September; this build reads **3.01–3.23** as the
  worst over the whole leg, in Chromium and WebKit, at 375×553, 390×664,
  390×750, 390×844 and 1440×900 — 3.47 at its home row, which is the number
  `DESIGN-SYSTEM.md` records. The 2.0–2.3 figures that were carried are the
  **diff-gated** column, not the ink: the rule is 2 CSS px declared and
  1.71–2.00 painted because the descent scales the block, so its top and bottom
  device rows are antialiased fringe and the gate column reads 1.16–3.47 on
  them. No commit; the measurement is the finding.
- **The finale's reduced-motion twin.** Verified still at 2px — `b1420a6`
  closed it and nothing since has moved it.

### The opening's close and its way back in

- `7d22d83` scrolling back to the top closes the opening; `be755a8` a flick
  that carries the page to the top closes it; `a449a56` any upward input at the
  top closes it, with an 8px jitter floor and no threshold at all.
- `6480aec` the way back in survives the top of the page springing; `850afb2`
  it is not Safari's pull-to-refresh; `73c688b` home arrives closed from
  another route; `23d8b25` on touch the close follows the finger, through the
  driver's own gains, with the stuck-move watchdog behind it; `0093a09` the
  close carries its own clock.
- `a25516e` the opening plays once per page load; `1fbe748` the keyboard
  opening tells the driver where it stands; `43c934e` and `7c13e14` keep the
  settle off a deliberate slow scroll and out of the hand's own cadence;
  `f9f0985` (reverted at `9c79588`, relanded at `0569921`) puts the opening on
  the glass on the frame its input landed in; `b67a3e9` gives the card's copy
  of the picture its own frame for the push.

### The route wipe and the prefetch

- `43c1574` the destination wipes over the page on a route change; `0ecce7f`
  its title is painted with its photograph; `7242eb2` its first frame is its
  photograph.
- `ea3f081` the hero starts on the intent rather than the tap; `56f842f` the
  three inner heroes come out of home's idle time; `689898c` the device picks
  the rung and paints it on the first frame; `4b5468e` the destination's
  photograph is warmed by its own `<picture>`; `3076893` it is painted at 24px
  before the wire; `a877b65` the resting hero carries that placeholder under
  its own copy; `8348561` a prefetch resolves its rung against the layout
  viewport; `709a1be` the wall's seven frames are warmed before the reader is
  in them.

### The pinch, the zoom and the watchdog

- `96a3c48` a pinch is not a scroll; `bcc4cde` the canvas can be pinched;
  `a54c437` the globe keeps its context across a resize; `aa643d4` resize
  handlers read the layout viewport; `4928e0f` a pinch never closes the opening
  and a zoomed page is inert; `2bfd2ca` a page scale is not a frame to render.
- `d0c1f25` a zoom always ends — the 2026-09-11 double freeze was one cause, a
  pinch with no final `visualViewport` event, and `watchZoom` now polls.
  `076bebb` puts a liveness floor under every gesture machine.

### The banding dither

- `b035e60`, reverted at `e408e47`, reapplied at `40a9389`: every ramp is
  dithered, so an 8-bit contour has no line in it. Mean absolute contribution
  0.18–0.59 of a code value on every single-layer region, both engines agreeing
  within 0.01. The one region over target is item **1** above.

### The paragraph ramp

- `97db3c1` one reading size for every paragraph on the site — 17 / 19 / 20 per
  breakpoint and nothing else, measure held at 44ch; `80cb9f1` a section's
  opening paragraph gets its own step above `md`; `a7dfded` About's closing
  paragraph sits on the body step.
- The closing paragraph's arrival with it: `313e249`, `db76ff2`, `4606fbd`,
  `2cfccb1` — one clock, cued at 0.92 H, no scrubbed text left on the site but
  the finale's own exit; `a8a30c6` the finale arrives the way the scenes above
  it do.

### The scroll cue

- `9d832ff` said how to leave the opening in words and was reverted at
  `faa0bd0` — two rounds of a tracked label read as ornament however they were
  set. `86136f1` stands the cue from the first frame, `6bbb34c` makes it a mark
  that falls, and `4db0158` is what ships: three chevrons at a 0.4 floor, 200ms
  apart on a 1600ms loop, opacity only, so the mark is never absent and what
  travels is which of them is lit.

### 404, SEO, robots, sitemap, JSON-LD, llms.txt, favicons

- `e676900` a page for addresses the site does not have, exported as
  `404.html`; `89d0300` it carries no canonical of its own.
- `efae8e6` `robots.txt` and a sitemap of the four routes; `633f4a5` the
  organisation as structured data in the layout, beside `b578afd`'s FAQPage;
  `b7b3c86` the social card; `3a8817c` `llms.txt` at the site root; `3d6e793`
  the apple touch icon and a 32px favicon beside the 512px one; `945e0b3`
  records the pass and the custom-domain steps, which are item **9**.

### The CI cache

- `24b4b6a` keys the variant signature on content and restores the tree in CI,
  so touching a file no longer re-encodes and changing its bytes does;
  `04f79a2` bumps the workflow actions and pins Node from `package.json`. Item
  **10** is that it has never actually run in Actions.

### The Lighthouse work

- `11c4086` the plates and the later slides wait for the page to load;
  `1f7fb5c` the Earth's renderer waits with them; `bf23748` the section rail
  stops laying out the page to read it — home's only forced layout, 1314 reads
  to 0. What is left of it is item **5**.

### Earlier, and still standing

- **The opening itself.** `84031e0` the poster's sky band for the strike;
  `45cd089`, `50a53e1`, `bad08f6` the gains' rule, arrival and the valley's
  wipe; `54d1706` Contact's seam on a phone; `e4c3f19` the desktop headline
  clear of the land; `3d7e263` and `7939384` the clearing at the natural stop
  and ending where its content ends; `def4bc1` its words at 18svh.
- **The grounds.** `c18731d` and `fec3fd4` the gains box; `3a9168b` the FAQ on
  `IMG_3004` cut to 0.968:1; `a29a1fd` About's ground re-cut to the same
  aspect; `e66ecf4` each inner page on its own photograph's dark.
- **The wall.** The A1 keystone was rejected on the device and the seven-tile
  wall restored; `e78d483` is the composition that stands. The abandoned
  removals — `327c1a0`, `f476dd4` — are **not** on `main`; check
  `git merge-base --is-ancestor` before trusting any note that says something
  was removed.
- **The Earth.** `85d68e2` + `53a3e35` revert the split the owner rejected;
  `cfefe1c` stands the Earth beside "What we do"; `b5723ef` lights the
  countries; `0cc1acf` sets it in the section's hour; `3aaaf92` caps the disc
  at 559px; `950f4dc`, `c1bde39` make it the grab. The dotted globe, the duotone
  skin and the amber route lines are rejected in `ART-DIRECTION.md §3`.
- **The rules and the marks.** `7215223` and `b1420a6` the finale's two at 2px;
  `dc2eb17` the dead `--hero-station-2` row; `9d9bc09` the FAQ chevron off the
  light-ground amber token.
