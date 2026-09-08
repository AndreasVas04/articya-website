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
import { createHash } from "node:crypto";
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
// — hero-2 is a hero slide and an About finale tile — is safe because the
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
  "/images/pt/IMG_4721-oaks.jpg", // the About ground
  "/images/pt/IMG_4735-road.jpg", // the Contact ground
  "/images/pt/IMG_3004-reservoir.jpg", // the FAQ ground
  "/images/hero-1.jpg", // the ground under "What we do"
  "/images/hero-2.jpg", // hero slide 2
  "/images/hero-3.jpg", // hero slide 3
]);

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

// What the two constants above actually promise, checked rather than asserted
// in prose. The first two throw: they are invariants the ladder is built on.
// The third only reports, because a source-capped full-bleed frame is a
// photograph problem and the build must still produce the site.
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
  // The reservoir under the ridge, cut to 0.968:1. This one is not a cable
  // cut: the frame is clean end to end, and the cut is for the window. A
  // cover-fitted frame shows boxAspect / frameAspect of its width, so a 3:4
  // portrait full-bleed shows 47% of itself in a 16:10 window; at 0.968 the
  // 16:10 window shows 60.5% of the frame's height and a 390x664 phone 60.7%
  // of its width - the one band of aspects (0.96-0.98) that clears the 60%
  // floor on both, and the cut keeps 77.5% of the frame. What goes is the
  // top of the open sky; the ridge starts at 47% of the frame, so the cut
  // keeps a fifth of sky over it and all of the water and the foreground
  // pines.
  "/images/pt/IMG_3004-reservoir.jpg": {
    file: "pt/IMG_3004.jpg",
    left: 0,
    top: 0.225,
    width: 1,
    height: 0.775,
  },
  // The oak and the cattle, the About ground, cut the same way and for the
  // same window: the portrait showed 47% of itself on a desktop. The band a
  // 16:10 window takes from this cut at `0% 48%` is rows 37.2-84.1% of the
  // frame, which is the band the portrait showed at `0% 70%` - the near cow
  // (67.6-83.3%) stays whole and the desktop picture does not move. What the
  // cut takes is the top 22.5%: canopy, above the rows any window showed on
  // a desktop.
  "/images/pt/IMG_4721-oaks.jpg": {
    file: "pt/IMG_4721.jpg",
    left: 0,
    top: 0.225,
    width: 1,
    height: 0.775,
  },
};

// Encode settings. Quality first: at or above the grade's q88 floor, and
// verified against the graded master at display size (flat skies/walls at
// 1:1). AVIF has no 8x8 blocking so it holds flat regions at a lower number;
// WebP and JPEG sit higher. Every variant is one encode from graded pixels.
//
// AVIF's quality is a function of the rung, because a rung is a statement
// about how densely the pixels will be painted. q62 is the site's number and
// it holds everywhere except one rung.
//
// BLEED_WIDTH takes q50. That rung exists only so a full-bleed frame can cover
// a retina desktop, and at both reference viewports it is painted at or above
// two image pixels per CSS pixel — 2.0 at 1440x900 DPR 2, 3.0 at 390x844
// DPR 3. Rendered at 1:1 device pixels and then magnified 2x on top, the two
// placements that fetch it — /faq/'s ground and the home hero's first slide —
// do not separate from q62 at their own worst windows, where the departure
// from the graded reference goes 7.33 -> 9.92 and 10.99 -> 11.76 mean codes
// and neither is visible in a canopy or on a stone wall. It returns a third of
// the bytes on the largest file every full-bleed page downloads.
//
// The 3840 SCALED rung does NOT take it, and that is the measurement rather
// than caution. It is the one placement on the site scaled past the window —
// the About wall's centre tile at 2.60x — so an artifact is magnified with the
// frame, and at 150 device pixels drawn 2x the dark canopy visibly flattens at
// q50 where q62 still holds its leaf structure. Its departure from the
// reference goes 5.95 -> 8.34 on the same test the other two pass.
//
// One honest limit on the q50 rung, recorded rather than argued away: the
// density figures above are the two reference viewports. Resolved across a
// wider device matrix, a 2560 CSS px DPR 1 desktop — an ordinary 27-inch
// 1440p at 100% — reaches this rung for the home hero at 1.09 image pixels per
// CSS pixel, which is not dense. What carries the decision there is that the
// 1:1 comparison above is already that case, and harder: it magnifies it.
//
// WebP and JPEG keep one quality at every rung, and that is a decision rather
// than an omission. They are the fallback for a browser with no AVIF, which is
// the visitor already receiving the least efficient format on the site;
// lowering their quality on top of that inverts the policy every other number
// here follows. Their cost is deploy weight and not payload — no visitor
// downloads a rung they do not select — and the numbers above are AVIF's own,
// so carrying them across to a different quantiser would be inheriting rather
// than deciding.
//
// What the JPEG tier does have is a `cap`, and the two tiers differ on it
// because the browsers behind them differ. JPEG is reached only where there is
// no WebP: Safari 13 and older, IE11, pre-2019 Android. WebP has been in
// Chrome since 32, Firefox 65, Edge 18 and Safari 14. So the whole JPEG ladder
// above 1366 was 66.7 MiB of deploy weight for browsers that stopped shipping
// in 2019, and the mechanism degrades rather than breaks: where the widest
// rung in a srcset is below what `sizes` asks for, the browser takes the
// widest it has and upscales.
//
// WebP is NOT capped on the same reasoning. That tier serves Safari 14 to
// 16.3 — iOS 14 through iOS 16.3, September 2020 to March 2023, before AVIF
// reached Safari in 16.4. Those are all retina devices at DPR 2-3 and the
// large rungs are exactly what a full-bleed frame needs on them.
const AVIF_QUALITY = (w) => (w === BLEED_WIDTH ? 50 : 62);
const FORMATS = [
  { ext: "avif", mime: "image/avif", encode: (s, w) => s.avif({ quality: AVIF_QUALITY(w), effort: 4, chromaSubsampling: "4:2:0" }) },
  { ext: "webp", mime: "image/webp", encode: (s) => s.webp({ quality: 82, effort: 5, smartSubsample: true }) },
  { ext: "jpeg", mime: "image/jpeg", cap: 1366, encode: (s) => s.jpeg({ quality: 90, mozjpeg: true }) },
];

