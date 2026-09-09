import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/metadata";

export const dynamic = "force-static";

// The four routes, at the addresses the pages declare as canonical. The
// modification date is the build's: the site is exported whole on every
// deploy, so no page is older than the last one.
const routes = ["/", "/about/", "/faq/", "/contact/"];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map((path) => ({ url: `${siteUrl}${path}`, lastModified }));
}
