// Build-time responsive image variants, downstream of the grade.
//
// Order of the pipeline is fixed: _originals -> grade -> responsive variants.
// The grade is re-run here in floating point (via gradeToRaw) so each variant
// is resized from the graded *pixels* and encoded exactly once. A variant is
// never a re-encode of the already-lossy graded JPEG master, and _originals is
// never touched. Every referenced photograph is emitted at several widths — a
// ladder capped to how large the photo is ever displayed — in AVIF, WebP and
// JPEG, plus a manifest the shared <ResponsiveImage> component reads to build
// its srcset/sizes markup.
//
//   node scripts/responsive-images.mjs          # generate (cached; no-op if fresh)
//   node scripts/responsive-images.mjs --force  # rebuild every variant
//
// Output lives in public/images/variants/ (git-ignored — these are pure build
// artefacts, regenerated in CI). It is deterministic from committed inputs
// (the originals and the grade), so it is never committed.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { gradeToRaw, gradedFiles, productionStrength } from "./grade-photos.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "public/images/_originals");
const OUT = path.join(ROOT, "public/images/variants");
const MANIFEST = path.join(OUT, "manifest.json");

// Width ladder in device pixels. Each image emits the rungs at or below the
// largest size it is ever displayed (never upscaled); the cap keeps a 6000px
// source from ever emitting more than a full-bleed hero can use.
// 1152 is the phone rung: a 393px viewport at DPR 3 asks for 1120 device px
// for a 95vw image, and without a step between 1024 and 1366 it takes the
// 1366 and throws a third of the pixels away.
//
// 1984 is the second phone rung, and it exists for the same reason one step
// higher up. Resolved from the built markup at 390×844 DPR 3, three placements
// land in a cluster just above 1920 — the About wall's centre tile at 1976,
// the home hero's poster and first slide at 1956, and the wall's upper-left
// 3.2:1 tile at 1928 — and with 2560 as the next rung all three fetched a file
// 30% wider than the screen could show. The next demand above the cluster is
// 2477 (the gains and closing ground on a phone), which is far enough clear to
// stay on 2560; nothing at 1440×900 DPR 2 falls in the gap at all.
//
// 1984 rather than 1976 because every rung above 384 on this ladder is a
// multiple of 64 (1366 excepted, and documented above), and 1984 is the first
// one at or above the cluster's top. Adding a rung above 1920 cannot move
// anything that currently takes 1920 — the browser takes the smallest rung at
// or above what `sizes` asks for, and every 1920 fetch on the site asks for
// 1728 or less on a desktop and 1900 on a phone.
const LADDER = [384, 640, 768, 1024, 1152, 1366, 1600, 1920, 1984, 2560, 2880];
const MAX_WIDTH = 2560;

// One rung above the cap, and only the frames that are painted edge to edge
// may reach it. 2560 was 320px short of a retina desktop — 1440 CSS at DPR 2
// is 2880 device px — so every full-bleed Portugal frame was magnified 1.13
// over the variant it fetched while sitting at 0.19–0.71 against its own 27 to
// 49 MP source. The pixels existed; the ladder had no rung that reached them.
//
// 2880 is the requirement and not a round number above it. 3200 was declined
// in Section 1 on an LCP argument and the argument still holds at the measured
// bytes: the home hero's AVIF is 1120KB at 2560, 1367KB at 2880 and 1629KB at
// 3200, so the rung that closes the defect costs 247KB and the one that
// overshoots it by 320px costs 509KB. The hero declares 103vw for its own push
// and therefore asks for 2966 — 1.030 over this rung at the peak of a
// transient, and 1.000 at rest, which is what the table measures.
//
// What keeps the rung off everything else is the emit filter below, not
// `sizes`. An earlier note here claimed that nothing on the site resolves
// above 2048 at any viewport; that was never true and it is worth being exact
// about, because a future session would otherwise size a ladder against it.
//
// A full-bleed placement declares the width it is *painted*, and a portrait
// frame cover-fitted into a landscape window is fitted by its height and
// painted wider than the window. So these placements resolve well past 2048 by
// design: 2880 at 1440×900 DPR 2 for all of them, and on a phone at 390×844
// DPR 3 they run 1900 (the About ground) to 5588 (hero slide 3, an ultra-wide
// frame in a portrait window). Of the placements that are *not* full-bleed,
// six of the seven About wall tiles peak at 1928 and every panel and scene
// object at 835 — but the wall's centre tile reaches 3744, which is why SCALED
// exists directly below. The 2048 sentence skipped over it.
//
// The true guarantee is narrower and the code enforces it: BLEED_WIDTH is
// emitted only for frames in this set, and a width above it only under a
// SCALED key of its own. A frame in this set that also appears somewhere small
// — hero-2 is the FAQ ground and an About wall tile — is safe because the wall
// tile's `sizes` asks for 768 and the browser takes the rung it asks for.
//
// The three small heroes are here because they *are* full-bleed placements.
// Their masters have been under 2880, so the cap below has been giving them
// their own source width instead of the rung — which is a resolution debt, not
// a property of the ladder, and it disappears the moment a larger original is
// ingested. `assertLadder` reports which members are still source-capped
// rather than leaving that to a comment that goes stale.
const BLEED_WIDTH = 2880;
const FULL_BLEED = new Set([
  "/images/pt/IMG_4585.jpg", // home hero: the poster and its first slide
  "/images/pt/IMG_4619-valley.jpg", // home: "What you gain" and the closing
  "/images/pt/IMG_4582-road.jpg", // home: the panels' join
  "/images/pt/IMG_4721.jpg", // the About ground
  "/images/pt/IMG_4735-road.jpg", // the Contact ground
  "/images/hero-1.jpg", // the ground under "What we do"
  "/images/hero-2.jpg", // the FAQ ground and hero slide 2
  "/images/hero-3.jpg", // hero slide 3
]);

