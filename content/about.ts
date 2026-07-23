export const meta = {
  title: "About | ArtiCYa",
  description:
    "Learn more about ArtiCYa, a Cyprus-based Erasmus+ Youth organization.",
};

export const hero = {
  image: "/images/About.jpg",
  heading: "About ArtiCYa",
  text: "A Cyprus-based organization committed to non-formal education, creativity, and social inclusion through Erasmus+ programmes.",
};

export const background = "/images/AboutBack.jpg";

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

export const gallery = [
  {
    src: "/images/hero-1.jpg",
    alt: "Participants hiking along a lakeside mountain trail",
  },
  { src: "/images/AboutImage2.jpg", alt: "Youth exchange activities" },
  { src: "/images/AboutImage1.jpg", alt: "ArtiCYa team activities" },
  {
    src: "/images/hero-3.jpg",
    alt: "Participants talking on mossy rocks in the forest",
  },
  {
    src: "/images/home-training.jpg",
    alt: "A team-building game during a training course",
  },
  { src: "/images/hero-2.jpg", alt: "The group walking a shaded forest road" },
  {
    src: "/images/home-youth.jpg",
    alt: "Hands joined by a rope web during a group exercise",
  },
];
