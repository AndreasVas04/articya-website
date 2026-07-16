import { withBasePath } from "@/lib/utils";

interface PageHeroProps {
  image: string;
  heading: string;
  text: string;
}

export function PageHero({ image, heading, text }: PageHeroProps) {
  return (
    <section
      className="bg-cover bg-center"
      style={{ backgroundImage: `url(${withBasePath(image)})` }}
    >
      <div className="bg-black/50 px-4 pb-24 pt-36 text-center text-white md:pt-44">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-4xl font-bold">{heading}</h1>
          <p className="mt-4 text-lg">{text}</p>
        </div>
      </div>
    </section>
  );
}
