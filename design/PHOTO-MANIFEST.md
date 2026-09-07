# PHOTO-MANIFEST.md

Inventory of the eighteen files delivered into `photo-src/incoming/` on
2026-08-29, taken against the build at `c7c6de2`. `photo-src/incoming/`
is in `.git/info/exclude` — 1.3 GB of DNG must never enter the repository.

**Sections A–E are the survey, and they were taken before anything moved. The
ingest was taken the next day and its outcome is at the foot of this file** —
read that section before relying on a figure here, and note in particular the
correction it makes to §B's reading of `hero-2`.

`ART-DIRECTION.md` §5 owns the placement table this is measured against,
`PHOTO-GRADE.md` owns the grade paths, and `OPEN-ITEMS.md`'s *Carried* list
owns the standing debts §D reports on.

**The one-line answer.** Two frames close: `hero-2` gains 1.97× and `hero-1`
1.48× in linear resolution, both from files that were sitting in the camera
roll all along. Nothing else does. The eight Portugal DNGs are the same
pixels already shipped, `hero-3` turns out to be *upscaled* and gains nothing,
and **all seventeen distinct files are portrait** — so the landscape ground
`/about/` and `/faq/` have been waiting for did not arrive.

---

## Method

Three instruments, and the first two are the ones the conclusions rest on.

**Metadata.** `sips -g` for stored pixel dimensions and format, `mdls` for the
orientation-corrected display dimensions and the EXIF block. The two disagree
by design: `sips` reports the sensor readout, `mdls` reports what a viewer
shows. Every incoming file carries **EXIF orientation 6** — stored landscape,
displayed portrait — which is why a naive `sips -Z` proxy of this set comes out
the wrong way round. Every dimension in this document is the *display*
dimension.

**Provenance.** Six shipped masters still carry their capture EXIF, and it is
decisive on its own: `AboutImage1`, `hero-1`, `hero-2` and `hero-3` each match
an incoming file on capture second, device, aperture, focal length, ISO and GPS
fix simultaneously. The seven Portugal masters were re-encoded on 2026-08-11 and
carry no capture EXIF, so those went to content matching alone.

**Content matching.** Grayscale integral image, ZNCC over a 40×40 cell grid,
searched across candidate sub-rectangles of each incoming frame at the published
frame's own aspect ratio — coarse pass over width fraction and both offsets,
then two refinement passes. ZNCC normalises each window's mean and variance, so
a different RAW rendering or a JPEG re-encode does not move the score. Two
frames known to be whole-frame derivations were carried through as controls and
both returned 100.0% of the frame at ZNCC ≥ 0.9997.

Scores are bimodal and there is no ambiguous case in the set: every true match
lands at **0.9501–1.0000** and no false candidate anywhere in the matrix exceeds
**0.8910**. The three published frames with no incoming original peak at 0.49,
0.55 and 0.75.

**A correlation identifies the picture; it does not license a swap.** The same
normalisation that makes ZNCC robust — each window's mean and variance divided
out — is exactly what makes it blind to tone, so a score of 0.9999 constrains
*what is in the frame* and says nothing about how that frame is mapped to code
values. "Pure downscale" in the table below is therefore a statement about
geometry only, and it is not sufficient grounds to substitute one file for the
other.

`hero-2` is the case that retired the looser reading. It matches `IMG_2894` at
ZNCC 0.9999 as a whole-frame 0.5079× downscale, and the old master nevertheless
had a highlight roll-off baked into it that the fresh decode does not carry:
aligned pixel for pixel at a common width, the two agree below code 100 and
diverge steadily above it (fresh 224 → old 214.2, fresh 255 → old 244.1), and
the fresh decode holds **0.555% of the frame at L ≥ 251 against the old master's
0.055%**. Ten times the highlight content, on a picture the correlation called
identical. Swapped in under the old grade parameters it blew 1.67% of the frame
and failed the clip guard outright. `PHOTO-GRADE.md` carries the repair.

**So the requirement is: a frame swap is justified by a transfer-curve
comparison, not by a correlation.** Bring both files to a common width, align
them, bin one's luma by the other's, and read the curve — plus the blown-pixel
share at full resolution, which a downsampled objective averages away and
cannot see. A swap is clean when the curve is straight; where it bends, the
grade that was solved against the old file does not carry over to the new one.

The GPS fixes are recorded in the files and are not reproduced here: they are
private locations and this repository is public. The set clusters in two places
in northern Portugal, one per trip.

---

## A · What arrived

Twenty-five files, **seventeen distinct pictures**. The eight `" 2"` DNGs are
byte-identical duplicates of their siblings — MD5 matches on all eight pairs —
and are the macOS collision marker, exactly as expected. They account for 591 MB
of the 1.3 GB on disk.

