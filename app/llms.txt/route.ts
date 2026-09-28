import { siteUrl } from "@/lib/metadata";

export const dynamic = "force-static";

// Written into the export as llms.txt, like robots.txt and the sitemap: the
// pages it lists are the site's own addresses, so they come from the same
// `siteUrl` the canonicals do rather than from a copy that has to be edited
// whenever the site moves.
const body = `# ArtiCYa

ArtiCYa is a youth organisation based in Cyprus. It runs and takes part in Erasmus+ projects for young people and youth workers: youth exchanges for participants aged 13 to 30, and training courses for youth workers aged 18 and over, with travel, accommodation and meals covered by the programme. This site describes what the organisation does, what participants gain, and how to get in touch.

## Pages

- ${siteUrl}/ : Home. What ArtiCYa does, the two kinds of project it runs, and what a participant gains.
- ${siteUrl}/about/ : About. Who ArtiCYa is and how it works, told alongside photographs of its activities.
- ${siteUrl}/faq/ : FAQ. Questions and answers on Erasmus+, costs and safety, the experience and participation, and applications.
- ${siteUrl}/contact/ : Contact. Email and social profiles.

## Photography

Every photograph on this site is ArtiCYa's own, taken at its activities. The photographs, the logo and the site copy are copyright ArtiCYa, all rights reserved, and are not licensed for reuse.
`;

export function GET() {
  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
