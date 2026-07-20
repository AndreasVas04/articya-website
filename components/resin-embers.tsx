"use client";

import { useEffect, useRef } from "react";

// Small motes of resin light drifting behind the hero card. On first load
// they gather from the open field toward a loose ring around the card while
// the headline settles, then relax into a slow anchored wander — ambient
// motion on its own clock, never scroll-driven. The canvas lives inside the
// hero's backdrop layer, so the header mask and the card-expansion fade both
// come for free from the parent; the `paused` prop only stops the rAF loop
// once the backdrop is fully faded out, so an invisible hero costs no frames.

const COUNT = 24;
const GATHER_MS = 2600;
const STAGGER_MS = 500;
const DPR_CAP = 2;

interface Ember {
  hx: number; // home — where the gather lands, on a ring around the card
  hy: number;
  sx: number; // spawn — further out along the same bearing
  sy: number;
  delay: number;
  size: number; // glow diameter
  alpha: number; // resting peak alpha
  ax: number; // wander amplitudes and angular frequencies
  ay: number;
  fx: number;
  fy: number;
  px: number; // wander phases
  py: number;
  twf: number; // twinkle frequency and phase
  twp: number;
}

const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo);

function seed(w: number, h: number): Ember[] {
  // The gather aims at the card's resting center. The stage drop only
  // arrives with the card's expansion, by which point this whole layer has
  // faded out with the backdrop — so the resting geometry is the right one.
  const cx = w / 2;
  const cy = h / 2;
  const rx = Math.min(w * 0.36, 400);
  const ry = Math.min(h * 0.3, 270);
  return Array.from({ length: COUNT }, (_, i) => {
    // Even bearings with jitter, so the ring never clumps to one side.
    const angle = (i / COUNT) * Math.PI * 2 + rand(-0.35, 0.35);
    const homeR = rand(0.72, 1.3);
    const spawnR = homeR + rand(1.0, 1.9);
    const size = rand(16, 36);
    // A third of the field burns brighter: those peak near 0.7 at the top of
    // their twinkle, so a handful of motes always read as unmistakable
    // lights while the rest carry the depth behind them.
    const bright = i % 3 === 0;
    return {
      hx: cx + Math.cos(angle) * rx * homeR,
      hy: cy + Math.sin(angle) * ry * homeR,
      sx: cx + Math.cos(angle) * rx * spawnR + rand(-40, 40),
      sy: cy + Math.sin(angle) * ry * spawnR + rand(-30, 30),
      delay: rand(0, STAGGER_MS),
      size,
      // Smaller motes sit dimmer, so depth reads from brightness too.
      alpha: bright
        ? rand(0.62, 0.7)
        : rand(0.4, 0.58) * (0.78 + 0.22 * (size / 36)),
      ax: rand(14, 34),
      ay: rand(10, 26),
      fx: (Math.PI * 2) / rand(26, 48),
      fy: (Math.PI * 2) / rand(26, 48),
      px: rand(0, Math.PI * 2),
      py: rand(0, Math.PI * 2),
      twf: (Math.PI * 2) / rand(2.8, 6.5),
      twp: rand(0, Math.PI * 2),
    };
  });
}

// One radial sprite, drawn once and stamped per ember — a luminous near-gold
// heart with a tight falloff into a deep amber-edge ring, then a wide soft
// bloom to nothing. The two halves need each other on this ground: the gold
// floor is already nearly the bloom's own color, so without the hot heart a
// mote reads as a tea-stain, and without the deep ring the heart has nothing
// to burn against. Tight core + dark ring is what makes it read as a small
// glowing light.
function makeSprite(): HTMLCanvasElement {
  const sprite = document.createElement("canvas");
  sprite.width = sprite.height = 64;
  const sctx = sprite.getContext("2d")!;
  const g = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255, 236, 190, 1)");
  g.addColorStop(0.2, "rgba(244, 204, 132, 1)");
  g.addColorStop(0.34, "rgba(232, 179, 106, 0.95)");
  g.addColorStop(0.5, "rgba(184, 122, 40, 0.6)");
  g.addColorStop(0.72, "rgba(200, 138, 58, 0.16)");
  g.addColorStop(1, "rgba(200, 138, 58, 0)");
  sctx.fillStyle = g;
  sctx.fillRect(0, 0, 64, 64);
  return sprite;
}

export function ResinEmbers({ paused = false }: { paused?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pausedRef = useRef(paused);
  const resumeRef = useRef<() => void>(() => {});

  useEffect(() => {
    pausedRef.current = paused;
    if (!paused) resumeRef.current();
  }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const sprite = makeSprite();
    let embers: Ember[] = [];
    let w = 0;
    let h = 0;

    const size = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      const pw = rect.width;
      const ph = rect.height;
      canvas.width = Math.round(pw * dpr);
      canvas.height = Math.round(ph * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!embers.length) {
        embers = seed(pw, ph);
      } else if (pw !== w || ph !== h) {
        // Keep the field's composition through a resize instead of re-running
        // the gather: scale every anchor with the frame.
        const kx = pw / w;
        const ky = ph / h;
        for (const e of embers) {
          e.hx *= kx;
          e.hy *= ky;
          e.sx *= kx;
          e.sy *= ky;
        }
      }
      w = pw;
      h = ph;
    };

    // t is accumulated animation time in seconds, so a hidden tab freezes the
    // field instead of fast-forwarding it.
    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const e of embers) {
        const p = Math.min(Math.max((t * 1000 - e.delay) / GATHER_MS, 0), 1);
        const ease = 1 - (1 - p) ** 3;
        const wx = Math.sin(t * e.fx + e.px) * e.ax;
        const wy = Math.sin(t * e.fy + e.py) * e.ay;
        const x = e.sx + (e.hx - e.sx) * ease + wx * ease;
        const y = e.sy + (e.hy - e.sy) * ease + wy * ease;
        // The floor stays high: a trough that halves the glow drops a mote
        // back to a stain, so the twinkle breathes instead of guttering.
        const twinkle = 0.8 + 0.2 * Math.sin(t * e.twf + e.twp);
        // The fade-in front-runs the gather (full strength by ~40% of the
        // drift): the embers must read as lights within the first second of
        // looking, while the gather itself is allowed its slower arc.
        ctx.globalAlpha = e.alpha * twinkle * Math.min(1, p * 2.4);
        ctx.drawImage(sprite, x - e.size / 2, y - e.size / 2, e.size, e.size);
      }
      ctx.globalAlpha = 1;
    };

    let raf = 0;
    let running = false;
    let last = 0;
    let t = 0;

    const step = (now: number) => {
      if (pausedRef.current || document.hidden) {
        running = false;
        return;
      }
      t += Math.min(now - last, 50) / 1000;
      last = now;
      draw(t);
      raf = requestAnimationFrame(step);
    };

    const start = () => {
      if (running || reduced) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(step);
    };
    resumeRef.current = start;

    const onVisibility = () => {
      if (!document.hidden) start();
    };

    const observer = new ResizeObserver(() => {
      size();
      // Under reduced motion the field is a single still frame of faint
      // glows, already gathered — painted here and never advanced.
      if (reduced) draw(30);
    });

    size();
    if (reduced) {
      draw(30);
    } else {
      start();
    }
    observer.observe(canvas);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      resumeRef.current = () => {};
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
