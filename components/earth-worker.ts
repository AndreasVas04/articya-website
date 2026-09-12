/// <reference lib="webworker" />
import type { EarthCore, EarthCoreOptions } from "@/components/earth-core";

// The Earth's thread. Everything the scene costs to build - three.js
// evaluated, the four programs linked, the two skins fetched, decoded and
// uploaded - happens here, so none of it can land in a frame the reader is
// looking at. `earth-scene.ts` is the other side of this port.
//
// The scene is imported on the first message rather than at the top, and that
// ordering is the whole reason the fallback is safe: `ready` has to reach the
// page before the canvas is transferred, because a transfer cannot be undone
// and a worker that never answers must leave the canvas untouched for the
// main-thread path to use. A static import would be evaluated first and the
// answer would be 24ms late.

type Message =
  | { t: "init"; canvas: OffscreenCanvas; opts: EarthCoreOptions }
  | { t: "resize"; size: number; ratio: number }
  | { t: "visible"; on: boolean }
  | { t: "zoom"; held: boolean }
  | { t: "enter" }
  | { t: "dragStart" }
  | { t: "drag"; dx: number; dy: number }
  | { t: "dragEnd" }
  | { t: "wake" }
  | { t: "dispose" };

const scope = self as unknown as DedicatedWorkerGlobalScope;
let core: EarthCore | null = null;
let queue: Message[] = [];

const apply = (m: Message) => {
  if (!core) return;
  switch (m.t) {
    case "resize": core.resize(m.size, m.ratio); break;
    case "visible": core.visible(m.on); break;
    case "zoom": core.zoom(m.held); break;
    case "enter": core.enter(); break;
    case "dragStart": core.dragStart(); break;
    case "drag": core.drag(m.dx, m.dy); break;
    case "dragEnd": core.dragEnd(); break;
    case "wake": core.wake(); break;
    case "dispose": core.dispose(); core = null; break;
  }
};

scope.onmessage = (event: MessageEvent<Message>) => {
  const m = event.data;
  if (m.t === "init") {
    void import("@/components/earth-core")
      .then((mod) => {
        core = mod.createEarth(m.canvas, m.opts, () => scope.postMessage({ t: "alive" }));
        // Anything the hand did while the scene was still being built.
        const held = queue;
        queue = [];
        for (const q of held) apply(q);
        scope.postMessage({ t: "built" });
      })
      .catch(() => scope.postMessage({ t: "failed" }));
    return;
  }
  // A message that arrives before the scene exists is kept, except the ones
  // that are only worth their latest value.
  if (!core) {
    if (m.t === "dispose") { queue = []; return; }
    queue = queue.filter((q) => q.t !== m.t || q.t === "drag");
    queue.push(m);
    return;
  }
  apply(m);
};

scope.postMessage({ t: "ready" });
