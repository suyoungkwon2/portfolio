import type { Metadata } from "next";
import { Publication } from "@/components/Publication";
import { SectionHeading } from "@/components/SectionHeading";
import { WorkGrid, worksIn } from "@/components/SelectedWorks";

export const metadata: Metadata = {
  title: "Research | Suyoung Kwon",
  description: "Applied AI research and publications by Suyoung (Mel) Kwon.",
};

export default function ResearchPage() {
  return (
    <main>
      <section className="px-6 pb-14 pt-20 md:px-10 md:pb-20 md:pt-28">
        <SectionHeading kicker="Research" title="What I've researched." />
        <div className="mt-16">
          <WorkGrid items={worksIn("AI Research")} />
        </div>
      </section>
      <Publication />
    </main>
  );
}
