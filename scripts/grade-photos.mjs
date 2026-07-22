// Build-time colour grade for the site's photography.
//
// The photographs were shot across several years on different cameras, so
// out of the box they read as unrelated images sitting on the gold ground.
// This script grades them into one body of work: it always reads the
// untouched originals from public/images/_originals/ and writes the live
// files in public/images/, so it is idempotent and fully revertible.
//
//   npm run grade:photos                  # apply the production grade (target strength)
//   node scripts/grade-photos.mjs --strength=base --out=/tmp/base
//                                         # bake another strength somewhere else to compare
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
// from under it. Below the knee the function is the identity, so the
// strength axis leaves the base look's own parameters alone.
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

// Where a pixel stops being a surface and starts being sky, in chroma. Sky
// membership gates three moves at once, so this gate has to separate real
// sky from anything merely blue-shaded; see the note where it is used.
const SKY_CHROMA = [0.12, 0.14]; // 0 below 12% chroma, full at 26%

// The air membership is that same gate read through a hue weight that
// saturates instead of falling off as the raised cosine does, because this
// one also has to serve as a protection, and a protection that decays with
// hue distance is not one. A cyan horizon sits 23° off the blue band's
// centre, so the cosine gives it 0.76 and leaks a quarter of every move the
// mask is meant to be holding off it — a quarter of a rotation toward
// amber, which is enough to undo the convergence pull and is where
// AboutImage2's green roofline came from. Within 40° of the centre a pixel
// is simply air.
//
// It shares the chroma gate above rather than opening below it, and that
// was tried the other way first. Water reflects the sky and arrives paler
// than the sky it reflects, so a gate opening at 4% chroma reaches it — but
// it reaches white fabric in shade at the same time, because the two
// genuinely overlap: the water in the lake vista runs 8–12% chroma and the
// socks and shorts in home-youth run 2–13%. At 4% the fabric came out
// mottled green, at 9% it still did, and no threshold separates them
// because there is nothing between them to separate. Sunlit water is bright
// and near-neutral, so it is the golden highlight that claims it, and a
// lake under a low sun going warm silver is the right answer anyway.
function airHue(blue0) {
  return feather((blue0 - 0.25) / 0.35);
}

// Smooth feather: eases in and out with zero slope at both ends. Used where a
// membership weight would otherwise step across a threshold.
function feather(x) {
  return x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x);
}

// A. Resin hour — the site's own hour of light. Warm highlights falling
// toward the amber accent, shadows sinking toward pine, skies converged
// on one late-day blue, greens eased from camera-cyan toward pine.
//
// The grade takes a strength: 1 is the base look, and
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
    // Sky joins the hour at a reduced share rather than being exempt from
    // it. Holding it at zero was right while the sky in this set was small
    // windows between leaves — it is what stopped the green horizons and
    // violet zeniths. But a frame that is half sky then cannot join the
    // hour at all, whatever the strength: its warmth is capped by the share
    // of it that is land. The wide lake vista is that frame, and it read as
    // a different day beside the forest tiles in the About mosaic. So the
    // warm balance now reaches the sky at 35% and the amber highlight split
    // at 40%, which is enough for the sky to belong to the afternoon and
    // far short of what would take it off blue.
    skyWarmShare: 0.35,
    splitSkyProtect: 0.6 * over,
    // Warm haze. A late-afternoon sky holds its colour overhead and washes
    // pale and warm where the air is deepest, at the horizon. Depth of air
    // is not something the pixels carry, but thinning the colour is what
    // haze does, so how far a patch of sky has fallen below the frame's own
    // deepest blue stands in for it — and unlike a vertical ramp that
    // stands in correctly whatever angle the frame was shot at.
    //
    // Haze thins the air's colour before it warms it, and the order is not
    // cosmetic. A sky's own gradient runs blue overhead to cyan at the
    // horizon, and the path from a cyan to a warm target passes through
    // green: cyan is short of red, the target is short of blue, and every
    // mixture between them is longest in the channel neither is short of.
    // Blending straight to warm at a weight strong enough to be felt put a
    // green band along AboutImage2's roofline — hue 192 in the original,
    // 151 graded. Paling first spends most of that distance as chroma
    // rather than as rotation, and the warm step that follows is small
    // enough that what is left cannot cross.
    //
    // Where the air is deep is read from the sky's own chroma, measured per
    // frame — see skyDeep. Brightness was the first proxy and it does not
    // survive contact with this set: AboutImage2's sky runs 232 at the top
    // of the frame and 223 at the roofline, so a luminance gate hazes the
    // zenith as hard as the horizon and takes the whole sky grey. Chroma
    // over the same span falls 60% to 44%, which is the gradient the eye is
    // actually reading as distance.
    skyHaze: { pale: 0.1 * over, hue: 42, sat: 0.3, amount: 0.55 * over },
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

