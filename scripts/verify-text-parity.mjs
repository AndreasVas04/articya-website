// Compares the visible text of the original static HTML pages against the
// exported Next.js pages, character for character. Run after `next build`.

import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();

const pages = [
  { name: "home", original: "index.html", exported: "out/index.html" },
  { name: "about", original: "about.html", exported: "out/about/index.html" },
  {
    name: "opportunities",
    original: "opportunities.html",
    exported: "out/opportunities/index.html",
  },
  { name: "contact", original: "contact.html", exported: "out/contact/index.html" },
  { name: "faq", original: "faq.html", exported: "out/faq/index.html" },
];

const namedEntities = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  copy: "©",
  nbsp: " ",
  ndash: "–",
  mdash: "—",
  hellip: "…",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
};

function decodeEntities(text) {
  return text.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, entity) => {
    if (entity.startsWith("#")) {
      const code =
        entity[1]?.toLowerCase() === "x"
          ? parseInt(entity.slice(2), 16)
          : parseInt(entity.slice(1), 10);
      return Number.isNaN(code) ? match : String.fromCodePoint(code);
    }
    return namedEntities[entity.toLowerCase()] ?? match;
  });
}

function visibleText(html) {
  const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] ?? html;
  return decodeEntities(
    body
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<(script|style|noscript|template)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/\s+/g, " ")
    .trim();
}

function firstDiff(a, b) {
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    if (a[i] !== b[i]) return i;
  }
  return a.length === b.length ? -1 : len;
}

let failed = false;

for (const page of pages) {
  let original;
  let exported;
  try {
    original = visibleText(readFileSync(path.join(root, page.original), "utf8"));
    exported = visibleText(readFileSync(path.join(root, page.exported), "utf8"));
  } catch (err) {
    failed = true;
    console.error(`FAIL  ${page.name}: ${err.message}`);
    continue;
  }

  const diff = firstDiff(original, exported);
  if (diff === -1) {
    console.log(`PASS  ${page.name} (${original.length} chars)`);
  } else {
    failed = true;
    console.error(`FAIL  ${page.name}: first difference at char ${diff}`);
    console.error(`  original: …${original.slice(Math.max(0, diff - 40), diff + 40)}…`);
    console.error(`  exported: …${exported.slice(Math.max(0, diff - 40), diff + 40)}…`);
  }
}

process.exit(failed ? 1 : 0);
