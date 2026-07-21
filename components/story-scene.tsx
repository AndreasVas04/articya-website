"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  cubicBezier,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { cn, withBasePath } from "@/lib/utils";

const easeInOutCubic = cubicBezier(0.65, 0, 0.35, 1);

// Eased 0→1 over a slice of the pinned scroll. Computed transforms are used
// throughout (rather than useTransform's range form) because the range form
// gets promoted to a native view-timeline animation, which measures element
// visibility instead of pin progress inside a sticky frame.
const stageWindow = (value: number, from: number, to: number) =>
  easeInOutCubic(Math.min(Math.max((value - from) / (to - from), 0), 1));

interface SceneImage {
  src: string;
  alt: string;
  wide?: boolean;
}

interface StorySceneProps {
  groups: string[];
  image: SceneImage;
  flip?: boolean;
}

// One group of the scene paragraph, fading in over its slice of the pin.
// Opacity only, so the paragraph never reflows while it is being read.
function TextGroup({
  progress,
  start,
  end,
  active,
  children,
}: {
  progress: MotionValue<number>;
  start: number;
  end: number;
  active: boolean;
  children: React.ReactNode;
}) {
  const opacity = useTransform(() => stageWindow(progress.get(), start, end));
  return <motion.span style={active ? { opacity } : undefined}>{children}</motion.span>;
}

// One scene of the About story, standing in the same gold field as the home
// page. The scene's arrival plays on the clock, once per load: the moment
// the section crosses into view the amber rule draws itself, the framed
// print rises into place and the paragraph's opening words follow —
// identical at any scroll speed. Multi-group scenes keep the pin, but it
// carries only the reading beat: the remaining groups complete at reading
// pace while the frame holds, then the scene releases. A single-group scene
// has nothing left to read out, so it flows unpinned. Before mount and
// under reduced motion the scene renders unpinned with everything at rest,
// so the exported HTML is the resting state.
export function StoryScene({ groups, image, flip = false }: StorySceneProps) {
  const ref = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [armed, setArmed] = useState(false);
  const [on, setOn] = useState(false);

  useEffect(() => setMounted(true), []);

  // Arm-and-fire like the home StageScene: hidden states exist only between
  // arming (post-hydration, never under reduced motion) and the first
  // in-view crossing, when the entrance plays out on fixed durations.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setArmed(true);
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setOn(true);
      },
      { rootMargin: "0px 0px -14% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // `travel` spans the whole traversal and keeps the print alive inside its
  // frame — a slow settle and drift, continuous rather than an entrance.
  // `stage` spans only the pinned stretch and drives the reading beat.
  const { scrollYProgress: travel } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const { scrollYProgress: stage } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const imageScale = useTransform(
    () => 1.08 - 0.08 * stageWindow(travel.get(), 0.05, 0.45)
  );
  const imageDrift = useTransform(() => `${-4 + 8 * travel.get()}%`);

  const active = mounted && !reducedMotion;
  const pinned = active && groups.length > 1;

  // The later groups overlap by half a window and finish at 80% of the pin,
  // so every scene holds its completed text for the same beat before
  // releasing. The first group belongs to the entrance clock instead.
  const seg = 0.58 / (groups.length + 0.5);

  return (
    <section
      ref={ref}
      className={cn("gold-field relative", pinned && "h-[170svh] md:h-[190svh]")}
    >
      <div
        className={cn(
          "stage relative overflow-hidden",
          pinned ? "sticky top-0 flex h-svh items-center" : "py-16 md:py-24"
        )}
        data-armed={armed ? "" : undefined}
        data-on={on ? "" : undefined}
      >
        <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-8 px-4 md:grid-cols-12 md:gap-x-0">
          <div
            className={cn(
              "stage-rise print-shadow relative bg-gold-anchor p-2 md:p-3",
              image.wide ? "md:col-span-6" : "md:col-span-5",
              flip
                ? image.wide
                  ? "md:col-start-7"
                  : "md:col-start-8"
                : "md:col-start-1"
            )}
            style={{ transitionDelay: "300ms" }}
          >
            <div
              className={cn(
                "relative overflow-hidden",
                image.wide
                  ? "h-[32svh] md:h-auto md:aspect-[16/9]"
                  : "h-[36svh] md:h-auto md:aspect-[4/5] md:max-h-[72svh]"
              )}
            >
              <motion.div
                className="absolute -inset-y-[6%] inset-x-0"
                style={active ? { scale: imageScale, y: imageDrift } : undefined}
              >
                <Image
                  src={withBasePath(image.src)}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="object-cover"
                />
              </motion.div>
            </div>
            {/* The hairline gold frame, as an inset ring on the mat's own
                topmost layer so nothing covers it — same technique as the
                home hero card's frame, same square corners. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-amber/55"
            />
          </div>

          <div
            className={cn(
              image.wide ? "md:col-span-5" : "md:col-span-6",
              flip
                ? "md:col-start-1 md:row-start-1"
                : image.wide
                  ? "md:col-start-8"
                  : "md:col-start-7"
            )}
          >
            <span
              aria-hidden="true"
              className="stage-rule block h-[1.25px] w-16 bg-amber"
            />
            <p className="mt-4 leading-[1.7] text-ink md:text-xl md:leading-[1.55]">
              {groups.map((group, i) =>
                i === 0 ? (
                  <span
                    key={i}
                    className="stage-fade"
                    style={{ transitionDelay: "600ms" }}
                  >
                    {group}
                    {groups.length > 1 ? " " : ""}
                  </span>
                ) : (
                  <TextGroup
                    key={i}
                    progress={stage}
                    start={0.22 + i * seg}
                    end={0.22 + i * seg + seg * 1.5}
                    active={active}
                  >
                    {group}
                    {i < groups.length - 1 ? " " : ""}
                  </TextGroup>
                )
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
