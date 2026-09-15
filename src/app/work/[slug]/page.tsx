import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { ProjectFooterNav } from "@/components/project/ProjectFooterNav";
import { ProjectHero } from "@/components/project/ProjectHero";
import { AiCurationDetail } from "@/components/projects/AiCurationDetail";
import { AiSearchDetail } from "@/components/projects/AiSearchDetail";
import { AsleepTrackDetail } from "@/components/projects/AsleepTrackDetail";
import { MarsDetail } from "@/components/projects/MarsDetail";
import { PhonitaleDetail } from "@/components/projects/PhonitaleDetail";
import { SleepViceDetail } from "@/components/projects/SleepViceDetail";
import { SomMindDetail } from "@/components/projects/SomMindDetail";
import { projectOrder, projects } from "@/content/projects";

const detailComponents: Record<string, React.ComponentType> = {
  mars: MarsDetail,
  phonitale: PhonitaleDetail,
  sommind: SomMindDetail,
  "ai-search": AiSearchDetail,
  "ai-curation": AiCurationDetail,
  asleeptrack: AsleepTrackDetail,
  sleepvice: SleepViceDetail,
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
  if (!meta) return {};
  return {
    title: `${meta.title} — Suyoung Kwon`,
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

  if (!meta || !Detail) notFound();

  const index = projectOrder.indexOf(slug);
  const prevSlug = projectOrder[index - 1];
  const nextSlug = projectOrder[(index + 1) % projectOrder.length];

  return (
    <>
      <Nav />
      <main>
        <ProjectHero meta={meta} />
        <Detail />
        <ProjectFooterNav
          prev={prevSlug ? { slug: prevSlug, title: projects[prevSlug].title } : undefined}
          next={nextSlug ? { slug: nextSlug, title: projects[nextSlug].title } : undefined}
        />
      </main>
      <Footer />
    </>
  );
}
