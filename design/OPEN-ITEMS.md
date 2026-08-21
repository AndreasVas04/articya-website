# OPEN-ITEMS.md

Review notes taken against the build at `a54c1d5`. Ordered by how they will be
worked, not by how they were noticed. `ART-DIRECTION.md` still owns intent and
the rejected list; this file is the live punch list and gets emptied as items
land.

The direction is right now. The previous round moved the site a long way. What
follows is what still stops it reading as award-level.

---

## D · Photography

**D1 · The crops are taking the wrong part of the frame.**
The passage photograph shows mostly road surface when the same picture has a far
better landscape higher up. The About page has the same problem. The crop logic
is optimising for area and cable-avoidance and is landing on the dull half of
several frames.

**D2 · Some frames in the About mosaic do not stand on their own.**
Several tiles are cut so that no complete or attractive scene is visible. A tile
should be a picture, not a fragment of one. The strongest images on the page are
the ones that show a whole view — those are the standard.

**D3 · Known material limit.**
A 3:4 portrait frame used full-bleed in a 16:10 window can never show more than
47% of its area. About and FAQ need landscape sources to clear the 60% floor.
That is a photography problem, not a code problem.

---

**D4 · The panels' object frames carry their own clutter.**
`AboutImage2` has a television aerial on the cabin roof at top left. It was
always there; the frame is now 41% of the viewport instead of 29%, so it is
larger on the screen than it was. Nothing was cropped to cause it and nothing
can be cropped to remove it — same class as D1, and the same answer.

---

## E · Composition — closed

**E1 · Contact was the standard.** Unchanged.

**E2 · Landed.** Two compositions, one each:

- **The panels, and About's three story scenes with them** — the window cuts
  the photograph. The picture's inner edge stays on the column-4 line and its
  outer edge runs off the screen; 41vw against the old 29%, which is the first
  time the frame has actually reached §A2's 86% of section height. It arrives
  on §E2's vertical wipe. See the commit for the measurements.
- **About's finale** — the scatter became a wall: seven photographs tiling the
  window exactly, no gap and no ground showing, measured at 100% coverage.

Neither used the split again. What is still unspent from `design/refs/`: the
organic mask on a frame other than the home hero, the title that becomes a
label, and type inside the depth on an inner page. §A of
`REFERENCE-LANGUAGE.md` rules the last of those out for the panels
specifically — the heading and the picture are in different columns by
construction — so it belongs to a full-bleed frame if it is ever built.

---

## F · Found while building E

**F1 · The About finale's timeline ran past the document — closed.**
`GalleryFinale` measured itself over `["start end", "end start"]`, which spans
`sectionHeight + viewport` — 2880px at 1440×900. The document's maximum scroll
reached only **0.739** of it (0.725 on mobile), so the last quarter of the
choreography was unreachable at every viewport, and the pin released at 0.688
while the zoom was still written to run to 0.745 — the frame was sliding away
underneath a photograph that was still growing.

The end of the offset is now `end end`: the section's bottom edge reaching the
bottom of the window, which is the exact frame the sticky child unpins on.
Declared travel is the section's own height, 1980px desktop / 1688px mobile,
and the reachable range is **1.075 / 1.087** of it — the whole timeline plus
the footer's 148px as the exit. The pin engages at 0.455 / 0.500 and releases
at 1.000. The gather, the handover, the settle and the zoom were rewritten
against that split; the wordless tail measures **0.830vh desktop / 0.820vh
mobile** against §2's 1.0vh ceiling, where it was 0.82 / 0.83.

**The zoom's end also stopped outrunning the source.** The centre tile is
50vw × 40vh and was scaled ×4, which paints it 2880 CSS px wide at 1440 while
`sizes="100vw"` fetched a 1600px variant — 1.80× upscale at the end of the
zoom, 2.85× on a phone, which is the softness that was visible. The tile now
declares the width it is actually painted at and the run stops at 2.6×, where
the photograph covers the window with 2% of bleed and no more. Measured at four
points through the zoom the rendered-to-intrinsic ratio is 0.375 / 0.464 /
0.885 / **0.975** desktop and 0.336 / 0.418 / 0.793 / **0.873** mobile.

What is left, measured and accepted: the six ring tiles cross 1.0 in flight for
**113px of scroll** (p 0.815–0.872 desktop), peaking at 2.02 on the last sliver
of a tile leaving the frame. Holding them under 1.0 to the moment they clear
needs the 1536/2560 rung of six photographs at once — several MB on one page —
for frames that are 60–80% off-screen and travelling at the fastest part of the
run. Not bought.

**F2 · The entrance handover on mobile home is 140px.**
Two stretches on a phone (140px and 80px) where one panel's paragraph has left
the top of the window and the next panel's heading is on screen but still at
opacity 0, waiting for its own in-view trigger. It grew from nothing when the
mobile frame went from 374px to 520px tall. `REFERENCE-LANGUAGE.md` §F2 records
225px mobile as the figure this page has carried before, so it is inside the
site's own norm, and 0.17vh is far inside §2's 1.0.
