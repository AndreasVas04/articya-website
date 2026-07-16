import {
  Award,
  Compass,
  Globe,
  GraduationCap,
  HandCoins,
  Users,
} from "lucide-react";
import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import { StatCounter } from "@/components/stat-counter";
import { Reveal } from "@/components/reveal";
import { ButtonLink } from "@/components/ui/button";
import { hero, whatWeDo, gain } from "@/content/home";
import { withBasePath } from "@/lib/utils";

const cardIcons = [Globe, GraduationCap];
const gainIcons = [Compass, Users, Award, HandCoins];

export default function HomePage() {
  return (
    <>
      <ScrollExpandMedia
        slides={hero.slides}
        bgImageSrc={hero.slides[0]}
        title={hero.heading}
        hintLabel={hero.location}
      >
        <p className="max-w-2xl translate-y-6 text-center text-base leading-[1.55] text-plaster-bright opacity-0 duration-[700ms] ease-out-quart group-data-[expanded]:translate-y-0 group-data-[expanded]:opacity-100 group-data-[expanded]:transition-[opacity,transform] motion-reduce:translate-y-0 md:text-xl">
          {hero.text}
        </p>
        <div className="mt-6 translate-y-6 opacity-0 duration-[400ms] ease-out-quart group-data-[expanded]:translate-y-0 group-data-[expanded]:opacity-100 group-data-[expanded]:transition-[opacity,transform] group-data-[expanded]:delay-200 motion-reduce:translate-y-0">
          <ButtonLink
            href={hero.cta.href}
            className="bg-resin text-pine-950 hover:bg-resin-light"
          >
            {hero.cta.label}
          </ButtonLink>
        </div>
      </ScrollExpandMedia>

      <section className="bg-plaster px-4 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="md:grid md:grid-cols-12 md:items-end md:gap-x-16">
            <Reveal className="md:col-span-7">
              <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.1] tracking-[-0.01em]">
                {whatWeDo.title}
              </h2>
              <p className="mt-6 max-w-xl text-xl leading-[1.55] text-pine-900">
                {whatWeDo.lead}
              </p>
            </Reveal>
            <div className="mt-12 divide-y divide-sage border-y border-sage md:col-span-5 md:mt-0">
              {whatWeDo.stats.map((stat, i) => (
                <Reveal key={stat.label} delayMs={i * 100}>
                  <StatCounter num={stat.num} label={stat.label} />
                </Reveal>
              ))}
            </div>
          </div>

          <div className="mt-14 grid gap-8 md:mt-20 md:grid-cols-2">
            {whatWeDo.cards.map((card, i) => {
              const Icon = cardIcons[i] ?? Globe;
              return (
                <Reveal key={card.title} delayMs={i * 150} className="h-full">
                  <article className="h-full overflow-hidden rounded-lg border border-sage bg-plaster-bright transition-[border-color,box-shadow,transform] duration-200 ease-out-quart hover:-translate-y-1 hover:border-lichen hover:shadow-[0_20px_40px_-24px_rgba(19,26,18,0.4)]">
                    <div
                      className="relative h-52 bg-cover bg-center md:h-60"
                      style={{
                        backgroundImage: `url(${withBasePath(card.image)})`,
                      }}
                    >
                      <span
                        aria-hidden="true"
                        className="absolute left-4 top-4 flex size-10 items-center justify-center rounded-full bg-plaster-bright/90 text-lichen"
                      >
                        <Icon className="size-5" strokeWidth={1.5} />
                      </span>
                    </div>
                    <div className="p-6 md:p-8">
                      <h3 className="font-display text-2xl font-semibold leading-[1.25]">
                        {card.title}
                      </h3>
                      <p className="mt-3 leading-[1.7] text-pine-900">
                        {card.text}
                      </p>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-plaster-muted px-4 py-16 text-center md:py-24">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.1] tracking-[-0.01em]">
              {gain.title}
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {gain.items.map((item, i) => {
              const Icon = gainIcons[i] ?? Compass;
              return (
                <Reveal key={item} delayMs={i * 100} className="h-full">
                  <div className="flex h-full items-center gap-4 rounded-lg border border-sage bg-plaster-bright px-5 py-4 text-left">
                    <span
                      aria-hidden="true"
                      className="flex size-10 shrink-0 items-center justify-center rounded-full bg-plaster-muted text-lichen"
                    >
                      <Icon className="size-5" strokeWidth={1.5} />
                    </span>
                    <span className="font-semibold">{item}</span>
                  </div>
                </Reveal>
              );
            })}
          </div>
          <Reveal delayMs={100}>
            <p className="mt-12 text-xl leading-[1.55] text-pine-900">
              {gain.text}
            </p>
            <p className="mt-3 font-display text-[clamp(1.75rem,3vw,2.25rem)] font-semibold leading-[1.25] text-resin-deep">
              {gain.highlight}
            </p>
          </Reveal>
          <Reveal delayMs={200}>
            <div className="mt-10">
              <ButtonLink
                href={gain.cta.href}
                className="bg-resin-deep text-plaster-bright hover:bg-pine-900"
              >
                {gain.cta.label}
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