// What the two constants above actually promise, checked rather than asserted
// in prose. The first two throw: they are invariants the ladder is built on.
// The third only reports, because a source-capped full-bleed frame is a
// photograph problem and the build must still produce the site.
// Display width of every full-bleed frame, from metadata alone — no decode and
// no grade, so the checks below can run before any encoding starts. A cropped
// frame's width is its source's width times the crop's own fraction, which is
// what `extract` will take.
async function bleedWidths() {
  const dims = new Map();
  for (const key of FULL_BLEED) {
    const crop = CROPS[key];
    const file = crop ? crop.file : key.replace("/images/", "");
    const { width, height, orientation = 1 } = await sharp(path.join(SRC, file)).metadata();
    const disp = displayDims(width, height, orientation);
    dims.set(key, Math.round(disp.w * (crop ? crop.width : 1)));
  }
  return dims;
}

function assertLadder(dims) {
  for (let i = 1; i < LADDER.length; i++) {
    if (LADDER[i] <= LADDER[i - 1]) {
      throw new Error(`LADDER must ascend and not repeat: ${LADDER[i - 1]} then ${LADDER[i]}`);
    }
  }
  if (LADDER[LADDER.length - 1] !== BLEED_WIDTH || !LADDER.includes(MAX_WIDTH)) {
    throw new Error(`LADDER must end at BLEED_WIDTH (${BLEED_WIDTH}) and carry MAX_WIDTH (${MAX_WIDTH})`);
  }
  for (const [key, { width }] of Object.entries(SCALED)) {
    if (width <= BLEED_WIDTH) {
      throw new Error(`SCALED "${key}" at ${width} is not above BLEED_WIDTH; it belongs on the ladder`);
    }
  }
  const short = [...FULL_BLEED].filter((k) => dims.get(k) < BLEED_WIDTH);
  if (short.length) {
    console.log(
      `  full-bleed frames still under ${BLEED_WIDTH}px of source, capped at their own width: ` +
        short.map((k) => `${path.basename(k)} ${dims.get(k)}`).join(", ")
    );
  }
}

// One placement on the site is scaled past the window — the About wall's centre
// tile, which reaches 130vw at full coverage and is therefore painted 1872 CSS
// px wide at 1440×900, 3744 device px at DPR 2. That is 864 above the bleed
// cap, and the rung cannot simply be added to the photograph's own ladder: a
// browser takes the first rung at or above what `sizes` asks for, and the home
// hero asks 2966 of this same frame, so a 3840 rung in that srcset would land
// on the home LCP and take it from 1367KB to 2169KB.
//
// So the rung is published under a key of its own. Same graded pixels and the
// same file basename, so only the extra width is written — one file per format,
// 2169/3449/4473KB — and only the srcset built from this key lists it. The page
// that fetches it is /about/, the tile is the last thing on it and is not the
// LCP, and it lazy-loads: 802KB of AVIF over the 2880 rung, spent below three
// scene photographs, against a home LCP that does not move at all.
const SCALED = {
  "/images/pt/IMG_4585.jpg": { key: "/images/pt/IMG_4585.jpg#wall", width: 3840 },
};

