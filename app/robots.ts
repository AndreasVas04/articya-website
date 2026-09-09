import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/metadata";

export const dynamic = "force-static";

// Written into the export as robots.txt. On the project's GitHub Pages address
// it lives under the repository path, which a crawler does not read - the file
// it reads is the one at the root of andreasvas04.github.io - so until the site
// has a domain of its own this states the policy without enforcing it, and the
// sitemap is submitted by hand.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
