import manifest from "@/public/images/variants/manifest.json";
import { withBasePath } from "@/lib/utils";

// The responsive-variant manifest is generated at build time by
// scripts/responsive-images.mjs (git-ignored). It maps each content image
// path to the widths and formats emitted for it, so the shared
// <ResponsiveImage> component and the LCP preloads build real srcset markup
// without next/image (unavailable under `output: export`).

interface ManifestEntry {
  base: string;
  width: number;
  height: number;
  widths: number[];
  formats: string[];
  /** The frame's own dark, computed at build time - see `pullToPlate` in
   *  scripts/responsive-images.mjs. */
  ground: string;
  /** The frame at 24px as a data URI per format, for the four route heroes
   *  only - see the placeholder block in scripts/responsive-images.mjs. */
  placeholder?: Record<string, string>;
}
interface Manifest {
  dir: string;
  /** `cap` is the widest rung a format emits - the JPEG tier is capped, and a
   *  srcset must never list a file the build did not write. */
  formats: { ext: string; mime: string; cap?: number }[];
  images: Record<string, ManifestEntry>;
}

const data = manifest as unknown as Manifest;

const MIME: Record<string, string> = Object.fromEntries(
  data.formats.map((f) => [f.ext, f.mime])
);
const CAP: Record<string, number | undefined> = Object.fromEntries(
  data.formats.map((f) => [f.ext, f.cap])
);

export interface ImageSource {
  ext: string;
  mime: string;
  srcSet: string;
}

export interface ResolvedImage {
  /** <source> entries, modern formats first (avif, webp), then jpeg. */
  sources: ImageSource[];
  /** Largest JPEG variant - the universal <img> fallback (masters are not shipped). */
  fallback: string;
  /** JPEG srcset, so the bare <img> still width-selects where <picture> is unused. */
  jpegSrcSet: string;
  width: number;
  height: number;
}

/** The rungs one format actually carries. Mirrors the emit filter in
 *  scripts/responsive-images.mjs: a capped format keeps at least the narrowest
 *  rung, so no srcset is ever empty. */
function widthsFor(entry: ManifestEntry, ext: string): number[] {
  const cap = CAP[ext];
  if (!cap) return entry.widths;
  const kept = entry.widths.filter((w) => w <= cap);
  return kept.length ? kept : entry.widths.slice(0, 1);
}

function srcSetFor(entry: ManifestEntry, ext: string): string {
  return widthsFor(entry, ext)
    .map((w) => `${withBasePath(`${data.dir}/${entry.base}-${w}.${ext}`)} ${w}w`)
    .join(", ");
}

/** Resolve a content image path (e.g. "/images/hero-1.jpg") to its variants,
 *  or null when the image has no generated variants (e.g. the logo). */
export function resolveImage(src: string): ResolvedImage | null {
  const entry = data.images[src];
  if (!entry) return null;
  const jpegs = widthsFor(entry, "jpeg");
  const largestJpeg = jpegs[jpegs.length - 1];
  return {
    sources: entry.formats.map((ext) => ({
      ext,
      mime: MIME[ext] ?? `image/${ext}`,
      srcSet: srcSetFor(entry, ext),
    })),
    fallback: withBasePath(`${data.dir}/${entry.base}-${largestJpeg}.jpeg`),
    jpegSrcSet: srcSetFor(entry, "jpeg"),
    width: entry.width,
    height: entry.height,
  };
}

// The two viewports every `sizes` ladder on this site is written against, and
// the breakpoint between them. They are reference frames, not assumptions
// about the reader's screen: `sizes` can only branch on a media query, so a
// box whose proportions depend on the window has to be measured somewhere.
const REFERENCE_WIDE: readonly [number, number] = [1440, 900];
const REFERENCE_COMPACT: readonly [number, number] = [390, 844];
const BREAKPOINT = "(min-width: 768px)";

/** A box on the page, in fractions of the viewport. */
export interface SizeBox {
  vw: number;
  vh: number;
}

export const FULL_VIEWPORT: SizeBox = { vw: 1, vh: 1 };

/** The home hero's frame. Every layer in that section - the poster, the copy
 *  of it masked to the land, the card's slides and the LCP preload - is pushed
 *  past the window and back as the card opens, so the widest each of them is
 *  ever painted is the window plus that push. They all declare this one box:
 *  two declarations of the same photograph that resolve to different rungs
 *  cost a second download of it. */
export const HERO_PUSH = 0.03;
export const HERO_VIEWPORT: SizeBox = { vw: 1 + HERO_PUSH, vh: 1 + HERO_PUSH };

// How wide a cover-fitted photograph is actually *painted*, which is not how
// wide its box is. `object-fit: cover` scales the frame until it covers both
// axes: where the frame is proportionally wider than the box, it is fitted by
// its height and painted wider than the box, with the sides cropped off. A
// `sizes` of the box width therefore under-declares the picture by exactly
// that ratio, and the browser fetches a variant it then has to magnify - the
// ultra-wide slide asked for 100vw in a 16:10 window and was painted at
// 134vw, and the same frame in a phone's portrait window at 464vw.
//
// This returns the painted width instead, so the fetched variant is never
// smaller than the pixels the screen needs. It is the box that is declared
// per breakpoint; the overscale comes from the frame's own aspect in the
// manifest, so each photograph gets its own number from the same call.
export function coverSizes(
  src: string,
  wide: SizeBox,
  compact: SizeBox = wide
): string {
  const entry = data.images[src];
  const painted = (box: SizeBox, viewport: readonly [number, number]) => {
    if (!entry) return box.vw * 100;
    const boxAspect = (box.vw * viewport[0]) / (box.vh * viewport[1]);
    const overscale = Math.max(1, entry.width / entry.height / boxAspect);
    // Up to the next tenth of a vw: rounding down would land the declaration
    // under the painted width, which is the defect this exists to close.
    return Math.ceil(box.vw * overscale * 1000) / 10;
  };
  const w = painted(wide, REFERENCE_WIDE);
  const c = painted(compact, REFERENCE_COMPACT);
  return w === c ? `${w}vw` : `${BREAKPOINT} ${w}vw, ${c}vw`;
}

