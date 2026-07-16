"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { cn, withBasePath } from "@/lib/utils";

interface GalleryImage {
  src: string;
  alt: string;
}

interface ZoomParallaxProps {
  /** Up to 7 images; the first ends the zoom filling the viewport. */
  images: GalleryImage[];
}

// Per-tile placement, mobile first with md: overrides. The center tile is
// sized so that at full scale it finishes slightly past 100vw/100vh and its
// rounded corners land offscreen.
const TILES = [
  "h-[26vh] w-[52vw] md:h-[26vh] md:w-[26vw]",
  "-top-[21vh] left-[8vw] h-[16vh] w-[44vw] md:-top-[30vh] md:left-[5vw] md:h-[30vh] md:w-[35vw]",
  "-top-[12vh] -left-[38vw] h-[30vh] w-[26vw] md:-top-[10vh] md:-left-[25vw] md:h-[45vh] md:w-[20vw]",
  "left-[40vw] h-[20vh] w-[28vw] md:left-[27.5vw] md:h-[25vh] md:w-[25vw]",
  "top-[22vh] left-[10vw] h-[15vh] w-[30vw] md:top-[27.5vh] md:left-[5vw] md:h-[25vh] md:w-[20vw]",
  "top-[22vh] -left-[30vw] h-[15vh] w-[40vw] md:top-[27.5vh] md:-left-[22.5vw] md:h-[25vh] md:w-[30vw]",
  "top-[19vh] left-[36vw] h-[11vh] w-[20vw] md:top-[22.5vh] md:left-[25vw] md:h-[15vh] md:w-[15vw]",
];

export function ZoomParallax({ images }: ZoomParallaxProps) {
  const container = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);
  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Resting state for reduced motion: the same photos as a plain grid, no
  // pinning, no scroll-linked transforms. The mounted gate keeps the first
  // client render identical to the SSR HTML.
  if (mounted && reducedMotion) {
    return (
      <section className="bg-plaster-muted p-1 md:p-2">
        <div className="grid grid-cols-2 gap-1 md:grid-cols-3 md:gap-2">
          {images.slice(0, TILES.length).map(({ src, alt }, index) => (
            <img
              key={src}
              src={withBasePath(src)}
              alt={alt}
              className={cn(
                "h-full w-full object-cover",
                index === 0
                  ? "col-span-2 aspect-[16/9] md:col-span-3 md:aspect-[21/9]"
                  : "aspect-[4/3]"
              )}
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={container} className="relative h-[200vh] bg-plaster md:h-[300vh]">
      <div className="sticky top-0 h-dvh overflow-hidden">
        {images.slice(0, TILES.length).map(({ src, alt }, index) => (
          <motion.div
            key={src}
            style={{ scale: scales[index] }}
            className="absolute top-0 flex h-full w-full items-center justify-center"
          >
            <div
              className={cn(
                "relative overflow-hidden rounded-xl ring-1 ring-sage/40",
                TILES[index]
              )}
            >
              <img
                src={withBasePath(src)}
                alt={alt}
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
