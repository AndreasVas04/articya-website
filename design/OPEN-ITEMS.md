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

---

## 3 · Titles

**3.1 · Contact and About headings are too large.**
The FAQ heading was brought down and is now correct. Match Contact and About to
it.

---

## 4 · About

**4.1 · The page needs a photographic ground that moves.**
It should feel as though the reader is travelling through it, the way the
reference set does. At the moment each scene is a separate arrangement.

**4.2 · `ART-DIRECTION.md §6` applies here in full.**
One photograph treated two ways, type bound into the picture's depth, an organic
edge, a title that becomes a label, a deliberate seam. That is the standard for
this page.

**4.3 · The wall's side tiles — diagnostic only, nothing changed.**

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

## The contrast reference set — `3749c92`

§2.8 makes the floor a ratchet: **no change may lower any measured glyph-core
value below its value here.** If one requires it, report and stop.

Method is the sweep in `ART-DIRECTION.md §7`'s terms — glyph cores on the
rendered composite, worst pixel per element, swept across every element's own
traversal at 1440×900 (desktop) and 390×844 (mobile), DPR 2, both ends of the
inner heroes' breath. 93 elements, 186 measurements. A dash means the element
does not render at that viewport (the desktop nav collapses to a menu).

**Where the site stands against it now.** One element is below its floor and it
is below it at `3749c92` too: FAQ's opening paragraph on mobile, **4.39**
against 4.5, untouched by any of this work and by everything since. **Forty**
elements sit under their reference value — thirty-eight of those listed below
plus `/about`'s `a` Contact and `a` Home, which §2.13 took under for the first
time. Nineteen of the thirty-eight predate this pass —
they are the transitions work, where the panels' prose moved from the dark floor
onto the road (13.51 → 8.35) and "Youth Exchanges" with it (12.04 → 8.05). The
other nineteen are §2.7's, all on the desktop viewport and all on the five
frames that changed rung, the largest 0.66 and none below a floor.

**That is a standing conflict and it is recorded rather than resolved.** The
falls §2.7 caused are the resolution itself: a 2880 variant has detail in it
that a 2560 variant averaged away, and the worst *single* glyph-core pixel finds
it. The only ways to reverse them are to darken five photographs or to withhold
the pixels §2.7 exists to deliver. One floor breach was repaired by plate
strength because a floor is not negotiable; the remaining eighteen were left,
and which way that goes is a decision for the next review, not for the change
that surfaced it.

**/**

| element | floor | desktop | mobile |
|---|---|---|---|
| `span` All expenses covered | 3 | 6.04 | 4.48 |
| `span` International friends | 3 | 4.52 | 4.88 |
| `span` Certified learning | 3 | 4.72 | 4.78 |
| `span` Real-world skills | 3 | 4.77 | 5.67 |
| `a` Home | 4.5 | 5.01 | – |
| `h2` What you gain | 3 | 5.03 | 6.48 |
| `div` COUNTRIES | 4.5 | 5.61 | 5.11 |
| `h3` Training Courses | 3 | 5.12 | 5.76 |
| `p` Your adventure starts here. | 3 | 5.18 | 6.09 |
| `span` Professional development programs for youth workers  | 4.5 | 5.53 | 5.2 |
| `span` We | 3 | 5.27 | 5.34 |
| `span` are ArtiCYa | 3 | 5.27 | 6.3 |
| `p` We work with young people in Cyprus and across Europ | 4.5 | 5.3 | 5.53 |
| `span` Focused on skill-building through workshops, simulat | 4.5 | 5.67 | 5.3 |
| `div` PROJECTS | 4.5 | 5.55 | 5.43 |
| `div` YOUTH | 4.5 | 5.57 | 6.21 |
| `p` A youth organization connecting young people in Cypr | 4.5 | 8.95 | 5.71 |
| `span` Open to educators, trainers and young people involve | 4.5 | 13.51 | 5.72 |
| `p` ArtiCYa · Cyprus | 4.5 | 5.9 | 5.81 |
| `a` FAQ | 4.5 | 6.25 | – |
| `a` Contact | 4.5 | 6.34 | – |
| `span` ArtiCYa | 4.5 | 6.56 | 6.43 |
| `a` Contact Us | 4.5 | 6.5 | 6.5 |
| `a` Contact Us | 4.5 | 6.5 | 6.5 |
| `p` Travel across Europe with all expenses covered throu | 4.5 | 7.89 | 11.32 |
| `a` About | 4.5 | 8.12 | – |
| `div` 20+ | 3 | 8.25 | 8.72 |
| `div` 500+ | 3 | 8.25 | 8.45 |
| `div` 15+ | 3 | 8.3 | 8.47 |
| `h2` What we do | 3 | 8.54 | 9.56 |
| `p` © 2026 ArtiCYa \| All Rights Reserved | 4.5 | 8.77 | 8.77 |
| `h3` Youth Exchanges | 3 | 12.04 | 12.04 |
| `span` International group experiences for young people age | 4.5 | 13.51 | 13.51 |
| `span` Participate through workshops, cultural activities a | 4.5 | 13.51 | 13.51 |
| `span` No prior experience needed. | 4.5 | 13.51 | 13.51 |
| `span` Travel, accommodation and meals are fully covered. | 4.5 | 13.51 | 13.51 |
| `span` Receive a Youthpass certificate recognizing your lea | 4.5 | 13.51 | 13.51 |

**/about**

