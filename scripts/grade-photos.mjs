// Build-time colour grade for the site's photography.
//
// The photographs were shot across several years on different cameras, so
// out of the box they read as unrelated images sitting on the gold ground.
// This script grades them into one body of work: it always reads the
// untouched originals from public/images/_originals/ and writes the live
// files in public/images/, so it is idempotent and fully revertible.
//
//   npm run grade:photos                  # apply the production grade (target strength)
//   node scripts/grade-photos.mjs --strength=all
//                                         # bake all three strengths: base and max
//                                         # into public/images/_grades/, target live
//   node scripts/grade-photos.mjs --grade=resinHour --out=/tmp/x --width=520
//                                         # screen a candidate at preview size
//
// The pipeline decodes to raw pixels and does the grade in JS (white
// balance, tone curve, hue-band moves, split-tone) because sharp's built-in
// operators can't shift a sky without touching a face. The grade runs in
// floating point end to end — decode, grade, one dithered quantisation to
// 8-bit (Floyd–Steinberg, error measured in linear light), one encode.
// There is no intermediate lossy step and no intermediate rounding, so
// banding cannot enter between the original and the shipped file.
//
// Encode policy: quality first, size second. No file ships below JPEG
// quality 88; the payload budgets (home page ≤ 4.8 MB, full referenced set
// ≤ 12.5 MB — both above the original payloads) are spent raising quality
// further, cheapest files first. If even the floor cannot meet a budget,
// the floor ships anyway and the overage is reported — quality is never
// silently dropped. EXIF orientation flags are carried over untouched.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "public/images/_originals");
const DEST = path.join(ROOT, "public/images");

// Shooting-condition groups. A colourist matches shots rather than slapping
// one preset on everything: each grade defines a base look plus per-group
// corrections that pull every group onto that same look.
const GROUPS = {
  trail: ["hero-1.jpg", "AboutImage2.jpg"], // open midday, cool cast, big blue sky
  forest: ["hero-2.jpg", "hero-3.jpg"], // canopy light, deep shadows
  closeup: ["home-youth.jpg", "home-training.jpg"], // washed midday close-ups, already warm
  office: ["FAQ.jpg", "About.jpg", "Contact.jpg"], // even indoor light, beige on beige
  flash: ["AboutImage1.jpg"], // mixed flash + ambient interior
};

// ---------------------------------------------------------------------------
// The three candidate grades. Each is a point of view, not an intensity.
// Parameters: wb = per-channel gains; lift/gamma/shoulder = tone curve;
// contrast = sigmoid strength around a 0.45 pivot; vibrance boosts quiet
// colours only; bands are hue-selective moves (degrees, raised-cosine
// falloff) that skip skin; split tones the shadows/highlights toward a hue.
// ---------------------------------------------------------------------------

// Soft knee on strength: linear up to the knee, then a tanh roll toward a
// ceiling — the same shape the tone curve's shoulder uses on highlights.
// Moves that rotate a hue can scale linearly, because a hue that has already
// arrived cannot travel further. Moves that displace a pixel's whole colour
// toward a fixed target cannot: at 5× a linear split-tone drags the deepest
// shadow 45% of the way to a mid-value tint, and the shadow mass stops being
// shadow. The displacing moves run through the knee instead, so raising the
// strength keeps deepening the look without ever flattening the frame out
// from under it. Below the knee the function is the identity, so strength 1
// still reproduces the base bake byte-for-byte.
function softStrength(s, [knee, ceil]) {
  if (s <= knee) return s;
  return knee + (ceil - knee) * Math.tanh((s - knee) / (ceil - knee));
}

// Knees for the saturating moves, as [knee, ceiling] in strength units.
// Three moves displace rather than rotate, and all three take a knee: the
// white-balance look gains, the split-tone amounts, and the shadow lift.
// The lift is the least obvious and the most expensive — it is a black
// point, and a black point that climbs with strength does not make a
// stronger look, it makes a shallower photograph. Measured on the outdoor
// set, taking it from 5× to 1.5× costs about 0.1 ΔE2000 and returns 25–38
// points of deep-shadow mass, which is as one-sided as a trade gets.
const KNEE = {
  wb: [1.5, 3.2],
  split: [1.4, 2.3],
  lift: [1, 1.5],
};

