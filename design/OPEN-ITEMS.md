# OPEN-ITEMS.md

Live punch list. `ART-DIRECTION.md` owns intent and the rejected list;
`REFERENCE-LANGUAGE.md` owns measured composition. This file gets emptied as
items land.

Round one (A, B, C) is done. What follows is the second review, taken against
the build after the photograph reassignment.

The bar has not moved: this should read as an award-level site. Every item below
is judged against that, not against "is it acceptable".

---

## Order of work

Four phases, in this order. Photography first, because bad material makes every
composition look worse — and because several complaints below are the same
defect seen in different places.

1. **Photography** — quality, selection, and how frames are cut
2. **Transitions** — how one screen becomes the next
3. **Titles** — the inner-page headings
4. **About** — the page that still reads as arranged rather than composed

---

## 1 · Photography — done, with two carried

**1.1 · The rope macro comes out of the home hero.** Done. `home-youth` is off
the slideshow and off the site; three slides remain, at 4.5s each.

**1.2 · Two of the three remaining slides have lost quality.** Done, and the
cause was neither the grade nor the encoder. Every full-bleed frame declared
`sizes="100vw"`, but `object-fit: cover` paints a frame wider than its box
wherever the frame is proportionally the wider of the two, so the browser was
magnifying a variant chosen for the box: the ultra-wide slide was painted at
1928px from a 1600px file on a desktop and at 1808px from a 640px file on a
phone. `coverSizes()` declares the painted width; nothing on the site now
exceeds 1.0 rendered-to-intrinsic at either viewport.

What is not fixable in code is the sources. `hero-2` is 1536×2048 and `hero-3`
is 2560×1195 — 3.1 MP each, against `IMG_4585`'s 48 MP — so on a retina desktop
the two of them land at 1.875 and 1.506 where the third is at 1.125. That is
the whole of "two of three look softer". Measured: the grade costs `hero-2` 5%
in bytes and nothing measurable in high-frequency detail.

**1.3 · No frame may cut its subject.** Done for three of four. About's ground,
home's third plate and the finale's centre and widest tiles are recomposed on
whole subjects. `IMG_4582-road` at the panels' join is the fourth and it cannot
be fixed by panning — see *Carried* below.

**1.4 · The About finale's tile selection is wrong.** Two of the three
replaced, and the third is why the *Carried* list has a new entry: the usable
set is one photograph short of this page. `ART-DIRECTION.md` §8 carries the
arithmetic.

---

## 2 · Transitions — done

Nine items, all measured before and after on a clean production build at
1440×900 and 390×844. Contact sheets, ten frames across each transition's own
scroll range, are in `design/refs/transitions/before` and `/after`.

One mechanism answers three of them, and it is worth stating on its own. A
photograph that has to get from being the whole ground to being no ground at
all cannot do it by fading: at half strength the frame is the grey-green haze
with shapes in it that §F1's polarised ledger exists to forbid, and it is
forbidden at every intermediate frame and not only at the ends. A **full-bleed
luminance wipe** is the one move that crosses between them without ever
painting it — every row of the window is either the photograph or the floor,
and what travels is a boundary 40% of the window deep, with no line in it to
trace. The incoming state always enters from the foot of the window, so a
plate on its way up wells up from the bottom and one on its way out withdraws
upward and leaves through the top. `PhotoStage` carries it per plate; the
gains frame keeps the fade, because it lays its own edge-to-edge copy of its
photograph over the stage and that plate's ramp is never the thing being
looked at.

**2.1 · The opening move.** Done. The card was a 300×400 rectangle with a
hairline ring and a 50px `gold-anchor` glow, growing out of the middle of the
poster and carrying the *same* photograph at a different crop — the poster
cover-fits `IMG_4585` to the window at `50% 33%`, the card cover-fit the same
3:4 frame to a 3:4 box at `50% 50%`, so one picture showed as two. Matching
`object-position` could not have closed it: the field of view is set by the
box's aspect, and the box is what changes. The card is a **window** now —
everything inside it is painted at the window's own size and centred on the
window, so the growing frame uncovers the picture already behind it. The ring
and the glow are gone, the 0.75 gold-wash veil inside the card is gone, the
six darkening values are the section's rather than each layer's so there is no
rectangle of one ramp inside another, and the poster holds at full strength
until the card covers the window at progress 0.92 — it used to run `1 −
progress`, and two part-transparent copies of one photograph composite
brighter than one, which is why the card showed as a lighter box. The section
breathes 1.000 → 1.030 → 1.000 on one shared number, so the two plates cross
on one vector where the poster used to carry no transform at any frame. The
card holds the first slide for the whole opening; the slideshow clock is
untouched and only what the card *displays* is re-based, because at wheel 1050
it was already on the third slide and the picture changed identity mid-open.

**2.2 · "What we do" takes too long to show its picture.** Done. The plate was
keyed from 10svh to 32svh of the section, which keys at 540 and 738 — and the
hero's foot clears the bottom of the window at scroll 0, so **540px on a
desktop and 506px on a phone, 0.60 of a viewport at both, passed with the
incoming ground bare**, with the clearing's own clock entrance firing and
finishing inside it. It now rises from scroll 0 and is full 0.62 of a viewport
later (558px / 523px), as a wipe, so the strip the hero has uncovered is
photograph from the first pixel of it.

**2.3 · The road at the panels' join arrives oddly.** Done. The rise was **90px
— 0.10 of a viewport, inside a single notch of a wheel** — and it crossfaded
against nothing, since both other plates are at 0.000 for the whole pass. What
compressed it was the panels' own quiet markers at 25% and 75%: the one at 75%
of the first panel keyed 90px before the road's full key. One marker at 60%
replaces the two. The pass is 225 / 270 / 315px at 1440×900 and 231 / 253 /
334 at 390×844 — rise, hold, fall — and the road comes up into the frame from
the foot of the window rather than the whole picture brightening at once.

**2.4 · The handover into the panels reads as the picture leaving.** Done, and
it was a bug rather than a decision. Two stage zones keyed at the *identical*
scroll position — the clearing's `bottom-0` marker declaring plate 0 full and
an `h-0` marker declaring it nothing, both at document row 1800, both keying
at 1350 desktop and 1266 mobile. `PhotoStage` blends on `(scroll − a)/(b − a)`,
so a zero span forces the ratio to 1 and the layer changed in one frame:
**81.3% of the window's pixels on a desktop and 87.9% on a phone, in one 20px
step** — the largest step anywhere on the site. With the marker deleted the
fall runs 546px / 487px, 0.607 and 0.577 of a viewport, and it runs the right
way round: the ledger's last row leaves the window at 1640 / 1511 and the
ground is still a photograph for 256px / 242px after it, where before it went
out 290px / 245px while the numerals were still being read.

**2.5 · The About wall's tiles are magnified as they arrive.** Done, and the
Section 1 report's "accepted transient" is withdrawn. The zoom ran the seven
tiles to 2.60–5.27× across stage 0.77–0.95. Tile 6 is a 576×270 box that
reached **3036 CSS px — 9107 device px at DPR 3 out of a 6048px master, 1.51×
the source and 4.74× the 1920 rung its resting `sizes` asked for.** No `sizes`
string closes that: a declaration made at the peak asks for 9107 and the ladder
stops at 2560. The centre tile is why the move had to go rather than shrink —
at 2.60 it is a full-bleed placement of `hero-1`, and capped at what 2048px can
pay for it reaches 1.42 at DPR 2, covering 71% of the window and nothing at all
at DPR 3. **Nothing in the section is scaled at any frame now**; the wall
itself is the ending, which is what it was built to be, and the travel the zoom
used to spend goes to the assembly — the ring lands one tile at a time to the
end of the pin and the centre tile arrives last, in the place the words stood.
That also closed the **320px desktop / 168px mobile stall** inside the pin,
which is down to 20px and 14px, both a single sampling step.

Measured after: every finale tile is now `rest == peak`, and the About page has
no placement anywhere where the painted width exceeds the resting width.
About's headline holds at **5.33** and its lede at **5.39**, unchanged to two
decimals. Home has no stall at either viewport. The one contrast number that
moved materially is the Training Courses prose over the road, **5.72 → 5.07**
against a 4.5 floor, spent on the road's longer fall.

**2.6 · The hero shade sat in the middle register.** Done, and there were two
faults, not one.

The named one is the card's top stop at **0.34**. That is the forbidden band:
the picture under it reads at 0.66, which is neither a photograph nor a ground,
and against `IMG_4585`'s open sky it painted a washed band across the whole
upper third of the *resting* hero — the state the page settles on. It is **78**
now. The number goes up rather than down because `.chrome-shade` already
carries the nav on its own and §2.8's ratchet forbids lowering anything the nav
stands on; composited with the chrome ramp, row 0 goes **0.908 → 0.969**. The
endpoints are therefore **92 → 78**, both inside the upper pole, and no frame
of the travel lands between 0.04 and 0.75.

The larger fault was the travel itself. Interpolating the two sets of numbers
manufactured a *third* state that belonged to neither: at progress 0.6 the six
read **62.97 / 40.97 / 51.05 / 15.01 / 49.98**, so every row of the window sat
between 41% and 63% at once — one flat veil over the whole picture, held for a
fifth of the expansion. Nothing is interpolated now. The two ramps are fixed
and what travels is a **boundary**, which is the mechanism this same section of
work already adopted for the plates: the card's ramp wells up from the foot of
the window and the poster's withdraws upward and leaves through the top, over a
40%-deep gradient with no line in it to trace. Every row of every frame carries
one ramp or the other.

Measured across the expansion, the top third's mean luminance at 1440×900:

| progress | 0.0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1.0 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| before | 86 | 85 | 84 | 82 | 90 | 108 | 126 | 143 | 159 | 168 | 168 |
| after | 86 | 85 | 84 | 82 | 81 | 81 | 114 | 160 | 159 | 159 | 158 |

Before, it drifted through every value between the two states. After, it holds
the poster's number until the boundary passes through that band and then it is
the card's. Neither end carries a mask at all — a no-op mask costs a
compositing pass, and the rounding showed as **5.27 → 5.21** on the headline
before that was fixed. Contrast after: headline **5.26 / 5.34**, label **5.89 /
5.81**, lede **8.87 / 5.71** — unchanged against `3749c92` to a hundredth.

**2.7 · The ladder cap.** Done, one rung, at **2880** — 1440 CSS at DPR 2, and
not a round number above it. Section 1 declined 3200 on an LCP argument and the
measured bytes uphold it: the home hero's AVIF is **1120KB at 2560, 1367KB at
2880, 1629KB at 3200**, so the rung that closes the defect costs 247KB and the
one that overshoots it by 320px costs 509KB.

LCP per page at 1440×900 DPR 2, AVIF: home `IMG_4585` **1120 → 1367KB**
(+22.1%); About `IMG_4721` **1104 → 1260KB** (+14.1%); Contact `IMG_4735-road`
**802 → 967KB** (+20.6%); FAQ **636KB unchanged** — its ground is `hero-2`,
capped by its own 1536px master. Whole-page AVIF at the same viewport: home
4014 → 4501KB (+12.1%), About 1759 → 1915KB (+8.9%), Contact 802 → 967KB.

Five frames are given the rung and the same five fetch it: `IMG_4585`,
`IMG_4619-valley`, `IMG_4582-road` (home), `IMG_4721` (About), `IMG_4735-road`
(Contact). `sizes` is what keeps it off everything else — no tile, panel or
scene object resolves above 2048 at any viewport, so the About wall's own copy
of `IMG_4585` still takes the **1152** rung and `IMG_4619-ridge` takes 1920 —
and `scripts/responsive-images.mjs` does not emit it for them either, so it
never reaches the deploy. `hero-1`, `hero-2` and `hero-3` are full-bleed
placements too and are named in the set for that reason; their masters are at
or under 2560 and the filter never gives them the rung.

Rendered-against-fetched, full-bleed, **at rest**: **1.13 → 1.00** at DPR 2 for
all five, and **1.69 → 1.50** at 1440×DPR 3, which is the case §2.7 excludes as
unclosable. The remaining 1.05–1.07 at DPR 2 is peak only and it is
`PhotoStage`'s own 1.07 arrival scale, a transient no reader stops on.

It cost contrast, and that is the finding. A sharper ground has brighter specks
in it for a glyph stem to land on: **19 elements fell**, every one of them on
the desktop viewport and on one of the five frames, the largest by 0.66. One
crossed its floor — Contact's invitation, **4.50 → 4.40** — and three points of
plate strength on that ground put it at **4.75**. The other eighteen all pass,
but they are below their `3749c92` values and §2.8's ratchet is written against
those. See the note under the reference set.

**2.8 · The contrast floor is a ratchet.** The `3749c92` set is recorded at the
foot of this file. `"All expenses covered"` is fixed: the four gains stand
between 44% and 71% of the gains frame, so the first three are in the flat 44%
band and the last one is in the fall toward the base, and it is the picture
that is thin there rather than the darkening — the bright valley floor by that
row. The base goes **70 → 84**, which moves that one line and leaves the other
three untouched because they sit above the stop it moves. **4.48 → 4.69**, and
it clears 4.5 for the first time. The base itself is inside `--gain-end`'s
dissolve, so nothing new is painted at the frame's bottom edge.

**2.9 · The centre zoom is back at 1.39.** Rejected on sight, and the reason is
a rule rather than a taste. At 1.39 the tile covered **38.6% of the window** —
69.5vw × 55.6vh, 1000.8 × 500.4 at 1440×900 and 271.0 × 469.3 at 390×844. That
is large enough to overlap the six tiles around it and small enough that they
still show past it, so it read as a hard-edged rectangle laid on other
rectangles: the collage this project rejected at the start. 2.60 filled the
window, hid every other tile and read as one photograph taking the screen, and
that is the beat.

**A scaling frame either reaches full window coverage or does not scale at
all.** Partial coverage makes the frame an object sitting on other objects.
This is the same polarisation as plate strength, at the level of coverage, and
it is written into `DESIGN-SYSTEM.md` beside the interpolation rule. Its first
consequence is that reading the amplitude off the source — as §2.9 did — lands
in the forbidden band by construction: a factor that cannot be paid for at
ratio ≤ 1.0 must not be spent at all. §2.13 and §2.14 replace it.

**2.13 · Swap the centre and upper-right photographs.** Done.

The centre slot could not pay for coverage while `hero-1` stood in it. At 2.60
the tile is painted 1872 CSS px wide at 1440×900, and against a 2048px master
that is **1.83 at DPR 2 and 2.74 at DPR 3** — restoring the factor without
changing the photograph restores the blur. The two slots are close in aspect,
centre 50×40 (**2.000**) and upper-right 40×30 (**2.133**), so neither frame
changes shape moving between them:

  centre       ← `IMG_4585`  (6048×8064)
  upper-right  ← `hero-1`    (2048×1510)

**The crop audit, at both ends of the travel and both viewports.** The visible
rectangle is the box at rest and the *window* at full coverage, because the
sticky frame clips the grown tile; both are measured, not assumed.

| | window on the frame | share of the frame | whole subject |
|---|---|---|---|
| centre, 1440×900, rest | cols 0–100%, rows 21.9–59.4% | 37.5% | yes |
| centre, 1440×900, full coverage | cols 11.5–88.5%, rows 22.6–58.7% | 27.7% | yes |
| centre, 390×844, rest | cols 20.7–97.7%, rows 0–100% | 77.0% | yes |
| centre, 390×844, full coverage | cols 29.6–88.8%, rows 1.9–98.1% | 57.0% | yes |
| upper-R, 1440×900 | cols 0–100%, rows 36.4–100% | 63.6% | yes |
| upper-R, 390×844 | cols 27.3–72.7%, rows 0–100% | 45.4% | yes |

On a desktop the centre tile's subject is the valley — the village, the
terraces, the tree, the wall and the far mountains, complete at both ends, and
the four walkers are below the band at every scale. `object-position`'s x does
nothing there at any scale: a 3:4 frame is narrower than this slot at every
size of it, so it is fitted by width and painted exactly as wide as its box.

**On a phone x is the whole of what the tile shows**, and it is what the audit
turned on. The frame is the wider of the two there, so it is fitted by height
and the full height of it is in the picture at every scale — the walkers cannot
be avoided. They stand at **2.0–9.4%, 12.2–19.2%, 22.6–26.2% and 32.1–35.7%**
of the frame's width. The window narrows by 7.7% on each side as the tile
grows, and no gap between two walkers is that wide, so **one of them is crossed
on the way whatever the number is**; what the number decides is whether either
*end* cuts a body. `50%` fails: it lands the full-coverage edge on 19.2%, which
is the second walker's trailing hand. **`90%` clears both** — the edge sits at
20.9% at rest, 1.5% past the second walker, and at 29.6% at full coverage, 3.4%
past the third and 2.5% short of the fourth.

`hero-1`'s new slot is 4.2 points tighter on a desktop (63.6% against 67.8%)
and 2.8 points wider on a phone (45.4% against 42.6%). It keeps `50% 100%`:
anchored to the foot of the frame the two nearest walkers stand on the ground
they are walking on, which is what that number was chosen for.

**The two-placements rule is unchanged by the swap.** `IMG_4585` stays at two —
the home hero (poster and first slide count as one) and this wall. `hero-1`
stays at two — the ground under "What we do" and this wall. `hero-2` is still
the one frame at three, for the reason §8 carries, and nothing here touches it.

Two findings, neither introduced here. A **lattice pylon and its wires** stand
at cols 91.5–92.3%, rows 43.9–49.1% of `IMG_4585` — 4 CSS px wide against the
dark treeline. It is already on the home hero and was already on this wall's
desktop tile; the new crop keeps it at rest and **loses it at full coverage**,
which is the better of the two states. And `hero-1`'s own right edge cuts a
head in the original frame; the upper-right slot shows the full width of it, as
the centre slot did.

**2.14 · Full coverage restored.** Done, at **2.60** — the value the wall had
before the resolution argument took it away.

The slot is 50vw × 40vh, so the threshold is 2.5 and the **height** sets it:
50 × 2.6 = 130vw and 40 × 2.6 = 104vh, and the window is covered with 15% off
each side and 2% off the top and foot. Measured off the tile's own rect,
**coverage at peak is 100.00% at both viewports**, against 38.64% at 1.39.

Reaching the threshold is not holding it. Scale crosses 2.5 three quarters of
the way through the eased rise — **stage 0.945 desktop, 0.938 mobile** — so the
window is wholly one photograph for the last **108px / 104px** of the pin and
on through the release. A factor of exactly 2.5 would have touched full
coverage on the last frame and never held it.

**The rise runs 455.4px at 1440×900 and 438.9px at 390×844 — 0.506 and 0.520 of
a viewport**, against §2.10's half-viewport floor, and none of it is new pin.
It starts at stage 0.77 / 0.74, while the ring is still landing: the last of
the six settles at 0.92 / 0.94 and the growing tile covers them as they arrive.
That overlap is the only place the travel could have come from, the pin being
at §G's 1.2-viewport ceiling. **Only the centre tile scales; the six of the
ring hold at 1.000 at every frame** — the complaint that made the wall arrive
small and swell is not reopened.

The centre tile's own arrival moved with it. It used to fade in over
0.82–0.94, which left **0.12 of the section between the words leaving and the
tile appearing** with the centre slot showing bare page ground. It now runs
from the frame the paragraph is gone on to the frame the scale begins on —
**0.70–0.77 desktop, 0.68–0.74 mobile** — so nothing scales while it is
part-transparent and it still crosses no live text. Bare page floor across the
rise, sampled as floor-coloured pixels:

| stage | 0.77 | 0.80 | 0.85 | 0.90 | 0.94 | 1.00 |
|---|---|---|---|---|---|---|
| 1440×900 before | 11.08% | 9.18% | 9.57% | 8.28% | 7.48% | 8.35% |
| 1440×900 after | 11.33% | 9.40% | 7.09% | 7.06% | 7.71% | 8.43% |
| 390×844 before | 18.89% | 16.90% | 13.46% | 9.65% | 5.70% | 6.64% |
| 390×844 after | **15.11%** | **12.80%** | **6.91%** | **4.08%** | **3.68%** | **4.42%** |

The residual 4–8% at full coverage is the detector, not the page: the window is
one photograph by the tile's own rect, and what it is counting is that
photograph's own shadow under the ferns and the oak.

**The stall is unchanged.** Scanned frame by frame across the whole pinned
section at one sampling step, the longest run with no visible change is **0px
at 1440×900 (20px steps) and 14px at 390×844 (14px steps)** — one step, the
same as before, and inside the 20px §2.5 left.

**Ratio at every frame of the rise**, painted device px against the fetched
variant and against the graded source. Nothing exceeds 1.0 anywhere on it:

| stage | 0.77 | 0.80 | 0.84 | 0.88 | 0.90 | 0.92 | 0.94 | 0.96 | 0.98 | 1.00 |
|---|---|---|---|---|---|---|---|---|---|---|
| **1440×900 DPR 2** — painted CSS | 720 | 738 | 854 | 1222 | 1497 | 1680 | 1781 | 1837 | 1864 | **1872** |
| vs fetched (3840) | 0.375 | 0.384 | 0.445 | 0.637 | 0.780 | 0.875 | 0.928 | 0.957 | 0.971 | **0.975** |
| vs source (6048) | 0.238 | 0.244 | 0.282 | 0.404 | 0.495 | 0.556 | 0.589 | 0.608 | 0.616 | **0.619** |
| coverage | 20.0% | 21.0% | 28.2% | 57.6% | 83.2% | 93.3% | 98.9% | 100% | 100% | **100%** |

| stage | 0.74 | 0.78 | 0.82 | 0.86 | 0.88 | 0.90 | 0.92 | 0.94 | 0.98 | 1.00 |
|---|---|---|---|---|---|---|---|---|---|---|
| **390×844 DPR 3** — painted CSS | 253 | 262 | 302 | 413 | 498 | 567 | 609 | 634 | 656 | **658** |
| vs fetched (2560) | 0.296 | 0.307 | 0.353 | 0.484 | 0.583 | 0.664 | 0.714 | 0.743 | 0.768 | **0.771** |
| vs source (6048) | 0.125 | 0.130 | 0.150 | 0.205 | 0.247 | 0.281 | 0.302 | 0.315 | 0.325 | **0.326** |
| coverage | 20.0% | 21.5% | 28.4% | 53.3% | 77.4% | 89.6% | 96.3% | 100% | 100% | **100%** |

**The rung, and why it is published under a key of its own.** At full coverage
the tile asks **3744 device px** at 1440×900 DPR 2, which is 864 above §2.7's
bleed cap, so it needs a rung at **3840**. It cannot simply be added to
`IMG_4585`'s ladder: a browser takes the first rung at or above what `sizes`
asks for, and the **home hero asks 2966 of this same photograph**, so a 3840
rung in that srcset would land on the home LCP and take it from 1367KB to
2169KB. `scripts/responsive-images.mjs` therefore emits it under
`/images/pt/IMG_4585.jpg#wall` — same graded pixels, same file basename, so
only the extra width is written, **one file per format at 2169 / 3449 / 4473KB**.

Confirmed on the built output rather than argued: the string `-3840.` appears
**5 times in `/about/`'s markup and 0 times on `/`, `/contact/` and `/faq/`**,
and the home hero's preload and all three of its `<source>` srcsets still stop
at 2880. Measured end to end, every image file each page actually fetches:

| | before | after |
|---|---|---|
| `/` at 1440×900 DPR 2 | 4564KB | **4564KB** |
| `/` at 390×844 DPR 3 | 4295KB | **4295KB** |
| `/about/` at 1440×900 DPR 2 | 3217KB | 4896KB (+1679, +52%) |
| `/about/` at 390×844 DPR 3 | 2453KB | 3312KB (+859, +35%) |

**Home does not move by a byte.** What /about pays is spent on a lazy image
that is the last thing on the page: its LCP is still `IMG_4721-2880` at 1260KB,
unchanged, and the wall's centre tile is fetched after three scene photographs
have already been crossed. The deploy grows 137MB → 147MB of variants.

One cost is worth recording. `sizes` declares the peak rather than the slot,
which is what stops the pinned tile from downloading twice — so a **reduced
motion** visitor on a DPR 2 desktop, who never gets the pinned tile at all,
fetches the 3840 rung for a static 1440px grid cell. The alternative is a
second download for everyone else, since the resting grid is the exported HTML
and what replaces it is the thing that needs the pixels. This is not new; 2.60
only makes it dearer.

**What this cost against the ratchet, and it is §2.13's bill rather than
§2.14's.** The full sweep was re-run on a clean production build: 93 elements
over four pages, both viewports, 186 measurements, worst glyph-core pixel per
element across every scroll position. **Three moved, all of them by more than
0.01, all three the desktop nav on `/about`:**

| element | `3749c92` | before | after | floor |
|---|---|---|---|---|
| `a` FAQ | 7.38 | 7.08 | **6.58** | 4.5 |
| `a` Contact | 6.31 | 6.31 | **6.18** | 4.5 |
| `a` Home | 6.88 | 6.88 | **6.86** | 4.5 |

Nothing else on the site changed by a hundredth, no floor is breached, and the
one element below its floor anywhere is FAQ's opening paragraph on mobile at
**4.39**, which is below it at `3749c92` too.

All three worst pixels now land at **y4200 on `/about`** — stage 0.758, before
the rise begins and with nothing scaled — so this is the swap and not the
coverage. The cause is §2.7's finding again, on a different frame: with the
nav blanked and the ground under it measured directly, the right third of the
header band goes from a **maximum luminance of 71 to 84** as `hero-1` takes the
upper-right slot. Its sunlit water has brighter specks in it than the valley
did, and a glyph stem lands on one.

**It cannot be bought back inside this change, and that is the finding.**
Contrast is repaired by lowering the photograph's strength in the zone; the
zone here is the fixed header, what carries it is `.chrome-shade`, and that
class is frozen. The tile is already anchored to the foot of its frame, which
is the darkest band the slot can take — every other `object-position` puts
*more* sky under the bar. The only remaining lever is a different photograph in
the upper-right slot, which is the swap itself.

So §2.8's ratchet is breached in three places and the work was completed rather
than stopped, because stopping leaves 1.39 on the page and 1.39 is the thing
that was rejected. The three are 1.68 to 2.36 above their floors. They join the
thirty-eight already recorded below, and they belong to the same decision the
reference set defers: whether the ratchet is measured against `3749c92` or
re-based on the build that §2.7's resolution produced.

**2.17 · The real-device pass — three defects, one mechanism, and it is not the
engine.** Diagnosis only; nothing was changed by this item.

Run on `playwright-core`'s WebKit (26.5, build 2336) and on Chromium, against
the same production export, with an identical harness: 390 wide at DPR 3 at the
**small** chrome state (664), the **large** one (750) and the 844 every prior
measurement in this project used; 375×553 for an iPhone SE; 1440×900 at DPR 2
as the desktop control.

**The negative control, first, because it governs all three.** Every number
below lands within 0.4 of a percentage point and 0.4 of a pixel between the two
engines at the same viewport. **Not one of the three is an engine difference.**
What separates them is viewport *height*: 390×844 is the iPhone's screen, and
Safari never gives a page its screen — with the URL bar showing the page has
**664**, with it collapsed **750**. Every measurement this project has ever
taken was at a height the device cannot produce.

**A · The headline's second line is cut through its glyphs — and it is the land
silhouette, not §2.6's boundary.**

