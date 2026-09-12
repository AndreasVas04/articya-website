import type { EarthCore, EarthCoreOptions } from "@/components/earth-core";
import { watchLiveness } from "@/lib/liveness";
import { watchZoom } from "@/lib/viewport";

// The Earth's half that belongs to the page: the hand, the box, the pinch and
// the watchdog. The scene itself is `earth-core.ts`, and on every engine that
// will carry an OffscreenCanvas it runs in a Web Worker - `earth-worker.ts` -
// because what the scene costs to build is main-thread time the reader is
// using. Measured at 1440x900 the build is a 15ms skin upload and a 12ms wait
// on the linked programs, back to back, and wherever it was placed it landed
// in a gesture: the reader who scrubs the hero open and shut makes still
// moments continuously, and a still moment is a moment they are about to use.
// So it is not placed any more. It is moved.
//
// Nothing crosses the port per frame. The page sends the hand, the box, the
// page scale and the section's entrance; the scene sends a heartbeat twice a
// quarter-second, which is the one thing the watchdog below cannot infer.
//
// Everything here is loaded on demand a viewport ahead of the section and
// thrown away with it; earth-globe.tsx owns that lifecycle.

// How long a page scale has to hold before the drawing buffer is re-cut for it.
const SCALE_SETTLE_MS = 250;
// How long the loop may go without a frame before it is taken to have been
// lost rather than paused.
const STALL_MS = 600;
// How long to wait for the worker to say it is there before giving up on it
// and building the scene on this thread instead.
const WORKER_READY_MS = 2000;

export interface EarthOptions {
  /** The day map, by rung: `[phone, desktop]`. */
  day: [string, string];
  /** The packed lights / clouds / water map. */
  pack: string;
  /** `--color-resin`, as hex: the marks, and the cities' light. */
  resin: string;
  reducedMotion: boolean;
  /** Resolves once the section's entrance has fired (or at once, when there
   *  is no entrance to wait for). Cyprus faces the reader from that moment
   *  and the marks light from it. */
  entered: Promise<void>;
}

export interface EarthHandle {
  dispose: () => void;
}

type Command =
  | { t: "resize"; size: number; ratio: number }
  | { t: "visible"; on: boolean }
  | { t: "zoom"; held: boolean }
  | { t: "enter" }
  | { t: "dragStart" }
  | { t: "drag"; dx: number; dy: number }
  | { t: "dragEnd" }
  | { t: "wake" }
  | { t: "dispose" };

/** A worker is used where the engine has both halves of the transfer. Safari
 *  has carried them since 17 and every Chromium does; anything else runs the
 *  same scene on this thread. */
function canOffload(): boolean {
  return (
    typeof Worker !== "undefined" &&
    typeof HTMLCanvasElement !== "undefined" &&
    typeof HTMLCanvasElement.prototype.transferControlToOffscreen === "function"
  );
}

