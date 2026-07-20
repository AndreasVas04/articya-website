"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  cubicBezier,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

const easeInOutCubic = cubicBezier(0.65, 0, 0.35, 1);

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

// Eased 0→1 over a slice of the scene's approach. Computed transforms are
// used throughout rather than useTransform's range form, for the same reason
// as the offer panels: the range form gets promoted to a native view-timeline
// animation, which measures the element's own visibility instead of the
// scene's progress.
const window01 = (value: number, from: number, to: number) =>
  easeInOutCubic(clamp01((value - from) / (to - from)));

// The landing curve: rises through its window, crosses the resting line by
// 6% near the end and settles back onto it — an overshoot the scroll replays
// in reverse on the way back up, not a timed spring.
const settle01 = (value: number, from: number, to: number) => {
  const s = clamp01((value - from) / (to - from));
  return s <= 0.85
    ? 1.06 * easeInOutCubic(s / 0.85)
    : 1.06 - 0.06 * easeInOutCubic((s - 0.85) / 0.15);
};

interface SceneState {
  progress: MotionValue<number>;
  active: boolean;
  mobile: boolean;
}

const SceneContext = createContext<SceneState | null>(null);

// A section entrance staged as a sunrise, scrubbed by the scene's own
// approach — its top edge traveling from the viewport bottom to 35% of the
// viewport. The rule draws first, the heading rises and lands with a settle,
// and the globe surfaces from well below its resting place while the dawn
// bloom crests behind it and the ground warms under the whole scene.
// Translate and scale ride the scroll itself, so scrolling back plays the
// sunrise in reverse; the fades are not scrubbed — each layer's opacity is a
// one-shot timed rise on the system's 400/700 scale (the Reveal pattern),
// so the words are readable moments after they enter no matter how slowly
// the visitor scrolls. Natural scroll only: nothing pins, nothing intercepts.
export function SunriseScene({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.35"],
  });

  return (
    <div ref={ref} className={className}>
      <SceneContext.Provider
        value={{
          progress: scrollYProgress,
          active: mounted && !reducedMotion,
          mobile,
        }}
      >
        {children}
      </SceneContext.Provider>
    </div>
  );
}

interface SunriseLayerProps {
  children: ReactNode;
  className?: string;
  /** Travel in px at desktop; mobile runs 0.6× unless mobileRise is given. */
  rise?: number;
  mobileRise?: number;
  /** Travel as viewport-height percent — the globe's horizon rise. */
  riseVh?: number;
  mobileRiseVh?: number;
  /** The layer surfaces from smaller as well as lower. */
  scaleFrom?: number;
  /** The slice of the scene's approach this layer travels through. */
  enter?: [number, number];
  /** Land with the settle curve instead of easing straight in. */
  overshoot?: boolean;
  durationMs?: 400 | 700;
  delayMs?: number;
}

// Before mount and under reduced motion the layer renders its resting state
// untransformed and visible, so the exported HTML and reduced-motion
// visitors get the content in place with no translation or scale.
export function SunriseLayer({
  children,
  className,
  rise = 32,
  mobileRise,
  riseVh,
  mobileRiseVh,
  scaleFrom,
  enter = [0, 0.5],
  overshoot = false,
  durationMs = 400,
  delayMs = 0,
}: SunriseLayerProps) {
  const { progress, active, mobile } = useContext(SceneContext)!;
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setShown(true);
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // A ref rather than a closed-over value: the transform function only
  // re-runs on scroll, so it reads the current geometry instead of the one
  // captured at the render a resize has since invalidated.
  const cfg = useRef({ rise, mobileRise, riseVh, mobileRiseVh, mobile });
  cfg.current = { rise, mobileRise, riseVh, mobileRiseVh, mobile };

  // useTransform computes once during SSR, where the transform is inert
  // (the style is only applied when active) but the callback still runs.
  const travel = () => {
    if (typeof window === "undefined") return 0;
    const c = cfg.current;
    if (c.riseVh) {
      const vh = c.mobile ? (c.mobileRiseVh ?? c.riseVh) : c.riseVh;
      return (window.innerHeight * vh) / 100;
    }
    return c.mobile ? (c.mobileRise ?? Math.round(c.rise * 0.6)) : c.rise;
  };

  const [from, to] = enter;
  const y = useTransform(() => {
    const k = overshoot
      ? settle01(progress.get(), from, to)
      : window01(progress.get(), from, to);
    return travel() * (1 - k);
  });
  const scale = useTransform(() =>
    scaleFrom
      ? scaleFrom + (1 - scaleFrom) * window01(progress.get(), from, to)
      : 1
  );

  return (
    <motion.div
      ref={ref}
      style={{
        ...(delayMs ? { transitionDelay: `${delayMs}ms` } : {}),
        ...(active ? { y, scale } : {}),
      }}
      className={cn(
        durationMs === 700 ? "duration-[700ms]" : "duration-[400ms]",
        "ease-out-quart",
        shown && "transition-opacity",
        active && !shown && "opacity-0",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

// The scene's leading accent: the amber rule draws itself left-to-right at
// the head of the sunrise — the same gesture as the offer panels' bars,
// scrubbed here because the rule is the scene's leading edge.
export function SunriseRule({
  className,
  enter = [0.02, 0.3],
}: {
  className?: string;
  enter?: [number, number];
}) {
  const { progress, active } = useContext(SceneContext)!;
  const [from, to] = enter;
  const scaleX = useTransform(() => window01(progress.get(), from, to));
  return (
    <motion.span
      aria-hidden="true"
      className={cn("block h-[1.25px] w-16 origin-left bg-amber", className)}
      style={active ? { scaleX } : undefined}
    />
  );
}

// A scrubbed light layer — the dawn bloom behind the globe, the warming
// ground under the scene. Opacity tracks the approach exactly (and an
// optional rise lets the bloom crest with the sun); glows only, never text —
// which is why these alone are free to track the scroll without a timed
// fallback.
export function SunriseGlow({
  className,
  children,
  enter = [0.05, 0.9],
  rise = 0,
}: {
  className?: string;
  children?: ReactNode;
  enter?: [number, number];
  rise?: number;
}) {
  const { progress, active } = useContext(SceneContext)!;
  const [from, to] = enter;
  const opacity = useTransform(() => window01(progress.get(), from, to));
  const y = useTransform(
    () => rise * (1 - window01(progress.get(), from, to))
  );
  return (
    <motion.div
      aria-hidden="true"
      className={cn("pointer-events-none", className)}
      style={active ? { opacity, y } : undefined}
    >
      {children}
    </motion.div>
  );
}