The layer in front of the headline is `.hero-ridge`: the poster again, masked to
the frame's own land at `mask-size: cover`, `mask-position: 50% 33%`, a
3000×4000 mask in a 390×H box. At every height a phone can show, `cover` fits
that mask **by its height**, so its skyline sits at a *constant fraction of the
window*: measured 352.3px at 844, 292.3 at 700, 277.3 at 664 — **0.4174 /
0.4176 / 0.4176**, and identical across the two engines to 0.3px.

The headline is not on that law. Its block is `top-[23.5%]` of the same box, and
between the block's top and the second line's own box sits a stack that is
**pure px**: the label, its 1.25px strike, `gap-3`, `mb-6`, the first line's
51.1px and `gap-1`. Measured at the three heights it is **110.56 / 110.55 /
110.56px** — one number, at every window.

So the clearance between the skyline and the second line is `0.1825·H − 110.6`,
which is not a constant. The line box is 51.1px and its ink runs from 5.1 to
46.4 inside it:

| window | clearance | where the skyline crosses the ink | line 2 covered (wk / ch) | line 2's visible glyph cores |
|---|---|---|---|---|
| 844 — the screen | 43.5px | 0.93, the feet, as designed | 2.5% / 1.8% | 36 455 |
| 750 — bar collapsed | 26.4px | 0.55 | 47.3% / 43.5% | 22 830 |
| 700 | 17.2px | 0.39 | 70.7% / 69.9% | — |
| 664 — bar showing | 10.6px | **0.20** | **89.3% / 89.4%** | 6 037 |
| 553 — SE, bar showing | **−9.7px** | above the box entirely | **100% / 100%** | **0** |

`"We"` is never touched — **0% at every viewport in both engines** — which is
the whole of *"We renders whole, are ArtiCYa fades away partway down the
letterforms"*. With the layer disabled the second line renders whole: 38 675
glyph pixels against the 38 671 it has when the layer is present but has not yet
been asked to paint. And the coverage *releases* as the card opens — 89.3% at
progress 0, 72.1% at 0.10, 43.5% at 0.20, nothing by 0.30 — because the block
carries `titleShift` up past a skyline that does not move, which is *"only
becomes whole after the animation finishes"*.

The treatment reads as designed only above **H ≈ 827px** (the crossing inside
the bottom 15% of the ink) and clears the ink entirely only above **860px**. No
iPhone in portrait, with Safari's chrome, is ever above either.

**Both named hypotheses are falsified, and the numbers are here so neither is
tested twice.**

- *§2.6's travelling boundary.* It runs progress 0.35 → 0.85. `titleOpacity`
  reaches exactly 0 at 0.35 and the first frame carrying a mask at all is above
  it, so the boundary never crosses a painted glyph. Measured at 390×664: the
  headline's glyph population is **205 pixels at progress 0.297 and 0 by 0.35**,
  in both engines. The two clocks meet exactly and by construction; §2.18's rule
  is what turns that from a coincidence into a requirement.
- *The prefixed fallback on a different subtree.* `.hero-ridge` resolves
  `mask-image` and `-webkit-mask-image` to the same `url(…)`, `mask-size` and
  `-webkit-mask-size` both to `cover`, `mask-position` and
  `-webkit-mask-position` both to `50% 33%`, `mask-mode: match-source`,
  `mask-clip: border-box` — the same eleven values in both engines. **No
  descendant of `.hero-ridge` carries a mask declaration at any frame where the
  headline is painted**, so there is no subtree for the two rules to disagree
  about.
- *`container-type: size` with `cqw`/`cqh`.* `.hero-window-scope` computes
  `container-type: size` in both engines and `.hero-window` computes to exactly
  **390×664, 390×750 and 390×844** in both. No drift at any height.

**B · The vertical space. Measured, not changed — see the note under §2.19.**

**No section on the home page carries vertical padding at any viewport**, with
one exception: the closing section, at **64/96px** on a phone and 96/128 on a
desktop. The space is built from px *inside* the sections, and those numbers do
not move with the window — each offer panel's inner block is `py-16` and its
grid adds `pt-4rem`, so **128px stands at the head of each panel and 64 at its
foot at every window height**; the gains frame's block is `py-20`; the hero's
intro band is `pt-5 pb-16`.

Dead rows per section at 390×844, counting a row live if it carries a glyph or
an object photograph, and excluding the fixed stage — the stage is behind every
row of the page, so counting it makes the measure say nothing:

| section | top | height | padding | dead | head run | foot run |
|---|---|---|---|---|---|---|
| hero | 0 | 844 | 0 / 0 | 0.0% | 0 | 0 |
| What we do | 844 | 2700 | 0 / 0 | 47.3% | 258 | 0 |
| Youth Exchanges | 1728 | 895 | 0 / 0 | 37.3% | 164 | 62 |
| Training Courses | 2623 | 921 | 0 / 0 | 36.7% | 166 | 0 |
| What you gain | 3544 | 844 | 0 / 0 | 0.0% | 0 | 0 |
| Closing | 4388 | 395 | 64 / 96 | 67.1% | 67 | 109 |

Every run longer than a quarter of the window, both chrome states:

| the run | 390×844 | 390×664 |
|---|---|---|
| ledger → first panel | 844–1102, 258px, 0.31 vh | 665–832, 167px, 0.25 vh |
| panel 1's last line → panel 2's first | 1490–1892, **402px, 0.48 vh** | 1189–1532, **343px, 0.52 vh** |
| panel 2's head | 2561–2789, 228px, 0.27 vh | 2200–2428, 228px, 0.34 vh |
| closing → footer | 4674–4931, 257px, 0.30 vh | 4134–4392, 258px, 0.39 vh |

**It is A's mechanism again.** In absolute px the phone has *less* dead space
than the desktop — 996 of 4392 at 664 against 1329 of 5254 at 1440×900 — and as
a share of a screen it has more: **1.50 screens of gap at 664, 1.36 at 844, 1.47
at 1440×900**. The gaps are px and the window is not. Both engines agree within
8px on every run.

**Every Section 2 transition key, in scroll px.** Recomputed exactly as
`PhotoStage` keys them — a zone owns the stage when its own middle is at the
middle of the window, `zoneTop + zoneHeight/2 − innerHeight/2` — with the run-up
frame at −332 / −375 / −422, which is negative at all three heights and
therefore never inserted:

| key | plate | strength | 390×664 | 390×750 | 390×844 |
|---|---|---|---|---|---|
| the clearing starts to rise | 0 | 0 | 0 | 0 | 0 |
| the clearing is full | 0 | 1 | 412 | 465 | 523 |
| the ledger holds it | 0 | 1 | 996 | 1125 | 1266 |
| panel 1 takes the frame | 1 | 0 | 1483 | 1612 | 1753 |
| panel 1 quiet | 1 | 0 | 1573 | 1702 | 1843 |
| the road rises | 1 | 1 | 1831 | 1947 | 2074 |
| the road falls | 1 | 1 | 2030 | 2172 | 2327 |
| panel 2 takes the frame | 1 | 0 | 2391 | 2520 | 2661 |
| panel 2 quiet | 1 | 0 | 2484 | 2613 | 2753 |
| the gains ground quiet | 1 | 0 | 2852 | 2981 | 3122 |
| the gains ground full | 2 | 1 | 3184 | 3356 | 3544 |
| the closing | 1 | 0 | 3714 | 3929 | 4164 |

A key is a sum of everything above it, so **a change of Δ px anywhere displaces
every key at or below it by Δ**, and the four transitions §2.2–§2.5 tuned are
keyed off these twelve numbers. That is why B is not touched here.

There is a second reason, and it is new. The hero is `dvh` and everything under
it is `svh`, so on the device the document grows by the difference between the
two chrome states as the toolbar animates — **86px** — while `innerHeight` grows
by the same amount, which moves every key below the hero by **+43px mid-gesture**
and re-runs `PhotoStage`'s `ResizeObserver` while it does. Any B work has to
settle that first or it will be tuning against a number that moves.

**C · The photographs are larger than the screen. It is the unit.**

*Not a transient.* Every plate is written the literal string `scale(1)` — read
off the inline style the layer writes, not off a computed matrix — at its own
arrival key and at every scroll past it, at all three window heights, in both
engines. The peak is exactly 1.07 and the last sample before the key is
1.0004–1.0021. The slide cross-in: the slide on show computes `transform: none`;
the two that are not on show hold 1.05 at opacity 0. **Nothing leaves residue in
WebKit.**

*Not a resolution failure.* Worst rendered-against-fetched anywhere on home at
DPR 3 is **0.80** — `hero-2` at the 1536 rung. Nothing exceeds 1.0.

*It is the unit, and the home page states its height three ways, one of which
states nothing at all:*

| what | declaration | what it means on the device |
|---|---|---|
| hero `<section>`, and the card's size container | `min-h-[100dvh]` / `h-[100dvh]` | tracks the visible viewport |
| "What we do", both offer panels, the gains frame | `min-h-svh` | the small viewport, constant |
| **the photographic stage — every photograph below the hero** | **`fixed inset-0`, no unit at all** | **the layout viewport, which iOS holds at the *large* height** |

A fixed box resolves against the initial containing block, and iOS keeps that at
the large viewport while the visual viewport shrinks under the URL bar. So the
stage is **750px tall while the reader sees 664 — 86px, 13% of its height, below
the fold**, and the `stage-plate-shade`'s bottom hold, which is anchored to the
bottom of the *window*, goes off the bottom with it. At the peak of an arrival
the same layer is 802.5px against 664 — **21%**.

**Neither engine can show this and that is the finding rather than a gap in
it**: headless has no browser chrome, so both resolve `100svh == 100lvh ==
100dvh == innerHeight` and both put `fixed; inset: 0` at exactly `innerHeight`.
Measured: `.photo-stage` is 664×390 at a 664 window and 750×390 at a 750 window
in both. The defect is legible in the declaration, not in the emulator.

**2.18 · The headline stays in the depth and the skyline goes back to its
feet.** Done, and it is one number.

The headline is still between the two copies of the poster and the land still
runs in front of it — the treatment is untouched. What changed is the law the
block is placed by. The skyline is a fraction of the window and the type is that
fraction *plus* 110.6px of fixed stack, so the offset that holds the two
together is `a·H − b`, not a percentage:

**`top: max(calc(41.75% − 154px), 5rem)`**, replacing `top: 23.5%`, below `md`
only.

**41.75%** is the mask's own fraction, measured at three heights within 0.0002.
**154px** is the 110.6px stack plus the **43.5px** clearance 390×844 was tuned
on — the clearance that lands the crossing at 0.93 of the ink. **5rem** is a
floor that binds below a 560px window, where the expression would put the label
under the fixed 65px header; at 553 it leaves the crossing at 0.967 of the ink,
which is still the feet. Desktop keeps `15%`: above 768px the mask is fitted by
*width* and the law there is a different one.

Measured — the share of `"are ArtiCYa"`'s ink the land covers, and where in the
ink it crosses, WebKit / Chromium:

| window | before | after | crossing, after |
|---|---|---|---|
| 375×553 | **100% / 100%** — the line was gone | 7.0% / 6.7% | 0.967 |
| 390×664 | **89.3% / 89.4%** | **1.5% / 1.3%** | grazes below 0.5-coverage |
| 390×750 | 47.3% / 43.5% | 3.2% / 2.0% | grazes |
| 390×844 | 2.5% / 1.8% | **2.5% / 1.8%** | unchanged |
| 1440×900 | 5.5% / 5.1% | **5.5% / 5.1%** | 0.97 / 0.979, unchanged |

`"We"` is untouched at every height in both engines, before and after: **0%**.
The depth still reads — the land crosses the ink at every viewport, at 1.3–7.0%,
which is the band 390×844 and 1440×900 have always shipped.

**Contrast, A/B in one page** so the build, the engine and the scroll state are
held and `top` is the only variable, with the slideshow pinned to slide 1 and an
adaptive glyph threshold (a flat 300 discards four fifths of the label's pixels
once `.chrome-shade` compresses ink and ground, and then reports the surviving
best ones as a *rise*):

| | headline 1 | headline 2 | label | lede |
|---|---|---|---|---|
| 390×844 wk | 5.42 → **5.42** | 5.98 → **5.98** | 5.88 → **5.88** | 5.14 → **5.14** |
| 390×844 ch | 5.28 → **5.28** | 5.79 → **5.79** | 5.81 → **5.81** | 5.05 → **5.05** |
| 1440×900 wk | 5.37 → **5.37** | 5.33 → **5.33** | 5.90 → **5.90** | 9.80 → **9.80** |
| 1440×900 ch | 5.27 → **5.27** | 5.21 → **5.21** | 5.75 → **5.75** | 9.80 → **9.80** |
| 390×750 wk | 5.41 → 5.38 | 5.79 → 5.42 | 5.88 → 5.80 | 4.80 → 4.80 |
| 390×750 ch | 5.27 → 5.27 | 5.78 → 5.35 | 5.81 → 5.73 | 4.65 → 4.65 |
| 390×664 wk | 5.41 → 5.47 | 6.06 → 5.38 | 5.89 → 5.97 | 3.61 → 3.61 |
| 390×664 ch | 5.27 → 5.38 | 5.87 → 5.30 | 5.81 → 5.81 | 3.78 → 3.78 |
| 375×553 wk | 5.44 → 5.52 | — → 5.38 | 5.90 → 7.60 | 3.16 → 3.16 |
| 375×553 ch | 5.35 → 5.39 | — → 5.29 | 5.82 → 7.40 | 3.26 → 3.26 |

**Every reference-set viewport is Δ0.00 on every element**, so §2.8's ratchet —
which is measured at 390×844 and 1440×900 — is not touched at all.

**The 0.37–0.68 on the second line at the other heights is a population change,
not a contrast change, and the distinction is the whole point.** The old 6.06 at
390×664 was scored over **7 156** glyph pixels, because the land was covering
the other 30 000; the pixels that survived were the ones on the calm sky above
it. Scored over the whole line — **37 439** pixels, the population the reader
actually sees — the worst is 5.38. Nothing was darkened; the hidden four fifths
came back. It clears its 3.0 floor by 2.38, and 375×553 goes from *unmeasurable*
to 5.38 / 5.29. The label's 5.90 → 7.60 at 553 is real and in the same
direction: cream ink over a ground the chrome band darkens reads better, not
worse.

Nothing else moved. The block is absolutely positioned, so it cannot change
flow: **document height and all twelve Section 2 keys are identical** at 664,
750 and 844 in both engines, worst rendered-against-fetched holds at 0.80, and
there is no horizontal overflow at any height. `verify:text` passes on all four.

**2.19 · The ground now names the viewport instead of inheriting it.** Done.
**The cause was the unit, not the transient** — §2.17 excluded the transient by
measurement first: every plate is written the literal string `scale(1)` at its
arrival key and at every scroll past it, in both engines at all three heights,
and the worst rendered-against-fetched anywhere on home is 0.80.

