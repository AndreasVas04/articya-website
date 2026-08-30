export const meta = {
  title: "About | ArtiCYa",
  description:
    "Learn more about ArtiCYa, a Cyprus-based Erasmus+ Youth organization.",
};

export const hero = {
  // The oak, the two cattle and the village beyond, and it appears nowhere
  // else on the site.
  image: "/images/pt/IMG_4721.jpg",
  heading: "About ArtiCYa",
  text: "A Cyprus-based organization committed to non-formal education, creativity, and social inclusion through Erasmus+ programmes.",
};

// The body paragraphs staged as scroll scenes, in original order, regrouped
// into three fuller scenes. Each scene's groups join with single spaces to
// reproduce the source paragraphs exactly, so the visible text is unchanged
// (guarded by scripts/verify-text-parity.mjs).
export const story = [
  {
    groups: [
      "ArtiCYa is a Cyprus-based organization actively engaged in the implementation and promotion of Erasmus+ programmes, with a strong and consistent presence in the field of non-formal education.",
      "Over the years, the organization has demonstrated remarkable activity through dozens of participations in Youth Exchanges and Training Courses, both as a partner and as an active contributor to international cooperation.",
    ],
    image: {
      src: "/images/AboutImage1.jpg",
      alt: "The ArtiCYa team behind a table of Cypriot food at an intercultural evening",
    },
  },
  {
    groups: [
      "Rooted in the values of creativity, inclusion and social responsibility,",
      "ArtiCYa focuses particularly on the arts as a powerful tool for dialogue, self-expression and intercultural understanding.",
      "The organization is deeply committed to social inclusion, working to empower individuals from diverse backgrounds",
      "and to create safe, open and respectful spaces for participation and learning.",
    ],
    image: {
      src: "/images/AboutImage2.jpg",
      alt: "A discussion circle in the open air outside a mountain cabin",
    },
  },
  {
    groups: [
      "ArtiCYa places special emphasis on the promotion of equality and human rights,",
      "actively supporting LGBTQ+ individuals and advocating for diversity, acceptance and mutual respect within local and international communities.",
      "Furthermore, the organization strongly supports and promotes volunteering as a means of personal development, active citizenship and positive social impact.",
    ],
    image: {
      src: "/images/home-training.jpg",
      alt: "A team-building game during a training course",
    },
  },
];

// The closing paragraph, delivered by the gallery finale.
export const closing = {
  groups: [
    "Through its continuous engagement in Erasmus+ initiatives,",
    "ArtiCYa contributes meaningfully to the development of young people, youth workers and communities,",
    "fostering European values, solidarity and lifelong learning.",
  ],
};

