import type { Metadata } from "next";
import { GoldPageHero } from "@/components/gold-page-hero";
import { LivingAtmosphere } from "@/components/living-atmosphere";
import { SmoothScroll } from "@/components/smooth-scroll";
import { StoryScene } from "@/components/story-scene";
import { GalleryFinale } from "@/components/gallery-finale";
import { meta, hero, story, closing, gallery } from "@/content/about";

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
};

// The About page is one continuous scroll story in the home page's golden
// world: every scene stands in the same gold field under one living
// atmosphere, arrives on the clock, and holds its words at reading pace
// before releasing into the next; the closing paragraph dissolves into the
// gallery finale.
export default function AboutPage() {
  return (
    <>
      {/* Arms the hero's first-load choreography before it parses, exactly
          as the home page does — without JS the class never lands and the
          hero renders at rest. */}
      <script
        dangerouslySetInnerHTML={{
          __html: 'document.documentElement.classList.add("hero-load");',
        }}
      />
      <SmoothScroll />
      {/* One atmosphere instance spans the whole page, so the drifting warm
          light is a single continuous field rather than a per-section grid
          that restarts at every seam. */}
      <div className="relative">
        <LivingAtmosphere />
        <GoldPageHero image={hero.image} heading={hero.heading} text={hero.text} />

        <article>
          {story.map((scene, i) => (
            <StoryScene
              key={scene.image.src}
              groups={scene.groups}
              image={scene.image}
              flip={i % 2 === 1}
            />
          ))}
          <GalleryFinale groups={closing.groups} images={gallery} />
        </article>
      </div>
    </>
  );
}