`PhotoStage`'s layer goes from `fixed inset-0` to **`fixed inset-x-0 top-0
h-[100dvh]`**. `inset-0` gives a fixed box no height of its own, so it resolves
against the initial containing block, which a phone holds at the large viewport.
`svh` would have corrected the small state and broken the large one, leaving a
band of floor under the picture once the bar collapsed. `dvh` is the viewport as
it currently is, and it is what the hero already used — so the two layers whose
job is to cover the window now name the same thing, while the content sections
keep `svh` and go on fitting inside the smallest of them. The rule is written
into `DESIGN-SYSTEM.md` under **The stage**.

It applies on all four pages; `PhotoStage` is the ground everywhere.

**Confirmed after, both engines, at 390×664, 390×750 and 390×844:**

- **No Section 2 transition key shifted.** All twelve identical at all three
  heights, and the document heights with them — 4392 / 4650 / 4931.
- **No rendered/intrinsic ratio moved above 1.0.** Worst on home holds at
  **0.80**, `hero-2` at the 1536 rung, unchanged. No horizontal overflow.
- **Every arrival still settles on `scale(1)` exactly**, read off the inline
  string, at the key and at +40, +200 and +800px past it.
- The computed height is `innerHeight` at every viewport, which is the check
  `CLAUDE.md` requires whenever a utility and `globals.css` both touch a box:
  `.photo-stage` is unlayered and declares only `z-index`, so there is nothing
  for the new utility to lose to. WebKit resolves `100dvh` at an 844 window to
  **843.984375** — a 1/64px quantisation, and a bottom-row scan shows it as a ±1
  channel resample of the photograph, not a row of exposed floor. 664, 750 and
  1440×900 are byte-identical.

**What this cannot prove, and it is the honest half of the item.** Neither
engine has browser chrome, so neither can produce the state the defect lives in:
both resolve `svh`, `lvh`, `dvh` and an inherited fixed box to the same number.
The correction is legible in the declaration and verified to move nothing; **that
the photograph now fits at both chrome states has to be confirmed on the phone.**

One thing this pass did not touch and the next one should look at: About's
finale frame is `sticky top-0 h-svh`, which is the same mismatch the other way
round — sized to the small viewport, it will leave a band of floor below the
wall once the bar collapses. It is inside the wall geometry §2.5 froze, so it is
recorded rather than changed.

**2.20 · The hero lede is under its floor at both chrome states — new, and not
introduced here.** Found by the same run and left alone, because repairing it
means retuning `CARD_SHADE`, which is the hero's visual treatment measured
against the whole reference set, and that is an item of its own.

Glyph cores on the rendered composite, worst pixel, `ink` on the card's own
bottom darkening. Swept over all three slides, because the lede stands on
whichever frame is up and the rotation is 4.5s — the worst of the three is the
number, and it is slide 1 or 2 at every viewport:

| window | slide 1 | slide 2 | slide 3 | worst wk / ch | floor |
|---|---|---|---|---|---|
| 390×844 — the design height | 5.14 | 5.09 | 8.60 | 5.09 / 5.05 | 4.5 |
| 390×750 — bar collapsed | 4.80 | 5.03 | 5.41 | 4.80 / 4.65 | 4.5 |
| 390×664 — bar showing | 3.61 | 3.78 | 4.62 | **3.61 / 3.78** | 4.5 |
| 375×553 — SE | 3.16 | 3.13 | 3.67 | **3.13 / 3.08** | 4.5 |
| 1440×900 | 9.80 | 9.05 | 11.69 | 9.05 / 9.05 | 4.5 |

(WebKit's column shown; Chromium is within 0.18 at every cell.)

It is A's mechanism a third time. `.hero-intro` is `bottom-0` with `pt-5 pb-16`
and a **fixed 251px height**, while the card's darkening runs to 94% from 36%
*of the card*, which is `dvh`. At 844 the block's top lands at 70% of the card
and takes the ramp near its end; at 664 it lands at **62%**, where the ramp has
not gone as far, and at 553 at 55%. A px block inside a vh ramp, exactly as the
headline is a px stack inside a vh mask. The lede also sits below its `3749c92`
mobile reference of 5.71 at the design height, which predates this run.

**2.20 · Done — and the ramp is registered to the block, not to the card.**

**The measurement that decided the shape.** The lede's worst glyph pixel sits
**191–203px above the card's foot at every height and on every one of the three
slides**. It is one number because `.hero-intro` is `bottom-0` with a fixed
251px height, so the top row of its paragraph is a constant distance from the
bottom of the frame. What carried it ran `to 94% from 36% *of the card*`, and
the card is the viewport — so that row sat at 65.8% of the darkening at 844 and
at **51.0% at 553**. A px block inside a vh ramp, which is §2.17's mechanism a
fourth time and §2.18's correction on a different layer.

It is also the unit the layer *above* it already used. The card's foot dissolve
is `--hero-foot: 280px` and `--hero-foot-arc: 340px`, both measured up from the
base, and the shade is multiplied by them. The mask was on px and the ramp it
multiplies was on a fraction.

**The change is three of the six.** Top stays **78** and mid stays **16** —
neither the hood the nav stands on nor the flat band the photograph lives in
moves:

    from  22%  ->  max(48px, min(22%, calc(100% - 580px)))
    to    36%  ->  max(48px, calc(100% - 580px))
    base  94%  ->  100%

`calc(100% − 580px)` is the whole of it: the fall is anchored to the foot, so
the value under the lede's top row is the same number at 553 as at 844. The
`max(48px, …)` is what keeps the four stops in order on a card too short to
hold both ends — below a 628px window the fall wants to start above the hood,
and floored at 48px the hood still resolves inside the fixed header's own 65px,
so the top stop is 78 at **every** height rather than collapsing. The base goes
to 100 and costs nothing that is painted: those rows are inside `--hero-foot`'s
dissolve, where the picture has already gone to the floor. That is §2.8's
argument for the gains base, on the other frame.

**Measured, worst glyph-core pixel, swept over all three slides**, WebKit /
Chromium — the lede stands on whichever frame is up and the rotation is 4.5s,
so the worst of the three is the number:

| window | before | after | floor |
|---|---|---|---|
| 375×553 — SE | **3.13 / 3.09** | **5.30 / 5.27** | 4.5 |
| 390×664 — bar showing | **3.61 / 3.78** | **5.77 / 5.96** | 4.5 |
| 390×750 — bar collapsed | 4.80 / 4.65 | **6.45 / 6.43** | 4.5 |
| 390×844 — the screen | 5.09 / 5.05 | **6.18 / 6.08** | 4.5 |
| 1440×900 | 9.05 / 9.05 | **9.61 / 9.53** | 4.5 |

Per slide after, WebKit: 5.38 / 5.30 / 6.01 at 553, 5.77 / 5.99 / 6.95 at 664,
6.45 / 6.73 / 7.04 at 750, 6.20 / 6.18 / 9.43 at 844. **Every cell at every
height is a rise**, and the two lowest — the two the item was opened for — clear
the floor by 0.77 and 1.27.

**The full sweep, and it is the cleanest result this file has recorded.** 93
elements over four pages, both reference viewports, 186 measurements, same
instrument as `3749c92`. **Three moved. All three rose. Nothing fell by a
hundredth anywhere on the site:**

| element | before | after | reference |
|---|---|---|---|
| `p` A youth organization… — mobile | 5.60 | **6.77** | 5.71 |
| `p` A youth organization… — desktop | 8.87 | **9.40** | 8.95 |
| `a` About — desktop `/` | 8.07 | 8.10 | 8.12 |

So the hero lede **clears its `3749c92` reference at both viewports for the
first time** — it was under it at the design height before this run, which
§2.20 recorded when it opened the item — and the standing count of elements
below the reference goes 69 → 67. There is nothing to classify against the
three-branch ratchet, because nothing fell. The one element below its floor
anywhere is still FAQ's opening paragraph on mobile at **4.46**, which is below
it at `3749c92` too.

(The sweep's mobile lede figure and the table above it differ because the
instruments differ: the sweep is the ratchet's, unchanged since `3749c92`, and
it takes whichever slide is up; the table pins each slide and reports the worst
of three. Both are recorded and neither is adjusted.)

**What it cost the photograph**, mean luminance of six bands of the expanded
card, slide 1, DPR 2 — this is the honest price and it lands where the defect
was:

| window | 0–15% | 15–35% | 35–55% | 55–70% | 70–85% | 85–100% |
|---|---|---|---|---|---|---|
| 375×553 | **+12.1** | −22.6 | −21.0 | −11.2 | −5.7 | −0.4 |
| 390×664 | **+11.7** | −16.9 | −19.2 | −11.3 | −7.3 | −0.6 |
| 390×750 | 0 | −8.0 | −12.6 | −8.1 | −6.7 | −0.7 |
| 390×844 | 0 | −0.9 | −5.3 | −4.3 | −5.0 | −0.7 |
| 1440×900 | 0 | 0 | −1.6 | −1.7 | −1.1 | −0.2 |

The design height and the desktop are all but untouched — the two viewports the
ramp already fitted pay one to five points out of ninety — and the short
windows, which were the failing ones, pay for their own repair. The **top band
gets brighter** at 553 and 664, because the hood now ends at 84px and 48px
instead of 146px and 122px: more photograph under the chrome, not less.

**The polarisation holds, and it holds by construction.** Nothing about the
crossing changed — it is still two fixed ramps with a boundary travelling
between them over `0.35 → 0.85`, and no value is interpolated at any frame. The
two top stops are **92 → 78** exactly as §2.6 left them, at every height,
because the 48px floor means the hood never collapses; row 0 composited with
`.chrome-shade` is the same 0.969.

**Two falls outside the reference set, recorded rather than hidden.** The
wordmark stands on this ramp too, and where the hood shortens it loses ground:
**10.72 → 8.27 at 553** and **10.96 → 9.92 at 664**. Both are
composition-derived, both clear the 4.5 floor by 3.8 and 5.4, and neither
viewport is in `3749c92`, which is measured at 390×844 and 1440×900 — where the
wordmark is unmoved at 11.41 and 11.17.

**2.21 · One basis for the document, and it is `svh`.** Done, and it is two
changes rather than one — the unit mix was only half of what moved the keys.

**The basis.** *Everything in flow names `svh`.* The hero section, the hero's
own stage box, every content section, every stage marker, the panels' bands:
all of them are the small viewport, which is the one height a phone holds at
both chrome states. **`dvh` survives on exactly two elements, and neither is in
flow**: `PhotoStage`'s fixed layer and the About wall's pinned frame. Their job
is to cover the window, they contribute to no document height and to no key,
and `dvh` is the only unit that answers that job. `lvh` is what an undeclared
box silently gets and is right for nothing.

The hero was the one real question, because it is a ground *and* the first term
of every scroll offset under it. It goes to `svh`, and the state it is composed
for is the state `svh` names: the expansion holds the page at scroll 0, iOS
only collapses the URL bar on a scroll the hero is preventing, so **every frame
of the opening plays at 664 and 664 is what `svh` resolves to**. What changes is
after the opening — the hero's foot becomes a fixed document row instead of one
that moves by 86px whenever the bar does.

**The second half, and without it the item does nothing.** A zone is keyed at
`zoneTop + zoneHeight/2 − basis/2`. With every other term on `svh`, a basis of
`innerHeight` puts the toolbar back into all twelve keys on its own: the
document would hold still and the keys would still slide, by **−43** instead of
**+43**. Same magnitude, opposite sign — the unit mix was never the whole
mechanism. `PhotoStage` now reads its basis off a `100svh` probe, falling back
to `innerHeight` where the unit is unknown. The cost is that with the bar
collapsed a zone's middle sits 43px above the window's middle at its own key:
7% of a 500px ramp, constant, against a key that used to move.

**Measured, and the emulator can show this one.** No headless engine has
browser chrome, so the state cannot be *rendered* — but it can be *built*: lay
the document out at 664 while the window is 750, which is what iOS produces
with the bar collapsed. Every `svh` quantity is pinned to 664 by hand; anything
still on `dvh`, `lvh` or bare `vh` resolves at the window, exactly as the device
resolves it. So a key that moves between the two runs is a quantity not on the
basis.

| | bar showing | bar collapsed | delta |
|---|---|---|---|
| before — twelve keys | 0 412 996 1483 1573 1831 2030 2391 2484 2852 3184 3714 | 43 455 1039 1526 1616 1874 2073 2434 2527 2895 3227 3757 | **+43, all twelve** |
| before — document | 4392 | 4478 | +86 |
| after — twelve keys | 0 412 996 1483 1573 1831 2030 2391 2484 2852 3184 3714 | *identical* | **0, all twelve** |
| after — document | 4392 | 4392 | 0 |

Identical in both engines. The +43 reproduces §2.17's arithmetic exactly and it
is now zero.

**The twelve keys, after, at the four heights** — and every one of them is
identical to the value the same build gave before this change, in both engines,
with the document heights (4056 / 4392 / 4650 / 4931) with them:

| key | 375×553 | 390×664 | 390×750 | 390×844 |
|---|---|---|---|---|
| the clearing starts to rise | 0 | 0 | 0 | 0 |
| the clearing is full | 343 | 412 | 465 | 523 |
| the ledger holds it | 830 | 996 | 1125 | 1266 |
| panel 1 takes the frame | 1323 | 1483 | 1612 | 1753 |
| panel 1 quiet | 1414 | 1573 | 1702 | 1843 |
| the road rises | 1693 | 1831 | 1947 | 2074 |
| the road falls | 1859 | 2030 | 2172 | 2327 |
| panel 2 takes the frame | 2230 | 2391 | 2520 | 2661 |
| panel 2 quiet | 2321 | 2484 | 2613 | 2753 |
| the gains ground quiet | 2683 | 2852 | 2981 | 3122 |
| the gains ground full | 2960 | 3184 | 3356 | 3544 |
| the closing | 3434 | 3714 | 3929 | 4164 |

**Nothing else moved, and this was checked by pixels rather than argued.** Full
screenshots of all four pages at seven scroll positions, at 375×553, 390×664,
390×750 and 1440×900, before against after: **0.000% of pixels differ, worst
channel sum 0, on every one of them.** Worst rendered-against-fetched holds at
**0.815** on a phone and no horizontal overflow anywhere; every plate settles on
`scale(1)` at the far end of the page. `verify:text` passes on all four.

**What is not on the basis, and it is deliberate.** The About wall's tiles are
sized in bare `vh`, which is `lvh` — so on a phone they are cut to the *large*
viewport and stand 13% too tall in the small one, and the section's own
`h-[200vh]` pin is 1500px at both chrome states. Neither moves a key, because
`lvh` does not change when the bar does; the wall's geometry and the pin length
are both frozen by this pass, and taking the tiles to `dvh` would resize the
composition §2.5 signed off. It is the one place the single basis is not
applied and it is recorded rather than changed.

**A harness note, because it cost an hour.** The home hero re-pins the page to
scroll 0 until it is fully expanded, so a `window.scrollTo` on that page is
undone on the next frame and a sweep silently measures scroll 0 at every stop —
every plate at opacity 0, every arrival scale stuck at its 1.07 start. The
keyboard escape hatch releases it. Every harness in `design/refs`' history
already did this; the check is now an assertion rather than a convention.

**2.23 · The offer panels on a phone — diagnosis, nothing changed.** Measured
at 375×553, 390×664, 390×750 and 390×844 in both engines. **Every number below
lands within 0.1px and 0.1 of a percentage point between WebKit and Chromium**,
so none of it is an engine difference.

**Where the photograph's height comes from.** `.offer-panel-photo` is
`width: 72%; max-width: 320px; aspect-ratio: 3 / 4` below `md`. The width is
72% of the block's content box — the window less the 32px of `px-4` — and the
height follows from the ratio:

    390 wide -> 0.72 x 358 = 257.8 -> **343.7px**
    375 wide -> 0.72 x 343 = 247.0 -> **329.3px**

The 320px cap never binds below a 476px window. So the first half of the
hypothesis is **confirmed**: the height is a fixed length, derived from a width.

**The second half is wrong, and it is wrong in the direction that matters.**
The band it sits in is not expressed against the viewport either. `min-h-svh`
on the panel's block **never binds on a phone**: the block measures **894.7px**
(Youth Exchanges) and **921.3px** (Training Courses) at 390 wide, and it
measures the same at 553, 600, 664, 700, 750 and 844. The declaration only
takes over above a **950px** window. There is no viewport-relative quantity in
a mobile offer panel at all — head, text, gap, photograph and foot are px and
their sum is px. The panel is a **1.64 / 1.35 / 1.19 / 1.06-screen object** at
553 / 664 / 750 / 844.

**The negative control, both arms.**

| hold | vary | photograph | block | what moves |
|---|---|---|---|---|
| width 390 | height 553 → 950 | **343.7px at every height** | **894.7px at every height** | nothing |
| height 664 | width 320 → 430 | 276.5 → 314.9 → 329.3 → 343.7 → 366.7 → **382.1** | 880.6 → 917.8 | everything |

**The overflow tracks width, not height.** Say it plainly: the object does not
change when the window's height changes. What changes is how far out of the
window it sticks — 317.7px of overflow at 553 falling to 0 at 950, with the
photograph and the panel byte-identical throughout. The window is the only
thing moving.

**Rendered top and bottom of the photograph, as a share of the window**, framed
the way the reader meets it — the panel's block starting at the top of the
screen, and **measured after the panel's entrance has run out**. A rect
includes transforms and `.offer-panel-photo` carries the entrance's
`translate: 0 40px` until the block is crossed, so a reading taken at scroll 0
puts every one of these 40px low:

| window | panel | photo top | photo bottom | overflow | centred overflow |
|---|---|---|---|---|---|
| 375×553 | Youth Exchanges | **92.9%** | 152.4% | **289.9px** | 112.9px |
| 375×553 | Training Courses | **92.9%** | 152.4% | **289.9px** | 112.9px |
| 390×664 | Youth Exchanges | 73.4% | 125.1% | 166.7px | 51.4px |
| 390×664 | Training Courses | 77.4% | 129.1% | 193.3px | 64.6px |
| 390×750 | Youth Exchanges | 64.9% | 110.8% | 80.7px | 8.4px |
| 390×750 | Training Courses | 68.5% | 114.3% | 107.3px | 21.6px |
| 390×844 | Youth Exchanges | 57.7% | 98.4% | **0** | 0 |
| 390×844 | Training Courses | 60.9% | 101.6% | 13.3px | 0 |

**At 844 the first panel fits and every shorter height fails**, by 81px at 750,
167px at 664 and 290px at 553 — which is why this reads as right at the one
height everything was measured on and as broken at every height the device
produces. The photograph itself is never the thing that does not fit: at 329.3
and 343.7px it is smaller than the shortest window by 224px. What does not fit
is the panel.

**The 128px head is the same class, and it is a constant.** 64px of the block's
`py-16` plus 64px of `.offer-panel-grid`'s `padding-top: 4rem`, identical at
every mobile width and every mobile height:

| window | 375×553 | 390×664 | 390×750 | 390×844 |
|---|---|---|---|---|
| head as a share of the window | **23.1%** | **19.3%** | 17.1% | 15.2% |

**The bands, at 390 wide**, head / text / gap / photograph / foot:
**128 / 311.1 / 48 / 343.7 / 64 = 894.7** and **128 / 337.6 / 48 / 343.7 / 64 =
921.3**. The two panels differ by 26.5px and it is the paragraph, which is
frozen copy. **240px of the panel — 27% of it — is fixed padding and gap.**

**A reader cannot hold the panel on one screen below 750.** From the text
block's top row to the foot of the photograph is **755px at 553 (1.37
screens)**, 743 / 769px at 664 (1.12 / 1.16), 743 / 769 at 750 (0.99 / 1.03)
and 743 / 769 at 844 (0.88 / 0.91). It first fits at 750.

**Desktop is not affected and the reason is worth recording.** `min-h-svh`
binds at every desktop window tested and the overflow is 0 at 1280×900,
1440×900, 1440×700 and 1920×900. The photograph there is
`min(100%, 64.5svh)` of a 29% column, and the *column* binds on any window
wider than about 2.22:1 — so on a desktop too the picture's height is derived
from the window's **width**; the `svh` cap only takes over on a window shorter
than 0.45× its width. The desktop head is larger in absolute terms (283.5 /
252.6 / 134.6 / 159.8px) because `items-center` centres a short block in a tall
one — that space is the centring, not padding.

**The consequence 2.24 has to face, stated here so it is not discovered
twice.** The panel's total height is a px constant, and it is 1.35 screens at
664. Holding that total — which the keys require — means no band inside it can
be made viewport-relative, because the bands sum to the total. The head can be
made small and the picture large; the panel cannot be made to fit a screen
without moving every key below it.

**2.24 · The head goes into the picture, and the total does not move.** Done.

**The construction, and it is one identity.** A panel's total height is the
first term of every key below it, so what one band gives up another has to take
— exactly, at both device widths, or the shorter phone's panel comes out short
and takes the twelve keys with it. The head is now a **proportion of the
panel's own width**, which is the quantity everything else in a stacked panel
is already derived from, and the picture takes what it gives up:

    .offer-panel-grid   padding-top: 4rem      ->  20%
    the block           px-4 py-16             ->  px-4 pb-16
    .offer-panel-photo  width: 72%             ->  calc(57% + 96px)
                        max-width: 320px       ->  349px

At 3:4 a picture takes 4/3 of what it is given in width, so **96px of width is
the 128px the head loses**, and the two cancel at every width by construction:
71.6 against 400.1 at 390, 68.6 against 388.7 at 375. That is why the 96 is a
length and not a share — the head's loss is a constant, and a pure percentage
would gain a different number at each width and only cancel at one of them.

**Measured. Nothing moved that was not meant to:**

| | before | after |
|---|---|---|
| panel head | **128px** flat | **71.6px** at 390, 68.6 at 375 |
| head as a share of the window, 553 / 664 / 750 / 844 | 23.1 / 19.3 / 17.1 / 15.2% | **12.4 / 10.8 / 9.5 / 8.5%** |
| photograph, 390 wide | 257.8 × 343.7 | **300.0 × 400.1** |
| photograph as a share of the window, 553 / 664 / 750 / 844 | 59.5 / 51.8 / 45.8 / 40.7% | **70.3 / 60.3 / 53.3 / 47.4%** |
| panel block height, 553 / 664 / 750 / 844 | 906.9 / 894.7 / 921.3 / 894.7 | **identical** |
| document height, four heights | 4056 / 4392 / 4650 / 4931 | **identical** |
| all twelve keys, four heights, both engines | — | **identical** |
| About's document and its three scene heights | 4360 / 4683 / 5223 / 5728 | **identical** |

The head is cut by **44%** and the picture is **16% taller**; the panel, the
document and every key are the same number they were. About's story scenes
share these bands and the same identity holds there, so that page does not move
either — checked, not assumed.

**The crop does not move, so the whole-subject rule is untouched.**
`aspect-ratio: 3 / 4` and the frame's `object-position` are unchanged; the
picture is the same rectangle of the same photograph, painted larger. There is
nothing to re-audit and nothing is cut through a person at 553 or anywhere
else. Rendered-against-fetched rises **0.72–0.84 → 0.85–0.95** and stays under
1.0 at every width, because `sizes` was rewritten to the painted width —
`calc(57vw + 78px)`, which is what `calc(57% + 96px)` of a box inset 16px each
side resolves to. A flat `72vw` would have under-declared it by five points and
the browser would have taken a rung below what it paints.

**What it does not fix, and the arithmetic is in §2.23.** The photograph's
bottom edge is pinned by the frozen total and the 64px foot, so **the overflow
at the panel's own framing is unchanged to the pixel** — 289.9 / 166.7 / 80.7 /
0px at 553 / 664 / 750 / 844. The picture starts higher (92.9% → 82.1% of the
window at 553, 73.4% → 64.9% at 664) and it is wholly visible on every screen
the device makes, with 164 / 264 / 350 / 444px to spare. But the panel is still
1.64 / 1.35 / 1.19 / 1.06 screens, and it cannot be less while its total is
frozen. **That is the decision left for Andreas**: a panel that fits one screen
costs the four transitions §2.2–§2.5 tuned, and this pass will not spend them
without being told to.

**Contrast, at all four heights.** **No element on the home page is below its
floor at 375×553, 390×664, 390×750 or 390×844**, and none is on any page at
1440×900. The panel prose the item names measures **5.99 / 5.47 / 4.89 / 5.28**
at the four heights against the 5.07 §2.7 left at the design height, so it does
not fall.

**On the falls the sweep reports, and this is the more useful finding.** The
element-relative sweep takes eight stops across each element's own traversal.
Move an element 56px inside its section and those eight stops land at different
absolute scrolls, so the ground under them changes and the *sampled* worst
moves — without the *true* worst moving at all. Stepped at **5px** across the
whole traversal instead, on both builds:

| element | 8-stop sweep | true worst, 5px step | floor |
|---|---|---|---|
| `span` Open to educators… (the panel prose) | 5.76 → 5.28 | **4.66 → 4.62** | 4.5 |
| `h3` Training Courses | 5.74 → 4.90 | **4.22 → 3.78** | 3.0 |
| `span` No prior experience needed. @553 | 13.51 → 8.34 | **9.56 → 8.47** | 4.5 |
| `span` ArtiCYa focuses particularly… (About) | 10.82 → 9.17 | **9.14 → 9.07** | 4.5 |
| `span` actively supporting LGBTQ+… (About) | 10.12 → 8.60 | **8.60 → 8.60** | 4.5 |
| `span` ArtiCYa places special emphasis… (About) | 9.39 → 8.60 | **8.60 → 8.70** | 4.5 |

**All eight of About's reported falls are sampling, not ground** — the true
worst is unmoved to a tenth. Two of home's are real and both are
composition-derived: the text sits 56px higher in the panel, so it crosses the
road passage at a brighter phase. Neither is near its floor.

**The trade was searched rather than guessed.** The head and the picture move
one pixel for one pixel, so the family is one number — the head's share A, with
the picture at `(0.96 − A) × ¾ × width + 96px`. Measured at 5px on the panel
prose: A = 0.20 gives 4.62, A = 0.24 gives 4.66, A = 0.28 gives 4.66. The
deepest cut costs **0.04**, and the head at A = 0.28 would come out at 100px,
which is a 22% cut nobody would see. A = 0.20 is taken for that reason and the
table is here so the trade can be reversed on one number.

**A note for the next sweep, and it belongs beside the ratchet.** A fall the
element-relative sweep reports on an element that has *moved inside its
section* has to be confirmed at fine resolution before it is treated as a
regression — the instrument resamples. Five of the six checked above were
sampling. This is the same class as the population branch: the measurement
changed, the page did not.

**2.22 · The five transitions at the heights that exist — diagnosis, nothing
retuned.** Scanned frame by frame at a 14px step across the whole of home and
the whole of the About finale, at **390×664, 390×750 and 390×844**, on the
build these items leave. Contact sheets, ten frames across each transition's
own range, are in `design/refs/transitions/after-real/`. **The ranges are
derived from the twelve keys at the height being shot**, not carried over from
844 — a key is a different scroll offset at every height, and a fixed window
would frame a different part of the move at each one.

**A correction to the instrument first, because it changes the numbers.** The
2.0-era probe reads a plate's `opacity`. Since the wipe landed that is binary
by construction — `PhotoStage` writes `opacity: 1` for any strength above zero
and puts the ramp in the layer's **mask** — so a plate's strength is recovered
from the mask's own stops here (`s = clear / 140`). The same probe also read
the finale tiles' ratio off the box rather than off the painted rectangle: a
3:4 frame in a taller box is fitted by *height*, so it paints wider than its
box, and that painted width is what §2.14's audit measured and what `sizes`
declares. Corrected, the centre tile comes out at **0.771 at 390×844 DPR 3**,
which is §2.14's number exactly.

**A · the hero opening — does not degrade.** It is wheel-driven with `scrollY`
pinned at 0, so its range is in wheel and is the same at every height:
**0–1600**, full-bleed at 160, the land layer out at 400, the intro up at 1120,
the card's cross-dissolve spanning 320 of wheel, **stall 0** at all three. Peak
card 390px — the window — at all three.

**B · the clearing's rise — does not degrade, and it is the only one of the
five that cannot.** Key to key it runs scroll 0 to the clearing-full key:
**412 / 465 / 523px = 0.620 of a viewport at every height**, because both ends
are `svh`. The visible ramp (strength 0.02 → 0.98) is 294 / 336 / 364px. Stall
0 everywhere.

**C · the road — slows, and it slows away from the defect it was built to
fix.** Key to key, rise / hold / fall:

| window | rise | hold | fall |
|---|---|---|---|
| 390×664 | 258px — **0.389** | 199px — 0.300 | 361px — **0.544** |
| 390×750 | 245px — 0.327 | 225px — 0.300 | 348px — 0.464 |
| 390×844 | 231px — 0.274 | 253px — 0.300 | 334px — 0.396 |

The **hold is exactly 0.300 of a viewport at every height** — the two markers
are `±15svh` of a zero-height div, and 30svh is 0.300 of the window by
construction. The rise and the fall are key-to-key spans that mix the panels'
px against `svh` markers, so as a share of the screen they grow as the window
shortens: the rise is **42% longer** at 664 than at 844 and the fall **37%
longer**. §2.3's complaint was that the rise was 90px — a tenth of a viewport,
inside one notch of a wheel. At 664 it is 258px and 0.389 of a viewport, which
is further from that failure rather than nearer. Stall 0 at all three, and
plate 0 and plate 1 are never both showing, so the ledger stays polarised.

**D · the handover into the panels — this is the one that degrades.** The fall
runs from the ledger's key to the first panel's key, and that distance is
**487px at every height**, because both keys sit inside the panels' px-built
block. As a share of the screen:

| window | fall | share of the screen |
|---|---|---|
| 390×664 | 487px | **0.733** |
| 390×750 | 487px | 0.649 |
| 390×844 | 487px | 0.577 — the value it was signed off at |

So the passage where the photograph withdraws through the top and the panels'
dark comes up from the foot takes **nearly three quarters of a screen at 664**
against the 0.577 §2.4 measured. Nothing about the move is wrong — the largest
one-step change in plate strength is **0.082 per 14px step at all three
heights**, so §2.4's 87.9%-of-the-window-in-one-step defect is closed
everywhere, and the stall is 0. What is wrong is the pace, and the cause is
§2.23's: the only span on this stretch that is not viewport-relative is the one
the panels own.

**E · the About wall — does not degrade, and at 664 it improves.** Peak scale
**2.60**, the ring at **1.000**, and **coverage 100% at the peak**, at all three
heights; full coverage is reached with 19–25% of the rise still to run. The
centre tile's visible rise is 280 / 322 / 364px — 0.42 / 0.43 / 0.43 of a
viewport, the same fraction at each. Stall **0 / 14 / 14px**, one sampling step.
Rendered-against-fetched at DPR 3, per tile, worst frame:

| tile | 390×664 | 390×750 | 390×844 |
|---|---|---|---|
| centre — `IMG_4585` at 2.60 | 0.607 | 0.685 | 0.771 |
| upper-left — `IMG_4619-ridge` | 0.592 | 0.669 | 0.753 |
| left upright — `IMG_4599` | 0.567 | 0.641 | 0.720 |
| **right upright — `hero-2`** | 0.776 | 0.878 | **0.987** |
| lower-right — `hero-3` | 0.667 | 0.753 | 0.847 |
| lower-left — `IMG_4735-road` | 0.657 | 0.742 | 0.836 |
| upper-right — `hero-1` | 0.703 | 0.794 | 0.894 |

Every tile is sized in `vh`, so every one of them shrinks with the window and
the whole wall gets *more* resolution at a shorter height, not less. **The
finding here is at 844 rather than below it**: `hero-2` in the 97.5px upright
slot paints at **0.987** of the variant it fetches — one percent under the
ceiling, on the frame §8 already carries as the one at three placements.
§2.14's audit measured the centre tile only, so this had not been seen. On the
device it is the 750 column that binds, because the wall's `vh` is the *large*
viewport at both chrome states (see §2.21), and there it is 0.878.

**The damage list, in order.** **D** is the one that degrades: same 487px, 27%
more of the screen at 664. **C** slows by 37–42% as a share of the screen, in
the direction away from its own defect. **A**, **B** and **E** hold, and E
improves. Nothing is retuned here.

**2.26 · Every Section 2 span is a share of the window.** Done, and it is the
marker layout rather than the values: nine of the eleven spans hold one share
at all four heights, and the two that cannot are named below with the reason.

**What the keys used to be anchored to.** Twelve keys, three anchoring schemes.
Three of them were already `svh` offsets inside the clearing. Four were a
*section's own height*: a zone is keyed at its middle, so the panel's "takes
the frame" key was half the panel, its "quiet" key was 60% of it, the gains
key was half that section and the closing key was half of *its* — and on a
phone a stacked panel's height is a stack of px and the closing's is 395px of
padding and three blocks of type. Two more, the road's, were written in `svh`
but anchored to the join, which is the panel above measured from its own top.

So the eleven spans divided into five that held a constant share and six that
did not. Measured before, at 553 / 664 / 750 / 844:

| span | 553 | 664 | 750 | 844 | swing |
|---|---|---|---|---|---|
| the clearing's rise | 0.620 | 0.620 | 0.620 | 0.620 | — |
| the ledger's hold | 0.881 | 0.880 | 0.880 | 0.880 | — |
| **the handover into the panels** | **0.892** | **0.733** | **0.649** | **0.577** | **0.314** |
| panel 1 take → quiet | 0.165 | 0.136 | 0.120 | 0.107 | 0.058 |
| **the road's rise** | **0.505** | **0.389** | **0.327** | **0.274** | **0.231** |
| the road's hold | 0.300 | 0.300 | 0.300 | 0.300 | — |
| **the road's fall** | **0.671** | **0.544** | **0.464** | **0.396** | **0.275** |
| panel 2 take → quiet | 0.165 | 0.140 | 0.124 | 0.109 | 0.056 |
| **panel 2 quiet → the gains** | **0.655** | **0.554** | **0.491** | **0.437** | **0.217** |
| the gains' rise | 0.501 | 0.500 | 0.500 | 0.500 | — |
| the run out to the closing | 0.857 | 0.798 | 0.764 | 0.735 | 0.123 |

**Every key is now declared, and declared in `svh` off the thing it belongs
to.** The panel's four keys are `svh` offsets from the panel's own top row —
`66svh` for the frame, `74svh` for quiet, and the road's own key inside the
panel it starts in (`98svh` in the first, `30svh` in the second) rather than at
the join. The gains and the closing carry a marker apiece instead of being
keyed off their section's height. The clearing's third marker goes from
`bottom-0` to `top-[100svh]`: the two resolve to the same row, because that
block measures exactly a screen at all four heights, but one of them says so.
The margin above the panels goes `mt-10` → `mt-[6svh]`, since it is the first
term of the handover below it — 40px flat was 6.0% of a 664 screen and 4.7% of
an 844 one, and `6svh` is 6.0% of both. Desktop takes `10svh`, 90px against the
96 it replaces, inside a head the panel's own centring already makes 250px
deep.

**Two spans cannot be made a share, and it is worth stating exactly why.** A
span that starts inside one panel and ends inside the next *is* the panel's own
height, and no expression makes that a share of the window while it exceeds
one. What can be chosen is which two spans carry it — and both of the two are
**holds**, the road's full hold and the quiet run from the second panel to the
gains. A hold is a still frame: its length changing with the window is not a
change of pace. A ramp's length is exactly what pace means, and no ramp carries
px now.

**The values, re-picked at 664 and stated in both units before they were
written.** The share is the declaration; the px are what it resolves to.

| span | share | 553 | 664 | 750 | 844 | was, at 664 |
|---|---|---|---|---|---|---|
| the clearing's rise | 0.620 | 343 | 412 | 465 | 523 | 412 |
| the ledger's hold | 0.880 | 487 | 584 | 660 | 743 | 584 |
| the handover into the panels | **0.720** | 398 | 478 | 540 | 608 | 487 |
| panel 1 take → quiet | **0.080** | 44 | 53 | 60 | 67 | 90 |
| the road's rise | **0.240** | 133 | 160 | 180 | 203 | 258 |
| the road's hold | *see below* | 530 | 443 | 385 | 321 | 199 |
| the road's fall | **0.360** | 200 | 239 | 270 | 303 | 361 |
| panel 2 take → quiet | **0.080** | 44 | 53 | 60 | 68 | 93 |
| panel 2 quiet → the gains | *see below* | 497 | 430 | 366 | 297 | 368 |
| the gains' rise | 0.500 | 277 | 332 | 375 | 422 | 332 |
| the run out to the closing | **0.750** | 415 | 498 | 563 | 633 | 530 |

Measured after: **every one of the nine declared spans holds its share to
0.003 at all four heights and in both engines**, and the twelve keys are
identical in WebKit and Chromium to within 1px. Document heights move by 7px or
less — 4056 → 4049, 4392 → 4391, 4650 → 4655, 4931 → 4942.

**Where each number came from.** The clearing's rise and the ledger's hold were
already shares and were re-examined at 664 rather than re-chosen: §2.2 picked
0.62 against *the strip the hero's foot has uncovered*, which is a share of the
window at every height, so the original choice was already the right kind of
number. The handover is **0.720**, which resolves to 478px at 664 against the
487 it ran — the finding being that the px value was very nearly right at the
height the device produces and wrong at the two ends of the range, so 844's
0.577 was the mis-tuned number rather than the 487. The road keeps §2.3's
shape, 0.25 / 0.30 / 0.35 on a desktop, at **0.240 / 0.320 / 0.360** — measured
on the built page the desktop pass is now 216 / 288 / 324 against the 225 / 270
/ 315 it was signed off at. The run out to the closing is **0.750**, the figure
§2.14 recorded on a phone, against 0.857 at 553 and 0.735 at 844.

**The desktop is on the same basis and this is the first time it has been.**
All eleven spans at 1440×900: 0.62, 0.88, 0.76, 0.08, 0.24, 0.32, 0.36, 0.08,
0.26, 0.50, 0.75. The handover is 0.76 rather than 0.72 because the desktop
margin is `10svh`.

**The constraint checks.** No ramp is over 1.0 viewport. Text entrances are
untouched — nothing here is keyed to a clock. The stall is measured on the
build §2.27 leaves, because the road's hold moves again there.

**D's ground still outlasts the numerals, and there is a finding under it.**
The ledger's last row leaves the top of the window, and the ground is still a
photograph for that long after it:

| | 553 | 664 | 750 | 844 | 1440×900 |
|---|---|---|---|---|---|
| before — px after the row leaves | 248 | 242 | 242 | 242 | 256 |
| before — plate strength at the leave | 0.509 | 0.491 | 0.491 | 0.491 | 0.412 |
| after — px | 153 | 233 | 295 | 363 | 394 |
| after — plate strength at the leave | **0.227** | 0.463 | 0.626 | 0.738 | 0.695 |

The relationship used to be constant and is now a function of the height, and
the reason is §2.21's mechanism one level further down: **the row's leave point
is a px constant measured from the fall's start.** The clearing's block is a
screen tall with its content centred, so the last row's bottom sits half the
*content's* height below the block's middle — and that content is a heading, a
lede and three ledger rows, every one of them a fixed size. Measured, the row
leaves 245–250px after the fall begins at every height. A fall expressed as a
share therefore holds a different fraction of itself against that constant at
each one. It is a real cost of the change and it lands at 553, where the plate
is at 0.227 rather than 0.509 when the last numeral clears the top of the
window. It is still a photograph and the numeral is still standing on it; what
was bought is a fall that runs at one pace.

**Three of these keys moved again under §2.27, for a contrast reason, and that
item carries the final table.**

**2.27 · The panel is one screen and the photograph is whole in it.** Done, and
the diagnosis first, because Andreas's complaint had two possible causes and
only one of them was true.

**The photograph is not clipped. It is below the fold.** Every ancestor of
`.offer-panel-photo` that could cut it was walked and measured, at all four
heights and in both engines, with the entrance's `translate: 0 40px` forced to
its end state — a rect read before that entrance fires puts the picture 40px
low, which is the trap §2.23 recorded and which this pass fell into once before
catching it. **Nothing cuts the box at any height.** What was true is that with
the panel's head at the top of the window the picture's foot ran past the
bottom of it:

| with the head at the window top | 553 | 664 | 750 | 844 |
|---|---|---|---|---|
| Youth Exchanges — past the fold | **289.9px** | **166.7px** | **80.7px** | 0 |
| Training Courses — past the fold | **289.9px** | **193.3px** | **107.3px** | **13.3px** |

Both engines agree to 0.1px, and the figures reproduce §2.24's to the pixel. So
the fix is the panel's height, not a clip and not the crop.

**Every band is now a share of the window, and the paragraph is the ceiling.**
The head was 20% of the panel's *width* and the gap 3rem, the foot 64px, and
the picture's height came from its width through `aspect-ratio` — four lengths
in a box that had to fit a screen. They are `3svh` / `3svh` / `3svh` and a
picture `27svh` wide, which at 3:4 is `36svh` tall. That is 0.45 of the window,
and what fills the rest is the paragraph: **337.6px of frozen copy at a reading
size that does not scale, 50.8% of a 664 screen.** The picture gets what is
left, which is why it is 179px wide at 664 and not 300 — the arithmetic is
forced, and it is the price of the requirement rather than a preference.

**Measured, at 390 wide unless stated:**

| | before | after |
|---|---|---|
| head | 71.6px flat | `3svh` — 16.6 / 19.9 / 22.5 / 25.3 |
| head as a share of the window | 12.4 / 10.8 / 9.5 / 8.5% | **3.0% at all four** |
| gap | 48px flat | `3svh` |
| foot | 64px flat | `3svh` |
| photograph | 300 × 400.1 at every height | **149.3×199.1 / 179.3×239 / 202.5×270 / 227.9×303.8** |
| photograph as a share of the window | 70.3 / 60.3 / 53.3 / 47.4% | **36.0% at all four** |
| panel block, 553 / 664 / 750 / 844 | 906.9 / 894.7–921.3 / 894.7–921.3 / 894.7–921.3 | **586.4 / 664 / 750 / 844** |
| panel in screens | 1.64 / 1.35–1.39 / 1.19–1.23 / 1.06–1.09 | **1.06 / 1.00 / 1.00 / 1.00** |

**`min-h-svh` binds on a phone for the first time.** The panel's content is
636px at 664 against a 664 window, so the block is exactly a screen and the
composition centres inside it with 14px above and below — which is what the
head's original `4rem` was written to correct for and had never once done,
because the block had never once fitted. At 553 the content is 586.4px and the
screen is 553, so there the block is still its content.

**The overflow after, with the head at the window top:**

| | 553 | 664 | 750 | 844 |
|---|---|---|---|---|
| Youth Exchanges | **16.8px over** | 47px clear | 73.2 clear | 101.9 clear |
| Training Courses | **16.8px over** | **33.7px clear** | 59.9 clear | 88.6 clear |

So the whole photograph is on the screen with the head at the top at 664, 750
and 844, and at 553 it is 16.8px short — 3% of that window, against the 289.9px
it was. Identical in both engines to 0.1px.

**The 3:4 aspect and the whole-subject rule are untouched.** `aspect-ratio: 3 /
4` and the frame's `object-position` are unchanged, so the visible rectangle is
the same rectangle of the same photograph, painted smaller. No band was
re-cropped and nothing is cut through a person at 553 or anywhere else — there
was nothing to re-audit, which is the same argument §2.24 made in the other
direction.

**No head space grows as a share of a shorter screen.** The head, the gap and
the foot are 3.0% of the window at 553, 664, 750 and 844. Before, the head
alone ran from 8.5% to 12.4% as the screen shortened.

**The one thing this costs, stated plainly because it is a decision rather than
a defect.** The old 71.6px head cleared the fixed header's 64px at every
height; the new one does not at the two shortest. With the block's top row at
the top of the window, measured on the built page:

| | header | eyebrow | title | prose |
|---|---|---|---|---|
| before, 553 | 64 | 68.6 | 105.8 | 193.9 |
| before, 664 / 750 / 844 | 64 | 71.6 | 108.8 | 196.9 |
| after, 553 | 64 | **16.6** | **53.8** | 141.9 |
| after, 664 | 64 | **47.0** | 84.2 | 172.3 |
| after, 750 | 64 | 73.2 | 110.4 | 198.5 |
| after, 844 | 64 | 101.9 | 139.1 | 227.2 |

So at **664 the eyebrow row sits 17px inside the header's band** and the title
clears it by 20; at **553 the eyebrow and the title's top row are both inside
it**. At 750 and 844 everything clears. The eyebrow is a mark rather than a
string — `aria-hidden` pseudo-content, outside the frozen copy and outside the
contrast sweep — and the chrome carries no fill, only a darkening the cream ink
reads better on. The page also passes every other block under that bar as it
scrolls, and the clearing's own centred block does the same thing at 553.

**The lever, priced, so it can be pulled on one number.** The eyebrow's row is
the head plus half the block's centring slack, and the slack falls by half of
whatever the head takes — so a pixel on the eyebrow costs two on the head, and
the head can only take them from the picture, since the total is what has to
stay inside a screen. Clearing 64px at 664 wants the head at **8svh** against
3, which takes **34px off the picture's height and 14% off its width** — 179.3
→ 153.8 at 664. It is not spent here: Andreas's constraint is that the head
must not grow as a share of a shorter screen, and the item is the photograph.
A `max(3svh, 68px)` floor would clear the bar at every height and would break
that constraint exactly — 12.3% of a 553 screen against 8.1% of an 844 one.

**The twelve keys, after, at all four heights** — identical in WebKit and
Chromium to 1px:

| key | 553 | 664 | 750 | 844 |
|---|---|---|---|---|
| the clearing starts to rise | 0 | 0 | 0 | 0 |
| the clearing is full | 343 | 412 | 465 | 523 |
| the ledger holds it | 830 | 996 | 1125 | 1266 |
| panel 1 takes the frame | 1228 | 1474 | 1665 | 1874 |
| panel 1 quiet | 1261 | 1514 | 1710 | 1924 |
| the road rises | 1394 | 1673 | 1890 | 2127 |
| the road falls | 1532 | 1799 | 2033 | 2287 |
| panel 2 takes the frame | 1726 | 2032 | 2295 | 2583 |
| panel 2 quiet | 1847 | 2178 | 2460 | 2768 |
| the gains ground quiet | 2036 | 2364 | 2670 | 3005 |
| the gains ground full | 2312 | 2696 | 3045 | 3427 |
| the closing | 2727 | 3194 | 3608 | 4060 |

**And the eleven spans, which is what §2.26 asked for.** Nine hold their share
to 0.002 at all four heights; the two holds carry the panels' overflow at 553
and only at 553:

| span | share | 553 | 664 | 750 | 844 | swing |
|---|---|---|---|---|---|---|
| the clearing's rise | 0.620 | 343 | 412 | 465 | 523 | 0.001 |
| the ledger's hold | 0.880 | 487 | 584 | 660 | 743 | 0.001 |
| the handover into the panels | 0.720 | 398 | 478 | 540 | 608 | 0.001 |
| panel 1 take → quiet | 0.060 | 33 | 40 | 45 | 50 | 0.001 |
| the road's rise | 0.240 | 133 | 159 | 180 | 203 | 0.001 |
| **the road's hold** | 0.190 | **138 — 0.250** | 126 | 143 | 160 | **0.060** |
| the road's fall | 0.350 | 194 | 233 | 262 | 296 | 0.002 |
| panel 2 take → quiet | 0.220 | 121 | 146 | 165 | 185 | 0.001 |
| **panel 2 quiet → the gains** | 0.280 | **189 — 0.342** | 186 | 210 | 237 | **0.062** |
| the gains' rise | 0.500 | 276 | 332 | 375 | 422 | 0.001 |
| the run out to the closing | 0.750 | 415 | 498 | 563 | 633 | 0.001 |

Document heights: **4056 → 3409, 4392 → 3903, 4650 → 4339, 4931 → 4814**, and
the desktop 5254 → 5248. About's shorter scenes fit `min-h-svh` at *every*
height including 553, so all three of its scenes are exactly one screen and its
document goes 4360 → 3466, 4683 → 4132, 4941 → 4648, 5223 → 5212.

**Three keys moved after §2.26 landed, and the reason is the finding of this
pass.** §2.26 gave both panels the same first key at `66svh`, on the reading
that "the panel takes the frame" is one thing. It is two. The first panel's key
is where the *clearing's* photograph finishes leaving and it has to outlast the
ledger's last numeral, so it is late. The second panel's key is where the *road*
finishes leaving and it has to be gone before the panel's own prose is read, so
it is early. Held at one number, the second panel's prose lost 0.26 to 0.63 of
contrast on a desktop. Split — **66% on the first panel, 50% on the second**,
with the road's own two markers moved to 96% and 15% to keep its shape — all
three of those readings come back to the hundredth.

**Contrast, and the instrument is half the story.** Two full sweeps: the
canonical one at 1440×900 and 390×844 (186 measurements) and a second at 553,
664 and 750 (257 measurements). **No element on any page at any of the five
viewports is below its floor except FAQ's opening paragraph, which is below it
on the before build too and below it at `3749c92`.** Nothing else breaches
anything.

The eight-stop sweep reports large falls that are not falls. It samples each
element at fixed fractions of its own traversal, and this pass shortens the
document by 300–650px, so every element lands at different absolute scrolls —
the ground under the sampled frame changes while the element's own worst frame
does not. Stepped at 6px across the whole traversal, on both builds:

| element | viewport | before | after | floor |
|---|---|---|---|---|
| `span` Professional development… (panel 2) | 1440×900 | **4.34** | **4.34** | 4.5 |
| `span` Focused on skill-building… (panel 2) | 1440×900 | 4.72 | 4.72 | 4.5 |
| `span` Open to educators… (panel 2) | 1440×900 | 4.95 | 4.95 | 4.5 |
| `span` Participate through workshops… (panel 1) | 1440×900 | **3.76** | **4.04** | 4.5 |
| `span` International group experiences… (panel 1) | 1440×900 | **3.77** | **8.25** | 4.5 |
| `p` Your adventure starts here. | 1440×900 | 4.19 | 4.27 | 3 |
| `span` Open to educators… | 390×664 | 4.54 | 4.58 | 4.5 |
| `span` Professional development… | 390×664 | 4.58 | 4.58 | 4.5 |
| `span` Focused on skill-building… | 390×664 | 4.54 | 4.54 | 4.5 |
| `p` Your adventure starts here. | 390×664 | 3.50 | 3.57 | 3 |
| `p` Your adventure starts here. | 390×750 | 3.35 | 3.40 | 3 |

**Not one of them falls.** Six are identical, five rise, and the two that rise
most are the first panel's prose, which gains from the later handover key. So
there is nothing to classify against the three-branch ratchet: no
composition-derived fall, no resolution-derived fall, and the eight-stop
sweep's apparent falls are the fourth thing — the instrument resampling a
document that got shorter. The panel prose §2.7 left at 5.07 does not fall; at
the sampler's own resolution it reads **5.81 / 5.37 / 5.33** at 553 / 664 / 750.

**A pre-existing breach the canonical sweep has never caught, recorded and not
fixed here.** At a 6px step, **five of the six desktop panel elements have a
true worst under 5.0 and three of them were under the 4.5 floor on the build
this pass started from** — 4.34, 3.76 and 3.77. The eight-stop sweep reports
those same three at 5.38, 9.40 and 9.02, because its eight stops never once
land where the road is strongest under them. After this pass two are still
under: 4.34 and 4.04. **They are below the floor before and after, this pass
does not deepen either, and repairing them is a plate-strength question on the
road rather than a key position** — which makes it an item, not a line in this
one. It belongs beside §2.8's standing conflict.

**The rest of the verification.** `verify:text` **PASS on all four pages** —
home 1303, about 1599, contact 277, faq 1993 characters, on a clean
`rm -rf .next out` production build. Stall scanned frame by frame at one
sampling step across the whole of home: **0px at 553, 664, 750 and 844** on all
four of its transitions, and the About wall's is 12 / 0 / 14 / 14, one step,
exactly where §2.22 left it. The wall is otherwise untouched — peak scale
**2.60**, the ring at **1.000**, coverage **100%** at the peak with 19–25% of
the rise still to run, at every height. Plate 0 and plate 1 are never both
showing at any frame, so the polarised ledger holds; the largest one-step change
in plate strength anywhere is **0.086**. No horizontal overflow at any
viewport. Rendered-against-fetched on home improves — the panel photograph drops
from the 1024 rung to 640 (844 takes 768) and paints at 0.70 / 0.84 / 0.95 /
0.89 of what it fetches, and the worst figure anywhere on the page goes 0.9 →
0.8 at 553 and 664. The desktop's 2.0 is `hero-2` full-bleed, the carried item,
unchanged.

**Contact sheets re-rendered** at 390×664 and 390×750 into
`design/refs/transitions/after-real/`, all five transitions, ten frames each,
every window derived from the twelve keys at the height being shot. They show
the build both items leave rather than §2.26's intermediate — that state was
superseded within the hour and shooting it twice would have recorded a page
that never shipped.

**What still requires the device.** Everything in §2.19's list, unchanged: no
headless engine has browser chrome, so none of them can produce the state where
`svh`, `lvh` and `dvh` differ. This pass is legible in the declarations and
verified to hold at 553, 664, 750 and 844 in both engines, but **that the panel
fits the phone at both chrome states, and that the photograph is whole in it,
has to be confirmed on the phone.**

---

## 3 · Titles

**3.1 · Contact and About headings are too large.**
The FAQ heading was brought down and is now correct. Match Contact and About to
it.

---

## 4 · About

**4.1 · The page needs a photographic ground that moves.** The wall is rebuilt
as A1 Keystone — §7. Five frames, the fifth set into the junction of the other
four, and the wall carries its own out-of-focus ground so there is no frame of
the assembly with page ground showing through it.

**4.2 · `ART-DIRECTION.md §6` applies here in full.**
One photograph treated two ways, type bound into the picture's depth, an organic
edge, a title that becomes a label, a deliberate seam. That is the standard for
this page.

**4.3 · The wall's side tiles — diagnostic only, nothing changed.** Closed. The
two 25×40 side tiles are gone with the seven-slot arrangement; the diagnosis
below is kept because it is what the rebuild was measured against. §7.1 has the
bare-ground figures on the built wall — 0.00% at every frame from the pin
onward, at five viewports, against the 6.0% / 20.3% recorded here.

> Andreas, on the About wall: the side tiles read wrong in both states —
> too small while they grow, too cut once they hold. The slot geometry is
> the fault, not the motion. Section 4 rebuilds this composition; do not
> patch the positions before then.

*Is the centred-text moment a settled state or a point inside the assembly?*
A point inside it, and there is no frame anywhere in the section where the
words are up and the wall is standing. The paragraph holds full opacity to
**stage 0.620, y3928** at 1440×900 and **stage 0.600, y3556** at 390×844, and
is fully gone at **0.700 / y4086** and **0.680 / y3691**. The ring does not
land until 0.92 / 0.94 — a third of the section after the words have left.
(The centre tile's own arrival was 0.94 / 0.96 when this was written; §2.14
moved it to 0.77 / 0.74, which is why the phone's bare ground through the same
range fell by 3 to 6 points.)

*How much of each side tile is on screen.* The 25vw × 40vh tiles are the second
and third, gathered at ±14vw on a desktop and ±24vw on a phone.

| | slot | at the centred-text moment | at rest |
|---|---|---|---|
| 1440×900 | 360 × 360 | **158.4px of 360 — 44%**, both sides | 360px — **100%**, x 0..360 and 1080..1440 |
| 390×844 | 97.5 × 337.6 | **3.9px of 97.5 — 4%**, both sides | 97.5px — **100%**, x 0..97.5 and 292.5..390 |

So neither tile is clipped at rest: both sit flush to their edge and are
entirely on screen. The two readings are different faults. *Too small while
they grow* is the gather — 56% of each side tile is off the screen on a desktop
and **96% on a phone**, for the whole time the words are up. *Too cut once they
hold* is the slot: 25vw × 40vh is square at 1440×900 and **1:3.46** at 390×844,
a 97px upright on a 390px screen. The motion is not what is wrong on either
count.

*Are the gaps the ones already logged?* The same ones. Bare page ground above
the resting baseline runs **6.0% of the window at stage 0.55 falling to nothing
by 0.88** at 1440×900, and **20.3% falling to nothing by 0.94** at 390×844.
0.75–0.85 is the tail of that range, not a separate defect, and every tile with
ground beside it is one still travelling from its gathered offset.

**4.4 · The rebuild audits every slot, not the one that moves.** Done — §7.2.
Every slot, at rest and at peak, at 553/664/750/844 and 1440×900,
rendered-against-fetched and rendered-against-source: nothing over 1.0, worst
0.965 against the fetched variant and 0.932 against the source. Two findings
came out of it, one of them the preview's own crop and one of them the slot
geometry at short viewports. Carried from §2.22 and not fixed there, because the
wall was being recomposed from the previews in `design/refs/wall/` and auditing
the old composition was wasted work.

**The finding.** `hero-2` in the right upright slot paints at **0.987 of the
variant it fetches** at 390×844 DPR 3 — one percent under the ceiling, on the
one frame `§8` already carries at three placements. It is not the tile that
scales and it is not at peak; that is its number **at rest**. §2.14's audit
measured the centre tile only, across the whole of its rise, and the six of the
ring were dismissed in one line because they hold at 1.000 — but a tile that
never scales still has a slot, and a slot that is a share of the window is a
different number of pixels at every window. Every tile is sized in `vh`, which
on a phone is the *large* viewport at both chrome states, so on the device it
is the 750 column that binds and the number there is 0.878. The full set at
390×844: centre 0.771, upper-left 0.753, left upright 0.720, **right upright
0.987**, lower-right 0.847, lower-left 0.836, upper-right 0.894.

**The requirement, written here so it is not forgotten.** The Section 4 build
audits **every slot of the wall, at rest and at peak, at all four heights and
at DPR 3** — rendered-against-fetched and rendered-against-source, per tile,
per state. A single figure for "the wall" is not an audit of it, and neither is
a figure for the tile that happens to move. The same rule applies to the
pinned frame's own unit: it is `sticky top-0 h-svh`, sized to the small
viewport, so it leaves a band of floor under the wall once the bar collapses —
the mismatch §2.19 recorded and left inside the frozen geometry.

---

## Carried, not yet solved

- **A full-bleed ground needs a source of at least 2880px on the painted
  axis** — 1440 CSS at DPR 2 — and a portrait source cover-fitted into a
  landscape window paints wider than its box, so it needs headroom above that
  again. This is photography, not code: no `sizes` declaration and no ladder
  rung can supply a pixel the file does not contain. **`hero-1` (2048),
  `hero-2` (1536) and `hero-3` (2560) are disqualified from every full-bleed
  placement, permanently.** Measured against the source at rest, with no
  transition running: `/faq/`'s ground is `hero-2` at **1.88 at DPR 2 and 2.81
  at DPR 3** — the worst placement on the site; the home hero's second slide is
  the same frame at the same numbers; its third slide is `hero-3` at 1.51 /
  2.26; and the "What we do" plate is `hero-1` at 1.41 / 2.11. Two more sit
  just over at DPR 3 only and pass at DPR 2: About's `IMG_4721` ground at 1.43
  and home's `IMG_4619-valley` at 1.02.

  Keep the two measurements apart. **Rendered-against-fetched** asks whether
  the browser downloaded enough, and a `sizes` fix always closes it — that is
  what `coverSizes()` did in 1.2 and what 2.5 has now done for the finale.
  **Rendered-against-source** asks whether the pixels exist, and only a
  different photograph closes it.

  **Largely closed on 2026-08-30, and by exactly that route — a different file
  of the same photograph.** `PHOTO-MANIFEST.md` found full-resolution originals
  for all three heroes sitting in the camera roll, and they were ingested.
  `hero-2` is 1536 → 3024 and `hero-1` 2048 → 3024, so rendered-against-source
  at rest now reads:

  | | before | after |
  |---|---|---|
  | `/faq/` ground | 1.88 / 1.24 | **0.95 / 0.63** |
  | home hero slide 2 | 1.93 / 1.27 | **0.98 / 0.65** |
  | "What we do" plate | 1.41 / 1.68 | **0.95 / 1.14** |

  Two things are left of this item and both are named rather than open. "What
  we do" at 390×844 DPR 3 asks for 3434 device px, above the 2880 ladder cap
  *and* above the 3024 the original holds — the same 1440×DPR 3 class this list
  already excludes, met on a phone. And `hero-3` moved the other way, 1.51/2.26
  → **1.72/2.41**, because its master was corrected from 2560 to the 2316 the
  capture actually holds: 244 of those columns were interpolation. Nothing on
  screen got worse; the number stopped flattering it, and no delivery can
  improve that frame.
- ~~**The variant ladder stops 320px short of a retina desktop.**~~ Closed by
  §2.7: one rung at 2880 for the five frames that are painted edge to edge, and
  rendered-against-fetched at rest is 1.00 for all of them at DPR 2. What is
  *not* closed and is not being chased is 1440×DPR 3, which needs 4320 and
  still measures 1.50 — §2.7 excludes it, and a 4320 rung would put 2.5MB of
  AVIF on the LCP.
- **`REFERENCE-LANGUAGE.md §A2`** was corrected after `c61f320` widened the panel
  photograph until it filled the screen. The panels are reopened and awaiting a
  design decision — the geometry underneath them is sound and must not be
  discarded.
- **Landscape sources.** A 3:4 portrait frame full-bleed in a 16:10 window can
  never show more than 47% of its area. About and FAQ need landscape photographs
  to clear the 60% floor. Photography, not code.
- **The set is one frame short.** Thirteen usable photographs; the About page
  alone needs eleven distinct ones. After the three tiles that did not stand on
  their own came out, ten qualified. `hero-2` therefore takes a third placement
  and `IMG_4599` stays on the wall re-cut rather than replaced. Photography.

  The 2026-08-29 delivery adds **three usable frames** — `IMG_3004`, `IMG_2865`,
  `IMG_9087` — taking the set from thirteen to sixteen, and none of them is
  placed yet. It does not close the item, and `PHOTO-MANIFEST.md` §D has the
  arithmetic: all three are 3:4 portrait, and what the About wall is short of is
  *wide* frames. Re-answered against the five-slot arrangements in
  `design/refs/wall/`, the minimum About/Home overlap is **2 tiles** (admitting
  a crop of the marginal `IMG_3005`) or **3 on solid frames alone**, in every
  one of A1, A2 and A3 — forced by the widest slot, which only `IMG_4619-ridge`
  and `hero-3` reach, and both are Home's.
- **The chain-link fence** is still in the road frame. It is crossed rather
  than stopped on now, but it is also why that frame holds no complete subject
  at either viewport: every pan that reaches the landscape reaches the fence,
  and the pan that clears the most of it is road surface. Only a different
  photograph closes it.
- **Overhead cable in `hero-2`**, visible on the home hero's second slide and
  on the FAQ ground. The About tile is cropped clear of it; those two cannot
  be, since both are the whole frame full-bleed.
- **No device testing.** Nothing since the dark world landed has been confirmed
  on a real phone.

---

## The contrast sweep after the photography pass — 2026-08-30

The fourth time sharper photographs have gone under live type, and the first
time the sweep was run as a **controlled before/after** rather than against
`3749c92`. That change of method is the point of this section: forty elements
already sat under the `3749c92` reference before this pass began, so a
comparison against it cannot say what any one change did. The pre-pass commit
`d066c78` was built in a worktree, served on a second port, and swept by the
same harness at the same viewports — so every number below is this pass and
nothing else.

**Method.** Glyph cores on the rendered composite, as `ART-DIRECTION.md` §7
requires: each scroll position screenshotted twice, once as rendered and once
with every glyph painted transparent, the two diffed, and the diff eroded. A
core pixel is one where the rendered value **is the ink the element declares** —
anything else is the antialiased fringe, which is a blend of ink and ground and
belongs to neither. Scoring the fringe is what drops a footer line from 8.6 to
2.5, and it is the trap this harness was rebuilt to avoid. Contrast is WCAG 2.1
between that ink and the blanked pixel under it, minimised across the element's
traversal. Rects are clipped below the chrome ramp (150px desktop, 130px phone)
except for the header's own labels, which are painted *on* that ramp. DPR 2 at
both viewports, matching the reference set. 36 stops per page.

Two things the harness has to do that are worth writing down. The home hero
holds `window.scrollY` at 0 until its card opens — its own scroll handler snaps
it back — so nothing below the hero is reachable until `End` is pressed, which
is the component's keyboard escape hatch. And elements must be re-found at every
stop rather than tagged once, because framer-motion replaces nodes as the page
animates and a marker set at load does not survive.

**Coverage.** 1440×900 and 390×553, 664, 750, 844, in Chromium and WebKit —
ten configurations of the current build, and five of the pre-pass build for the
comparison. 90 elements at 1440×900 and 74 on a phone.

### Result

| configuration | measured | falls | below floor |
|---|---|---|---|
| chromium 1440×900 | 90 | 34 | **0** |
| webkit 1440×900 | 90 | 30 | 3 — see below |
| chromium 390×844 | 74 | 17 | **0** |
| webkit 390×844 | 74 | 13 | **0** |
| both engines, 390×553 and 390×664 | 74 | — | **0** |
| chromium 390×750 | 74 | — | **0** |
| webkit 390×750 | 74 | 11 | 2 — see below |

**No composition-derived fall anywhere, so nothing stops.** The falls are small
and two-sided: at 1440×900, 34 fell and 17 rose in Chromium, 30 fell and 21 rose
in WebKit, and the median fall is under 0.1. The two engines agree to a **mean
|Δ| of 0.110** over 90 elements, which is the strongest evidence in this section
that the instrument is measuring the page rather than the browser.

### The five below-floor readings, each classified

**Two rose into their present state and were already under.** At 1440×900 in
WebKit, `span` "Participate through workshops…" and `span` "Travel,
accommodation and meals are fully covered." read **4.16 → 4.23**. Below 4.5
before this pass and less far below it after. Not a finding of this pass.

**Two did not move at all.** At 390×750 in WebKit, `/contact/`'s `p` "If you are
interested in Erasmus+ opportunities…" reads **4.34 → 4.34** and `span`
"articya4youth@gmail.com" **4.48 → 4.48**, identical to two decimals. The
mechanical proof is stronger than the measurement: at 390×750 DPR 2 that page
asks for 1899 device px and takes the 1920 rung, and
`IMG_4735-road-1920.avif` is **byte-identical between the two builds**. The
entire photographic ground of `/contact/` at that viewport is the same file.
This is a standing WebKit-only breach at one test height, and it is for the next
review rather than for this one.

**One fell, and the reported size of the fall was the sampler.** `span` "Receive
a Youthpass certificate recognizing your learning." — the fifth sentence of the
Youth Exchanges panel — was reported at 4.96 → 4.45 in WebKit and 5.52 → 5.09 in
Chromium by the 36-stop sweep. §2.8's fourth branch says a fall like that is not
a finding until it is confirmed at fine resolution, and it does not survive it.
Stepping the whole traversal at **5px on both builds**:

| | true worst before | true worst after | Δ |
|---|---|---|---|
| chromium 1440×900 | 3.762 @ 2300 | 3.697 @ 2330 | **−0.065** |
| webkit 1440×900 | 3.766 @ 2295 | 3.705 @ 2330 | **−0.061** |

Aligned position by position across 47 stops, the mean Δ is **+0.017** in WebKit
and **−0.009** in Chromium — the element is not systematically worse. The −0.50
lives at exactly one position, 2250, and its neighbours move the other way
(+0.34 at 2280, +0.40 at 2310). This is a scroll-linked plate ramping steeply
through that band: a hair of difference lands the sample at a different point on
a steep curve.

**And it is not composition-derived, which is what the ratchet needs to know.**
The evidence is the ground itself, taken from the blanked frame inside the
element's own rect and averaged over those 47 aligned positions:

- ground **median** moved **−0.00001** in relative luminance — unchanged to five
  decimal places, in both engines;
- ground **minimum** — the pixel that sets the number — moved **+0.000037**
  (WebKit) and **+0.000119** (Chromium);
- glyph-core **population** 10118 → 10119 and 10419 → 10420, so it is not
  population-derived either.

Nothing was darkened, brightened, or moved. What changed under it is that
`IMG_4582-road`'s 2880 variant is a different file — §4.2 took that rung to q50
— and a lossier encode of the same picture moves the extremes by a fraction of a
code. That is the **resolution branch** of §2.8's ratchet in the other
direction, and it is permitted and recorded, as that branch requires.

### The finding this sweep leaves behind

**The offer panels' prose runs to 3.70 at 1440×900, against a 4.5 floor, and it
did before this pass.** The 36-stop sweep — and, on this evidence, the sweeps
before it — never landed on the position where it does. `3749c92` records this
element at 13.51, which is the dark floor it used to stand on; §2 moved it onto
the road, and the recorded value for that move was 8.35. Its true minimum,
stepped at 5px, is **3.70**. That is a real breach of the site's own floor, in
both engines, and it is the one thing this sweep found that the next review has
to deal with. It is not in scope here: no change in this pass caused it, and the
fix is plate strength on the panels' join, which is composition.

---

## 5.1 · The sampler — what it was measuring

The Youthpass sentence is what opened this. It read 4.96 → 4.45 from the
canonical sweep and 3.766 → 3.705 stepped at 5px, and three panel elements had
already shown the same shape earlier — 4.34, 3.76, 3.77, surfaced only when
somebody stepped them at 6px. A number that moves that far when you look
harder is not a number about the page. It is a number about where the
instrument happened to stand.

**What the sampler did.** It put a fixed *count* of stops across each page —
`MAX_STOPS = 36` — and took the interval from the page height:
`step = max(60, ceil(maxY / 35))`, then scrolled `0, step, 2·step, …, maxY`.
So the interval was never chosen; it fell out of how tall the page happened to
be at that viewport. At 1440×900 that is **125px on `/`, 138px on `/about`,
and 60px on `/contact` and `/faq`**. Every element was then scored at whichever
of those global stops it was visible for.

That is the defect, and it is a division: an element's traversal is its own,
but the stops belong to the page. Measured across the 134 element-instances at
1440×900, the median element was scored at **6 positions across a 675px
traversal**, and **39 of them were scored at 3 positions or fewer**. The
reported value was its value at those positions. It was never its worst.

**What it does now.** The interval is fixed in pixels and every element is
scored at every stop it is visible for, so the reported number is the worst
over the element's whole traversal at that resolution. The union of "where some
element is visible" is the whole scroll range, so this is the page stepped
uniformly — there is no cheaper honest version of it.

**The step is 5px, and it was chosen by measurement rather than asserted.**
`/contact` at 1440×900 was swept at **1px** — all 1049 stops, 21.6 minutes — to
give a truth to compare against, and the result subsampled at every step
between 1 and 20:

| step | mean overstatement | worst element |
|---|---|---|
| 2px | 0.009 | 0.072 |
| 3px | 0.018 | 0.083 |
| **5px** | **0.026** | **0.119** |
| 8px | 0.056 | 0.186 |
| 10px | 0.042 | 0.142 |
| 15px | 0.062 | 0.244 |
| 20px | 0.084 | 0.603 |

5px costs a fifth of 1px and gives up 0.026 on average and 0.12 at worst, which
is inside the width of the decision it is used to make. It is also the
resolution §2.8's fourth branch already names for confirming a fall, so the
confirmation step and the sweep step are now the same number.

For contrast, the same series subsampled at the *old* intervals overstates by up
to **2.06**, and `/contact`'s invitation reads 4.65 at 125px against 4.32 at
1px — above floor and below it, on one element, from sampling alone.

**Runtime.** 19,954 stops over the ten configurations: **199.6 minutes** of
single-worker time, about **85 minutes** of wall clock with four workers on a
ten-core machine. The old sampler took roughly seven. Two changes paid for most
of the difference and neither touches the measurement: the settle after an
instant scroll went from 810ms to a two-frame wait, because with transitions
disabled the composite is **pixel-identical by 30ms** (measured at three scroll
depths, maxΔ 0 against a 1200ms wait); and the screenshot is clipped to the
union of the text rects on screen rather than capturing the whole window.

**The rewrite changes sampling and nothing else, and that is checked rather
than claimed.** Run at the old interval on `/contact` — step 60, the same stops
the 36-stop sampler used there — the new code reproduces the old numbers to a
maximum absolute difference of **0.004** across all fifteen elements.

### What was below floor all along

Ten configurations of the current build: 1440×900 and 390×553/664/750/844, in
Chromium and WebKit. 90 elements at 1440×900, 74 on a phone.

| configuration | below floor, 36-stop | below floor, 5px |
|---|---|---|
| chromium 1440×900 | 0 | 6 |
| chromium 390×553 | 0 | 3 |
| chromium 390×664 | 0 | 0 |
| chromium 390×750 | 0 | 3 |
| chromium 390×844 | 0 | 1 |
| webkit 1440×900 | 3 | 6 |
| webkit 390×553 | 0 | 2 |
| webkit 390×664 | 0 | 1 |
| webkit 390×750 | 2 | 2 |
| webkit 390×844 | 0 | 4 |
| **total readings** | **5** | **28** |

**Nine distinct elements are below their floor, and four of them had never once
been below floor under the old sampler — at any viewport, in either engine.**
Not "reported as marginal". Never seen. The other five were visible in one or
two configurations out of ten, which is why the standing record described the
panels' prose as a single WebKit-only oddity rather than as a desktop breach in
both engines.

| element | floor | worst | configurations under | ever seen before |
|---|---|---|---|---|
| `/` `span` Travel, accommodation and meals are fully covered. | 4.5 | 3.70 | 2 | yes |
| `/` `span` Receive a Youthpass certificate recognizing your lea | 4.5 | 3.70 | 2 | yes |
| `/` `span` Participate through workshops, cultural activities a | 4.5 | 3.75 | 2 | yes |
| `/` `span` No prior experience needed. | 4.5 | 3.76 | 2 | **never** |
| `/contact` `p` If you are interested in Erasmus+ opportunities, col | 4.5 | 4.08 | 7 | yes |
| `/` `span` Professional development programs for youth workers | 4.5 | 4.21 | 5 | **never** |
| `/` `span` Focused on skill-building through workshops, simulat | 4.5 | 4.21 | 3 | **never** |
| `/contact` `span` articya4youth@gmail.com | 4.5 | 4.21 | 3 | yes |
| `/` `span` Open to educators, trainers and young people involve | 4.5 | 4.39 | 2 | **never** |

None of this is new damage. Every one of these values was true of the build the
36-stop sweep signed off as "no composition-derived fall anywhere, so nothing
stops", and true of the builds before it. **This section changes no pixels. It
changes what we know about them**, and §5.2 is the repair.

One instrument note worth keeping. The stats ledger counts up on entry, so at
5px the sweep now catches its intermediate numerals — `div|4+`, `div|42+` — as
elements in their own right. They are transient text, not elements, and they
are excluded from the set below; the settled `20+` / `500+` / `15+` are in it.

---


## 5.2 · The repairs

All nine clear the floor, and plate strength alone did it. Nothing else was
touched: the diff is **three `shade` declarations** and their comments. No
brightness filter, no crop, no `object-position`, no type, no zone, no
`data-stage-strength`, no copy.

**Two plates carry all nine, which is why three numbers reach them.**

- **`/` — the road, `IMG_4582-road`.** It had no darkening of its own and took
  the shared stage numbers, `52/62/70`. It is the whole ground under both offer
  panels' prose during the passage across their join, and it is the weakest ramp
  on the page. The Youth Exchanges bullets fall in the **top fifth of the
  window**, where the shared ramp is at 52%; the Training Courses prose crosses
  the **foot** of the window in the same passage. Now `60/70/76`, declared with
  `from: "22%"` / `to: "62%"` so the ramp's geometry is unchanged — the `shade`
  prop's own defaults are 30%/78%, and taking them would have moved the stops as
  well as the strengths.
- **`/contact` — the hero plate**, `68/58/57` → **`71/64/63`**. The invitation
  crosses this plate's middle band at every height.
- **`/contact` — the split plate**, `52/62/70` → **`54/66/72`**. The email
  address stands in *this* plate's middle band on the three shortest phones, and
  the hero plate cannot reach it: measured with the split left at 62, the
  address stays at 4.21 / 4.40 / 4.47 while the invitation is already clear. By
  the time it is on screen the crossfade has finished and this plate is the
  whole ground.

**Each number is the smallest step that clears with margin, and the steps below
it were measured rather than skipped.** On the road: `56/66/72` leaves the worst
two at **4.23**, `58/68/74` scrapes **4.56**, `60/70/76` lands the set at
4.91–6.11. On the contact hero: `70/62/61` gives **4.67** at the worst height,
`71/64/63` gives **5.04**. On the split: `54/66/72` gives **4.87** where the
element failed at 4.21.

### Before and after, ten configurations

Chromium and WebKit at 1440×900 and 390×553/664/750/844, 5px, DPR 2.

| element | c·desk | c·553 | c·664 | c·750 | c·844 | w·desk | w·553 | w·664 | w·750 | w·844 |
|---|---|---|---|---|---|---|---|---|---|---|
| `/` Travel, accommodation and meals — before | 3.70 | 8.25 | 8.25 | 8.25 | 8.26 | 3.70 | 8.25 | 8.25 | 8.25 | 8.25 |
| — after | **4.93** | 8.25 | 8.25 | 8.25 | 8.26 | **4.91** | 8.25 | 8.25 | 8.25 | 8.25 |
| `/` Receive a Youthpass certificate — before | 3.70 | 8.25 | 8.25 | 8.25 | 8.26 | 3.70 | 8.25 | 8.25 | 8.25 | 8.25 |
| — after | **4.91** | 8.25 | 8.25 | 8.25 | 8.26 | **4.91** | 8.25 | 8.25 | 8.25 | 8.25 |
| `/` Participate through workshops — before | 4.09 | 8.25 | 8.25 | 8.25 | 8.25 | 3.75 | 8.25 | 8.25 | 8.25 | 8.25 |
| — after | **5.38** | 8.25 | 8.25 | 8.25 | 8.25 | **4.92** | 8.25 | 8.25 | 8.25 | 8.25 |
| `/` No prior experience needed. — before | 4.09 | 8.25 | 8.25 | 8.25 | 8.26 | 3.76 | 8.25 | 8.25 | 8.25 | 8.25 |
| — after | **5.38** | 8.25 | 8.25 | 8.25 | 8.26 | **4.93** | 8.25 | 8.25 | 8.25 | 8.25 |
| `/` Professional development programs — before | 4.29 | 4.21 | 4.58 | 4.39 | 4.62 | 4.33 | 4.64 | 4.58 | 4.51 | 4.41 |
| — after | **5.64** | **5.47** | 5.98 | **5.72** | 5.94 | **5.64** | 6.02 | 5.91 | 5.82 | **5.73** |
| `/` Focused on skill-building — before | 4.62 | 4.21 | 4.67 | 4.39 | 4.66 | 4.62 | 4.69 | 4.58 | 4.51 | 4.45 |
| — after | 6.01 | **5.47** | 5.99 | **5.73** | 6.01 | 5.91 | 6.09 | 5.91 | 5.82 | **5.81** |
| `/` Open to educators, trainers — before | 4.78 | 4.72 | 4.67 | 4.39 | 4.66 | 4.76 | 4.69 | 4.58 | 4.51 | 4.45 |
| — after | 6.11 | 6.08 | 6.01 | **5.73** | 6.01 | 6.07 | 6.10 | 5.91 | 5.82 | **5.81** |
| `/contact` If you are interested in Erasmus+ — before | 4.38 | 4.52 | 4.78 | 4.58 | 4.44 | 4.45 | 4.27 | 4.10 | 4.12 | 4.08 |
| — after | **5.27** | 5.28 | 5.63 | 5.46 | **5.34** | **5.33** | **5.15** | **5.00** | **5.01** | **5.04** |
| `/contact` articya4youth@gmail.com — before | 8.72 | 4.40 | 5.10 | 4.96 | 4.91 | 8.68 | 4.21 | 4.97 | 4.47 | 4.83 |
| — after | 9.40 | **4.99** | 5.76 | 5.55 | 5.54 | 9.36 | **4.87** | 5.62 | **5.06** | 5.44 |

Bold is a reading that was under 4.5 before. **Zero elements below floor in all
ten configurations** — 90 elements at 1440×900, 74 to 80 on a phone. The
tightest reading on the site is now the email address at 4.87 in WebKit at
390×553, which is the configuration the split plate's number was set against.

### The ratchet

783 paired measurements across the ten configurations: **161 rose, 5 fell.**
Darkening a plate can only raise contrast for the cream type standing on it, so
every fall is on an element whose plate was not touched.

| fall | element | configuration |
|---|---|---|
| 7.78 → 7.74 | `/` `p` A youth organization connecting young people in Cypr | chromium 1440×900 |
| 7.71 → 7.68 | same | webkit 1440×900 |
| 6.10 → 6.03 | same | chromium 390×844 |
| 8.30 → 8.26 | `/` `div` 4+ | chromium 1440×900 |
| 8.38 → 8.28 | `/` `div` 4+ | webkit 1440×900 |

`div` 4+ is a numeral the stats ledger passes through while counting, caught at a
different moment of its own animation — its pixel population moves 9,444 →
11,683 across the pair, which is §2.8's population branch. The lede sits on the
"What we do" plate, which this change does not touch; the three readings move by
0.03–0.07 and sit at 6.03 or better against a 4.5 floor. That is run-to-run
scatter in which single pixel is worst, not a fall.

### Polarisation

The ledger binds at every frame of any ramp: a plate is at **≥ 0.75 or ≤ 0.04**,
never between. Measured at 5px across the whole scroll, with each ramp's
midpoint read explicitly:

- **`/`, plates 0 and 1** — the "What we do" frame and the road, both `wipe`
  plates: **0 of 870 frames** in the band. Opacity snaps 0 ↔ 1 and the
  transition is carried by a travelling mask, so the midpoints read exactly
  1 and 0 (`@130 = 1`, `@2105 = 1`, `@2855 = 0`).
- **`/`, plate 2** — the valley, a crossfade: 70 of 870 frames in the band,
  midpoints 0.1125, 0.7684, 0.3312. Pre-existing and unchanged; this is the
  plate whose ramp the gains section covers with its own edge-to-edge copy of
  the same photograph, which is why it keeps the fade.
- **`/contact`, plates 0 and 1** — 56 and 60 of 210 frames in the band,
  midpoints 0.8638 / 0.1362 and 0.1632 / 0.8368, summing to 1.0. Pre-existing
  and unchanged. Both plates are the *same photograph*, one sharp and one
  defocused across a seam, so the crossfade is a focus pull on one picture
  rather than a haze between two grounds.

This repair alters no opacity: it moves `--shade-*` custom properties only,
while opacity comes from the untouched `data-stage-strength` zones. The two
`wipe` plates are strictly polarised, and the two crossfades are exactly where
they were.

---

## 5.3 · Deploy weight — report only

Nothing in this section was changed. It is a measurement and a recommendation.

### There is no "after" build time, and that is the first finding

**`origin/main` is `b256c30`, dated 2026-07-26, and the last Actions run of any
kind was that same day.** The 84 commits since — the whole photography pass, the
ladder work, the encoder change, and §5.2 above — have never been pushed, so CI
has never built any of them. The before/after asked for does not exist on the
runner.

What does exist is the **before**: run `30220942249`, `b256c30`, where the
`npm run build:pages` step ran **21:22:59 → 21:33:44 = 10m45s** of an 11m28s job.

For the after, the honest substitute is the same cold build measured locally.
CI is always cold — `public/images/variants` is git-ignored and rebuilt every
run — so a local cold build is the same work on different hardware. Ten cores,
variants deleted, `rm -rf .next out` first:

| commit | wall | CPU | deploy | variants kept |
|---|---|---|---|---|
| `b256c30` — `origin/main`, what is live | 110.0s | 232s | **65 MB** | 274 |
| `98e47cb` — before the two full-resolution ingests | 256.2s | 702s | **169 MB** | 383 |
| `ea8dcdc` — HEAD | 281.5s | 766s | **201 MB** | 398 |

Scaling the measured **2.56×** wall ratio onto the 10m45s CI baseline puts the
next Actions build at roughly **27 minutes**, and the CPU ratio of 3.30× puts it
higher on a runner with fewer cores than this machine. Either way it is a
material change to CI time and it has not been paid yet.

**One correction to the premise: the deploy did not go 148 → 200 MB, it went
65 → 201.** No commit I built lands on 148: `origin/main` is 65 MB and the
commit before the two ingests is already 169. 148 MB is an intermediate local
state somewhere between them, which means it already contained most of the
growth — the Portugal set and the 2880 and 1984 rungs — and the two ingests
added the last 32 MB (169 → 201). Against what is actually deployed, this pass
has **tripled** the site.

### Deploy weight is measured against `origin/main`

The premise this section corrected was not a slip of arithmetic, it was a
number carried out of an older report without checking what it was a number
*of*. **148 MB was an intermediate local build.** It is not what is deployed,
it was never deployed, and against it the growth looks like a third of what it
is.

The rule, from here on: **deploy weight and build time are measured against
`origin/main`, never against an intermediate local build.** `origin/main` is
the only state a reader has ever seen and the only one CI has ever produced.
An intermediate local commit is a state of this working tree, and comparing to
it under-reports every change made before it.

The same rule is what makes "there is no after" the honest answer above rather
than a gap: with nothing pushed since 2026-07-26 there is no CI time for any
commit in this pass, and a local cold build is offered as a substitute *and
labelled as one*, not as an after.

### What the 201 MB is

`out/images` is 197.6 MiB of it. By format, across 132 referenced variants each:

| width | AVIF | WebP | JPEG | fallbacks |
|---|---|---|---|---|
| 384–1152 | 7.3 MiB | 10.9 MiB | 13.4 MiB | 24.3 MiB |
| 1366–1600 | 7.9 MiB | 12.0 MiB | 15.0 MiB | 27.0 MiB |
| 1920–1984 | 11.4 MiB | 17.2 MiB | 21.9 MiB | 39.1 MiB |
| 2560–3840 | 15.8 MiB | 28.4 MiB | 36.4 MiB | 64.8 MiB |
| **total** | **42.4 MiB** | **68.4 MiB** | **86.7 MiB** | **155.1 MiB** |

**The WebP and JPEG tiers are 155.1 MiB — 78.5% of the images, and AVIF is only
21.5%.** The gap widens with the rung, and §4.2 is why: AVIF's quality is now a
function of the rung and the fallbacks hold one quality at every rung, so at
2880 AVIF is 5.3 MiB where WebP is 12.3 and JPEG 15.2.

**None of it is payload.** `<picture>` gives the browser one source per type in
order, so a visitor downloads exactly one file per image and every modern
browser takes the AVIF. The 155 MiB is deploy weight, artifact upload and CI
time, and nothing else.

And it is barely CI time. Rebuilt cold with the two fallback tiers removed
entirely, the same commit takes **196.9s wall / 683s CPU and produces 45 MB**,
against 281.5s / 766s / 201 MB. **The fallbacks are 78% of the bytes and 11% of
the encode CPU** — AVIF dominates the work, the fallbacks dominate the size.

### Is trimming above a threshold safe?

**The two tiers are not the same question, and the answer differs.**

**Trimming JPEG above a threshold is safe.** The only browsers that reach the
JPEG tier are those with no WebP: Safari 13 and older, IE11, and pre-2019
Android. WebP has been in Chrome since 32, Firefox 65, Edge 18 and Safari 14
(September 2020). The mechanism also degrades gracefully rather than breaking —
if the JPEG srcset's widest rung is below what `sizes` asks for, the browser
takes the widest it has and upscales. So the cost of trimming is a softer
picture for a visitor on a seven-year-old browser, not a missing one.

**Trimming WebP is not safe on the same reasoning.** That tier serves
Safari 14 through 16.3 — iOS 14 to iOS 16.3, September 2020 to March 2023.
AVIF only reached Safari in 16.4. Those are all retina devices at DPR 2–3, and
the large rungs are exactly what a full-bleed frame needs on them. Trimming
WebP above 1600 would deliberately soften the site for iPhones that are three
years old, which is the one population this site's photography argument cannot
afford to spend.

**What trimming JPEG alone would save**, deploy 197.6 MiB of images before:

| policy | saved | images after |
|---|---|---|
| JPEG ≤ 1920 | 47.6 MiB | 149.9 MiB |
| JPEG ≤ 1600 | 58.3 MiB | 139.3 MiB |
| **JPEG ≤ 1366** | **66.7 MiB** | **130.9 MiB** |
| JPEG ≤ 1024 | 78.2 MiB | 119.4 MiB |
| JPEG dropped entirely | 86.7 MiB | 110.9 MiB |

**The recommendation, for the decision rather than as a change: cap the JPEG
ladder at 1366.** It saves **66.7 MiB — a third of the deploy** — costs nothing
to any browser released since 2020, and leaves every retina fallback path on
WebP untouched. Capping at 1024 saves 78.2 MiB on the same argument and is also
defensible; dropping JPEG outright saves 86.7 MiB and gives up IE11 and
Safari 13, which is a product decision rather than a technical one.

For completeness, trimming *both* tiers above a threshold would save 103.9 MiB
at 1600 and 119.0 MiB at 1366 — but that is the WebP trim, and it is the one
this section argues against.

---

## 6.1 · The coverage gap — closed

Eleven rows of the reference set were carried from an older harness because no
sweep on this build reached them. Both states are reachable, both are now
measured, and the count was wrong in one direction and the diagnosis right in
the other.

**The `/faq/` answers are ten, not eight.** Eight of them stood in the
`3749c92` tables; two — `p` "Erasmus+ opportunities are open to young people
usually aged…" and `p` "If selected, you will receive detailed information…" —
have never appeared in any reference set this project has published. And one of
the eight was already recorded **below its own floor**: `p` "Erasmus+ is a
European Union programme that supports…" stands at **4.39 mobile** in the old
table against a 4.5 floor. It was carried, not caught.

### Opening them

`<details>` is native, so the answer is in the exported markup and the state is
one property: the pass sets `open` on all ten, waits out the 400ms
`accordion-open` keyframe — it is an animation and not a transition, so the
sweep's `transition: none` does not reach it — and then steps the page at 5px
exactly as the standing sweep does. The page is 2374px of scroll at 1440×900
and 2657 at 390, against 1413 and 1608 closed, so the pass is 476 and 533 stops.

Opening all ten at once rather than one at a time is the harder state and not
the easier one, and that is worth stating because it is not obvious. A zone
owns the stage when its own middle reaches the middle of the window, so opening
the answers makes the questions section taller, moves its key **down**, and
therefore holds the *hero's* plate — the sharp one — over the answers for
longer. Answer 1 sits directly under the first question either way; what
changes is that it is now crossed while the crossfade to the soft plate is
three parts in a hundred rather than a tenth.

### Reaching the poster without `End`

`End` is the hero's keyboard escape hatch: it calls `expandInstantly()` and the
collapsed opening is gone in one frame. It is also the only reason the poster
state was unreachable, and the way past it is not a trick — the page's own
handler is a non-passive `wheel` listener on `window` that runs
`applyProgress(e.deltaY * 0.0009)`. A `WheelEvent` dispatched on `window` enters
that handler, that arithmetic and that state, so the pass drives the opening
the way a reader's wheel drives it: one event of **deltaY 5.556** per stop,
which is **0.005 of progress**, from 0 to 1 in 201 stops.

Nothing about the reached state is assumed. Each stop reads the progress the
page actually arrived at back off the card's own height — `400px + p ·
(107.639% − 400px)` — and asserts `window.scrollY` is still 0, so a pass that
silently escaped the lock would fail rather than report.

**The step is the 5px rule expressed on the axis that moves.** Scroll is not
that axis here; the page is pinned at 0 for the whole opening. What travels is
§2.6's boundary — the poster's ramp withdrawing upward through the window over
a 40%-deep gradient — and 0.005 of progress moves it **4.5px at 1440×900 and
4.2px at 390×844**. Below the resolution the 5px scroll step already buys.

**One rule is lifted for this pass, and the reason it was there is the reason
it has to be.** The sweep clips an element's rect below the chrome ramp — 150px
desktop, 130px phone — because a scrolling element passing under the header is
partly obscured by it. The poster's hint label stands at **y 135–153 at
1440×900** and travels *upward* as the card opens: it is inside the band at
every frame, and there is no state of it outside one. Clipping it does not
measure it conservatively, it deletes it, which is exactly how it came to be
missing. It is scored on the composite as painted, the same exception the
header's own labels already have.

### What the two passes found

Ten configurations each — 1440×900 and 390×553/664/750/844, Chromium and
WebKit, DPR 2, 5px and 0.005 — 7,226 stops in all.

**The poster is clean.** Nothing below floor in any of the ten, and the three
rows that were carried are carried no longer:

| element | floor | desktop | mobile |
|---|---|---|---|
| `span` We | 4.5 | 5.29 | 5.29 |
| `span` are ArtiCYa | 4.5 | 5.27 | 5.29 |
| `p` ArtiCYa · Cyprus | 4.5 | 5.82 | 5.73 |

The pass also measures two elements in states the `End`-pressed sweep never
sees, because they enter *during* the expansion. `p` "A youth organization
connecting young people in Cypr" reads **6.07 desktop** against the **7.68** it
settles at — the intermediate frames of the opening are 1.61 worse than the
state the page rests in, and still 1.57 clear of the floor. On a phone the
travelling state is the *better* one, 5.43 against 5.07. `a` "Contact Us" is
6.50 in both, unchanged.

**The `/faq/` answers are a real breach, in every configuration.** Two of the
ten are under, and not marginally:

| element | c·desk | c·553 | c·664 | c·750 | c·844 | w·desk | w·553 | w·664 | w·750 | w·844 |
|---|---|---|---|---|---|---|---|---|---|---|
| `p` Erasmus+ is a European Union programme — before | **4.00** | **4.05** | **4.06** | **4.05** | **4.06** | **3.94** | **3.96** | **3.94** | **4.00** | **3.94** |
| `p` Erasmus+ opportunities are open — before | **4.26** | **4.36** | **4.39** | **4.36** | **4.35** | **4.16** | **4.33** | **4.23** | **4.26** | **4.17** |

Ten of ten and ten of ten. The other eight answers pass at 5.23 to 6.50, and
every question, heading and footer line on the page passes.

**Why those two and not the other eight** is one mechanism and it is the zone
key. Both stand in the first question group, high enough on the page that the
crossfade from the hero's sharp plate to the soft one has barely begun — at
their worst stops the sharp plate carries **0.92 to 0.97** of the ground and the
soft plate three to eight parts in a hundred. And they are `ink-soft`, the
dimmest text on the site, crossing the **bottom of the window**, where that
plate's own ramp is at its `base`. Measured at the worst stop: the window's mean
row luminance is 2–7 of 255 and the ground under the glyphs is a single speck
of open sky through the canopy at **rgb(80, 77, 73)**. It is not a dark
photograph problem; it is one bright pixel in a dark one.

### The repair, and the one lever that could reach it

**Plate strength of the zone, and nothing else.** The diff is **two numbers** on
`/faq/`'s sharp plate: `mid` **73 → 79** and `base` **74 → 80**. No crop, no
`object-position`, no type, no zone, no `data-stage-strength`, no copy, and
nothing on any other page.

**The soft plate cannot do it, and that is arithmetic rather than preference.**
At the stops where the two answers are worst it carries three to eight parts of
the ground in a hundred; taking it from 70 to 90 at the base would move the
composite by a fraction of a code. The plate that is 92–97% of the ground there
is the hero's own, so that is the plate the repair has to move.

**Mid as well as base, because the worst pixel migrates.** Raising `base`
alone — 74 → 78, 80, 82 — moves the worst from 3.94 to 4.09 and then stops
dead: the binding stop simply travels up the window into the band the `mid`
holds, and no value of `base` reaches it. The two have to move together.

**The step below was measured, not skipped.**

| plate 0 mid/base | `p` Erasmus+ is a European Union… | `p` Erasmus+ opportunities are open… |
|---|---|---|
| 73 / 74 — before | **3.94** | **4.16** |
| 77 / 78 | **4.49** | 4.77 |
| **79 / 80** | **4.85** | **5.09** |

77/78 misses by a hundredth, which is exactly the width of the decision, so it
is not the number. 79/80 is the smallest step that clears with margin.

### After

Ten configurations of each pass on the repaired build, against ten of the same
passes on the build before it — the controlled before/after §5's method
requires, not a comparison against the table.

| element | c·desk | c·553 | c·664 | c·750 | c·844 | w·desk | w·553 | w·664 | w·750 | w·844 |
|---|---|---|---|---|---|---|---|---|---|---|
| `p` Erasmus+ is a European Union programme — before | 4.00 | 4.05 | 4.06 | 4.05 | 4.06 | 3.94 | 3.96 | 3.94 | 4.00 | 3.94 |
| — after | **4.91** | **4.97** | **4.97** | **4.97** | **4.91** | **4.85** | **4.89** | **4.84** | **4.82** | **4.84** |
| `p` Erasmus+ opportunities are open — before | 4.26 | 4.36 | 4.39 | 4.36 | 4.35 | 4.16 | 4.33 | 4.23 | 4.26 | 4.17 |
| — after | **5.16** | **5.27** | **5.31** | **5.27** | **5.25** | **5.09** | **5.23** | **5.17** | **5.17** | **5.11** |

**Zero elements below floor in all twenty configurations** — ten of the page
open and ten of it closed. And the ratchet:

| pass | paired measurements | rose | fell |
|---|---|---|---|
| `/faq/` with the answers open | 288 | 92 | **0** |
| `/faq/` closed — the standing sweep | 188 | 67 | **0** |

Not one fall in 476 pairs, which is what darkening a plate under cream type can
do and nothing else. The page's own hero rose with it: `h1` "Frequently Asked
Questions" **5.97 → 7.37**, its lede **5.97 → 7.36**, `h2` "Erasmus+"
**6.45 → 7.72**.

### Seven published values now read lower, and none of them is a regression

The republished `/faq` table carries seven readings below the number the
reference set has been carrying — `span` ArtiCYa at 11.74 against 11.76, `h3`
"Will I receive any proof…" at 8.43 against 10.30, `h2` "Applications" at
10.64/10.30 against 10.79/11.08, and three more of the same kind. Every one of
them is **identical on both builds**, before the plate change and after it, and
every one of them comes from the pass that is new. With ten answers open the
page is 961px taller at 1440×900, so the questions and headings below the first
group traverse different scroll positions and stand on different parts of the
ramp. The lowest of the seven is 8.43 against a floor of 3 or 4.5.

This is a branch of its own and §2.8 now carries it: **coverage-derived — not a
regression**, and the evidence required is that the value is the same on both
builds. The same applies to the three poster rows: they were carried from the
`3749c92` harness at 5.27/5.34, 5.27/6.30 and 5.90/5.81, and the corrected
instrument reads 5.29/5.29, 5.27/5.29 and 5.82/5.73 in a state that harness
could not reach at all.

### Both passes are in the standing sweep

They are not a one-off diagnosis. `/faq/` is swept twice — closed and with every
`<details>` open — and `/` is swept twice, once past the hero and once inside
it. The reference set is republished from the worse of the two passes wherever
an element appears in both, and §6.2's policy names them in Tier 3.

**What the two passes cost.** 5,216 stops for the FAQ pass and 2,010 for the
poster, against the standing sweep's 19,954 — **7,226 stops, 73.1 minutes of
worker time**, which takes the full sweep from 19,954 stops to **27,180**.

---

## 6.2 · The sweep policy

The full sweep was 85 minutes of wall clock at four workers before §6.1 added
two passes to it, and every remaining phase of work is composition — the strict
branch of §2.8's ratchet, the one that stops the work rather than recording it.
A verification that expensive gets sampled or skipped, and sampling is exactly
the failure §5.1 spent a section unwinding. So the question is not whether to
keep the full sweep; it is the reference and it stays. The question is what runs
between them.

Three tiers. The first is not a contrast measurement at all.

### Tier 1 — the ground detector

**What it is.** Both builds are served, both are opened with **every glyph
blanked**, and the two composites are diffed at the same scroll, stepped at
25px. Any element whose rect covers a changed pixel at any stop is in scope, and
the scroll band it changed over is recorded with it. It answers one question —
*whose ground moved* — and it answers it in pixels.

**Why it is the answer to "a shared plate reaches further than the file that
changed".** It never looks at the source. A `--shade-*` number on one plate, a
token in `globals.css`, a section's height four screens above, an encoder
setting that rewrites a variant — every one of them arrives at the detector the
same way, as pixels that differ. A diff of the *source* would have to know that
`.stage-plate-shade` is read by four pages, that a section's height moves every
stage key below it, and that a rung change rewrites the ground of every page
that fetches it. The detector knows none of that and needs to know none of it.

**Run against §6.1's repair, which is the ideal test case** — a change to two
numbers in one page's file, whose reach is a question rather than an assumption:

| configuration | stops | stops with a changed ground | elements in scope | minutes |
|---|---|---|---|---|
| chromium 1440×900 | 467 | 73 | 38 | 10.7 |
| webkit 1440×900 | 467 | 75 | 35 | 4.9 |
| chromium 390×844 | 439 | 74 | 26 | 4.5 |

It found **every `/faq/` element the 5px sweep later moved**, including both
breached answers, and it bounded the reach: the ground changed only over
**scroll 0–975**, the band where the crossfade to the soft plate has not yet
taken over. Below that the sharp plate contributes nothing and nothing moves.

**Its false positives, and they are worth naming exactly.** The change was one
page's plate, so every hit outside `/faq/` is a false positive by construction —
and there were two kinds, each with its own signature.

- **Nine elements on `/`, over scroll 0–850, in all three configurations.** The
  home hero's slideshow runs on its own 4.5s clock, and two independently loaded
  pages are not on the same one. Time-driven state is not ground.
- **Three elements on `/about/`, at exactly one stop, in one configuration.**
  `/about/` is the one page that mounts Lenis, so an instant jump does not
  settle where it is asked to; a one-stop hit is a scroll that had not come to
  rest, not a ground that moved.

Both are fixable in the harness — freeze the slideshow, and wait for
`window.scrollY` to be stationary for three frames before either shot, which is
the same fix the tuning harness needed for the same reason. Until they are, the
detector **over-approximates**, and that is the safe direction for a coverage
proof: it can name an element whose ground did not move, and cannot miss one
whose ground did.

**Its real limits.**

- **25px.** A ground change confined to a narrower band can be missed. Every
  mechanism on this site moves a ground over hundreds of pixels — a plate ramp,
  a zone key, a variant — but the limit is real, so where the detector finds any
  change on a page it re-steps that page at 5px before naming the bands.
- **It compares two builds of the same page.** An element that does not exist in
  the before build has no comparison, so **every element new to the markup is in
  scope by definition**, without being detected.
- **It is per configuration**, so it runs the same ten the sweep does.

### Tier 2 — the targeted sweep

Only the elements Tier 1 named, at **5px**, in all ten configurations, over
their own traversals with one window of margin either side — and run on **both
builds**, never against the published table. §5.1's lesson is that a number
compared against a table produced by a different instrument is not a comparison,
and a targeted run is a different instrument the moment its stops are chosen
differently.

**It saves about half, and it is worth being honest about why it is not more.**
§6.1's repair was targeted exactly this way — `/faq/` only, both of its passes,
both builds — and it cost **16,736 stops and 150.2 minutes of worker time**
against Tier 3's 27,180 and 272.7. The unit that can be targeted is a
*page-pass*, and the site has six of them; a change that reaches one page still
costs that page's whole sweep on two builds.

Narrowing further by the detector's own scroll bands does not pay on this site
and the arithmetic says so: `/faq/`'s band was 0–975 and one window of margin at
each end takes it to 0–1875 of a 2374px page — **79% of it**. On a page three
windows tall, one window of margin is most of the page. **The saving comes from
the pages the detector did not name**, which is precisely what Tier 1 measures.

### Tier 3 — the full sweep

Every element, every page, 5px, ten configurations, **including §6.1's two
passes** — `/faq/` with every `<details>` open, and the home hero's collapsed
opening driven by the wheel. It is the reference set's own instrument and the
only thing that may republish it.

### Runtime

Measured on this machine, at DPR 2, worker-minutes summed over the ten
configurations. Wall clock is quoted at four workers using the 199.6 → 85 minute
ratio the standing sweep was measured at, which is 59% parallel efficiency.

| tier | stops | worker-min | wall at 4 workers |
|---|---|---|---|
| **1 — ground detector** | 4,446 | ≈ 42 | **≈ 18 min** |
| **2 — targeted, one page's two passes, both builds** | 16,736 | 150.2 | **≈ 64 min** |
| **3 — full sweep, one build** | 27,180 | 272.7 | **≈ 116 min** |
| 3 as a controlled before/after | 54,360 | 545.4 | ≈ 232 min |

Tier 1's ten configurations are extrapolated from the three measured above at
each engine's own measured cost per stop; the other two rows are summed from the
runs this session actually made. Tier 3 grew from 85 minutes to 116 because
§6.1's two passes added 7,226 stops to it, and that is the price of the coverage
gap being closed rather than carried.

### What triggers what

| trigger | tier |
|---|---|
| any change at all, including one believed to be text-only | **1** |
| Tier 1 names elements on one page | **2** on that page's passes |
| Tier 1 names elements on three or more pages, or an element that appears on every page | **3** |
| `globals.css` tokens, `.plate-shade`, `.chrome-shade`, `.foot-shade`, `PhotoStage`, `lib/images.ts` | **3**, without waiting for Tier 1 |
| the ladder, the crops, the grade, the encoder | **3** |
| new markup — any element that does not exist in the before build | **2** on the new elements; **3** if there are more than a handful |
| Tier 1 finds nothing anywhere | **nothing further**, and that is a measurement rather than a claim |
| before a push, and at the end of every numbered phase, regardless of every row above | **3** |

The last row is the one that matters. Tiers 1 and 2 exist to make the work
*between* full sweeps honest, not to replace them: **the full sweep runs at the
end of every phase whatever the tiers said**, so anything the 25px step or a
targeted set's boundary lets through has a fixed horizon rather than an open one.

---

## 6.3 · The JPEG ladder, capped at 1366

Done. `LADDER` is unchanged and WebP is untouched; the JPEG entry in `FORMATS`
carries a `cap` and the emit loop runs `widthsFor(widths, fmt)` — a capped
format keeps every rung at or below its cap and, if that would leave it with
none, keeps the narrowest rung the frame has, so **no srcset can be empty by
construction rather than by inspection**. `lib/images.ts` reads the cap out of
the manifest and mirrors the same filter, and the `<img>` fallback is now the
largest *JPEG* rather than the largest rung.

### Confirmed on the built output

- **32 `<picture>` blocks. 0 without a JPEG `<source>`. 0 empty srcsets** — in
  any format, including the `<img>` fallback's own srcset.
- 189 JPEG variants become **114**; 567 emitted files become **492**; the
  deploy keeps **344** referenced images where it kept 398.
- The `#wall` key behaves: its 3840 rung is AVIF and WebP only, and the JPEG it
  publishes is 1366 like every other frame's.

