"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cubicBezier, motion, useReducedMotion } from "framer-motion";
import { ResponsiveImage } from "@/components/responsive-image";
import { coverSizes, HERO_PUSH, HERO_VIEWPORT } from "@/lib/images";
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

// Where the traced skyline sits in the mask's own 3:4 box. It is the mask's
// fraction and not the window's, so it holds at every height a phone can show;
// §2.18 placed the headline by it and this is the same number read the other
// way round — the descent that hides the block is the one that positioned it.
const RIDGE_SKYLINE = 0.4175;

const clamp01 = (n: number) => Math.min(Math.max(n, 0), 1);

// The opening completes itself. Once it has started and the input stops, the
// reader is not left mid-way between the poster and the clearing: after
// SETTLE_IDLE ms with no wheel or touch delta the progress is carried on to
// the release — or back to the poster if it had barely begun — through the
// same `applyProgress` a wheel event feeds, so the release fires exactly as it
// does under the reader's own hand. Any new delta cancels the settle and hands
// progress back to the input from wherever it is.
//
// The gains, the box ramps, the thresholds and the release are not read by
// any of this; it only supplies deltas.
const SETTLE_IDLE_MS = 120;
const SETTLE_FORWARD_FROM = 0.2;
// The settle follows the hand. Its target used to be read off progress alone
// — toward the release from 0.20 up — so a reader scrolling back up from the
// lede into the poster had the opening carried forward again the moment the
// input paused or ran out into a momentum tail: the card reopened against the
// gesture, and the screen read as a lag. The target now takes the sign of the
// last non-zero delta as well. Positive input settles forward from 0.20;
// negative input settles back to the poster from anywhere short of 0.80, and
// forward only from there, where the opening is nearly whole.
const SETTLE_BACK_HOLD_FROM = 0.8;

// Progress per wheel unit: one trackpad flick opens the poster. At 0.0009 the
// opening took 1111 units — three flicks on a laptop where a phone's thumb
// does it in one 200px drag — and the laptop read as late beside the phone.
// 0.0025 is a 400-unit opening, and the touch gains below are untouched.
const WHEEL_GAIN = 0.0025;

// A trackpad's momentum tail is a run of tiny deltas that can go on for most
// of a second after the finger has left the glass, and the idle clock never
// fires while it lasts. Three consecutive events under this delta are that
// tail, and the settle starts there rather than waiting the tail out. A delta
// at or above it is the hand again, and cancels a settle the way any input
// does; the tail's own remaining events do not.
const MOMENTUM_DELTA = 3;
const MOMENTUM_EVENTS = 3;
const settleEase = cubicBezier(0.22, 1, 0.36, 1);
const settleTarget = (p: number, dir: number) =>
  dir < 0 ? (p >= SETTLE_BACK_HOLD_FROM ? 1 : 0) : p >= SETTLE_FORWARD_FROM ? 1 : 0;
const settleDuration = (p: number, to: number) => (to === 1 ? 400 + 500 * (1 - p) : 300);
interface Settle {
  from: number;
  to: number;
  start: number;
  duration: number;
}

// The whole section breathes forward and settles back as the card opens: one
// number, read by the poster, by the copy masked to the land and by the window
// inside the card, so the three can never fall out of register at any frame.
// It is 1.000 at both ends, so neither the collapsed opening nor the resting
// hero is moved by it, and 1.030 at the middle — 43px of width at 1440, which
// is the shared vector the two plates cross on. The poster used to carry no
// transform at any frame of the expansion, so the eye had nothing to follow
// and the growth read as a mechanism working rather than as space opening.
const heroPush = (progress: number) => 1 + HERO_PUSH * Math.sin(Math.PI * progress);

// The poster holds at full strength until the card covers the window, and only
// then leaves. It used to run `1 - progress`, which was right while the card
// held a differently-framed picture and is wrong now that it holds the same
// one: two partly-transparent copies of one photograph composite brighter than
// one, so the card's own box showed as a lighter rectangle standing on the
// poster for the whole of the growth. Inside the card the picture's weight is
// `a_card + (1 - a_card)*a_poster` and outside it is `a_poster`, and those are
// only equal where `a_poster` is 1.
//
// The card covers the window at progress 0.912 on a desktop and 0.873 on a
// phone (width 300 + 1250p against 1440; height 400 + 568.75p against 900).
// 0.92 clears both, and across the 0.08 of progress that is left the poster is
// behind an opaque full-bleed frame, so its own fade is never seen — what it
// buys is the resting state, where the card's dissolving foot has to open onto
// the floor rather than onto a second copy of its own picture.
const POSTER_LEAVES = 0.92;
const posterOpacity = (progress: number) =>
  1 - clamp01((progress - POSTER_LEAVES) / (1 - POSTER_LEAVES));

