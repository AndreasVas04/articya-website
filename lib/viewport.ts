// A pinch is not a resize, and on a phone that is not a distinction the
// `resize` event makes for you.
//
// iOS reports `innerWidth`, `innerHeight` and `scrollY` against the *visual*
// viewport - the magnifying glass - rather than the page under it, so a
// two-finger zoom changes all three and fires `resize` continuously through
// the gesture. Every handler on the site then re-measures and writes state
// from the middle of a zoom, on the main thread, while the browser is
// re-rastering: layout reads and React renders at exactly the moment the
// compositor can least afford them. No emulator shows it, because a desktop
// engine keeps `innerWidth`/`innerHeight` on the layout viewport and fires
// nothing at all when the page scale changes.
//
// The layout viewport is the one that moved when the page actually changed
// shape, and `clientWidth`/`clientHeight` on the document element is what it
// measures. A pinch never moves it.

// Whether the reader is holding a zoom. A scale within a hundredth of 1 is not
// one: iOS reports the visual viewport's scale as the ratio of two widths, and
// at rest the ratio is not always exactly 1. A gate that read `scale !== 1`
// could shut a whole gesture machine on a page nobody had zoomed.
const ZOOM_TOLERANCE = 0.01;
const scale = (): number => window.visualViewport?.scale ?? 1;
export const pageZoomed = (): boolean => Math.abs(scale() - 1) > ZOOM_TOLERANCE;

// A zoom always ends.
//
// Three machines on this page stand down while the reader holds a page scale:
// the hero's way back in, the globe's render loop, and every handler that
// re-measures the layout. Each one used to watch the visual viewport itself
// and decide on its own, and each one therefore re-armed only if a final event
// arrived saying the gesture was over. On the owner's phone one did not: the
// scale came back to 1 with no event behind it, and what was standing down
// stayed down for the life of the page - a hero that would not close beside a
// globe that had stopped turning, which is how two unrelated systems freeze in
// the same frame.
//
// So the question is asked in one place, and asked on a clock as well as on an
// event. While the scale is held the state is polled, because a poll is the
// only observer that cannot be starved by an event that never fires; at rest
// it costs nothing, because nothing is scheduled until a zoom begins.
const ZOOM_POLL_MS = 250;
type ZoomWatcher = (zoomed: boolean) => void;
const watchers = new Set<ZoomWatcher>();
let zoomHeld = false;
let lastScale = 1;
let poll = 0;

const readZoom = () => {
  const now = scale();
  const held = Math.abs(now - 1) > ZOOM_TOLERANCE;
  const moved = now !== lastScale;
  lastScale = now;
  if (held === zoomHeld && !moved) return;
  zoomHeld = held;
  if (held && !poll) poll = window.setInterval(readZoom, ZOOM_POLL_MS);
  if (!held && poll) {
    window.clearInterval(poll);
    poll = 0;
  }
  // A copy, because a watcher is free to unsubscribe from inside its own call.
  for (const fn of [...watchers]) fn(held);
};

/**
 * Call `fn` whenever the page scale moves, with whether the reader is holding
 * a zoom. Returns the teardown.
 */
export function watchZoom(fn: ZoomWatcher) {
  const vv = window.visualViewport;
  watchers.add(fn);
  if (watchers.size === 1 && vv) {
    vv.addEventListener("resize", readZoom);
    vv.addEventListener("scroll", readZoom);
  }
  // A subscriber that arrives mid-gesture is told where it stands, and starts
  // the clock that will tell it when the gesture ends.
  readZoom();
  return () => {
    watchers.delete(fn);
    if (watchers.size || !vv) return;
    vv.removeEventListener("resize", readZoom);
    vv.removeEventListener("scroll", readZoom);
    window.clearInterval(poll);
    poll = 0;
    zoomHeld = false;
  };
}

const layoutSize = (): [number, number] => [
  document.documentElement.clientWidth,
  document.documentElement.clientHeight,
];

// How long the size has to hold before it is believed. iOS fires `resize`
// through a toolbar animation and an orientation change frame by frame, and
// the value is only right at the end of either.
const SETTLE_MS = 120;

/**
 * Run `measure` when the *layout* viewport changes, and at no other time.
 * Returns the teardown.
 */
export function onLayoutResize(measure: () => void, delay = SETTLE_MS) {
  let [width, height] = layoutSize();
  // The visible height as well, but only while it can be trusted. At scale 1
  // this is the toolbar sliding, which is a real change to what the reader
  // can see and which three of these handlers are anchored to; at any other
  // scale it is the zoom, and the gate below has already turned it away.
  let visible = window.innerHeight;
  let timer = 0;

  const settle = (forced: boolean) => {
    const [w, h] = layoutSize();
    const moved = w !== width || h !== height || window.innerHeight !== visible;
    width = w;
    height = h;
    visible = window.innerHeight;
    if (moved || forced) measure();
  };

  const schedule = (forced: boolean) => {
    // Zoomed in, nothing about the layout can have changed. An orientation
    // change is the exception: it is a layout change by definition and has to
    // land whether or not the reader is holding a zoom.
    if (!forced && pageZoomed()) return;
    window.clearTimeout(timer);
    timer = window.setTimeout(() => settle(forced), delay);
  };

  const onResize = () => schedule(false);
  const onOrientation = () => schedule(true);

  // The toolbar can slide while the reader is holding a zoom, and the gate
  // above drops that resize with the gesture's own. So the end of a zoom is
  // itself a reason to look: the comparison is against the size this handler
  // last believed, so a scale that came and went costs nothing.
  const offZoom = watchZoom((held) => {
    if (!held) schedule(false);
  });

  window.addEventListener("resize", onResize);
  window.addEventListener("orientationchange", onOrientation);
  return () => {
    window.clearTimeout(timer);
    offZoom();
    window.removeEventListener("resize", onResize);
    window.removeEventListener("orientationchange", onOrientation);
  };
}
