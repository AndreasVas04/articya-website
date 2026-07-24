import { Reveal } from "@/components/reveal";
import { ResponsiveImage } from "@/components/responsive-image";
import { imagePreload } from "@/lib/images";

interface PageHeroProps {
  image: string;
  heading: string;
  text: string;
}

// The photograph carries about 55% of the frame on desktop and the full
// width on mobile, so it downloads at those two widths.
const HERO_SIZES = "(min-width: 768px) 58vw, 100vw";

// Inner pages open the same way home does: photography leads. The type sits
// beside the photograph on clean gold rather than on top of it, and the
// photograph runs to the edge at full strength with no veil — the veil the
// old centred layout needed to keep dark ink readable is gone, so three
// heroes that used to show a ghost now show the picture.
//
// The two parts stack at 390 with the photograph on top: this pass makes the
// photograph the lead material, so the visitor meets it first — edge to edge,
// under the chrome — and the type then sits on clean gold below it, where a
// paragraph is most comfortable to read.
export function PageHero({ image, heading, text }: PageHeroProps) {
  // This photograph is the page's LCP, so it is preloaded (the preload
  // scanner cannot see it inside the component) and never lazy-loaded.
  const preload = imagePreload(image, HERO_SIZES);
  return (
    <section className="gold-field gold-field-chrome-top gold-floor relative overflow-hidden md:grid md:min-h-[70vh] md:grid-cols-12">
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

      {/* The photograph — full strength, no veil, to the edge. It leads on
          mobile (on top) and sits on the right on desktop, passing under the
          fixed header the way the home hero's photograph does. */}
      <div className="page-hero-photo relative h-[44vh] w-full overflow-hidden md:col-span-7 md:col-start-6 md:h-auto">
        <ResponsiveImage
          src={image}
          alt=""
          fill
          priority
          sizes={HERO_SIZES}
          className="object-cover object-center"
        />
        {/* Whisper grain, the same texture the offer panels and story prints
            carry — a photographic surface, not a wash over it. */}
        <div aria-hidden="true" className="film-grain pointer-events-none absolute inset-0 mix-blend-multiply" />
      </div>

      {/* The type — on clean gold, vertically centred beside the photograph. */}
      <div className="relative flex flex-col justify-center px-6 py-14 md:col-span-5 md:col-start-1 md:row-start-1 md:px-12 md:py-24 lg:px-16">
        {/* A soft pool of the chrome's own gold behind the headline — a cream
            lift that settles the ground the words sit on, not a glow: there
            are no glows on light grounds. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-[42rem] max-w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-chrome/60 blur-[110px]"
        />
        <Reveal className="relative">
          <span aria-hidden="true" className="block h-[1.25px] w-16 bg-amber" />
          {/* 16ch of the display face, so the constraint travels with the
              clamped size across viewports. */}
          <h1 className="mt-5 max-w-[16ch] text-balance font-display text-[clamp(2.75rem,6vw,4.5rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-ink">
            {heading}
          </h1>
          <p className="mt-6 max-w-[34rem] text-pretty text-xl leading-[1.55] text-ink">
            {text}
          </p>
        </Reveal>
      </div>

      {/* The signed threshold between the hero and the body below — the same
          amber hairline the chrome carries, marking where the photograph ends
          and the page proper begins. */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 z-10 h-px bg-amber/50" />
    </section>
  );
}
