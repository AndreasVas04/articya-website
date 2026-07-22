# Photo grade — one body of work

The photographs were shot across several years on different cameras in
different light, and until this pass they sat *on top of* the gold world
rather than inside it. This document records the inventory that grounded the
grade, the three candidate grades that were built and screened, the winner
and why, and how to re-run or extend the grade when new photographs arrive.

Originals live untouched in `/public/images/_originals/`. The live files are
generated from them by `npm run grade:photos` (`scripts/grade-photos.mjs`) —
idempotent, re-runnable, fully revertible by copying the originals back.

## Inventory

Every raster asset actually referenced by the site (logo.png excluded —
artwork, not photography). Sizes measured on disk; stats measured on the
decoded pixels (luminance 0–255; p1/p99 are the 1st/99th percentile —
the clipping guard baseline; sat is mean HSV saturation; R−B is the mean
red-minus-blue channel gap, the temperature proxy: negative = cool).

| File | Px | KB | Renders (page · spot) | Display @1440 / @390 | On top of it (CSS) | meanL | sd | p1–p99 | sat | R−B | Contains |
|---|---|---|---|---|---|---|---|---|---|---|---|
| hero-1.jpg | 2048×1510 | 803 | Home hero slide 1 + hero backdrop · About finale center tile (ends full-viewport) | 1368×800 / 370×600; backdrop full-vp; finale ends ≈ full-vp | Card: `saturate(1.06) sepia(.08)`, gold-wash overlay .22–.75, warm vignette, grain ×; backdrop: opacity .18 blur 28px sat 1.2 + glass veil | 117.7 | 59.4 | 9–229 | .32 | −26.5 | people (backs), water, sky, scrub |
| hero-2.jpg | 1536×2048 | 1130 | Home hero slide 2 · About finale tile | as slide 1 / tile ~274×234 | same card stack | 70.0 | 51.7 | 2–205 | .37 | +8.1 | people (small), dense canopy, sky patch |
| hero-3.jpg | 2560×1195 | 827 | Home hero slide 3 · About scene 2 (wide print) · finale tile | slide as above; print ~566×318 / 358×304 | card stack; print: none on img (white mat, amber ring) | 104.4 | 59.9 | 5–232 | .30 | +26.9 | 3 faces/skin, moss, dry ground |
| home-youth.jpg | 1536×2048 | 777 | Home offer panel 1 (full-bleed) · About scene 4 · finale tile | 1440×900 / 390×844; print ~460×575 | Panel: `brightness(1.06) saturate(1.08)`, gold-wash/12 veil, reading wash .6–1, grain | 117.7 | 58.9 | 6–236 | .33 | +41.5 | hands/skin (lots), rope, pale ground |
| home-training.jpg | 1536×2048 | 475 | About scene 5 · finale tile | print ~460×575 / 358×304 | none on img (mat + ring) | 137.8 | 69.3 | 2–239 | .33 | +13.2 | faces/skin, lawn, harsh sun |
| FAQ.jpg | 2560×1706 | 611 | Home offer panel 2 (full-bleed) · FAQ page hero | 1440×900 / 390×844; hero full-width bg | Panel stack as above; hero: gold-scrim + gold-light + warm vignette + grain | 146.1 | 59.3 | 17–242 | .31 | +45.4 | faces/skin, office interior, corkboard |
| About.jpg | 6000×4000 | 1920 | About page hero (bg-cover) | ~1440×720 / 390×~600 | gold-scrim + gold-light + warm vignette + grain + chrome pool | 106.4 | 61.7 | 7–226 | .40 | +39.5 | hands/skin, wooden desk, papers |
| AboutImage1.jpg | 4032×3024 | 2349 | About scene 1 · finale tile | print ~460×575 / 358×304 | none on img (mat + ring) | 130.3 | 61.4 | 3–250 | .34 | +37.3 | faces/skin, indoor flash, tile wall, flags |
| AboutImage2.jpg | 1536×2048 | 270 | About scene 3 · finale tile | print ~460×575 / 358×304 | none on img (mat + ring) | 102.7 | 60.2 | 2–217 | .46 | −34.8 | group, cabin, vivid greens, big sky |
| Contact.jpg | 6000×3518 | 2462 | Contact page hero (bg-cover) | ~1440×720 / 390×~600 | gold-scrim + gold-light + warm vignette + grain + chrome pool | 139.7 | 57.8 | 15–223 | .28 | +37.0 | faces/skin, office interior |

