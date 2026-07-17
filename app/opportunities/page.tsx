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

// The home lamp's CTA lands here, so the page is one composed announcement:
// the copy beside a framed print of a project in progress, closing on the
// announcement note as the page's last word.
const featurePhoto = {
  src: "/images/home-training.jpg",
  alt: "A team-building game during a training course",
};

export default function OpportunitiesPage() {
  const projectTypes = placeholderProject.type.split(" & ");

  return (
    <>
      <PageHero image={hero.image} heading={hero.heading} text={hero.text} />

      <section className="bg-plaster px-4 pb-24 pt-16 md:pb-32 md:pt-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-x-12">
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
            </div>

            <Reveal delayMs={150} className="md:col-span-5 md:col-start-8">
              <figure className="print-shadow bg-plaster-bright p-2 ring-1 ring-sage/50 md:p-3">
                <div className="relative aspect-[4/5] overflow-hidden md:aspect-square">
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

          {/* The announcement note, alone under a hairline, ends the page. */}
          <div className="mt-20 border-t border-sage/50 pt-16 md:mt-28 md:pt-20">
            <Reveal className="mx-auto max-w-xl text-center">
              <span
                aria-hidden="true"
                className="mx-auto flex size-12 items-center justify-center rounded-full border border-sage/60 bg-plaster-bright text-lichen"
              >
                <Megaphone className="size-5" strokeWidth={1.5} />
              </span>
              <p className="mt-8 font-display text-2xl font-semibold leading-[1.25] text-pine-950">
                {placeholderProject.note}
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
