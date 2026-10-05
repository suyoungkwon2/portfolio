import { works, workSectors, type WorkItem, type WorkSector } from "@/content/works";
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

// The landing page's case studies: one grid of cards with no heading, so
// the first row shows right below the hero. Sectors keep their order
// (workSectors), AI Research first.
export function SelectedWorks() {
  const ordered = workSectors.flatMap(worksIn);
  return (
    <section id="work" className="px-6 pb-14 pt-6 md:px-10 md:pb-20">
      <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2">
        {ordered.map((work, i) => (
          <WorkCard key={work.slug} work={work} index={i} />
        ))}
      </div>
    </section>
  );
}