| File | Display px | MP | Aspect | Format | Size | Capture (camera clock) | Device | Lens | 35 mm eq. | EXIF orient. |
|---|---|---|---|---|---|---|---|---|---|---|
| IMG_2865.HEIC | 3024×4032 | 12.2 | 3:4 | HEIC | 4.20 MB | 2024-07-23 10:58 | iPhone 14 Pro | 6.86 mm f/1.78 | 24 mm | 6 |
| IMG_2894.HEIC | 3024×4032 | 12.2 | 3:4 | HEIC | 4.30 MB | 2024-07-24 10:17 | iPhone 14 Pro | 6.86 mm f/1.78 | 24 mm | 6 |
| IMG_3004.HEIC | 3024×4032 | 12.2 | 3:4 | HEIC | 2.43 MB | 2024-07-26 18:33 | iPhone 14 Pro | 6.86 mm f/1.78 | 24 mm | 6 |
| IMG_3005.HEIC | 3024×4032 | 12.2 | 3:4 | HEIC | 2.81 MB | 2024-07-26 18:33 | iPhone 14 Pro | 6.86 mm f/1.78 | 24 mm | 6 |
| IMG_4564.DNG | 6048×8064 | 48.8 | 3:4 | DNG 16-bit | 81.6 MB | 2026-07-29 15:20 | iPhone 14 Pro | back triple 6.86 mm f/1.78 | 24 mm | 6 |
| IMG_4582.DNG | 6048×8064 | 48.8 | 3:4 | DNG 16-bit | 86.8 MB | 2026-07-30 09:41 | iPhone 14 Pro | back triple 6.86 mm f/1.78 | 24 mm | 6 |
| IMG_4585.DNG | 6048×8064 | 48.8 | 3:4 | DNG 16-bit | 88.4 MB | 2026-07-30 15:35 | iPhone 14 Pro | back triple 6.86 mm f/1.78 | 24 mm | 6 |
| IMG_4599.DNG | 6048×8064 | 48.8 | 3:4 | DNG 16-bit | 100.1 MB | 2026-07-30 16:32 | iPhone 14 Pro | back triple 6.86 mm f/1.78 | 24 mm | 6 |
| IMG_4619.DNG | 6048×8064 | 48.8 | 3:4 | DNG 16-bit | 63.7 MB | 2026-07-30 20:13 | iPhone 14 Pro | back triple 6.86 mm f/1.78 | 24 mm | 6 |
| IMG_4721.DNG | 3024×4032 | 12.2 | 3:4 | DNG 16-bit | 32.7 MB | 2026-08-02 09:52 | iPhone 14 Pro | back triple 6.86 mm f/1.78 | **48 mm** | 6 |
| IMG_4735.DNG | 6048×8064 | 48.8 | 3:4 | DNG 16-bit | 71.5 MB | 2026-08-02 20:57 | iPhone 14 Pro | back triple 6.86 mm f/1.78 | 24 mm | 6 |
| IMG_4739.DNG | 6048×8064 | 48.8 | 3:4 | DNG 16-bit | 66.9 MB | 2026-08-03 06:30 | iPhone 14 Pro | back triple 6.86 mm f/1.78 | 24 mm | 6 |
| IMG_6572.JPG | **2316×3088** | 7.15 | 3:4 | JPEG | 3.07 MB | 2025-07-28 14:06 | **iPhone 13 Pro Max** | 2.71 mm f/2.2 | **30 mm** | 6 |
| IMG_8526.JPG | 3024×4032 | 12.2 | 3:4 | JPEG | 2.29 MB | 2025-07-27 23:02 | iPhone 14 Pro | 6.86 mm f/1.78 | 24 mm | 6 |
| IMG_8626.JPG | 3024×4032 | 12.2 | 3:4 | JPEG | 4.39 MB | 2025-07-28 10:28 | iPhone 14 Pro | 6.86 mm f/1.78 | 24 mm | 6 |
| IMG_8739.JPG | 3024×4032 | 12.2 | 3:4 | JPEG | 4.38 MB | 2025-07-28 13:15 | iPhone 14 Pro | 2.22 mm f/2.2 | **14 mm** | 6 |
| IMG_9087.JPG | 3024×4032 | 12.2 | 3:4 | JPEG | 6.71 MB | 2025-07-31 11:35 | iPhone 14 Pro | 6.86 mm f/1.78 | 24 mm | 6 |

Three shoots, one region: four HEIC from July 2024, five JPEG from July 2025,
eight DNG from July–August 2026. Colour space is Display P3 throughout; the DNGs
are 16 bits per channel, everything else 8.

**Three facts in that table are load-bearing.**

*Every file is 3:4 portrait.* Not one landscape frame arrived. §D returns to
what that costs.

*`IMG_6572` is 7.15 MP, not 12.2.* Its 2316×3088 readout is 76.6% of the sensor's
full frame on both axes — a 1.31× in-camera crop, which is what takes a 23 mm
front lens to the 30 mm equivalent EXIF reports. `2.71 mm f/2.2` is the iPhone 13
Pro Max's TrueDepth camera; the rear lenses on that body are 1.57, 5.7 and 9 mm.
This is the lowest-resolution and optically weakest file in the set, and §B shows
it is the source of `hero-3`.

*`IMG_4721` is 12.2 MP where its siblings are 48.8.* Shot at the 48 mm
equivalent, which is the 2× readout — 12 MP, not 48. The shipped master is
already at that ceiling.

---

## B · Which incoming file is the original of which published frame

Eleven of the seventeen are the originals of shipped frames. Six are not, and
those go to §C.

| Published | Incoming | Method | Score | Published aspect | Original aspect | **Verdict** |
|---|---|---|---|---|---|---|
| `AboutImage1.jpg` | IMG_8526.JPG | EXIF + MD5 | **byte-identical** | 0.750000 | 0.750000 | **Same file.** No change of any kind |
| `pt/IMG_4585.jpg` | IMG_4585.DNG | ZNCC | 1.0000 | 0.750000 | 0.750000 | Whole frame, **same pixel dimensions** |
| `pt/IMG_4582.jpg` | IMG_4582.DNG | ZNCC | 1.0000 | 0.750000 | 0.750000 | Whole frame, **same pixel dimensions** |
| `pt/IMG_4735.jpg` | IMG_4735.DNG | ZNCC | 1.0000 | 0.750000 | 0.750000 | Whole frame, **same pixel dimensions** |
| `pt/IMG_4739.jpg` | IMG_4739.DNG | ZNCC | 1.0000 | 0.750000 | 0.750000 | Whole frame, **same pixel dimensions** |
| `pt/IMG_4721.jpg` | IMG_4721.DNG | ZNCC | 0.9999 | 0.750000 | 0.750000 | Whole frame, **same pixel dimensions** |
| `hero-2.jpg` | IMG_2894.HEIC | EXIF + ZNCC | 0.9999 | 0.750000 | 0.750000 | **Pure downscale**, 0.5079× |
| `pt/IMG_4599.jpg` | IMG_4599.DNG | ZNCC | 0.9501 | 0.457465 | 0.750000 | **Crop** |
| `pt/IMG_4619.jpg` | IMG_4619.DNG | ZNCC | 1.0000 | 1.250103 | 0.750000 | **Crop** |
| `hero-1.jpg` | IMG_8626.JPG | EXIF + ZNCC | 0.9981 | 1.356291 | 0.750000 | **Crop**, then downscale |
| `hero-3.jpg` | IMG_6572.JPG | EXIF + ZNCC | 0.9874 | 2.142259 | 0.750000 | **Crop**, then **upscale** |

`AboutImage2`, `home-training` and `home-youth` have no original in this
delivery. Their best candidates score 0.75, 0.49 and 0.55 — not matches, and
each is a visibly different picture.

### The crop rectangles

Recovered at higher resolution with the search narrowed five times around the
coarse optimum, so the rectangle is the measurement rather than the aspect
arithmetic. The two controls at the foot verify the instrument.