### Deploy and build

| | before | after |
|---|---|---|
| deploy, whole site | 201 MB | **134 MB** |
| `out/images` | 197.6 MiB | **130.8 MiB** |
| — AVIF | 42.4 MiB | 42.4 MiB |
| — WebP | 68.4 MiB | 68.4 MiB |
| — JPEG | 86.7 MiB | **20.0 MiB** |
| cold build, wall | 281.5s | **261.5s** |
| cold build, CPU | 766s | **767s** |

**66.7 MiB off the deploy — a third of it — and no measurable CPU.** The two
figures are not in tension: §6.4's profile puts the 75 removed encodes at
**30.1 seconds of encode wall, 9.5% of it**, and mozjpeg is single-threaded
where AVIF is not, so 30 seconds of wall is 30 seconds of CPU out of 766 and
disappears into run-to-run noise. The wall did move, by 20 seconds.

### Nothing regressed, in either engine, and the check is a measurement

Two independent ones.

**Neither engine ever reaches the JPEG tier.** Every image request each engine
finished, across all four pages, scrolled to the foot, at both reference
viewports:

| engine | viewport | avif | webp | jpeg |
|---|---|---|---|---|
| chromium | 1440×900 DPR 2 | 21 | **0** | **0** |
| chromium | 390×844 DPR 3 | 21 | **0** | **0** |
| webkit | 1440×900 DPR 2 | 23 | **0** | **0** |
| webkit | 390×844 DPR 3 | 23 | **0** | **0** |

