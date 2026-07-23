// Post-processes the static export in out/ for GitHub Pages:
//   1. Writes .nojekyll so paths beginning with an underscore (_next, and
//      anything else) are served instead of being run through Jekyll.
//   2. Drops every image file no exported page references. The responsive
//      pipeline serves each photograph from public/images/variants/, so the
//      full-resolution graded masters, the ungraded _originals and the legacy
//      background masters are all unreferenced — no visitor requests them, so
//      they are removed from the published output, the same reasoning that
//      always excluded _originals.

import { readFileSync, writeFileSync, readdirSync, statSync, rmSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const out = path.join(process.cwd(), "out");

writeFileSync(path.join(out, ".nojekyll"), "");

function walk(dir, onFile) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) walk(full, onFile);
    else onFile(full);
  }
}

// Every image path a browser actually requests: the src/srcset/href/
// imagesrcset of the rendered markup. Script and style blocks are stripped
// first — the RSC hydration payload serialises the content image props (the
// masters' own paths) as data strings, but nothing fetches them; only the
// <picture>/<img>/<link> markup, which points at variants, is a real request.
// basePath prefixes are normalised away by keying on the "/images/…" tail.
const referenced = new Set();
const IMG_URL = /\/images\/[^"'\s,)]+?\.(?:jpe?g|png|webp|avif)/gi;
walk(out, (file) => {
  if (!file.endsWith(".html")) return;
  const html = readFileSync(file, "utf8").replace(
    /<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi,
    " "
  );
  for (const m of html.matchAll(IMG_URL)) {
    referenced.add(m[0].slice(m[0].indexOf("/images/")));
  }
});

let removed = 0;
let removedBytes = 0;
const imagesDir = path.join(out, "images");
walk(imagesDir, (file) => {
  const url = "/images/" + path.relative(imagesDir, file).split(path.sep).join("/");
  if (referenced.has(url)) return;
  removedBytes += statSync(file).size;
  removed++;
  rmSync(file);
});
// Remove the now-empty _originals directory (and any other emptied folder).
rmSync(path.join(imagesDir, "_originals"), { recursive: true, force: true });

console.log(
  `postexport: kept ${referenced.size} referenced images, dropped ${removed} unreferenced (${(removedBytes / 1e6).toFixed(1)}MB).`
);