/** The opaque ground a placement stands on until its file arrives: the mean of
 *  the frame's middle third pulled onto the nearest of the page's two ground
 *  plates, so it carries the photograph's hue at the floor's own weight. */
export function imageGround(src: string): string | null {
  return data.images[src]?.ground ?? null;
}

export interface ImagePlaceholder {
  /** `<source>` entries, modern first, then the `<img>` fallback. */
  sources: { mime: string; src: string }[];
  fallback: string;
}

/** The photograph at 24px, inline. It is the under-layer a hero paints on
 *  from its first frame, before any request has been made: the same picture at
 *  a resolution that fits in a kilobyte, at full strength, with the frame's own
 *  `ground` behind it as the last fallback. Null for every frame that is not a
 *  route hero. */
export function imagePlaceholder(src: string): ImagePlaceholder | null {
  const ph = data.images[src]?.placeholder;
  if (!ph) return null;
  const order = ["avif", "webp"].filter((ext) => ph[ext]);
  if (!order.length) return null;
  const fallback = ph[order[order.length - 1]];
  return {
    sources: order.slice(0, -1).map((ext) => ({ mime: MIME[ext] ?? `image/${ext}`, src: ph[ext] })),
    fallback,
  };
}

/** Preload attributes for an LCP image, targeting the best modern format the
 *  manifest carries (AVIF where present). Rendered as a <link rel="preload">
 *  so the image starts downloading before the markup is parsed. */
export function imagePreload(
  src: string,
  sizes: string
): { href: string; imageSrcSet: string; imageSizes: string; type: string } | null {
  const entry = data.images[src];
  if (!entry) return null;
  const ext = entry.formats.includes("avif")
    ? "avif"
    : entry.formats.includes("webp")
      ? "webp"
      : "jpeg";
  const rungs = widthsFor(entry, ext);
  const largest = rungs[rungs.length - 1];
  return {
    href: withBasePath(`${data.dir}/${entry.base}-${largest}.${ext}`),
    imageSrcSet: srcSetFor(entry, ext),
    imageSizes: sizes,
    type: MIME[ext] ?? `image/${ext}`,
  };
}

// ---------------------------------------------------------------------------

// Which file the browser would fetch for a placement, resolved in the client
// against the window it is actually in. It is the rule `verify-placements`
// asserts statically, run the other way round: `sizes` resolves to a CSS
// width, the device multiplies it, and the ladder answers with the first rung
// at or above it.
//
// It exists so a prefetch can name the same URL the destination page will ask
// for. A prefetch of a different rung is not a slower prefetch, it is a second
// download - so this reads the same `sizes` string the placement declares
// rather than a number written down beside it.
function resolveSizes(sizes: string): number | null {
  // "(min-width: 768px) 172.9vw, 464.1vw" - entries in order, first match wins.
  for (const part of sizes.split(",")) {
    const entry = part.trim();
    const match = entry.match(/^(?:\((.+)\)\s+)?([\d.]+)vw$/);
    if (!match) continue;
    const [, query, vw] = match;
    if (query && !window.matchMedia(`(${query})`).matches) continue;
    // The layout viewport, which is what `vw` resolves against and what the
    // media query above was just answered from. `innerWidth` is the visual
    // viewport on iOS, so a reader holding a zoom resolved this to a fraction
    // of the width the page is actually laid out at and named a rung below the
    // one the destination would ask for - and a prefetch of a different rung is
    // not a faster page, it is a second download.
    return (parseFloat(vw) / 100) * document.documentElement.clientWidth;
  }
  return null;
}

/** Which format this browser negotiated, read off a picture it has already
 *  resolved rather than assumed. `<picture>` picks the first `<source>` whose
 *  type it can decode; `currentSrc` is that decision, already made. Guessing
 *  AVIF instead would spend a whole photograph on a browser that will then
 *  fetch the WebP anyway. Client-only. */
export function negotiatedExt(): string | null {
  for (const img of document.querySelectorAll("img")) {
    const src = (img as HTMLImageElement).currentSrc;
    if (!src || !src.includes(`${data.dir}/`)) continue;
    const ext = src.split(".").pop();
    if (ext) return ext;
  }
  return null;
}

/** The variant URL this window would select for `src` at `sizes`, in `ext`.
 *  Client-only: it reads the viewport. */
export function variantUrl(src: string, sizes: string, ext: string): string | null {
  const entry = data.images[src];
  if (!entry) return null;
  const css = resolveSizes(sizes);
  if (css === null) return null;
  const asked = css * (window.devicePixelRatio || 1);
  const rungs = widthsFor(entry, ext);
  const rung = rungs.find((w) => w >= asked) ?? rungs[rungs.length - 1];
  return withBasePath(`${data.dir}/${entry.base}-${rung}.${ext}`);
}