// The section has two darkenings, and it crosses between them on the *window*
// rather than inside the card: every `.plate-shade` in this section is one of
// this pair, computed over the same rectangle, so at no progress is there a
// rectangle of one darkening sitting inside another. That rectangle is most of
// what made the opening read as a box.
//
// The poster's ramp carries the headline on open sky; the card's carries the
// nav across the top and the intro at the foot. The poster's is untouched —
// the headline's measured 5.27 / 5.34 is this ramp — and the card's differs
// from it in one number.
//
// **The card's top was 34.** That is the middle register: at 0.34 the picture
// under it reads at 0.66, which is neither a photograph nor a ground, and
// against `IMG_4585`'s sky it painted a washed band across the whole upper
// third of the resting hero. Measured, the top third's mean luminance ran 86
// at the poster and 168 there. `.chrome-shade` carries the nav on its own
// (86% falling to nothing over 130px), so the number could have gone either
// way; it goes up rather than down because §2.8's ratchet forbids lowering any
// measured value and the nav stands on this. 78 is a hood — the picture at
// 0.22, a ground — and it clears 0.75 with room.
//
// **The card's foot is registered to the block it carries, not to the card.**
// `.hero-intro` is `bottom-0` with a fixed 251px height, so the lede's top row
// — which is where its worst glyph pixel is, measured at **191-203px above the
// card's foot at every height and on every slide** — is a constant distance
// from the bottom of the frame. The ramp under it ran to 94% *from 36% of the
// card*, and the card is the viewport: at 844 that put the row at 65.8% of the
// darkening and at 553 at 51.0%, which is 5.09 against 3.13 on a 4.5 floor.
// A px block inside a vh ramp, which is §2.18's mechanism a fourth time.
//
// The fall is therefore anchored to the foot in px — `calc(100% - 580px)` —
// which is the one change that makes the value under that row the same number
// at 553 as at 844. It is also the unit the layer above it already uses: the
// card's foot dissolve is `--hero-foot: 280px` and `--hero-foot-arc: 340px`,
// both measured up from the base, and the shade is multiplied by them. The two
// were on different clocks.
//
// The `max(48px, ...)` is what keeps the stops in order on a card too short to
// hold both ends. Below a 628px window the fall wants to start above the hood;
// floored at 48px the hood still resolves inside the fixed header's own 65px,
// so the top stays polarised at 78 — composited with `.chrome-shade` the
// wordmark measures 8.27 at 553, against 4.5 — and the fall simply starts
// there instead.
//
// The base goes 94 -> 100 and costs nothing that is painted: the bottom of the
// card is inside `--hero-foot`'s dissolve, where the picture has already gone
// to the floor, so the extra six points land on rows that are the floor
// already. This is §2.8's argument for the gains base, on the other frame.
const POSTER_SHADE = { top: 92, mid: 66, base: 8, from: "8%", to: "64%" };
const CARD_SHADE = {
  top: 78,
  mid: 16,
  base: 100,
  from: "max(48px, min(22%, calc(100% - 580px)))",
  to: "max(48px, calc(100% - 580px))",
};

// How the crossing is made, and this is the whole of §2.6. Interpolating the
// two sets of numbers put the *frame* in the middle register even where its
// endpoints were out of it: at progress 0.6 the six read 63 / 41 / 51, so
// every row of the window was between 41% and 63% at once — one flat veil over
// the whole picture, the exact state the polarised ledger exists to forbid,
// held for a fifth of the expansion.
//
// So nothing is interpolated. The two ramps are fixed and what travels is a
// boundary, which is the mechanism `PhotoStage` already carries for the same
// reason: the card's ramp wells up from the foot of the window and the
// poster's withdraws upward and leaves through the top, over a 40%-deep
// gradient with no line in it to trace. Every row of every frame is one ramp
// or the other, and the top stop is 92 falling to 78 — inside the upper pole
// at every frame, never in 0.04–0.75.
//
// It runs 0.60 -> 1.00 and not from zero, and the window is the argument: the
// headline is gone by 0.60 and the intro does not arrive until 1.00, so the
// crossing plays over the one stretch of the expansion with no text on the
// glass at all — and it ends on the release, so the opening never has a
// stretch where the crossing is over and nothing else has begun.
//
// The boundary moves on the plate wipe's own curve rather than at one rate.
// Linear, it started in one event and stopped in one event, and because the
// feather is wholly outside the window at both ends, the first and last
// fifths of it moved nothing the eye could see. Eased, the rate is zero on
// the frame the words go, peaks at the middle of the stretch where the
// boundary is in the middle of the window, and is zero again on the release
// — the shape the clearing's own wipe was approved with below this section.
// The ends stay clean single states: the feather is the same 40%, and the
// edge still reaches 140 and -40 exactly at 0.60 and 1.00.
const SHADE_FEATHER = 40;
const crossingEase = cubicBezier(0.65, 0, 0.35, 1);

