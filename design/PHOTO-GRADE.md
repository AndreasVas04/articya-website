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
pixel pipeline: white balance → tone curve (gamma/soft shoulder) → sigmoid
contrast → black point → hue-band moves in HSV (raised-cosine falloff, skin
protected) → vibrance → chroma ceiling → split-tone. Each defines a base look
plus per-group corrections, and one shot additionally carries a trim. They are three points of view, not three intensities:

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
ships at **5×**. `base` (1×), `target` (5×) and `max` (9×) are named in the
script; any other strength can be baked to a scratch directory with
`--strength=<n> --out=<dir>` to compare against the live files.

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
strength axis leaves the base look's own parameters alone. (The base *bake*
is no longer byte-identical with the first one — the mechanism pass below
changed three things that apply at every strength.)

### Sky membership is a weight, not a verdict

The same bake put gold beside blue around the holes in a canopy. In bokeh,
sky and leaf mix inside a handful of pixels, so a classifier that answers
yes or no must cut a seam somewhere in that transition — and there were two
such classifiers. The sky pull saturated its membership (`min(skyW0 × 3, 1)`,
so anything a third sky was treated as wholly sky), and the near-neutral
guard snapped every pixel to one of two hues 172° apart on a `blue0 > 0.5`
test.

Both are now soft. Membership is one feathered weight, judged on the original
pixel as before; a pixel that is 40% sky receives 40% of the sky treatment.
The chroma gate that decides how much of a pixel is sky was retuned in the
mechanism pass below — the version written here, which counted anything past
12.5% chroma as wholly sky, is what turned white fabric into camps.

The guards do not scale — above base strength they tighten:

- The tanh shoulder and lift floor never move; clipping stays impossible.
- The sky takes a *reduced* share of the warm look rather than being exempt
  from it. Membership is judged on the *original* pixel (a strong warm wb
  flips pale blue out of the band before the pull could claim it) and is a
  soft feathered weight rather than a yes/no (see above). Vibrance is
  blocked over it in proportion to that weight; the warm balance reaches it
  at `skyWarmShare` 0.35 and the amber highlight split at 0.4, and its
  saturation scale is pinned at 0.78. Full exemption was the earlier rule
  and it is **withdrawn** — see "The vista and the sky's share" below for
  what changed and what it cost.
- Skin: the split-tone backs off faces, and a saturation cap keeps a face
  within a step of what the camera saw.
- Vegetation: hue shift clamped at 1.7× and chroma floored at 0.88 —
  greens stay green.
- Chroma ceiling: one law, `sat0 + 0.05` opening to a bounded multiple
  where there is real colour, compressing 4:1 above the knee rather than
  clipping. It replaced a pair of guards in the mechanism pass below.

Four moves exist only above base strength: the shadow tint drifts from
warm brown to pine (30° → 105°), the highlight tint deepens into amber
(46° → 37°), greens sink 12% in luminance toward dusk, and the brightest
non-sky, non-skin pixels pull toward amber — sunlit foliage going golden.

## Mechanisms, not amplitude — the fourth pass

Three defects survived every measurement above and were found by looking at
the built page at the size a visitor sees it: contour zones on white fabric,
dark clumps in the hero canopy, and hero-1 sitting outside its own set in the
About mosaic. The first two had been invisible because every check to that
point was run on 1:1 crops in image space, where a gentle zone boundary
across a sleeve reads as nothing at all.

The obvious response was to lower the strength, and a ladder settled it: at
2× — the lowest rung the strength axis has — the fabric already shows its
contour ring and the canopy already shows its lifted, blotchy shadow mass.
Both defects were therefore in mechanisms rather than in amplitude, and no
strength was going to fix them. Each was found with a negative control, and
the first control refuted the leading suspect: baking with the near-neutral
guard switched off made the fabric **worse**, not better. The guard was
mitigating something upstream, not causing it.

