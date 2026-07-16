export interface NavItem {
  label: string;
  href: string;
}

export const nav = {
  logo: {
    src: "/images/logo.png",
    alt: "ArtiCYa logo",
  },
  menuToggleLabel: "Toggle menu",
  items: [
    { label: "Home", href: "/" },
    { label: "Opportunities", href: "/opportunities/" },
    { label: "FAQ", href: "/faq/" },
    { label: "Contact", href: "/contact/" },
    { label: "About", href: "/about/" },
  ] satisfies NavItem[],
};

export const footer = {
  social: [
    {
      label: "Facebook",
      href: "https://www.facebook.com/p/Articya-61560558245829/",
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/articya4youth/",
    },
  ],
  copyright: "© 2026 ArtiCYa | All Rights Reserved",
};
