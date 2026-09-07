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
// hero's frame does not end anywhere - the two plates are the same picture at
// two treatments, so what used to be a ruled line at y=521 is a focus pull with
// no edge in it at all.
// Where the window is put on the frame, and both plates carry the same two
// numbers or the focus pull would become a jump cut.
//
// Centred, the portrait frame cut both animals. A 3:4 frame in a 16:10
// window keeps 46.9% of its height, and centred that band ran 26.6% to 73.4%
// - the near cow stands at 67.6% to 83.3% of the frame, so the bottom edge
// went through her body and took her legs off. A phone is the same failure on
// the other axis: centred it started at 19.2% where her head and horns are at
// 0% to 12.5%, so the left edge took her face.
//
// The ground is now `IMG_4721-oaks`, the frame cut to rows 22.5-100% (0.968:1),
// so that a 16:10 window shows 60.5% of the picture instead of 47% and a
// 390x664 phone 60.7%. The vertical number only bites on a landscape window
// and the horizontal only on a portrait one, so they are independent. 48%
// puts the desktop band at 19.0-79.5% of the cut, which is rows 37.2-84.1% of
// the frame - the band `0% 70%` gave on the portrait, to the tenth - so the
// desktop picture does not move: the hooves clear and the oak canopy still
// crosses the top. 0% puts the phone's band at 0-60.7% of the width, her
// muzzle to the far trees.
//
// The second animal, on the right, is cut by the original frame's own edge - 
// head, horn and shoulder, with the body outside the photograph. No window on
// this frame can make her whole, so the crop is composed around the one that
// can be.
const HERO_POSITION = "0% 48%";

const plates: StagePlate[] = [
  // The evening frame, and the most saturated of the three inner heroes. It
  // needs the least darkening and can afford the least - 61% is where the
  // headline clears 4.0 with the picture still holding 60.5% of its chroma.
  { src: hero.image, position: HERO_POSITION, priority: true, shade: { top: 80, mid: 67, base: 69, color: "var(--color-land-anchor)" } },
  {
    src: hero.image,
    position: HERO_POSITION,
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
      <PageHero heading={hero.heading} text={hero.text} compactTitle />

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
