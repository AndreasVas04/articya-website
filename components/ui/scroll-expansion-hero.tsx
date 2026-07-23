"use client";

import {
  useEffect,
  useLayoutEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LivingAtmosphere } from "@/components/living-atmosphere";
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
  const textTranslateX = progress * (isMobile ? 180 : 150);

  // The headline reads as ink, so the frame carries a cream wash while the
  // two can overlap: held at 0.75 through progress < 0.35, then eased down
  // to 0.22 — by full expansion the headline has slid away and the content
  // band carries the text, so the photo can show through.
  const overlayOpacity =
    progress < 0.35 ? 0.75 : Math.max(0.22, 0.75 - (progress - 0.35) * 0.82);

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
          {/* The backdrop photograph sinks into the ground the way the page's
              other environment photographs do — blurred and softened rather
              than hidden under a flat cream wash. A wash is opaque, so it
              sealed the living atmosphere out and left the first screen
              reading gray; here the warm field drifts through and the photo
              carries the depth behind the frame.

              It sits back inside the environment cap: the glass that opens the
              page is meant to read as gold first and photograph second, so the
              picture is a faint organic texture under the veil below rather
              than a legible image. At 40%/20px it read as a photograph with a
              tint over it and the gold stopped being the subject. Saturation
              stays above 1 so the little of it that shows keeps its warmth
              instead of going to a flat gray. */}
          {/* Same src and sizes as the first slide, so the browser picks the
              identical variant URL and one download serves both — the backdrop
              is this photograph blurred to a texture, it needs no file of its
              own. */}
          <ResponsiveImage
            src={bgImageSrc}
            alt=""
            fill
            priority
            sizes="95vw"
            className="scale-110 object-cover opacity-[0.18] blur-[28px] saturate-[1.2]"
          />
          {/* The gold the glass glows with. The photograph alone at this
              opacity leaves the field flat, so the warmth is painted here
              rather than left to the ground below: a warm pool over a gentle
              top-to-bottom gold, both mixed from the page's own two golds so
              the hero cannot drift to a third. It stays translucent — the
              living atmosphere still drifts through it — and it rides inside
              the backdrop layer, so it fades out with the photograph as the
              card expands and takes the header fade with it. */}
          <div
            aria-hidden="true"
            className="hero-glass-veil pointer-events-none absolute inset-0"
          />
          {/* The headline's own pocket of ground. The headline is wider than
              the collapsed card, so the outer end of "are ArtiCYa" lands on
              open backdrop rather than on the card. With the photograph now
              far back behind the veil the pool has little left to lift, so it
              is thin — enough to settle the darkest patch the words overhang,
              not enough to read as a lighter patch against the gold. Blurred
              well past its own box so it reads as light gathering, not as a
              panel. */}
          <div
            aria-hidden="true"
            className="hero-pool-drop pointer-events-none absolute left-1/2 h-[17rem] w-[32rem] max-w-[94vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-wash/25 blur-[64px]"
          />
          {/* The resin embers — the glass gaining life. They ride inside this
              backdrop layer on purpose: behind the card and headline, above
              the veil, masked under the header with the photograph, and faded
              out with the whole layer as the card expands — so the moment
              needs no scroll logic of its own. `paused` only stops the loop
              once the layer is invisible. They hold still in the frame (no
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

        <div className="relative z-10 mx-auto flex w-full flex-col items-center">
          {/* hero-stage-drop: on phones the whole stage — card, headline,
              pill and intro band together — sinks lower in the screen as the
              card expands, spending the gold the fold decision strands under
              the expanded card. The offset rides the expansion progress (the
              CSS var on the section), so the collapsed card opens centered.
              See the class in globals.css for the clamp; desktop resolves to
              zero. */}
          <div className="hero-stage-drop relative flex h-[100dvh] w-full flex-col items-center justify-center">
            <div
              className="hero-card absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2"
              style={{
                width: `${mediaWidth}px`,
                height: `${mediaHeight}px`,
                maxWidth: "95vw",
                maxHeight: "85vh",
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
                    <motion.div
                      key={src}
                      className="absolute inset-0 rounded-[inherit]"
                      initial={false}
                      animate={{ opacity: activeSlide === i ? 1 : 0 }}
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

              {hintLabel && (
                <div className="mt-4 flex flex-col items-center gap-3">
                  {/* A short strike of the same gold, carrying the eye from
                      the photograph's lower edge down into the pill. */}
                  <span
                    aria-hidden="true"
                    className="hero-strike h-[1.25px] w-[88px] bg-amber"
                    style={{ transform: `translateX(${textTranslateX}vw)` }}
                  />
                  <p
                    className="hero-pill rounded-full border border-amber bg-gold-wash/85 px-4 py-1 text-[0.8125rem] font-semibold leading-[1.4] text-ink"
                    style={{ transform: `translateX(${textTranslateX}vw)` }}
                  >
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
            </div>

            {title && (
              /* Each line rides inside a clipped mask, and the first-load
                 choreography raises it from below the clip — so the headline
                 arrives as two staggered lines surfacing out of nothing. The
                 mask wrapper carries the expansion's inline transform and the
                 inner span carries the load animation (individual `translate`
                 property), so the two never touch the same channel. */
              <h1 className="relative z-10 flex flex-col items-center gap-4 text-center font-display text-[clamp(2.75rem,6vw,4.5rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-ink">
                <span
                  className="hero-mask block"
                  style={{ transform: `translateX(-${textTranslateX}vw)` }}
                >
                  <span className="hero-word block">{firstWord}</span>
                </span>
                {restOfTitle && (
                  <span
                    className="hero-mask block"
                    style={{ transform: `translateX(${textTranslateX}vw)` }}
                  >
                    <span className="hero-word hero-word-late block">
                      {restOfTitle}
                    </span>
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
              className="pointer-events-none absolute left-1/2 top-1/2 z-10 isolate -translate-x-1/2 -translate-y-1/2 overflow-hidden"
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
                  // The band's corners inherit the clipping parent's radius
                  // rather than restating it, so the two can never disagree.
                  // px-4 on mobile rather than px-6: the card is already only
                  // 95vw wide there, and the 16px it gives back is what lets
                  // the statement settle onto three even lines.
                  "hero-intro group pointer-events-auto absolute inset-x-0 bottom-0 flex flex-col items-center overflow-hidden rounded-[inherit] rounded-t-none px-4 py-5 opacity-0 md:px-6 duration-[400ms] ease-out-quart data-[expanded]:opacity-100 data-[expanded]:transition-opacity md:py-6",
                  mounted && !contentVisible && "pointer-events-none"
                )}
              >
                {/* The statement stands in the page's own warm field rather
                    than on a cream panel cut out of it. The field is painted
                    here rather than shown through: what sits behind this band
                    is the photograph's lower half, not the ground, so a
                    transparent band would reveal forest, not light. Same
                    component as the page ground, so both sides of the frame
                    edge drift on one light. The card's fill is the chrome's
                    `gold-anchor`, the same value the header and footer carry,
                    so the gold that opens the page is the gold that closes
                    it — and the three read as one surface, not three shades. */}
                <LivingAtmosphere className="rounded-[inherit] bg-gold-anchor" />
                {/* The pocket of light the statement rests in. Kept smaller
                    than the band and centered on the words: a glow that spans
                    the full height stops reading as depth and starts reading
                    as an amber gradient with the band's own edges. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-[45%] h-[80%] w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-soft/18 blur-[100px]"
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
