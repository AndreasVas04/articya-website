"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ResponsiveImage } from "@/components/responsive-image";
import { coverSizes, FULL_VIEWPORT } from "@/lib/images";
import { cn, withBasePath } from "@/lib/utils";

// useLayoutEffect on the client, useEffect on the server: the effect it runs
// only ever touches the DOM, so it is a no-op during server rendering, and
// this avoids React's warning about useLayoutEffect there.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const EASE_IN_OUT_CUBIC: [number, number, number, number] = [0.65, 0, 0.35, 1];
const SLIDE_INTERVAL_MS = 4500;
const EXPAND_KEYS = ["ArrowDown", "PageDown", "End", " "];

// The poster's own land silhouette, traced off the frame: everything below the
// skyline, in the frame's 3:4 box. It is a mask rather than a picture, so it
// carries no pixels of its own — see the plate that uses it below.
const POSTER_RIDGE = "/images/pt/IMG_4585-ridge.svg";

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
  // Expanded, the card is the window on both axes, so every frame in this
  // section is cover-fitted to the whole viewport. The declaration is per
  // frame because the overscale is: a 3:4 poster is painted at the window's
  // own width on a desktop and half again on a phone, and the 2.14:1 slide is
  // painted a third wider than the window on a desktop and four times wider
  // than a phone's. `100vw` on all of them fetched the phone's rung for a
  // picture the phone paints at 1808px.
  const posterSizes = coverSizes(bgImageSrc, FULL_VIEWPORT);
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

  // A visitor who has already scrolled by the time hydration lands is reading
  // somewhere below this hero, and the choreography has no screen left to play
  // on. The inline script pins the page to 0 during parse, so any offset here
  // is their own scrolling in the gap between first paint and hydration — on a
  // slow connection, seconds of it. Arming the wheel/touch lock at that point
  // consumes their swipes from a screen they cannot see, with no feedback at
  // all, so the hero skips its capture and opens straight into the expanded
  // state instead. The logo reset re-arms it, since that returns them here.
  const skipCapture = useRef(false);

  useIsomorphicLayoutEffect(() => {
    if (window.scrollY <= 0) return;
    skipCapture.current = true;
    setScrollProgress(1);
    setMediaFullyExpanded(true);
    setShowContent(true);
  }, []);

  useEffect(() => {
    if (reducedMotion || skipCapture.current) return;

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
    // Safari does not default window `scroll`/`touchstart` to passive the way
    // Chrome does, so on iOS every touch waits on these handlers before the
    // scroll can start. Neither one calls preventDefault; the wheel and
    // touchmove handlers below do, and stay non-passive.
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
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
      skipCapture.current = false;
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

  // The desktop ramp used to end on a flat 1550px (300 + 1250). That is
  // 1.0764 × the 1440 window it was tuned on — past the edge there, short of
  // it on anything wider, so above ~1550 the card stopped growing before it
  // reached the sides and left a gold strip down each one. The end value is
  // the same *fraction* of the stage now rather than the same number of
  // pixels, so the ramp overshoots by the same margin at every width and
  // `maxWidth: 100%` still does the stopping. Expressed as a calc() against
  // the stage rather than a measured pixel number: no viewport state to read,
  // nothing to re-render on resize, and it stays a percentage so a classic
  // scrollbar cannot push the card into horizontal overflow.
  //
  // At 1440 the expression resolves to 300 + 1250 × progress — the ramp it
  // replaces, to the pixel — so the pace there is not merely preserved but
  // identical, and the card still reaches the sides at progress 0.912.
  const stageEnd = ((1550 / 1440) * 100).toFixed(3);
  const mediaWidth = isMobile
    ? `${300 + progress * 650}px`
    : `calc(300px + ${progress} * (${stageEnd}% - 300px))`;
  // The height runs the same ramp, overshooting the stage by the same fraction
  // and stopped by the same cap. It used to land on a flat 800px desktop /
  // 600px mobile under an 85vh ceiling, and that is what detached the header:
  // expanded, the card was 765px of a 900px window and 600px of an 844px one,
  // centred, so 68px and 194px of the top of the screen held no photograph at
  // all. What the chrome then crossed was bare floor, and a nav on bare floor
  // above a picture is a bar whatever it is made of — the one thing this
  // header has never had. Full bleed on both axes, and the picture runs to
  // every edge of the window the way the width already made it run to the
  // sides.
  const mediaHeight = `calc(400px + ${progress} * (${stageEnd}% - 400px))`;

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

  // The card's legibility wash while the poster headline is still crossing the
  // growing frame. It used to bottom out at 0.15 and hold there — a 15% gold
  // veil over the whole photograph for as long as the card was open, on top of
  // the intro's own lift and the foot dissolve. The headline has finished its
  // handoff by 0.35, so past that the wash has nothing left to carry and runs
  // to zero instead: at full expansion the picture is the grade and nothing
  // else, and the intro's block-anchored pool carries the dark ink on its own.
  const overlayOpacity =
    progress < 0.35 ? 0.75 : 0.75 * (1 - (progress - 0.35) / 0.65);

  const firstWord = title ? title.split(" ")[0] : "";
  const restOfTitle = title ? title.split(" ").slice(1).join(" ") : "";

  // The hint pill's middle dot picks up the gold; the halves either side of
  // it stay ink. Split on the first separator only, so the label reads
  // exactly as written when it carries none.
  const hintDotIndex = hintLabel?.indexOf("·") ?? -1;
  const hintSeparator = hintDotIndex >= 0 ? "·" : "";
  const hintBefore = hintDotIndex >= 0 ? hintLabel!.slice(0, hintDotIndex) : "";
  const hintAfter = hintDotIndex >= 0 ? hintLabel!.slice(hintDotIndex + 1) : "";

  return (
    <div className="overflow-hidden">
      {/* The bottom edge paints nothing at either viewport. Nothing below this
          hero carries a ground of its own any more — the page's photographic
          stage runs behind all of it — so there is no second edge for the
          anchor to meet, and an opaque ramp ending on the hero's last row is a
          ruled line straight across the page. Open, the stage runs up under
          the card's own dissolving foot and the two pictures hand over. */}
      <section className="gold-field gold-field-chrome-top gold-field-open-bottom hero-drop-scope hero-plate relative isolate flex min-h-[100dvh] flex-col items-center justify-start overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0"
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
              photograph here is never veiled.

              It carries no top fade. The layer starts at the section's top,
              which the fixed header covers, so a ramp there only spends its
              first visible rows washing the picture out against the bar. */}
          <ResponsiveImage
            src={bgImageSrc}
            alt=""
            fill
            priority
            sizes={posterSizes}
            className="hero-poster object-cover saturate-[1.06] sepia-[0.08]"
            style={{ objectPosition: "50% var(--hero-poster-y)" }}
          />
          {/* The plate's own darkening, and the whole of it. It carries the
              cream nav across the top of the picture and the headline under
              it, and it is a full-width top-to-bottom ramp rather than a
              shape: the sky lift and the title pool it replaces were a local
              fall held across the headline's own width, which is a panel by
              another name. Riding inside this layer, it fades out with the
              poster as the card takes over.

              This is the one plate that darkens toward `sky-anchor` rather
              than `gold-anchor`. The headline falls on open sky, and a
              green-black over blue does not lower the sky, it turns it: at
              this strength the anchor cost the sky 43.6° of hue and more than
              half its chroma while the same stops on the sky's own hue cost
              0.5° and buy the identical ratio.

              The mid holds from 8%, which is inside the header's own height at
              both viewports — so the top ramp lives entirely under the bar and
              the picture emerges below the chrome already flat, with no step
              on the join. */}
          <div
            aria-hidden="true"
            className="plate-shade pointer-events-none absolute inset-0 [--shade-bottom:8%] [--shade-color:var(--color-sky-anchor)] [--shade-mid:66%] [--shade-mid-from:8%] [--shade-mid-to:64%] [--shade-top:92%]"
          />
        </motion.div>

        <div className="relative z-10 mx-auto flex w-full flex-col items-center">
          {/* The stage the card is centred in. A phone-only drop used to sink
              the whole stage as the card grew, spending the gold that the
              600px card left stranded under itself. The card fills the window
              now, so there is no gold under it to spend and the drop is gone
              with it — held, it would have put 72px of the old band straight
              back at the top of the screen. */}
          <div className="relative flex h-[100dvh] w-full flex-col items-center justify-center">
            {/* The gallery card — hidden while the opening is the full-bleed
                poster, cross-dissolved in as it grows so it never reads as a
                second picture floating over the first.

                The width cap is the stage's own width, not a fraction of it.
                The growth ramp overshoots the stage at every width, so the cap
                is what the expanded card actually measures, and at 95% it left
                a gold strip down each side — with the foot dissolved, the two
                hardest lines on the page. `100%` rather than `100vw` so a
                classic scrollbar cannot push the card past the stage and into
                horizontal overflow. */}
            <div
              className="hero-card hero-foot-fade hero-foot-halo absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2"
              style={{
                width: mediaWidth,
                height: mediaHeight,
                maxWidth: "100%",
                maxHeight: "100%",
                opacity: cardOpacity,
                // The card's own shadow, off the deepest ground rather than
                // off `ink` — ink is the page's cream now, and a 14% cream
                // spread at 50px would ring the card in light instead of
                // seating it.
                boxShadow:
                  "0 0 50px color-mix(in srgb, var(--color-gold-anchor) 55%, transparent)",
              }}
            >
              {/* Square corners, deliberately: expanded, this frame is as wide
                  as the window, so on a short desktop window its top edge and
                  both top corners pass under the fixed header. A rounded
                  corner's arc re-emerges mid-curve below the chrome and reads
                  as cut; straight lines die under the bar cleanly. `isolate`
                  keeps the grain's blend inside the frame. */}
              <div className="hero-frame hero-foot-arc relative isolate h-full w-full overflow-hidden ring-1 ring-hairline">
                {restingState ? (
                  <ResponsiveImage
                    src={slides[0]}
                    alt=""
                    fill
                    priority
                    sizes={coverSizes(slides[0], FULL_VIEWPORT)}
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
                        sizes={coverSizes(src, FULL_VIEWPORT)}
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
                {/* The card's own darkening: strong at the top, where the
                    transparent nav crosses the picture at full expansion, and
                    strong again at the base, where the intro stands. Full
                    width, top to bottom, inside the plate — the local pool
                    that used to sit under the intro's block is gone.

                    The base runs to 94% from 36% of the card, and it has to,
                    because this ramp is inside the foot mask and is multiplied
                    by it. While the card stopped short of the window the intro
                    sat at mask alpha 0.4 falling to 0.02 — standing on the dark
                    floor with the photograph almost entirely dissolved away
                    behind it. Full bleed, the same words sit at 0.9 falling to
                    0.2, which is the picture itself, and on a phone the lede
                    measured 3.16 against a 4.5 floor over the second slide.
                    Deepening the ramp is self-limiting for the same reason it
                    was needed: where the mask has taken the picture it takes
                    the darkening with it, so the number is large without the
                    frame going dark. The rotation is three frames now and they
                    run 5.54/5.61/6.50; the slide that came out was the 4.96
                    and the worst of them, so the floor on this card rose with
                    it. */}
                <div
                  aria-hidden="true"
                  className="plate-shade pointer-events-none absolute inset-0 [--shade-bottom:94%] [--shade-mid:16%] [--shade-mid-from:22%] [--shade-mid-to:36%] [--shade-top:34%]"
                />
              </div>
            </div>

            {/* The poster title, standing on the skyline: the block sits high
                enough that the words are on the open sky, which is the calmest
                and lightest part of this frame, and low enough that the second
                line's feet are in the hills, which is where the plate's second
                half runs across them. The two viewports need different numbers
                for the same relationship — the poster overflows the window's
                height on a desktop and is fitted to it on a phone, so only one
                of them can move the picture under the words, and the other
                moves the words down the frame instead.

                It hands off to the expanded state rather than being cut: the
                group settles up and fades over the first third of the expansion
                (`titleOpacity`/`titleShift`), on the same clock that grows the
                card, so the opening becomes the gallery. The exit transform
                rides this wrapper; each line's own load-rise rides the inner
                span (individual `translate`), so the two channels never
                fight. */}
            {(title || hintLabel) && (
              <div
                className="pointer-events-none absolute inset-x-0 top-[23.5%] z-10 flex flex-col items-center px-4 md:top-[15%]"
                style={{
                  opacity: titleOpacity,
                  transform: `translateY(${titleShift}px)`,
                }}
              >
                {/* The label reads above the headline, where the reference set
                    puts an eyebrow, and that placement is load-bearing here:
                    the headline is the lowest thing in this block, so it is the
                    headline the land in front of the plate runs across. With
                    the label under it, the label sat below the skyline and the
                    foreground would have swallowed it whole.

                    Its position in the source is unchanged. The frozen visible-
                    text order is "ArtiCYa · Cyprus" then "We are ArtiCYa" (it
                    was the card's pill, ahead of the headline, in the
                    original), and that order is content: the strike and the
                    label swap by `flex-col-reverse`, which moves only the
                    paint, so the rule carries the eye down out of the label and
                    into the words. */}
                {hintLabel && (
                  <div className="mb-6 flex flex-col-reverse items-center gap-3">
                    {/* A short strike of the same amber, carrying the eye down
                        out of the label and into the headline. */}
                    <span
                      aria-hidden="true"
                      className="hero-strike h-[1.25px] w-[88px] bg-amber"
                    />
                    {/* No pill. The rounded fill and its border were a shape
                        behind text, which is the one thing nothing on this
                        site is now allowed to be — the label stands on the
                        picture's own darkening like everything else. */}
                    <p className="hero-pill text-[0.8125rem] font-semibold leading-[1.4] text-ink">
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
                  <h1 className="flex flex-col items-center gap-1 text-center font-display text-[clamp(3.4rem,11vw,10rem)] font-semibold leading-[0.94] tracking-[-0.025em] text-ink md:gap-2">
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
                width: mediaWidth,
                height: mediaHeight,
                maxWidth: "100%",
                maxHeight: "100%",
              }}
            >
              <div
                data-expanded={!mounted || contentVisible ? "" : undefined}
                className={cn(
                  // The band's corners inherit the clipping parent's radius
                  // rather than restating it, so the two can never disagree.
                  // px-4 on mobile rather than px-6: the card is only a phone
                  // wide there, and the 16px it gives back is what lets the
                  // statement settle onto three even lines.
                  //
                  // The foot padding is the band's own now. It used to be one
                  // step, because the card stopped 68px short of the window on
                  // a desktop and 50px short on a phone and that gutter stood
                  // the statement off the fold. The card is the window, so the
                  // band carries the clearance itself: the CTA rests 80px and
                  // 64px above the bottom edge, which is where it sat before.
                  "hero-intro group pointer-events-auto absolute inset-x-0 bottom-0 flex flex-col items-center overflow-hidden rounded-[inherit] rounded-t-none px-4 pb-16 pt-5 opacity-0 md:px-6 duration-[400ms] ease-out-quart data-[expanded]:opacity-100 data-[expanded]:transition-opacity md:pb-20 md:pt-6",
                  mounted && !contentVisible && "pointer-events-none"
                )}
              >
                {/* The intro stands on the card's own bottom darkening and on
                    nothing else — the block-anchored pool and the warm pocket
                    that used to sit under it are gone with every other lift on
                    the site. */}
                <div className="relative flex w-full flex-col items-center">
                  {children}
                </div>
              </div>
              {/* The gold frame that used to ring this overlay is gone. It
                  worked when the card stood inside gold: three sides drawn,
                  the fourth dissolved at the foot. Full-bleed there are no
                  side gutters for it to sit in — its verticals land on the
                  first and last column of the window and its top edge passes
                  under the chrome, so all that is left of a frame is two lines
                  pinned to the screen edges, which read as a viewport artifact
                  rather than an object. Nothing outlines the card now; the
                  photograph's own edges do the work. */}
            </div>
          </div>

        </div>

        {/* The plate's second half, and the headline is between them. This is
            the same photograph, the same crop and the same darkening as the
            layer at the top of this section — drawn again over the words and
            masked to its own land, so the skyline, the hills and everything
            below them pass in front of the type instead of behind it. Nothing
            about the picture changes: at rest the two layers are pixel for
            pixel the layer they came from, and the split shows up only where
            the words cross the ridge, which is the point.

            It rides the headline's own exit rather than the poster's. The card
            grows into this space as the poster leaves, and the land held at the
            poster's opacity would lie across it; on the headline's clock the
            layer is gone by the time the card has any size, which is the same
            moment the words it is there for have gone.

            Paint order is all this is. The expansion, the slideshow, the
            hydration gate, the scroll restoration and the card's foot dissolve
            are untouched — nothing here reads a state or writes one. */}
        <motion.div
          aria-hidden="true"
          className="hero-ridge pointer-events-none absolute inset-0 z-20"
          style={
            {
              "--ridge-mask": `url(${withBasePath(POSTER_RIDGE)})`,
            } as CSSProperties
          }
          initial={false}
          animate={{ opacity: titleOpacity }}
          transition={{ duration: 0.2, ease: EASE_IN_OUT_CUBIC }}
        >
          <ResponsiveImage
            src={bgImageSrc}
            alt=""
            fill
            priority
            sizes={posterSizes}
            className="hero-poster object-cover saturate-[1.06] sepia-[0.08]"
            style={{ objectPosition: "50% var(--hero-poster-y)" }}
          />
          <div
            aria-hidden="true"
            className="plate-shade pointer-events-none absolute inset-0 [--shade-bottom:8%] [--shade-color:var(--color-sky-anchor)] [--shade-mid:66%] [--shade-mid-from:8%] [--shade-mid-to:64%] [--shade-top:92%]"
          />
        </motion.div>
      </section>
    </div>
  );
};

export default ScrollExpandMedia;
