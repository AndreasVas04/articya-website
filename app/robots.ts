import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/metadata";

export const dynamic = "force-static";

// Written into the export as robots.txt. On a domain of its own (Vercel) it is
// at the root, where crawlers read it. On the GitHub Pages project address it
// lives under the repository path, which a crawler does not read - the file it
// reads is the one at the root of andreasvas04.github.io - so there it states
// the policy without enforcing it, and the sitemap is submitted by hand.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