const shadeLayers = (progress: number) => {
  const t = crossingEase(clamp01((progress - 0.60) / 0.40));
  // 140 -> -40, so the boundary starts a feather below the foot and ends a
  // feather above the head: both ends are a clean single state.
  const edge = 140 - 180 * t;
  const solid = (edge - SHADE_FEATHER).toFixed(2);
  const clear = edge.toFixed(2);
  // Neither end carries a mask at all. A fully-opaque mask is not free — it
  // pushes the layer through its own compositing pass, and the rounding that
  // costs is visible in the measurement: the headline's worst glyph pixel went
  // 5.27 -> 5.21 with a no-op mask on it. Both ends must be pixel-identical to
  // what they were, because §2.8's ratchet is measured on them.
  return [
    {
      key: "poster",
      shade: POSTER_SHADE,
      // Sky owns this frame's chroma: a green-black over open blue turns it
      // rather than lowering it — 43.6° of hue and half the chroma, against
      // 0.5° for the same stops on the sky's own dark.
      color: "var(--color-sky-anchor)",
      mask: t > 0 ? `linear-gradient(to bottom, #000 ${solid}%, transparent ${clear}%)` : undefined,
      show: t < 1,
    },
    {
      key: "card",
      shade: CARD_SHADE,
      color: "var(--color-gold-anchor)",
      mask: t < 1 ? `linear-gradient(to bottom, transparent ${solid}%, #000 ${clear}%)` : undefined,
      show: t > 0,
    },
  ];
};

