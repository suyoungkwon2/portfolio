import type { Metadata } from "next";
import { PageTitle } from "@/components/PageTitle";
import { WorkGrid, worksIn } from "@/components/SelectedWorks";

export const metadata: Metadata = {
  title: "Projects | Suyoung Kwon",
  description: "Products Suyoung (Mel) Kwon has shipped across AI, B2B SaaS, and digital health.",
};

export default function ProjectsPage() {
  return (
    <main>
      <section className="px-6 pb-14 pt-12 md:px-10 md:pb-20 md:pt-16">
        <PageTitle>What I&apos;ve shipped</PageTitle>
        <div className="mt-12">
          <WorkGrid items={worksIn("Projects")} />
        </div>
      </section>
    </main>
  );
}
