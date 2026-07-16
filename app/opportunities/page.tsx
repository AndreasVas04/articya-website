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
        <div className="bg-white/90 px-4 py-16">
          <article className="mx-auto max-w-2xl rounded-lg border border-neutral-200 bg-white p-8">
            <div className="flex items-center gap-4">
              <span className="text-3xl">{placeholderProject.flag}</span>
              <div>
                <h3 className="text-xl font-semibold">
                  {placeholderProject.title}
                </h3>
                <p className="text-sm text-neutral-500">
                  {placeholderProject.type}
                </p>
              </div>
            </div>
            <div className="mt-6 space-y-4 text-neutral-700">
              {placeholderProject.paragraphs.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
              <p className="font-medium">{placeholderProject.note}</p>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
