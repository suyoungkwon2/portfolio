import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectFooterNav } from "@/components/project/ProjectFooterNav";
import { ProjectHero } from "@/components/project/ProjectHero";
import { RelatedLinks } from "@/components/project/RelatedLinks";
import { SlideDeck } from "@/components/project/SlideDeck";
import { TenSecondSummary } from "@/components/project/TenSecondSummary";
import { AsleepTrackDetail } from "@/components/projects/AsleepTrackDetail";
import { MarsHeroVideo, MarsOverview } from "@/components/projects/MarsOverview";
import { PhonitaleDetail, PhonitaleHeroVideos } from "@/components/projects/PhonitaleDetail";
import { SleepViceDetail } from "@/components/projects/SleepViceDetail";
import { SomMindDetail } from "@/components/projects/SomMindDetail";
import { projectOrder, projects } from "@/content/projects";

// Full case studies. Published projects without one fall back to their
// portfolio-PDF slides (meta.slides). Draft detail components for the other
// projects live in src/components/projects/ and get wired in here as they're
// finished.
const detailComponents: Record<string, React.ComponentType> = {
  phonitale: PhonitaleDetail,
  sommind: SomMindDetail,
  asleeptrack: AsleepTrackDetail,
  sleepvice: SleepViceDetail,
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
            {slug === "phonitale" && <PhonitaleHeroVideos />}
            {slug === "mars" && <MarsHeroVideo />}
          </>
        }
      />
      {Detail ? <Detail /> : Intro && <Intro />}
      {meta.slides && <SlideDeck slug={slug} title={meta.title} count={meta.slides} />}
      <RelatedLinks links={meta.relatedLinks} />
      <ProjectFooterNav
        prev={prevSlug ? { slug: prevSlug, title: projects[prevSlug].title } : undefined}
        next={nextSlug ? { slug: nextSlug, title: projects[nextSlug].title } : undefined}
      />
    </main>
  );
}
