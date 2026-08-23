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

Five items, all measured before and after on a clean production build at
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
- **The variant ladder stops 320px short of a retina desktop, and that one is
  code.** `scripts/responsive-images.mjs` caps at `MAX_WIDTH` 2560, and a
  full-bleed frame in a 1440 window at DPR 2 is painted at 2880. So every
  Portugal frame used full-bleed measures **1.13 against the variant it
  fetched at DPR 2 and 1.69 at DPR 3** while sitting at 0.19–0.71 against its
  own source: `IMG_4582-road`, `IMG_4619-valley`, `IMG_4735-road`, `IMG_4721`
  and `IMG_4585`. The pixels exist — 27 to 49 MP of them — and the ladder
  simply does not offer a rung that reaches them. Section 1 measured this
  ratio at DPR 1, where 1440 needs 1440 and the cap never binds, which is why
  it reported clean. Adding a rung above 2560 closes it for every one of them;
  it closes nothing for `hero-1`, `hero-2` or `hero-3`, whose masters are
  smaller than the cap already.
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
