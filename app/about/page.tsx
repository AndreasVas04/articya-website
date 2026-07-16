import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { SmoothScroll } from "@/components/smooth-scroll";
import { StoryScene } from "@/components/story-scene";
import { GalleryFinale } from "@/components/gallery-finale";
import { meta, hero, story, closing, gallery } from "@/content/about";

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
};

// The About page is one continuous scroll story: each paragraph is a pinned
// scene where a photograph and its words arrive together, and the closing
// paragraph dissolves into the gallery finale.
export default function AboutPage() {
  return (
    <>
      <SmoothScroll />
      <PageHero image={hero.image} heading={hero.heading} text={hero.text} />

      <article>
        {story.map((scene, i) => (
          <StoryScene
            key={scene.image.src}
            groups={scene.groups}
            image={scene.image}
            flip={i % 2 === 1}
            muted={i % 2 === 1}
          />
        ))}
        <GalleryFinale groups={closing.groups} images={gallery} />
      </article>
    </>
  );
}