Not referenced anywhere (dead assets, left untouched): `HomeBack.jpg`,
`AboutBack.jpg`, `ContactBack.jpg`, `FAQBack.jpg` (exported as `background`
consts in `/content` but never consumed), `Opportunities.jpg`,
`OpportunitiesBack.jpg`.

Payload note: the full referenced set was **11.90 MB** on disk originally;
the **home page** set is hero-1/2/3 + home-youth + FAQ (**4.25 MB**
original). The encode policy is quality first, size second: no file ships
below JPEG quality 88, and the payload budgets — home ≤ 4.8 MB, full set
≤ 12.5 MB, both above the original payloads — are spent raising quality
further, smoothest files first (lowest bytes per pixel at the floor), since
flat fields are where compression shows first. An earlier rule held every
file at or under its original byte size; it is revoked — the grade raises
local contrast and chroma, which makes the pixels harder to compress, so a
fixed byte ceiling silently forced quality down exactly where flat skies
and walls needed it (AboutImage2 shipped at q61, About at q81, and their
flat regions posterised).

`AboutImage1.jpg` carries an EXIF orientation flag (camera held sideways);
the grade pipeline preserves the flag rather than baking the rotation, so
dimensions and rendering stay byte-identical in behaviour.

## Groups by shooting condition

- **G1 · open-trail midday, cool** — hero-1, AboutImage2. Big blue sky/water,
  harsh sun, cool cast (R−B −26 to −35), the most saturated blues on the site.
- **G2 · forest dapple** — hero-2, hero-3. Canopy light, deep shadows;
  hero-2 leans green-neutral, hero-3 already warm.
- **G3 · warm midday close-up** — home-youth, home-training. Pale
  washed-out ground, hard highlights on skin, already amber-leaning.
- **G4 · indoor office, warm beige** — FAQ, About, Contact. Even artificial
  light, lifted blacks, beige-on-beige; reads as a different world from the
  outdoor set.
- **G5 · indoor flash** — AboutImage1. Mixed flash + ambient, tile wall,
  the flattest and coolest-lit interior.

The real stakes: the About scene prints and finale mosaic (bare images inside
white mats and amber rings — no veil rescues them), the two full-bleed offer
panels, and the three inner-page heroes. The home hero card carries its own
wash and the backdrop is glass at 18%/28px — the grade barely reads there.

## The three candidates

All three live as named functions in `scripts/grade-photos.mjs` and share one
pixel pipeline: white balance → tone curve (lift/gamma/soft shoulder) →
sigmoid contrast → hue-band moves in HSV (raised-cosine falloff, skin
protected) → vibrance → split-tone. Each defines a base look plus per-group
corrections. They are three points of view, not three intensities:

- **`resinHour`** — the site's own hour of light. Warm highlights toward the
  amber accent, shadows toward pine-brown, greens eased from camera-cyan
  toward pine, and every sky pulled onto one late-day powder blue
  (`hueTarget: 212` — a cyan horizon and a violet-leaning zenith both land on
  the same sky). **Winner.**
- **`matteArchive`** — one photo book printed on warm paper. Lifted warm
  blacks (p1 rises to ~20), highlights rolled to cream, colour quieted a step
  everywhere. Coherent and calm — and timid. On the gold ground the lifted
  blacks read as wash rather than intent at print size, and the set unifies
  by giving colour up, which is the one job the photographs must not resign
  (they are the only place real colour lives on this site).
- **`cyprusSummer`** — colour-forward postcard: punchy S-curve, vibrance,
  blues toward Mediterranean teal, greens deepened. Prettiest single images,
  weakest set: the cool teal skies keep answering the gold ground instead of
  joining it, so the site still reads as photos sitting on a designed
  surface — and at the first tuning (−20° hue) skies and a blue shirt went
  visibly filtered, which is the tell that this direction fights the assets.

### Screening notes (what the iterations changed)

1. First pass killed the trail skies: warm white balance dragged cyan toward
   green (a sickly horizon on AboutImage2), and desaturating to compensate
   left milky-cream skies. Constant hue *offsets* were the wrong tool.
2. Second pass replaced the sky offset with a **hue target pull** — all blues
   converge on one hue instead of moving by one amount. This is the move that
   made ten skies read as one afternoon, and it is the part worth keeping if
   the grade is ever rebuilt.