**Fabric.** Sky membership gates three separate moves — the warm balance
steps aside for sky, the convergence pull claims it, and the highlight
split-tone releases it. Its chroma gate saturated at 12.5% chroma, so a white
shirt in open shade, hair and pale walls all read as fully sky. Tracing one
scanline across a sleeve, membership swung 0 → 1 → 0 → 1 → 0 between adjacent
patches of cloth, and the output hue went 38° → 212° → 41° → 212° → 175° with
it: hard cream and blue zones with green fringes along the boundaries. The
gate now ramps between where those surfaces sit (2–13% chroma, measured) and
where real sky sits (22–63%), so it never reaches a verdict in the gap. The
near-neutral guard's own hue unification — which snapped a pixel toward one
of two targets 172° apart — painted the camps the gate had split, and is
gone; what remains is a single chroma ceiling with a fixed headroom at the
neutral end, which also subsumes the old 2.6× amplification ceiling.

**Canopy.** The shadow split-tone targeted a colour at a *fixed* level
(v 0.28). On a frame whose shadows sit below that — the hero canopy runs at
0.03–0.10 — "tone toward" becomes "lift toward": the deepest fifth of the
frame was dragged a fifth of the way to a mid-dark green, which raised the
compression noise living down there into view and flattened the shadow's own
variation onto one colour. Both split-tone targets are now taken at the
pixel's own luminance, so the move is purely chromatic, which is what a
split-tone is. Switching the split off entirely was the control: the
clumping vanished with it.

That change took the black point with it — the shadow lift had been applied
*before* the contrast curve, and the sigmoid pulled a lifted 0.018 back to
0.0004; the split-tone's lift had been the only thing holding the floor up.
The lift now runs after the contrast, where it is a floor nothing can fall
through, and the clip guard is clean on every file at target strength.

**hero-1.** The grade moves hero-1 exactly as much as it moves the set
(+9.4 b\* against +9.1), so the gap it arrives with is the gap it keeps — it
is the only wide vista in a set of close-range scenes, and distance haze
leaves its land paler and cooler. Global grade plus per-shot trim is the
normal shape of this work, so hero-1 took the set's first trim: warmer and
richer land, sky and water back a step. Measured on the rendered mosaic tile
below its skyline against the mean of its six neighbours, Δb\* −4.80 → −3.86
and ΔC\* −6.06 → −5.59; the aggregate whole-frame numbers move less, because
open sky, lit water and distant haze dominate them and none of those is what
makes a tile read as a different hour.

## The vista and the sky's share — the fifth pass

The trim above moved hero-1's land and left its sky where it was, and on the
About mosaic that was not enough: a frame that is 28% sky cannot join the
afternoon while the sky is held out of it, because the share of the frame
that is allowed to warm is only the share that is land. The exemption was
the right rule when the sky in this set was small windows between leaves —
it is what stopped the green horizons and violet zeniths of the first pass —
and it does not survive a frame built out of sky.

Three changes followed, all of them above base strength:

- **`skyWarmShare` 0.35** — the warm balance now reaches the sky at 35%
  instead of 0.
- **`splitSkyProtect` 0.6** — the amber highlight split reaches it at 40%.
- **`skyHaze`** — a late-afternoon sky holds its colour overhead and washes
  pale and warm where the air is deepest. Depth of air is read from the
  sky's own chroma measured per frame, not from height in the frame and not
  from brightness: AboutImage2's sky runs 232 at the zenith and 223 at the
  roofline, so a luminance gate hazes both equally and takes the whole sky
  grey, where chroma over the same span falls 60% → 44%. Haze thins the
  colour *before* it warms it, and the order is load-bearing — the path from
  a cyan horizon to a warm target passes through green, and blending straight
  to warm put a green band along AboutImage2's roofline (hue 192 original,
  151 graded). Paling first spends most of that distance as chroma rather
  than rotation, so what is left cannot cross.