export function mountEarth(host: HTMLElement, canvas: HTMLCanvasElement, opts: EarthOptions): EarthHandle {
  let disposed = false;
  let built = false;
  let ratio = Math.min(window.devicePixelRatio || 1, 2);
  let zoomed = false;
  let visible = false;
  // The main thread's own clock on the last heartbeat. The worker's
  // `performance.now()` is measured from the worker's birth, not the
  // document's, so its numbers are never compared with ours - only the
  // arrival of the message is.
  let lastAlive = performance.now();

  const coreOptions: EarthCoreOptions = {
    day: opts.day,
    pack: opts.pack,
    resin: opts.resin,
    reducedMotion: opts.reducedMotion,
    size: host.clientWidth,
    ratio,
  };

  // Until the scene is live the commands are kept. A command that is only
  // worth its latest value replaces the one it supersedes; the hand's steps
  // are cumulative and all of them are kept.
  let pending: Command[] = [];
  let deliver: ((c: Command) => void) | null = null;
  const send = (c: Command) => {
    if (disposed && c.t !== "dispose") return;
    if (deliver) {
      deliver(c);
      return;
    }
    if (c.t !== "drag") pending = pending.filter((p) => p.t !== c.t);
    pending.push(c);
  };
  const open = (to: (c: Command) => void) => {
    deliver = to;
    const held = pending;
    pending = [];
    for (const c of held) to(c);
  };

  let worker: Worker | null = null;
  const onScene = () => {
    built = true;
    lastAlive = performance.now();
  };

  // The main thread's own copy of the scene, for an engine without the
  // transfer and for a worker that never answered.
  const mountHere = () => {
    if (disposed) return;
    void import("@/components/earth-core")
      .then((mod) => {
        if (disposed) return;
        const core: EarthCore = mod.createEarth(canvas, coreOptions, () => {
          lastAlive = performance.now();
        });
        onScene();
        open((c) => {
          switch (c.t) {
            case "resize": core.resize(c.size, c.ratio); break;
            case "visible": core.visible(c.on); break;
            case "zoom": core.zoom(c.held); break;
            case "enter": core.enter(); break;
            case "dragStart": core.dragStart(); break;
            case "drag": core.drag(c.dx, c.dy); break;
            case "dragEnd": core.dragEnd(); break;
            case "wake": core.wake(); break;
            case "dispose": core.dispose(); break;
          }
        });
      })
      .catch(() => {
        // No scene: the canvas stays clear and the section is as it was.
      });
  };

  if (canOffload()) {
    // The handshake before the transfer, and it is not ceremony.
    // `transferControlToOffscreen` cannot be undone: once the canvas is given
    // away this thread can never draw on it, so a worker that fails to arrive
    // would take the fallback down with it. The worker answers before it
    // imports anything, so this costs one message and no work.
    let answered = false;
    try {
      worker = new Worker(new URL("@/components/earth-worker", import.meta.url));
    } catch {
      worker = null;
    }
    if (worker) {
      const w = worker;
      const giveUp = window.setTimeout(() => {
        if (answered || disposed) return;
        answered = true;
        w.terminate();
        worker = null;
        mountHere();
      }, WORKER_READY_MS);
      w.onerror = () => {
        if (answered || disposed) return;
        answered = true;
        window.clearTimeout(giveUp);
        w.terminate();
        worker = null;
        mountHere();
      };
      w.onmessage = (event: MessageEvent<{ t: string }>) => {
        const t = event.data?.t;
        if (t === "alive") {
          lastAlive = performance.now();
          return;
        }
        if (t === "built") {
          onScene();
          return;
        }
        if (t !== "ready" || answered) return;
        answered = true;
        window.clearTimeout(giveUp);
        if (disposed) return;
        const off = canvas.transferControlToOffscreen();
        w.postMessage({ t: "init", canvas: off, opts: coreOptions }, [off]);
        open((c) => w.postMessage(c));
      };
    } else {
      mountHere();
    }
  } else {
    mountHere();
  }

  void opts.entered.then(() => send({ t: "enter" }));

  // The box's size is this side's to measure. What it must not do is report a
  // size it has already reported: `setSize` reallocates the drawing buffer,
  // and a reallocation is the one operation on this canvas that can cost the
  // context. The observed box is the host's laid-out width, which a pinch
  // cannot move, so this never runs on a gesture.
  const resizeObserver = new ResizeObserver(() => send({ t: "resize", size: host.clientWidth, ratio }));
  resizeObserver.observe(host);

  // A pinch is not a frame to render.
  //
  // While the reader holds a page scale the compositor is re-rastering every
  // layer on the page at the new scale, and this canvas is asking the same GPU
  // for a frame sixty times a second of a sphere nobody is looking at as a
  // sphere. The loop stops for the whole of the gesture, and the buffer is
  // halved to DPR 1 - a quarter of the pixels - for as long as the reader
  // stays zoomed.
  //
  // The halving waits, and that is the point of the delay. `setPixelRatio`
  // reallocates the drawing buffer, and the middle of a live gesture is the
  // worst moment on the page to ask for memory. So the loop pauses on the
  // first event and the buffer is only re-cut once the gesture has been still
  // for SCALE_SETTLE_MS - and back at scale 1, the same wait again.
  //
  // Whether a scale is being held is not this file's question to answer.
  // `watchZoom` answers it once for the page, on a clock as well as on an
  // event, and this loop is one of the things it restarts.
  let scaleTimer = 0;
  const settleScale = () => {
    const want = zoomed ? 1 : Math.min(window.devicePixelRatio || 1, 2);
    if (want === ratio) return;
    ratio = want;
    send({ t: "resize", size: host.clientWidth, ratio });
  };
  const offZoom = watchZoom((held) => {
    if (held !== zoomed) {
      zoomed = held;
      send({ t: "zoom", held });
    }
    window.clearTimeout(scaleTimer);
    scaleTimer = window.setTimeout(settleScale, SCALE_SETTLE_MS);
  });

  // Rendering runs only while the globe is on screen.
  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    send({ t: "visible", on: visible });
  });
  intersection.observe(host);

  // And the floor under all of it. Every reason the loop has to be stopped is
  // known on this side - the scene is not built, the box is off screen, the
  // reader is pinching, reduced motion has retired it - so a loop that has
  // gone quiet for none of them has been lost by whatever last stood it down,
  // and a lost loop is a planet that has simply stopped turning under the
  // reader's thumb. The heartbeat is the only thing this side cannot infer,
  // and it is why the scene sends one.
  const offLiveness = watchLiveness(() => {
    if (disposed || !built || !visible || zoomed || opts.reducedMotion) return null;
    if (performance.now() - lastAlive < STALL_MS) return null;
    lastAlive = performance.now();
    send({ t: "wake" });
    return "globe loop";
  });

  // The hand, and how it is divided with the page.
  //
  // The division is a place and not a delay: the disc is the globe's and the
  // rest of the box is the page's. A press that lands on the sphere's own
  // silhouette turns it at once, in any direction, mouse and finger alike;
  // one that lands in the corners or the margins is a scroll the globe never
  // sees. The circle is `.earth-grab`, clipped in globals.css to the same
  // `DISC` the camera is framed on, and the browser's own hit test against
  // that clip is what decides - so `touch-action` is read off the right
  // element at the moment the finger lands, which is the only moment an
  // engine reads it.
  //
  // What stood here was a hold: 12px of slop, 150ms, and a horizontal-first
  // escape, because `pan-y` on the whole box meant a vertical finger had
  // already been given to the scroller before the globe could ask for it.
  // Reported from a phone, that reads as a disc that cannot be grabbed - the
  // page moves instead, most tries. The clip removes the reason for the wait.
  //
  // Touch is still driven by touch events and not by pointer events: a
  // browser that has committed a finger to scrolling stops delivering
  // `pointermove` and marks `touchmove` non-cancelable, and that flag is the
  // one honest signal that the grab was never available. It is read once, on
  // the first move - past that the finger is the globe's.
  //
  // A second finger is a pinch and ends the grab on the frame it lands.
  let pointerId: number | null = null;
  let touchId: number | null = null;
  let lastX = 0;
  let lastY = 0;
  let dragging = false;
  let turned = false;

  // The disc's own hit target. Its absence is not an error: the scene is
  // mounted on a host it does not build, and without the circle the globe
  // simply keeps no hand of its own.
  const grabTarget = host.querySelector<HTMLElement>(".earth-grab");
  const onDisc = (event: Event) => grabTarget !== null && event.target === grabTarget;

  const beginDrag = (x: number, y: number) => {
    dragging = true;
    turned = false;
    lastX = x;
    lastY = y;
    canvas.dataset.grab = "";
    send({ t: "dragStart" });
  };
  const letGo = () => {
    if (pointerId !== null && grabTarget?.hasPointerCapture(pointerId)) {
      grabTarget.releasePointerCapture(pointerId);
    }
    pointerId = null;
    touchId = null;
    if (!dragging) return;
    dragging = false;
    delete canvas.dataset.grab;
    send({ t: "dragEnd" });
  };
  const turn = (x: number, y: number) => {
    const dx = x - lastX;
    const dy = y - lastY;
    lastX = x;
    lastY = y;
    send({ t: "drag", dx, dy });
  };

  const onPointerDown = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    if (!event.isPrimary || pointerId !== null) return;
    if (!onDisc(event)) return;
    pointerId = event.pointerId;
    beginDrag(event.clientX, event.clientY);
    grabTarget?.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    if (event.pointerId !== pointerId || !dragging) return;
    turn(event.clientX, event.clientY);
  };
  const onPointerUp = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    if (event.pointerId !== pointerId) return;
    letGo();
  };

  const onTouchStart = (event: TouchEvent) => {
    if (event.touches.length > 1) {
      letGo();
      return;
    }
    if (!onDisc(event)) return;
    const touch = event.touches[0];
    touchId = touch.identifier;
    beginDrag(touch.clientX, touch.clientY);
  };
  const onTouchMove = (event: TouchEvent) => {
    if (event.touches.length > 1) {
      letGo();
      return;
    }
    if (touchId === null) return;
    let touch: Touch | null = null;
    for (let i = 0; i < event.touches.length; i += 1) {
      if (event.touches[i].identifier === touchId) touch = event.touches[i];
    }
    if (!touch) return;
    // Not cancelable on the first move is the browser saying it took this
    // finger before the disc could - the clip should have stopped that, and
    // where it has not the page keeps its scroll.
    if (!turned && !event.cancelable) {
      letGo();
      return;
    }
    turned = true;
    if (event.cancelable) event.preventDefault();
    turn(touch.clientX, touch.clientY);
  };
  const onTouchEnd = () => letGo();

  host.addEventListener("touchstart", onTouchStart, { passive: true });
  host.addEventListener("touchmove", onTouchMove, { passive: false });
  host.addEventListener("touchend", onTouchEnd);
  host.addEventListener("touchcancel", onTouchEnd);
  host.addEventListener("pointerdown", onPointerDown);
  host.addEventListener("pointermove", onPointerMove);
  host.addEventListener("pointerup", onPointerUp);
  host.addEventListener("pointercancel", onPointerUp);

  return {
    dispose: () => {
      send({ t: "dispose" });
      disposed = true;
      window.clearTimeout(scaleTimer);
      offZoom();
      offLiveness();
      resizeObserver.disconnect();
      intersection.disconnect();
      host.removeEventListener("touchstart", onTouchStart);
      host.removeEventListener("touchmove", onTouchMove);
      host.removeEventListener("touchend", onTouchEnd);
      host.removeEventListener("touchcancel", onTouchEnd);
      host.removeEventListener("pointerdown", onPointerDown);
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerup", onPointerUp);
      host.removeEventListener("pointercancel", onPointerUp);
      if (worker) {
        const w = worker;
        worker = null;
        // A beat for the scene to give the context back before the thread goes.
        window.setTimeout(() => w.terminate(), 0);
      }
    },
  };
}