3. Third pass, on the built pages: sky `satScale` 0.72 → 0.78 and vegetation
   0.94 → 0.98 — at full bleed the first values went slightly milky and
   yellow; the finals keep believable blue and living green inside the warm
   cast.

## Why resinHour won

Judged on the built pages at 1440 and 390 (not on thumbnails): the About
prints and the finale mosaic now read as one photographer's work — the three
office interiors and the flash interior joined the outdoor set instead of
sitting beside it; skin stays human in every shot (the skin-hue band is
excluded from every selective move); greens read pine rather than camera-cyan
but stay unmistakably green; and the one unified sky does the most of the
unifying while remaining honestly blue. The photographs keep real colour —
nothing drifted toward gold monochrome.

## Amplitude — the second pass

The first bake unified the set but was too quiet to see: mean ΔE2000
between each original and its graded output measured 2.0–5.0 per image
(3.1 across the set) — below the visibility threshold on photographs that
already carry natural colour variation. The grade now takes a **strength**:
a multiplier on each delta from the original — linear for the moves that
rotate a colour, through a soft knee for the three that displace one (see
below) — with `1` reproducing the first bake byte-identically. Production
ships at **5×**;
`--strength=all` additionally bakes 1× and 9× (1.8 × target) into
`public/images/_grades/` for the review page.

### Rotations scale, displacements saturate

The first 5× bake was too strong in a way that "too strong" does not
describe: it did not over-colour the photographs, it *flattened* them. On
hero-2 the deep-shadow mass of the canopy — pixels below L 0.12 — fell from
32% of the frame to 2.6%, and the leaves that survived read as speckle
scattered on a flat wash rather than as a canopy with light coming through
it. The dark field the picture was built on had been lifted out from under
its own subject.

The cause is that a strength multiplier was applied to two different kinds
of move as though they were one kind. A **rotation** — a hue pull toward a
target — can scale linearly and stay safe, because a hue that has already
arrived cannot travel further; the sky converging on 212° is bounded by its
own target. A **displacement** — a move that drags a pixel's whole colour
toward a fixed value — has no such bound, and at 5× it simply arrives. The
split-tone shadow amount reached 0.45, which drags the deepest shadow 45% of
the way to a mid-value tint; the shadow lift reached 0.06, putting a floor
under every black in the frame.

Three moves are displacements, and all three now pass through a soft knee
(`softStrength`, linear below the knee then a tanh roll toward a ceiling —
the same shape the tone curve already used on highlights):

| Move | Linear at 5× | Kneed at 5× |
|---|---|---|
| White-balance look gain | 1.200 / 1.000 / 0.750 | 1.115 / 1.000 / 0.852 |
| Split-tone shadow amount | 0.450 | 0.207 |
| Split-tone highlight amount | 0.650 | 0.299 |
| Shadow lift | 5.0× base | 1.5× base |

The lift was the least obvious of the three and the most expensive. Measured
across the outdoor set, taking it from 5× to 1.5× costs about **0.1 ΔE2000**
and returns **25–38 points** of deep-shadow mass — it was almost pure cost, a
black point climbing with strength, which does not make a stronger look, only
a shallower photograph. Below the knee `softStrength` is the identity, so the
base bake is untouched: strength 1 still reproduces the first bake
byte-for-byte, verified by comparison against the stored `_grades/base` files.

### Sky membership is a weight, not a verdict

The same bake put gold beside blue around the holes in a canopy. In bokeh,
sky and leaf mix inside a handful of pixels, so a classifier that answers
yes or no must cut a seam somewhere in that transition — and there were two
such classifiers. The sky pull saturated its membership (`min(skyW0 × 3, 1)`,
so anything a third sky was treated as wholly sky), and the near-neutral
guard snapped every pixel to one of two hues 172° apart on a `blue0 > 0.5`
test.

Both are now soft. Membership is one feathered weight, judged on the original
pixel as before, with a loose chroma gate so a pale sky still counts as
wholly sky and only a near-neutral falls out of the band; a pixel that is 40%
sky receives 40% of the sky treatment. The neutral guard weights its hue
unification by how confidently the pixel sits in its camp, so an ambiguous
pixel keeps its own hue — at that chroma the hue is invisible either way, and
the chroma cap has already removed the noise the guard exists to remove.

The guards do not scale — above base strength they tighten:

