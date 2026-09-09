"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Panel = dynamic(() => import("@/components/hero-debug-panel"), { ssr: false });

// The on-device readout for the hero's touch machinery, and it exists only
// behind `?debug=hero`: nothing is rendered and the panel's chunk is not
// fetched on any other URL.
export function HeroDebug() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (new URLSearchParams(location.search).get("debug") === "hero") setOn(true);
  }, []);
  return on ? <Panel /> : null;
}
