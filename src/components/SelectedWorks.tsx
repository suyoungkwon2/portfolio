import { works, workSectors, type WorkItem, type WorkSector } from "@/content/works";
import { SectionHeading } from "./SectionHeading";
import { WorkCard } from "./WorkCard";

export const worksIn = (sector: WorkSector) => works.filter((w) => w.sector === sector);

export function WorkGrid({ items }: { items: WorkItem[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {items.map((work, i) => (
        <WorkCard key={work.slug} work={work} index={i} />
      ))}
    </div>
  );
}

export function SelectedWorks() {
  return (
    <section id="work" className="px-6 pb-14 pt-6 md:px-10 md:pb-20">
      <SectionHeading kicker="Work" title="What I've built." />

      <div className="mt-12 flex flex-col gap-20">
        {workSectors.map((sector) => (
          <div key={sector}>
            <h3 className="font-display text-xl font-medium text-ink md:text-2xl">{sector}</h3>
            <div className="mt-8">
              <WorkGrid items={worksIn(sector)} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
