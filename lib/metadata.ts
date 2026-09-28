import type { Metadata } from "next";

// The site's public home; canonical and social URLs, the sitemap, robots.txt
// and llms.txt all resolve against it. On Vercel it is the project's production
// domain - Vercel sets it at build time on every deployment, previews included,
// so a preview's canonicals and social card still name production. A build
// anywhere else names the same production address; the old GitHub Pages one
// only redirects to it now (scripts/pages-redirect.mjs).
const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
export const siteUrl = vercelHost ? `https://${vercelHost}` : "https://articya.vercel.app";

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