**And no pixel of either engine's composite moved.** §6.2's Tier 1 detector, run
between the pre-cap and post-cap builds over all four pages:

| configuration | stops | elements in scope | where |
|---|---|---|---|
| chromium 1440×900 | 467 | 9 | `/` hero only |
| webkit 1440×900 | 467 | 9 | `/` hero only |
| chromium 390×844 | 439 | 6 | `/` hero only |

Every hit is the home hero's own 4.5s slideshow clock — the false positive §6.2
names, identical in count and band to the run against a change that had nothing
to do with images. **Nothing on `/about/`, `/contact/` or `/faq/`, and nothing on
`/` outside the hero.** `verify:text` PASS on all four pages, 1303 / 1599 / 277 /
1993 characters.

### Who now receives an upscaled JPEG, and by how much

Only a browser with **no WebP**: Safari 13.1 and older (iOS 13 and older),
IE11, Chrome before 32, Firefox before 65, Edge before 18, and the pre-2019
Android stock browser. Every one of them is a 2019-or-earlier engine, and the
mechanism degrades rather than breaks — where the widest rung is below what
`sizes` asks for, the browser takes the widest it has and scales it up.

Every placement that now upscales, at the two reference viewports, largest
magnification per frame. Nothing that is *not* full-bleed appears: the About
wall's tiles ask 768–1928 and the panel and scene objects 835, so the ones that
already sat at or under 1366 are untouched.

