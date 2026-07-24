"use client";

import {
  useEffect,
  useLayoutEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ResinEmbers } from "@/components/resin-embers";
import { ResponsiveImage } from "@/components/responsive-image";
import { cn } from "@/lib/utils";

// useLayoutEffect on the client, useEffect on the server: the effect it runs
// only ever touches the DOM, so it is a no-op during server rendering, and
// this avoids React's warning about useLayoutEffect there.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

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

  // Re-arm the pre-hydration veil for client-side navigation. The page's
  // inline script sets `hero-js` before the hero parses on a hard load, but
  // that script does not run when home is entered through the client router,
  // so on that path the intro — rendered in its expanded state until `mounted`
  // flips below — would otherwise flash inside the collapsed card. Adding the
  // class in a layout effect lands it before the first paint on a route change
  // too; on a hard load it is already present and this is a no-op.
  useIsomorphicLayoutEffect(() => {
    document.documentElement.classList.add("hero-js");
  }, []);

  // The veil then hands over to React's own hidden state — removed only after
  // the mounted re-render has applied it, so no frame shows the intro in
  // between.
  useEffect(() => {
    if (mounted) document.documentElement.classList.remove("hero-js");
  }, [mounted]);

  // Reloads of this page must start the scroll choreography from the top;
  // the inline script covers the pre-hydration window on hard loads, this
  // covers client-side navigation and restores the browser default on
  // unmount so other pages keep native back/forward behavior.
  useEffect(() => {
    if (!("scrollRestoration" in history)) return;
    history.scrollRestoration = "manual";
    return () => {
      history.scrollRestoration = "auto";
    };
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

  // Clicking the logo while already on home fires this instead of navigating
  // (Next would not remount the route, so the state below would persist). It
  // returns the hero to its collapsed opening — the same view a fresh load
  // shows. The header has already scrolled to the top; the collapsed state
  // then re-pins scroll there via the handler above. Under reduced motion the
  // resting state keeps the hero expanded regardless, matching a fresh load.
  useEffect(() => {
    const reset = () => {
      setScrollProgress(0);
      setMediaFullyExpanded(false);
      setShowContent(false);
      setActiveSlide(0);
    };
    window.addEventListener("home:reset", reset);
    return () => window.removeEventListener("home:reset", reset);
  }, []);

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

  // The card cross-dissolves out of the poster as it grows. The collapsed
  // opening is the full-bleed photograph itself, so a small frame sitting on
  // top of it would read as a photo-in-photo; instead the card is hidden until
  // the growth begins and is full by the time it has any size — the poster
  // becomes the gallery rather than floating a second picture over it.
  const cardOpacity = Math.min(Math.max((progress - 0.02) / 0.28, 0), 1);

  // The poster title hands off to the expanded state instead of being cut. As
  // the card grows the headline settles up and fades over the first third of
  // the expansion, so the opening *becomes* the gallery. The old split-and-
  // slide whipped the two lines 180vw apart on mobile inside a single flick,
  // which read as an instant vanish rather than a transition (see the brief).
  const titleExit = Math.min(Math.max((progress - 0.03) / 0.32, 0), 1);
  const titleOpacity = 1 - titleExit;
  const titleShift = -titleExit * (isMobile ? 30 : 40);

  // The card's own legibility wash for the intro once it is open — held while
  // the headline could overlap, then eased to a thin lift so the rest of the
  // photograph stays at strength.
  const overlayOpacity =
    progress < 0.35 ? 0.75 : Math.max(0.15, 0.75 - (progress - 0.35) * 1.0);

  const firstWord = title ? title.split(" ")[0] : "";
  const restOfTitle = title ? title.split(" ").slice(1).join(" ") : "";

  // The hint pill's middle dot picks up the gold; the halves either side of
  // it stay ink. Split on the first separator only, so the label reads
  // exactly as written when it carries none.
  const hintDotIndex = hintLabel?.indexOf("·") ?? -1;
  const hintSeparator = hintDotIndex >= 0 ? "·" : "";
  const hintBefore = hintDotIndex >= 0 ? hintLabel!.slice(0, hintDotIndex) : "";
  const hintAfter = hintDotIndex >= 0 ? hintLabel!.slice(hintDotIndex + 1) : "";

  // The page's living atmosphere sits behind this frame and shows through, so
  // the hero is lit by the same gold field as everything below it; `gold-field`
  // adds only the edges, taking the top up into the header's gold and the
  // bottom down into the first section's.
  return (
    <div className="overflow-hidden">
      {/* The bottom edge opens onto nothing below md. There the next section
          is pulled up over the gold this hero leaves under its centered card,
          so the two field edges that used to meet at this boundary no longer
          meet — and an anchor edge with no second edge to meet lands a step
          deeper than the ground beside it and draws a line across the page,
          exactly as the first offer panel's top edge would. Painting nothing
          lets the atmosphere's floor run straight through the join. Desktop
          keeps the anchor: there the two edges still land on each other. */}
      {/* --hero-drop-progress feeds the mobile stage drop from the same
          value that sizes the card, so the drop arrives with the growth
          rather than sitting under the collapsed card. */}
      <section
        className="gold-field gold-field-chrome-top hero-drop-scope relative flex min-h-[100dvh] flex-col items-center justify-start overflow-hidden"
        style={{ "--hero-drop-progress": progress } as CSSProperties}
      >
        <motion.div
          className="hero-backdrop-fade absolute inset-0 z-0"
          initial={false}
          animate={{ opacity: 1 - progress }}
          transition={{ duration: 0.2, ease: EASE_IN_OUT_CUBIC }}
        >
          {/* The backdrop is the collapsed opening's presence: the graded
              home-hero vista at full photographic strength — a place, not a
              texture. It reads as the poster the page opens on, and fades out
              as the card grows so the poster becomes the gallery. Same src and
              sizes as the first slide, so the browser picks the identical
              variant URL and one download serves both. The top gold fall that
              carries the headline lives in its own layer below, so the
              photograph here is never veiled — only the sky band the words
              overhang is lifted, the rest stays at strength. */}
          <ResponsiveImage
            src={bgImageSrc}
            alt=""
            fill
            priority
            sizes="95vw"
            className="hero-poster object-cover saturate-[1.06] sepia-[0.08]"
            style={{ objectPosition: "50% 32%" }}
          />
          {/* The resin embers — the atmosphere gaining life. They ride inside
              this backdrop layer on purpose: over the photograph, behind the
              card and headline, masked under the header with the photograph,
              and faded out with the whole layer as the card expands — so the
              moment needs no scroll logic of its own. `paused` only stops the
              loop once the layer is invisible. They hold still in the frame (no
              pointer parallax), so the atmosphere's gentle lean drifts past
              them instead of the two fighting over the cursor. */}
          <ResinEmbers paused={progress >= 1} />
          {/* Grain rides the backdrop rather than the section, so it fades out
              with it: past full expansion the ground behind the frame is the
              page atmosphere, which carries its own grain at the same
              strength. Two stacked layers would read as twice the texture. */}
          <div
            aria-hidden="true"
            className="film-grain pointer-events-none absolute inset-0 mix-blend-multiply"
          />
        </motion.div>

        {/* The top gold fall — the sky lift that carries the dark headline.
            Held at strength across the headline band, then eased into the sky
            by mid-frame, so the words clear 4.5:1 while the vista below keeps
            the photograph at full strength. Edge-anchored from the top, so it
            reads as morning light gathering in the sky rather than a panel cut
            over the picture. It sits in its own layer above the photograph
            (not under the header mask, so it is at full strength behind the
            words) and fades out with the poster as the card grows. The title
            pool concentrates a little more light on exactly where the words
            sit, blurred well past its box so it reads as light, not an edge. */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-[1]"
          initial={false}
          animate={{ opacity: 1 - progress }}
          transition={{ duration: 0.2, ease: EASE_IN_OUT_CUBIC }}
        >
          <div aria-hidden="true" className="hero-sky-lift absolute inset-0" />
          <div
            aria-hidden="true"
            className="hero-title-pool absolute left-1/2 top-[23%] h-[15rem] w-[38rem] max-w-[92vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-wash/26 blur-[72px]"
          />
        </motion.div>

        <div className="relative z-10 mx-auto flex w-full flex-col items-center">
          {/* hero-stage-drop: on phones the whole stage — card, headline,
              pill and intro band together — sinks lower in the screen as the
              card expands, spending the gold the fold decision strands under
              the expanded card. The offset rides the expansion progress (the
              CSS var on the section), so the collapsed card opens centered.
              See the class in globals.css for the clamp; desktop resolves to
              zero. */}
          <div className="hero-stage-drop relative flex h-[100dvh] w-full flex-col items-center justify-center">
            {/* The gallery card — hidden while the opening is the full-bleed
                poster, cross-dissolved in as it grows so it never reads as a
                second picture floating over the first. */}
            <div
              className="hero-card absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2"
              style={{
                width: `${mediaWidth}px`,
                height: `${mediaHeight}px`,
                maxWidth: "95vw",
                maxHeight: "85vh",
                opacity: cardOpacity,
                boxShadow:
                  "0 0 50px color-mix(in srgb, var(--color-ink) 14%, transparent)",
              }}
            >
              {/* Square corners, deliberately: the expanded card wears a gold
                  hairline frame (the overlay below), and this frame is
                  centered in the viewport, so on a short desktop window its
                  top edge passes under the fixed header. A rounded frame's
                  corner arcs re-emerge mid-curve below the chrome and read as
                  cut; straight lines die under the bar cleanly. `isolate`
                  keeps the grain's blend inside the frame. */}
              <div className="hero-frame relative isolate h-full w-full overflow-hidden ring-1 ring-hairline">
                {restingState ? (
                  <ResponsiveImage
                    src={slides[0]}
                    alt=""
                    fill
                    priority
                    sizes="95vw"
                    className="rounded-[inherit] object-cover saturate-[1.06] sepia-[0.08]"
                  />
                ) : (
                  slides.map((src, i) => (
                    // Each slide crosses in by uncovering rather than a plain
                    // fade: the incoming frame eases from slightly in (scale
                    // 1.05 → 1) as it rises to full opacity, so the change
                    // reads as one photograph settling forward into the next.
                    <motion.div
                      key={src}
                      className="absolute inset-0 origin-center rounded-[inherit]"
                      initial={false}
                      animate={{
                        opacity: activeSlide === i ? 1 : 0,
                        scale: activeSlide === i ? 1 : 1.05,
                      }}
                      transition={{ duration: 0.7, ease: EASE_IN_OUT_CUBIC }}
                    >
                      <ResponsiveImage
                        src={src}
                        alt=""
                        fill
                        priority={i === 0}
                        sizes="95vw"
                        className="rounded-[inherit] object-cover saturate-[1.06] sepia-[0.08]"
                      />
                    </motion.div>
                  ))
                )}
                <motion.div
                  className="absolute inset-0 rounded-[inherit] bg-gold-wash"
                  initial={false}
                  animate={{ opacity: overlayOpacity }}
                  transition={{ duration: 0.2, ease: EASE_IN_OUT_CUBIC }}
                />
                {/* Constant edge lift inside the frame; the dynamic wash
                    above handles legibility, this keeps the photo's corners
                    dissolving into the cream once the wash eases off. */}
                <div
                  aria-hidden="true"
                  className="photo-vignette-warm pointer-events-none absolute inset-0 rounded-[inherit]"
                />
                <div
                  aria-hidden="true"
                  className="film-grain pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-multiply"
                />
                {/* The first-load glare: one pass of light across the glass
                    while the title settles. Resting opacity is 0 and the
                    sweep's keyframes end at 0, so no static frame after the
                    entrance carries it. */}
                <span
                  aria-hidden="true"
                  className="hero-sheen pointer-events-none absolute inset-0"
                />
              </div>
            </div>

            {/* The poster title, high in the frame over the sky lift where the
                photograph is calmest and lightest — measured, not guessed: the
                dark ridge and forest at the centre cannot carry dark ink, but
                the lifted sky band clears 4.5:1 while the vista stays at full
                strength. It hands off to the expanded state rather than being
                cut: the group settles up and fades over the first third of the
                expansion (`titleOpacity`/`titleShift`), on the same clock that
                grows the card, so the opening becomes the gallery. The exit
                transform rides this wrapper; each line's own load-rise rides
                the inner span (individual `translate`), so the two channels
                never fight. */}
            {(title || hintLabel) && (
              <div
                className="pointer-events-none absolute inset-x-0 top-[15%] z-10 flex flex-col items-center px-4"
                style={{
                  opacity: titleOpacity,
                  transform: `translateY(${titleShift}px)`,
                }}
              >
                {/* The hint precedes the headline in the source, then renders
                    below it (`order-last`): the frozen visible-text order is
                    "ArtiCYa · Cyprus" then "We are ArtiCYa" (it was the card's
                    pill, ahead of the headline, in the original), and that
                    order is content and must not drift — `order` moves only the
                    paint, never the DOM text. */}
                {hintLabel && (
                  <div className="order-last mt-6 flex flex-col items-center gap-3">
                    {/* A short strike of the same gold, carrying the eye from
                        the headline down into the pill. */}
                    <span
                      aria-hidden="true"
                      className="hero-strike h-[1.25px] w-[88px] bg-amber"
                    />
                    <p className="hero-pill rounded-full border border-amber bg-gold-wash/85 px-4 py-1 text-[0.8125rem] font-semibold leading-[1.4] text-ink">
                      {hintSeparator ? (
                        <>
                          {hintBefore}
                          <span className="text-amber">{hintSeparator}</span>
                          {hintAfter}
                        </>
                      ) : (
                        hintLabel
                      )}
                    </p>
                  </div>
                )}
                {title && (
                  <h1 className="flex flex-col items-center gap-3 text-center font-display text-[clamp(2.75rem,6vw,4.5rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-ink md:gap-4">
                    <span className="hero-mask block">
                      <span className="hero-word block">{firstWord}</span>
                    </span>
                    {restOfTitle && (
                      <span className="hero-mask block">
                        <span className="hero-word hero-word-late block">
                          {restOfTitle}
                        </span>
                      </span>
                    )}
                  </h1>
                )}
              </div>
            )}

            {/* The payoff of the expansion: once the frame is full, the intro
                rises low inside the photograph itself. A second overlay with
                the frame's geometry keeps the intro after the headline in
                document order. Children opt into the stagger via
                group-data-[expanded] classes. */}
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 z-10 isolate -translate-x-1/2 -translate-y-1/2 overflow-hidden"
              style={{
                width: `${mediaWidth}px`,
                height: `${mediaHeight}px`,
                maxWidth: "95vw",
                maxHeight: "85vh",
              }}
            >
              {/* The local lift. The statement now sits inside the photograph
                  rather than on a gold band cut out beneath it, so the ground
                  behind the words is the image. A soft-edged gold rise carries
                  the dark ink over it — near-solid at the card's base, fading
                  to nothing well above the text, so the rest of the frame
                  stays at full photographic strength. This is the lamp CTA's
                  technique, applied to a photograph: a local lightening, not a
                  veil over the whole picture. It fades in with the intro. */}
              <div
                aria-hidden="true"
                data-expanded={!mounted || contentVisible ? "" : undefined}
                className="hero-intro hero-photo-lift pointer-events-none absolute inset-x-0 bottom-0 h-[56%] rounded-[inherit] rounded-t-none opacity-0 duration-[400ms] ease-out-quart data-[expanded]:opacity-100 data-[expanded]:transition-opacity"
              />
              <div
                data-expanded={!mounted || contentVisible ? "" : undefined}
                className={cn(
                  // The band's corners inherit the clipping parent's radius
                  // rather than restating it, so the two can never disagree.
                  // px-4 on mobile rather than px-6: the card is already only
                  // 95vw wide there, and the 16px it gives back is what lets
                  // the statement settle onto three even lines.
                  "hero-intro group pointer-events-auto absolute inset-x-0 bottom-0 flex flex-col items-center overflow-hidden rounded-[inherit] rounded-t-none px-4 py-5 opacity-0 md:px-6 duration-[400ms] ease-out-quart data-[expanded]:opacity-100 data-[expanded]:transition-opacity md:py-6",
                  mounted && !contentVisible && "pointer-events-none"
                )}
              >
                {/* The pocket of warm light the statement rests in — a soft
                    amber pool centered on the words, riding over the lift so
                    the region reads as sun gathering low in the frame rather
                    than as a panel edge. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-[42%] h-[85%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-soft/16 blur-[100px]"
                />
                <div className="relative flex flex-col items-center">
                  {children}
                </div>
              </div>
              {/* The hairline gold frame, drawn around the whole expanded
                  card — photograph and tagline panel as one object — as an
                  inset ring on the overlay's own topmost layer, painted after
                  the band so nothing covers it. It fades in with the intro
                  (and shares its `hero-intro` pre-hydration veil): the
                  resting hero card stays frameless. */}
              <span
                aria-hidden="true"
                data-expanded={!mounted || contentVisible ? "" : undefined}
                className="hero-intro pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-amber)_55%,transparent)] duration-[400ms] ease-out-quart data-[expanded]:opacity-100 data-[expanded]:transition-opacity"
              />
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default ScrollExpandMedia;
