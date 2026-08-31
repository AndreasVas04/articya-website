// Every placement on the site must fetch at least as many pixels as it paints.
//
// The ratio the audits record is rendered-against-fetched: the device width a
// placement paints, over the width of the variant the browser chose for it. The
// About wall's centre tile sits at 0.995 on a phone because the 1984 rung is
// the first one at or above what it asks for, where it used to take 2560. Five
// thousandths is not a defect and it is not a number anyone will notice moving.
// This script is what notices.
//
// The check is static and it is exact, because the browser's own rule is:
//   requested = resolve(sizes, viewport) x DPR
//   chosen    = the first rung at or above requested, or the widest if none
// so the ratio exceeds 1.0 for exactly one reason — the ladder does not reach
// what `sizes` asks for. Every other case picks a rung at or above the paint.
// Checked against Chromium at 390x844 DPR 3, 1440x900 DPR 2 and 1920x900 DPR 2
// on the build this was written against: every figure below reproduces the
// browser's own `currentSrc` and painted width to within 2%, and the residual
// is that `sizes` is a declaration made once while the hero's box breathes.
//
// What it does not catch, stated so nobody trusts it further than it goes: a
// `sizes` string that under-declares the paint. That was the 1.2 defect —
// `100vw` on a frame `object-fit: cover` paints wider than its box — and it is
// held by `coverSizes()` at the declaration site, not here. This script trusts
// `sizes` and checks the ladder behind it.
//
// The JPEG tier is reported and never asserted. Its cap at 1366 is a decision
// (6.3): neither engine reaches that tier at all, so it is under-declared by
// construction rather than by drift.

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const OUT = path.join(process.cwd(), "out");

// The viewports every audit in design/ is taken at: the four heights a phone
// actually produces, and the desktop windows. 768x1024 is here for the
// `min-width: 768px` branch itself — a boundary no other row exercises.
const VIEWPORTS = [
  { w: 375, h: 553, dpr: 3 },
  { w: 390, h: 664, dpr: 3 },
  { w: 390, h: 750, dpr: 3 },
  { w: 390, h: 844, dpr: 3 },
  { w: 768, h: 1024, dpr: 2 },
  { w: 1440, h: 900, dpr: 2 },
  { w: 1920, h: 900, dpr: 2 },
];

// Formats whose ladder is meant to reach the paint. Anything else is reported.
const ASSERTED = new Set(["avif", "webp"]);

// A ratchet, not a gate, and for the same reason 2.8's contrast floor is one:
// the site does not start from zero. Two standing debts put placements over 1.0
// today, both of them recorded in OPEN-ITEMS and neither of them drift:
//
//   * `hero-3` is a 2316px source. 1.2 has the arithmetic — it is 3.1 MP where
//     the Portugal set is 48, it is upscaled, and PHOTO-MANIFEST's survey says
//     no incoming file improves it. Photography, not code.
//   * `BLEED_WIDTH` is 2880, which is 1440 CSS at DPR 2. 2.7 declined 3200 on
//     an LCP argument with the bytes measured. Every window wider than that,
//     and every phone box tall enough that a landscape frame cover-fits to
//     nearly three times the window's width, asks for more than the ladder
//     carries.
//
// Each entry is the worst value measured when it was written. The build fails
// if any of them gets worse, and fails on anything not on the list. Values are
// the ones this script computes, so they are comparable run to run.
const KNOWN = {
  // hero-3, source-capped at 2316px — 1.2, carried
  "hero-3|375x553@3": 2.32,
  "hero-3|390x664@3": 2.414,
  "hero-3|390x750@3": 2.414,
  "hero-3|390x844@3": 2.414,
  "hero-3|1440x900@2": 1.717,
  "hero-3|1920x900@2": 2.289,
  // full-bleed frames on a window wider than the 2880 cap — 2.7, by decision
  "IMG_4585|1920x900@2": 1.374,
  "hero-2|1920x900@2": 1.374,
  "IMG_4721|1920x900@2": 1.334,
  "IMG_4735-road|1920x900@2": 1.334,
  "hero-1|1920x900@2": 1.334,
  "IMG_4582-road|1920x900@2": 1.334,
  "IMG_4619-valley|1920x900@2": 1.334,
  // the two 103vw slides at 1440 DPR 2 — 2966 asked against the 2880 cap
  "IMG_4585|1440x900@2": 1.031,
  "hero-2|1440x900@2": 1.031,
  // landscape frames cover-fitted into a phone's tall box: the paint is ~2.9x
  // the window, so DPR 3 asks past 2880 whatever the window's own width is
  "hero-1|375x553@3": 1.147,
  "hero-1|390x664@3": 1.193,
  "hero-1|390x750@3": 1.193,
  "hero-1|390x844@3": 1.193,
  "IMG_4582-road|375x553@3": 1.133,
  "IMG_4582-road|390x664@3": 1.179,
  "IMG_4582-road|390x750@3": 1.179,
  "IMG_4582-road|390x844@3": 1.179,
};

