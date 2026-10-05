import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectFooterNav } from "@/components/project/ProjectFooterNav";
import { ProjectHero } from "@/components/project/ProjectHero";
import { RelatedLinks } from "@/components/project/RelatedLinks";
import { SlideDeck } from "@/components/project/SlideDeck";
import { TenSecondSummary } from "@/components/project/TenSecondSummary";
import { MarsHeroVideo, MarsOverview } from "@/components/projects/MarsOverview";
import { PhonitaleDetail, PhonitaleHeroVideos } from "@/components/projects/PhonitaleDetail";
import { projectOrder, projects } from "@/content/projects";
import { works } from "@/content/works";

// Full case studies, wired in here as each project's web version is
// finished. Projects without one show their portfolio-PDF slides
// (meta.slides).
const detailComponents: Record<string, React.ComponentType> = {
  phonitale: PhonitaleDetail,
};

// Rebuilt chapters shown above a project's slides while the rest of its
// detail page is still the portfolio PDF.
const introComponents: Record<string, React.ComponentType> = {
  mars: MarsOverview,
};

// Static export: only the published slugs exist; anything else is the 404 page.
export const dynamicParams = false;

export function generateStaticParams() {
  return projectOrder.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = projects[slug];
  if (!meta || !projectOrder.includes(slug)) return {};
  return {
    description: meta.subtitle,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = projects[slug];
  const Detail = detailComponents[slug];
  const Intro = introComponents[slug];

  if (!meta || !projectOrder.includes(slug) || (!Detail && !meta.slides)) notFound();

  const index = projectOrder.indexOf(slug);
  const prevSlug = projectOrder[index - 1];
  const nextSlug = projectOrder[(index + 1) % projectOrder.length];

  // Case studies keep the original type (Inter body, Aspekta display);
  // the rest of the site is set in Manrope (app/layout.tsx).
  return (
    <main className="[--font-display:Aspekta,sans-serif] [font-family:Inter,sans-serif]">
      <ProjectHero
        meta={meta}
        heroMedia={
          <>
            {meta.summary && <TenSecondSummary summary={meta.summary} />}
            {meta.slides && !Detail && (
              <p className="mt-6 pb-4 text-center text-base text-ink">
                I&apos;m redesigning this case study as a web page. Every detail is in the PDF
                version below.
              </p>
            )}
            {slug === "phonitale" && <PhonitaleHeroVideos />}
            {slug === "mars" && <MarsHeroVideo />}
          </>
        }
      />
      {Detail ? <Detail /> : Intro && <Intro />}
      {meta.slides && <SlideDeck slug={slug} title={meta.title} count={meta.slides} />}
      <RelatedLinks links={meta.relatedLinks} />
      <ProjectFooterNav
        prev={works.find((w) => w.slug === prevSlug)}
        next={works.find((w) => w.slug === nextSlug)}
      />
    </main>
  );
}
