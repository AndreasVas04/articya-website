// The reader's connection, and who is allowed to hold it. Two pages
// speculate ahead of the reader now - home fetches the three inner heroes out
// of its idle time, and About warms the finale's seven tiles as the reader
// comes down onto them - and both answer to the same two questions and share
// the same single-holder pipe.

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

/** Register a queue; returns its own deregister. */
export function holdPipe(q: Queue): () => void {
  queue = q;
  return () => {
    if (queue === q) queue = null;
  };
}

/** Clear the wire for a route the reader has actually asked for. */
export function releasePipe(keep: string | null): void {
  queue?.stop(keep);
  queue = null;
}