// A `.plate-shade` sets the six values on itself, so an inherited value would
// lose to the class; inline style is the one declaration that beats it.
const HeroShade = ({ progress }: { progress: number }) => (
  <>
    {shadeLayers(progress).map(({ key, shade, color, mask, show }) =>
      show ? (
        <div
          key={key}
          aria-hidden="true"
          className="plate-shade pointer-events-none absolute inset-0"
          style={
            {
              "--shade-color": color,
              "--shade-top": `${shade.top}%`,
              "--shade-mid": `${shade.mid}%`,
              "--shade-bottom": `${shade.base}%`,
              "--shade-mid-from": shade.from,
              "--shade-mid-to": shade.to,
              maskImage: mask,
              WebkitMaskImage: mask,
            } as CSSProperties
          }
        />
      ) : null
    )}
  </>
);

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
  const posterSizes = coverSizes(bgImageSrc, HERO_VIEWPORT);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [mounted, setMounted] = useState(false);
  const introRef = useRef<HTMLDivElement | null>(null);
  const ridgeRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  // How far the headline block goes down behind the land. Measured; see the
  // effect below.
  const [descent, setDescent] = useState(0);
  // The settle in flight, if any, and the idle clock that starts one. Refs,
  // because the handlers below are re-bound on every progress step and a
  // settle has to survive that; `settleRun` is what wakes the effect when one
  // starts from the idle timer.
  const settle = useRef<Settle | null>(null);
  const idleTimer = useRef<number | null>(null);
  const progressRef = useRef(0);
  const [settleRun, setSettleRun] = useState(0);
  // Consecutive wheel events under MOMENTUM_DELTA.
  const tail = useRef(0);
  // The sign of the last non-zero wheel or touch delta; the settle reads it.
  const lastDir = useRef(1);

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

  // The two numbers this section's own handover is made of, out of one read:
  // the row the intro band's rule rests on — published for the thread that
  // holds it — and the descent that takes the block behind the land.
  //
  // The row is measured rather than derived. The band is anchored to the
  // foot of the window and its own height is a stack of px plus a sentence
  // that wraps, so nothing above it predicts the row; but because it is
  // anchored to the foot, the row *is* the foot less the rule's own distance
  // from the band's bottom, and that distance depends on one thing only — the
  // width the sentence wraps at. So the overlay is widened to the width it
  // settles on for the read and nothing else about it is touched. The walk
  // goes through `offsetTop`, which the band's own entrance transform does not
  // reach.
  useIsomorphicLayoutEffect(() => {
    const measure = () => {
      const overlay = introRef.current;
      const band = overlay?.querySelector<HTMLElement>(".hero-intro");
      const rule = band?.querySelector<HTMLElement>("[data-hero-rule]");
      if (!overlay || !band || !rule) return;
      const width = overlay.parentElement?.offsetWidth ?? 0;
      const height = overlay.parentElement?.offsetHeight ?? 0;
      const w = overlay.style.width;
      overlay.style.width = `${width}px`;
      let fromBandTop = 0;
      for (
        let n: HTMLElement | null = rule;
        n && n !== band;
        n = n.offsetParent as HTMLElement | null
      ) {
        fromBandTop += n.offsetTop;
      }
      // The band is inside a size container, and reading from inside that
      // subtree does not always settle a width just written to the subtree's
      // own ancestor: measured, some of these reads came back with the band
      // still laid out at the card's 300px, which publishes a row 26px out.
      // The read is checked rather than trusted, and a read that did not take
      // is retried rather than published — by the time the card is the window
      // there is no width to force at all.
      const took = Math.round(band.getBoundingClientRect().width) === width;
      const fromFoot = band.offsetHeight - fromBandTop;
      overlay.style.width = w;
      if (!took) {
        requestAnimationFrame(measure);
        return;
      }
      const row = height - fromFoot;
      document.documentElement.style.setProperty("--hero-station-2", `${row}px`);

      // The descent, out of the same read. The block goes down until its top
      // row is on the skyline, which is where the land in front of it starts.
      const ridge = ridgeRef.current;
      const title = titleRef.current;
      if (!ridge || !title) return;
      // `mask-size: cover` on the frame's own 3:4 box, and `mask-position`'s
      // own share of whatever that leaves over.
      const mask = Math.max(height, (width * 4) / 3);
      const anchor =
        parseFloat(getComputedStyle(ridge).getPropertyValue("--hero-poster-y")) / 100;
      const skyline = (height - mask) * anchor + RIDGE_SKYLINE * mask;
      setDescent(skyline - title.offsetTop);
    };
    measure();
    // The sentence wraps differently once the body face has landed.
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // The frame the card becomes the window is the frame the block below it
  // exists, and the thread's mark has a block to have left only from there on.
  useEffect(() => {
    document.documentElement.classList.toggle("hero-open", contentVisible);
    return () => document.documentElement.classList.remove("hero-open");
  }, [contentVisible]);

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
      settle.current = null;
      setScrollProgress(1);
      setMediaFullyExpanded(true);
      setShowContent(true);
    };

    const applyProgress = (delta: number) => {
      const newProgress = Math.min(Math.max(scrollProgress + delta, 0), 1);
      progressRef.current = newProgress;
      setScrollProgress(newProgress);
      if (newProgress >= 1) {
        setMediaFullyExpanded(true);
        setShowContent(true);
      } else if (newProgress < 0.75) {
        setShowContent(false);
      }
    };

    const clearIdle = () => {
      if (idleTimer.current !== null) window.clearTimeout(idleTimer.current);
      idleTimer.current = null;
    };

    // Start a settle from wherever progress is, if it is anywhere between the
    // two ends. Under reduced motion it would be one step rather than a
    // travel; the capture is off there, so it never runs at all.
    const startSettle = () => {
      clearIdle();
      const p = progressRef.current;
      if (p <= 0 || p >= 1 || settle.current) return;
      const to = settleTarget(p, lastDir.current);
      settle.current = { from: p, to, start: performance.now(), duration: settleDuration(p, to) };
      setSettleRun((n) => n + 1);
    };

    // Input, of any size: it cancels a settle in flight and re-arms the idle
    // clock. A zero delta counts — it is still the reader's hand.
    const onInput = () => {
      settle.current = null;
      clearIdle();
      idleTimer.current = window.setTimeout(startSettle, SETTLE_IDLE_MS);
    };

    const handleWheel = (e: globalThis.WheelEvent) => {
      if (e.deltaY !== 0) lastDir.current = e.deltaY > 0 ? 1 : -1;
      if (mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const small = Math.abs(e.deltaY) < MOMENTUM_DELTA;
        // The tail that started a settle does not also cancel it.
        if (small && settle.current) return;
        onInput();
        applyProgress(e.deltaY * WHEEL_GAIN);
        tail.current = small ? tail.current + 1 : 0;
        if (
          small &&
          tail.current >= MOMENTUM_EVENTS &&
          progressRef.current >= SETTLE_FORWARD_FROM
        ) {
          startSettle();
        }
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
      if (deltaY !== 0) lastDir.current = deltaY > 0 ? 1 : -1;

      if (mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        // Once progress hits 1 this branch stops matching, so touch events
        // are no longer intercepted and native scrolling resumes.
        e.preventDefault();
        onInput();
        const scrollFactor = deltaY < 0 ? 0.008 : 0.005;
        applyProgress(deltaY * scrollFactor);
        setTouchStartY(touchY);
      }
    };

    // The finger lifting is the end of the input, so the settle starts there
    // rather than waiting out the idle clock; a finger that stops on the
    // glass is caught by the clock.
    const handleTouchEnd = () => {
      setTouchStartY(0);
      if (!mediaFullyExpanded) startSettle();
    };

    const handleScroll = () => {
      if (!mediaFullyExpanded) {
        window.scrollTo(0, 0);
      }
    };

    // One step of the settle in flight, fed through `applyProgress` from this
    // effect's own closure: the step re-renders, the effect re-runs and books
    // the next one, so a settle advances one frame at a time on the page's
    // own clock and never through a stale closure.
    let settleFrame = 0;
    if (settle.current) {
      settleFrame = requestAnimationFrame(() => {
        const s = settle.current;
        if (!s) return;
        const u = clamp01((performance.now() - s.start) / s.duration);
        const target = u >= 1 ? s.to : s.from + (s.to - s.from) * settleEase(u);
        if (u >= 1) settle.current = null;
        applyProgress(target - scrollProgress);
      });
    }

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
      cancelAnimationFrame(settleFrame);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [scrollProgress, mediaFullyExpanded, touchStartY, reducedMotion, settleRun]);

  // The idle clock must not outlive the capture.
  useEffect(
    () => () => {
      if (idleTimer.current !== null) window.clearTimeout(idleTimer.current);
      settle.current = null;
    },
    []
  );

  // Clicking the logo while already on home fires this instead of navigating
  // (Next would not remount the route, so the state below would persist). It
  // returns the hero to its collapsed opening — the same view a fresh load
  // shows. The header has already scrolled to the top; the collapsed state
  // then re-pins scroll there via the handler above. Under reduced motion the
  // resting state keeps the hero expanded regardless, matching a fresh load.
  useEffect(() => {
    const reset = () => {
      skipCapture.current = false;
      settle.current = null;
      if (idleTimer.current !== null) window.clearTimeout(idleTimer.current);
      idleTimer.current = null;
      progressRef.current = 0;
      tail.current = 0;
      lastDir.current = 1;
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

  // The card holds the poster's own frame for the whole opening. The slideshow
  // clock is untouched and keeps running underneath; what is re-based is which
  // slide the card *shows*, so its first visible change lands after full bleed
  // rather than in the middle of the expansion. Measured before this: at wheel
  // 1050 — three quarters of the way open — the card was already on the third
  // slide, so the picture changed identity while the frame was still growing.
  const slideOrigin = useRef<number | null>(null);
  useEffect(() => {
    if (mediaFullyExpanded && slideOrigin.current === null) {
      slideOrigin.current = activeSlide;
    }
  }, [mediaFullyExpanded, activeSlide]);
  const shownSlide =
    mediaFullyExpanded && slideOrigin.current !== null
      ? (activeSlide - slideOrigin.current + slides.length) % slides.length
      : 0;

  // The poster title hands off to the expanded state instead of being cut. As
  // the card grows the headline settles up and fades over the first third of
  // the expansion, so the opening *becomes* the gallery. The old split-and-
  // slide whipped the two lines 180vw apart on mobile inside a single flick,
  // which read as an instant vanish rather than a transition (see the brief).
  const titleExit = Math.min(Math.max((progress - 0.03) / 0.57, 0), 1);
  // Nothing fades. The block goes *down*, at full ink, until its top row is on
  // the skyline — and the land in front of the plate is what takes it, which
  // is `cabinfever`'s own move rather than an invention. Its deadline is
  // progress 0.60, and §2.6's crossing starts there and runs to the release,
  // so no readable type is ever under the crossing, by construction. The step
  // to zero at the end of the descent is taken on a frame where the block is
  // already behind the land, so there is nothing on the glass to see it.
  //
  // 0.60 rather than 0.35: at 0.35 the last 0.65 of the opening carried no
  // word at all, and its final 0.15 — after the crossing had finished — moved
  // nothing at all. The words now stay for 0.60 of the opening and the
  // crossing runs to the release, so nothing in the opening is ever still.
  const titleOpacity = titleExit < 1 ? 1 : 0;
  const titleShift = titleExit * descent;
  // The block recedes as it descends: 1.00 -> 0.85 over the same exit, about
  // its own top edge, so the top row still lands exactly on the skyline at
  // 0.60 — the descent and the frame §2.6 holds on are untouched — while the
  // feet rise toward it and go behind the land sooner. The words go *into*
  // the depth rather than under it, and the shrink is a second, slower rate
  // beside the descent's. The strings do not change and nothing fades on the
  // way down; the step to zero at the deadline is as it was.
  const titleScale = 1 - 0.15 * titleExit;

  // The gold-wash veil that used to sit inside the card is gone. It held 0.75
  // over the whole card while the headline crossed it, and because it stopped
  // at the card's edges it was a lighter rectangle standing on the poster —
  // the single loudest reason a growing frame read as a box. What carries the
  // headline is the section's own travelling ramp, which has no edges at all,
  // and below 0.60 that ramp is the poster's ramp to the number.
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
      {/* `svh`, not `dvh`, and it is the document that decides. This section is
          in flow, so its height is the first term of every scroll offset below
          it: at `dvh` it grew by the toolbar's own 86px as the bar animated,
          which moved all twelve of the stage's keys mid-gesture. `svh` is the
          one height a phone holds at both chrome states, so the page under the
          hero stops sliding under the reader's finger.

          It costs the hero nothing, because the state it is composed for is
          the state `svh` names. The expansion holds the page at scroll 0 and
          iOS only collapses the bar on a scroll the hero is preventing, so
          every frame of the opening plays at the small viewport — which is
          exactly what this now measures. Past the opening the hero's foot
          becomes a fixed document row instead of one that moves by 86px
          whenever the bar does. */}
      <section
        className="gold-field gold-field-chrome-top gold-field-open-bottom hero-drop-scope hero-plate relative isolate flex min-h-svh flex-col items-center justify-start overflow-hidden"
      >
        {/* The push and the fade are written inline, on the same clock as the
            card's window below: one wheel event, one frame, all three copies
            of the picture at the same scale. They used to ride a 200ms tween
            while the window did not, and after a fast burst the two copies of
            the skyline stood up to 5px apart for a fifth of a second. */}
        <div
          className="absolute inset-0 z-0"
          style={{ opacity: posterOpacity(progress), scale: heroPush(progress) }}
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
              on the join.

              The six numbers are the section's now rather than this layer's,
              because the card's copy of them has to be the same six at every
              frame or the card is a rectangle of one darkening inside
              another. Below progress 0.60 they are exactly the values that
              used to be written here. */}
          <HeroShade progress={progress} />
        </div>

        <div className="relative z-10 mx-auto flex w-full flex-col items-center">
          {/* The stage the card is centred in. A phone-only drop used to sink
              the whole stage as the card grew, spending the gold that the
              600px card left stranded under itself. The card fills the window
              now, so there is no gold under it to spend and the drop is gone
              with it — held, it would have put 72px of the old band straight
              back at the top of the screen. */}
          {/* `hero-window-scope` makes this the size container the card's own
              window layer measures itself against. It is the window's box
              exactly — the section's content width, so a classic scrollbar
              cannot push it out of register with the poster the way `100vw`
              would. */}
          {/* This box is what actually sets the section's height — it is the
              section's only in-flow child with a height — so it takes the
              same `svh` for the same reason. It is also the size container the
              card's own window measures itself against, so the card, the
              poster and the mask all stay registered to one number. */}
          <div className="hero-window-scope relative flex h-svh w-full flex-col items-center justify-center">
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
                // No shadow. A 50px spread of `gold-anchor` at 55% around a
                // growing frame is a halo drawn on the picture behind it, and
                // it is the second half of what made the opening read as a box
                // — the first half being the hairline ring below.
              }}
            >
              {/* Square corners, deliberately: expanded, this frame is as wide
                  as the window, so on a short desktop window its top edge and
                  both top corners pass under the fixed header. A rounded
                  corner's arc re-emerges mid-curve below the chrome and reads
                  as cut; straight lines die under the bar cleanly. `isolate`
                  keeps the grain's blend inside the frame. */}
              {/* No ring. `ring-1 ring-hairline` drew a cream hairline around
                  every frame of the growth, which at 300x400 in the middle of
                  a full-bleed photograph is the outline of a box. Expanded it
                  lands on the first and last column of the window and reads as
                  a viewport artifact, which is the same argument that took the
                  gold frame off this card. */}
              <div className="hero-frame hero-foot-arc relative isolate h-full w-full overflow-hidden">
                {/* The card is a window onto the poster, not a small copy of
                    it. Everything inside is painted at the window's own size
                    and centred on the window, so the growing frame uncovers
                    the picture already behind it instead of showing a second,
                    differently-framed one: at 300x400 a 3:4 box cover-fits the
                    whole of a 3:4 photograph while the window shows a wide
                    slice of it, which is why one frame read as two pictures.
                    Matching `object-position` alone could not close that —
                    the field of view is set by the box's aspect, and the box
                    is what changes.

                    It carries the section's push, so the window inside the
                    card and the poster outside it travel as one. */}
                <div
                  className="hero-window"
                  style={{ scale: heroPush(progress) }}
                >
                  {restingState ? (
                    <ResponsiveImage
                      src={slides[0]}
                      alt=""
                      fill
                      priority
                      sizes={coverSizes(slides[0], HERO_VIEWPORT)}
                      className="object-cover saturate-[1.06] sepia-[0.08]"
                      style={{ objectPosition: "50% var(--hero-poster-y)" }}
                    />
                  ) : (
                    slides.map((src, i) => (
                      // Each slide crosses in by uncovering rather than a plain
                      // fade: the incoming frame eases from slightly in (scale
                      // 1.05 → 1) as it rises to full opacity, so the change
                      // reads as one photograph settling forward into the next.
                      <motion.div
                        key={src}
                        className="absolute inset-0 origin-center"
                        initial={false}
                        animate={{
                          opacity: shownSlide === i ? 1 : 0,
                          scale: shownSlide === i ? 1 : 1.05,
                        }}
                        transition={{ duration: 0.7, ease: EASE_IN_OUT_CUBIC }}
                      >
                        <ResponsiveImage
                          src={src}
                          alt=""
                          fill
                          priority={i === 0}
                          sizes={coverSizes(src, HERO_VIEWPORT)}
                          className="object-cover saturate-[1.06] sepia-[0.08]"
                          // The first slide is the poster's own photograph, so
                          // it takes the poster's own registration and keeps
                          // it: one placement, one crop. The other two are
                          // different frames and stay centred.
                          style={
                            i === 0
                              ? { objectPosition: "50% var(--hero-poster-y)" }
                              : undefined
                          }
                        />
                      </motion.div>
                    ))
                  )}
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
                    it.

                    It is inside the window layer rather than inside the card,
                    and it reads the section's travelling six rather than
                    declaring its own. Those two together are what stop the
                    growing frame reading as a box: the card's ramp is computed
                    over the same rectangle as the poster's and out of the same
                    numbers, so at every progress the two are one gradient and
                    there is no edge where one ends. It settles on the values
                    written here by progress 1.00, the release, which is where
                    the intro was measured. */}
                  <HeroShade progress={progress} />
                </div>
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

                On a phone the offset is `a·H − b` and it has to be. `cover`
                fits the land mask by its height at every window a phone can
                show, so the skyline sits at a fixed **fraction** of the window
                — 0.4175, measured within 0.0002 at 664, 700 and 844. What
                stands between this block's top and the second line's box is
                **110.6px of pure px** — the label, its strike, `gap-3`, `mb-6`,
                the first line's 51.1px and `gap-1` — one number at every
                window. A flat `23.5%` therefore holds the relationship at
                exactly one height: the clearance runs `0.1825·H − 110.6`, which
                is 43.5px at 844 and 10.6 at 664, and the ink of "are ArtiCYa"
                occupies rows 5.1 to 46.4 of its 51.1px box. Measured, the
                skyline crossed at 0.93 of the ink at 844 — the feet, as
                designed — at 0.55 at 750, at 0.20 at 664, and above the box
                entirely at 553, where the whole line was behind the land. 844
                is the iPhone's screen and Safari never gives a page its screen.

                `41.75% − 154px` is the same relationship at every height: the
                fraction is the mask's own and the 154 is the 110.6 stack plus
                the 43.5 clearance 844 was tuned on. It resolves to 198.4 at 844
                against the 198.34 this replaces, so the design viewport and
                everything measured on it do not move. The `5rem` floor binds
                below 560px of window, where the expression would put the label
                under the fixed 65px header; at 553 it leaves the crossing at
                0.85 of the ink, which is still the feet. Desktop keeps `15%` —
                above 768px the mask is fitted by *width* and the law is a
                different one.

                It hands off to the expanded state rather than being cut: the
                group settles up and fades over the first third of the expansion
                (`titleOpacity`/`titleShift`), on the same clock that grows the
                card, so the opening becomes the gallery. The exit transform
                rides this wrapper; each line's own load-rise rides the inner
                span (individual `translate`), so the two channels never
                fight. */}
            {(title || hintLabel) && (
              // The whole eyebrow-and-headline block descends as one object and
              // leaves as one: the translate and the step to zero both sit on
              // this wrapper, and the strike inside it goes where the words go.
              <div
                ref={titleRef}
                className="pointer-events-none absolute inset-x-0 top-[max(calc(41.75%-154px),5rem)] z-10 flex flex-col items-center px-4 md:top-[15%]"
                style={{
                  transform: `translateY(${titleShift}px) scale(${titleScale})`,
                  transformOrigin: "50% 0",
                  opacity: titleOpacity,
                }}
              >
                {/* The mark, under the label where an eyebrow's rule stands:
                    30.2px below the block's top row, which is the label's 18.2
                    and the 12 that used to be the gap. It is placed rather than
                    stacked so the margin below the label still carries its
                    stack — §2.18 placed the headline by that stack — and it is
                    inside this block so it descends with the words, goes
                    behind the land with them, and is gone at the same deadline.
                    It used to be drawn in front of the land and carried on
                    alone to the intro band's rule row; a mark seen travelling
                    down the frame is the one thing the opening must not show,
                    so there is no second leg. The clearing's rule arrives on
                    the intro's own clock at the release, from nothing. */}
                {hintLabel && (
                  <span
                    aria-hidden="true"
                    className="hero-strike pointer-events-none absolute left-1/2 top-[30.2px] -ml-12 h-0.5 w-24 bg-amber"
                  />
                )}
                {/* The label reads above the headline, where the reference set
                    puts an eyebrow, and that placement is load-bearing here:
                    the headline is the lowest thing in this block, so it is the
                    headline the land in front of the plate runs across. With
                    the label under it, the label sat below the skyline and the
                    foreground would have swallowed it whole.

                    Its position in the source is unchanged. The frozen visible-
                    text order is "ArtiCYa · Cyprus" then "We are ArtiCYa" (it
                    was the card's pill, ahead of the headline, in the
                    original), and that order is content. */}
                {hintLabel && (
                  // No pill. The rounded fill and its border were a shape
                  // behind text, which is the one thing nothing on this site
                  // is now allowed to be — the label stands on the picture's
                  // own darkening like everything else.
                  //
                  // The strike is placed under the label rather than stacked
                  // in flow, so the 18.2 + 12 + 2 = 32.2px it would occupy
                  // here is carried by this margin instead: 37.25 = 55.45 -
                  // 18.2, and the headline stands where it stood.
                  <p className="hero-pill mb-[37.25px] text-[0.8125rem] font-semibold leading-[1.4] text-ink">
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
              ref={introRef}
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

            It rides the poster's own clock, not the headline's — the same
            inline number, on the same frame, as the poster and the card's
            window — and that is what the descent needs from it: the headline
            goes down behind this layer, so the layer has to outlive it. It is the same picture at
            the same crop and the same registration as the card growing under
            it, so where the two overlap they composite to one frame; and at
            0.92 the card covers the window, which is why the poster's clock is
            the one that can be shared. The depth device is now alive for the
            whole opening instead of its first third.

            Paint order is all this is. The expansion, the slideshow, the
            hydration gate, the scroll restoration and the card's foot dissolve
            are untouched — nothing here reads a state or writes one. */}
        <div
          ref={ridgeRef}
          aria-hidden="true"
          className="hero-ridge pointer-events-none absolute inset-0 z-20"
          style={
            {
              "--ridge-mask": `url(${withBasePath(POSTER_RIDGE)})`,
              opacity: posterOpacity(progress),
              scale: heroPush(progress),
            } as CSSProperties
          }
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
          <HeroShade progress={progress} />
        </div>
      </section>
    </div>
  );
};

export default ScrollExpandMedia;