- The tanh shoulder and lift floor never move; clipping stays impossible.
- The sky is exempt from the warm look entirely: membership is judged on
  the *original* pixel (a strong warm wb flips pale blue out of the band
  before the pull could claim it) and is a soft feathered weight rather
  than a yes/no (see above); wb blends to neutral over it, and vibrance
  and both split-tone ends are blocked there in proportion to that weight.
  Sky colour is governed only by the convergence pull and the pinned 0.78
  saturation scale.
- Skin: the split-tone backs off faces, and a saturation cap keeps a face
  within a step of what the camera saw.
- Near-neutrals: chroma is capped near the original's and hue unified
  toward the warm tint (pale blues toward the sky hue instead), so
  amplified chroma noise cannot posterize white fabric.
- Vegetation: hue shift clamped at 1.7× and chroma floored at 0.88 —
  greens stay green.
- Chroma ceiling: no pixel's chroma may run past 2.6× what the camera saw
  (plus a hair, so true neutrals keep the warm tint), compressing 4:1 above
  the knee rather than clipping. 2.6 sits above the vegetation band's
  measured p99 gain on every image, so the pine greens pass untouched; the
  3–10× tail beyond it was amplified chroma noise — mottle on flat walls.
  The deliberate warm pull on neutral interiors survives because it is an
  affine move toward a fixed tint (its noise gain is below 1): flat-region
  chroma noise ships at or below the original's on every file.

Four moves exist only above base strength: the shadow tint drifts from
warm brown to pine (30° → 105°), the highlight tint deepens into amber
(46° → 37°), greens sink 12% in luminance toward dusk, and the brightest
non-sky, non-skin pixels pull toward amber — sunlit foliage going golden.

## Measured results (target strength, 5×)

- **Deep-shadow retention** — the fraction of pixels below L 0.12, as a share
  of the original's own fraction, whole frame: hero-1 92% · hero-2 77% ·
  hero-3 64% · home-youth 88% · home-training 94% · FAQ 84% · About 84% ·
  AboutImage1 93% · AboutImage2 97% · Contact 78%. Every file holds at least
  60%; before the knees, the same set ran 8–66% and hero-2 kept 8%.
  Shadows warm and shift hue under this grade; they no longer evaporate.
- **Seams** — hue flips greater than 90° between adjacent pixels whose
  luminance is unchanged (a colour boundary with no light boundary, which is
  what a hard classifier leaves behind), counted per 1000 adjacent pairs in
  each file's busiest window. The shipped grade sits at or below the
  *original's* own rate on every file — hero-2's canopy 1.9 in the original
  against 0.7 shipped, gold↔blue 0.44 against 0.12. The grade introduces no
  colour boundary the photograph did not already have. AboutImage2 is the one
  file whose gold↔blue count rises above its original (0.04 → 0.22 per 1000);
  inspected at 1:1 it is a blue lanyard against sunlit grass — real subject,
  not a seam.
- Mean ΔE2000 original → graded per image: hero-1 6.9 · hero-2 5.9 ·
  hero-3 7.3 · home-youth 7.3 · home-training 6.8 · FAQ 7.3 ·
  About 6.5 · AboutImage1 8.0 · AboutImage2 6.9 · Contact 7.4.
  Set mean **7.0**, down from 10.2 before the knees.

  The earlier acceptance window (8–20 per image, set mean ≥ 10) is
  **withdrawn**. It existed to stop the grade being timid, and it did that
  job; it is not a target. ΔE2000 compresses large uniform shifts, so it
  rewards exactly the flattening this pass removed — the busy outdoor files
  lost the most ΔE because they gained back the most shadow. The grade is
  visibly a grade at display scale (see the crops), and no knob was raised
  anywhere to defend the number.
- Sky: per-image mean hue **211.0°–212.4°** against the 212° target, with
  within-image circular sd 0.9°–3.4°; the spread of the per-image means
  across the eight files carrying sky is **0.41°** (0.32° before the
  feathering — softening membership costs a fraction of a degree of
  convergence and buys the bokeh transitions).
- Highlights: chroma-weighted mean hue of each image's top luminance
  decile lands at **38–44°** — amber on every image.
- Shadows: green excess (G − (R+B)/2) of the original's bottom luminance
  decile rises on every image (hero-2 +3.6 → +11.1, hero-1 −1.2 → +1.2);
  nine of ten also move closer to pine in hue, and the tenth (hero-2) was
  already there (96° → 89°).