**What it cost, stated plainly.** The convergence claim from the third pass
no longer holds, and it was traded away deliberately rather than lost. On the
three files that carry real sky, mean sky hue now moves *away* from the 212°
target rather than onto it — hero-1 213.2° → 190.3°, AboutImage2 210.3° →
188.2°, home-training 210.0° → 193.9° — and the circular spread within each
frame rises from 3–6° to 45–50° instead of falling. Both are the intended
shape of the change: haze is by definition a gradient across the sky, so a
sky that hazes correctly must spread, and one converged onto a single hue is
one that has had its depth flattened out of it. The previous pass bought a
tight number by holding the sky out of the grade; this pass spends it to put
the vista in the same hour as the rest of the set.

The 212° pull is still in the pipeline and still does the work it was built
for on skies seen through canopy. It is no longer the whole story of the sky,
and **the numbers in the third pass's screening notes should not be read as a
target to restore.**

## Measured results (target strength, 5×)

Provenance, because it matters when re-reading these: deep-shadow retention,
ΔE2000, sky and highlight hue were **re-measured against the currently
shipped files** after the fifth pass, on a 1200px decode (these are
population statistics; full resolution moves them in the third decimal). The
seams, shadow, green, skin, precision and flat-region bullets date from the
fourth pass and were not re-run — the fifth pass touched only the sky path,
but if one of those numbers is about to be relied on, re-measure it rather
than quote it.

- **Deep-shadow retention** — the fraction of pixels below L\* 12, as a share
  of the original's own fraction, whole frame: hero-1 101% · hero-2 93% ·
  hero-3 85% · home-youth 98% · home-training 101% · FAQ 113% · About 121% ·
  AboutImage1 98% · AboutImage2 105% · Contact 117%. Before the knees the
  same set ran 8–66% and hero-2 kept 8%; with the knees it ran 64–97%; the
  luminance-preserving split-tone closes the rest, because the shadow tint
  had been the last thing still lifting the black mass. Shadows warm and
  shift hue under this grade; they do not evaporate and they do not float.
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

  This measure passed while the fabric defect was shipping, and it is worth
  being clear why: it counts *adjacent-pixel* flips, and the zones on a
  sleeve were tens of pixels wide with soft boundaries. A metric tuned to
  hard classifier seams cannot see a soft one. What sees it is a crop of the
  rendered page at the size the visitor reads it.
- Mean ΔE2000 original → graded per image: hero-1 10.2 · hero-2 6.7 ·
  hero-3 6.6 · home-youth 8.0 · home-training 8.5 · FAQ 7.1 ·
  About 6.4 · AboutImage1 7.5 · AboutImage2 10.7 · Contact 7.2.
  Set mean **7.9**, against 6.7 after the mechanism pass, 7.0 before it and
  10.2 before the knees. The rise is concentrated exactly where the fifth
  pass worked: the four files carrying real sky (hero-1 7.3 → 10.2,
  AboutImage2 6.4 → 10.7, home-training 7.1 → 8.5, home-youth 6.9 → 8.0)
  account for nearly all of it, and the seven others moved by ≤ 0.4.

  The earlier acceptance window (8–20 per image, set mean ≥ 10) is
  **withdrawn**. It existed to stop the grade being timid, and it did that
  job; it is not a target. ΔE2000 compresses large uniform shifts, so it
  rewards exactly the flattening this pass removed — the busy outdoor files
  lost the most ΔE because they gained back the most shadow. The grade is
  visibly a grade at display scale (see the crops), and no knob was raised
  anywhere to defend the number.