// The wall — A1 Keystone. Five frames, in the order `gallery-finale.tsx` lays
// them out: the keystone first, then the four outer frames as they read on a
// desktop. The keystone is the one frame that scales, out to full window
// coverage.
//
// Five rather than seven, and that is what closes the two debts the seven-tile
// wall was carrying. The set holds ten frames that stand on their own and the
// page needed eleven distinct ones — a ground, three scene objects and seven
// tiles — so one slot had no photograph for it, and two compromises paid for
// that: `hero-2` took a third placement against the two-at-most rule and
// `IMG_4599` stayed on the wall re-cut rather than replaced. At five the page
// needs nine. `hero-2` is back to two placements, `IMG_4599` is off the site,
// and the wall's own ground is a defocused copy of the keystone's frame, which
// is one placement with it and not a second.
//
// Slots are assigned by aspect, because a slot cannot be resized and a frame
// put in the wrong one loses most of itself. The two widest desktop slots are
// 1.60:1 and 2.04:1 and take the panorama and the group on the rocks; the two
// on the left are 1.53:1 and 1.30:1 and take the cattle and the walkers. The
// keystone's slot is 1.20:1 on a desktop and 0.64:1 on a phone — the only
// portrait slot on the wall — and `IMG_4585` is the only portrait frame with
// the pixels to be painted at 2.60 and stay under 1.0 against its own source.
export const gallery = [
  {
    // The key carries a fragment because this one placement fetches a rung
    // above the ladder's cap; `scripts/responsive-images.mjs` carries why that
    // rung cannot live on the photograph's own srcset. The wall's out-of-focus
    // ground declares the same key and the same width, so the two are one URL
    // and one download.
    src: "/images/pt/IMG_4585.jpg#wall",
    alt: "The group on the path above the valley",
    // 76% is the vertical band on both viewports: on a desktop the slot keeps
    // 62.5% of the frame's height and 76% lands it at 28.5%–91.0%, which is
    // the far mountains down through the village and the path to the ferns.
    //
    // The horizontal number is a phone decision and nothing else. On a desktop
    // this 3:4 frame is narrower than its slot at every scale, so it is fitted
    // by width and `object-position`'s x does nothing — at rest the window sees
    // the whole width of it, and at full coverage the middle 80.1%, whatever
    // this says.
    position: "50% 76%",
    // On a phone the frame is the wider of the two and is fitted by its height,
    // so x is the whole of what the tile shows: 85.6% of the frame's width at
    // rest and 32.9% at full coverage, and the visible band travels 26.3 points
    // to the right between the two.
    //
    // Read at full resolution — 3840px, not the 768px variant the earlier
    // numbers came off — the four walkers stand at 2.2–9.7%, 11.9–20.4%,
    // 22.7–26.9% and 32.0–35.8% of the frame's width. The band's left edge is
    // the only one that reaches them at either end, and 50% puts it through a
    // body at *both*: 7.2% is walker one's chest at rest, and 33.6% is walker
    // four's trailing hand at full coverage. Solved against all four, the edge
    // clears every body only for x in 4.0–15.3% or 67.2–82.5%.
    //
    // 10% is in the first of those and the first is the better one: it holds
    // all four walkers whole at rest and walker four whole at full coverage,
    // where the second band holds three at rest and nobody at all at the end.
    // The margins are 0.76 points at rest and 0.87 at full coverage.
    positionCompact: "10% 76%",
  },
  {
    src: "/images/pt/IMG_4735-road.jpg",
    alt: "Cattle on the road into the village",
    // Both slots are anchored to the foot of the frame, which is the most of
    // the pole, the cable and the fence in its upper third that either can
    // clear: the desktop slot keeps 73.5% of the height and the phone's 70.2%,
    // so both still open above the fence line at 41%. The near animal is whole
    // in both — horns to hooves, 40%–71% of the frame — and the far one is cut
    // by the original frame's own right edge and cannot be made whole by any
    // window on it.
    position: "70% 100%",
    positionCompact: "50% 100%",
  },
  {
    src: "/images/hero-1.jpg",
    alt: "Participants hiking along a lakeside mountain trail",
    // Anchored to the foot of the frame at both viewports, so the walkers stand
    // on the ground they are walking on. The desktop slot keeps 96.1% of the
    // width and takes the trim off the trees on the left; the phone's keeps
    // 91.7% of the height and takes it off the sky. Nothing in either band cuts
    // a body the frame itself does not already cut — the foreground pair and
    // the head in the bottom-right corner run off the original's own edges.
    position: "85% 100%",
    positionCompact: "50% 100%",
  },
  {
    src: "/images/hero-3.jpg",
    alt: "Participants talking on mossy rocks in the forest",
    // The three sit between 14.5% and 76.3% of the frame's width. The desktop
    // slot keeps 74.7% of it and 15% puts the band at 3.8%–78.5%; the phone's
    // keeps 69.7% and 35% puts it at 10.6%–80.3%. All three are whole in both,
    // by 10.7 and 2.2 points on a desktop and 3.9 and 4.0 on a phone.
    position: "15% 100%",
    positionCompact: "35% 50%",
  },
  {
    src: "/images/pt/IMG_4619-ridge.jpg",
    alt: "The village in the valley under the ridge at evening",
    // 2.537:1 into a 2.036:1 slot and a 2.062:1 one, so it keeps 80.3% and
    // 81.3% of its width and stays the panorama it is. Centred on a desktop;
    // on the phone's 13vh band it is anchored low, where the ridge line and the
    // village under it are. There is no body in this frame to cut.
    position: "50% 50%",
    positionCompact: "50% 100%",
  },
];
