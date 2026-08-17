# OPEN-ITEMS.md

Review notes taken against the build at `a54c1d5`. Ordered by how they will be
worked, not by how they were noticed. `ART-DIRECTION.md` still owns intent and
the rejected list; this file is the live punch list and gets emptied as items
land.

The direction is right now. The previous round moved the site a long way. What
follows is what still stops it reading as award-level.

---

## B · Things that are broken

**B2 · The header detaches on the home page.**
Once the hero has expanded and the lede is on screen, the header reads as a
separate dark bar sitting above the photograph rather than floating on it. It
must sit inside the picture at every scroll position, on every page, the way it
does at the top of the hero.

---

## C · The wordless passage and "What we do"

These are one problem, not two.

**C1 · "What we do" is still bare.**
It is type on flat dark with no photograph and nothing else. The site opens with
strong pictures and then drops into a plain screen — it breaks the run. This
zone needs a photograph at full strength, or a composition of its own.

**C2 · The Youthpass line is in the wrong place.**
"Receive a Youthpass certificate recognizing your learning." now sits alone in
the passage between the two panels. As a sentence it does not carry a screen —
it reads as a fragment that lost its paragraph.

The *mechanism* is good: a heading arriving over a full-strength photograph,
clock-entered, heading first then body. Keep the mechanism. Apply it where it
has something to say — "What we do" is the obvious candidate, and it solves C1
at the same time.

Constraint: the text is frozen and `verify:text` compares document order, not a
set. Any move has to keep the flattened string byte-identical.

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

## E · Composition — the main work

**E1 · The Contact page is the standard now.**
Splitting one photograph, hard seam, the invitation and the channels on the
defocused half — that broke the flat, boring page that was there before and it
is the best composition on the site.

**E2 · Bring that level of invention to the rest.**
Not the same device repeated. The same *ambition*, drawn from the reference set:

- **About** — currently a mosaic of tiles. It should be composed, not arranged.
- **Youth Exchanges** and **Training Courses** — the alternating panels are
  correct as geometry, but they are the plainest expression of that geometry.
  Play with them the way Contact was played with.

The reference screenshots in `design/refs/` are the vocabulary: one photograph
treated two ways, type bound into the picture's depth, an organic edge instead
of a rectangle, a title that becomes a label, a hard seam used deliberately.

Every one of these must still clear §2 of `ART-DIRECTION.md` and must not
reintroduce anything from §3.
