import { PageHero } from "@/components/page-hero";
import { SmoothScroll } from "@/components/smooth-scroll";
import { StoryScene } from "@/components/story-scene";
import { GalleryFinale } from "@/components/gallery-finale";
import { pageMetadata } from "@/lib/metadata";
import { meta, hero, story, closing, gallery } from "@/content/about";

export const metadata = pageMetadata({
  title: meta.title,
  description: meta.description,
  path: "/about/",
});

// The About page is one continuous scroll story: each paragraph is a pinned
// scene where a photograph and its words arrive together, and the closing
// paragraph dissolves into the gallery finale.
export default function AboutPage() {
  return (
    <>
      <SmoothScroll />
      {/* The oak and the cattle: an evening frame, and the most saturated of
          the three. It needs the least darkening and can afford the least —
          61% is where the headline clears 4.0 with the picture still holding
          60.5% of its chroma. */}
      <PageHero
        image={hero.image}
        heading={hero.heading}
        text={hero.text}
        shade={{ top: 78, mid: 61, base: 64 }}
      />

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
