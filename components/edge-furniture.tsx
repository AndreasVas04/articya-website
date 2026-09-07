"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

// The section index down the right margin of a wide screen: fixed, vertically
// centred and inert.
//
// A ghosted "ArtiCYa" ran down the left margin beside it - the reference set's
// other piece of edge furniture. It is gone. The logo sits top-left on every
// page and the headline says the name, so on the home hero the word appeared
// three times on one screen and the vertical copy was the one that earned
// nothing.
//
// Every character here is CSS pseudo-content, never DOM text. The site's
// visible text is frozen and checked character for character against the
// original pages, so furniture that entered the DOM would read as content
// drift - and this is a mark, not something to be read aloud or found by
// search. It is why the ghosted numerals are built the same way.

// The six beats of the home page, in order.
const SECTIONS = ["01", "02", "03", "04", "05", "06"];

export function SectionIndex() {
  const ref = useRef<HTMLUListElement | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    // The hero is found by its own class rather than tagged, so nothing in
    // the frozen hero has to change to be counted.
    const zones = [
      document.querySelector<HTMLElement>(".hero-drop-scope"),
      ...Array.from(document.querySelectorAll<HTMLElement>("[data-index-section]")),
    ].filter((el): el is HTMLElement => el !== null);
    if (zones.length === 0) return;

    let raf = 0;
    const read = () => {
      raf = 0;
      // Whichever zone owns the middle of the window is the one being read.
      const mid = window.innerHeight / 2;
      let next = 0;
      zones.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        if (r.top <= mid) next = i;
      });
      setActive(Math.min(next, SECTIONS.length - 1));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <ul ref={ref} aria-hidden="true" className="edge-furniture edge-index">
      {SECTIONS.map((n, i) => (
        <li
          key={n}
          {...(i === active ? { "data-on": "" } : {})}
          style={{ "--edge-text": `"${n}"` } as CSSProperties}
        />
      ))}
    </ul>
  );
}
