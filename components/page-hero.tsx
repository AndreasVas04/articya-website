import { Reveal } from "@/components/reveal";
import { ResponsiveImage } from "@/components/responsive-image";
import { imagePreload } from "@/lib/images";
import { framingVars, type Framing } from "@/lib/utils";

interface PageHeroProps {
  image: string;
  heading: string;
  text: string;
}

const HERO_SIZES = "100vw";

// The inner pages open the way they originally did: the photograph full-bleed
// and the type centred over it. What is gone is the old flat scrim — a wash at
// ~85–90% across the whole frame, which is why the photographs read as ghosts.
// In its place the dark ink is carried the way the home opening now carries it:
// a local, soft-edged gold lift sits only behind the words, strongest where
// they fall and fading to nothing outward, so the rest of the frame keeps the
// picture at full strength. Same technique as `.hero-sky-lift` and
// `.hero-photo-lift`, centred rather than edge-anchored.
//
// The lift is graded vertically, because the two lines answer to two different
// contrast floors. The heading is large display type (72/44px, 600) — WCAG and
// this project's own table put its floor at 3.0:1, not 4.5 — so behind the
// heading the gold eases back and lets the photograph read strongest under the
// largest, most present element. The lede is body-size (20px), so it holds the
// 4.5 floor. Neither sits on 3.0: the heading is landed comfortably above it
// because it falls on busy photographic detail, not a flat field.
//
// Values are the lowest that clear those floors at glyph cores on the rendered
// composite, both viewports — the remaining margin spent on the picture. The
// ceiling is now 0.55 everywhere on the site, and that ceiling is what chose
// these photographs. The old office interiors carried near-black detail —
// hair, dark wood, corkboard shadow — directly under the centred type, and the
// worst glyph pixel governs: at 0.55 over a black pixel the composite reaches
// 3.15:1, which carries a display heading and cannot carry a 20px lede at any
// setting. The three heroes are portrait frames with an open sky band instead,
// positioned so the type falls on it. See the report for the measured numbers.
// Both bands sit on the ceiling. The graded profile was written when the lift
// could go to 0.68 and the heading's job was to spend *less* than the lede —
// the heading answers to 3.0, the lede to 4.5, and the picture reads strongest
// under the largest element. With the ceiling at 0.55 that headroom is gone:
// the heading band at 0.40 measured 2.2-3.0 over the incident band these frames
// are now framed on, under its own floor. There is nothing left to spend, so
// both bands take the cap and the grade survives only in the profile's shape.
const LIFT: Record<string, { heading: number; lede: number }> = {
  "IMG_4735.jpg": { heading: 0.55, lede: 0.55 },
  "IMG_4739.jpg": { heading: 0.55, lede: 0.55 },
  "IMG_4619.jpg": { heading: 0.55, lede: 0.55 },
};

// Where the frame sits behind the type. Portrait frames in a landscape-ish
// hero, so `object-cover` keeps the full width and this chooses the band.
//
// It does not choose the sky, and that is deliberate. Sky wins a contrast sweep
// outright — it is the brightest, calmest ground in every frame — and a hero
// framed on it measured 8:1 and read as a blue gradient with a photograph's
// provenance, which is the flat zone this whole pass exists to remove. These
// values sit on the incident band instead: the valley, the village, the street.
// The cost is real and is in the report; the trade is the brief's own priority.
const FRAMING: Record<string, Framing> = {
  "IMG_4735.jpg": { y: 20, ySm: 20 },
  "IMG_4739.jpg": { y: 80, ySm: 72 },
  "IMG_4619.jpg": { y: 72, ySm: 62 },
};

