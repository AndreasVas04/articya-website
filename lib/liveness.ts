// The floor under the gesture machines, and it is not a feel fix.
//
// Every state this site drives by hand - the hero's opening and its way back
// in, the globe's render loop - stands down for something and comes back when
// that something says so. Each of those hand-offs has now been got wrong at
// least once, and the shape of the defect is always the same: a signal that
// was going to re-arm the machine never arrives, and the machine is dead for
// the life of the page while the reader goes on working at it. A reader
// meeting that has no way back except a reload.
//
// So the last word is a clock rather than a signal. Once a second, and only
// while the reader is actually doing something, each machine is asked whether
// it is stopped somewhere it has no business being stopped; one that is, is
// restarted. Nothing here decides how the page should feel - a machine that
// is working is never touched, and the assertion that keeps it honest is that
// across a minute of ordinary reading it fires zero times.

import { heroTrace } from "@/lib/hero-trace";

const SWEEP_MS = 1000;
// Only while the reader is at the page. A tab left open overnight has nothing
// to recover and no one to recover it for.
const INPUT_WINDOW_MS = 2000;

/** Returns what it recovered, or null if there was nothing to recover. */
type Liveness = () => string | null;

const checks = new Set<Liveness>();
const counts = new Map<string, number>();
let timer = 0;
let lastInput = 0;

// Evidence the reader is at the page, and deliberately not `touchmove`: that
// one fires at the rate of a thumb, and a handler on it is paid for by every
// scroll on the site to answer a question `scroll` already answers. A drag
// long enough to outlive its own `touchstart` is scrolling something.
const INPUT = ["wheel", "scroll", "touchstart", "touchend", "pointerdown", "keydown"] as const;
const mark = () => {
  lastInput = performance.now();
};

const sweep = () => {
  if (performance.now() - lastInput > INPUT_WINDOW_MS) return;
  for (const check of [...checks]) {
    let what: string | null = null;
    try {
      what = check();
    } catch {
      // A check that throws is not a reason to stop checking the others.
      what = null;
    }
    if (!what) continue;
    const n = (counts.get(what) ?? 0) + 1;
    counts.set(what, n);
    heroTrace.event("watchdog", `recovered: ${what}, ${n} times`);
  }
};

/** Register a machine's own liveness check. Returns the teardown. */
export function watchLiveness(check: Liveness) {
  checks.add(check);
  if (!timer) {
    for (const type of INPUT) window.addEventListener(type, mark, { passive: true, capture: true });
    timer = window.setInterval(sweep, SWEEP_MS);
  }
  return () => {
    checks.delete(check);
    if (checks.size) return;
    for (const type of INPUT) window.removeEventListener(type, mark, { capture: true });
    window.clearInterval(timer);
    timer = 0;
  };
}

/** What the overlay prints: every recovery this page has needed. */
export function recoveries(): string {
  if (!counts.size) return "none";
  return [...counts].map(([what, n]) => `${what} x${n}`).join(", ");
}
