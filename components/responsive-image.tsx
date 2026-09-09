"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { resolveImage } from "@/lib/images";
import { cn, withBasePath } from "@/lib/utils";

interface ResponsiveImageProps {
  /** Content image path, e.g. "/images/hero-1.jpg". */
  src: string;
  alt: string;
  /** The CSS `sizes` value - how wide the image renders at each breakpoint. */
  sizes: string;
  /** Absolutely fills a positioned parent, object-cover - replaces `next/image` fill. */
  fill?: boolean;
  /** LCP image: eager, high fetch priority, never lazy. Everything else lazy-loads. */
  priority?: boolean;
  /** Eager without claiming priority - a placement whose file is already in
   *  the cache and whose decode should not be left to the moment it is
   *  needed. The finale's tiles take it once the warmer has landed them. */
  eager?: boolean;
  className?: string;
  style?: CSSProperties;
  draggable?: boolean;
}

// Whether this document has hydrated. The first placement to mount sets it;
// every placement that mounts after that was created by the client router.
let hydrated = false;

// One shared <picture> emitting AVIF + WebP + JPEG srcsets so the browser
// downloads the width and format it will actually display - the responsive
// pipeline `next/image` can't provide under `output: export`. Widths/formats
// come from the build-time manifest (lib/images.ts). Explicit width/height on
// every image reserve the aspect ratio so nothing shifts as it loads.
//
// A placement created by the client router carries no `src` and no `srcset`
// on its `<img>`; the `<source>` elements decide. React creates the image,
// sets its attributes and only then appends it to the picture, and WebKit runs
// the source selection as the attributes land: on an image outside any picture
// that selection sees no `<source>` and fetches the JPEG fallback - measured
// on the way from home to /faq/, a 567KB file the page never paints, on the
// wire beside the AVIF it does. Setting the two one render later cost a
// second download of the AVIF instead, from the soft plate's lazy image. A
// bare image inside a picture selects from the sources the moment it is
// inserted, in both engines, and every browser that runs the router reads a
// `<picture>`. The parser builds the picture whole, so the exported HTML and
// the hydrating render carry both attributes as before.
export function ResponsiveImage({
  src,
  alt,
  sizes,
  fill = false,
  priority = false,
  eager = false,
  className,
  style,
  draggable,
}: ResponsiveImageProps) {
  const resolved = resolveImage(src);
  const [fallbacks] = useState(() => !hydrated);
  useEffect(() => {
    hydrated = true;
  }, []);
  const loading = priority || eager ? "eager" : "lazy";
  const fetchPriority = priority ? "high" : undefined;
  // The page's own photograph decodes on the frame that paints it, not one or
  // two frames later. `async` is right for everything else - a decode off the
  // main thread never holds a frame - but it is what puts a beat of ground
  // between a route arriving and its picture being on it, and on a warm cache
  // that beat is the whole of the wait.
  const decoding = priority ? "sync" : "async";

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
        decoding={decoding}
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
        src={fallbacks ? resolved.fallback : undefined}
        srcSet={fallbacks ? resolved.jpegSrcSet : undefined}
        sizes={sizes}
        width={resolved.width}
        height={resolved.height}
        alt={alt}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding={decoding}
        draggable={draggable}
        className={imgClass}
        style={style}
      />
    </picture>
  );
}