| Published | Rectangle within the original | Original px in it | Share of frame | Resample | Refined ZNCC |
|---|---|---|---|---|---|
| `hero-1` | cols 0–100%, **rows 25.96–81.25%** | 3024 × 2229 | 55.3% | ×0.677 down | 0.9997 |
| `hero-3` | cols 0–100%, **rows 47.41–82.41%** | 2316 × 1081 | 35.0% | **×1.106 up** | 0.9996 |
| `pt/IMG_4599` | **cols 39.00–100%**, rows 0–100% | 3684 × 8053 | 60.9% | ×1.001 | 0.9996 |
| `pt/IMG_4619` | cols 0–100%, **rows 0–60.0%** | 6045 × 4836 | 59.9% | ×1.000 | 1.0000 |
| *control* `hero-2` | cols 0–100%, rows 0–100% | 3024 × 4031 | 100.0% | ×0.508 down | 0.9997 |
| *control* `pt/IMG_4585` | cols 0–100%, rows 0–100% | 6045 × 8061 | 99.9% | ×1.000 | 0.9999 |

Reconstructing each master from its original at the recovered rectangle and
scoring it against the shipped file at full resolution: `hero-3` 0.9922,
`hero-1` 0.9598. The rectangles are right.

### `hero-3` is 2560 px wide over a 2316 px original, and that is the finding

Its crop takes 99.98% of `IMG_6572`'s width — 2315 of 2316 px — and ships at
2560. There is no wider version of this capture in the delivery and the frame
is already at its own edge, so **244 px of `hero-3`'s stated width is
interpolation**. A 0.905× round trip through Lanczos corroborates it: `hero-3`
loses **8.94** RMSE where `hero-1` loses 12.06, `hero-2` 16.23 and their
originals 15.11 and 16.89. It is the softest file in the set per stated pixel,
and it is soft because the pixels were manufactured.

The consequence is that **`hero-3` cannot be improved by this delivery.** Its
honest source width is 2316, its slot is already the full width of the frame,
and the only way to gain is to make the crop *shallower*, which changes the
composition rather than the resolution.

### The Portugal DNGs gain nothing in pixels

Five of the eight are the same picture at the same pixel dimensions as the
master already in `_originals/pt/`, and the two crops are already cut at the
full width available for their rectangle. `IMG_4564` has no published
counterpart at all — `ART-DIRECTION.md` §5 excludes it, and §C upholds that.

What the DNGs do carry is **16-bit linear RAW latitude** the delivered 8-bit
JPEG does not. Measured on the shipped masters, one frame has anything to
recover: **`pt/IMG_4721` clips 1.653% of its pixels at the white point** — the
sky through the oak canopy — where every other Portugal master clips at or
below 0.025%. That frame is `/about/`'s ground and its LCP. Re-developing it
from RAW is a real option; re-developing the other five is not, because
`PHOTO-GRADE.md` leaves the Portugal set ungraded precisely on the grounds that
its frames already agree with each other, and a new development on five of six
would have to re-establish that agreement from scratch.

### The gain, per placement

Painted CSS width at rest × device pixel ratio ÷ the frame's own display width,
which is the convention `OPEN-ITEMS.md`'s *Carried* list uses. The desktop
figure is 1440×900 at DPR 2; the phone figure is 390×844 at DPR 3, which is the
reference `sizes` is written against. Where a frame changes, the "after" column
assumes the **published rectangle re-cut from the original at full resolution**
— the same field of view, more pixels in it.

| Page | Placement | Frame | Painted CSS 1440 / 390 | Device px | Master now → after | **Ratio now** | **Ratio after** |
|---|---|---|---|---|---|---|---|
| `/` | hero poster + slide 1 | `IMG_4585` | 1440 / 633 | 2880 / 1899 | 6048 → 6048 | 0.48 / 0.31 | — |
| `/` | **hero slide 2** | `hero-2` | 1440 / 633 | 2880 / 1899 | **1536 → 3024** | **1.88 / 1.24** | **0.95 / 0.63** |
| `/` | hero slide 3 | `hero-3` | 1928 / 1808 | 3856 / 5424 | 2560 → **2315** | 1.51 / 2.12 | 1.67 / 2.34 |
| `/` | **"What we do" ground** | `hero-1` | 1440 / 1145 | 2880 / 3434 | **2048 → 3024** | **1.41 / 1.68** | **0.95 / 1.14** |
| `/` | the panels' join | `IMG_4582-road` | 1440 / 1130 | 2880 / 3391 | 6048 → 6048 | 0.48 / 0.56 | — |
| `/` | "What you gain" + closing | `IMG_4619-valley` | 1440 / 825 | 2880 / 2476 | 4234 → 4234 | 0.68 / 0.58 | — |
| `/` | Youth Exchanges object | `AboutImage1` | 418 / 228 | 835 / 684 | 3024 → 3024 | 0.28 / 0.23 | — |
| `/` | Training Courses object | `AboutImage2` | 418 / 228 | 835 / 684 | 1536 → 1536 | 0.54 / 0.45 | — |
| `/about/` | ground | `IMG_4721` | 1440 / 633 | 2880 / 1899 | 3024 → 3024 | 0.95 / 0.63 | — |
| `/about/` | scene 1 object | `AboutImage1` | 418 / 228 | 835 / 684 | 3024 → 3024 | 0.28 / 0.23 | — |
| `/about/` | scene 2 object | `AboutImage2` | 418 / 228 | 835 / 684 | 1536 → 1536 | 0.54 / 0.45 | — |
| `/about/` | scene 3 object | `home-training` | 418 / 228 | 835 / 684 | 1536 → 1536 | 0.54 / 0.45 | — |
| `/about/` | wall · centre at 2.60 | `IMG_4585#wall` | 1872 / 658 | 3744 / 1975 | 6048 → 6048 | 0.62 / 0.33 | — |
| `/about/` | wall · upper-left 3.2:1 | `IMG_4619-ridge` | 864 / 642 | 1728 / 1927 | 4234 → 4234 | 0.41 / 0.46 | — |
| `/about/` | wall · left upright | `IMG_4599` | 360 / 154 | 720 / 463 | 3689 → 3689 | 0.20 / 0.13 | — |
| `/about/` | wall · right upright | `hero-2` | 360 / 253 | 720 / 760 | 1536 → 3024 | 0.47 / 0.49 | 0.24 / 0.25 |
| `/about/` | wall · lower-right 3.2:1 | `hero-3` | 864 / 542 | 1728 / 1627 | 2560 → 2315 | 0.68 / 0.64 | 0.75 / 0.70 |
| `/about/` | wall · lower-left 2.13:1 | `IMG_4735-road` | 576 / 285 | 1152 / 855 | 6048 → 6048 | 0.19 / 0.14 | — |
| `/about/` | wall · upper-right 2.13:1 | `hero-1` | 576 / 343 | 1152 / 1030 | 2048 → 3024 | 0.56 / 0.50 | 0.38 / 0.34 |
| `/contact/` | ground | `IMG_4735-road` | 1440 / 950 | 2880 / 2849 | 6048 → 6048 | 0.48 / 0.47 | — |
| `/faq/` | **ground** | `hero-2` | 1440 / 633 | 2880 / 1899 | **1536 → 3024** | **1.88 / 1.24** | **0.95 / 0.63** |

