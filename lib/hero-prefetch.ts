import { hero as aboutHero } from "@/content/about";
import { hero as contactHero } from "@/content/contact";
import { hero as faqHero } from "@/content/faq";
import { coverSizes, FULL_VIEWPORT, resolveImage } from "@/lib/images";
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
// a width, a rung or a format. What is put in the document is the plate's own
// `<picture>`: the same `<source>` elements in the same order with the same
// `sizes`, so the browser makes the same decision it will make on arrival,
// by construction rather than by agreement. An `Image` with one format's
// ladder used to stand in for it, and it could only ever carry the format
// read off a picture the browser had already resolved.
//
// The file is not the whole of the wait, either. Safari decodes a photograph
// when something first paints it, and a 2560px AVIF is a run of the decoder
// that lands between the route's arrival and its first frame - so the picture
// here is decoded as soon as it has loaded and *kept*, attached and
// referenced, until the plate it was fetched for is on the page. A detached
// image holds the file; a decoded one that nothing points at is a bitmap the
// engine may drop before it is ever painted.
//
// The hero of each inner page is the first plate of its `PhotoStage`, which is
// the page's own `hero.image` - the same constant the route renders from, so
// the two cannot drift.
export const ROUTE_HEROES: Record<string, string> = {
  "/about/": aboutHero.image,
  "/faq/": faqHero.image,
  "/contact/": contactHero.image,
};

export interface HeroCandidates {
  /** The content image path the plate declares. */
  src: string;
  /** The plate's own `sizes`, so the selection is the plate's. */
  sizes: string;
}

/** The destination's hero plate as it declares itself, or null when the route
 *  has no hero. */
export function heroCandidates(href: string): HeroCandidates | null {
  const src = ROUTE_HEROES[href];
  if (!src || !resolveImage(src)) return null;
  return { src, sizes: coverSizes(src, FULL_VIEWPORT) };
}

export interface HeroLoad {
  src: string;
  picture: HTMLPictureElement;
  img: HTMLImageElement;
}

// Every route asked for this session, and the loads in flight or held. A
// second request for a file already asked for is a second download on a cold
// miss, so the idle path asks once; a press for a route whose hold has since
// been released asks again, which is a cache hit and a decode ahead of the
// route.
const asked = new Set<string>();
const live = new Map<string, HeroLoad>();

/** True when this route's hero has already been asked for. */
export function alreadyAsked(href: string): boolean {
  return asked.has(href);
}

/** Reserve a route, so two paths cannot ask for the same file. Returns the
 *  candidates to load, or null when there is nothing to do. */
export function claimHero(href: string, press = false): HeroCandidates | null {
  const c = heroCandidates(href);
  if (!c) return null;
  if (live.has(c.src)) return null;
  if (asked.has(href) && !press) return null;
  if (savingData()) return null;
  asked.add(href);
  return c;
}

/** Start the load, at `priority`, and return it so a queue can stop it. The
 *  plate's own request on arrival coalesces onto this one: it is the same
 *  document, the same candidates and the same selection. `done` fires once
 *  the file is loaded and decoded, or on a miss. */
export function loadHero(
  c: HeroCandidates,
  priority: "high" | "low",
  done?: (ok: boolean) => void
): HeroLoad | null {
  const resolved = resolveImage(c.src);
  if (!resolved) return null;
  const picture = document.createElement("picture");
  for (const s of resolved.sources) {
    const source = document.createElement("source");
    source.type = s.mime;
    source.sizes = c.sizes;
    source.srcset = s.srcSet;
    picture.appendChild(source);
  }
  const img = document.createElement("img");
  img.alt = "";
  img.decoding = "async";
  img.fetchPriority = priority;
  // Into its picture with no source of its own: the `<source>` elements are
  // the selection, and the image loads on insertion in both engines. Given a
  // `src` of its own while detached, WebKit fetched that file as well.
  picture.appendChild(img);
  picture.setAttribute("aria-hidden", "true");
  picture.style.cssText =
    "position:absolute;top:0;left:0;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none";
  document.body.appendChild(picture);
  const load: HeroLoad = { src: c.src, picture, img };
  live.set(c.src, load);
  const settle = (ok: boolean) => {
    if (!ok) drop(load);
    done?.(ok);
  };
  img.onload = () => {
    img.decode().then(
      () => settle(true),
      () => settle(true)
    );
  };
  img.onerror = () => settle(false);
  return load;
}

function drop(load: HeroLoad): void {
  if (live.get(load.src) === load) live.delete(load.src);
  load.picture.remove();
}

/** Stop a load that is no longer wanted. The picture leaves the document
 *  whole and the image then leaves the picture: with no picture and no source
 *  of its own the image update selects nothing, which is what cancels the
 *  request. Taking the sources away one at a time instead re-ran the
 *  selection at each step, and WebKit fetched the WebP and then the JPEG of a
 *  file nobody wanted. */
export function stopHero(load: HeroLoad): void {
  load.img.onload = null;
  load.img.onerror = null;
  load.picture.remove();
  load.img.remove();
  drop(load);
}

/** The plate this file was fetched for is on the page: let go of the hold. The
 *  plate's own element references the file from here. */
export function releaseHero(src: string): void {
  const load = live.get(src);
  if (!load) return;
  drop(load);
}

/** Put the destination's hero on the wire now. */
export function prefetchHero(href: string, press = false): void {
  // A press is a route change starting. A hover is not - a cursor crossing the
  // nav on its way somewhere else would otherwise end the queue for the
  // session.
  if (press) releasePipe(href);
  const c = claimHero(href, press);
  if (!c) return;
  loadHero(c, press ? "high" : "low");
}
