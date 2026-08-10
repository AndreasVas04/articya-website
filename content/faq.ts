export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqSection {
  heading: string;
  items: FaqItem[];
}

export const meta = {
  title: "FAQ | ArtiCYa",
  description:
    "Frequently asked questions about Erasmus+ opportunities with ArtiCYa.",
};

export const hero = {
  image: "/images/FAQ.jpg",
  heading: "Frequently Asked Questions",
  text: "Here you can find answers to the most common questions about Erasmus+ opportunities and participation with ArtiCYa.",
};

export const arrow = "▼";

export const sections: FaqSection[] = [
  {
    heading: "Erasmus+",
    items: [
      {
        question: "What is Erasmus+?",
        answer:
          "Erasmus+ is a European Union programme that supports education, training, youth and sport activities across Europe.",
      },
      {
        question: "Who can participate?",
        answer:
          "Erasmus+ opportunities are open to young people usually aged 18–30, depending on the specific project.",
      },
    ],
  },
  {
    heading: "Costs & safety",
    items: [
      {
        question: "Do I need to pay?",
        answer:
          "No. Erasmus+ projects cover the main costs such as accommodation, food and travel, according to programme rules. Participants may need to pay travel costs in advance (such as flights or transport to the venue). These expenses are reimbursed after the project, according to Erasmus+ rules and the approved travel budget.",
      },
      {
        question: "Is it safe to participate?",
        answer:
          "Yes. Projects are organised by accredited organisations and follow Erasmus+ quality and safety standards.",
      },
      {
        question: "Who handles the travel arrangements?",
        answer:
          "Travel arrangements are usually organised by the participants, following guidelines provided by the hosting or coordinating organisation. Costs are reimbursed according to Erasmus+ rules.",
      },
    ],
  },
  {
    heading: "Experience & participation",
    items: [
      {
        question: "Do I need previous experience?",
        answer:
          "No previous experience is required. Motivation and interest are usually more important than skills.",
      },
      {
        question: "What will I gain from participating?",
        answer:
          "Participants gain international experience, new skills, cultural understanding and opportunities for personal growth.",
      },
      {
        question: "Will I receive any proof of my participation?",
        answer:
          "At the end of the project, participants receive a Youthpass certificate that recognises the learning outcomes and skills gained through their participation.",
      },
    ],
  },
  {
    heading: "Applications",
    items: [
      {
        question: "How do I apply?",
        answer:
          "Each opportunity has its own application process. You can find details on the Opportunities page or contact us directly.",
      },
      {
        question: "What happens if I am selected?",
        answer:
          "If selected, you will receive detailed information about preparation, travel and participation.",
      },
    ],
  },
];