// Smooth feather: eases in and out with zero slope at both ends. Used where a
// membership weight would otherwise step across a threshold.
function feather(x) {
  return x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x);
}

// A. Resin hour — the site's own hour of light. Warm highlights falling
// toward the amber accent, shadows sinking toward pine, skies converged
// on one late-day blue, greens eased from camera-cyan toward pine.
//
// The grade takes a strength: 1 reproduces the first bake exactly, and
// higher values scale each delta-from-original — linearly for the moves
// that rotate a colour, through KNEE for the three that displace one —
// while the guards hold still: the tanh shoulder never moves, the sky
// keeps a saturation floor
// so it stays believably blue, the vegetation hue shift and chroma are
// clamped so greens stay green, and a skin protection on the split-tone
// tightens as the strength grows. Two moves only exist above strength 1
// (so the base bake is untouched): the shadow tint drifts from warm brown
// toward pine, and a luminance-gated pull turns the brightest non-sky,
// non-skin pixels toward amber — sunlit foliage going golden.
function resinHour(strength = 1) {
  const s = strength;
  const baseWb = [1.04, 1.0, 0.95];
  const base = {
    wb: baseWb,
    lift: 0.012,
    gamma: 0.985,
    shoulder: 0.88,
    contrast: 0.06,
    vibrance: 0.05,
    satScale: 1.0,
    split: {
      shadow: { hue: 30, sat: 0.28, amount: 0.09 },
      highlight: { hue: 46, sat: 0.34, amount: 0.13 },
    },
    bands: [
      { center: 215, width: 70, hueTarget: 212, huePull: 0.5, satScale: 0.78, lumScale: 0.94 }, // sky and water
      { center: 115, width: 60, hueShift: -12, satScale: 0.98, lumScale: 1.0 }, // vegetation
    ],
  };
  const groups = {
    trail: { ...base, wb: [1.05, 1.0, 0.925] },
    forest: { ...base, wb: [1.03, 1.0, 0.96], contrast: 0.04 },
    closeup: {
      ...base,
      wb: [1.005, 1.0, 0.985],
      split: {
        shadow: { hue: 30, sat: 0.28, amount: 0.06 },
        highlight: { hue: 46, sat: 0.34, amount: 0.1 },
      },
    },
    office: { ...base, wb: [0.995, 1.0, 1.0], contrast: 0.08 },
    flash: { ...base, wb: [1.045, 1.0, 0.93], contrast: 0.05 },
  };
  if (s === 1) return groups;

  const over = Math.min(s - 1, 1); // saturates: strength-only moves stop growing past 2
  const sWb = softStrength(s, KNEE.wb);
  const sSplit = softStrength(s, KNEE.split);
  const scaleGroup = (p) => ({
    // A group's wb is cast correction × the base look; the correction is a
    // fact about the shot and stays fixed, only the look scales — and the
    // look saturates, since a channel gain applied to every pixel is a
    // displacement, not a rotation.
    wb: p.wb.map((g, i) => (g / baseWb[i]) * (1 + (baseWb[i] - 1) * sWb)),
    // Guards that only exist above base strength: sky membership is judged
    // on the original pixel (a strong warm wb flips pale blue past the band
    // before the pull can claim it), and skin saturation is capped near the
    // original's so the scaled look can never sunburn a face.
    guardStrength: over,
    lift: p.lift * softStrength(s, KNEE.lift),
    gamma: 1 + (p.gamma - 1) * s,
    shoulder: p.shoulder,
    contrast: p.contrast * s,
    vibrance: p.vibrance * s,
    satScale: 1 + (p.satScale - 1) * s,
    splitSkinProtect: 0.7 * over,
    splitSkyProtect: over, // the amber highlight split must never eat the sky
    split: {
      shadow: {
        hue: p.split.shadow.hue + 75 * over, // 30 (warm brown) -> 105 (pine)
        sat: p.split.shadow.sat + 0.1 * over,
        amount: p.split.shadow.amount * sSplit,
      },
      highlight: {
        hue: p.split.highlight.hue - 9 * over, // 46 -> 37: deeper amber
        sat: p.split.highlight.sat,
        amount: p.split.highlight.amount * sSplit,
      },
    },
    goldenHighlight: { hue: 36, sat: 0.38, amount: 0.38 * Math.min(s - 1, 2) },
    bands: p.bands.map((band) =>
      band.hueTarget !== undefined
        ? {
            ...band,
            huePull: Math.min(band.huePull * s, 0.98),
            satScale: band.satScale, // sky saturation floor: never scaled down
            lumScale: Math.max(1 + (band.lumScale - 1) * s, 0.8),
          }
        : {
            ...band,
            hueShift: band.hueShift * Math.min(s, 1.7), // greens stay green
            satScale: Math.max(1 + (band.satScale - 1) * s, 0.88),
            // greens sink toward dusk — the pine read is dark as much as hue
            lumScale: 1 + (band.lumScale - 1) * s - 0.12 * over,
          }
    ),
  });
  return Object.fromEntries(
    Object.entries(groups).map(([k, p]) => [k, scaleGroup(p)])
  );
}

