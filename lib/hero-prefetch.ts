import { hero as aboutHero } from "@/content/about";
import { hero as contactHero } from "@/content/contact";
import { hero as faqHero } from "@/content/faq";
import { hero as homeHero } from "@/content/home";
import {
  coverSizes,
  FULL_VIEWPORT,
  HERO_VIEWPORT,
  resolveImage,
  type SizeBox,
} from "@/lib/images";
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
// by construction rather than by agreement, and in the window the reader is
// actually holding. An `Image` with one format's ladder used to stand in for
// it, and it could only ever carry the format read off a picture the browser
// had already resolved.
//
// The file is not the whole of the wait, either. Safari decodes a photograph
// when something first paints it, and a 2560px AVIF is a run of the decoder
// that lands between the route's arrival and its first frame - so the picture
// here is decoded as soon as it has loaded and *kept*, attached and
// referenced, until the plate it was fetched for is on the page. A detached
// image holds the file; a decoded one that nothing points at is a bitmap the
// engine may drop before it is ever painted.
//
// The hero of each page is the first plate of its `PhotoStage`, which is the
// page's own `hero.image` - the same constant the route renders from, so the
// two cannot drift. Home's is the poster, whose box is the window plus the
// hero's own push and not the window: two declarations of one photograph that
// resolve to different rungs cost a second download of it.
interface RouteHero {
  src: string;
  box: SizeBox;
}
export const ROUTE_HEROES: Record<string, RouteHero> = {
  "/about/": { src: aboutHero.image, box: FULL_VIEWPORT },
  "/faq/": { src: faqHero.image, box: FULL_VIEWPORT },
  "/contact/": { src: contactHero.image, box: FULL_VIEWPORT },
  "/": { src: homeHero.slides[0], box: HERO_VIEWPORT },
};

// The order the queue works through, and the reason it is not the nav's. The
// nav reads Home / FAQ / Contact / About; this is the owner's order for the
// wire, and each page drops itself out of it.
export const PREFETCH_ORDER = ["/about/", "/faq/", "/contact/", "/"];

export interface HeroCandidates {
  /** The content image path the plate declares. */
  src: string;
  /** The plate's own `sizes`, so the selection is the plate's. */
  sizes: string;
}

/** The destination's hero plate as it declares itself, or null when the route
 *  has no hero. */
export function heroCandidates(href: string): HeroCandidates | null {
  const route = ROUTE_HEROES[href];
  if (!route || !resolveImage(route.src)) return null;
  return { src: route.src, sizes: coverSizes(route.src, route.box) };
}

export interface HeroLoad {
  src: string;
  picture: HTMLPictureElement;
  img: HTMLImageElement;
}

// What the `?debug=prefetch` overlay reads. One record per route, written by
// the calls below and never by the overlay; nothing here runs a timer or holds
// a listener, so the readout costs a map write per state change whether or not
// anyone is looking at it.
export type PrefetchState = "idle" | "queued" | "flight" | "warm" | "miss" | "skipped";

interface PrefetchRecord {
  state: PrefetchState;
  /** Why a route was skipped, or how it was asked for. */
  note: string;
  /** The URL the browser selected, once it has selected one. */
  url: string | null;
  at: number;
}

const records = new Map<string, PrefetchRecord>();
const mark = (href: string, state: PrefetchState, note: string, url: string | null = null) => {
  const prev = records.get(href);
  records.set(href, { state, note, url: url ?? prev?.url ?? null, at: performance.now() });
};

export interface PrefetchRow extends PrefetchRecord {
  href: string;
  /** Every request this document has made for the selected file, in order.
   *  The first is the prefetch; a second with a transfer of 0 is the cache
   *  answering the plate, and a second with bytes in it is a real download. */
  requests: { bytes: number; encoded: number; ms: number }[];
}

/** The state of every route's hero, for the overlay. */
export function prefetchReport(): PrefetchRow[] {
  return PREFETCH_ORDER.map((href) => {
    const rec = records.get(href) ?? { state: "idle" as const, note: "", url: null, at: 0 };
    const url = rec.url;
    const requests = url
      ? performance
          .getEntriesByType("resource")
          .filter((e) => e.name === url)
          .map((e) => {
            const r = e as PerformanceResourceTiming;
            return { bytes: r.transferSize, encoded: r.encodedBodySize, ms: Math.round(r.duration) };
          })
      : [];
    return { href, ...rec, requests };
  });
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
  if (!c) {
    mark(href, "skipped", "no hero");
    return null;
  }
  // A route already warm stays warm: the record is what the overlay reads,
  // and a second page asking for a file that is loaded, decoded and held is
  // not a request in flight.
  const state = records.get(href)?.state;
  if (live.has(c.src)) {
    if (state !== "warm") mark(href, "flight", "already in flight");
    return null;
  }
  if (asked.has(href) && !press) {
    if (state !== "warm") mark(href, "flight", "already asked");
    return null;
  }
  if (savingData()) {
    mark(href, "skipped", "Save-Data / prefers-reduced-data");
    return null;
  }
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
  done?: (ok: boolean) => void,
  href?: string
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
  if (href) {
    mark(href, "flight", `${priority} priority`, img.currentSrc || null);
    // The selection runs on insertion in WebKit and on the next microtask in
    // Chromium, so the URL is read again once the engine has made it.
    queueMicrotask(() => {
      if (records.get(href)?.state === "flight") mark(href, "flight", `${priority} priority`, img.currentSrc || null);
    });
  }
  const settle = (ok: boolean) => {
    if (!ok) drop(load);
    if (href) mark(href, ok ? "warm" : "miss", ok ? "loaded and decoded" : "load failed", img.currentSrc || null);
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
export function stopHero(load: HeroLoad, href?: string): void {
  load.img.onload = null;
  load.img.onerror = null;
  load.picture.remove();
  load.img.remove();
  drop(load);
  if (href) {
    asked.delete(href);
    mark(href, "skipped", "stopped: the reader asked for another route");
  }
}

/** The plate this file was fetched for is on the page: let go of the hold. The
 *  plate's own element references the file from here. */
export function releaseHero(src: string): void {
  const load = live.get(src);
  if (!load) return;
  drop(load);
}

/** Mark a route as waiting its turn on the wire. */
export function queueHero(href: string, position: number): void {
  if (records.get(href)?.state === "warm") return;
  mark(href, "queued", `#${position} in the queue`);
}

/** Put the destination's hero on the wire now. */
export function prefetchHero(href: string, press = false): void {
  // A press is a route change starting. A hover is not - a cursor crossing the
  // nav on its way somewhere else would otherwise end the queue for the
  // session.
  if (press) releasePipe(href);
  const c = claimHero(href, press);
  if (!c) return;
  loadHero(c, press ? "high" : "low", undefined, href);
}
