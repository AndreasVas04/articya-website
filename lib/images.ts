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
}
interface Manifest {
  dir: string;
  formats: { ext: string; mime: string }[];
  images: Record<string, ManifestEntry>;
}

const data = manifest as unknown as Manifest;

const MIME: Record<string, string> = Object.fromEntries(
  data.formats.map((f) => [f.ext, f.mime])
);

export interface ImageSource {
  ext: string;
  mime: string;
  srcSet: string;
}

export interface ResolvedImage {
  /** <source> entries, modern formats first (avif, webp), then jpeg. */
  sources: ImageSource[];
  /** Largest JPEG variant — the universal <img> fallback (masters are not shipped). */
  fallback: string;
  /** JPEG srcset, so the bare <img> still width-selects where <picture> is unused. */
  jpegSrcSet: string;
  width: number;
  height: number;
}

function srcSetFor(entry: ManifestEntry, ext: string): string {
  return entry.widths
    .map((w) => `${withBasePath(`${data.dir}/${entry.base}-${w}.${ext}`)} ${w}w`)
    .join(", ");
}

/** Resolve a content image path (e.g. "/images/hero-1.jpg") to its variants,
 *  or null when the image has no generated variants (e.g. the logo). */
export function resolveImage(src: string): ResolvedImage | null {
  const entry = data.images[src];
  if (!entry) return null;
  const largest = entry.widths[entry.widths.length - 1];
  return {
    sources: entry.formats.map((ext) => ({
      ext,
      mime: MIME[ext] ?? `image/${ext}`,
      srcSet: srcSetFor(entry, ext),
    })),
    fallback: withBasePath(`${data.dir}/${entry.base}-${largest}.jpeg`),
    jpegSrcSet: srcSetFor(entry, "jpeg"),
    width: entry.width,
    height: entry.height,
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
  const largest = entry.widths[entry.widths.length - 1];
  return {
    href: withBasePath(`${data.dir}/${entry.base}-${largest}.${ext}`),
    imageSrcSet: srcSetFor(entry, ext),
    imageSizes: sizes,
    type: MIME[ext] ?? `image/${ext}`,
  };
}