// Slack on a recorded value, so a rounding difference is not a build failure.
const DRIFT = 0.005;

function walk(dir, onFile) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) walk(full, onFile);
    else onFile(full);
  }
}

/** srcset entries carrying `w` descriptors. An `x`-descriptor set has no width
 *  to compare against and returns null so the caller skips it. */
function parseSrcSet(value) {
  const rungs = [];
  for (const part of value.split(",")) {
    const bits = part.trim().split(/\s+/);
    if (bits.length < 2) continue;
    const m = /^(\d+)w$/.exec(bits[1]);
    if (!m) return null;
    rungs.push({ url: bits[0], width: Number(m[1]) });
  }
  return rungs.length ? rungs.sort((a, b) => a.width - b.width) : null;
}

/** One length of a `sizes` list, in CSS px at this viewport. Throws on a unit
 *  it cannot resolve — a silent zero would pass every assertion below. */
function resolveLength(raw, vp) {
  const text = raw.trim();
  const calc = /^calc\((.+)\)$/i.exec(text);
  if (calc) {
    const m = /^(.+?)\s*([+-])\s*(.+)$/.exec(calc[1]);
    if (!m) throw new Error(`cannot resolve calc(): ${text}`);
    const a = resolveLength(m[1], vp);
    const b = resolveLength(m[3], vp);
    return m[2] === "+" ? a + b : a - b;
  }
  const m = /^(-?[\d.]+)(px|vw|vh|svh|lvh|dvh|vmin|vmax)$/.exec(text);
  if (!m) throw new Error(`cannot resolve length: ${text}`);
  const n = Number(m[1]);
  switch (m[2]) {
    case "px":
      return n;
    case "vw":
      return (n / 100) * vp.w;
    case "vh":
    case "svh":
    case "lvh":
    case "dvh":
      return (n / 100) * vp.h;
    case "vmin":
      return (n / 100) * Math.min(vp.w, vp.h);
    default:
      return (n / 100) * Math.max(vp.w, vp.h);
  }
}

/** Does one media condition hold at this viewport? Only the width queries the
 *  site declares are understood; anything else throws rather than defaulting. */
function mediaMatches(condition, vp) {
  const m = /^\(\s*(min|max)-width:\s*(\d+)px\s*\)$/.exec(condition.trim());
  if (!m) throw new Error(`cannot resolve media condition: ${condition}`);
  return m[1] === "min" ? vp.w >= Number(m[2]) : vp.w <= Number(m[2]);
}

/** The CSS px width a `sizes` list resolves to — the first entry whose
 *  condition holds, and the bare length at the end if none does. */
function resolveSizes(sizes, vp) {
  for (const entry of sizes.split(",")) {
    const text = entry.trim();
    if (!text) continue;
    if (!text.startsWith("(")) return resolveLength(text, vp);
    const close = text.indexOf(")");
    if (close === -1) throw new Error(`cannot parse sizes: ${sizes}`);
    if (mediaMatches(text.slice(0, close + 1), vp)) {
      return resolveLength(text.slice(close + 1), vp);
    }
  }
  throw new Error(`no length in sizes: ${sizes}`);
}

const attr = (tag, name) => {
  const m = new RegExp(`\\b${name}="([^"]*)"`, "i").exec(tag);
  return m ? m[1] : null;
};

if (!existsSync(OUT)) {
  console.error("verify:placements — no out/ directory; run the build first.");
  process.exit(1);
}