// Per-shot trims — the matching pass on top of the group grade. A group
// correction is a fact about shooting conditions; a trim is about how one
// frame sits beside the ones it is printed next to, which is a different
// question and the last one a colourist answers.
//
// The About mosaic is why they exist: seven photographs physically touch
// there, and a tile that reads as a different day is visible in a way the
// same tile alone never is. Trims are therefore judged between files rather
// than against each file's own original — a per-file warmth index (mean b*
// over non-sky, non-skin content) and the spread of it across the set.
// Measured over the seven mosaic tiles, that spread runs 7.56 → 6.81 with
// the trims, its sd 2.95 → 2.48, and the whole-frame spread — which is what
// a tile of mostly sky actually shows — 21.18 → 14.76.
//
// The two vistas take opposite corrections. hero-1 holds the centre tile
// and arrives paler and cooler than the close-range scenes around it, so it
// is warmed and enriched. hero-2 is the shadow-heavy one: its warmth is
// decided almost entirely by the shadow tint, which the look drifts toward
// pine at strength, so its trim pulls that tint back out of the green and
// lifts the chroma its dappled canopy loses.
//
// The interiors go the other way. AboutImage1 and AboutImage2 arrive
// warmest of the seven and are cooled a step, because matching is a
// question about the set and not about how far each file travelled.
const TRIMS = {
  "hero-1.jpg": { wb: [1.035, 1.0, 0.96], sat: 1.15, contrast: 0.03, skySat: 0.75, warm: 1.5 },
  "hero-2.jpg": { wb: [1.045, 1.0, 0.94], sat: 1.22, warm: 1.4, shadowHue: -40 },
  "home-youth.jpg": { wb: [1.02, 1.0, 0.96], warm: 1.3 },
  "AboutImage1.jpg": { wb: [0.99, 1.0, 1.02] },
  "AboutImage2.jpg": { wb: [0.99, 1.0, 1.02] },
};

// wb is the obvious trim lever and it is a weak one: a 4% channel move buys
// about 0.3 b*, because the chroma ceiling absorbs most of what it adds.
// The split-tone amounts run after that ceiling, so `warm` is the lever with
// real travel, and `shadowHue` reaches the one part of the look that decides
// whether a shadow-heavy frame reads warm at all.
function applyTrim(p, t) {
  if (!t) return p;
  const tone = (x, mul) => (mul === undefined ? x : { ...x, amount: x.amount * mul });
  return {
    ...p,
    wb: p.wb.map((g, i) => g * (t.wb ? t.wb[i] : 1)),
    satScale: p.satScale * (t.sat ?? 1),
    contrast: p.contrast + (t.contrast ?? 0),
    split: {
      shadow: {
        ...tone(p.split.shadow, t.warm),
        hue: p.split.shadow.hue + (t.shadowHue ?? 0),
      },
      highlight: tone(p.split.highlight, t.warm),
    },
    bands: p.bands.map((b) =>
      b.hueTarget !== undefined && t.skySat !== undefined
        ? { ...b, satScale: b.satScale * t.skySat }
        : b
    ),
  };
}

const GRADES = { resinHour, matteArchive, cyprusSummer };
const PRODUCTION_GRADE = "resinHour";

// Named strengths for the production grade. base is the first bake, target
// is what ships, max is deliberately past shippable — a range to judge
// against, not a candidate. --strength takes a name or a number.
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

