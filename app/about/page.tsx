import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { SmoothScroll } from "@/components/smooth-scroll";
import { ZoomParallax } from "@/components/ui/zoom-parallax";
import { meta, hero, rows, gallery } from "@/content/about";

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
};

export default function AboutPage() {
  const [intro, closing] = rows;

  return (
    <>
      <SmoothScroll />
      <PageHero image={hero.image} heading={hero.heading} text={hero.text} />

      <article>
        <section className="bg-plaster px-4 pb-20 pt-16 md:pb-28 md:pt-24">
          <div className="mx-auto max-w-6xl md:grid md:grid-cols-12 md:gap-x-16">
            <Reveal className="md:col-span-7">
              <span
                aria-hidden="true"
                className="block h-1 w-16 bg-resin-deep"
              />
              <p className="mt-8 text-xl leading-[1.55]">
                {intro.paragraphs[0]}
              </p>
            </Reveal>
            <Reveal delayMs={100} className="md:col-span-5 md:pt-20">
              <p className="mt-8 border-l border-sage pl-5 leading-[1.7] text-pine-900 md:mt-0 md:pl-6">
                {intro.paragraphs[1]}
              </p>
            </Reveal>
          </div>
        </section>

        <ZoomParallax images={gallery} />

        <section className="bg-plaster-muted px-4 py-16 md:py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal className="max-w-4xl">
              <span
                aria-hidden="true"
                className="block h-1 w-16 bg-resin-deep"
              />
              <p className="mt-8 text-xl leading-[1.55]">
                {closing.paragraphs[0]}
              </p>
            </Reveal>
            <div className="mt-12 border-t border-sage/60 pt-10 md:mt-16 md:grid md:grid-cols-2 md:gap-x-16 md:pt-12">
              <Reveal>
                <p className="leading-[1.7]">{closing.paragraphs[1]}</p>
              </Reveal>
              <Reveal delayMs={100}>
                <p className="mt-6 leading-[1.7] md:mt-0">
                  {closing.paragraphs[2]}
                </p>
              </Reveal>
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