// The lift, in two parts. A vertical `gold-wash` profile carries the grade —
// weaker across the heading rows, stronger across the lede rows, easing to the
// zero-alpha gold above and below so the ramp never pulls through grey. A mask
// localises it horizontally: a wide ellipse holds the longest heading and
// fades the sides to nothing, so the left and right of every frame stay pure
// photograph. (rem, not %, so the plateau is one width on both viewports —
// full-bleed on a phone, centred on a desktop.)
//
// The heading→lede boundary is at a different height on the two viewports: on a
// phone the lede is three or four lines and climbs to just under the heading,
// so the strong band has to start high; on a desktop the lede sits well below a
// one- or two-line heading, so the weak band can run the whole heading down.
// One boundary cannot serve both, so the two profiles are split by `md`, and
// the desktop heading gets the fuller benefit its clean separation earns.
function liftBackground(aH: number, aL: number, hEnd: number, lStart: number) {
  const gw = (v: number) =>
    `color-mix(in srgb, var(--color-gold-wash) ${(v * 100).toFixed(1)}%, transparent)`;
  const z = "var(--color-gold-wash-0)";
  return `linear-gradient(to bottom, ${z} 0%, ${z} 20%, ${gw(aH)} 30%, ${gw(aH)} ${hEnd}%, ${gw(aL)} ${lStart}%, ${gw(aL)} 85%, ${z} 93%, ${z} 100%)`;
}
const LIFT_MASK =
  "radial-gradient(ellipse 48rem 96% at 50% 57%, #000 60%, transparent 100%)";

export function PageHero({ image, heading, text }: PageHeroProps) {
  // This photograph is the page's LCP, so it is preloaded (the preload scanner
  // cannot see it inside the component) and never lazy-loaded.
  const preload = imagePreload(image, HERO_SIZES);
  const file = image.split("/").pop() ?? "";
  const lift = LIFT[file] ?? { heading: 0.55, lede: 0.55 };
  const framing = FRAMING[file];
  return (
    <section className="relative overflow-hidden">
      {preload && (
        <link
          rel="preload"
          as="image"
          href={preload.href}
          imageSrcSet={preload.imageSrcSet}
          imageSizes={preload.imageSizes}
          type={preload.type}
          fetchPriority="high"
        />
      )}

      {/* The photograph — full-bleed, to the edge, at full strength. It settles
          in on load with a slow scale-from-in and then breathes, both scale
          only so the LCP paint is never held back (see .page-hero-photo-rise).
          It passes under the fixed header the way the home hero's does. */}
      <div className="page-hero-photo-rise absolute inset-0">
        <ResponsiveImage
          src={image}
          alt=""
          fill
          priority
          sizes={HERO_SIZES}
          className="photo-frame object-cover"
          style={framingVars(framing)}
        />
      </div>
      {/* Whisper grain — the same photographic surface the offer panels and
          story prints carry, not a wash over the picture. */}
      <div
        aria-hidden="true"
        className="film-grain pointer-events-none absolute inset-0 mix-blend-multiply"
      />
      {/* The local lift — the only thing between the photograph and the words.
          It is not a frame veil: it grades vertically (lighter over the large
          heading, full behind the body-size lede) and is gone by the sides.
          Two profiles, split by `md`, because the lede sits at a different
          height on the two viewports. Strength is per-photograph (see LIFT). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 md:hidden"
        style={{
          background: liftBackground(lift.heading, lift.lede, 46, 52),
          WebkitMaskImage: LIFT_MASK,
          maskImage: LIFT_MASK,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden md:block"
        style={{
          background: liftBackground(lift.heading, lift.lede, 58, 63),
          WebkitMaskImage: LIFT_MASK,
          maskImage: LIFT_MASK,
        }}
      />

      {/* The centred type — heading and lede over the photograph, on the lift.
          The block rises a little above true centre on the padding alone, the
          way the original opened. */}
      <div className="relative mx-auto flex min-h-[55vh] max-w-6xl flex-col items-center justify-center px-4 pb-16 pt-28 text-center md:min-h-[54vh] md:pb-20 md:pt-36">
        <Reveal>
          <span aria-hidden="true" className="mx-auto block h-[1.25px] w-16 bg-amber" />
          {/* 16ch of the display face, so the two-line break travels with the
              clamped size across viewports. */}
          <h1 className="mx-auto mt-4 max-w-[16ch] text-balance font-display text-[clamp(2.75rem,6vw,4.5rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-ink">
            {heading}
          </h1>
          <p className="mx-auto mt-6 max-w-[38.75rem] text-pretty text-xl leading-[1.55] text-ink">
            {text}
          </p>
        </Reveal>
      </div>

      {/* The signed threshold between the hero and the body below — the same
          amber hairline the chrome carries. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 z-10 h-px bg-amber/50"
      />
    </section>
  );
}
