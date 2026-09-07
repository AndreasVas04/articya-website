import type { Metadata } from "next";

// The site's public home on GitHub Pages; canonical and social URLs resolve
// against it. The base path the deployment adds is already part of this value.
export const siteUrl = "https://andreasvas04.github.io/articya-website";

// The social card: the group walking the track above the reservoir, through
// the site's own grade, with the wordmark over it. One card for every page.
const ogImage = {
  url: `${siteUrl}/images/og.jpg`,
  width: 1200,
  height: 630,
  alt: "ArtiCYa",
};

// One metadata shape for every page, so the title, the canonical link and the
// social cards always carry that page's own strings rather than the inner
// pages inheriting the home card. `path` is the page's route ("/", "/about/").
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = `${siteUrl}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "ArtiCYa",
      type: "website",
      locale: "en_US",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
    },
  };
}
