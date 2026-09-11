"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

import { onLayoutResize } from "@/lib/viewport";

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
    // The rail is `display: none` below 860px and this effect does not care
    // what CSS thinks - so on a phone it used to read six rects per scroll
    // frame, 1314 of them across one pass of home, to move a mark nobody on
    // that screen can see. It is the whole of home's forced layout during a
    // scroll, and the route with the worst frames of the four.
    const wide = window.matchMedia("(min-width: 860px)");
    let stop: (() => void) | null = null;

    const start = () => {
      // The hero is found by its own class rather than tagged, so nothing in
      // the frozen hero has to change to be counted.
      const zones = [
        document.querySelector<HTMLElement>(".hero-drop-scope"),
        ...Array.from(document.querySelectorAll<HTMLElement>("[data-index-section]")),
      ].filter((el): el is HTMLElement => el !== null);
      if (zones.length === 0) return null;

      // Where each zone begins in the document, and the middle of the window
      // as a document row. Both are read here and on a layout change, never
      // per frame: a zone does not move as the page scrolls, so a rect inside
      // the scroll handler asks the engine to lay the page out again to be
      // told the number the scroll offset already carries.
      let tops: number[] = [];
      let mid = 0;
      let raf = 0;

      const read = () => {
        raf = 0;
        const at = window.scrollY + mid;
        let next = 0;
        for (let i = 0; i < tops.length; i += 1) {
          if (tops[i] <= at) next = i;
        }
        setActive(Math.min(next, SECTIONS.length - 1));
      };
      const measure = () => {
        mid = window.innerHeight / 2;
        tops = zones.map((el) => el.getBoundingClientRect().top + window.scrollY);
        read();
      };
      const onScroll = () => {
        if (!raf) raf = requestAnimationFrame(read);
      };

      measure();
      window.addEventListener("scroll", onScroll, { passive: true });
      const offResize = onLayoutResize(measure);
      // The zones move under this rail whenever anything above one reflows -
      // a pinned panel taking its height, a font swapping, a late image - and
      // none of those is a resize.
      const observer = new ResizeObserver(measure);
      observer.observe(document.documentElement);
      return () => {
        window.removeEventListener("scroll", onScroll);
        offResize();
        observer.disconnect();
        if (raf) cancelAnimationFrame(raf);
      };
    };

    const sync = () => {
      if (wide.matches && !stop) stop = start();
      else if (!wide.matches && stop) {
        stop();
        stop = null;
      }
    };
    sync();
    wide.addEventListener("change", sync);
    return () => {
      wide.removeEventListener("change", sync);
      stop?.();
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