| element | floor | desktop | mobile |
|---|---|---|---|
| `a` About | 4.5 | 5.01 | – |
| `h1` About ArtiCYa | 3 | 5.28 | 5.92 |
| `p` A Cyprus-based organization committed to non-formal  | 4.5 | 5.43 | 5.35 |
| `span` Over the years, the organization has demonstrated re | 4.5 | 6.05 | 5.96 |
| `span` ArtiCYa is a Cyprus-based organization actively enga | 4.5 | 6.01 | 6.06 |
| `a` Contact | 4.5 | 6.31 | – |
| `span` ArtiCYa | 4.5 | 6.68 | 6.57 |
| `a` Home | 4.5 | 6.88 | – |
| `a` FAQ | 4.5 | 7.38 | – |
| `p` © 2026 ArtiCYa \| All Rights Reserved | 4.5 | 8.59 | 8.59 |
| `span` The organization is deeply committed to social inclu | 4.5 | 9.14 | 9.97 |
| `span` and to create safe, open and respectful spaces for p | 4.5 | 9.14 | 9.67 |
| `span` Furthermore, the organization strongly supports and  | 4.5 | 9.26 | 9.22 |
| `span` Through its continuous engagement in Erasmus+ initia | 4.5 | 10.78 | 9.26 |
| `span` ArtiCYa contributes meaningfully to the development  | 4.5 | 10.93 | 9.52 |
| `span` ArtiCYa places special emphasis on the promotion of  | 4.5 | 10.13 | 9.53 |
| `span` Rooted in the values of creativity, inclusion and so | 4.5 | 10.22 | 9.87 |
| `span` actively supporting LGBTQ+ individuals and advocatin | 4.5 | 10.16 | 10.13 |
| `span` ArtiCYa focuses particularly on the arts as a powerf | 4.5 | 10.6 | 10.71 |
| `span` fostering European values, solidarity and lifelong l | 4.5 | 11.05 | 10.88 |

**/contact**

| element | floor | desktop | mobile |
|---|---|---|---|
| `h1` Contact | 3 | 3.74 | 4.79 |
| `p` If you are interested in Erasmus+ opportunities, col | 4.5 | 4.5 | 4.82 |
| `span` articya4youth@gmail.com | 4.5 | 11.24 | 5.7 |
| `h2` Get in touch | 3 | 6.61 | 6.86 |
| `span` Email: | 4.5 | 6.75 | 7.36 |
| `span` Instagram: | 4.5 | 6.88 | 7.44 |
| `span` Facebook: | 4.5 | 6.96 | 7.01 |
| `span` @articya4youth | 4.5 | 10.63 | 7.78 |
| `p` © 2026 ArtiCYa \| All Rights Reserved | 4.5 | 8.16 | 8.16 |
| `a` Contact | 4.5 | 10.38 | – |
| `span` Articya | 4.5 | 10.77 | 12.59 |
| `a` Home | 4.5 | 12.14 | – |
| `span` ArtiCYa | 4.5 | 12.43 | 12.32 |
| `a` FAQ | 4.5 | 12.91 | – |
| `a` About | 4.5 | 13.49 | – |

**/faq**

| element | floor | desktop | mobile |
|---|---|---|---|
| `p` Erasmus+ is a European Union programme that supports | 4.5 | 4.67 | 4.39 |
| `h1` Frequently Asked Questions | 3 | 6 | 5.98 |
| `p` Here you can find answers to the most common questio | 4.5 | 6.03 | 6.04 |
| `p` No. Erasmus+ projects cover the main costs such as a | 4.5 | 6.05 | 6.66 |
| `p` Yes. Projects are organised by accredited organisati | 4.5 | 6.05 | 7.12 |
| `p` Participants gain international experience, new skil | 4.5 | 6.14 | 7.23 |
| `p` No previous experience is required. Motivation and i | 4.5 | 6.22 | 6.79 |
| `p` Travel arrangements are usually organised by the par | 4.5 | – | 6.79 |
| `p` At the end of the project, participants receive a Yo | 4.5 | – | 6.94 |
| `h3` Who can participate? | 4.5 | 7.53 | 7.09 |
| `h2` Erasmus+ | 3 | 7.11 | 8.24 |
| `p` Each opportunity has its own application process. Yo | 4.5 | 7.23 | 7.2 |
| `h3` What is Erasmus+? | 4.5 | 7.78 | 10.47 |
| `h2` Costs & safety | 3 | 10.68 | 8.45 |
| `h3` Do I need previous experience? | 4.5 | 10.74 | 8.45 |
| `p` © 2026 ArtiCYa \| All Rights Reserved | 4.5 | 8.59 | 8.66 |
| `h3` Who handles the travel arrangements? | 4.5 | 9.76 | 11.49 |
| `h3` Will I receive any proof of my participation? | 4.5 | 9.9 | 11.66 |
| `h3` What will I gain from participating? | 4.5 | 10.04 | 10.95 |
| `a` FAQ | 4.5 | 10.08 | – |
| `h3` Is it safe to participate? | 4.5 | 10.16 | 10.74 |
| `h2` Experience & participation | 3 | 10.64 | 10.95 |
| `h3` Do I need to pay? | 4.5 | 10.98 | 11.19 |
| `h2` Applications | 3 | 11.58 | 11.19 |
| `h3` How do I apply? | 4.5 | 11.96 | 11.56 |
| `h3` What happens if I am selected? | 4.5 | 11.66 | 11.61 |
| `span` ArtiCYa | 4.5 | 12.97 | 11.8 |
| `a` Contact | 4.5 | 13.02 | – |
| `a` About | 4.5 | 13.02 | – |
| `a` Home | 4.5 | 13.14 | – |