In the *Carried* list's own 1440-only frame, which reports DPR 2 and DPR 3 side
by side: `/faq/`'s ground and the home hero's second slide go **1.88 / 2.81 →
0.95 / 1.43**, and "What we do" goes **1.41 / 2.11 → 0.95 / 1.43**. All three
land exactly where `/about/`'s `IMG_4721` ground already sits, which the project
accepts. `hero-3` goes the other way — **1.51 / 2.26 → 1.67 / 2.50** — because
the honest source width is smaller than the stated one. Nothing about the
picture on screen gets worse; the number stops flattering it.

**Two of the three resolution ceilings close. The third was never real.**

---

## C · What is genuinely new

Six files match nothing published. Every one is portrait 3024×4032 except where
noted, so on the axis it would be painted:

- as a **full-bleed ground**, a 3024 px frame paints at **0.95 against source at
  1440 DPR 2** and 0.63 at 390 DPR 3 — it clears the 2880 requirement, by 144 px;
- but a 3:4 frame cover-fitted into a 16:10 window shows **46.9% of its own
  area**, under `ART-DIRECTION.md` §2's 60% floor, at *every* size. That is a
  property of the aspect ratio, not of these files, and it is why the *Carried*
  list asks for landscape sources.

| | IMG_3004 | IMG_2865 | IMG_9087 | IMG_3005 | IMG_8739 | IMG_4564 |
|---|---|---|---|---|---|---|
| Subject | reservoir under open sky, mountains | forest track, three walking away | river, footbridge, tall trees | the IMG_3004 vista, 4 s later | lakeshore rocks, one seated figure | village, mountains, from above |
| Painted axis | 3024 | 3024 | 3024 | 3024 | 3024 | 3024 |
| Ground-capable at 1440 DPR 2 | yes, 0.95 | yes, 0.95 | yes, 0.95 | after crop | after crop | no |
| Whole subject | no subject — a place | **3 walkers whole**; a 4th cut at cols 0–6%, rows 78–92% | rower whole but tiny; **bank group cut at cols 0–5%, rows 56–63%** | no subject | seated figure whole, back at the right edge | village whole |
| Tone | open-trail midday, cool — the `hero-1` world | forest dapple, deep shade — the `hero-2` world | bright park green, blown highlight cols 35–55% rows 42–55% | as IMG_3004 | hard midday, cyan water — a **beach**, not the pine world | hazy midday |
| Activity or place | **place** | **activity** | place | place | place | place |
| Occluders | **none** | timber railing cols 30–37%, rows 51–56% | **parked car cols 7–10%, rows 71–73%**; lamp post; graffiti on the abutment cols 38–45%, rows 60–62% | **finger over the lens, cols 0–10%, rows 84–100%** | **vertical flare cols 48–52%, rows 0–52%**; veiling haze cols 60–100%, rows 0–15% | **5 power cables, left edge rows 13–29% sweeping to cols 55% at rows 50–58%**; **chain-link fence cols 0–55%, rows 72–100%**; gate cols 43–58%, rows 78–92%; pole cols 37–40%, rows 66–100% |
| **Usable** | **yes, clean** | **yes** | **yes, with a cut** | **marginal** | **marginal** | **no** |

**IMG_3004 is the only file in the delivery with no defect anywhere in it.** No
cable, no fence, no flare, no obstruction, no cut subject, and it is the same
reservoir and the same light as `hero-1`, so it belongs to the set without
argument. It is also a landscape *view* trapped in a portrait *frame*, which is
the whole problem of this delivery in one picture.

**IMG_2865 is the one genuine addition of a kind the site is short of** — young
people on an outdoor activity, portrait, in the 3:4 the offer panels and the
About scenes take unmodified. It is not free: a fourth person is cut by the
frame's own left edge in the bottom-left corner, and a timber railing crosses
cols 30–37% at rows 51–56%. Neither is a power cable and neither is a chain-link
fence, so it is the mildest §2 exposure of any candidate in this document.

**IMG_9087** is a formal riverside park rather than the pine world — lighter,
more manicured, with a parked car in it. Its bridge is decorative rather than
utility clutter. Usable, third in line.

**IMG_3005** carries a finger over the lens in the bottom-left corner. It is a
corner, so a rectangle clearing it has to take a band off two sides — the left
10% and the bottom 16%, leaving **75.6%** of the frame, above the 60% floor. It
is also the same picture as IMG_3004 four seconds later, so the two cannot both
appear on one page and probably not on one site.

**IMG_8739** carries a hard vertical flare column dead centre, cols 48–52%,
running from the top edge through the sky and down into the water. No pan clears
it: it is at the middle of the frame, in the sky, at full height. Only a crop
entirely to one side of 48% survives, which is half the frame, under the floor.
It is also a different world — a bright beach day against a deep pine set.

**IMG_4564's exclusion is upheld and now has numbers.** The cables own the whole
upper-left and the fence owns the whole lower band; the largest rectangle
clearing both while still holding the village is roughly cols 58–100% × rows
40–78%, **16% of the frame**, far under the 60% floor. `ART-DIRECTION.md` §5 is
correct and should stay as it is.

**The two files the brief flagged are not additions.** `IMG_4739` and
`IMG_4564` were named as possible new members of the Portugal set. `IMG_4739`
is not new — it is the published `pt/IMG_4739.jpg` at ZNCC 1.0000, already on
disk, already off the site because both of its crops fail §2 from opposite ends.
`IMG_4564` is new in the sense that no master exists for it, and unusable for the
reason above. The `" 2"` suffix was, as expected, a collision marker: all eight
pairs are byte-identical.

**Usable additions to the set: three.** `IMG_3004`, `IMG_2865`, `IMG_9087`.
Thirteen usable frames become **sixteen**.

