"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { usePathname } from "next/navigation";
import { prefetchReport, type PrefetchRow } from "@/lib/hero-prefetch";
import { groundTurn, savingData, tooSlowToSpeculate } from "@/lib/connection";

const POLL_MS = 250;

const box: CSSProperties = {
  position: "fixed",
  left: 0,
  bottom: 0,
  zIndex: 2147483647,
  maxWidth: "100vw",
  padding: "6px 8px",
  font: "11px/1.35 ui-monospace, Menlo, monospace",
  color: "#fff",
  background: "rgba(0,0,0,0.72)",
  whiteSpace: "pre-wrap",
  wordBreak: "break-all",
  pointerEvents: "none",
};

const kb = (n: number) => `${(n / 1024).toFixed(0)}KB`;

// One line per route: the state, the file the browser selected for this
// window, and every request this document has made for that file. The second
// request is the plate's own on arrival, and its transfer is the answer to
// the question this overlay exists for - 0 bytes is the cache, anything else
// is a second download of a photograph the reader is already looking at.
function line(row: PrefetchRow, here: string): string {
  const name = row.url ? row.url.split("/").pop() : "-";
  const reqs = row.requests
    .map((r, i) => `${i === 0 ? "fetch" : "again"} ${kb(r.bytes)}/${kb(r.encoded)} ${r.ms}ms`)
    .join(" + ");
  const hit =
    row.requests.length > 1
      ? row.requests[row.requests.length - 1].bytes === 0
        ? "  CACHE HIT"
        : "  SECOND DOWNLOAD"
      : row.requests.length === 1 && row.state === "warm"
        ? "  warm, one request"
        : "";
  return `${row.href === here ? ">" : " "}${row.href.padEnd(10)} ${row.state.padEnd(8)} ${name}\n   ${row.note}${reqs ? `  [${reqs}]` : ""}${hit}`;
}

export default function PrefetchDebugPanel() {
  const [, tick] = useState(0);
  const pathname = usePathname();
  useEffect(() => {
    const id = window.setInterval(() => tick((n) => n + 1), POLL_MS);
    return () => window.clearInterval(id);
  }, []);

  const rows = prefetchReport();
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  let here = pathname || "/";
  if (base && here.startsWith(base)) here = here.slice(base.length) || "/";
  if (!here.endsWith("/")) here = `${here}/`;

  const hero = document.querySelector<HTMLImageElement>('main img[fetchpriority="high"]');
  const heroName = hero?.currentSrc?.split("/").pop() ?? "-";
  const lines = [
    `at ${here}  hero ${heroName} ${hero?.complete && hero.naturalWidth ? "painted" : "waiting"}  ground-turn ${groundTurn() ? "passed" : "held"}`,
    `save-data ${savingData() ? "yes" : "no"}  2g ${tooSlowToSpeculate() ? "yes" : "no"}  dpr ${window.devicePixelRatio}  ${window.innerWidth}x${window.innerHeight}`,
    ...rows.map((r) => line(r, here)),
  ];

  return (
    <div style={box} aria-hidden="true">
      {lines.join("\n")}
    </div>
  );
}
