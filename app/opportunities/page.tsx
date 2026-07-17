import type { Metadata } from "next";
import { Fragment } from "react";
import Image from "next/image";
import { Megaphone } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { meta, hero, placeholderProject } from "@/content/opportunities";
import { withBasePath } from "@/lib/utils";

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
};

// The home lamp's CTA lands here, so the page leads with the people the
// opportunities are about: the announcement composed beside a framed print
// of a project in progress, and a band of prints from past projects below.
const featurePhoto = {
  src: "/images/home-training.jpg",
  alt: "A team-building game during a training course",
};

const fieldPhotos = [
  {
    src: "/images/hero-1.jpg",
    alt: "Participants hiking along a lakeside mountain trail",
  },
  {
    src: "/images/AboutImage1.jpg",
    alt: "The ArtiCYa team behind a table of Cypriot food at an intercultural evening",
  },
  {
    src: "/images/hero-2.jpg",
    alt: "The group walking a shaded forest road",
  },
];

export default function OpportunitiesPage() {
  const projectTypes = placeholderProject.type.split(" & ");

  return (
    <>
      <PageHero image={hero.image} heading={hero.heading} text={hero.text} />

      <section className="bg-plaster px-4 py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-12 md:gap-x-12">
          <div className="md:col-span-6">
            <Reveal>
              <span className="flex size-12 items-center justify-center rounded-full border border-sage/60 bg-plaster-bright text-xl">
                {placeholderProject.flag}
              </span>
              <h2 className="mt-6 font-display text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.1] tracking-[-0.01em] text-pine-950">
                {placeholderProject.title}
              </h2>
            </Reveal>
            <Reveal delayMs={100}>
              <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
                {projectTypes.map((type, i) => (
                  <Fragment key={type}>
                    {i > 0 && <span className="text-lichen">&</span>}
                    <span className="rounded-full bg-sage px-4 py-1.5 text-[0.8125rem] font-semibold uppercase leading-[1.4] tracking-[0.08em] text-pine-950">
                      {type}
                    </span>
                  </Fragment>
                ))}
              </p>
            </Reveal>
            <Reveal delayMs={150}>
              <div className="mt-8 max-w-[60ch] space-y-5">
                {placeholderProject.paragraphs.map((p) => (
                  <p
                    key={p.slice(0, 40)}
                    className="leading-[1.7] text-pine-950 md:text-xl md:leading-[1.55]"
                  >
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>
            <Reveal delayMs={200}>
              <p className="mt-10 flex items-center gap-4 border border-sage/60 bg-plaster-bright p-5">
                <span
                  aria-hidden="true"
                  className="flex size-12 shrink-0 items-center justify-center rounded-full border border-sage/60 text-lichen"
                >
                  <Megaphone className="size-5" strokeWidth={1.5} />
                </span>
                <span className="font-semibold text-pine-950">
                  {placeholderProject.note}
                </span>
              </p>
            </Reveal>
          </div>

          <Reveal delayMs={150} className="md:col-span-5 md:col-start-8">
            <figure className="print-shadow bg-plaster-bright p-2 ring-1 ring-sage/50 md:p-3">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={withBasePath(featurePhoto.src)}
                  alt={featurePhoto.alt}
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* What the announced projects will look like: prints from projects
          the organization has already lived. */}
      <section className="bg-plaster-muted px-4 py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
          {fieldPhotos.map((photo, i) => (
            <Reveal key={photo.src} delayMs={i * 100}>
              <figure className="print-shadow bg-plaster-bright p-2 ring-1 ring-sage/50 md:p-3">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={withBasePath(photo.src)}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