---

## D · The assignment question

> Can the About page stand entirely on photographs that do not appear on the
> Home page, without changing Home?

**No.** Not with this delivery, and it is arithmetic rather than composition.

**What About needs: eleven distinct frames** — a ground, three scene objects and
seven wall tiles — with no repeat within the page.

**What Home holds: eight distinct frames** — `IMG_4585`, `hero-2`, `hero-3`,
`hero-1`, `IMG_4582`, `IMG_4619`, `AboutImage1`, `AboutImage2`. Under Andreas's
constraint every one of them stays; `hero-2` and `hero-1` may be swapped for the
higher-resolution file of the same picture, which changes nothing about what is
on screen.

**The non-Home pool, after this delivery:**

| Frame | Width | Placements now | Free for About |
|---|---|---|---|
| `IMG_4721` | 3024 | About ground | yes |
| `IMG_4735` | 6048 | Contact ground + About wall | yes — **one slot only**, it is at the two-placement cap |
| `IMG_4599` | 3689 published, **6048 available** | About wall | yes |
| `home-training` | 1536 | About scene 3 | yes |
| **IMG_3004** | 3024 | — | yes |
| **IMG_2865** | 3024 | — | yes |
| **IMG_9087** | 3024 | — | yes |
| *IMG_3005* | 3024 | — | *marginal — needs the finger cropped* |
| *IMG_8739* | 3024 | — | *marginal — needs the flare cropped* |

**Seven solid, nine counting both marginals, against eleven slots.**

**Minimum overlap with Home: two frames**, and that is with `IMG_3005` and
`IMG_8739` admitted on crops no whole-subject audit has been run on. On solid
frames only it is **four**. Today it is seven — `IMG_4585`, `IMG_4619-ridge`,
`hero-2`, `hero-3`, `hero-1`, `AboutImage1` and `AboutImage2` — so the delivery
takes the overlap from seven down to two or four. It does not take it to zero.

**The constraint that binds is the count, not the centre tile.** The brief asked
for the centre tile to be checked and it passes: at 2.60 to full coverage it is
painted 1872 CSS px at 1440×900, **3744 device px at DPR 2**, so its frame must
be at least 3744 px wide to hold ratio ≤ 1.0. Two non-Home frames clear it —
`IMG_4735` at 6048, and `IMG_4599` **re-cut to its full 6048 width from the DNG**
rather than to the 3689-wide strip it ships as. So the centre tile can be filled
without Home. Nothing else can be found to fill the last two slots.

**The frame that causes the shortfall, named:** none of the three new
photographs is a **wide** frame. The wall has two 3.2:1 slots, and a 3:4 portrait
in a 3.2:1 slot shows **23.4% of itself on a desktop**. Both of those slots are
filled today by Home's `IMG_4619-ridge` and `hero-3`, which are the only two wide
crops in the whole set, and the delivery adds no third. Those two slots are where
the overlap is forced to sit.

**How many more photographs close it, and of what kind — four:**

1. **Two wide frames**, native landscape or croppable to 2.5:1 or wider with a
   subject still in the rectangle, ≥ 1728 px on the long axis. These free the
   wall's two 3.2:1 slots and end the overlap.
2. **One landscape ground**, ≥ 2880 px on the long axis. This is the *Carried*
   list's standing request and it also closes the 46.9% crop-survival failure
   that every portrait ground on the site currently carries on a desktop. One
   for About, and the same kind again for `/faq/`.
3. **One more outdoor activity frame** with people, portrait 3:4, to stand
   beside a programme heading. ~~`IMG_2865` is the first of these~~ — it is
   not; see the standing-debts row above. A frame for this slot has to hold
   the people **large in the frame**, because the slot renders at 179 CSS px
   wide on a phone and a figure that is a twentieth of the frame is 9 px there.
   A second such frame retires `AboutImage1`'s interior from the Youth
   Exchanges panel.

### The standing debts

| Debt | Status | Evidence |
|---|---|---|
| **`/faq/` ground — `hero-2` at 1.88 / 2.81 at rest** | **Resolution closed. Composition not.** | `IMG_2894` is a native 3024×4032 capture and `hero-2` is a 0.508× downscale of the whole of it. The ratio goes 1.88 / 2.81 → **0.95 / 1.43**, level with `/about/`'s accepted ground. The cable stays — see below — so the placement still fails §2 |
| **`IMG_4582-road` holds no complete subject** | **Not closed** | `IMG_4582.DNG` is the shipped frame at ZNCC 1.0000 and the same pixel dimensions. The chain-link fence and the cables are in the original. Only a different photograph closes it, and no incoming frame is a road between stone walls |
| **`hero-2`'s overhead cable, three placements** | **Not closed, and now a fitted rectangle** | ~~*enters the top edge at col ≈ 21% and runs to col ≈ 33%, row ≈ 41%*~~ — struck on 2026-09-05. Re-measured on the published 3024 master, which carries no EXIF orientation and is its own display frame, by fitting the line through its darkest run at every row: **`x = 783.4 + 0.1856·y` px**, entering the top edge at **col 25.91%** and coherent to **row 35.17%** at col 34.61%; bounding rectangle **cols 25.50–34.99%, rows 0–35.17%**, 13–23 px thick. The entry is 4.9 points right of the carried figure, and the line reaches col 33% at **row 29%**, not 41%. `hero-2` is a 0.508× downscale of the whole of `IMG_2894`, so the proportions are the same and there is nothing to reconcile — the older reading was by eye. It is in the photograph, not in the crop, and `OPEN-ITEMS.md` §12.3 proves that no `object-position` removes it from the About mosaic's tile on either axis at any phone height. **Only a different photograph closes it** |
| **A landscape frame for the About and FAQ grounds** | **Not closed** | All seventeen distinct files carry EXIF orientation 6. **Zero landscape frames arrived** |
| **An outdoor activity frame for the offer panels** | **Not closed** — the survey read this as partially closed; the placement audit at the foot of this file overturned it | `IMG_2865` — three young people walking a forest track, portrait 3:4, deep pine tone. Costs: a fourth person cut at the frame's own left edge (cols 0–6%, rows 78–92%) and a timber railing at cols 30–37%, rows 51–56%. At the panel's rendered size the group is 21 × 37 CSS px and each figure 8–11 px wide |
| **An activity frame with the people large in the frame** | **Not closed** | A fifth debt, and a different one: the people must *occupy* the frame rather than appear in it, in a bright register that stands beside `AboutImage1` and `AboutImage2` as a pair. Every candidate in this delivery is either a place (`IMG_3004`, `IMG_3005`, `IMG_9087`) or an activity seen from too far away (`IMG_2865`) |

