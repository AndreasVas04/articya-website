// The route change as one move: the destination wipes over the current page,
// top to bottom, and the header stays put. See components/route-wipe.tsx.

// The transition in flight, so an entrance on the destination can wait for
// the wipe to finish before it plays; resolved at once when none is running.
let settled: Promise<void> = Promise.resolve();

export function routeSettled(): Promise<void> {
  return settled;
}

export function holdRoute(finished: Promise<unknown>): void {
  settled = finished.then(
    () => undefined,
    () => undefined
  );
}
