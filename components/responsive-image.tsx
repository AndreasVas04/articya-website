import type { CSSProperties } from "react";
import { resolveImage } from "@/lib/images";
import { cn, withBasePath } from "@/lib/utils";

interface ResponsiveImageProps {
  /** Content image path, e.g. "/images/hero-1.jpg". */
  src: string;
  alt: string;
  /** The CSS `sizes` value — how wide the image renders at each breakpoint. */
  sizes: string;
  /** Absolutely fills a positioned parent, object-cover — replaces `next/image` fill. */
  fill?: boolean;
  /** LCP image: eager, high fetch priority, never lazy. Everything else lazy-loads. */
  priority?: boolean;
  className?: string;
  style?: CSSProperties;
  draggable?: boolean;
}

// One shared <picture> emitting AVIF + WebP + JPEG srcsets so the browser
// downloads the width and format it will actually display — the responsive
// pipeline `next/image` can't provide under `output: export`. Widths/formats
// come from the build-time manifest (lib/images.ts). Explicit width/height on
// every image reserve the aspect ratio so nothing shifts as it loads.
export function ResponsiveImage({
  src,
  alt,
  sizes,
  fill = false,
  priority = false,
  className,
  style,
  draggable,
}: ResponsiveImageProps) {
  const resolved = resolveImage(src);
  const loading = priority ? "eager" : "lazy";
  const fetchPriority = priority ? "high" : undefined;

  // Fill mode mirrors next/image: the <picture> is display:contents (no box),
  // so the absolute img resolves against the positioned parent the caller sizes.
  const imgClass = cn(
    fill && "absolute inset-0 h-full w-full object-cover",
    className
  );

  // No manifest entry (e.g. an image outside the graded set): plain <img>,
  // still with the loading/CLS attributes.
  if (!resolved) {
    return (
      <img
        src={withBasePath(src)}
        alt={alt}
        sizes={sizes}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding="async"
        draggable={draggable}
        className={imgClass}
        style={style}
      />
    );
  }

  return (
    <picture className={cn("contents")}>
      {resolved.sources.map((s) => (
        <source key={s.ext} type={s.mime} srcSet={s.srcSet} sizes={sizes} />
      ))}
      <img
        src={resolved.fallback}
        srcSet={resolved.jpegSrcSet}
        sizes={sizes}
        width={resolved.width}
        height={resolved.height}
        alt={alt}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding="async"
        draggable={draggable}
        className={imgClass}
        style={style}
      />
    </picture>
  );
}
