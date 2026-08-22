export const meta = {
  title: "ArtiCYa | Erasmus Youth+",
  description:
    "ArtiCYa is a Cyprus-based organization supporting youth participation in Erasmus+ projects.",
};

export const hero = {
  // Three slides, and the rotation is the first thing a visitor sees, so each
  // one has to be a picture rather than a detail. `hero-1` came out because it
  // is the ground under "What we do" a screen below and a photograph does not
  // appear twice on a page. `home-youth` came out because it is a macro: hands
  // and a rope filling the frame, no place and no horizon, and the expanded
  // card is the whole window — at that size a close-up of forearms reads as a
  // texture the page opened on. What is left is three frames of the same
  // subject at the same distance: a group above a valley, a group on a forest
  // road, a group at rest in the woods.
  slides: [
    "/images/pt/IMG_4585.jpg",
    "/images/hero-2.jpg",
    "/images/hero-3.jpg",
  ],
  location: "ArtiCYa · Cyprus",
  heading: "We are ArtiCYa",
  text: "A youth organization connecting young people in Cyprus with Erasmus+ opportunities, meaningful learning and real impact.",
  cta: { label: "Contact Us", href: "/contact/" },
};

export const whatWeDo = {
  title: "What we do",
  lead: "We work with young people in Cyprus and across Europe through Erasmus+ projects that bring people together to learn, share experiences and participate actively.",
  stats: [
    { num: "20+", label: "PROJECTS" },
    { num: "500+", label: "YOUTH" },
    { num: "15+", label: "COUNTRIES" },
  ],
  cards: [
    {
      badge: "\u{1F30D}",
      // The intercultural evening: young people behind a table of Cypriot
      // food, the Cyprus and Portugal flags on the wall. A photograph beside
      // a panel is an illustration of it, so it has to be of the thing —
      // a nature portrait says nothing about a youth exchange.
      image: "/images/AboutImage1.jpg",
      title: "Youth Exchanges",
      text: "International group experiences for young people aged 13–30 lasting 5 to 21 days. Participate through workshops, cultural activities and shared living experiences. No prior experience needed. Travel, accommodation and meals are fully covered. Receive a Youthpass certificate recognizing your learning.",
    },
    {
      badge: "\u{1F393}",
      // Twenty young people seated in a circle outside a mountain cabin —
      // a session, which is what a training course is.
      image: "/images/AboutImage2.jpg",
      title: "Training Courses",
      text: "Professional development programs for youth workers aged 18+ with no upper age limit, lasting 2 to 14 days. Focused on skill-building through workshops, simulations and networking opportunities. Open to educators, trainers and young people involved in youth work on topics like inclusion, digital tools and community engagement.",
    },
  ],
};

export const gain = {
  title: "What you gain",
  items: [
    "Real-world skills",
    "International friends",
    "Certified learning",
    "All expenses covered",
  ],
  text: "Travel across Europe with all expenses covered through Erasmus+ funding.",
  highlight: "Your adventure starts here.",
  cta: { label: "Contact Us", href: "/contact/" },
};