// B. Matte archive — one photo book printed on warm paper. Unity comes from
// tonal structure: lifted warm blacks, highlights rolled off toward cream,
// colour quieted a step everywhere. Calm rather than golden.
function matteArchive() {
  const base = {
    wb: [1.02, 1.0, 0.97],
    lift: 0.038,
    gamma: 1.0,
    shoulder: 0.78,
    contrast: -0.02,
    vibrance: 0,
    satScale: 0.9,
    split: {
      shadow: { hue: 28, sat: 0.3, amount: 0.15 },
      highlight: { hue: 48, sat: 0.22, amount: 0.1 },
    },
    bands: [
      { center: 215, width: 70, hueTarget: 212, huePull: 0.45, satScale: 0.62, lumScale: 0.97 },
      { center: 115, width: 60, hueShift: -8, satScale: 0.88, lumScale: 1.0 },
    ],
  };
  return {
    trail: { ...base, wb: [1.04, 1.0, 0.94] },
    forest: base,
    closeup: { ...base, wb: [1.0, 1.0, 0.99] },
    office: { ...base, wb: [0.99, 1.0, 1.005], contrast: 0.02 },
    flash: { ...base, wb: [1.04, 1.0, 0.94] },
  };
}

// C. Cyprus summer — colour-forward. The photographs are the only place real
// colour lives on the site, so let them carry it loudly — but inside a
// constrained wheel that harmonises with the amber: blues toward
// Mediterranean teal, greens deepened toward olive, warmth in the mids.
function cyprusSummer() {
  const base = {
    wb: [1.03, 1.0, 0.96],
    lift: 0.008,
    gamma: 0.99,
    shoulder: 0.9,
    contrast: 0.12,
    vibrance: 0.16,
    satScale: 1.0,
    split: {
      shadow: { hue: 32, sat: 0.24, amount: 0.05 },
      highlight: { hue: 45, sat: 0.3, amount: 0.08 },
    },
    bands: [
      { center: 215, width: 70, hueTarget: 200, huePull: 0.5, satScale: 0.9, lumScale: 0.94 },
      { center: 115, width: 60, hueShift: -14, satScale: 1.04, lumScale: 0.97 },
    ],
  };
  return {
    trail: { ...base, wb: [1.05, 1.0, 0.92] },
    forest: { ...base, contrast: 0.09 },
    closeup: { ...base, wb: [1.005, 1.0, 0.99], vibrance: 0.1 },
    office: { ...base, wb: [0.995, 1.0, 1.0], vibrance: 0.08 },
    flash: { ...base, wb: [1.045, 1.0, 0.93] },
  };
}

const GRADES = { resinHour, matteArchive, cyprusSummer };
const PRODUCTION_GRADE = "resinHour";

// Named strengths for the production grade. base is the first bake, target
// is what ships, max is deliberately past shippable — a range to judge
// against, not a candidate. --strength takes a name, a number, or "all"
// (bake base and max into public/images/_grades/<name>/, target live).
const STRENGTHS = { base: 1, target: 5, max: 9 };

// ---------------------------------------------------------------------------
// Pixel machinery
// ---------------------------------------------------------------------------

