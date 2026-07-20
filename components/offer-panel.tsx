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
import { Globe, GraduationCap } from "lucide-react";
import { cn, withBasePath } from "@/lib/utils";

// Icons live here because component references can't cross the
// server/client boundary as props.
const icons = { globe: Globe, graduation: GraduationCap };

const easeInOutCubic = cubicBezier(0.65, 0, 0.35, 1);

// Eased 0→1 over a slice of the pinned scroll. Computed transforms are used
// throughout (rather than useTransform's range form) because the range form
// gets promoted to a native view-timeline animation, which measures element
// visibility instead of pin progress inside a sticky frame.
const stageWindow = (value: number, from: number, to: number) =>
  easeInOutCubic(Math.min(Math.max((value - from) / (to - from), 0), 1));

interface OfferPanelProps {
  image: string;
  title: string;
  text: string;
  icon: keyof typeof icons;
  flip?: boolean;
  openTop?: boolean;
}

// One group of the panel paragraph, fading in over its slice of the pinned
// scroll. Opacity only — inline spans can't translate without breaking text
// flow, and keeping the layout fixed means the paragraph never reflows while
// it is being read.
function SentenceGroup({
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

// A full-bleed photographic panel staged as a pinned scroll beat. The outer
// section is taller than the viewport and the frame sticks while the user
// scrolls through it: the photo owns the entry under an open wash, then the
// cream scrim builds as the heading rises and an amber bar draws itself, and
// the paragraph completes sentence by sentence at reading pace before the
// panel releases. On mobile the pin is shorter and the paragraph arrives in
// two halves anchored to the bottom wash. Before mount and under reduced
// motion the panel renders unpinned with everything visible, so the exported
// HTML is the resting state.
export function OfferPanel({
  image,
  title,
  text,
  icon,
  flip = false,
  openTop = false,
}: OfferPanelProps) {
  const ref = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Two progress scales: `travel` spans the whole traversal for the slow
  // photo drift; `stage` spans only the pinned stretch and drives the text
  // choreography.
  const { scrollYProgress: travel } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const { scrollYProgress: stage } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const photoY = useTransform(() => `${-6 + 12 * travel.get()}%`);
  const photoScale = useTransform(
    () => 1.05 - 0.05 * stageWindow(stage.get(), 0.05, 0.35)
  );
  // Floor is high enough that the cream reading field is already carrying the
  // heading when it rises at 0.1 — the wash builds, it never starts from open.
  const washOpacity = useTransform(
    () => 0.6 + 0.4 * stageWindow(stage.get(), 0.04, 0.18)
  );
  const iconOpacity = useTransform(() => stageWindow(stage.get(), 0.07, 0.17));
  const iconY = useTransform(
    () => 24 * (1 - stageWindow(stage.get(), 0.07, 0.17))
  );
  const headingOpacity = useTransform(() =>
    stageWindow(stage.get(), 0.1, 0.22)
  );
  const headingY = useTransform(
    () => 36 * (1 - stageWindow(stage.get(), 0.1, 0.22))
  );
  const barScaleX = useTransform(() => stageWindow(stage.get(), 0.18, 0.3));

  const Icon = icons[icon];
  const active = mounted && !reducedMotion;

  // Desktop reads sentence by sentence; on mobile five separate drips would
  // outlast the shorter pin, so the paragraph lands in two halves.
  const sentences = text.split(/(?<=\.) /);
  const half = Math.ceil(sentences.length / 2);
  const groups = isMobile
    ? [sentences.slice(0, half).join(" "), sentences.slice(half).join(" ")].filter(Boolean)
    : sentences;
  // Groups overlap by half a window and always finish at 84% of the pin, so
  // every panel holds its completed text for the same beat before releasing.
  const seg = 0.54 / (groups.length + 0.5);

  return (
    <section
      ref={ref}
      className={cn("relative", active && "h-[190svh] md:h-[240svh]")}
    >
      <div
        className={cn(
          "gold-field relative overflow-hidden",
          // The first panel opens onto the floor of the section above it,
          // not onto another field edge, so its top edge paints nothing.
          openTop && "gold-field-open-top",
          active ? "sticky top-0 h-svh" : "min-h-[92svh]"
        )}
      >
        {/* The photographic stack — photo, veil, reading wash and grain — is
            masked as one so the whole panel dissolves into the page ground at
            its top and bottom edges and carries no border of its own. The
            wash fades out with the photo it exists to subdue, so the reading
            field never thins out ahead of the picture behind it. */}
        <div
          aria-hidden="true"
          className="photo-edge-dissolve absolute inset-0"
        >
          <motion.div
            className="absolute inset-x-0 -inset-y-[8%]"
            style={active ? { y: photoY, scale: photoScale } : undefined}
          >
            <Image
              src={withBasePath(image)}
              alt=""
              fill
              sizes="100vw"
              className="object-cover brightness-[1.06] saturate-[1.08]"
            />
          </motion.div>

          {/* A light veil lifts the photo into the warm ground, then the
              reading wash builds from the text side so the words land on
              cream rather than on the picture. */}
          <div className="absolute inset-0 bg-gold-wash/12" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-gold-wash from-18% via-gold-wash/82 via-50% to-transparent md:hidden"
            style={active ? { opacity: washOpacity } : undefined}
          />
          <motion.div
            className={cn(
              "absolute inset-0 hidden from-gold-wash from-24% via-gold-wash/78 via-52% to-transparent md:block",
              flip ? "bg-gradient-to-l" : "bg-gradient-to-r"
            )}
            style={active ? { opacity: washOpacity } : undefined}
          />
          <div className="film-grain pointer-events-none absolute inset-0" />
        </div>

        <div
          className={cn(
            "relative mx-auto flex w-full max-w-6xl items-end px-4 pb-10 md:items-center md:pb-0",
            active ? "h-full" : "min-h-[92svh] pt-[46svh] md:py-32"
          )}
        >
          <div className={cn("max-w-xl", flip && "md:ml-auto")}>
            <motion.span
              aria-hidden="true"
              className="flex size-12 items-center justify-center rounded-full border border-pine/30 bg-gold-wash/70 text-pine backdrop-blur-sm"
              style={active ? { opacity: iconOpacity, y: iconY } : undefined}
            >
              <Icon className="size-6" strokeWidth={1.5} />
            </motion.span>
            <motion.h3
              className="mt-6 font-display text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.1] tracking-[-0.01em] text-ink"
              style={active ? { opacity: headingOpacity, y: headingY } : undefined}
            >
              {title}
            </motion.h3>
            <motion.span
              aria-hidden="true"
              className="mt-5 block h-[1.25px] w-16 origin-left bg-amber"
              style={active ? { scaleX: barScaleX } : undefined}
            />
            <p className="mt-5 leading-[1.7] text-ink md:text-xl md:leading-[1.55]">
              {groups.map((group, i) => (
                <SentenceGroup
                  key={`${groups.length}-${i}`}
                  progress={stage}
                  start={0.3 + i * seg}
                  end={0.3 + i * seg + seg * 1.5}
                  active={active}
                >
                  {group}
                  {i < groups.length - 1 ? " " : ""}
                </SentenceGroup>
              ))}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