| magnification | viewport | asks | takes | frame |
|---|---|---|---|---|
| 4.09× | 390×844 DPR 3 | 5588 | 1366 | `hero-3` |
| 2.91× | 1440×900 DPR 2 | 3974 | 1366 | `hero-3` |
| 2.74× | 1440×900 DPR 2 | 3744 | 1366 | `IMG_4585` (the About wall's centre tile) |
| 2.51× | 390×844 DPR 3 | 3434 | 1366 | `hero-1` |
| 2.48× | 390×844 DPR 3 | 3392 | 1366 | `IMG_4582-road` |
| 2.17× | 1440×900 DPR 2 | 2966 | 1366 | `hero-2` |
| 2.11× | 1440×900 DPR 2 | 2880 | 1366 | `IMG_4721`, `IMG_4735-road`, `hero-1`, `IMG_4582-road`, `IMG_4619-valley` |
| 2.09× | 390×844 DPR 3 | 2849 | 1366 | `IMG_4735-road` |
| 1.81× | 390×844 DPR 3 | 2477 | 1366 | `IMG_4619-valley` |
| 1.45× | 390×844 DPR 3 | 1976 | 1366 | `IMG_4585` |
| 1.43× | 390×844 DPR 3 | 1956 | 1366 | `hero-2` |
| 1.41× | 390×844 DPR 3 | 1928 | 1366 | `IMG_4619-ridge` |
| 1.39× | 390×844 DPR 3 | 1900 | 1366 | `IMG_4721` |
| 1.27× | 1440×900 DPR 2 | 1728 | 1366 | `IMG_4619-ridge` |

Six of these already upscaled before the cap — `hero-3` at 2.41× and 1.72×,
`hero-1` at 1.19×, `IMG_4582-road` at 1.18×, `IMG_4585` and `hero-2` at 1.03×,
because their masters stop short of the rung `sizes` asks for. The cap does not
introduce upscaling to this tier; it deepens it, on browsers whose newest member
shipped in 2019.

---

## 6.4 · Where the build time goes, and what a cache could key on — report only

Nothing here was changed. The pipeline is measured, not altered.

**Method.** The variants step run cold with `--force`, every `sharp` encode
timed individually, on an idle ten-core machine with nothing else running.
567 files, 19 frames, the uncapped ladder — the state §6.3 changed, so these are
the numbers the cap was decided against. Times are **wall seconds per encode
call**; sharp threads AVIF internally and mozjpeg not at all, so this is not a
CPU split and is not read as one.

### Where the time goes

**The variants step is 96% of a cold build.** 333.0s of it against a 261.5s
whole-build wall once the ladder is capped, and a warm tree reduces the whole
`npm run build:pages` to 9.7s. Everything below is inside that step.

| | wall | share |
|---|---|---|
| decode + grade, 19 frames from `_originals` | 16.7s | 5.0% |
| encode, 567 files | 316.4s | 95.0% |
| **pipeline** | **333.0s** | |

By format:

| format | files | encode s | share of encode | MiB emitted | share of bytes |
|---|---|---|---|---|---|
| AVIF | 189 | 224.2 | **70.9%** | 55.9 | 21.9% |
| WebP | 189 | 51.2 | 16.2% | 87.4 | 34.3% |
| JPEG | 189 | 41.0 | 13.0% | 111.9 | 43.8% |

By rung — and this is the shape that matters, because cost is area:

| rung | files | encode s | share | MiB |
|---|---|---|---|---|
| 384 | 57 | 2.8 | 0.9% | 2.0 |
| 640 | 57 | 6.8 | 2.1% | 5.1 |
| 768 | 57 | 9.8 | 3.1% | 7.3 |
| 1024 | 57 | 17.5 | 5.5% | 12.5 |
| 1152 | 57 | 21.1 | 6.7% | 15.5 |
| 1366 | 57 | 28.4 | 9.0% | 21.1 |
| 1536 | 9 | 3.7 | 1.2% | 3.1 |
| 1600 | 48 | 32.4 | 10.2% | 24.5 |
| 1920 | 48 | 44.2 | 14.0% | 33.4 |
| 1984 | 48 | 47.1 | 14.9% | 35.4 |
| 2316 | 3 | 1.5 | 0.5% | 1.4 |
| 2560 | 45 | 59.2 | 18.7% | 52.3 |
| 2880 | 21 | 30.0 | 9.5% | 31.9 |
| 3840 | 3 | 11.7 | 3.7% | 9.9 |

The top four rungs — 1920 and above — are **42.6% of the encode over 24% of the
files**, and the single slowest encode on the site is `IMG_4585`'s 3840 AVIF at
**7.9 seconds**, one file. Per frame the spread is 1.0% (`home-training`, 21
files) to 12.0% (`IMG_4585`, 36 files).

### The cache: today it cannot work at all

Three findings, and the first is the one that decides the other two.

**1 · The freshness check is keyed on mtimes, so it can never survive a
checkout.** `signature()` puts `fs.statSync(...).mtimeMs` into the key for
`scripts/responsive-images.mjs`, `scripts/grade-photos.mjs` and every graded
original. `actions/checkout` writes every one of those files at checkout time,
so **every CI run computes a different signature for identical content** — and
the mismatch path is `fs.rmSync(OUT, { recursive: true })`. A restored cache
would be deleted and re-encoded in full. This is not a hypothetical: it is why
caching has never been worth adding, and it has to be fixed before a cache step
would do anything at all.

**2 · There is no cache step, and the tree is git-ignored.** `deploy.yml` caches
npm only. `public/images/variants` is regenerated from scratch on every run by
construction, which is correct today and is the whole of the 27-minute
projection.

**3 · The signature is one string for 567 files.** Any change to any input
rebuilds every variant of every frame. This session changed
`scripts/responsive-images.mjs` twice — once to cap the JPEG tier, once to write
this measurement — and under today's key each one invalidated all 567 files,
including 189 AVIFs that no edit could have altered.

### What would key a variant safely

The complete determinant of one output file, and nothing else belongs in it:

- `sha256` of the **source original's bytes** — content, never mtime;
- the grade: `productionStrength` and a content hash of `grade-photos.mjs`;
- the **crop rectangle** for that key, or none;
- the baked **EXIF orientation**;
- the target **width**;
- the **format and its exact encoder options at that width** — AVIF's quality
  is a function of the rung, so the rung has to be inside the format's own term
  and not only in the width;
- the resize options (`withoutEnlargement`).

Everything else in the script — `LADDER` membership, `FULL_BLEED`, `SCALED`,
`MAX_WIDTH` — decides *which* variants exist, not what any one of them
contains. It belongs to the manifest, not to a variant's key. That is the whole
of the difference between today's global signature and a per-file one: the
global key mixes the two, so a change to the set invalidates the contents.

### What that would save, in files and seconds

Against 567 files and 316.4s of encode:

| change | re-encoded | encode cost |
|---|---|---|
| a `responsive-images.mjs` edit touching neither encoder options nor crops | **0 files** | **0s** (today: 567 files, 316.4s) |
| one photograph re-ingested | 21–36 files | 3.3–37.9s (1.0–12.0%) |
| `AVIF_QUALITY` changed at the 2880 rung | 7 files | 19.0s (6.0%) |
| a rung added to the ladder | 3 files per frame that takes it | — |
| the 3840 `#wall` rung alone | 1 AVIF | 7.9s (2.5%) |
| the grade or its strength changed | all 567 | 316.4s — correct, every pixel moves |

And the coarse version, which is worth stating because it needs no rewrite of
the keying at all: an `actions/cache` step on `public/images/variants` keyed by
`hashFiles('public/images/_originals/**', 'scripts/grade-photos.mjs',
'scripts/responsive-images.mjs')` plus a manual version string would restore the
whole tree — **172 MB capped, 256 MB uncapped** — on any run that changed no
photograph and no pipeline file, and take the variants step to zero. It still
requires finding 1 above, because the script's own freshness check would delete
the restored tree before the build could use it. On a CI run whose
`build:pages` is projected at ~27 minutes and whose variants step is 96% of a
cold build, that is the difference between ~27 minutes and roughly one.

---

## 7 · The About wall — A1 Keystone

Section 4 of the review. `design/refs/wall/A1-keystone.html` is the
specification; `design/refs/wall/built/` holds the contact sheets, frame for
frame against it, at 1440×900 DPR 2 and 390×664 DPR 3.

Four frames divide the window between them and the fifth is set into the
junction where all four meet. On a desktop the four are quadrants split at
x = 44 and at two *different* heights — y = 46 on the left, y = 56 on the right
— so neither horizontal join runs across the frame, and the keystone then covers
the middle 48% of both. On a phone the same idea lies down: two frames across
the top, two across the foot, the keystone full width between them.

---

### 7.1 · What was built, and where it departs from the preview

**Everything the preview states, the component reproduces to the decimal.** The
keystone reaches 2.60 at **100.00%** window coverage at both viewports; coverage
is crossed at stage **0.9003** desktop and **0.8428** mobile against the
preview's 0.900 and 0.843, and held for **197.3px** and **265.4px** of the pin
against its 197.19 and 265.30. The rise is **455.4px = 0.506** of a viewport on
a desktop and **438.9px = 0.520** on a phone, against the half a viewport an
overlapping move has to have — and it is 0.520 at every phone height, because
both the section and the rise are fractions of the same window. No pin was
added: the section is the same `200vh` / `220vh` it was, the last outer frame
still settles at 0.92 / 0.94, and the rise is bought from that overlap.

Two things had to be different, and both are cases of the same thing — a number
the preview could state as a ratio because it only ever rendered one window.

**The ground's top edge is a luminance wipe until the frame pins.** The preview
is a window-sized stage. The component is a `sticky` child inside a 220svh
section, so for stage 0 → 0.455 the frame's own top edge travels the whole
window with the last story scene above it, and an opaque full-bleed ground
inside it draws a horizontal line between two backgrounds across the full width
for a viewport of scroll — the defect `ART-DIRECTION §2` forbids outright and
the one `DESIGN-SYSTEM`'s stage section exists to avoid ("sections paint no
ground of their own, so there is no edge for a seam to land on"). The ground
therefore carries `PhotoStage`'s own device: a mask ramp `min(40%, edge
position)` deep, which has no line in it at any frame and **closes to nothing
exactly as the frame pins**. Everything the assembly does happens after that —
first settle 0.60, words 0.60–0.70, last settle 0.92, rise 0.77–1.0 — so the
ground is opaque edge to edge for all of it.

**The blur's edge cover is a length, not a ratio.** A CSS blur samples what is
outside the element as transparent, so a blurred layer fades out at its own
edges and needs picture beyond them to hide the fade. `blur(7px)` on a
quarter-size raster is `stdDeviation` 28px on the screen and is only spent by
3σ = 84px. The preview covers it with `scale(1.08)`, which is 57px at 1440 wide
and **15.6px at 390**. Measured: that left the page's own ground showing through
the outermost 9px of the window down both sides of a phone wherever the frames
were gathered clear of it — **2.11% of the window at stage 0.65** — and nothing
at all on a desktop, which is why a desktop-only preview could not see it. The
cover is now 84px on all four sides at every viewport. It costs a magnification
of 1.12 at 1440 and 1.43 at 390, invisible in a frame already defocused to 28px.

This is `§8`'s rule about a number read off a reference, met a second time:
record what the number was a fraction *of*, and where that thing is a different
size here, carry the constraint rather than the ratio. A blur radius is a
length. So is the cover it needs.

**The keystone's phone crop is 10%, not 50%** — see 7.2.

#### The two debts, confirmed by placement count on the built output

Not by reasoning. `out/**/*.html` was parsed with script and style blocks
stripped, exactly as `postexport` does, and every `<img>`/`<link>` counted per
page.

| frame | before | after | variant files shipped |
|---|---|---|---|
| `IMG_4599` | `/about` ×1 | **none** | 26 → **0** |
| `hero-2` | `/` ×1, `/about` ×1, `/faq` ×2+preload | `/` ×1, `/faq` ×2+preload | 28 → 28 |
| `IMG_4585` | `/` ×3+preload, `/about` ×1 | `/` ×3+preload, `/about` ×2 | 30 → 30 |

`IMG_4599` is off the site: no placement, and `postexport` ships none of its
variants. `hero-2` is at **two** zones — the home hero's second slide and the
FAQ ground — against the three it carried since the wall was built. `IMG_4585`
gains an `<img>` on `/about/` and no placement: the wall's out-of-focus ground
is the keystone's own frame, which `§5` counts as one placement with it, and it
declares the keystone's `sizes` so the two resolve to the same rung and the page
downloads it once. Both `<img>` on `/about/` carry
`(min-width: 768px) 124.8vw, 303.9vw`.

Site-wide the table in `ART-DIRECTION §5` is now **eleven frames at nineteen
placements, eight twice and three once**, and nothing at three.

#### Page ground behind the wall — 0.00%

Measured optically rather than geometrically, because a rectangle can cover the
window without being opaque there and the ground's own top ramp is exactly that
case. The page's ground is painted magenta, `PhotoStage` is taken out, and the
composite is counted: a pixel is page ground where red and blue both stand more
than 40 above green, which no frame in this set produces and which survives the
shade being drawn over it.

| stage | 1440×900 | 390×844 | 390×750 | 390×664 | 390×553 |
|---|---|---|---|---|---|
| 0.10 | 95.37 | 97.87 | 97.57 | 97.52 | 96.74 |
| 0.20 | 64.29 | 58.50 | 60.61 | 62.33 | 63.95 |
| 0.30 | 40.99 | 46.43 | 46.86 | 47.04 | 47.22 |
| 0.40 | 14.72 | 28.35 | 27.46 | 26.51 | 25.29 |
| **pin** (0.455 / 0.50) | **0.00** | **0.00** | **0.00** | **0.00** | **0.00** |
| 0.55 → 1.00, every stop | **0.00** | **0.00** | **0.00** | **0.00** | **0.00** |
| the wall standing | **0.00** | **0.00** | **0.00** | **0.00** | **0.00** |

Seventeen stops per viewport. **Zero at every frame from the pin onward**, at
rest and at every frame of the assembly, against the 6.0% desktop and 20.3%
mobile §4.3 logged. Above the pin the numbers are the section rising into view
and are the page *above* the wall, not a hole in it — the frame does not cover
the window there and no arrangement of the wall's own layers could make it.

#### The horizontal edge

Geometric and exact: every tile boundary, minus the parts a higher tile covers,
clipped to the window.

| | at rest | worst frame of the assembly |
|---|---|---|
| longest edge **between two outer frames**, 1440×900 | **26.0%** | 25.4% (stage 0.80) |
| longest edge between two outer frames, 390×844/750/664/553 | **0.0%** | **0.0%** |
| longest edge of any kind, 1440×900 | 48.0% | 60.9% (stage 0.85, mid-rise) |
| longest edge of any kind, 390×* | 100.0% | 100.0% |

The first two rows are what A1 resolves by construction, and they hold at every
test height — the four phone columns are identical to the decimal, because every
rectangle in the wall is a percentage of the window. The desktop 26.0% is the
preview's own figure.

The last two rows are the keystone's own boundary and they are in the preview
too, marked red by its own 92% test: on a phone the keystone is full width, so
its top and bottom edges run the window. That is the arrangement Andreas chose
rather than a defect introduced by the component, and it is recorded here rather
than softened — the strips above and below it are 13% and 15% of the window, and
nothing but a different arrangement changes it.

---

### 7.2 · Every slot, not the one that scales

`§4.4` required this and 2.14 did not do it. Per slot, at rest and at peak, at
all four phone heights and at 1440×900, rendered-against-fetched and
rendered-against-source, read off the built output in a real browser.

**Three corrections to the instrument first**, because the first pass of this
audit got all three wrong and each one hides the thing it is supposed to find.

- **The fetched rung comes from `currentSrc`, never from `naturalWidth`.** With
  a `w` descriptor the browser corrects the intrinsic dimensions by the density
  it selected, so `naturalWidth` reports the CSS width the image occupies — and
  a ratio built on it is not a measurement of anything, it is the DPR.
- **Crop survival is the smaller of the two axis ratios.** A frame *narrower*
  than its box is fitted by width and loses height; scoring only the width
  overscale calls that 100%, which is exactly what it reported for the keystone.
- **"At rest" is not a stage of the pinned timeline.** The composition standing
  does not occur inside the pin at all: the last outer frame lands at 0.92/0.94
  and the keystone has been growing since 0.77/0.74, which is the overlap the
  rise is bought from. Sampled at `zoomFrom` the outer frames are still part
  gathered and half off the window, and the audit reads their travel rather than
  their slot. The unpinned render is the standing composition exactly, and it is
  also what the export holds, so that is where the slot state is measured.

#### Resolution — nothing on the wall is within 0.035 of the ceiling

| viewport | frame | state | slot, css | painted dev px | rung | ÷ fetched | ÷ source | crop survives | subject |
|---|---|---|---|---|---|---|---|---|---|
| 1440x900 DPR 2 | `IMG_4585` | in slot | 691x576 | 1382 | 3840 | 0.360 | 0.229 | 62.5% | whole |
| 1440x900 DPR 2 | `IMG_4585` | **at 2.60** | 1797x1498 | 3594 | 3840 | 0.936 | 0.594 | 62.5% | whole |
| 1440x900 DPR 2 | `IMG_4735-road` | in slot | 634x414 | 1267 | 1366 | 0.928 | 0.210 | 73.5% | whole |
| 1440x900 DPR 2 | `hero-1` | in slot | 634x486 | 1318 | 1366 | 0.965 | 0.436 | 96.1% | whole |
| 1440x900 DPR 2 | `hero-3` | in slot | 806x504 | 2160 | 2316 | 0.932 | 0.932 | 74.7% | whole |
| 1440x900 DPR 2 | `IMG_4619-ridge` | in slot | 806x396 | 2009 | 2560 | 0.785 | 0.475 | 80.3% | whole |
| 1440x900 DPR 2 | `IMG_4585` (ground) | defocused | 1608x1068 | 3216 | 3840 | 0.838 | 0.532 | 49.8% | — |
| 390x844 DPR 3 | `IMG_4585` | in slot | 390x608 | 1367 | 3840 | 0.356 | 0.226 | 85.6% | whole |
| 390x844 DPR 3 | `IMG_4585` | **at 2.60** | 1014x1580 | 3555 | 3840 | 0.926 | 0.588 | 85.6% | whole |
| 390x844 DPR 3 | `IMG_4735-road` | in slot | 203x127 | 608 | 640 | 0.951 | 0.101 | 70.2% | whole |
| 390x844 DPR 3 | `hero-1` | in slot | 187x127 | 562 | 640 | 0.877 | 0.186 | 91.7% | whole |
| 390x844 DPR 3 | `hero-3` | in slot | 164x110 | 705 | 768 | 0.918 | 0.304 | 69.7% | whole |
| 390x844 DPR 3 | `IMG_4619-ridge` | in slot | 226x110 | 835 | 1024 | 0.815 | 0.197 | 81.3% | whole |
| 390x844 DPR 3 | `IMG_4585` (ground) | defocused | 558x1012 | 2277 | 3840 | 0.593 | 0.376 | 73.5% | — |
| 390x750 DPR 3 | `IMG_4585` | in slot | 390x540 | 1215 | 3840 | 0.316 | 0.201 | 96.3% | whole |
| 390x750 DPR 3 | `IMG_4585` | **at 2.60** | 1014x1404 | 3159 | 3840 | 0.823 | 0.522 | 96.3% | whole |
| 390x750 DPR 3 | `IMG_4735-road` | in slot | 203x113 | 608 | 640 | 0.951 | 0.101 | 62.4% | whole |
| 390x750 DPR 3 | `hero-1` | in slot | 187x113 | 562 | 640 | 0.877 | 0.186 | 81.5% | whole |
| 390x750 DPR 3 | `hero-3` | in slot | 164x98 | 627 | 768 | 0.816 | 0.271 | 78.4% | whole |
| 390x750 DPR 3 | `IMG_4619-ridge` | in slot | 226x98 | 742 | 1024 | 0.725 | 0.175 | 91.4% | whole |
| 390x750 DPR 3 | `IMG_4585` (ground) | defocused | 558x918 | 2066 | 3840 | 0.538 | 0.342 | 81.0% | — |
| 390x664 DPR 3 | `IMG_4585` | in slot | 390x478 | 1170 | 3840 | 0.305 | 0.193 | 91.9% | whole |
| 390x664 DPR 3 | `IMG_4585` | **at 2.60** | 1014x1243 | 3042 | 3840 | 0.792 | 0.503 | 91.9% | whole |
| 390x664 DPR 3 | `IMG_4735-road` | in slot | 203x100 | 608 | 640 | 0.951 | 0.101 | **55.2%** | **cuts near cow (y)** |
| 390x664 DPR 3 | `hero-1` | in slot | 187x100 | 562 | 640 | 0.877 | 0.186 | 72.1% | whole |
| 390x664 DPR 3 | `hero-3` | in slot | 164x86 | 555 | 768 | 0.722 | 0.240 | 88.6% | whole |
| 390x664 DPR 3 | `IMG_4619-ridge` | in slot | 226x86 | 679 | 1024 | 0.663 | 0.160 | 96.8% | whole |
| 390x664 DPR 3 | `IMG_4585` (ground) | defocused | 558x832 | 1872 | 3840 | 0.488 | 0.310 | 89.4% | — |
| 390x553 DPR 3 | `IMG_4585` | in slot | 390x398 | 1170 | 3840 | 0.305 | 0.193 | 76.6% | whole |
| 390x553 DPR 3 | `IMG_4585` | **at 2.60** | 1014x1035 | 3042 | 3840 | 0.792 | 0.503 | 76.6% | whole |
| 390x553 DPR 3 | `IMG_4735-road` | in slot | 203x83 | 608 | 640 | 0.951 | 0.101 | **46.0%** | **cuts near cow (y)** |
| 390x553 DPR 3 | `hero-1` | in slot | 187x83 | 562 | 640 | 0.877 | 0.186 | 60.1% | whole |
| 390x553 DPR 3 | `hero-3` | in slot | 164x72 | 491 | 768 | 0.640 | 0.212 | 94.0% | whole |
| 390x553 DPR 3 | `IMG_4619-ridge` | in slot | 226x72 | 679 | 1024 | 0.663 | 0.160 | 80.6% | whole |
| 390x553 DPR 3 | `IMG_4585` (ground) | defocused | 558x721 | 1674 | 3840 | 0.436 | 0.277 | 96.9% | — |

**Nothing exceeds 1.0 anywhere**: 60 rows over five viewports and three states,
worst rendered-against-fetched **0.965** (`hero-1`, 1440×900) and worst
rendered-against-source **0.932** (`hero-3`, 1440×900). §4.4's finding — the
right upright at 0.987 at rest, on a slot nobody had measured — has no analogue
here; the tightest slot on the wall has 3.5 points of headroom.

The keystone's peak is the number the whole arrangement was chosen for and it
lands where the preview said: **3594 device px against the 3840 rung and the
6048 source at 1440×900 DPR 2 — 0.936 and 0.594** — and **3555, 0.926 and 0.588**
at 390×844 DPR 3.

#### Crop and subject — two findings, and only one of them is the wall's

**`IMG_4735-road` cuts the near cow's horns at 664 and at 553, and the slot is
what does it.** The frame's own subject band was re-read at 2880 rather than off
a 768 variant: the near animal stands at **24.0%–58.0% across and 40.9%–71.0%
down** the cut frame. The phone's foot band is `52vw × 15vh`, so its aspect is a
function of the window's *height* — 1.60:1 at 844, 2.45:1 at 553 — and the band
it opens on the frame moves with it:

| phone height | band aspect | crop survives | visible band, y | near cow |
|---|---|---|---|---|
| 844 | 1.60:1 | 70.2% | 29.8 – 100 | whole, 11.1 points clear |
| 750 | 1.80:1 | 62.4% | 37.6 – 100 | whole, 3.3 points clear |
| **664** | **2.03:1** | **55.2%** | **44.8 – 100** | **horns cut** |
| **553** | **2.45:1** | **46.0%** | **54.0 – 100** | **head cut** |

Both of the failing columns are heights a real iPhone actually gives. The
position is already `100%`, which is the furthest from the frame's top any
window on it can be, so **nothing in `object-position` closes this** — and
55.2% and 46.0% are also under §2's 60% floor. `hero-1`'s band on the same row
falls 91.7% → 60.1% and lands exactly on the floor.

What would close it is the §A2 lesson applied to the bands: they are declared in
`vh`, and a slot whose *aspect* has to hold is a fraction of the window's width,
not its height. 15vh at 844 is 32.5vw; declared that way the foot band is
126.6px at every height, its aspect never moves, and the cut test holds at all
four columns by construction. That is a change to the arrangement Andreas picked
and it would want its own preview, so it is **recorded here and not made** —
the wall shipped is A1 as specified.

**The keystone's desktop peak clears walker one by 0.3 points, and that margin
is not tunable.** At 2.60 the window shows the middle 80.1% of the tile, which
is frame x **9.9%–90.1%**; walker one ends at 9.6%. He is excluded outright,
which is what the rule asks for — but 0.3 points is 18 source px, about 5 CSS
px on the screen. On a desktop this slot is fitted by *width* at every scale, so
the tile holds the whole frame width and the visible band at peak is the same
whatever `object-position` says. Only the slot or the frame moves it. Recorded.

**Everything else is whole at both ends.** Mid-travel the edge necessarily
crosses a body — the band travels 26.3 points on a phone and no gap between two
walkers is that wide — and the rule is about the ends, which is where it is
measured.

#### The keystone's phone crop, and why it is 10%

This is the one number in the preview the audit had to change, and it is the
clearest case for why §4.4 asked for the audit at all.

Read at 3840 rather than at 768, the four walkers stand at **2.2–9.7%,
11.9–20.4%, 22.7–26.9% and 32.0–35.8%** of the frame's width. On a phone the
frame is the wider of the two and is fitted by its height, so x is the whole of
what the tile shows: 85.6% of the width at rest and 32.9% at full coverage, with
the band's left edge travelling 26.3 points between them. That left edge is the
only one that reaches a body at either end, and the preview's **50% puts it
through one at both** — 7.2% is walker one's chest at rest, 33.6% is walker
four's trailing hand at full coverage.

Solved against all four bodies at both ends, the edge clears every one of them
only for x in **4.0%–15.3%** or **67.2%–82.5%**. The first band is the better
of the two: it holds all four walkers whole at rest and walker four whole at
full coverage, where the second holds three at rest and nobody at the end.
**10%** sits in it with 0.76 points of margin at rest and 0.87 at full coverage.

Nothing about the desktop changes: there the frame is narrower than the slot at
every scale, so it is fitted by width and x does nothing at either end.

### 7.3 · Contrast, and the darkness question

The closing paragraph moves from bare page ground onto a photograph, which is
the strict branch of the ratchet, so the whole instrument was run rather than a
tier of it: **Tier 3 — every element, every page, 5px, ten configurations,
including §6.1's two passes.** Clean production build, `rm -rf .next out` first.

Two guards were taken before any of it, because both would have made the
comparison meaningless:

- **Every document height is identical before and after** — `/`, `/about/`,
  `/contact/`, `/faq/` at 1440×900, 390×844 and 390×553, all twelve pairs. No
  element's traversal was re-timed, so §4.3's coverage branch cannot apply to
  anything below and every fall has to be explained by the ground itself.
- **No `pageerror` and no console error**, in Chromium and WebKit, with and
  without `prefers-reduced-motion`. About's reduced-motion `useScroll` failure
  was fixed in `ec660b3` and a recurrence would be a regression; the hooks all
  stand above the early return in the rewritten component.

#### The seam, measured rather than argued

The ground's top ramp is the one new boundary on the page, so it is measured on
the same row-delta scan seam continuity is always judged by — the ground
isolated, everything else in the pinned frame hidden, every stop from 0.10 to
the pin, both engines, 1440×900 and 390×664.

| | worst row ΔL **at the frame's own top edge** | worst row ΔL anywhere in the window |
|---|---|---|
| Chromium 1440×900 | **0.00292** | 0.0726 |
| WebKit 1440×900 | **0.00318** | 0.0680 |
| Chromium 390×664 | **0.00793** | 0.1252 |
| WebKit 390×664 | **0.00904** | 0.0654 |

In **no** configuration and at **no** stage is the frame's own edge the worst row
in the window: the worst is always above the wall, in the page's own content, at
ten to thirty times the size. The wipe leaves nothing to trace. The mask string
is identical in both engines, so `-webkit-mask-image` is doing its work.

#### What /about/ downloads

The ground shares the keystone's key *and* its `sizes`, so the claim was that it
costs no request and no bytes. A request log settles it: on both viewports
`IMG_4585-3840.avif` is fetched **once** and serves both.

| | before | after |
|---|---|---|
| `/about/` at 1440×900 DPR 2 | 12 files, **4.65 MB** | 10 files, **4.49 MB** |
| `/about/` at 390×844 DPR 3 | 12 files, **2.86 MB** | 10 files, **3.49 MB** |

The desktop falls 0.16 MB: two frames leave the page and the four that stay take
wider rungs for their larger slots. **The phone rises 0.63 MB, and that is the
keystone's peak and nothing else.** Before, the centre tile was 50vw × 40vh and
its peak resolved to the 1984 rung at 715 KB; at 100vw × 72vh × 2.60 it paints
3555 device px and resolves to 3840 at 2169 KB. There is no lever on it that is
not a blur — the next rung down is 2880 and paints at 1.234 — and the sharing is
what keeps it from being worse: declared for its own full-bleed box the ground
would take the 1984 rung on a phone and add 715 KB on top. What carries the
cost is the same argument `responsive-images.mjs` already makes for this rung,
now true on a phone as well: the wall is the last thing on the page, below three
scene photographs, it is not the LCP, and it lazy-loads.

#### The sweep — Tier 3, thirty configurations over three passes

**Nothing on the site is below its floor.** Not one element, in any of the ten
configurations of any of the three passes. `/`, `/contact/` and `/faq/` are
untouched to the decimal, in both of `/faq/`'s states and in the home hero's
collapsed opening.

**On `/about/`, three elements moved and they are the three the change was
about.** Everything else on the page is *identical* — same value, same pixel
count, same scroll position, seventeen rows at exactly +0.00 — which is what
makes the three legible rather than arguable.

| element | published d / m | A1 d / m | worst at | branch |
|---|---|---|---|---|
| `span` Through its continuous engagement in Erasmus+ i | 10.77 / 9.12 | **5.17** / 12.70 | chromium 1440×900, y3690, 5609 px | composition |
| `span` ArtiCYa contributes meaningfully to the develop | 10.93 / 9.30 | **5.06** / 13.26 | webkit 1440×900, y3675, 12608 px | composition |
| `span` fostering European values, solidarity and lifel | 10.97 / 10.54 | **8.56** / 12.82 | chromium 1440×900, y3620, 8527 px | composition |

The mobile column goes **up** by 2.3 to 4.0 points. The desktop column falls by
2.4 to 5.9, and the reason is the arrangement rather than any darkening: the
seven-tile wall gathered its side tiles to ±14vw and left the middle of the
window empty, so the closing paragraph stood on bare stage ground; A1's four
frames cover the window by design, and on a desktop the paragraph is 672px wide
in a 1440px window, so its right half sits on `hero-3` arriving over the middle.
On a phone the frames gather straight up and down and the paragraph stands on
the out-of-focus ground alone, which is darker and far smoother than what it
stood on before — hence the rise.

**The falls are composition-derived and the evidence rules the other three
branches out.** The same instrument was run over `/about/` at 5px on **both
builds**, so the comparison is not against a table:

- not population-derived: at the worst *shared* stop the pixel count is
  unchanged — 5911 → 5911, 12600 → 12602, 8924 → 8927 — and the value still
  falls 10.81 → 5.34, 12.13 → 5.85, 11.40 → 8.58.
- not coverage-derived: every document height is identical on both builds, so no
  element traverses a different scroll position. Seventeen of the twenty rows on
  `/about/` find their worst at the *same* pixel of scroll on both builds, at
  the same value and over the same pixel count.
- not resolution-derived: no variant under these three changed.

Both engines agree, which is what rules out an antialiasing artefact. Before:
10.77 / 10.81, 10.93 / 10.93, 11.04 / 10.97 (Chromium / WebKit) — reproducing
the published table exactly. After: **5.17 / 5.21, 5.14 / 5.06, 8.56 / 8.58**.

**One limit of the instrument, found while checking these and recorded rather
than acted on.** WebKit reports the first span at **5.21 over 112 pixels** at
y3965. That stop sits inside the paragraph's own fade at opacity ≈0.95, and the
glyph-core test keeps a pixel only where the rendered value *is* the declared
ink — on a partly transparent element that selects for the pixels whose ground
is brightest, and the population collapses from 5,609 to 112. Below about
opacity 0.9 the harness scores nothing at all, so the artefact is confined to
two or three stops either side of 1.0. It does not govern anything here:
Chromium finds **5.17 over the full 5,609 pixels** at y3690, which is lower and
is a whole-population reading, and that is the number published above.

**A correction to my own method while establishing that.** Walking the fade at
0.02 of stage — 40px of scroll — put the same three spans at 5.63, 5.85 and
12.04, and all three of those are too high: the 5px sweep finds lower minima
*between* those stops. A traversal sampled at 40px is the 36-stop sampler's
error at a finer grain, and §5.1 is about exactly that. The 5px sweep is the
instrument; the numbers above are its.

**The lowest reading these three take in any of the ten configurations is
5.06**, against a floor of 4.5, and the tightest reading on the site is still
`/faq/`'s first answer at 4.82.

#### Two things the sweep turned up that are not this change

**`/`'s lede reads 7.65 against a published 7.68**, at Chromium 1440×900,
y345, over 11,767 pixels. Home is frozen and nothing in this change touches it —
no file on `/`'s path is in the diff and its document height is identical at all
three viewports. **Settled by re-running `/` on both builds rather than by
argument**, at the same engine, viewport and step:

| run | value | pixels | worst at |
|---|---|---|---|
| the **before** build, fresh | **7.74** | 11,768 | y335 |
| the **after** build, second run | **7.74** | 11,768 | y335 |
| the after build, first run (the sweep's own) | 7.65 | 11,767 | y345 |

The two builds are **indistinguishable** — the same value, over the same pixel
count, at the same pixel of scroll — and both land *above* the published 7.68,
so 7.68 was itself a low draw and 7.65 is a lower one. The element sits inside
the hero card, whose slideshow crossfades three photographs on a 4.5s clock, so
what stands under those glyphs at a given stop is a function of wall-clock time
rather than of scroll.

**§5.2's own ratchet section already found this, on this element, at this
size.** Three of the five falls it recorded are this lede — 7.78 → 7.74,
7.71 → 7.68, 6.10 → 6.03 — in a repair that did not touch the plate it stands
on, and it signed them off as "run-to-run scatter in which single pixel is
worst, not a fall". The table above is that finding measured directly instead of
inferred. The row is published at **7.65** because the set is a worst-per-element
set and 7.65 is a real observation of the worst — not because anything moved.
The two other rows that moved are on the same page and the same mechanism:
`/poster`'s `a Home` 8.76 → 8.72 and its `span ArtiCYa` 11.43 → 11.09, both in
the hero's collapsed opening, which is driven by synthetic wheel events and so
does not even land on identical progress steps between runs. All three sit 3.1
to 6.6 points above their floors. They are recorded at the lower draw, because
the set is a worst-per-element set and a lower draw is a real observation of the
worst — not because anything on `/` moved.
**The reference set has a key that the probe cannot produce.** The poster
table's `p ArtiCYa · Cyprus` carries a middle dot the DOM does not: separators on
this site are CSS pseudo-content so the frozen text stays frozen, and the probe
reads text nodes only. The row is transcribed from what is on the screen rather
than from what the harness emits, so it never matches and shows up as one
published row unseen plus one row not in the published set. A transcription
defect in the table, not a change in the page, and the fix is to key it
`p|ArtiCYa Cyprus`.

#### The ratchet, and what closing it would cost

§2.8 says no change may lower a measured value below the published set, and if
one requires it, report and stop. This one requires it, so here is the report
and the price, measured on the built page rather than derived.

The only sanctioned lever is the plate strength of the zone — `.wall-shade`'s
mid, which is the site's own 62% and is drawn only while the words are up.
Raised in place at stage 0.50, with the mean luminance of the window beside it
so the cost is visible next to what it buys:

| `--shade-mid` | Through its… | ArtiCYa contributes… | fostering… | mean L of the window |
|---|---|---|---|---|
| **62% (shipped)** | 5.17 / 5.98 | 5.82 / 5.93 | 12.04 / 12.00 | **0.0250** |
| 66% | 5.83 / 6.65 | 6.50 / 6.52 | 12.33 / 12.33 | 0.0226 |
| 70% | 6.59 / 7.36 | 7.24 / 7.33 | 12.49 / 12.53 | 0.0203 |
| 74% | 7.36 / 8.15 | 8.03 / 8.18 | 12.78 / 12.78 | 0.0182 |
| 78% | 8.31 / 9.12 | 8.95 / 9.05 | 13.07 / 13.07 | 0.0163 |
| 82% | 9.49 / 9.98 | 10.03 / 10.03 | 13.35 / 13.35 | 0.0146 |
| 88% | 11.23 / 11.60 | 11.48 / 11.48 | 13.67 / 13.67 | 0.0124 |

Chromium / WebKit. **Restoring the published 10.9 costs 62% → 86–88%**, which
halves the luminance of the composition at the exact moment the four frames are
arriving on the screen — a photograph with a veil on it, which `§3` rejects by
name. Eight points of shade buys about 1.4 of contrast and costs 19% of the
window's luminance.

**Not spent.** All three readings are above their floor with 1.13, 1.35 and 4.08
of headroom, none of the 430 stops reaches 5.00, and §4.3's instruction for this
build is to repair *below-floor* readings only. The lever is left at the site's
own number and the decision is Andreas's: the table above is what it costs.

#### §5.3's question — is contrast being bought with darkness a sixth time?

No. The answer is measurable in three parts and none of them is an argument.

**No plate strength was raised anywhere on the site.** `.wall-shade` is
`.plate-shade` carrying **52 / 62 / 70 across 22%–62%** — the same five numbers
`.stage-plate-shade` already had, on the same `land-anchor`. Nothing else in
`globals.css` moved. The phone's run of five increases does not become six.

**Nothing outside the wall changed by a thousandth.** Mean relative luminance
as painted, per photograph, on the rendered composite:

| state | photograph | before | after |
|---|---|---|---|
| hero | `IMG_4721` sharp | 0.0714 | **0.0714** |
| scene 1 | `IMG_4721` ground | 0.0324 | **0.0324** |
| scene 1 | `AboutImage1` | 0.2713 | **0.2713** |
| scene 2 | `IMG_4721` ground | 0.0252 | **0.0252** |
| scene 2 | `AboutImage2` | 0.2020 | **0.2020** |
| scene 3 | `IMG_4721` ground | 0.0252 | **0.0252** |
| scene 3 | `home-training` | 0.3448 | **0.3448** |

Identical at 390×844 as well, to four decimal places, every row.

**Darkness was spent, and not on contrast.** The ground the closing paragraph
stands on is a different photograph at a different filter — `IMG_4585`
defocused at `brightness(0.40)` where the page's soft plate runs `brightness(0.6)`
— and it is darker for it:

| | before (`IMG_4721` soft) | after (`IMG_4585`, the wall's ground) |
|---|---|---|
| words' ground, 1440×900 | 0.0269 | **0.0230** (−14%) |
| words' ground, 390×844 | 0.0393 | **0.0299** (−24%) |

And the contrast on that ground went **up** on a phone, 9.12 → 12.70. The two
are not connected: a defocused ground at full luminance is a second picture
competing with the five in front of it, so the filter is a compositional
decision, and the contrast it happens to produce has five points of slack. Even
at `brightness(1.0)` — two and a half times the shipped value — the phone's
closing paragraph would still read about **9.5**, against a floor of 4.5.

So the one place the site did get darker is a ground nobody reads, the change
bought no contrast, and where contrast did fall it fell on a *desktop*, where
the ground got no darker at all and the words simply moved onto a picture.

---

## 7.4 · A1 is off, and the seven-tile wall is back

Seen on a real iPhone, A1 Keystone was rejected: the frames are too small and
the composition reads worse than the wall it replaced. The layout wanted and the
zoom wanted are the same commit — `e78d483` took the centre frame to full window
coverage on the seven-tile wall — so this is a revert and not a rebuild.

**The revert is exact, and that is checked rather than claimed.** `2ebe527`
touched four files and nothing after it touched three of them; the fourth,
`gallery-finale.tsx`, was also touched by `445b883`, which is an ancestor of
the rebuild and therefore survives a checkout of the parent. All four files are
now **byte-identical to `2ebe527^`** — `git diff 2ebe527^` over them is empty —
and `445b883`'s `h-[100dvh]` is still on the pinned frame.

### What came off, and what stayed

Off, because it is the composition: the five-slot geometry and its two
arrangements, the slot aspects, the frame assignment, `WallGround` and
`.wall-ground-soft`, the ground's luminance wipe and the `pinAt` / `WIPE_FEATHER`
machinery that existed only to hide that ground's top edge, `.wall-shade` and
the shade layer under the lede, and `positionCompact`.

Stayed. There is exactly **one** correction in code and **four** in the
instrument, and each is named with the reason it survives.

**The blur's edge cover is a length, not a ratio.** It survives as a rule and it
has **no code site left**, which is worth stating rather than quietly dropping.
The correction was written entirely inside `.wall-ground-soft`, a class that
exists only to carry A1's ground, so the revert takes its only application with
it. The site's two other quarter-raster layers — `.stage-plate-soft` and
`.gain-defocus` — never used `scale(1.08)`: they carry no overhang at all, which
is a different situation and a pre-existing one, and both are on surfaces frozen
for this pass. The rule stands where it is written; nothing on the restored
build reads a ratio for a length.

**`naturalWidth` is density-corrected and cannot measure the fetched rung.** An
instrument correction, not a geometry one. The audit below reads the rung out of
`currentSrc` because of it.

**Crop survival is the smaller of the two axis ratios, not the width
overscale.** Same: it describes how to measure a slot, not which slots exist.

**The composition standing is not a stage of the pinned timeline.** The last
outer frame lands at 0.92 while the centre has been growing since 0.77, so the
resting composition has to be reached on its own rather than read off a stage
key. True of both walls.

**A glyph-core test is invalid on a partly transparent element.** At opacity
0.95 the population collapses and selects for the brightest ground. This one is
now enforced in the harness rather than left as a note — see the method below —
and it moves exactly one published row.

### Everything after `e78d483` that is not the wall, confirmed on the built output

Not by reasoning about which files the revert touched. The revert touched four
files; these are the built artefacts.

| what | how it was confirmed | reading |
|---|---|---|
| `hero-1` / `hero-2` ingested at full resolution | variant ladder in `out/images/variants/` | both reach **2880**, which a 1536px master could not have produced |
| `hero-3` cut to its honest width | same | ladder stops at **2316**, and the wall paints it at 0.746 of that source |
| the 1984 rung | same | present on **every** frame's ladder |
| per-rung AVIF quality | mean bytes per pixel per rung, measured on the shipped files | 2560 **0.1178** → 2880 **0.0884** → 3840 **0.1130**: the q50 step is on `BLEED_WIDTH` alone and the SCALED rung does not take it |
| the JPEG cap | JPEG widths across the whole set | 384–1366 and nothing above, 13 frames at each rung |
| §5.2's plate repairs | `--shade-*` custom properties in the exported HTML | `/contact` **71/64/63** on `sky-anchor` and **54/66/72**; `/` **60/70/76** |
| §6.1's plate repair | same | `/faq/` **85/79/80** on `land-anchor` |

`IMG_4599` is back on the wall and `hero-2` back to three placements, both by
placement count on `out/**/*.html` with script and style blocks stripped:
`/about/` carries seven wall frames — `IMG_4585`, `IMG_4619-ridge`, `IMG_4599`,
`hero-2`, `hero-3`, `IMG_4735-road`, `hero-1` — and `ART-DIRECTION §5` is back
to twelve frames at twenty-one placements with the two debts it was carrying
before the rebuild.

### The restored wall, measured

Every property the restore was required to have, at both reference viewports.
Painted width is the picture and not the box: `object-fit: cover` paints a frame
wider than its box wherever the frame is proportionally the wider of the two.

**1440×900 DPR 2, at the peak**

| frame | rung | painted | device | rendered / fetched | rendered / source | covers |
|---|---|---|---|---|---|---|
| `IMG_4585` — the centre | 3840 | 1872 | 3744 | 0.975 | 0.619 | **100.00% × 100.00%** |
| `IMG_4619-ridge` | 1920 | 864 | 1728 | 0.900 | 0.675 | 60% × 30% |
| `IMG_4599` | 768 | 360 | 720 | 0.938 | 0.281 | 25% × 40% |
| `hero-2` | 768 | 360 | 720 | 0.938 | 0.250 | 25% × 40% |
| `hero-3` | 1920 | 864 | 1728 | 0.900 | 0.746 | 60% × 30% |
| `IMG_4735-road` | 1152 | 576 | 1152 | **1.000** | 0.400 | 40% × 30% |
| `hero-1` | 1152 | 576 | 1152 | **1.000** | 0.400 | 40% × 30% |

**390×844 DPR 3, at the peak**

| frame | rung | painted | device | rendered / fetched | rendered / source | covers |
|---|---|---|---|---|---|---|
| `IMG_4585` — the centre | 1984 | 658 | 1973 | 0.995 | 0.326 | **100.00% × 100.00%** |
| `IMG_4619-ridge` | 1984 | 642 | 1927 | 0.971 | 0.753 | 60% × 30% |
| `IMG_4599` | 640 | 154 | 461 | 0.721 | 0.180 | 25% × 40% |
| `hero-2` | 768 | 253 | 758 | 0.987 | 0.263 | 25% × 40% |
| `hero-3` | 1920 | 542 | 1627 | 0.848 | 0.703 | 60% × 30% |
| `IMG_4735-road` | 1024 | 285 | 856 | 0.836 | 0.297 | 40% × 30% |
| `hero-1` | 1152 | 343 | 1030 | 0.894 | 0.358 | 40% × 30% |

- **Full window coverage at both viewports**, 100.00% on both axes.
- **Nothing over 1.0 rendered-against-fetched.** The tightest are `IMG_4735-road`
  and `hero-1` at exactly **1.000** on a desktop and `hero-2` at 0.987 on a
  phone. That is the boundary and not a breach, and it is where this wall has
  always sat — `c779ac1` recorded the right upright at 0.987 "unnoticed", and it
  is 0.987 here, noticed.
- **The ring holds at 1.000 at every frame.** The six outer tiles paint the same
  width at stage 0.60 and at stage 1.00 — 864, 360, 360, 864, 576, 576 on a
  desktop — so nothing but the centre is scaled.
- **The rise and the stall are unchanged**, which follows from byte-identity:
  the section is the same `200vh` / `220vh`, `zoomWindow` the same 0.77–1.0 and
  0.74–1.0, and the 455px / 439px rise is still bought from the overlap with the
  settles.

**One number moved against `e78d483`, and the ladder is why.** The centre tile
read 0.772 rendered-against-fetched at 390×844 then and reads **0.995** now, at
an unchanged 0.326 against its source. `e75e14d` added the 1984 rung for the
phone cluster just above 1920, so the phone now fetches 1984 where it used to
fetch 2560 — the rung doing exactly what it was added to do, and still under
1.0. The desktop figures reproduce `e78d483`'s to the decimal: 0.975 and 0.619.

Contact sheets of the restored assembly are in `design/refs/wall/restored/`, at
390×664 DPR 3 and 1440×900 DPR 2, sixteen frames of the pinned timeline each,
captioned with what each frame reads as.

---

## The contrast reference set — the corrected instrument

§2.8 makes the floor a ratchet: **no change may lower any measured glyph-core
value below its value here.** If one requires it, report and stop.

This set replaces the one carried since `3749c92`. It is not a re-measurement of
the same thing: every number in the old tables was the value at whatever
positions a 36-stop sampler landed on, and §5.1 has the arithmetic on what that
was worth. Nothing about the page changed to produce the differences below.


### The three branches — what a fall has to be before it counts as one

A number going down is not by itself a regression. Three things can move it, and
only the first is.

**Composition-derived — strict.** The ground under the glyphs genuinely changed:
a darkening was lowered, a photograph was brightened, a block was moved onto a
lighter part of a scroll-linked plate. These are regressions and the ratchet
holds against them.

**Resolution-derived — permitted.** A sharper variant has brighter specks in it
for a glyph stem to land on, so the worst *single* pixel finds one that a
softer variant had averaged away. §2.7's nineteen falls are the case: the only
ways to reverse them are to darken five photographs or to withhold the pixels
the change exists to deliver. Permitted, and recorded.

**Population-derived — not a regression.** The measured value changes because
**more of the glyph is visible than before**, not because its ground changed.
The evidence required is the **pixel count scored before and after**, and it has
to be in the report. §2.18 is the template: the headline's second line measured
6.06 at 390×664 over **7,156** glyph pixels, because the land silhouette was
covering the other thirty thousand and the survivors were the ones on the calm
sky above it. Scored over the whole line — **37,439** pixels, the population the
reader actually sees — the worst is 5.38. Nothing was darkened; the hidden four
fifths came back. A fall with a pixel count that grew like that is the
measurement getting honest, and it is signed off as such.

**Coverage-derived — not a regression.** The set gains a *state* it never
measured, and the element reads lower there than in the state it was recorded
in. §6.1's two new passes are the case: with `/faq/`'s answers open the page is
961px taller, so every question below the first group traverses different scroll
positions, and seven published readings are lower for that reason alone. The
evidence required is that the value is **identical on both builds** — before the
change and after it — and it has to be in the report. A state that was never
swept cannot have regressed in a change that did not touch it.

**A fifth thing, and it is the instrument rather than the page.** The sweep
takes a fixed number of stops across each element's own traversal. Move an
element inside its section and those stops land at different absolute scrolls,
so the ground under them changes and the *sampled* worst moves while the *true*
worst does not. **A fall reported on an element that has moved inside its
section is not a finding until it is confirmed at fine resolution** — step the
whole traversal at 5px on both builds and compare the minima. §2.24 checked six
and five of them were the sampler: About's three scene paragraphs came out
9.14 → 9.07, 8.60 → 8.60 and 8.60 → 8.70 where the eight-stop sweep had reported
−1.65, −1.52 and −0.79. Two were real. Clip the measured rect to below the
chrome ramp before believing any of it, or the number is the header.


**Method.** The sweep in `ART-DIRECTION.md §7`'s terms — glyph cores on the
rendered composite, worst pixel per element — **stepped at 5px across every
element's whole traversal** rather than sampled at a fixed count of stops. Ten
configurations: 1440×900 and 390×553, 664, 750 and 844, in Chromium and WebKit,
DPR 2. **27,180 stops** over the three passes. Republished by §7.4's Tier 3 run
— the same thirty configurations, the same 27,180 stops, **81.1 minutes of wall
clock at five workers** — against the **restored** build. **desktop** is the
worst over both engines at 1440×900; **mobile** is the worst over both engines
and all four phone heights. A dash means the element does not render at that
viewport (the desktop nav collapses to a menu). Transient text — the stats
ledger's intermediate numerals — is excluded; the three the counters land on are
not transient and are in.

**The instrument was rebuilt for this run and calibrated against the set it
replaces before it was trusted with anything.** `/contact` at 1440×900 in
Chromium, stepped at 5px, reproduces the published table on **eight of fifteen
elements to 0.01 or better** — `h1` Contact 4.66, `span` Email: 5.17, the
invitation 5.27, the footer 8.08 — with the largest deviation anywhere +0.32 on
a footer span, and every deviation in the *high* direction, which is what a
different stop alignment produces. Two changes make the 5px step affordable and
neither touches the measurement: Chromium is captured through its own
`optimizeForSpeed` encoder (692ms → 179ms on a full window) and decoding is
`sharp` rather than `pngjs` (112ms → 46ms). Both were verified **pixel-identical**
to the path they replace before use, and the pair reproduces §6.1's own stop
counts exactly — 476 desktop and 533 phone for the `/faq/` open pass.

**One rule is new, and it is §7.3's own finding turned into a gate.** An element
is scored only where its *effective* opacity — its own multiplied by every
ancestor's — is 1. The glyph-core test keeps a pixel only where the rendered
value **is** the declared ink, so on a part-transparent element it selects a
collapsed population and the number is about the survivors rather than the
element. This changes exactly one published row and is called out below.

**The eleven carried rows are gone, and the set covers two states the sweep used
to pass over.** `/faq/` is swept twice — once closed and once with every
`<details>` open — and `/` is swept twice, once past the hero and once *inside*
it, the collapsed opening driven by the wheel events the page's own handler
reads rather than escaped with `End`. Where an element appears in both passes of
its page the published value is the worse of the two. §6.1 carries the
mechanism, the step each pass uses, what they found and the one repair it took;
the poster's rows are published under a heading of their own, because they exist
in that state and nowhere else.

**Where the site stands against it.** **Nothing that this instrument can measure
is below its floor**, in any configuration of any of the three passes, with one
element that the instrument cannot measure and which is recorded rather than
repaired — see the paragraph after next. The tightest reading on the site is
still `/faq/`'s first answer at **4.82** in WebKit at 390×750, with
`/contact`'s email address next at 4.87. **No plate strength was raised
anywhere**, and nothing outside the About wall and the poster's own pass moved
by more than 0.34.

**The wall's revert moves six rows, and they are the A1 rows going back.** The
closing paragraph's three spans stood at 10.77/10.93/10.97 desktop and
9.12/9.30/10.54 mobile before A1; A1 put them on the composition and took them
to 5.17/5.06/8.56 and 12.70/13.26/12.82; the revert returns them to
**10.78/10.93/10.97** and **9.12/9.30/10.54**. Every one of the six lands on its
pre-A1 value, five of them exactly and the sixth 0.01 away, which is the
strongest confirmation available that the revert restored the ground and not
merely the markup. The three mobile numbers are *falls* against the set being
replaced, and they are composition-derived and sanctioned: they are not new
lows, they are the baseline the set carried for the whole of this project before
one rebuild moved it, and the lowest of them is 9.12 against a floor of 4.5.
`/about/`'s three nav labels come back the same way, 0.01 to 0.03 down, exactly
reversing the rise A1's top band gave them.

**One element reads below 4.5 and it is not repaired.** The poster's amber
middle dot — `span` `·`, the separator inside `ArtiCYa · Cyprus` — reads **2.59
on a phone**, and everything about that number says it is not a measurement of
the page:

- **The population is nine pixels.** The glyph is 1.9 CSS px wide. §7.3 already
  ruled that a 112-pixel population is too few to govern a decision; nine is two
  orders below that.
- **It exists for two stops out of 201.** Stepped along the opening, the
  element's effective opacity is 0.000 → 0.990 rising and 0.984 → 0.000 falling,
  and reaches 1 at stops 5 and 6 alone. Every other stop is refused by the
  opacity gate above, correctly.
- **It is identical on the build before this change.** Run against the A1 build
  in a worktree on a second port, the same probe returns **2.59 over 9 pixels at
  the same stop**. That is §2.8's coverage branch met exactly: a state the set
  never covered cannot have regressed in a change that did not touch it.
- **It is on the home hero**, which is frozen for this pass in every respect, and
  the only lever that reaches it is the poster's own plate.

It is published rather than hidden, and the line a reader actually reads —
`p` ArtiCYa Cyprus, of which the dot is one glyph in sixteen — is 5.91 and 5.80.

**Two rows differ from the set being replaced for reasons that are the
instrument and not the page.** The poster's intro paragraph reads **10.42**
desktop against a published 6.07: the published figure was taken at a
part-transparent frame, the new gate refuses those, and the paragraph's opaque
worst during the opening is its final frame. Its governing value is unchanged —
the settled pass's **7.60**, which is the number in the `/` table. And the
location line splits: the previous set carried one row `p ArtiCYa · Cyprus` at
5.82/5.73, transcribed from the screen because the harness was believed to read
the separator as pseudo-content. It is not pseudo-content; it is a real
`<span class="text-amber">`, so the probe emits two rows and both are published.

**Everything else that moved is under 0.35 and none of it is the wall.**
`/contact`'s `h2` rises 0.30, `/about/`'s scene spans move +0.06 to +0.13,
`/`'s lede spans ±0.08, and `/`'s "Travel across Europe" falls 0.07 — the home
hero's slideshow runs on its own 4.5s clock and two runs are not on the same
one, which §5.2 already recorded as run-to-run scatter on the same element at
the same size. All are recorded at the lower draw.


**/**

| element | floor | desktop | mobile |
|---|---|---|---|
| `p` Your adventure starts here. | 3 | 4.30 | 3.26 |
| `span` International friends | 3 | 4.52 | 4.86 |
| `span` Certified learning | 3 | 4.74 | 4.77 |
| `span` Real-world skills | 3 | 4.76 | 5.66 |
| `a` Home | 4.5 | 4.78 | – |
| `span` Receive a Youthpass certificate recognizing your lea | 4.5 | 4.91 | 8.25 |
| `span` Participate through workshops, cultural activities a | 4.5 | 4.92 | 8.25 |
| `span` Travel, accommodation and meals are fully covered. | 4.5 | 4.92 | 8.25 |
| `span` No prior experience needed. | 4.5 | 4.93 | 8.25 |
| `h2` What you gain | 3 | 5.04 | 6.48 |
| `p` We work with young people in Cyprus and across Europ | 4.5 | 5.11 | 5.11 |
| `div` PROJECTS | 4.5 | 5.11 | 5.11 |
| `div` YOUTH | 4.5 | 5.11 | 5.11 |
| `div` COUNTRIES | 4.5 | 5.12 | 5.11 |
| `h3` Training Courses | 3 | 5.30 | 5.41 |
| `span` Professional development programs for youth workers | 4.5 | 5.64 | 5.47 |
| `span` Focused on skill-building through workshops, simulat | 4.5 | 5.91 | 5.47 |
| `span` ArtiCYa | 4.5 | 5.99 | 6.18 |
| `span` Open to educators, trainers and young people involve | 4.5 | 6.10 | 5.81 |
| `a` FAQ | 4.5 | 6.11 | – |
| `a` About | 4.5 | 6.12 | – |
| `a` Contact | 4.5 | 6.14 | – |
| `p` Travel across Europe with all expenses covered throu | 4.5 | 6.45 | 6.10 |
| `a` Contact Us | 4.5 | 6.50 | 6.50 |
| `span` All expenses covered | 3 | 6.58 | 4.65 |
| `p` A youth organization connecting young people in Cypr | 4.5 | 7.60 | 5.05 |
| `h2` What we do | 3 | 8.25 | 8.25 |
| `div` 20+ | 3 | 8.25 | 8.25 |
| `div` 500+ | 3 | 8.25 | 8.25 |
| `div` 15+ | 3 | 8.25 | 8.25 |
| `h3` Youth Exchanges | 3 | 8.25 | 8.25 |
| `span` International group experiences for young people age | 4.5 | 8.25 | 8.25 |
| `p` © 2026 ArtiCYa \| All Rights Reserved | 4.5 | 8.77 | 8.77 |

**/about**

| element | floor | desktop | mobile |
|---|---|---|---|
| `a` About | 4.5 | 4.74 | – |
| `h1` About ArtiCYa | 3 | 4.95 | 4.81 |
| `p` A Cyprus-based organization committed to non-formal | 4.5 | 5.08 | 4.84 |
| `span` ArtiCYa is a Cyprus-based organization actively enga | 4.5 | 5.53 | 5.02 |
| `span` Over the years, the organization has demonstrated re | 4.5 | 5.60 | 5.27 |
| `span` ArtiCYa | 4.5 | 5.99 | 6.18 |
| `a` FAQ | 4.5 | 6.09 | – |
| `a` Contact | 4.5 | 6.09 | – |
| `a` Home | 4.5 | 6.16 | – |
| `p` © 2026 ArtiCYa \| All Rights Reserved | 4.5 | 8.59 | 8.59 |
| `span` and to create safe, open and respectful spaces for p | 4.5 | 9.04 | 8.90 |
| `span` ArtiCYa places special emphasis on the promotion of | 4.5 | 9.12 | 8.60 |
| `span` The organization is deeply committed to social inclu | 4.5 | 9.14 | 8.90 |
| `span` ArtiCYa focuses particularly on the arts as a powerf | 4.5 | 9.18 | 8.91 |
| `span` Rooted in the values of creativity, inclusion and so | 4.5 | 9.18 | 8.91 |
| `span` actively supporting LGBTQ+ individuals and advocatin | 4.5 | 9.22 | 8.60 |
| `span` Furthermore, the organization strongly supports and | 4.5 | 9.22 | 8.60 |
| `span` Through its continuous engagement in Erasmus+ initia | 4.5 | 10.78 | 9.12 |
| `span` ArtiCYa contributes meaningfully to the development | 4.5 | 10.93 | 9.30 |
| `span` fostering European values, solidarity and lifelong l | 4.5 | 10.97 | 10.54 |

**/contact**

| element | floor | desktop | mobile |
|---|---|---|---|
| `h1` Contact | 3 | 4.66 | 4.50 |
| `span` Email: | 4.5 | 5.17 | 5.62 |
| `p` If you are interested in Erasmus+ opportunities, col | 4.5 | 5.27 | 5.00 |
| `h2` Get in touch | 3 | 6.21 | 6.01 |
| `span` Facebook: | 4.5 | 6.49 | 7.02 |
| `span` Instagram: | 4.5 | 6.86 | 7.11 |
| `p` © 2026 ArtiCYa \| All Rights Reserved | 4.5 | 8.08 | 8.10 |
| `span` articya4youth@gmail.com | 4.5 | 9.36 | 4.87 |
| `a` Contact | 4.5 | 10.35 | – |
| `span` Articya | 4.5 | 10.47 | 10.65 |
| `span` @articya4youth | 4.5 | 10.96 | 6.38 |
| `a` Home | 4.5 | 12.29 | – |
| `a` About | 4.5 | 12.46 | – |
| `span` ArtiCYa | 4.5 | 12.70 | 9.49 |
| `a` FAQ | 4.5 | 12.79 | – |

**/faq**

| element | floor | desktop | mobile |
|---|---|---|---|
| `p` Erasmus+ is a European Union programme that supports | 4.5 | 4.85 | 4.82 |
| `p` Erasmus+ opportunities are open to young people usua | 4.5 | 5.09 | 5.11 |
| `p` No previous experience is required. Motivation and i | 4.5 | 5.96 | 5.23 |
| `p` Participants gain international experience, new skil | 4.5 | 5.96 | 5.23 |
| `p` At the end of the project, participants receive a Yo | 4.5 | 5.96 | 5.23 |
| `p` Each opportunity has its own application process. Yo | 4.5 | 5.96 | 6.25 |
| `p` Travel arrangements are usually organised by the par | 4.5 | 6.01 | 5.23 |
| `p` Yes. Projects are organised by accredited organisati | 4.5 | 6.08 | 5.23 |
| `p` No. Erasmus+ projects cover the main costs such as a | 4.5 | 6.20 | 5.23 |
| `p` If selected, you will receive detailed information a | 4.5 | 6.50 | 6.23 |
| `p` Here you can find answers to the most common questio | 4.5 | 7.36 | 7.45 |
| `h1` Frequently Asked Questions | 3 | 7.37 | 7.37 |
| `h2` Erasmus+ | 3 | 7.72 | 7.68 |
| `h3` What is Erasmus+? | 4.5 | 7.75 | 7.72 |
| `h3` Who can participate? | 4.5 | 8.05 | 8.18 |
| `p` © 2026 ArtiCYa \| All Rights Reserved | 4.5 | 8.59 | 8.59 |
| `a` FAQ | 4.5 | 9.43 | – |
| `h3` Do I need previous experience? | 4.5 | 9.62 | 8.43 |
| `h3` What will I gain from participating? | 4.5 | 9.62 | 8.43 |
| `h3` Will I receive any proof of my participation? | 4.5 | 9.62 | 8.43 |
| `h3` What happens if I am selected? | 4.5 | 9.65 | 11.23 |
| `h3` Who handles the travel arrangements? | 4.5 | 9.69 | 8.43 |
| `h3` How do I apply? | 4.5 | 9.85 | 11.43 |
| `h3` Is it safe to participate? | 4.5 | 9.92 | 8.43 |
| `h2` Costs & safety | 3 | 9.98 | 8.43 |
| `h3` Do I need to pay? | 4.5 | 10.05 | 8.82 |
| `h2` Experience & participation | 3 | 10.64 | 8.43 |
| `h2` Applications | 3 | 10.64 | 10.30 |
| `a` About | 4.5 | 11.97 | – |
| `a` Contact | 4.5 | 12.18 | – |
| `a` Home | 4.5 | 12.29 | – |
| `span` ArtiCYa | 4.5 | 12.74 | 11.74 |

**/ — the collapsed opening**

| element | floor | desktop | mobile |
|---|---|---|---|
| `span` are ArtiCYa | 3 | 5.27 | 5.33 |
| `span` We | 3 | 5.29 | 5.35 |
| `p` ArtiCYa Cyprus | 4.5 | 5.91 | 5.80 |
| `a` Contact Us | 4.5 | 6.50 | 6.50 |
| `a` Home | 4.5 | 8.76 | – |
| `p` A youth organization connecting young people in Cypr | 4.5 | 10.42 | 5.43 |
| `a` Contact | 4.5 | 10.96 | – |
| `a` About | 4.5 | 10.96 | – |
| `a` FAQ | 4.5 | 11.12 | – |
| `span` ArtiCYa | 4.5 | 11.43 | 9.48 |
| `span` · | 4.5 | – | 2.59 |

Six of these elements — the four nav labels, the wordmark and `a` Contact Us —
are the same ones the settled page carries, measured *during* the opening, and
with the opacity gate in place **not one of them is worse in the opening than at
rest**. The intro paragraph is the same: 10.42 against the 7.60 it settles at on
a desktop, 5.43 against 5.05 on a phone. The published 6.07, which had the
opening 1.61 *worse* than the resting state, was the part-transparent frames
being scored.

`span` `·` is the row with no desktop reading, and it is the one below floor —
see the method above for the nine-pixel population, the two stops out of 201,
and the identical reading on the build before this change.
