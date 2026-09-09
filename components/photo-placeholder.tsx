import { imageGround, imagePlaceholder } from "@/lib/images";
import { cn } from "@/lib/utils";

// The under-layer a route hero paints on from its first frame.
//
// A page paints before its photograph exists. The rung is 700-900KB and until
// it lands the reader has `ground` - the frame's own dark pulled onto the
// page's floor - which is right as a floor and is still a flat colour where a
// picture is meant to be: on the owner's phone, about a second of solid green
// on the first visit to every route, and the first thing the site shows.
//
// This is that second given the photograph. 24px of the same graded pixels,
// AVIF and WebP, base64 in the exported HTML - so it is on the glass before
// any script has parsed and before any request has been made - painted full
// bleed at full strength under the real rung, at the plate's own crop.
//
// **It is the photograph, and the ledger's exception is written down rather
// than argued away.** §2.13 forbids a picture at partial strength at any frame
// of a transition, and a blurred thumbnail under a photograph is exactly that.
// This is not held at partial strength and it is not a transition: it is
// opaque, at 1.00, and the rung lands on top of it at 1.00 on a single frame -
// there is no cross-fade, no ramp and no intermediate state anywhere, because
// the two layers are stacked rather than blended. What the ledger forbids is a
// frame that is neither a picture nor a ground; every frame here is a picture.
// It is not a blur effect, a frosted plate or a shape behind text: there is no
// filter on it, its edges are the window's, and the only thing between it and
// the reader is the plate's own darkening, which the rung stands under too.
//
// The colour stays behind it as the last fallback, for a browser that decodes
// neither format and for the frames that carry no placeholder.
export function PhotoPlaceholder({
  src,
  position,
  className,
}: {
  src: string;
  position?: string;
  className?: string;
}) {
  const placeholder = imagePlaceholder(src);
  if (!placeholder) return null;
  const ground = imageGround(src);
  return (
    <div
      aria-hidden="true"
      data-photo-placeholder=""
      className={cn("absolute inset-0", className)}
      style={ground ? { backgroundColor: ground } : undefined}
    >
      <picture className="contents">
        {placeholder.sources.map((s) => (
          <source key={s.mime} type={s.mime} srcSet={s.src} />
        ))}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={placeholder.fallback}
          alt=""
          decoding="sync"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: position }}
        />
      </picture>
    </div>
  );
}
