import type { Metadata } from "next";
import { Publication } from "@/components/Publication";
import { PageTitle } from "@/components/PageTitle";
import { WorkGrid, worksIn } from "@/components/SelectedWorks";

export const metadata: Metadata = {
  description: "Applied AI research and publications by Suyoung (Mel) Kwon.",
};

export default function ResearchPage() {
  return (
    <main>
      <section className="px-6 pb-14 pt-12 md:px-10 md:pb-20 md:pt-16">
        <PageTitle>What I&apos;ve researched</PageTitle>
        <div className="mt-12">
          <WorkGrid items={worksIn("AI Research")} />
        </div>
      </section>
      <Publication />
    </main>
  );
}
