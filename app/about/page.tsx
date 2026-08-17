import { PageHero } from "@/components/page-hero";
import { PhotoStage, type StagePlate } from "@/components/photo-stage";
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

// The page's ground, and there is only one photograph in it: the oak and the
// cattle, sharp under the hero and out of focus under everything below it. The
// hero's frame does not end anywhere — the two plates are the same picture at
// two treatments, so what used to be a ruled line at y=521 is a focus pull with
// no edge in it at all.
const plates: StagePlate[] = [
  // The evening frame, and the most saturated of the three inner heroes. It
  // needs the least darkening and can afford the least — 61% is where the
  // headline clears 4.0 with the picture still holding 60.5% of its chroma.
  { src: hero.image, position: "50% 50%", priority: true, shade: { top: 80, mid: 67, base: 69, color: "var(--color-land-anchor)" } },
  {
    src: hero.image,
    position: "50% 50%",
    soft: true,
    shade: { top: 52, mid: 62, base: 70, from: "22%", to: "62%", color: "var(--color-land-anchor)" },
  },
];

// The About page is one continuous scroll story: each paragraph is a scene
// where a photograph and its words arrive together, and the closing paragraph
// dissolves into the gallery finale.
export default function AboutPage() {
  return (
    <>
      <SmoothScroll />
      <PhotoStage plates={plates} />
      <PageHero heading={hero.heading} text={hero.text} />

      <article data-stage-plate="1" data-stage-strength="1" className="relative">
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
    </>
  );
}
