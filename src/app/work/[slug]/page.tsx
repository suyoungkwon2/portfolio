import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { ProjectFooterNav } from "@/components/project/ProjectFooterNav";
import { ProjectHero } from "@/components/project/ProjectHero";
import { ProjectSideNav } from "@/components/project/ProjectSideNav";
import { RelatedLinks } from "@/components/project/RelatedLinks";
import { SlideDeck } from "@/components/project/SlideDeck";
import { TenSecondSummary } from "@/components/project/TenSecondSummary";
import { PhonitaleDetail, PhonitaleHeroVideos } from "@/components/projects/PhonitaleDetail";
import { projectOrder, projects } from "@/content/projects";

// Full case studies. Published projects without one fall back to their
// portfolio-PDF slides (meta.slides). Draft detail components for the other
// projects live in src/components/projects/ and get wired in here as they're
// finished.
const detailComponents: Record<string, React.ComponentType> = {
  phonitale: PhonitaleDetail,
};

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
    title: `${meta.title} | Suyoung Kwon`,
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

  if (!meta || !projectOrder.includes(slug) || (!Detail && !meta.slides)) notFound();

  const index = projectOrder.indexOf(slug);
  const prevSlug = projectOrder[index - 1];
  const nextSlug = projectOrder[(index + 1) % projectOrder.length];

  return (
    <>
      <Nav />
      <main>
        <ProjectHero
          meta={meta}
          heroMedia={
            <>
              {meta.summary && <TenSecondSummary summary={meta.summary} />}
              {slug === "phonitale" && <PhonitaleHeroVideos />}
            </>
          }
        />
        {Detail ? <Detail /> : <SlideDeck slug={slug} title={meta.title} count={meta.slides ?? 0} />}
        <ProjectSideNav />
        <RelatedLinks links={meta.relatedLinks} />
        <ProjectFooterNav
          prev={prevSlug ? { slug: prevSlug, title: projects[prevSlug].title } : undefined}
          next={nextSlug ? { slug: nextSlug, title: projects[nextSlug].title } : undefined}
        />
      </main>
      <Footer />
    </>
  );
}
