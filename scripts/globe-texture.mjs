// The Earth's skins, built offline from NASA's public-domain maps:
//
//   day    Blue Marble Next Generation with topography and bathymetry
//          (world.topo.bathy.200407, July, 5400x2700), graded toward the site: the
//          saturation eased, the oceans deepened toward the dusk the section
//          stands in, the whole a step darker so the lit side sits in the
//          page rather than on it. Two rungs: 4096 for a desktop's disc, 2048
//          for a phone's.
//   pack   one 2048x1024 map carrying three channels the shader reads apart:
//          R the night lights (Black Marble 2016), G the clouds (Blue Marble
//          cloud cover), B the water mask (from the day map), so the night
//          side glows, the weather turns, and the sun glints on the sea.
//
//   node scripts/globe-texture.mjs
//
// Sources are fetched once into photo-src/incoming/ (git-excluded); the
// outputs in public/globe/ are committed.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const CACHE = path.join(ROOT, "photo-src/incoming/blue-marble");
const OUT = path.join(ROOT, "public/globe");
const SOURCES = {
  day: "https://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73751/world.topo.bathy.200407.3x5400x2700.jpg",
  lights: "https://eoimages.gsfc.nasa.gov/images/imagerecords/144000/144898/BlackMarble_2016_01deg.jpg",
  clouds: "https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57747/cloud_combined_2048.jpg",
};

// The grade. Saturation eased by a sixth; the water pulled a third of the way
// toward the section's own deep blue-green; everything a tenth darker.
const SATURATION = 0.84;
const WATER = [0x10, 0x2c, 0x3a];
const WATER_PULL = 0.34;
const LEVEL = 0.9;

async function source(key) {
  const file = path.join(CACHE, path.basename(SOURCES[key]));
  if (!fs.existsSync(file)) {
    fs.mkdirSync(CACHE, { recursive: true });
    const res = await fetch(SOURCES[key]);
    if (!res.ok) throw new Error(`fetch ${SOURCES[key]}: ${res.status}`);
    fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  }
  return file;
}

fs.mkdirSync(OUT, { recursive: true });

// --- the day map, graded at full resolution, then resized to its two rungs.
const day = await sharp(await source("day")).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = day.info;
const px = day.data;
const n = W * H;
const water = Buffer.alloc(n);
for (let i = 0; i < n; i += 1) {
  const r = px[i * 3];
  const g = px[i * 3 + 1];
  const b = px[i * 3 + 2];
  // Water is blue-dominant; the bathymetry keeps it blue at every depth.
  const isWater = b > g + 4 && b > r + 12;
  water[i] = isWater ? 255 : 0;
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  let rr = lum + (r - lum) * SATURATION;
  let gg = lum + (g - lum) * SATURATION;
  let bb = lum + (b - lum) * SATURATION;
  if (isWater) {
    // Keep the depth shading: pull toward the site's water in proportion to
    // the pixel's own level, so shelves stay lighter than the deep.
    const k = lum / 255;
    rr = rr * (1 - WATER_PULL) + WATER[0] * (0.6 + 0.8 * k) * WATER_PULL;
    gg = gg * (1 - WATER_PULL) + WATER[1] * (0.6 + 0.8 * k) * WATER_PULL;
    bb = bb * (1 - WATER_PULL) + WATER[2] * (0.6 + 0.8 * k) * WATER_PULL;
  }
  px[i * 3] = Math.max(0, Math.min(255, Math.round(rr * LEVEL)));
  px[i * 3 + 1] = Math.max(0, Math.min(255, Math.round(gg * LEVEL)));
  px[i * 3 + 2] = Math.max(0, Math.min(255, Math.round(bb * LEVEL)));
}
const graded = sharp(px, { raw: { width: W, height: H, channels: 3 } });
for (const [w, name, q] of [
  [4096, "earth-day-4k.webp", 76],
  [2048, "earth-day-2k.webp", 80],
]) {
  await graded
    .clone()
    .resize(w, w / 2, { kernel: "lanczos3" })
    .webp({ quality: q, effort: 6, smartSubsample: true })
    .toFile(path.join(OUT, name));
}

// --- the packed map: lights, clouds, water, at 2048x1024.
const PW = 2048;
const PH = 1024;
const lights = await sharp(await source("lights"))
  .removeAlpha()
  .resize(PW, PH, { kernel: "lanczos3" })
  .raw()
  .toBuffer({ resolveWithObject: true });
const clouds = await sharp(await source("clouds"))
  .removeAlpha()
  .resize(PW, PH, { kernel: "lanczos3" })
  .greyscale()
  .raw()
  .toBuffer({ resolveWithObject: true });
const waterSmall = await sharp(water, { raw: { width: W, height: H, channels: 1 } })
  .resize(PW, PH, { kernel: "lanczos3" })
  .blur(0.6)
  .raw()
  .toBuffer({ resolveWithObject: true });
const pack = Buffer.alloc(PW * PH * 3);
const lc = lights.info.channels;
const cc = clouds.info.channels;
const wc = waterSmall.info.channels;
for (let i = 0; i < PW * PH; i += 1) {
  const lr = lights.data[i * lc];
  const lg = lights.data[i * lc + 1];
  const lb = lights.data[i * lc + 2];
  // Lights as luminance, lifted on a 0.7 gamma so towns read and not only
  // the conurbations; the shader tints them.
  const l = 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
  pack[i * 3] = Math.round(255 * Math.pow(l / 255, 0.7));
  pack[i * 3 + 1] = clouds.data[i * cc];
  pack[i * 3 + 2] = waterSmall.data[i * wc];
}
// q70: the lights are the one channel that could suffer, and at 70 the
// smallest towns still read on the night side.
await sharp(pack, { raw: { width: PW, height: PH, channels: 3 } })
  .webp({ quality: 70, effort: 6 })
  .toFile(path.join(OUT, "earth-pack.webp"));

for (const f of fs.readdirSync(OUT).sort()) {
  console.log(`globe-texture: ${f} ${(fs.statSync(path.join(OUT, f)).size / 1024).toFixed(0)} KB`);
}