- Sky, measured at full membership under the pipeline's own gate (the blue
  band at ≥ 26% chroma judged on the original pixel, which is where
  `SKY_CHROMA` saturates). Only three files carry sky worth reporting —
  hero-1 28.2% of frame, AboutImage2 32.7%, home-training 18.1%; hero-2 has
  3.7% seen through canopy and the remaining six have ≤ 0.3%, which is blue
  *objects*, not sky, and their statistics are noise.

  | File | Sky % | Mean hue | Circular spread |
  |---|---|---|---|
  | hero-1 | 28.2 | 213.2° → 190.3° | 3.6° → 50.3° |
  | AboutImage2 | 32.7 | 210.3° → 188.2° | 6.2° → 44.9° |
  | home-training | 18.1 | 210.0° → 193.9° | 3.1° → 49.7° |
  | hero-2 | 3.7 | 198.4° → 200.1° | 4.6° → 42.7° |

  Both columns move the opposite way from the third pass's convergence
  numbers, and both are the intended shape of the fifth pass — see "The
  vista and the sky's share". A sky that hazes correctly must spread.
- Highlights: chroma-weighted mean HSV hue of each image's top luminance
  decile lands at **38.7°–45.7°** — amber on every image, and the one
  measurement in this document that the fifth pass left where it was.
- Shadows: green excess (G − (R+B)/2) of the original's bottom luminance
  decile rises on every image (hero-2 +3.6 → +11.1, hero-1 −1.2 → +1.2);
  nine of ten also move closer to pine in hue, and the tenth (hero-2) was
  already there (96° → 89°).
- Greens: vegetation hue moves toward pine on every image (e.g. 80° → 60°),
  chroma at 100–178% of the original — never below it.
- Skin: mean skin hue 26.1°–33.5° (human), saturation capped — largest
  rise +0.11 on the coolest original.
- Skin, after the trim: mean skin-band saturation shipped against the
  original runs 0.74×–1.26× across the ten files. The one file above 1.25 is
  hero-1, whose trim adds saturation and whose faces are then held exactly
  at the sanctioned step by the skin cap.
- Precision: the grade runs in floating point end to end and drops to
  8-bit exactly once, through serpentine Floyd–Steinberg dithering with
  the error measured in linear light — no intermediate lossy step, no
  intermediate rounding. Pre-encode block-boundary structure measures
  b ≈ 1.0 (none) on every file.
- Per-file, JPEG quality and KB original → shipped: hero-1 q92 803→849 ·
  hero-2 q92 1130→1254 · hero-3 q92 827→869 · home-youth q92 777→790 ·
  home-training q95 475→376 · FAQ q95 611→643 · About q92 1920→2578 ·
  AboutImage1 q92 2349→1895 · AboutImage2 q92 270→493 ·
  Contact q95 2462→2433. Home payload **4.51 MB / 4.80**, full set
  **12.47 MB / 12.50**. Dimensions, formats and EXIF orientation
  unchanged; clip guard clean on every file at base and target strength.
  The `max` rung (9×) trips it on five files, which is what that rung is
  for — it is a reference past shippable, not a candidate.
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
  exactly those pixels, sampled at the fully covered core of each glyph
  rather than its antialiased fringe. Worst photo-backed zone after the
  regrade **6.76** (about hero lede, 390), best 7.14 (contact hero headline,
  1440), against a 4.5 floor. Text parity passes on all four pages and the
  console is clean on all four, both viewports — re-confirmed on the clean
  rebuild after the review scaffolding was removed.

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

## Final parameters

What ships is `resinHour` at strength 5. Everything below lives in
`scripts/grade-photos.mjs`; this table is a reading aid, and the script is
the source of truth if the two ever disagree.

**Base look** (strength 1 — the numbers the strength axis scales from):

| Parameter | Value | What it does |
|---|---|---|
| `wb` | `[1.04, 1.00, 0.95]` | The warm look, as per-channel gain |
| `lift` | `0.012` | Black point, applied *after* the contrast curve |
| `gamma` | `0.985` | Tone curve |
| `shoulder` | `0.88` | Highlight roll-off (tanh; never scales with strength) |
| `contrast` | `0.06` | Sigmoid strength around a 0.45 pivot |
| `vibrance` | `0.05` | Boosts quiet colour only |
| `split.shadow` | hue 30°, sat 0.28, amount 0.09 | Shadow tint, taken at the pixel's own luminance |
| `split.highlight` | hue 46°, sat 0.34, amount 0.13 | Highlight tint, same |
| band 1 — sky/water | centre 215°, width 70°, `hueTarget` 212°, `huePull` 0.5, `satScale` 0.78, `lumScale` 0.94 | The convergence pull |
| band 2 — vegetation | centre 115°, width 60°, `hueShift` −12°, `satScale` 0.98 | Camera-cyan toward pine |

