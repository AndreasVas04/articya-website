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
// Four of the seven changed when the site stopped printing the same picture
// twice. `home-training` was here *and* on the third scene a screen above, the
// nearest thing on the site to a repeat; `hero-2` was here and on the home hero
// and the FAQ hero, three times. What replaced them was chosen by the shape of
// the slot as much as by the picture: the two 25vw slots are near-square on a
// desktop and a narrow upright on a phone, so they take portrait frames, and
// the two 60vw slots are 3.2:1, which is where the one ultra-wide frame in the
// set belongs. `hero-3` was in a 25vw slot showing 13.5% of itself on a phone
// and is now in a 60vw one showing 43.1%.
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
    src: "/images/pt/IMG_4735-road.jpg",
    alt: "Two cattle on the road into the village",
    // The widest slot on the wall is 3.2:1 and this frame is 1.125, so the
    // tile keeps 35.2% of its height — centred, a band across both animals'
    // backs with their legs outside it. Low on the frame it is one whole
    // animal on the road with the village behind her.
    position: "50% 80%",
  },
  {
    src: "/images/pt/IMG_4599.jpg",
    alt: "The hillside above the valley in hard midday sun",
  },
  {
    src: "/images/pt/IMG_4585.jpg",
    alt: "The group on the path above the valley",
  },
  {
    src: "/images/hero-3.jpg",
    alt: "Participants talking on mossy rocks in the forest",
  },
  {
    src: "/images/pt/IMG_4619-valley.jpg",
    alt: "The valley under open sky, the ridge running the width of it",
  },
  {
    src: "/images/home-youth.jpg",
    alt: "Hands joined by a rope web during a group exercise",
  },
];