---

## E · What ingestion would cost

Priced, not done. Byte figures are AVIF at the pipeline's own settings —
`quality 62, effort 4, 4:2:0` — encoded from the incoming originals; the encoder
reproduces `IMG_4585`'s shipped 1120 KB at 2560 and 1367 KB at 2880 exactly, so
the settings are right. Where the frame goes through a grade, the measured
multiplier is applied: **`hero-2` ×1.04–1.05, `hero-1` ×1.00, `hero-3` ×1.02**,
derived per rung by encoding each current master ungraded and comparing against
its shipped variant.

### The grade path, per file

| File | Path today | What ingestion needs |
|---|---|---|
| `AboutImage1` | MATCH | **Nothing.** The master is byte-identical to the incoming file |
| `hero-2` | MATCH `wb [1.064, 1, 1.16]`, `gamma 0.716`, `lift 0.006`, `satScale 0.88` | **Re-solve all four.** They were solved against the current master's pixels — `gamma 0.716` is a 14-point L\* lift, the largest move in `MATCH` — and a fresh decode of the HEIC does not start where the old export started. Re-run the clip guard. Its `TRIMS` entry is not touched: `gradeToRaw` takes `matchParams()` for a MATCH file and never reaches `applyTrim`, so `hero-2`'s trim is already inert |
| `hero-1` | MATCH `wb [1.012, 1, 1.028]`, `gamma 1.013`, `lift 0.006`, `satScale 1.07` | **Re-solve.** Smallest trim of the seven, so the cheapest to re-fit, but the targets are measured on pixels that change |
| `hero-3` | MATCH `wb [0.943, 1, 1.16]`, `gamma 0.981`, `lift 0.006`, `satScale 1.3` | **Re-solve** if the re-cut is taken at all. There is no resolution reason to take it; the only reason is to stop shipping 244 px of interpolation |
| `pt/IMG_4599` | MATCH, solved on the frame's own vegetation | **Re-solve only if the crop is widened.** The targets were measured inside the 3689-wide strip |
| the five identical `pt` frames | UNGRADED | **Leave them.** The set is ungraded because its frames already agree; re-developing five of six from RAW means re-establishing that agreement, and it buys no pixels |
| `pt/IMG_4721` | UNGRADED | **Optional, and it is the one with a case.** 1.653% of the frame is clipped at the white point. Re-developing from the DNG could recover the canopy sky. It is `/about/`'s LCP, so it is also the most expensive one to get wrong |

### Ladder rungs

`LADDER` is `[384, 640, 768, 1024, 1152, 1366, 1600, 1920, 2560, 2880]`, capped
at `min(displayWidth, 2880)` for a full-bleed frame.

| Frame | Rungs now | Rungs after | Change |
|---|---|---|---|
| `hero-2` | 7, capped at 1536 | **10**, capped at 2880 | 1536 out; 1600, 1920, 2560, 2880 in — **+3 widths, +9 files** |
| `hero-1` | 9, capped at 2048 | **10**, capped at 2880 | 2048 out; 2560, 2880 in — **+1 width, +3 files** |
| `hero-3` | 9, capped at 2560 | 9, capped at **2315** | 2560 out, 2315 in — **no change in count**, top rung drops 245 px |

**The 3840 `#wall` rung is untouched.** `SCALED` keys on
`/images/pt/IMG_4585.jpg`, that master's display width stays 6048, and the
centre tile is still painted 3744 device px at 1440×900 DPR 2 — **0.975 against
the rung and 0.619 against source**, exactly as `OPEN-ITEMS.md` §2.14 measured.
No frame that changes is the centre tile, and none of them reaches a `sizes`
declaration above 2048 anywhere on the wall, so the rung filter never offers
them a new one either.

### LCP bytes, per page

| Page | LCP frame | Now | After |
|---|---|---|---|
| `/` | `IMG_4585` at 2880 | 1367 KB | **1367 KB — unchanged** |
| `/about/` | `IMG_4721` at 2880 | 1259 KB | **1259 KB — unchanged** |
| `/contact/` | `IMG_4735-road` at 2880 | 966 KB | **966 KB — unchanged** |
| `/faq/` | `hero-2` | 636 KB at the 1536 rung | **≈ 2081 KB at the 2880 rung — +1445 KB, +227%** |

`/faq/`'s LCP is cheap today only because its photograph is small. Closing the
worst resolution debt on the site puts 1.4 MB on the LCP of a reading page, and
that is the single largest cost in this document. At 390×844 DPR 3 the same
ground goes 636 → 1143 KB, +80%.

### Whole-page image bytes

| Page | Now | After | Delta |
|---|---|---|---|
| `/` at 1440×900 DPR 2 | 4564 KB | ≈ **6336 KB** | **+1772 KB, +38.8%** |
| `/` at 390×844 DPR 3 | 4295 KB | ≈ **5129 KB** | **+834 KB, +19.4%** |
| `/about/` at both | 4896 / 3312 KB | ≈ 4840 / 3260 KB | **−56 / −52 KB** |
| `/contact/` | unchanged | unchanged | 0 |
| `/faq/` at 1440×900 DPR 2 | 636 KB | ≈ **2081 KB** | **+1445 KB, +227%** |

Home's rise is the second hero slide (636 → 2081) and the "What we do" ground
(389 → 869), less what `hero-3` gives back (470 → 317). About gets marginally
*cheaper*, and the reason is worth recording because it is the opposite of what
a higher-resolution source is supposed to do: its `hero-2` tile takes the 768
rung either way, and cut from the 3024 master that rung encodes at **119 KB
against the 203 KB it costs today**. Resampling 3024 → 768 in one step averages
away high-frequency structure that the current path — a lossy 1536 master, then
a second resample — carries into the encoder. The same crossover puts the new
source *above* the old at 1536 and beyond.

Deploy variants go **147 MB → ≈ 176 MB**. The repository grows too:
`_originals` by **+4.1 MB** (`hero-2` 1157 → 4446 KB, `hero-1` 822 → 1959 KB,
`hero-3` 847 → 596 KB) and the graded masters by about the same again. That
breaches `PHOTO-GRADE.md`'s "full referenced set ≤ 12.5 MB" — 12.47 → ≈ 16.8 MB.
`scripts/postexport.mjs` drops every master from the published output, so that
budget is now a statement about repository weight rather than about what a
visitor downloads, and it needs re-basing or striking rather than defending.