- Greens: vegetation hue moves toward pine on every image (e.g. 80° → 60°),
  chroma at 100–178% of the original — never below it.
- Skin: mean skin hue 26.1°–33.5° (human), saturation capped — largest
  rise +0.11 on the coolest original.
- Chroma ceiling: the population sitting above the knee
  (`s > 2.6·sat0 + 0.02`, where the guard starts compressing 4:1) fell on
  every file — Contact 23.9% → 0.35%, FAQ 12.3% → 1.3%, About 12.9% → 2.9%,
  home-youth 11.1% → 3.9%. The looser white balance is doing most of that.
- Precision: the grade runs in floating point end to end and drops to
  8-bit exactly once, through serpentine Floyd–Steinberg dithering with
  the error measured in linear light — no intermediate lossy step, no
  intermediate rounding. Pre-encode block-boundary structure measures
  b ≈ 1.0 (none) on every file.
- Per-file, JPEG quality and KB original → shipped: hero-1 q92 803→835 ·
  hero-2 q92 1130→1216 · hero-3 q92 827→863 · home-youth q92 777→787 ·
  home-training q95 475→375 · FAQ q95 611→630 · About q92 1920→2589 ·
  AboutImage1 q92 2349→1867 · AboutImage2 q94 270→580 ·
  Contact q95 2462→2448. Home payload **4.43 MB / 4.80**, full set
  **12.48 MB / 12.50**. Dimensions, formats and EXIF orientation
  unchanged; clip guard clean on every file at every strength.
- Flat-region fidelity (flattest 128px of each file, mean |luma step|
  across 8px block boundaries, original → shipped): every file within
  ±0.2 codes of its original's own structure or smoother; worst absolute
  boundary step in the set 0.66 codes (home-training) against 0.86 in its
  original. The first encode's failures — About 0.11 (wall posterised to
  one flat expanse at q81), AboutImage2 blocked at q61 — are gone.
- Text contrast, measured on the rendered composite at the **glyphs**: the
  page is screenshotted twice per position, once as rendered and once with
  the glyphs painted transparent, and the two are diffed — the pixels that
  changed are the glyphs, and the blanked frame gives the ground behind
  exactly those pixels. Worst photo-backed zone **6.16** (about hero lede,
  390; 6.66 at 1440 on the FAQ hero headline) against a 4.5 floor. Console
  clean on all four pages, both viewports.

  Two earlier methods were wrong and are recorded so they are not repeated.
  Sampling the *lightest* pixel in a text box is the worst case only for
  light text on a dark ground; the site is dark text on gold, where the worst
  case is the darkest pixel — the reading has to minimise contrast directly,
  whichever polarity. And scoring a text box wherever it is in the viewport
  scores blocks that are not painted at all: the offer-panel copy is
  opacity-driven by scroll progress, and an opacity heuristic does not catch
  it, which produced spurious sub-4.5 readings at scroll positions where the
  panel shows no text whatsoever. Requiring a real glyph-pixel population
  (tens of thousands per zone here) fixes both.

  The one zone below 5.0 anywhere is the "What we do" lead at 4.90 (1440,
  `ink-soft` on the gold ground). It measures **identically with the previous
  photographs swapped back in**, so it is a property of the amber pool under
  that lead and not of the grade.

## Re-running and extending

- `npm run grade:photos` regrades everything from `_originals/` at the
  target strength — safe to run any number of times; output is a pure
  function of the originals. `--strength=<name|number|all>` selects a
  strength (`base`, `target`, `max` are named in the script); `all` bakes
  base and max into `public/images/_grades/` with target live.
- To revert: copy `_originals/` back over the live files.
- New photograph: drop the untouched file in `_originals/`, add its filename
  to the matching group in `GROUPS` (or a new group with a `wb` correction
  that neutralises its cast first — judge the cast the way the inventory
  table does, by mean R−B), reference it from `/content`, run the script.
- Screening changes: `--grade=<name> --out=<dir> --width=520` renders any
  candidate at preview size without touching the live files.
- The review page at `/grade-review` (unlinked) shows every photograph as
  one slot that flips in place between original / 1.0× / target / 1.8×
  (keys 1–4 or arrows, state always labelled), with two placements at
  their true site render size, the About mat example, and 1:1 pixel crops
  (actual pixels, original against shipped) of the flattest regions of the
  three files the first encode hurt most — delete `app/grade-review/` and
  `public/images/_grades/` once the grade is signed off.
