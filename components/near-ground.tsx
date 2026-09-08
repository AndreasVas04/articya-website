"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// A full-bleed ground that is not painted while its section is more than a
// viewport away.
//
// The four defocused copies of the valley and the sharp one under them are six
// composited layers - each one a filter or a mask, each one the size of the
// window - and they were in the layer tree from the moment home parsed until
// the reader left it, whatever screen they were on. On iOS every one of those
// backing stores is re-rastered at the square of a page scale, so six of them
// standing off-screen are six the reader pays for on a pinch anywhere.
//
// The lead is a whole viewport, which is the browser's decode back before the
// section has arrived. The first render says "near", so the server's HTML and
// the first client frame are the ones they always were.
export function NearGround({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [near, setNear] = useState(true);

  useEffect(() => {
    // The section, not this layer: hidden, this box would report nothing.
    const host = ref.current?.parentElement;
    if (!host) return;
    const watch = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), {
      rootMargin: "100% 0px 100% 0px",
    });
    watch.observe(host);
    return () => watch.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={className}
      style={near ? undefined : { display: "none" }}
    >
      {children}
    </div>
  );
}
