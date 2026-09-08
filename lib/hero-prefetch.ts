import { hero as aboutHero } from "@/content/about";
import { hero as contactHero } from "@/content/contact";
import { hero as faqHero } from "@/content/faq";
import { coverSizes, FULL_VIEWPORT, negotiatedExt, resolveImage } from "@/lib/images";
import { releasePipe, savingData } from "@/lib/connection";

// A route change to an inner page paints the page and then waits for its
// photograph. Measured from home at 390x664 DPR 3, the hero arrived 500-1100 ms
// after the route on 4G and 4.3-10.4 s on Fast 3G, and until it did the reader
// had the floor. The picture cannot start downloading any earlier than that on
// its own: it is declared inside a component of a route whose module has not
// been parsed yet, so the request is behind the route's own JavaScript.
//
// The fix is to ask for it before the route exists. Which file to ask for is
// the whole of the problem - a prefetch of a rung the destination will not
// choose is not a head start, it is a second download - so nothing here names
// a width and nothing here picks a rung. What is handed over is the ladder and
// the `sizes` string the plate itself declares, and the device does the
// choosing, with its own window and its own ratio.
//
// The hero of each inner page is the first plate of its `PhotoStage`, which is
// the page's own `hero.image` - the same constant the route renders from, so
// the two cannot drift.
export const ROUTE_HEROES: Record<string, string> = {
  "/about/": aboutHero.image,
  "/faq/": faqHero.image,
  "/contact/": contactHero.image,
};

/** The candidate set the destination's hero plate declares, in the format this
 *  browser has already negotiated - or null when the route has no hero or the
 *  format is not yet knowable.
 *
 *  It is the ladder and the `sizes` string, not a width. Deriving the rung here
 *  meant resolving the media query, reading the window and multiplying by the
 *  device ratio - three numbers this file has no business owning, and on iOS
 *  the second of them is the *visual* viewport. Handing the same two strings to
 *  an `Image` runs the browser's own selection algorithm over the browser's own
 *  candidates, so the file asked for is the file the plate will ask for by
 *  construction rather than by agreement. */
export function heroCandidates(href: string): { srcSet: string; sizes: string } | null {
  const src = ROUTE_HEROES[href];
  if (!src) return null;
  const resolved = resolveImage(src);
  const ext = negotiatedExt();
  if (!resolved || !ext) return null;
  const source = resolved.sources.find((s) => s.ext === ext);
  if (!source) return null;
  return { srcSet: source.srcSet, sizes: coverSizes(src, FULL_VIEWPORT) };
}

// Once per route per session: a second request for a file already asked for is
// a second download on a cold miss and noise on a warm one.
const asked = new Set<string>();

/** True when this route's hero has already been asked for. */
export function alreadyAsked(href: string): boolean {
  return asked.has(href);
}

/** Reserve a route, so two paths cannot ask for the same file. Returns the
 *  candidates to load, or null when there is nothing to do. */
export function claimHero(href: string): { srcSet: string; sizes: string } | null {
  if (asked.has(href)) return null;
  if (savingData()) return null;
  const c = heroCandidates(href);
  if (!c) return null;
  asked.add(href);
  return c;
}

// A detached image is collectable the moment nothing points at it, and a
// collected image is a cancelled request. These hold the reference until the
// load settles; the decode is not done until something paints it, so what is
// held here is the encoded file and not a bitmap.
const inFlight = new Set<HTMLImageElement>();

/** Start the load, at `priority`, and return the element so a queue can stop
 *  it. The plate's own request on arrival coalesces onto this one: it is the
 *  same document, the same candidates and the same selection. */
export function loadHero(
  c: { srcSet: string; sizes: string },
  priority: "high" | "low",
  done?: (ok: boolean) => void
): HTMLImageElement {
  const img = new Image();
  const settle = (ok: boolean) => {
    inFlight.delete(img);
    done?.(ok);
  };
  img.onload = () => settle(true);
  img.onerror = () => settle(false);
  img.fetchPriority = priority;
  img.sizes = c.sizes;
  inFlight.add(img);
  // Last, so the selection runs with `sizes` already on the element.
  img.srcset = c.srcSet;
  return img;
}

/** Stop a load that is no longer wanted. Removing both attributes re-runs the
 *  image update with no source, which is what cancels the request. */
export function stopHero(img: HTMLImageElement): void {
  inFlight.delete(img);
  img.onload = null;
  img.onerror = null;
  img.removeAttribute("srcset");
  img.removeAttribute("src");
}

/** Put the destination's hero on the wire now. */
export function prefetchHero(href: string, press = false): void {
  // A press is a route change starting. A hover is not - a cursor crossing the
  // nav on its way somewhere else would otherwise end the queue for the
  // session.
  if (press) releasePipe(href);
  const c = claimHero(href);
  if (!c) return;
  loadHero(c, press ? "high" : "low");
}
