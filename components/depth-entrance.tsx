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

// Eased 0→1 over a slice of the scene's approach. Computed transforms are
// used throughout rather than useTransform's range form, for the same reason
// as the offer panels: the range form gets promoted to a native view-timeline
// animation, which measures the element's own visibility instead of the
// scene's progress.
const window01 = (value: number, from: number, to: number) =>
  easeInOutCubic(Math.min(Math.max((value - from) / (to - from), 0), 1));

interface SceneState {
  progress: MotionValue<number>;
  active: boolean;
  mobile: boolean;
}

const SceneContext = createContext<SceneState | null>(null);

// A section entrance staged in depth. The scene tracks its own approach —
// its top edge traveling from the viewport bottom to 35% of the viewport —
// and each layer arrives from a different depth along it: translate and
// scale are scrubbed by the scroll itself, so the section rises out of the
// page as the visitor descends into it and scrolling back plays the journey
// in reverse. The fades are not scrubbed — each layer's opacity is a
// one-shot timed rise on the system's 400/700 scale (the Reveal pattern),
// so the words are readable moments after they enter no matter how slowly
// the visitor scrolls, and scrubbing back holds them rather than swallowing
// them. Natural scroll only: nothing pins, nothing intercepts.
export function DepthScene({
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

interface DepthLayerProps {
  children: ReactNode;
  className?: string;
  /** Depth travel in px at desktop; mobile runs the same path at 0.6×. */
  rise?: number;
  /** Dawn: the layer surfaces from slightly smaller as well as lower. */
  scaleFrom?: number;
  /** The slice of the scene's approach this layer travels through. */
  enter?: [number, number];
  durationMs?: 400 | 700;
  delayMs?: number;
}

// Before mount and under reduced motion the layer renders its resting state
// untransformed and visible, so the exported HTML and reduced-motion
// visitors get the content in place with no translation or scale.
export function DepthLayer({
  children,
  className,
  rise = 32,
  scaleFrom,
  enter = [0, 0.5],
  durationMs = 400,
  delayMs = 0,
}: DepthLayerProps) {
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
  // re-runs on scroll, so it reads the current distance instead of the one
  // captured at the render a resize has since invalidated.
  const riseRef = useRef(rise);
  riseRef.current = mobile ? Math.round(rise * 0.6) : rise;

  const [from, to] = enter;
  const y = useTransform(
    () => riseRef.current * (1 - window01(progress.get(), from, to))
  );
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

// The scene's one accent flourish: the amber rule draws itself left-to-right
// at the head of the entrance — the same gesture as the offer panels' bars,
// scrubbed here because the rule is the scene's leading edge.
export function DepthRule({
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

// The ground taking the stage: a light layer whose glow rises with the
// scene's approach and falls away again if the visitor scrubs back. Glows
// only, never text — which is why it alone is free to track the scroll
// exactly.
export function DepthGround({
  className,
  children,
  enter = [0.05, 0.85],
}: {
  className?: string;
  children?: ReactNode;
  enter?: [number, number];
}) {
  const { progress, active } = useContext(SceneContext)!;
  const [from, to] = enter;
  const opacity = useTransform(() => window01(progress.get(), from, to));
  return (
    <motion.div
      aria-hidden="true"
      className={cn("pointer-events-none", className)}
      style={active ? { opacity } : undefined}
    >
      {children}
    </motion.div>
  );
}
