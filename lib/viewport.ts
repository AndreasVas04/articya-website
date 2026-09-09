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
export const pageZoomed = (): boolean => {
  const vv = window.visualViewport;
  return Boolean(vv) && Math.abs(vv!.scale - 1) > ZOOM_TOLERANCE;
};

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

  window.addEventListener("resize", onResize);
  window.addEventListener("orientationchange", onOrientation);
  return () => {
    window.clearTimeout(timer);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("orientationchange", onOrientation);
  };
}
