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

// The ground each scene stands on, in scene order — the walk the story is
// told from, one frame per beat. Each is positioned on its open band, which is
// what a 20px paragraph under a 0.55 pool needs to clear 4.5.
const SCENE_GROUNDS = [
  { src: "/images/pt/IMG_4585.jpg", framing: { y: 30, ySm: 30 } },
  { src: "/images/pt/IMG_4582.jpg", framing: { y: 24, ySm: 24 } },
  { src: "/images/pt/IMG_4739.jpg", framing: { y: 22, ySm: 22 } },
];

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
            ground={SCENE_GROUNDS[i].src}
            groundFraming={SCENE_GROUNDS[i].framing}
            flip={i % 2 === 1}
          />
        ))}
        <GalleryFinale groups={closing.groups} images={gallery} />
      </article>
    </>
  );
}
