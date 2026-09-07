// The two facts the offer panels and About's story scenes share about their
// photograph. They already share `.offer-panel-photo`; these were duplicated in
// both files, which is one edit away from the two drifting apart.

// How wide the photograph renders, so the browser fetches that width and no
// more: the 29% column on desktop, and below it the stacked box, which is
// 1.11 × 36svh = 39.96svh. The stacked declaration is `vh` rather than `svh`
// deliberately - `vh` is the large viewport, so on a phone it is the painted
// width plus the toolbar's share and never under it, and a declaration a hair
// over the paint is the safe side of this line. `max-width` can clamp the box
// on a narrow phone, which only moves the paint further under the declaration.
export const PHOTO_SIZES = "(min-width: 768px) 29vw, 39.96vh";

// Below `md` the box is 1.11 and every frame here is 3:4, so cover fits by
// width and 28.23% of the frame's height goes. Which end it goes from is a
// decision per frame.
//
// AboutImage1 is bottom-anchored. Everything it is on the site for sits low - 
// the tablecloth from 77.8% of the frame, the Cyprus island 81.0–92.5%, the
// olive wreath to 98.8%, both shoes - and what is above the banner is ceiling
// and roller-blind recess. Bottom-anchored the cut is 28.23% off the top, so
// the box's first row lands at 32.43% and clears the white tape at the
// banner's corners, at 35.47%, by three points of frame.
//
// home-training is top-anchored, and that is a cut rather than a preference:
// centred it takes 16.22% off the top, and the two participants behind the game
// have their hair crowns at 9.3% and 7.5% of the frame, so the centred cut
// crosses one at the brow and the other at the hairline. Top-anchored both are
// whole and what goes is the bottom third - defocused ground and the backs of
// the two foreground figures, which the frame's own edge already cuts.
//
// AboutImage2 stays centred, which is the initial value, so it is not listed.
// On desktop the box is the frame's own 3:4 and cover fits by height, which
// makes the vertical anchor a no-op there - checked against every rung of both
// ladders, none of which is narrower than 3:4.
export const PANEL_ANCHOR: Record<string, string | undefined> = {
  "/images/AboutImage1.jpg": "50% 100%",
  "/images/home-training.jpg": "50% 0%",
};
