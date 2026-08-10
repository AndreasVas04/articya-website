import { Reveal } from "@/components/reveal";
import { ResponsiveImage } from "@/components/responsive-image";
import { imagePreload } from "@/lib/images";

interface PageHeroProps {
  image: string;
  heading: string;
  text: string;
}

const HERO_SIZES = "100vw";

// The inner pages open on the photograph full-bleed with the type centred over
// it. What carries the type is the plate's own top-to-bottom darkening and
// nothing else: the ellipse-masked, vertically graded lift that used to sit
// behind the words is gone, along with every other lift on the site. A local
// shape behind a block of type is a panel however soft its edges are, and the
// mask this replaces was measurably one — it held its strength over a 48rem
// ellipse centred on the words and released it to nothing at the frame's sides.
// The darkening here has no horizontal extent to release: it is the same value
// across every column of the picture, so the only thing it can read as is a
// darker photograph.
//
// It is also what carries the transparent nav over the top of the frame, which
// is why the top of the ramp is the strongest part of it.
export function PageHero({ image, heading, text }: PageHeroProps) {
  // This photograph is the page's LCP, so it is preloaded (the preload scanner
  // cannot see it inside the component) and never lazy-loaded.
  const preload = imagePreload(image, HERO_SIZES);
  return (
    <section className="relative overflow-hidden bg-gold-wash">
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
          className="object-cover object-center"
        />
      </div>
      {/* The plate's own darkening: strongest along the top, where the
          transparent nav crosses the picture, holding through the band the
          centred type falls in, and easing off toward the base so the frame
          still ends on photograph. Full width, top to bottom — no shape. */}
      <div
        aria-hidden="true"
        className="plate-shade pointer-events-none absolute inset-0 [--shade-bottom:48%] [--shade-mid:64%] [--shade-mid-from:30%] [--shade-mid-to:78%] [--shade-top:62%]"
      />

      {/* The centred type — heading and lede over the photograph. The block
          rises a little above true centre on the padding alone, the way the
          original opened. */}
      <div className="relative mx-auto flex min-h-[55vh] max-w-6xl flex-col items-center justify-center px-4 pb-16 pt-28 text-center md:min-h-[54vh] md:pb-20 md:pt-36">
        <Reveal>
          <span aria-hidden="true" className="mx-auto block h-[1.25px] w-16 bg-amber" />
          {/* 16ch of the display face, so the break travels with the clamped
              size across viewports. */}
          <h1 className="mx-auto mt-6 max-w-[16ch] text-balance font-display text-[clamp(3.4rem,11vw,10rem)] font-semibold leading-[0.94] tracking-[-0.025em] text-ink">
            {heading}
          </h1>
          <p className="mx-auto mt-8 max-w-[44ch] text-pretty text-[clamp(1rem,1.3vw,1.16rem)] leading-[1.66] text-ink">
            {text}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
