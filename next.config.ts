import type { NextConfig } from "next";

// GITHUB_PAGES=true adds the repo basePath for deployment to
// andreasvas04.github.io/articya-website. Default build (Vercel/local)
// serves from the domain root.
const isGitHubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGitHubPages ? "/articya-website" : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  images: {
    unoptimized: true,
  },
  env: {
    // next/image skips basePath when images are unoptimized, so image
    // srcs get the prefix manually via withBasePath() in lib/utils.ts.
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