// The rungs a format actually emits for one frame. A capped format keeps at
// least the narrowest rung the frame has, so no srcset can come out empty —
// a frame displayed at under 1366px is unaffected either way.
function widthsFor(widths, fmt) {
  if (!fmt.cap) return widths;
  const kept = widths.filter((w) => w <= fmt.cap);
  return kept.length ? kept : [widths[0]];
}
const CONFIG_VERSION = 2;

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
// config forces a rebuild. Inputs are keyed by content, never by mtime: a
// checkout writes every file afresh, so an mtime key could never match on CI
// and a restored cache would have been deleted and re-encoded in full.
const fileHash = (file) => createHash("sha256").update(fs.readFileSync(file)).digest("hex").slice(0, 16);
function signature() {
  const parts = [`v${CONFIG_VERSION}`, `strength${productionStrength}`, `ladder${LADDER.join(",")}`,
    `cap${MAX_WIDTH}/${BLEED_WIDTH}`, `bleed${[...FULL_BLEED].sort().join(",")}`,
    `fmt${FORMATS.map((f) => `${f.ext}${f.cap ?? ""}`).join(",")}`, `crops${JSON.stringify(CROPS)}`,
    `avifq${LADDER.concat(Object.values(SCALED).map((s) => s.width)).map(AVIF_QUALITY).join(",")}`,
    `scaled${JSON.stringify(SCALED)}`];
  for (const f of ["scripts/responsive-images.mjs", "scripts/grade-photos.mjs"]) {
    parts.push(`${f}:${fileHash(path.join(ROOT, f))}`);
  }
  for (const file of gradedFiles.slice().sort()) {
    parts.push(`${file}:${fileHash(path.join(SRC, file))}`);
  }
  return parts.join("|");
}

// The ground a plate stands on while its photograph is still on the wire.
//
// An inner page paints and then waits: measured at 390x664 DPR 3, the hero
// landed 500-734 ms after the route on 4G and 4.3-6.0 s on Fast 3G, and until
// it did the reader had the floor - the same flat pine under every page,
// telling them nothing about the picture that is coming. This is that ground
// given the photograph's own colour, so the arrival is a frame resolving out
// of its own hue rather than a picture cutting in over an unrelated dark.
//
// It is not a blur, a gradient or a fade. It is one opaque colour, and the
// polarised ledger is why: a low-resolution copy of the frame held under the
// real one is a picture at partial strength, which is the one state no plate
// on this site is allowed to hold.
//
// The two ground plates the page actually declares. A frame's mean is pulled
// onto whichever of them it is nearer, so the ground carries the picture's hue
// at the floor's own weight and can never be a light rectangle waiting to be
// replaced.
const PLATES = { "gold-wash": "#141c16", "gold-anchor": "#0e1510" };

const srgbToLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const linearToSrgb = (c) => (c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055);
// The brightness the ledger is read at: the sRGB bytes, weighted. Not relative
// luminance - the check this feeds ("no brighter than the floor") is about
// what the screen paints, and both sides of it are bytes.
const byteLuma = ([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
const hexToRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const rgbToHex = (rgb) => "#" + rgb.map((c) => Math.round(c).toString(16).padStart(2, "0")).join("");

/** The mean colour of the middle third of a frame, in linear light so the
 *  average is of the light and not of the encoding. */
function middleThirdMean(data, width, height, channels) {
  const x0 = Math.floor(width / 3), x1 = Math.ceil((width * 2) / 3);
  const y0 = Math.floor(height / 3), y1 = Math.ceil((height * 2) / 3);
  const sum = [0, 0, 0];
  let n = 0;
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const i = (y * width + x) * channels;
      for (let c = 0; c < 3; c++) sum[c] += srgbToLinear(data[i + c] / 255);
      n++;
    }
  }
  return sum.map((v) => v / n);
}

/** That mean pulled down onto a plate's own brightness, hue intact.
 *
 *  Nearest is read before the pull, on the one axis the pull travels: the
 *  frame goes to the pole it has least distance to fall to. Read after it, the
 *  answer is always the deeper plate and the choice is not a choice - both
 *  candidates land on their own target exactly, so the darker one is nearer to
 *  everything by having less colour left in it.
 *
 *  The scale is on the linear values - a multiply there is a change of
 *  exposure, which leaves the chromaticity where it was - and the factor is
 *  solved for rather than derived, because the target is stated in bytes. */
function pullToPlate(meanLinear) {
  const mean = meanLinear.map((v) => linearToSrgb(v) * 255);
  const [name, hex] = Object.entries(PLATES).sort(
    (a, b) =>
      Math.abs(byteLuma(mean) - byteLuma(hexToRgb(a[1]))) -
      Math.abs(byteLuma(mean) - byteLuma(hexToRgb(b[1])))
  )[0];
  const target = byteLuma(hexToRgb(hex));
  let lo = 0, hi = 1;
  for (let i = 0; i < 40; i++) {
    const k = (lo + hi) / 2;
    const rgb = meanLinear.map((v) => linearToSrgb(Math.min(1, v * k)) * 255);
    if (byteLuma(rgb) > target) hi = k; else lo = k;
  }
  const rgb = meanLinear.map((v) => linearToSrgb(Math.min(1, v * ((lo + hi) / 2))) * 255);
  return { name, hex: rgbToHex(rgb), luma: byteLuma(rgb), mean: rgbToHex(mean) };
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

      for (const fmt of FORMATS) {
        for (const w of widthsFor(emitted, fmt)) {
          let pipe = sharp(oriented.data, {
            raw: { width: fullW, height: fullH, channels: 3 },
          });
          if (region) pipe = pipe.extract(region);
          pipe = pipe.resize({ width: w, withoutEnlargement: true });
          const buf = await fmt.encode(pipe, w).toBuffer();
          fs.writeFileSync(path.join(OUT, `${base}-${w}.${fmt.ext}`), buf);
          count++;
          bytes += buf.length;
        }
      }

      // The ground, off the same graded pixels every variant is resized from,
      // and after the crop - a crop moves the middle third.
      const groundBuf = region
        ? await sharp(oriented.data, { raw: { width: fullW, height: fullH, channels: 3 } })
            .extract(region).raw().toBuffer({ resolveWithObject: true })
        : { data: oriented.data, info: { width: fullW, height: fullH, channels: 3 } };
      const ground = pullToPlate(
        middleThirdMean(groundBuf.data, groundBuf.info.width, groundBuf.info.height, 3)
      );

      images[key] = {
        base,
        width: dispW,
        height: dispH,
        widths,
        formats: FORMATS.map((f) => f.ext),
        ground: ground.hex,
      };
      if (scaled) images[scaled.key] = { ...images[key], widths: emitted };
      console.log(
        `  ${base.padEnd(22)} ${dispW}x${dispH}  ${widths.length} widths` +
          `  ground ${ground.hex} L${ground.luma.toFixed(1)} (${ground.name}, from ${ground.mean})` +
          (scaled ? ` (+${scaled.width} for ${scaled.key})` : "")
      );
    }
  }

  const manifest = {
    signature: sig,
    dir: "/images/variants",
    formats: FORMATS.map((f) => ({ ext: f.ext, mime: f.mime, ...(f.cap ? { cap: f.cap } : {}) })),
    images,
  };
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
  console.log(
    `responsive-images: ${count} files, ${(bytes / 1e6).toFixed(1)}MB across ` +
      `${gradedFiles.length + Object.keys(CROPS).length} frames.`
  );
}

await run();