### What would have to be re-derived, and the split that matters

**The pure-downscale swap — no crop work at all:**

- **`hero-2`.** The incoming original is the whole frame and the master is a
  100.0% downscale of it. `object-position: 62% 100%` on the wall tile and both
  full-bleed placements are valid to the pixel. Nothing about the field of view
  moves. The only re-audit is contrast: `OPEN-ITEMS.md` §2.7's finding was that
  a sharper ground has brighter specks in it for a glyph stem to land on, and
  this puts a sharper ground under `/faq/`'s entire body copy and under the home
  hero's lede. Expect falls on the resolution branch of §2.8's ratchet, and
  `/faq/`'s opening paragraph is already the one element below its floor at
  4.39.

**The crop-preserving swap — the published rectangle re-cut from the original
at full resolution, so still no crop work:**

- **`hero-1`.** Rows 25.96–81.25% at full width, from `IMG_8626`. The rectangle
  is reproduced exactly, `50% 100%` on the wall tile is unchanged, and "What we
  do" shows the same 84.8% of the frame it does now. **This route carries the
  entire 1.48× gain and costs nothing in composition.** Same contrast re-audit
  as above.
- **`hero-3`.** Rows 47.41–82.41%. Identical field of view, master 2560 → 2316,
  and the interpolation stops. Worth doing on honesty; worth nothing on pixels.

**The crop-differs swap — expensive, and only if the whole original is adopted
instead of the published rectangle:**

- **`hero-1` whole.** 1.356:1 → 0.75. Every window on it changes: "What we do"
  drops from 84.8% of the frame to 46.9% on a desktop, and `50% 100%` on the
  wall tile becomes meaningless. Full §1.3 whole-subject audit at both viewports.
  There is **no reason to take this route** — the gain is in the rectangle.
- **`hero-3` whole.** 2.142:1 → 0.75. Worse: the frame becomes an upright and
  cannot stay in a 3.2:1 slot at all, where it would show 23.4% of itself.
- **`pt/IMG_4599` widened.** 0.4575 → up to 0.75. The wall's `50% 80%` is
  re-derived and the left upright's whole-subject audit is re-run. This is the
  one crop-differs change worth considering, and on composition rather than
  resolution: the discarded left 39% holds the group climbing the mossy path,
  which is a subject where the shipped strip has none. `ART-DIRECTION.md` §5
  keeps that frame "under protest" for exactly this reason.
- **`pt/IMG_4619` with its full height.** 1.250 → 0.75. Both `-valley`
  (0.7 × 0.895) and `-ridge` (0.7 × 0.345) are fractions of the 4838-tall master,
  so both rectangles change meaning and the cable-bundle audit in
  `scripts/responsive-images.mjs` has to be redone against the new frame. No
  width is gained — the master is already 6048 wide.

---

## What was done, 2026-08-30

Everything above was priced on 2026-08-29 and nothing was touched. The
ingest was taken the next day. This section records what it cost against what
it predicted; `PHOTO-GRADE.md` owns the grade side of it.

**The three swaps landed as specified.** `hero-2` is the whole of `IMG_2894` at
3024×4032, `hero-1` is its own published rectangle re-cut from `IMG_8626` at
3024×2230, and `hero-3` is corrected to the 2316×1081 the capture actually
holds. Framing was proved rather than inferred from the aspect ratio: across
every placement of every swapped frame at 1440×900 and at 390×553, 664, 750 and
844, the **worst edge of the visible rectangle moves 0.0111% of the frame**,
which is 0.13 of a device pixel at the widest any of them is painted. `hero-2`
is exact.

**The two resolution ceilings closed, and `hero-3`'s number went the way it was
predicted to.** Rendered against source at rest, 1440×900 DPR 2 and 390×844
DPR 3:

| Placement | before | after |
|---|---|---|
| `/faq/` ground | 1.875 / 1.237 | **0.952 / 0.628** |
| home hero slide 2 | 1.931 / 1.274 | **0.981 / 0.647** |
| home "What we do" ground | 1.406 / 1.677 | **0.952 / 1.136** |
| About wall upper-right | 0.563 / 0.503 | **0.381 / 0.341** |
| home hero slide 3 | 1.552 / 2.183 | 1.716 / 2.413 |
| About wall lower-right | 0.675 / 0.636 | 0.746 / 0.703 |

"What we do" closes on a desktop and does not on a phone, and cannot: at
390×844 DPR 3 that placement is painted 1145 CSS px wide and asks for 3434
device px, above both the 2880 ladder cap and the 3024 the original holds. It
was 1.677 before. `hero-3` rises because its denominator is now a width that
exists.

### The correction this document owes

**§B calls `hero-2` a "pure downscale" of `IMG_2894` and that is only half
right.** The ZNCC of 0.9999 is real and proves the two are the same *picture*;
it says nothing about their *tone*, because — as this document's own Method
section states — ZNCC normalises each window's mean and variance. Measured as a
transfer curve at a common width, the old master and the fresh decode agree
below code 100 and diverge steadily above it (224 → 214, 248 → 235, 255 → 244).
A roll-off was baked into the old export. At the same 1536 width the fresh
decode holds **0.555% of the frame at L ≥ 251 against the old master's 0.055%**,
and put through the old match parameters it blows 1.67% and fails the clip
guard. The swap therefore cost one real thing the pricing did not foresee: a
highlight shoulder on `hero-2`, the only frame in the set to carry one.
`PHOTO-GRADE.md` records how it was set.

**§B's `AboutImage1` row needed no action, and there was nothing to remove.**
The byte-identity with `IMG_8526` is confirmed (MD5 `903cbb62…`), and hashing
every master against every incoming file returns that one pair and no other.
The survivor is already the referenced file; the duplicate is the copy in
`photo-src/incoming/`, which is excluded from the repository and never entered
it. Nothing in the built output changes. The delivered copy was **left on
disk** rather than deleted — along with the eight byte-identical `" 2"` DNG
pairs — because deleting a delivered original is not reversible from here.

### The bill, and it is not what was priced

Whole-page image bytes, AVIF, per page per viewport, measured on the built
output. The pass also added a 1984px ladder rung and made AVIF quality a
function of the rung, and those two are why the bill lands where it does:

