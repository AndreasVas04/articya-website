"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Panel = dynamic(() => import("@/components/prefetch-debug-panel"), { ssr: false });

// The on-device readout for the speculative hero queue, and it exists only
// behind `?debug=prefetch`: nothing is rendered and the panel's chunk is not
// fetched on any other URL. It is mounted in the layout rather than on home,
// because the queue now runs on every route and the question it answers -
// whether the destination's file was warm when the finger landed - is asked
// from wherever the reader is standing.
export function PrefetchDebug() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (new URLSearchParams(location.search).get("debug") === "prefetch") setOn(true);
  }, []);
  return on ? <Panel /> : null;
}