// Frames published as a crop of an original rather than as the whole picture.
// A power line crossing a sky cannot be masked out of a photograph and cannot
// be cropped out with `object-position` either — a portrait source in a phone's
// viewport is fitted by its height, so the browser shows every row of it
// whatever the position says. So the cut is made here, in the pixels, once:
// every variant and both viewports then get the same frame. Fractions of the
// display-oriented image; a cropped frame is a manifest entry of its own and
// its source keeps its uncropped one.
// Every cut here is the largest rectangle of its frame that holds no cable,
// found by measuring where the cables actually run rather than by trimming
// until the picture behaved. A crop is the last resort for a cable and the
// only one: contrast is bought with plate strength, never by taking a frame
// apart.
const CROPS = {
  // The lane down through the village at blue hour, full width. The cables
  // descend from both top corners onto the pole and the chimney and are clear
  // by 0.52; below that the whole lane is in — the granite houses and the green
  // railings on the right that the old 69.5% strip cut away.
  "/images/pt/IMG_4739-lane.jpg": {
    file: "pt/IMG_4739.jpg",
    left: 0,
    top: 0.52,
    width: 1,
    height: 0.48,
  },
  // The road between the stone walls. One heavy cable crosses the whole of the
  // overcast sky and lands on the pole, with a second running back left off it;
  // the lowest of them sits at 0.44, so the cut is there and the mist over the
  // far hills comes back with the extra band.
  "/images/pt/IMG_4582-road.jpg": {
    file: "pt/IMG_4582.jpg",
    left: 0,
    top: 0.44,
    width: 1,
    height: 0.56,
  },
  // The valley in warm light — open sky over the ridge. The cables are a single
  // bundle in the bottom-right corner, entering the right edge at 0.71 and
  // leaving the bottom edge at 0.55. A corner is not a rectangle, so the cut
  // has to take a band off two sides; of every pair that clears the bundle this
  // one keeps the most picture with the ridge still whole.
  "/images/pt/IMG_4619-valley.jpg": {
    file: "pt/IMG_4619.jpg",
    left: 0,
    top: 0,
    width: 0.7,
    height: 0.895,
  },
  // The same valley, cut for a wide slot: the village in the bowl under the
  // ridge, with the sky off the top. `-valley` keeps the sky because it is a
  // ground a whole screen stands on; in a 3.2:1 tile that same frame is sky
  // and nothing else — 30.6% of its height, and the ridge is the last third of
  // it. This is a strict sub-rectangle of `-valley`, which is what clears it
  // of the corner cable bundle: same left edge, same width, and its foot is
  // `-valley`'s foot.
  "/images/pt/IMG_4619-ridge.jpg": {
    file: "pt/IMG_4619.jpg",
    left: 0,
    top: 0.55,
    width: 0.7,
    height: 0.345,
  },
  // The two cattle on the road, the village behind. The pole and its cables own
  // the whole upper third of this frame; the lower two thirds are the picture.
  "/images/pt/IMG_4735-road.jpg": {
    file: "pt/IMG_4735.jpg",
    left: 0,
    top: 1 / 3,
    width: 1,
    height: 2 / 3,
  },
};

// Encode settings. Quality first: at or above the grade's q88 floor, and
// verified against the graded master at display size (flat skies/walls at
// 1:1). AVIF has no 8x8 blocking so it holds flat regions at a lower number;
// WebP and JPEG sit higher. Every variant is one encode from graded pixels.
const FORMATS = [
  { ext: "avif", mime: "image/avif", encode: (s) => s.avif({ quality: 62, effort: 4, chromaSubsampling: "4:2:0" }) },
  { ext: "webp", mime: "image/webp", encode: (s) => s.webp({ quality: 82, effort: 5, smartSubsample: true }) },
  { ext: "jpeg", mime: "image/jpeg", encode: (s) => s.jpeg({ quality: 90, mozjpeg: true }) },
];
const CONFIG_VERSION = 1;

const force = process.argv.includes("--force");

// EXIF orientation, baked into the variant pixels (not carried as a flag): the
// component sets width/height and srcset from the *displayed* dimensions, so
// the pixels must already be display-oriented. The grade keeps the flag on the
// master to leave it byte-identical; variants own their markup, so baking is
// cleaner here. Only rotations appear in this set (AboutImage1 is orientation
// 6); the flip cases are handled for completeness.
function applyOrientation(pipe, o) {
  switch (o) {
    case 2: return pipe.flop();
    case 3: return pipe.rotate(180);
    case 4: return pipe.flip();
    case 5: return pipe.rotate(90).flop();
    case 6: return pipe.rotate(90);
    case 7: return pipe.rotate(270).flop();
    case 8: return pipe.rotate(270);
    default: return pipe;
  }
}

const displayDims = (w, h, o) => (o >= 5 && o <= 8 ? { w: h, h: w } : { w, h });

