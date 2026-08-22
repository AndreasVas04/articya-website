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

// The wall, in tile order. The first entry is the centre tile — the one the
// zoom carries out to full bleed — and the six after it are the ring, reading
// as the slots are laid out in `gallery-finale.tsx`.
//
// Every tile has to stand on its own, because at rest they are seven equal
// pictures with no ground between them and nothing to subordinate one to
// another. Three did not. The rope macro was a fragment and the only tile that
// was neither a landscape nor people, so it broke the set as well; the valley
// in a 2.13:1 slot was open sky and nothing else, no subject in the rectangle
// at all; and the wooded bank, centred in a near-square slot, was one trunk.
//
// Slots are assigned by aspect first, because a slot cannot be resized and a
// frame put in the wrong one loses most of itself: the two 25vw slots are 1:1
// on a desktop and 1:3.5 on a phone and take the portrait frames, the two 60vw
// slots are 3.2:1 and take the two panoramas, and the two 40vw slots are
// 2.13:1. `IMG_4585` moved out of an upright slot into one of those, where its
// valley reads as the panorama it is (35.2% of the frame on a desktop, 82.1%
// on a phone), and `IMG_4735-road` came the other way.
//
// One slot has no photograph. The set holds thirteen usable frames, this page
// needs eleven distinct ones — a ground, three scenes and seven tiles — and
// after the three above come out, ten qualify. `IMG_4599` is the tenth and it
// stays under protest: re-cut low it is a mossy bank running away under the
// trees rather than a single trunk, which is a place, but it is the weakest
// tile on the wall and only new photography closes it. The alternative was
// `IMG_4582-road`, and that is worse on both counts — the chain-link fence no
// pan clears, and a tile of road surface.
export const gallery = [
  {
    src: "/images/hero-1.jpg",
    alt: "Participants hiking along a lakeside mountain trail",
    // A 2:1 slot over a 1.356 frame keeps 67.8% of its height, and centred
    // that band cut the two nearest walkers at the thigh. Anchored to the
    // foot of the frame they stand on the ground they are walking on.
    position: "50% 100%",
  },
  {
    src: "/images/pt/IMG_4619-ridge.jpg",
    alt: "The village in the valley under the ridge at evening",
    // 2.535:1, and the widest slot is 3.2:1, so it keeps 79.3% of its height —
    // the best fit of anything in the set for this slot. Centred is right: the
    // ridge runs the width of the frame and the village sits under it.
  },
  {
    src: "/images/pt/IMG_4599.jpg",
    alt: "A moss-covered wall running away under the trees",
    // The set's one ultra-portrait frame at 1:2.19, so it takes the upright
    // slot — 63.1% of itself on a phone, more than any other frame manages
    // there. Low on the frame, where the wall is: centred, the slot lands on
    // the trunks and the tile has no subject.
    position: "50% 80%",
  },
  {
    src: "/images/hero-2.jpg",
    alt: "The group walking a shaded forest road",
    // The other upright slot, and the crop is chosen around this frame's
    // overhead cable: it enters the top-left corner and runs down to a pole at
    // a third of the width. A desktop slot keeps 75% of the height and takes
    // it off the top; a phone keeps 38.5% of the width and takes it off the
    // left. 62% 100% is the one pair that clears the cable at both and still
    // holds whole walkers on the road.
    position: "62% 100%",
  },
  {
    src: "/images/hero-3.jpg",
    alt: "Participants talking on mossy rocks in the forest",
  },
  {
    src: "/images/pt/IMG_4735-road.jpg",
    alt: "Cattle on the road into the village",
    // 2.13:1 over a 1.125 frame keeps 52.7% of the height. Low, so the near
    // animal is whole from her horns to her hooves; centred, the band ran
    // across both animals' backs and left their legs outside it.
    position: "50% 80%",
  },
  {
    src: "/images/pt/IMG_4585.jpg",
    alt: "The group on the path above the valley",
    // A 2.13:1 band of a 3:4 frame, so where the band sits is the whole
    // composition. At 35% it is the village, the terraces and the far
    // mountains with the walkers on the path below them.
    position: "50% 35%",
  },
];
