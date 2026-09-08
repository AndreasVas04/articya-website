import { hero as aboutHero } from "@/content/about";
import { hero as contactHero } from "@/content/contact";
import { hero as faqHero } from "@/content/faq";
import { coverSizes, FULL_VIEWPORT, negotiatedExt, variantUrl } from "@/lib/images";
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
// a width. The URL comes out of the same `coverSizes()` the plate declares and
// the same ladder `verify-placements` asserts, resolved against the window the
// reader is actually in.
//
// The hero of each inner page is the first plate of its `PhotoStage`, which is
// the page's own `hero.image` - the same constant the route renders from, so
// the two cannot drift.
export const ROUTE_HEROES: Record<string, string> = {
  "/about/": aboutHero.image,
  "/faq/": faqHero.image,
  "/contact/": contactHero.image,
};

/** The file the destination's hero plate would fetch in this window, or null
 *  when the route has no hero or the format is not yet knowable. */
export function heroRung(href: string): string | null {
  const src = ROUTE_HEROES[href];
  if (!src) return null;
  const ext = negotiatedExt();
  if (!ext) return null;
  return variantUrl(src, coverSizes(src, FULL_VIEWPORT), ext);
}

// Once per route per session: a second request for a file already asked for is
// a second download on a cold miss and noise on a warm one.
const asked = new Set<string>();

/** True when this route's hero has already been asked for. */
export function alreadyAsked(href: string): boolean {
  return asked.has(href);
}

/** Reserve a route, so two paths cannot ask for the same file. Returns the URL
 *  to fetch, or null when there is nothing to do. */
export function claimHero(href: string): string | null {
  if (asked.has(href)) return null;
  if (savingData()) return null;
  const url = heroRung(href);
  if (!url) return null;
  asked.add(href);
  return url;
}

/** Put the destination's hero on the wire now.
 *
 *  `rel="preload"`, not `rel="prefetch"`, and the route change is why.
 *  Prefetch is for a *navigation*: its response is held against the next
 *  document, and a client-side route change never commits one - measured, the
 *  prefetched file and the plate's own request were two downloads of the same
 *  URL, and the hero landed 4 s later on Fast 3G than with no prefetch at all.
 *  A preload is a request of *this* document, which is the document the plate
 *  ends up in, so the plate's request coalesces onto it. */
export function prefetchHero(href: string, press = false): void {
  // A press is a route change starting. A hover is not - a cursor crossing the
  // nav on its way somewhere else would otherwise end the queue for the
  // session.
  if (press) releasePipe(href);
  const url = claimHero(href);
  if (!url) return;
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "image";
  link.href = url;
  document.head.appendChild(link);
}
