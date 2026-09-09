// A tap on the hero's state, for the on-device overlay (components/hero-debug.tsx).
// Nothing here runs unless the overlay has subscribed: an event is one null
// check when it has not, and the status getter is read only by the overlay.
type Status = Record<string, unknown>;

let listener: ((line: string) => void) | null = null;
let status: (() => Status) | null = null;

export const heroTrace = {
  event(name: string, detail?: string) {
    if (listener) listener(detail ? `${name} ${detail}` : name);
  },
  status(): Status | null {
    return status ? status() : null;
  },
  provide(fn: () => Status) {
    status = fn;
    return () => {
      if (status === fn) status = null;
    };
  },
  listen(fn: (line: string) => void) {
    listener = fn;
    return () => {
      if (listener === fn) listener = null;
    };
  },
};