// Signature over every input that can change the output, so a warm tree is an
// instant no-op and any change to an original, the grade, this script or the
// config forces a rebuild.
function signature() {
  const parts = [`v${CONFIG_VERSION}`, `strength${productionStrength}`, `ladder${LADDER.join(",")}`,
    `cap${MAX_WIDTH}/${BLEED_WIDTH}`, `bleed${[...FULL_BLEED].sort().join(",")}`,
    `fmt${FORMATS.map((f) => f.ext).join(",")}`, `crops${JSON.stringify(CROPS)}`,
    `scaled${JSON.stringify(SCALED)}`];
  for (const f of ["scripts/responsive-images.mjs", "scripts/grade-photos.mjs"]) {
    parts.push(`${f}:${fs.statSync(path.join(ROOT, f)).mtimeMs}`);
  }
  for (const file of gradedFiles.slice().sort()) {
    const st = fs.statSync(path.join(SRC, file));
    parts.push(`${file}:${st.size}:${st.mtimeMs}`);
  }
  return parts.join("|");
}

async function run() {
  assertLadder(await bleedWidths());

  const sig = signature();
  if (!force && fs.existsSync(MANIFEST)) {
    try {
      const prev = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
      if (prev.signature === sig) {
        console.log("responsive-images: variants up to date, skipping.");
        return;
      }
    } catch { /* fall through and rebuild */ }
  }

  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  const images = {};
  let count = 0;
  let bytes = 0;

  // Every frame to emit, keyed by the source it is graded from, so a file that
  // ships both whole and cropped is decoded and graded once.
  const jobs = new Map();
  for (const file of gradedFiles) {
    jobs.set(file, [{ key: `/images/${file}`, crop: null }]);
  }
  for (const [key, crop] of Object.entries(CROPS)) {
    const list = jobs.get(crop.file);
    if (!list) throw new Error(`Crop "${key}" names an ungraded source "${crop.file}"`);
    list.push({ key, crop });
  }

  for (const [file, frames] of jobs) {
    const { out8, width, height, orientation } = await gradeToRaw(file, productionStrength);

    // Bake orientation once, then resize every variant from the display-
    // oriented full-resolution graded pixels.
    const oriented = await applyOrientation(
      sharp(out8, { raw: { width, height, channels: 3 } }),
      orientation
    ).raw().toBuffer({ resolveWithObject: true });
    const fullW = oriented.info.width;
    const fullH = oriented.info.height;

    for (const { key, crop } of frames) {
      const base = path.basename(key, path.extname(key));
      const region = crop && {
        left: Math.round(fullW * crop.left),
        top: Math.round(fullH * crop.top),
        width: Math.round(fullW * crop.width),
        height: Math.round(fullH * crop.height),
      };
      const dispW = region ? region.width : fullW;
      const dispH = region ? region.height : fullH;

      const cap = Math.min(dispW, FULL_BLEED.has(key) ? BLEED_WIDTH : MAX_WIDTH);
      const widths = LADDER.filter((w) => w <= cap);
      if (widths.length === 0 || widths[widths.length - 1] < cap) {
        // Always offer the exact display cap so the largest screens are covered.
        widths.push(cap);
      }

      const scaled = SCALED[key];
      if (scaled && scaled.width > dispW) {
        throw new Error(`Scaled rung ${scaled.width} exceeds "${key}"'s ${dispW}px source`);
      }
      const emitted = scaled ? [...widths, scaled.width] : widths;

      for (const w of emitted) {
        for (const fmt of FORMATS) {
          let pipe = sharp(oriented.data, {
            raw: { width: fullW, height: fullH, channels: 3 },
          });
          if (region) pipe = pipe.extract(region);
          pipe = pipe.resize({ width: w, withoutEnlargement: true });
          const buf = await fmt.encode(pipe).toBuffer();
          fs.writeFileSync(path.join(OUT, `${base}-${w}.${fmt.ext}`), buf);
          count++;
          bytes += buf.length;
        }
      }

      images[key] = {
        base,
        width: dispW,
        height: dispH,
        widths,
        formats: FORMATS.map((f) => f.ext),
      };
      if (scaled) images[scaled.key] = { ...images[key], widths: emitted };
      console.log(
        `  ${base.padEnd(22)} ${dispW}x${dispH}  ${widths.length} widths` +
          (scaled ? ` (+${scaled.width} for ${scaled.key})` : "")
      );
    }
  }

  const manifest = {
    signature: sig,
    dir: "/images/variants",
    formats: FORMATS.map((f) => ({ ext: f.ext, mime: f.mime })),
    images,
  };
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
  console.log(
    `responsive-images: ${count} files, ${(bytes / 1e6).toFixed(1)}MB across ` +
      `${gradedFiles.length + Object.keys(CROPS).length} frames.`
  );
}

await run();
