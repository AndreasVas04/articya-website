// The reader's connection, and who is allowed to hold it. Every page
// speculates ahead of the reader now - each route fetches the other three
// heroes once its own photograph is on the glass, and About warms the
// finale's seven tiles as the reader comes down onto them - and all of it
// answers to the same two questions and shares the same single-holder pipe.

// A reader who has asked not to be spent on is not prefetched for, on either
// path. `prefers-reduced-data` is the declaration; `Save-Data` is the header
// the same preference sends, and the engines carry one or the other.
export function savingData(): boolean {
  if (window.matchMedia("(prefers-reduced-data: reduce)").matches) return true;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return Boolean(conn?.saveData);
}

// The idle path's own guard. A reader on 2g is not helped by photographs
// queued ahead of the page they are on; `saveData` is the preference and this
// is the connection.
export function tooSlowToSpeculate(): boolean {
  const conn = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection;
  const type = conn?.effectiveType;
  return type === "2g" || type === "slow-2g";
}

// The queue that currently holds the pipe. Background speculation holds it
// only until the reader asks for something: the press that starts a route
// change has to find the wire clear, and on a phone that press arrives while
// the queue is most of a photograph into a page nobody has asked for.
//
// The unmount is too late to do this. Measured at 390x664 on 4G, a tap that
// left home mid-queue still let all three files run to completion - React
// unmounts the page when the destination is ready to render, which on a slow
// link is a second after the finger.
export interface Queue {
  /** Stop, keeping whatever is in flight for `keep` - by then that is not
   *  speculation, it is the file the reader is waiting on. */
  stop: (keep: string | null) => void;
}
let queue: Queue | null = null;

// The page's own speculative files - home's stage plates, the card's later
// slides, the Earth - take their turn after the route heroes, not beside
// them. Measured at 390x664 over a 4 Mbps pipe: asked for together at load,
// the three plates, two slides and the Earth's skins put 3.3MB on the wire
// with the About hero, which finished at 9.9 / 12.8 s (WebKit / Chromium) and
// the FAQ hero at 14.6 / 15.4 s - a tap inside the reader's first ten seconds
// was always cold. The turn passes when the queue has drained, or was never
// going to run; a press does not pass it, because the reader is leaving.
//
// The turn passes when the queue drains, when a press takes the wire back, or
// after TURN_CAP_MS whatever the queue is doing. The cap is the backstop and
// not the mechanism: a link slow enough that three heroes are still arriving
// five seconds in is also a link where the reader may already be at "What we
// do", and the ground under the words they are reading outranks a page they
// have not asked for. At the two rates measured the queue drains inside it
// (2.2s at 9 Mbps, 4.7s at 4.2) so the cap never fires.
const TURN_CAP_MS = 5000;

const turnWaiters = new Set<() => void>();
let turnPassed = false;
let capTimer = 0;
const passTurn = () => {
  if (capTimer) { window.clearTimeout(capTimer); capTimer = 0; }
  if (turnPassed) return;
  turnPassed = true;
  for (const fn of turnWaiters) fn();
};

/** True once the page's own speculation may start: the hero queue has run,
 *  or there is none. Until a queue registers, nothing is holding it. */
export function groundTurn(): boolean {
  return turnPassed || queue === null;
}

/** Notify when the turn passes; returns the unsubscribe. */
export function onGroundTurn(fn: () => void): () => void {
  turnWaiters.add(fn);
  return () => {
    turnWaiters.delete(fn);
  };
}

/** Register a queue; returns its own deregister, which also passes the turn
 *  when the queue has drained. */
export function holdPipe(q: Queue): () => void {
  queue = q;
  turnPassed = false;
  return () => {
    if (queue === q) queue = null;
    passTurn();
  };
}

/** The queue has put its first file on the wire: the cap runs from here and
 *  not from the moment the queue registered, which on a slow link is most of a
 *  page load earlier and would spend the cap on a queue that had not started. */
export function startPipeWork(): void {
  if (turnPassed) return;
  if (capTimer) window.clearTimeout(capTimer);
  capTimer = window.setTimeout(passTurn, TURN_CAP_MS);
}

/** Clear the wire for a route the reader has actually asked for. */
export function releasePipe(keep: string | null): void {
  queue?.stop(keep);
  queue = null;
}
