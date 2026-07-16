"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { cn, withBasePath } from "@/lib/utils";

const EASE_IN_OUT_CUBIC: [number, number, number, number] = [0.65, 0, 0.35, 1];
const SLIDE_INTERVAL_MS = 4500;
const EXPAND_KEYS = ["ArrowDown", "PageDown", "End", " "];

interface ScrollExpandMediaProps {
  slides: string[];
  bgImageSrc: string;
  title?: string;
  hintLabel?: string;
  children?: ReactNode;
}

const ScrollExpandMedia = ({
  slides,
  bgImageSrc,
  title,
  hintLabel,
  children,
}: ScrollExpandMediaProps) => {
  const reducedMotion = useReducedMotion();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Under reduced motion the component renders its resting state: media
  // expanded, content visible, no scroll hijacking, first slide only. The
  // mounted gate keeps the first client render identical to the SSR HTML.
  const restingState = mounted && reducedMotion;
  const progress = restingState ? 1 : scrollProgress;
  const contentVisible = restingState ? true : showContent;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const expandInstantly = () => {
      setScrollProgress(1);
      setMediaFullyExpanded(true);
      setShowContent(true);
    };

    const applyProgress = (delta: number) => {
      const newProgress = Math.min(Math.max(scrollProgress + delta, 0), 1);
      setScrollProgress(newProgress);
      if (newProgress >= 1) {
        setMediaFullyExpanded(true);
        setShowContent(true);
      } else if (newProgress < 0.75) {
        setShowContent(false);
      }
    };

    const handleWheel = (e: globalThis.WheelEvent) => {
      if (mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        applyProgress(e.deltaY * 0.0009);
      }
    };

    // Keyboard escape hatch: expand in one step so the wheel/touch lock can
    // never trap keyboard or switch-access users.
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (mediaFullyExpanded) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest("a, button, input, select, textarea")) return;
      if (EXPAND_KEYS.includes(e.key)) {
        e.preventDefault();
        expandInstantly();
      }
    };

    const handleTouchStart = (e: globalThis.TouchEvent) => {
      setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: globalThis.TouchEvent) => {
      if (!touchStartY) return;

      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;

      if (mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        // Once progress hits 1 this branch stops matching, so touch events
        // are no longer intercepted and native scrolling resumes.
        e.preventDefault();
        const scrollFactor = deltaY < 0 ? 0.008 : 0.005;
        applyProgress(deltaY * scrollFactor);
        setTouchStartY(touchY);
      }
    };

    const handleTouchEnd = () => {
      setTouchStartY(0);
    };

    const handleScroll = () => {
      if (!mediaFullyExpanded) {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [scrollProgress, mediaFullyExpanded, touchStartY, reducedMotion]);

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // The slideshow runs on its own clock, independent of scroll progress.
  useEffect(() => {
    if (reducedMotion || slides.length < 2) return;
    const id = window.setInterval(
      () => setActiveSlide((i) => (i + 1) % slides.length),
      SLIDE_INTERVAL_MS
    );
    return () => window.clearInterval(id);
  }, [reducedMotion, slides.length]);

  const mediaWidth = 300 + progress * (isMobile ? 650 : 1250);
  const mediaHeight = 400 + progress * (isMobile ? 200 : 400);
  const textTranslateX = progress * (isMobile ? 180 : 150);

  // The photos have bright skies and white clothing, so the headline relies
  // on a dark wash instead of mix-blend: held at 0.75 while the headline can
  // still overlap the frame (progress < 0.35), then eased down to 0.22 —
  // by full expansion the headline has slid away and the content band
  // carries the text, so the photo can show through.
  const overlayOpacity =
    progress < 0.35 ? 0.75 : Math.max(0.22, 0.75 - (progress - 0.35) * 0.82);

  const firstWord = title ? title.split(" ")[0] : "";
  const restOfTitle = title ? title.split(" ").slice(1).join(" ") : "";

  return (
    <div className="overflow-hidden bg-pine-950">
      <section className="relative flex min-h-[100dvh] flex-col items-center justify-start overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0"
          initial={false}
          animate={{ opacity: 1 - progress }}
          transition={{ duration: 0.2, ease: EASE_IN_OUT_CUBIC }}
        >
          <Image
            src={withBasePath(bgImageSrc)}
            alt=""
            fill
            priority
            sizes="100vw"
            className="scale-110 object-cover blur-md"
          />
          <div className="absolute inset-0 bg-pine-950/75" />
        </motion.div>

        <div className="relative z-10 mx-auto flex w-full flex-col items-center">
          <div className="relative flex h-[100dvh] w-full flex-col items-center justify-center">
            <div
              className="absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2"
              style={{
                width: `${mediaWidth}px`,
                height: `${mediaHeight}px`,
                maxWidth: "95vw",
                maxHeight: "85vh",
                boxShadow:
                  "0 0 50px color-mix(in srgb, var(--color-pine-950) 45%, transparent)",
              }}
            >
              <div className="relative h-full w-full overflow-hidden rounded-2xl ring-1 ring-sage/40">
                {restingState ? (
                  <Image
                    src={withBasePath(slides[0])}
                    alt=""
                    fill
                    priority
                    sizes="95vw"
                    className="object-cover"
                  />
                ) : (
                  slides.map((src, i) => (
                    <motion.div
                      key={src}
                      className="absolute inset-0"
                      initial={false}
                      animate={{ opacity: activeSlide === i ? 1 : 0 }}
                      transition={{ duration: 0.7, ease: EASE_IN_OUT_CUBIC }}
                    >
                      <Image
                        src={withBasePath(src)}
                        alt=""
                        fill
                        priority={i === 0}
                        sizes="95vw"
                        className="object-cover"
                      />
                    </motion.div>
                  ))
                )}
                <motion.div
                  className="absolute inset-0 bg-pine-950"
                  initial={false}
                  animate={{ opacity: overlayOpacity }}
                  transition={{ duration: 0.2, ease: EASE_IN_OUT_CUBIC }}
                />
              </div>

              {hintLabel && (
                <div className="mt-4 flex justify-center">
                  <p
                    className="rounded-full border border-sage/60 bg-pine-950/80 px-4 py-1 text-[0.8125rem] font-semibold leading-[1.4] text-resin-light"
                    style={{ transform: `translateX(${textTranslateX}vw)` }}
                  >
                    {hintLabel}
                  </p>
                </div>
              )}
            </div>

            {title && (
              <h1 className="relative z-10 flex flex-col items-center gap-4 text-center font-display text-[clamp(2.75rem,6vw,4.5rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-plaster-bright">
                <span
                  className="block"
                  style={{ transform: `translateX(-${textTranslateX}vw)` }}
                >
                  {firstWord}
                </span>
                {restOfTitle && (
                  <span
                    className="block"
                    style={{ transform: `translateX(${textTranslateX}vw)` }}
                  >
                    {restOfTitle}
                  </span>
                )}
              </h1>
            )}

            {/* The payoff of the expansion: once the frame is full, the intro
                rises inside a band anchored to its bottom edge. A second
                overlay with the frame's geometry keeps the intro after the
                headline in document order. Children opt into the stagger via
                group-data-[expanded] classes. */}
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl"
              style={{
                width: `${mediaWidth}px`,
                height: `${mediaHeight}px`,
                maxWidth: "95vw",
                maxHeight: "85vh",
              }}
            >
              <div
                data-expanded={!mounted || contentVisible ? "" : undefined}
                className={cn(
                  "group pointer-events-auto absolute inset-x-0 bottom-0 flex flex-col items-center bg-pine-950/85 px-6 py-8 opacity-0 backdrop-blur-sm duration-[400ms] ease-out-quart data-[expanded]:opacity-100 data-[expanded]:transition-opacity md:py-10",
                  mounted && !contentVisible && "pointer-events-none"
                )}
              >
                {children}
              </div>
            </div>
          </div>

        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-1/2 z-0 h-40 w-[42rem] max-w-[90vw] -translate-x-1/2 translate-y-1/2 rounded-full bg-resin/45 blur-[80px]"
        />
      </section>
    </div>
  );
};

export default ScrollExpandMedia;
