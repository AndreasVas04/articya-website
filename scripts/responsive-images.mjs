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
const LADDER = [384, 640, 768, 1024, 1152, 1366, 1600, 1920, 2560];
const MAX_WIDTH = 2560;

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
    `fmt${FORMATS.map((f) => f.ext).join(",")}`, `crops${JSON.stringify(CROPS)}`];
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

      const widths = LADDER.filter((w) => w <= Math.min(dispW, MAX_WIDTH));
      if (widths.length === 0 || widths[widths.length - 1] < Math.min(dispW, MAX_WIDTH)) {
        // Always offer the exact display cap so the largest screens are covered.
        widths.push(Math.min(dispW, MAX_WIDTH));
      }

      for (const w of widths) {
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
      console.log(`  ${base.padEnd(22)} ${dispW}x${dispH}  ${widths.length} widths`);
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