**Per-group white balance.** The group correction is a fact about the shot
and does not scale; only the look on top of it does.

| Group | Files | `wb` | Other |
|---|---|---|---|
| `trail` | hero-1, AboutImage2 | `[1.05, 1.00, 0.925]` | — |
| `forest` | hero-2, hero-3 | `[1.03, 1.00, 0.96]` | `contrast` 0.04 |
| `closeup` | home-youth, home-training | `[1.005, 1.00, 0.985]` | split amounts 0.06 / 0.10 |
| `office` | FAQ, About, Contact | `[0.995, 1.00, 1.00]` | `contrast` 0.08 |
| `flash` | AboutImage1 | `[1.045, 1.00, 0.93]` | `contrast` 0.05 |

**Strength axis.** `base` 1 · `target` 5 (ships) · `max` 9 (past shippable,
a reference to judge against). Rotations scale linearly; the three
displacing moves pass through a soft knee, `[knee, ceiling]` in strength
units: `wb [1.5, 3.2]` · `split [1.4, 2.3]` · `lift [1, 1.5]`.

**Moves that exist only above strength 1**, all saturating at strength 2
(`over = min(s − 1, 1)`): shadow tint drifts 30° → 105° (warm brown to
pine), highlight tint 46° → 37° (deeper amber), greens sink 12% in
luminance, `goldenHighlight` pulls the brightest non-sky non-skin pixels
toward 36°, and the sky's own share of the hour opens up (`skyWarmShare`
0.35, `splitSkyProtect` 0.6, `skyHaze` pale 0.10 / hue 42° / amount 0.55).

**Guards** — these tighten as strength rises, they never relax: the tanh
shoulder and the lift floor never move; sky membership is judged on the
original pixel through `SKY_CHROMA` `[0.12, 0.14]` (zero below 12% chroma,
full at 26%); the vegetation hue shift is clamped at 1.7× and its chroma
floored at 0.88; skin saturation is capped near the original's and the
split-tone backs off faces (`splitSkinProtect` 0.7); and one chroma ceiling,
`sat0 + 0.05` opening to a bounded multiple, compresses 4:1 above the knee
rather than clipping.

**Encode.** Quality floor q88, never breached. Payload budgets — home set
(hero-1/2/3, home-youth, FAQ) ≤ 4.8 MB, full referenced set ≤ 12.5 MB — are
spent raising quality above the floor, smoothest files first. If the floor
cannot meet a budget the floor ships anyway and the overage is reported.

## Per-file trims

A trim is about the company a shot keeps, not about the shot: size it
against the frames it is printed beside, on the rendered page, never against
its own original. `wb` is the obvious lever and a weak one — a 4% channel
move buys about 0.3 b\*, because the chroma ceiling absorbs most of what it
adds. The split-tone amounts run *after* that ceiling, so `warm` is the lever
with real travel, and `shadowHue` reaches the one part of the look that
decides whether a shadow-heavy frame reads warm at all.

| File | Trim | Why |
|---|---|---|
| hero-1 | `wb [1.035, 1, 0.96]`, `sat` 1.15, `contrast` +0.03, `skySat` 0.75, `warm` 1.5 | The only wide vista; distance haze leaves its land paler and cooler than the close-range set |
| hero-2 | `wb [1.045, 1, 0.94]`, `sat` 1.22, `warm` 1.4, `shadowHue` −40 | Shadow-heavy canopy — the frame is mostly shadow, so the shadow tint decides whether it reads warm |
| home-youth | `wb [1.02, 1, 0.96]`, `warm` 1.3 | Washed-out pale ground needed the warmth the group correction alone did not carry |
| AboutImage1 | `wb [0.99, 1, 1.02]` | Flash interior; a touch back from warm |
| AboutImage2 | `wb [0.99, 1, 1.02]` | Same, against its vivid greens |