const placements = [];
walk(OUT, (file) => {
  if (!file.endsWith(".html")) return;
  const page = "/" + path.relative(OUT, file).split(path.sep).join("/");
  const html = readFileSync(file, "utf8").replace(
    /<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi,
    " "
  );
  for (const m of html.matchAll(/<(img|source|link)\b[^>]*>/gi)) {
    const tag = m[0];
    const srcset = attr(tag, "srcset") ?? attr(tag, "imagesrcset");
    const sizes = attr(tag, "sizes") ?? attr(tag, "imagesizes");
    if (!srcset || !sizes) continue;
    const rungs = parseSrcSet(srcset);
    if (!rungs) continue; // `sizes="512x512"` on a rel=icon, or an x-descriptor set
    const type = attr(tag, "type");
    const ext = type
      ? type.replace(/^image\//, "")
      : path.extname(rungs[0].url).slice(1).replace("jpg", "jpeg");
    placements.push({
      page,
      sizes,
      rungs,
      ext,
      file: path.basename(rungs[0].url).replace(/-\d+\.\w+$/, ""),
    });
  }
});

if (!placements.length) {
  console.error("verify:placements — found no width-described placements in out/.");
  process.exit(1);
}

const over = new Map(); // key -> worst row
const under = [];
let cappedCount = 0;

for (const p of placements) {
  for (const vp of VIEWPORTS) {
    let css;
    try {
      css = resolveSizes(p.sizes, vp);
    } catch (err) {
      console.error(`verify:placements — ${p.page} ${p.file}: ${err.message}`);
      process.exit(1);
    }
    const requested = css * vp.dpr;
    const widest = p.rungs[p.rungs.length - 1].width;
    const chosen = p.rungs.find((r) => r.width >= requested)?.width ?? widest;
    const ratio = requested / chosen;
    if (!ASSERTED.has(p.ext)) {
      if (ratio > 1) cappedCount++;
      continue;
    }
    const key = `${p.file}|${vp.w}x${vp.h}@${vp.dpr}`;
    const row = { key, page: p.page, ext: p.ext, ratio, requested: Math.round(requested), chosen, sizes: p.sizes };
    if (ratio > 1) {
      const prev = over.get(key);
      if (!prev || ratio > prev.ratio) over.set(key, row);
    } else {
      under.push(row);
    }
  }
}

const unlisted = [];
const worse = [];
for (const [key, row] of over) {
  const recorded = KNOWN[key];
  if (recorded === undefined) unlisted.push(row);
  else if (row.ratio > recorded + DRIFT) worse.push({ ...row, recorded });
}
const cleared = Object.keys(KNOWN).filter((k) => !over.has(k));

under.sort((a, b) => b.ratio - a.ratio);
console.log(
  `verify:placements — ${placements.length} placements x ${VIEWPORTS.length} viewports, ` +
    `${[...ASSERTED].join("/")} asserted, jpeg reported.`
);
console.log("  tightest placement still under 1.0:");
const seen = new Set();
for (const r of under) {
  if (seen.has(r.key)) continue;
  seen.add(r.key);
  if (seen.size > 8) break;
  console.log(`    ${r.ratio.toFixed(3)}  ${r.key}  ${r.requested}px asked, ${r.chosen} rung`);
}
console.log(`  ${over.size} placement/viewport pairs over 1.0, all of them recorded in KNOWN.`);
if (cappedCount) {
  console.log(`  jpeg tier over 1.0 at ${cappedCount} placement-viewports — the 1366 cap of 6.3, expected.`);
}
if (cleared.length) {
  console.log(
    `  KNOWN entries that now clear 1.0 and can be deleted: ${cleared.join(", ")}`
  );
}

if (unlisted.length || worse.length) {
  console.error("\nverify:placements FAILED.");
  for (const r of unlisted.sort((a, b) => b.ratio - a.ratio)) {
    console.error(
      `  NEW    ${r.ratio.toFixed(3)}  ${r.key}  asks ${r.requested}px, widest rung ${r.chosen}  ${r.page}\n` +
        `         sizes="${r.sizes}"`
    );
  }
  for (const r of worse.sort((a, b) => b.ratio - a.ratio)) {
    console.error(
      `  WORSE  ${r.ratio.toFixed(3)} against ${r.recorded.toFixed(3)}  ${r.key}  asks ${r.requested}px, widest rung ${r.chosen}`
    );
  }
  console.error(
    "\nEither the ladder needs a rung above what this placement asks for, or the\n" +
      "placement is painting larger than it should. Do not close it by lowering\n" +
      "`sizes` below the paint — that is the 1.2 defect, and it moves the failure\n" +
      "from this script to the screen. A value that is genuinely a decision goes\n" +
      "in KNOWN with the item that decided it, and never without one."
  );
  process.exit(1);
}

console.log("verify:placements — nothing over 1.0 that is not recorded. PASS");