// Gamma + soft shoulder, applied per channel. The shoulder is a tanh roll
// past the knee, so highlights compress instead of clipping. The shadow
// lift is not applied here but after the contrast curve — see blackPoint.
function tone(x, { gamma, shoulder }) {
  let y = Math.pow(Math.min(Math.max(x, 0), 1), gamma);
  if (y > shoulder) {
    y = shoulder + (1 - shoulder) * Math.tanh((y - shoulder) / (1 - shoulder));
  }
  return y;
}

// The lift is the last thing the tone chain does, so it is a floor nothing
// can fall back through. Applied before the contrast curve it was not one:
// the sigmoid pulls hard below its pivot and took a lifted 0.018 back to
// 0.0004, and the black point only survived because the shadow split-tone
// happened to raise it again. Once that stopped lifting, the deepest 0.3%
// of an interior crushed to zero.
function blackPoint(y, lift) {
  return lift + (1 - lift) * y;
}

function sigmoidContrast(x, k) {
  if (k === 0) return x;
  const pivot = 0.45;
  return x + k * (x - pivot) * (1 - Math.abs(2 * (x - pivot)));
}

// Reads 8-bit source pixels, writes graded values as floats in [0, 1] — the
// only quantisation back to 8-bit happens once, in ditherTo8bit.
function gradePixels(src, dst, n, p) {
  // Split-tone targets, held at unit luminance. Each is rescaled to the
  // pixel's own luminance before it is used, so toning a shadow moves its
  // colour and not its level — see the note at the split itself.
  const lum = (c) => 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  const shadowUnit = hsvToRgb(p.split.shadow.hue, p.split.shadow.sat, 1);
  const highlightUnit = hsvToRgb(p.split.highlight.hue, p.split.highlight.sat, 1);
  const shadowK = 1 / lum(shadowUnit);
  const highlightK = 1 / lum(highlightUnit);
  const haze = p.skyHaze;
  const hazeUnit = haze ? hsvToRgb(haze.hue, haze.sat, 1) : null;
  const hazeK = hazeUnit ? 1 / lum(hazeUnit) : 0;

  // The frame's own deepest sky, as chroma — the 90th percentile among the
  // pixels the air membership claims. Haze is judged against it rather than
  // against a fixed number because every frame's air is different: a shot
  // straight up a canopy has one narrow band of deep blue, a lake vista has
  // half a frame of it, and a fixed threshold would haze one of them and
  // not the other. Frames with almost no sky get no reference and no haze,
  // which is the right answer for them.
  let skyDeep = 0;
  let skySeen = 0;
  if (haze) {
    const bins = new Uint32Array(101);
    for (let i = 0; i < n; i++) {
      const [h0, s0] = rgbToHsv(src[i * 3] / 255, src[i * 3 + 1] / 255, src[i * 3 + 2] / 255);
      const air = airHue(bandWeight(h0, 215, 70)) * feather((s0 - SKY_CHROMA[0]) / SKY_CHROMA[1]);
      if (air > 0.5) {
        bins[Math.min(100, Math.round(s0 * 100))]++;
        skySeen++;
      }
    }
    if (skySeen > n * 0.005) {
      let acc = 0;
      for (let i = 100; i >= 0; i--) {
        acc += bins[i];
        if (acc >= skySeen * 0.1) { skyDeep = i / 100; break; }
      }
    }
  }

  for (let i = 0; i < n; i++) {
    const r0 = src[i * 3] / 255;
    const g0 = src[i * 3 + 1] / 255;
    const b0 = src[i * 3 + 2] / 255;

    // Sky membership and skin saturation, judged on the untouched pixel.
    //
    // Membership is a soft weight, not a yes/no. In bokeh, sky and leaf mix
    // inside a handful of pixels, so a binary classifier always cuts a seam
    // there — the gold-against-blue edge around every hole in a canopy. A
    // pixel that is 40% sky takes 40% of the sky treatment instead.
    //
    // Both factors have to be gentle, because membership gates three
    // separate moves at once — the warm balance steps aside for it, the
    // convergence pull claims it, and the highlight split-tone releases it.
    // Anywhere the weight can swing across a surface, all three switch
    // together and the surface separates into camps. That is what an
    // earlier chroma gate did: saturating at 12.5% chroma, it read shaded
    // white fabric, hair and pale walls as fully sky, and a shirt in open
    // shade came out in hard cream and blue zones. Measured on this set,
    // real sky sits at 22–63% chroma and those surfaces at 2–13%, so the
    // gate ramps between them and never reaches a verdict in that gap.
    let skyW0 = 0;
    let airW0 = 0;
    let sat0 = 0;
    let blue0 = 0;
    if (p.guardStrength) {
      const [h0, s0] = rgbToHsv(r0, g0, b0);
      sat0 = s0;
      blue0 = bandWeight(h0, 215, 70);
      skyW0 = blue0 * feather((s0 - SKY_CHROMA[0]) / SKY_CHROMA[1]);
      airW0 = airHue(blue0) * feather((s0 - SKY_CHROMA[0]) / SKY_CHROMA[1]);
    }

    // The warm look reaches the sky at a reduced share — see skyWarmShare.
    const skyExempt =
      skyW0 * (p.guardStrength ?? 0) * (1 - (p.skyWarmShare ?? 0));
    let r = r0 * (1 + (p.wb[0] - 1) * (1 - skyExempt));
    let g = g0 * (1 + (p.wb[1] - 1) * (1 - skyExempt));
    let b = b0 * (1 + (p.wb[2] - 1) * (1 - skyExempt));

    r = blackPoint(sigmoidContrast(tone(r, p), p.contrast), p.lift);
    g = blackPoint(sigmoidContrast(tone(g, p), p.contrast), p.lift);
    b = blackPoint(sigmoidContrast(tone(b, p), p.contrast), p.lift);

    let [h, s, v] = rgbToHsv(r, g, b);
    const skin = skinWeight(h, s, v);

    for (const band of p.bands) {
      const w = bandWeight(h, band.center, band.width) * (1 - skin) * Math.min(s * 5, 1);
      // Above base strength the sky pull bypasses the saturation gate via
      // the original-pixel membership: a pale sky must converge like a
      // vivid one, and rotating near-neutral hue costs nothing visually.
      //
      // It reaches as wide as the haze does, and it has to. The pale band
      // just above a horizon sits below the sky gate, so on the narrow
      // membership it received the warm balance and the haze with nothing
      // holding its hue — and a pale blue with its blue channel eased down
      // lands in cyan-green, which is where AboutImage2's roofline came out
      // banded green. Whatever the wider membership warms, the pull keeps
      // on one sky.
      const wPull =
        band.hueTarget !== undefined
          ? Math.max(w, airW0 * (1 - skin) * (p.guardStrength ?? 0))
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

    // Haze, first half: the air thins toward the horizon. Gated on the
    // pixel's own brightness, so the zenith keeps every point of its
    // chroma and only the bright end pales. The warm half follows in RGB
    // once the chroma is down — see the note on skyHaze.
    let hazeW = 0;
    if (skyDeep > 0 && airW0 > 0) {
      // 0 at the frame's deepest sky, 1 where its chroma has fallen by half.
      hazeW = feather((skyDeep - sat0) / (skyDeep * 0.5)) * airW0 * (1 - skin);
      s *= 1 - haze.pale * hazeW;
    }

    // Above base strength: the brightest non-air, non-skin pixels pull
    // toward amber — the sunlit-foliage-going-golden move.
    //
    // It stands off the air on the wide membership, and the narrow one was
    // a bug rather than a choice. A bright sky pixel kept a quarter share
    // of this move, and from a converged 208 the short way to amber runs
    // backwards through cyan and green: a quarter share was enough to undo
    // the convergence pull and land the roofline at 187. That is where
    // AboutImage2's green horizon came from, in the shipped grade as much
    // as in any candidate here. Sunlit foliage is the subject of this move;
    // air never was.
    if (p.goldenHighlight && v > 0.6) {
      const gh = p.goldenHighlight;
      const w =
        gh.amount *
        ((v - 0.6) / 0.4) *
        (1 - skin) *
        (1 - airW0) *
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

    // One chroma ceiling for the whole frame. A pixel may gain colour, but
    // never without limit: the ceiling is a fixed headroom plus a bounded
    // multiple of what the camera saw. So a surface recorded as near-white
    // can warm, and cannot acquire a colour of its own; where there is real
    // colour the multiple opens up and the greens deepen untouched.
    //
    // The headroom term is what makes it safe at the neutral end. A pure
    // ratio collapses to nothing as the source chroma goes to zero, and the
    // cap then inherits the quantisation of that chroma — on white fabric
    // the source varies by one or two codes, and a cap that tracks it steps
    // where it steps. Above the ceiling, gains compress rather than clip, so
    // the law draws no contour of its own.
    //
    // This replaces a pair of guards: a chroma cap on near-neutrals that
    // also unified their hue toward one of two targets 172° apart, and a
    // separate 2.6× amplification ceiling. The hue unification was the
    // second half of the fabric defect — it painted the camps the sky gate
    // had already split — and the new ceiling is tighter than 2.6× at every
    // chroma, so the second guard had nothing left to do.
    if (p.guardStrength && s > 0) {
      const cap = sat0 + 0.05 + 1.6 * sat0 * feather((sat0 - 0.2) / 0.25);
      if (s > cap) s -= (s - cap) * 0.8 * p.guardStrength;
    }

    // Skin saturation cap: however strong the look, a face can only gain a
    // step of saturation over what the camera saw.
    if (p.guardStrength && skin > 0) {
      const cap = Math.min(sat0 * 1.25 + 0.03, 1);
      if (s > cap) s -= (s - cap) * skin * p.guardStrength;
    }

    [r, g, b] = hsvToRgb(h, s, v);

    // Split-tone: shadows lean toward the shadow tint, highlights toward the
    // highlight tint, weighted by how deep or bright the pixel sits. Above
    // base strength the split backs off skin, since its amounts grow.
    //
    // Each target is taken at the pixel's own luminance, so the move is
    // purely chromatic. Held at a fixed level instead — the shadow target
    // used to sit at 0.28 — "tone toward" becomes "lift toward" on any
    // frame whose shadows sit below it: the canopy in the home hero runs at
    // 0.03–0.10, so its deepest fifth was dragged a fifth of the way to a
    // mid-dark green. That raised the compression noise living down there
    // into view and flattened the shadow's own variation onto one colour,
    // which is what read as dark clumps in the trees.
    const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const protect = 1 - (p.splitSkinProtect ?? 0) * skin;
    const skyProtect = 1 - (p.splitSkyProtect ?? 0) * skyW0;
    const sw = p.split.shadow.amount * (1 - L) * (1 - L) * protect * skyProtect;
    const hw = p.split.highlight.amount * L * L * protect * skyProtect;
    const sL = L * shadowK;
    const hL = L * highlightK;
    r += (shadowUnit[0] * sL - r) * sw + (highlightUnit[0] * hL - r) * hw;
    g += (shadowUnit[1] * sL - g) * sw + (highlightUnit[1] * hL - g) * hw;
    b += (shadowUnit[2] * sL - b) * sw + (highlightUnit[2] * hL - b) * hw;

    // Haze, second half: the thinned air takes the hour's colour. Same rule
    // as the split above — the target is held at the pixel's own luminance,
    // so this moves the colour of the air and never its level.
    if (hazeW > 0) {
      const w = haze.amount * hazeW;
      const hzL = L * hazeK;
      r += (hazeUnit[0] * hzL - r) * w;
      g += (hazeUnit[1] * hzL - g) * w;
      b += (hazeUnit[2] * hzL - b) * w;
    }

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
  console.error(`Unknown strength "${v}". Named: ${Object.keys(STRENGTHS).join(", ")}`);
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
      gradePixels(data, graded, n, applyTrim(params[group], TRIMS[file]));
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
await bake(resolveStrength(strengthArg), `${strengthArg}`, args.out ? path.resolve(args.out) : DEST);