Available keys: `wb`, `sat`, `contrast`, `skySat`, `warm`, `shadowHue`.

## Re-running and reverting

- **Re-run:** `npm run grade:photos` regrades everything from `_originals/`
  at the target strength. Safe to run any number of times — the output is a
  pure function of the originals, and re-baking the current tree reproduces
  every live file **byte for byte** (verified).
- **Bake another strength without touching the live files:**
  `node scripts/grade-photos.mjs --strength=base --out=/tmp/base`.
  `--strength` takes `base`, `target`, `max`, or any positive number.
- **Screen a different grade:** `--grade=<resinHour|matteArchive|cyprusSummer>
  --out=<dir> --width=520` renders at preview size, live files untouched.
- **Revert, completely:** `cp public/images/_originals/*.jpg public/images/`.
  The originals are never written to by anything in this pipeline.
- **New photograph:** drop the untouched file in `_originals/`, add its
  filename to the matching group in `GROUPS` — or a new group whose `wb`
  neutralises its cast first, judging the cast the way the inventory table
  does, by mean R−B — reference it from `/content`, and run the script. If
  it still will not sit with the others once it is grouped correctly, give
  it a `TRIMS` entry.

## Known limitations

Four things this grade is measured by, or built on, that do not hold as
generally as the numbers make them look. None is a defect to fix blind;
each is a place where a future pass should re-measure rather than trust.

1. **The seam metric has a blind spot, and it has already been hit.** Seams
   are counted as hue flips > 90° between *adjacent* pixels at unchanged
   luminance. That catches a hard classifier boundary and cannot catch a
   soft one: the contour zones on white fabric were tens of pixels wide with
   gentle boundaries, and this metric passed clean the entire time they were
   shipping. It also runs in image space at 1:1, where a gentle zone
   boundary across a sleeve reads as nothing. What actually caught the
   defect was a crop of the *rendered page* at the size a visitor reads it,
   and that remains the only check known to see this class of failure.
2. **b\* is confounded by lightness.** The warmth readings that drove the
   hero-1 trim are b\* differences, and b\* is not independent of how light a
   region is — a paler region reads lower b\* at the same perceived warmth,
   which is exactly the confound in a vista whose land is pale from distance
   haze. This is why the trim was sized on the *rendered mosaic tile below
   the skyline* against its six neighbours (Δb\* −4.80 → −3.86) rather than
   on the whole-frame aggregate, where open sky, lit water and haze dominate
   and none of them is what makes a tile read as a different hour. Any
   future warmth comparison has to control for lightness the same way, by
   choosing the region, or it will measure exposure and call it temperature.
3. **The vista stays slightly cooler than the set, by construction.** After
   both the trim and the fifth pass's sky work, hero-1 has not been brought
   to parity and is not meant to be. It is the one wide landscape among
   close-range scenes, and the atmospheric haze that makes its land pale and
   cool is the subject, not an error in it — grading that out would cost the
   depth that makes it worth using as the hero. The residual gap is
   Δb\* −3.86 against its neighbours. Read that as the accepted resting
   value, not as remaining work.
4. **Sky statistics are dominated by four frames.** Only hero-1,
   AboutImage2, home-training and (marginally) hero-2 carry meaningful sky;
   the other six are at or below 0.3% of frame, which is blue *objects*
   rather than sky. Any set-wide sky number is therefore an average over a
   handful of images and swings hard on whichever of them a change touches.
   Report sky per-file, as the table above does; a set mean will mislead.