function rgbToHsv(r, g, b) {
  const mx = Math.max(r, g, b);
  const mn = Math.min(r, g, b);
  const d = mx - mn;
  let h = 0;
  if (d > 0) {
    if (mx === r) h = ((g - b) / d) % 6;
    else if (mx === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return [h, mx > 0 ? d / mx : 0, mx];
}

function hsvToRgb(h, s, v) {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return [r + m, g + m, b + m];
}

// Raised-cosine membership of a hue in a band: 1 at the centre, easing to 0
// at ±width. Smooth edges are what keep a selective move invisible.
function bandWeight(hue, center, width) {
  let d = Math.abs(hue - center);
  if (d > 180) d = 360 - d;
  if (d >= width) return 0;
  return 0.5 * (1 + Math.cos((Math.PI * d) / width));
}

// How much a pixel reads as skin. Hue-selective moves are scaled back by
// this, so a sky or vegetation shift can never drag a face with it.
function skinWeight(h, s, v) {
  const hw = bandWeight(h, 25, 30);
  if (hw === 0 || v < 0.2) return 0;
  const sw = s < 0.1 ? 0 : s > 0.65 ? Math.max(0, 1 - (s - 0.65) * 5) : 1;
  return hw * sw;
}

// Shadow lift + gamma + soft shoulder, applied per channel. The shoulder is
// a tanh roll past the knee, so highlights compress instead of clipping; the
// lift floor means nothing ever maps below it — blacks cannot crush.
function tone(x, { lift, gamma, shoulder }) {
  let y = lift + (1 - lift) * Math.pow(Math.min(Math.max(x, 0), 1), gamma);
  if (y > shoulder) {
    y = shoulder + (1 - shoulder) * Math.tanh((y - shoulder) / (1 - shoulder));
  }
  return y;
}

function sigmoidContrast(x, k) {
  if (k === 0) return x;
  const pivot = 0.45;
  return x + k * (x - pivot) * (1 - Math.abs(2 * (x - pivot)));
}

// Reads 8-bit source pixels, writes graded values as floats in [0, 1] — the
// only quantisation back to 8-bit happens once, in ditherTo8bit.
function gradePixels(src, dst, n, p) {
  const shadowTint = hsvToRgb(p.split.shadow.hue, p.split.shadow.sat, 0.28);
  const highlightTint = hsvToRgb(p.split.highlight.hue, p.split.highlight.sat, 1);

  for (let i = 0; i < n; i++) {
    const r0 = src[i * 3] / 255;
    const g0 = src[i * 3 + 1] / 255;
    const b0 = src[i * 3 + 2] / 255;

    // Sky membership and skin saturation, judged on the untouched pixel.
    //
    // Membership is a soft weight, not a yes/no. In bokeh, sky and leaf mix
    // inside a handful of pixels, so a binary classifier always cuts a seam
    // there — the gold-against-blue edge around every hole in a canopy. A
    // pixel that is 40% sky takes 40% of the sky treatment instead. The
    // chroma gate is deliberately loose: a pale sky is still wholly sky, and
    // only a near-neutral pixel should fall out of the band.
    let skyW0 = 0;
    let sat0 = 0;
    let blue0 = 0;
    if (p.guardStrength) {
      const [h0, s0] = rgbToHsv(r0, g0, b0);
      sat0 = s0;
      blue0 = bandWeight(h0, 215, 70);
      skyW0 = feather(blue0 * Math.min(s0 * 8, 1) * 1.2);
    }

    // The warm look is exempted from the sky — sky colour is governed only
    // by the convergence pull, so wb blends to neutral over sky pixels.
    const skyExempt = skyW0 * (p.guardStrength ?? 0);
    let r = r0 * (1 + (p.wb[0] - 1) * (1 - skyExempt));
    let g = g0 * (1 + (p.wb[1] - 1) * (1 - skyExempt));
    let b = b0 * (1 + (p.wb[2] - 1) * (1 - skyExempt));

    r = sigmoidContrast(tone(r, p), p.contrast);
    g = sigmoidContrast(tone(g, p), p.contrast);
    b = sigmoidContrast(tone(b, p), p.contrast);

    let [h, s, v] = rgbToHsv(r, g, b);
    const skin = skinWeight(h, s, v);

    for (const band of p.bands) {
      const w = bandWeight(h, band.center, band.width) * (1 - skin) * Math.min(s * 5, 1);
      // Above base strength the sky pull bypasses the saturation gate via
      // the original-pixel membership: a pale sky must converge like a
      // vivid one, and rotating near-neutral hue costs nothing visually.
      const wPull =
        band.hueTarget !== undefined
          ? Math.max(w, skyW0 * (1 - skin) * (p.guardStrength ?? 0))
          : w;
      if (w === 0 && wPull === 0) continue;
      if (band.hueTarget !== undefined) {
        // Pull toward one target hue rather than offsetting: a cyan horizon
        // and a violet-leaning zenith both land on the same sky.
        let d = band.hueTarget - h;
        if (d > 180) d -= 360;
        if (d < -180) d += 360;
        h = (h + d * band.huePull * wPull + 360) % 360;
      } else if (w > 0) {
        h = (h + band.hueShift * w + 360) % 360;
      }
      s *= 1 + (band.satScale - 1) * w;
      v *= 1 + (band.lumScale - 1) * w;
    }

    // Above base strength: the brightest non-sky, non-skin pixels pull
    // toward amber — the sunlit-foliage-going-golden move.
    if (p.goldenHighlight && v > 0.6) {
      const gh = p.goldenHighlight;
      const w =
        gh.amount *
        ((v - 0.6) / 0.4) *
        (1 - skin) *
        (1 - skyW0) *
        Math.min(s * 5, 1);
      if (w > 0) {
        let d = gh.hue - h;
        if (d > 180) d -= 360;
        if (d < -180) d += 360;
        h = (h + d * w + 360) % 360;
        if (s < gh.sat) s += (gh.sat - s) * w * 0.6;
      }
    }

    // Vibrance reaches quiet colour and leaves saturated pixels, skin, and
    // (above base strength) sky be — boosting pale sky amplifies hue noise
    // that the convergence pull exists to remove.
    s *= 1 + p.vibrance * (1 - s) * (1 - skin) * (1 - skyW0 * (p.guardStrength ?? 0));
    s *= 1 + (p.satScale - 1) * (1 - skin);
    s = Math.min(s, 1);

    // Neutral guard: a near-neutral pixel's hue is camera noise, and the
    // scaled look amplifies it into mottling on white fabric. Cap its
    // chroma near the original's and unify its hue toward the warm tint —
    // a flat cream instead of pale confetti.
    if (p.guardStrength && sat0 < 0.2) {
      const guardW = Math.min((0.2 - sat0) / 0.1, 1) * p.guardStrength; // full below 0.1
      const cap = sat0 * 1.2 + 0.008;
      if (s > cap) s -= (s - cap) * guardW;
      // Pale blue stays under the sky's law; everything else warms as one.
      // Which camp a near-neutral belongs to is itself uncertain near the
      // boundary, and the two targets sit 172° apart — snapping every pixel
      // to one of them is the second way a bokeh transition acquires a seam.
      // So the unification is weighted by how confidently the pixel sits in
      // its camp, and an ambiguous pixel simply keeps its own hue: at this
      // chroma the hue is invisible either way, and the cap above has
      // already taken the noise out.
      const skyCamp = feather(blue0);
      let dN = (skyCamp > 0.5 ? 212 : 40) - h;
      if (dN > 180) dN -= 360;
      if (dN < -180) dN += 360;
      h = (h + dN * guardW * Math.abs(2 * skyCamp - 1) + 360) % 360;
    }

    // Skin saturation cap: however strong the look, a face can only gain a
    // step of saturation over what the camera saw.
    if (p.guardStrength && skin > 0) {
      const cap = Math.min(sat0 * 1.25 + 0.03, 1);
      if (s > cap) s -= (s - cap) * skin * p.guardStrength;
    }

    // Chroma amplification ceiling: however the look's moves stack, a
    // pixel's chroma may not run past 2.6× what the camera saw (plus a hair,
    // so true neutrals keep the warm tint). 2.6 sits above the vegetation
    // band's measured p99 gain on every image, so the pine greens pass
    // untouched; the 3–10× tail beyond it is amplified chroma noise — the
    // mottle on flat walls. Above the knee, gains compress 4:1 rather than
    // clipping, so the cap draws no contour of its own.
    if (p.guardStrength && s > 0) {
      const knee = 2.6 * sat0 + 0.02;
      if (s > knee) s -= (s - knee) * 0.75 * p.guardStrength;
    }

    [r, g, b] = hsvToRgb(h, s, v);

    // Split-tone: shadows lean toward the shadow tint, highlights toward the
    // highlight tint, weighted by how deep or bright the pixel sits. Above
    // base strength the split backs off skin, since its amounts grow.
    const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const protect = 1 - (p.splitSkinProtect ?? 0) * skin;
    const skyProtect = 1 - (p.splitSkyProtect ?? 0) * skyW0;
    const sw = p.split.shadow.amount * (1 - L) * (1 - L) * protect * skyProtect;
    const hw = p.split.highlight.amount * L * L * protect * skyProtect;
    r += (shadowTint[0] - r) * sw + (highlightTint[0] - r) * hw;
    g += (shadowTint[1] - g) * sw + (highlightTint[1] - g) * hw;
    b += (shadowTint[2] - b) * sw + (highlightTint[2] - b) * hw;

    dst[i * 3] = r < 0 ? 0 : r > 1 ? 1 : r;
    dst[i * 3 + 1] = g < 0 ? 0 : g > 1 ? 1 : g;
    dst[i * 3 + 2] = b < 0 ? 0 : b > 1 ? 1 : b;
  }
}

// ---------------------------------------------------------------------------
// Quantisation. The graded floats drop to 8-bit exactly once, through
// serpentine Floyd–Steinberg dithering with the error measured in linear
// light — quantisation error becomes fine decorrelated noise instead of the
// banded plateaus a graded sky shows when each pixel just rounds.
// ---------------------------------------------------------------------------

function srgbToLinear(x) {
  return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
}

const SRGB_LIN = new Float64Array(256);
for (let i = 0; i < 256; i++) SRGB_LIN[i] = srgbToLinear(i / 255);

// Inverse lookup: linear value -> nearest 8-bit code, refined ±1 at use.
const INV_BINS = 4096;
const LIN_TO_CODE = new Uint8Array(INV_BINS + 1);
{
  let code = 0;
  for (let j = 0; j <= INV_BINS; j++) {
    const lin = j / INV_BINS;
    while (code < 255 && Math.abs(SRGB_LIN[code + 1] - lin) <= Math.abs(SRGB_LIN[code] - lin)) code++;
    LIN_TO_CODE[j] = code;
  }
}

function ditherTo8bit(fdata, w, h) {
  const out = new Uint8Array(w * h * 3);
  let cur = new Float64Array((w + 2) * 3);
  let next = new Float64Array((w + 2) * 3);
  for (let y = 0; y < h; y++) {
    next.fill(0);
    const ltr = (y & 1) === 0;
    const dx = ltr ? 1 : -1;
    for (let k = 0, x = ltr ? 0 : w - 1; k < w; k++, x += dx) {
      const base = (y * w + x) * 3;
      for (let c = 0; c < 3; c++) {
        const g = fdata[base + c];
        let want = (g <= 0 ? 0 : g >= 1 ? 1 : srgbToLinear(g)) + cur[(x + 1) * 3 + c];
        if (want < 0) want = 0;
        else if (want > 1) want = 1;
        let code = LIN_TO_CODE[(want * INV_BINS) | 0];
        if (code < 255 && Math.abs(SRGB_LIN[code + 1] - want) < Math.abs(SRGB_LIN[code] - want)) code++;
        else if (code > 0 && Math.abs(SRGB_LIN[code - 1] - want) < Math.abs(SRGB_LIN[code] - want)) code--;
        out[base + c] = code;
        const err = want - SRGB_LIN[code];
        cur[(x + 1 + dx) * 3 + c] += err * (7 / 16);
        next[(x + 1 - dx) * 3 + c] += err * (3 / 16);
        next[(x + 1) * 3 + c] += err * (5 / 16);
        next[(x + 1 + dx) * 3 + c] += err * (1 / 16);
      }
    }
    const t = cur;
    cur = next;
    next = t;
  }
  return out;
}

// Luminance stats used for the clipping guard: the grade must not push more
// pixels into the extremes than the original already had there.
function lumaStats(data, n) {
  let dark = 0;
  let bright = 0;
  const hist = new Array(256).fill(0);
  for (let i = 0; i < n; i++) {
    const L = Math.round(
      0.2126 * data[i * 3] + 0.7152 * data[i * 3 + 1] + 0.0722 * data[i * 3 + 2]
    );
    hist[L]++;
    if (L <= 4) dark++;
    if (L >= 251) bright++;
  }
  let acc = 0, p1 = 0, p99 = 255;
  for (let i = 0; i < 256; i++) {
    acc += hist[i];
    if (acc >= n * 0.01) { p1 = i; break; }
  }
  acc = 0;
  for (let i = 255; i >= 0; i--) {
    acc += hist[i];
    if (acc >= n * 0.01) { p99 = i; break; }
  }
  return { dark: dark / n, bright: bright / n, p1, p99 };
}

// Quality-first encoding. The floor is absolute: no file ships below q88 —
// if the budgets can't hold at the floor, the floor ships and the overage
// is reported. Above the floor, the budget headroom is spent raising files
// as high as they'll go, cheapest first.
const QUALITY_FLOOR = 88;
const QUALITY_CAP = 95;
const HOME_SET = new Set(["hero-1.jpg", "hero-2.jpg", "hero-3.jpg", "home-youth.jpg", "FAQ.jpg"]);
const BUDGETS = { home: 4.8e6, all: 12.5e6 }; // bytes

async function allocateQualities(items, encodeAt) {
  const cache = new Map(); // "file@q" -> encoded buffer
  const at = async (item, q) => {
    const key = `${item.file}@${q}`;
    if (!cache.has(key)) cache.set(key, await encodeAt(item, q));
    return cache.get(key);
  };
  const fits = async (qOf) => {
    let home = 0, all = 0;
    for (const it of items) {
      const bytes = (await at(it, qOf(it))).length;
      all += bytes;
      if (HOME_SET.has(it.file)) home += bytes;
    }
    return home <= BUDGETS.home && all <= BUDGETS.all;
  };
  const q = new Map(items.map((it) => [it.file, QUALITY_FLOOR]));
  if (!(await fits(() => QUALITY_FLOOR))) {
    return { q, at, overBudget: true };
  }
  // Highest uniform quality the budgets allow...
  let lo = QUALITY_FLOOR + 1, hi = QUALITY_CAP, uniform = QUALITY_FLOOR;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (await fits(() => mid)) {
      uniform = mid;
      lo = mid + 1;
    } else hi = mid - 1;
  }
  for (const it of items) q.set(it.file, uniform);
  // ...then push each file as far past it as the budgets still allow —
  // smoothest content first, ranked by bytes per pixel at the floor. Flat
  // fields compress smallest and are exactly where compression artifacts
  // show first, so the smooth files get the headroom before the textured
  // ones, which already mask their quantisation.
  const bpp = (it) =>
    cache.get(`${it.file}@${uniform}`).length / (it.width * it.height);
  const order = [...items].sort((a, b) => bpp(a) - bpp(b));
  for (const it of order) {
    let lo2 = q.get(it.file) + 1, hi2 = QUALITY_CAP;
    while (lo2 <= hi2) {
      const mid = (lo2 + hi2) >> 1;
      if (await fits((x) => (x === it ? mid : q.get(x.file)))) {
        q.set(it.file, mid);
        lo2 = mid + 1;
      } else hi2 = mid - 1;
    }
  }
  return { q, at, overBudget: false };
}

// ---------------------------------------------------------------------------

const args = Object.fromEntries(
  process.argv.slice(2).filter((a) => a.startsWith("--")).map((a) => {
    const [k, v] = a.slice(2).split("=");
    return [k, v ?? true];
  })
);

const gradeName = args.grade || PRODUCTION_GRADE;
const grade = GRADES[gradeName];
if (!grade) {
  console.error(`Unknown grade "${gradeName}". Available: ${Object.keys(GRADES).join(", ")}`);
  process.exit(1);
}
const previewWidth = args.width ? parseInt(args.width, 10) : null;

function resolveStrength(v) {
  if (v in STRENGTHS) return STRENGTHS[v];
  const num = parseFloat(v);
  if (!Number.isNaN(num) && num > 0) return num;
  console.error(`Unknown strength "${v}". Named: ${Object.keys(STRENGTHS).join(", ")}, all`);
  process.exit(1);
}

async function bake(strength, label, outDir) {
  fs.mkdirSync(outDir, { recursive: true });
  const params = grade(strength);
  console.log(
    `Grade: ${gradeName} @ ${label} (${strength}×)` +
      `${previewWidth ? ` (preview ${previewWidth}px)` : ""} -> ${path.relative(ROOT, outDir) || "."}`
  );

  // Grade every file first — the quality allocation below needs the whole
  // set's encoded sizes before any file can be written.
  const items = [];
  for (const [group, files] of Object.entries(GROUPS)) {
    for (const file of files) {
      const srcPath = path.join(SRC, file);
      const original = fs.statSync(srcPath);
      const meta = await sharp(srcPath).metadata();

      let decoder = sharp(srcPath);
      if (previewWidth) decoder = decoder.resize(previewWidth, null);
      const { data, info } = await decoder.raw().toBuffer({ resolveWithObject: true });
      const n = info.width * info.height;

      const before = lumaStats(data, n);
      const graded = new Float32Array(n * 3);
      gradePixels(data, graded, n, params[group]);
      const out8 = ditherTo8bit(graded, info.width, info.height);
      const after = lumaStats(out8, n);

      items.push({
        file, group, out8,
        width: info.width, height: info.height,
        orientation: meta.orientation,
        originalSize: original.size,
        before, after,
      });
    }
  }

  const encodeAt = (item, quality) => {
    let out = sharp(item.out8, {
      raw: { width: item.width, height: item.height, channels: 3 },
    });
    // Keep the stored orientation flag (AboutImage1 relies on it) without
    // baking the rotation, so dimensions and rendering are unchanged.
    if (item.orientation && item.orientation !== 1) {
      out = out.withMetadata({ orientation: item.orientation });
    }
    return out.jpeg({ quality, mozjpeg: true }).toBuffer();
  };

  let qOf, bufOf, overBudget = false;
  if (previewWidth) {
    qOf = () => 85;
    bufOf = (it) => encodeAt(it, 85);
  } else {
    const alloc = await allocateQualities(items, encodeAt);
    overBudget = alloc.overBudget;
    qOf = (it) => alloc.q.get(it.file);
    bufOf = (it) => alloc.at(it, alloc.q.get(it.file));
  }

  let homeBytes = 0, allBytes = 0;
  for (const item of items) {
    const buf = await bufOf(item);
    fs.writeFileSync(path.join(outDir, item.file), buf);
    allBytes += buf.length;
    if (HOME_SET.has(item.file)) homeBytes += buf.length;

    const kb = (x) => `${Math.round(x / 1024)}kb`;
    const { before, after } = item;
    const guard =
      after.dark <= before.dark + 0.002 && after.bright <= before.bright + 0.002
        ? "clip-guard ok"
        : `CLIP WARNING dark ${(100 * before.dark).toFixed(2)}%->${(100 * after.dark).toFixed(2)}% bright ${(100 * before.bright).toFixed(2)}%->${(100 * after.bright).toFixed(2)}%`;
    console.log(
      `  ${item.file.padEnd(18)} ${item.group.padEnd(7)} q${qOf(item)}  ${kb(item.originalSize)} -> ${kb(buf.length)}  ` +
        `p1/p99 ${before.p1}/${before.p99} -> ${after.p1}/${after.p99}  ${guard}`
    );
  }
  if (!previewWidth) {
    const mb = (x) => `${(x / 1e6).toFixed(2)}MB`;
    console.log(
      `  payload: home ${mb(homeBytes)} / ${mb(BUDGETS.home)}, set ${mb(allBytes)} / ${mb(BUDGETS.all)}` +
        (overBudget
          ? `  OVER BUDGET at the q${QUALITY_FLOOR} floor — shipping the floor, size second`
          : "")
    );
  }
}

const strengthArg = args.strength || "target";
if (strengthArg === "all") {
  await bake(STRENGTHS.base, "base", path.join(DEST, "_grades/base"));
  await bake(STRENGTHS.target, "target", args.out ? path.resolve(args.out) : DEST);
  await bake(STRENGTHS.max, "max", path.join(DEST, "_grades/max"));
} else {
  const label = strengthArg in STRENGTHS ? strengthArg : `${strengthArg}`;
  await bake(resolveStrength(strengthArg), label, args.out ? path.resolve(args.out) : DEST);
}
