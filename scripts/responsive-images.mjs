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

// The Portugal set: seven portrait frames that carry the site's photographic
// grounds. They run through the ladder and the encoder like everything else
// but skip the grade — they are a separate body of work and are graded in
// their own pass, not folded into the resin-hour look for this one.
//
// Two of them ship cropped, and the crop is baked here rather than left to
// `object-position`: it is a content rule, not a composition preference. A
// CSS crop still ships the pixels, and any later change of position, of the
// element's aspect ratio, or of the `sizes` the browser picks would bring the
// excluded material back into frame. Cutting it out of the variants means it
// does not exist downstream. Fractions are of the display-oriented frame.
const UNGRADED = [
  { file: "IMG_4582.jpg" },
  { file: "IMG_4585.jpg" },
  // The left of the frame carries figures in swimwear that must not appear.
  // The brief specifies the right 70%; measured on the frame, that is not
  // enough — the cut at 30% clears the foreground figure but leaves a second,
  // bare-torso one further up the path, spanning 34.8%-37.9% and plainly
  // visible at render scale. The exclusion is the rule and the fraction is the
  // means, so the cut moves to 39%.
  { file: "IMG_4599.jpg", crop: { x: 0.39, w: 0.61 } },
  // The lower third carries fencing and roof tiles.
  { file: "IMG_4619.jpg", crop: { h: 0.6 } },
  { file: "IMG_4721.jpg" },
  { file: "IMG_4735.jpg" },
  { file: "IMG_4739.jpg" },
];
const UNGRADED_SRC = path.join(SRC, "pt");

// Width ladder in device pixels. Each image emits the rungs at or below the
// largest size it is ever displayed (never upscaled); the cap keeps a 6000px
// source from ever emitting more than a full-bleed hero can use.
// 1152 is the phone rung: a 393px viewport at DPR 3 asks for 1120 device px
// for a 95vw image, and without a step between 1024 and 1366 it takes the
// 1366 and throws a third of the pixels away.
const LADDER = [384, 640, 768, 1024, 1152, 1366, 1600, 1920, 2560];
const MAX_WIDTH = 2560;

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
    `fmt${FORMATS.map((f) => f.ext).join(",")}`];
  for (const f of ["scripts/responsive-images.mjs", "scripts/grade-photos.mjs"]) {
    parts.push(`${f}:${fs.statSync(path.join(ROOT, f)).mtimeMs}`);
  }
  for (const file of gradedFiles.slice().sort()) {
    const st = fs.statSync(path.join(SRC, file));
    parts.push(`${file}:${st.size}:${st.mtimeMs}`);
  }
  for (const { file, crop } of UNGRADED) {
    const st = fs.statSync(path.join(UNGRADED_SRC, file));
    parts.push(`pt/${file}:${st.size}:${st.mtimeMs}:${JSON.stringify(crop ?? null)}`);
  }
  return parts.join("|");
}

// Emit one image's ladder from a display-oriented raw buffer. Shared by the
// graded and ungraded paths so both get the same widths, formats and manifest
// entry — the only difference upstream is whether the grade ran.
async function emitLadder(data, dispW, dispH, base, key, images, counters) {
  const widths = LADDER.filter((w) => w <= Math.min(dispW, MAX_WIDTH));
  if (widths.length === 0 || widths[widths.length - 1] < Math.min(dispW, MAX_WIDTH)) {
    // Always offer the exact display cap so the largest screens are covered.
    widths.push(Math.min(dispW, MAX_WIDTH));
  }

  for (const w of widths) {
    for (const fmt of FORMATS) {
      const pipe = sharp(data, {
        raw: { width: dispW, height: dispH, channels: 3 },
      }).resize({ width: w, withoutEnlargement: true });
      const buf = await fmt.encode(pipe).toBuffer();
      fs.writeFileSync(path.join(OUT, `${base}-${w}.${fmt.ext}`), buf);
      counters.count++;
      counters.bytes += buf.length;
    }
  }

  images[key] = {
    base,
    width: dispW,
    height: dispH,
    widths,
    formats: FORMATS.map((f) => f.ext),
  };
  console.log(`  ${key.padEnd(30)} ${dispW}x${dispH}  ${widths.length} widths`);
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
  const counters = { count: 0, bytes: 0 };

  for (const file of gradedFiles) {
    const base = path.basename(file, path.extname(file));
    const { out8, width, height, orientation } = await gradeToRaw(file, productionStrength);

    // Bake orientation once, then resize every variant from the display-
    // oriented full-resolution graded pixels.
    const oriented = await applyOrientation(
      sharp(out8, { raw: { width, height, channels: 3 } }),
      orientation
    ).raw().toBuffer({ resolveWithObject: true });

    await emitLadder(
      oriented.data, oriented.info.width, oriented.info.height,
      base, `/images/${file}`, images, counters
    );
  }

  // The ungraded set. Same ladder, same encoder, no grade: sharp's own
  // `rotate()` reads the EXIF flag and bakes it, then the content crop is
  // taken off the oriented frame before anything is resized.
  for (const { file, crop } of UNGRADED) {
    const base = path.basename(file, path.extname(file));
    let pipe = sharp(path.join(UNGRADED_SRC, file)).rotate();
    if (crop) {
      // `metadata()` reports the stored frame, so the crop fractions are
      // resolved against the *display* frame the rotate() above produces —
      // these are all orientation 6, where the two axes swap.
      const meta = await sharp(path.join(UNGRADED_SRC, file)).metadata();
      const { w: dw, h: dh } = displayDims(meta.width, meta.height, meta.orientation ?? 1);
      pipe = pipe.extract({
        left: Math.round(dw * (crop.x ?? 0)),
        top: Math.round(dh * (crop.y ?? 0)),
        width: Math.round(dw * (crop.w ?? 1)),
        height: Math.round(dh * (crop.h ?? 1)),
      });
    }
    const raw = await pipe.toColourspace("srgb").raw().toBuffer({ resolveWithObject: true });
    await emitLadder(
      raw.data, raw.info.width, raw.info.height,
      base, `/images/pt/${file}`, images, counters
    );
  }

  const manifest = {
    signature: sig,
    dir: "/images/variants",
    formats: FORMATS.map((f) => ({ ext: f.ext, mime: f.mime })),
    images,
  };
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
  console.log(
    `responsive-images: ${counters.count} files, ${(counters.bytes / 1e6).toFixed(1)}MB across ${
      gradedFiles.length + UNGRADED.length
    } images.`
  );
}

await run();
