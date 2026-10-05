import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { WorkGrid, worksIn } from "@/components/SelectedWorks";

export const metadata: Metadata = {
  title: "Projects | Suyoung Kwon",
  description: "Products Suyoung (Mel) Kwon has shipped across AI, B2B SaaS, and digital health.",
};

export default function ProjectsPage() {
  return (
    <main>
      <section className="px-6 pb-14 pt-20 md:px-10 md:pb-20 md:pt-28">
        <SectionHeading kicker="Projects" title="What I've shipped." />
        <div className="mt-16">
          <WorkGrid items={worksIn("Projects")} />
        </div>
      </section>
    </main>
  );
}
