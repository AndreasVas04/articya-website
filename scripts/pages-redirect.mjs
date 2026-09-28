// The GitHub Pages address, kept alive as a pointer to the site's real home.
//
// The site is built and served by Vercel. The project address on GitHub Pages
// is where every link shared before the move points, so instead of a second
// copy of the site - one more build to keep in step, and two sets of pages
// competing for the same words in a search index - it serves one small page
// per route that sends the reader to the same page on the new address:
// `location.replace` for a browser, a zero-second meta refresh for anything
// that does not run scripts, and a canonical link for a crawler. The 404 page
// does the same for any other path, so an old deep link keeps its path.
//
//   node scripts/pages-redirect.mjs   # writes out-redirect/
//
// TARGET is the address in `lib/metadata.ts` - the production domain the
// Vercel project serves - and ROUTES are the pages in `app/sitemap.ts`.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "out-redirect");
const TARGET = "https://articya.vercel.app";
const BASE = "/articya-website";
const ROUTES = ["/", "/about/", "/faq/", "/contact/"];

const page = (url, script) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ArtiCYa</title>
<link rel="canonical" href="${url}">
<script>${script}</script>
<meta http-equiv="refresh" content="0; url=${url}">
</head>
<body style="background:#141c16">
<a href="${url}" style="color:#ede2c8">${url}</a>
</body>
</html>
`;

fs.rmSync(OUT, { recursive: true, force: true });
for (const route of ROUTES) {
  const url = TARGET + route;
  const dir = path.join(OUT, route);
  fs.mkdirSync(dir, { recursive: true });
  // The query and the fragment travel with the reader.
  fs.writeFileSync(
    path.join(dir, "index.html"),
    page(url, `location.replace(${JSON.stringify(url)}+location.search+location.hash)`)
  );
}
// Any other path under the project address: the same path on the new host.
fs.writeFileSync(
  path.join(OUT, "404.html"),
  page(
    `${TARGET}/`,
    `location.replace(${JSON.stringify(TARGET)}+(location.pathname.replace(/^${BASE.replace(/\//g, "\\/")}/,"")||"/")+location.search+location.hash)`
  )
);
console.log(`pages-redirect: ${ROUTES.length} routes and a 404 pointing at ${TARGET}.`);
