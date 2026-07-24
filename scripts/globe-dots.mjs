// Precompute the dotted globe's land field so the client never runs ~12k
// point-in-polygon tests on the main thread — that work is a multi-second
// synchronous block on a throttled phone, and the globe's data loads a screen
// ahead of being scrolled to, so it lands right over the hero's opening
// animation. The output is a flat `[lng, lat, tier, …]` array read by
// `hydrateDots` in components/ui/dotted-globe.tsx, which only rebuilds each
// dot's unit vector at load. The geometry and constants below mirror that
// component exactly; both are frozen, so this runs once and its result is
// committed alongside the land data it derives from.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const LAND = join(root, "public/data/ne_110m_land.json");
const OUT = join(root, "public/data/globe-dots.json");

const RAD = Math.PI / 180;
const DOT_STEP = 1.3;
const WARM_CENTER = [22, 41];
const WARM_FULL = 20;
const WARM_FADE = 34;
const WARM_TIERS = 3;

function pointInRing(point, ring) {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

function pointInPolygon(point, rings) {
  if (!pointInRing(point, rings[0])) return false;
  for (let i = 1; i < rings.length; i++) {
    if (pointInRing(point, rings[i])) return false;
  }
  return true;
}

function pointInFeature(point, feature) {
  const geometry = feature.geometry;
  if (geometry.type === "Polygon") return pointInPolygon(point, geometry.coordinates);
  return geometry.coordinates.some((rings) => pointInPolygon(point, rings));
}

function featureBounds(feature) {
  let minLng = 180, maxLng = -180, minLat = 90, maxLat = -90;
  const polygons =
    feature.geometry.type === "Polygon"
      ? [feature.geometry.coordinates]
      : feature.geometry.coordinates;
  for (const rings of polygons) {
    for (const [lng, lat] of rings[0]) {
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    }
  }
  return [minLng, minLat, maxLng, maxLat];
}

function toVector(lng, lat) {
  return [
    Math.cos(lat * RAD) * Math.cos(lng * RAD),
    Math.cos(lat * RAD) * Math.sin(lng * RAD),
    Math.sin(lat * RAD),
  ];
}

function warmTier(x, y, z) {
  const [cx, cy, cz] = toVector(...WARM_CENTER);
  const arc = Math.acos(Math.min(1, x * cx + y * cy + z * cz)) / RAD;
  if (arc >= WARM_FADE) return 0;
  if (arc <= WARM_FULL) return WARM_TIERS;
  return Math.ceil(((WARM_FADE - arc) / (WARM_FADE - WARM_FULL)) * WARM_TIERS);
}

const land = JSON.parse(readFileSync(LAND, "utf8"));
const flat = [];
// Two decimals is well under a tenth of a device pixel on the rendered globe,
// so the field is identical to the eye while the file stays compact.
const r = (v) => Math.round(v * 100) / 100;
for (const feature of land.features) {
  const [minLng, minLat, maxLng, maxLat] = featureBounds(feature);
  for (let lng = minLng; lng <= maxLng; lng += DOT_STEP) {
    for (let lat = minLat; lat <= maxLat; lat += DOT_STEP) {
      if (!pointInFeature([lng, lat], feature)) continue;
      const [x, y, z] = toVector(lng, lat);
      flat.push(r(lng), r(lat), warmTier(x, y, z));
    }
  }
}

writeFileSync(OUT, JSON.stringify(flat));
console.log(`globe-dots: ${flat.length / 3} dots -> ${OUT} (${(JSON.stringify(flat).length / 1024).toFixed(0)} KB)`);
