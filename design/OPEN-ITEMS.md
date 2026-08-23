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

**2.9 · The centre zoom is back.** Only the centre tile scales; the six of the
ring hold at **1.000** at every frame, and the old move's largest factors were
on the outer tiles, which is what made the wall arrive small and swell.

The amplitude is read off the source, not chosen. `hero-1` is a 2048px master,
the tile paints 720 CSS px at 1440×900 and 457.9 at 390×844, and at DPR 2 and
DPR 3 that is **0.703 and 0.671** of the source at rest. A peak of 0.98 against
the source allows **1.394** on a desktop and **1.461** on a phone, so the
smaller governs both: **1.39**. Measured at the peak: **0.98 against source and
0.98 against the fetched variant** at 1440×900 DPR 2, **0.93 and 0.99** at
390×844 DPR 3. It asks 2002 and 1909 device px of `hero-1`'s own top rung of
2048, so the 2560 cap never comes into it and §2.7's new rung is not involved.

At peak the tile is **69.5vw × 55.6vh — 38.6% of the window** at both
viewports, against 20% at rest: 1000.8 × 500.4 px at 1440×900 and 271.0 × 469.3
at 390×844. It does not fill the screen. 2.60 did, and 2048px cannot pay for
it; the factor is a little over half the old one and the travel is a quarter of
it. The rise runs from where the assembly ends to the release — **119px** at
1440×900 (stage 0.94 → 1.00) and **118px** at 390×844 (0.93 → 1.00), the same
travel at both, which is why the fractions differ. `useScroll` clamps at 1, so
the peak is held while the sticky child unpins and the wall slides up into the
footer. `sizes` declares the peak, not the slot, and the centre tile is painted
last of the seven so it comes forward over the ring.

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
land until 0.92 / 0.94 and the centre tile not until 0.94 / 0.96 — a third of
the section after the words have left.

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
against 4.5, untouched by any of this work and by everything since. Thirty-eight
elements sit under their reference value. Nineteen of those predate this pass —
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