| Page | before | after 1984 | after ingest | after per-rung q | **net** |
|---|---|---|---|---|---|
| `/` 1440 DPR 2 | 4501 | 4501 | 6235 | **4339** | −163 |
| `/` 390 DPR 3 | 4138 | 3733 | 4605 | **3905** | −233 |
| `/about/` 1440 DPR 2 | 4834 | 4834 | 4864 | **4483** | −351 |
| `/about/` 390 DPR 3 | 3143 | 2700 | 2730 | **2730** | −413 |
| `/contact/` both | 967 | 967 | 967 | **632** | −335 |
| `/faq/` 1440 DPR 2 | 636 | 636 | 2065 | **1389** | +753 |
| `/faq/` 390 DPR 3 | 636 | 636 | 1142 | **1142** | +506 |

**Seven of the eight pairs end lighter than they started**, having gained two
frames at two and four times the pixels. The prediction that `/faq/` would take
+1445 KB at 1440×900 was right about the ingest in isolation (636 → 2065) and
the encoder gives most of it back: the page ends at +753 KB rather than +1445.
LCP: home 1367 → 901 KB and 1120 → 715 KB, About 1260 → 878 KB, Contact
967 → 632 KB, FAQ 636 → 1389 KB and 636 → 1142 KB.

Repository weight was the real cost. `_originals` goes 2.76 → 10.90 MB across
the three frames, and the graded masters 6.68 → 10.00 MB. The deploy goes
148 → 200 MB, of which the 1984 rung alone is 20 MB and three quarters of that
is the WebP and JPEG fallbacks. `PHOTO-GRADE.md`'s payload budgets are re-based
and now govern repository weight, which is what they had already become.

### Standing debts, after

| Debt | Status |
|---|---|
| `/faq/` ground resolution | **Closed.** 1.875 / 1.237 → 0.952 / 0.628 |
| home hero slide 2 resolution | **Closed.** 1.931 / 1.274 → 0.981 / 0.647 |
| "What we do" ground resolution | **Closed on a desktop.** 1.406 → 0.952; the phone is a ladder-cap case at 1.136 |
| `hero-3` shipping interpolation | **Closed.** 244 manufactured columns gone |
| `hero-2`'s overhead cable | **Off the FAQ** (2026-09-08, `IMG_3004` took the page). Still on the home hero's second slide and the finale's tile; in the photograph, only a different frame closes those |
| `IMG_4582-road` holds no complete subject | **Not closed** |
| A landscape frame for the About and FAQ grounds | **Closed by cutting, not by delivery** (2026-09-08). No landscape arrived; both grounds are cut to 0.968:1 (rows 22.5–100% of a 3:4), which shows 60.5% on a desktop and 60.7% at 390×664 — the one band of aspects that clears the floor at both. `IMG_3004` is the FAQ's frame, `IMG_4721` re-cut is About's |
| An outdoor activity frame for the offer panels | **Not closed.** `IMG_2865` is not the panels' answer, and the reason is size rather than content: at the panel's rendered size the walking group is **21 × 37 CSS px at 664** and each figure 8–11 px wide, while the timber railing at cols 30–37% reads clearly. It is two stops darker than `hero-2` with 40% of the frame in deep shadow, against a companion frame at chroma 73, and it costs **+19.4 MB of variants for a picture 179 px wide**. A frame that contains the subject is not a frame that shows it |
| **An activity frame with the people large in the frame** | **Not closed, and it is not the row above.** The requirement is that the people *occupy* a substantial share of the frame rather than merely appear in it, in a bright register that stands beside `AboutImage1` and `AboutImage2` as a pair. `IMG_2865` fails it on both counts at once — by size and by tone |

`photo-src/incoming/` is still excluded from the repository and still on disk
only. No incoming file was deleted, no composition changed, no crop moved.

---

## What was done, 2026-09-08

`IMG_3004` is ingested: `_originals/pt/IMG_3004.jpg`, 3024×4032, q95 4:4:4, no
profile, orientation baked (the 2026-08-30 convention). It is the FAQ ground as
`IMG_3004-reservoir` — rows 22.5–100%, 3024×3125, 0.968:1, 77.5% of the frame —
and it retires `hero-2` from that page: the cable, the third placement and the
46.9% coverage go with it. The FAQ's LCP rung falls 1389 → 714 KB at 2880.

`IMG_4721` is re-cut the same way for About (`IMG_4721-oaks`), with the desktop
band reproduced to the tenth (`0% 48%` on the cut against `0% 70%` on the
portrait); 878 → 711 KB.

The grade: matched, not looked — `MATCH["pt/IMG_3004.jpg"]` solved on the
frame's own non-sky, non-skin content against the five on-site Portugal frames
(a\* −5.75 → −1.99, b\* 10.60 → 6.91, L\* 27.0 → 32.8, C\* 15.3 → 12.1), shoulder
0.95 by the clip guard (0.418% blown against 0.453%). `PHOTO-GRADE.md`'s rule
holds: a shoulder only where the source carries more highlight than the target
can, and this is the second frame that does.

The 2026-08-29 delivery's arithmetic in §D stands. What it did not say, and
this session found: **the 60% floor is a property of two aspects**, and no
single aspect passes a 16:10 desktop, a 390×664 phone and a 390×750 phone at
once (A ≥ 0.96, ≤ 0.979 and ≤ 0.867). A landscape frame would not have closed
the inner grounds on a phone; a cut to 0.96–0.98 closes them at the two
heights the measurement budget names and fails at 750 by arithmetic.

### The photography list, as of 2026-09-08

1. An activity frame with the people ≥ 0.4 of the frame's height, bright
   register, portrait 3:4 — the offer panels and About's scenes. Every
   candidate in the library holds its people at 0.03–0.28 of the frame;
   `IMG_2865` paints them 72 px tall at the 1440 panel against a 90 px floor.
2. A frame for "What you gain" at aspect 0.80–0.98 with a subject across its
   width (a valley floor with a village, people on a ridge) — the valley is
   sky under the words: 6.5% content whole-window at 1440. 750 needs ≤ 0.722
   and no desktop box accepts it.
3. Two wide frames (≥ 2.5:1, ≥ 1728 on the long axis) for the finale's wide
   slots — carried from §D.
4. A road between stone walls with no fence, for the panels' join — carried.
5. A shaded forest road with no cable, or the home hero's second slide keeps
   `hero-2`'s — carried.
