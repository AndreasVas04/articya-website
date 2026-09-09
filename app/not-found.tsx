import type { Metadata } from "next";
import { PhotoStage, type StagePlate } from "@/components/photo-stage";
import { ButtonLink } from "@/components/ui/button";
import { meta, notFound } from "@/content/not-found";

// No canonical: a missing address is not a page of the site, and GitHub Pages
// serves this file for every one of them - inherited from the layout it would
// point at home. Next marks the page noindex on its own.
export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: null },
};

// The About page's own ground and its own darkening, sharp, so the frame is
// one the reader has seen and the type measures as it measures there.
const plates: StagePlate[] = [
  {
    src: notFound.image,
    position: "0% 48%",
    priority: true,
    shade: { top: 80, mid: 67, base: 69, color: "var(--color-land-anchor)" },
  },
];

// The page a wrong address lands on: the photograph, the wordmark, one line
// and the way home. Static export writes it as 404.html, which is the file
// GitHub Pages serves for a path it does not have.
export default function NotFound() {
  return (
    <>
      <PhotoStage plates={plates} />
      <section
        data-stage-plate="0"
        data-stage-strength="1"
        className="relative flex min-h-svh items-center"
      >
        <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-4 pb-16 pt-28 text-center md:pb-20 md:pt-36">
          <span aria-hidden="true" className="mx-auto block h-[1.25px] w-16 bg-amber" />
          <h1 className="type-title mx-auto mt-6 max-w-[11ch] text-balance font-display font-semibold tracking-[-0.025em] text-ink">
            {notFound.heading}
          </h1>
          <p className="type-body mx-auto mt-8 text-pretty text-ink">{notFound.text}</p>
          <div className="mt-10">
            <ButtonLink href={notFound.cta.href} variant="gold">
              {notFound.cta.label}
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
