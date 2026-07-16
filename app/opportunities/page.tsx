import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { meta, hero, background, placeholderProject } from "@/content/opportunities";
import { withBasePath } from "@/lib/utils";

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
};

export default function OpportunitiesPage() {
  return (
    <>
      <PageHero image={hero.image} heading={hero.heading} text={hero.text} />

      <section
        className="bg-cover bg-center"
        style={{ backgroundImage: `url(${withBasePath(background)})` }}
      >
        <div className="bg-plaster/95 px-4 py-16 md:py-24">
          <article className="mx-auto max-w-2xl bg-plaster-bright p-8 ring-1 ring-sage/50">
            <span aria-hidden="true" className="block h-1 w-16 bg-resin-deep" />
            <div className="mt-6 flex items-center gap-4">
              <span className="text-3xl">{placeholderProject.flag}</span>
              <div>
                <h3 className="font-display text-2xl font-semibold leading-[1.25] text-pine-950">
                  {placeholderProject.title}
                </h3>
                <p className="text-sm text-lichen">{placeholderProject.type}</p>
              </div>
            </div>
            <div className="mt-6 space-y-4 leading-[1.7] text-pine-900">
              {placeholderProject.paragraphs.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
              <p className="font-semibold text-pine-950">
                {placeholderProject.note}
              </p>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
