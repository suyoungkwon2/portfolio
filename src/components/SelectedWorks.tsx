import { featuredSlugs, works, type WorkItem, type WorkSector } from "@/content/works";
import { sectionTitleClass } from "./PageTitle";
import { WorkCard } from "./WorkCard";

export const worksIn = (sector: WorkSector) => works.filter((w) => w.sector === sector);

export function WorkGrid({ items }: { items: WorkItem[] }) {
  return (
    <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2">
      {items.map((work, i) => (
        <WorkCard key={work.slug} work={work} index={i} />
      ))}
    </div>
  );
}

// The landing page's case studies: a short "Selected Projects" pick
// (featuredSlugs), the strongest and most finished ones.
export function SelectedWorks() {
  const featured = featuredSlugs.map((slug) => works.find((w) => w.slug === slug)!);
  return (
    <section id="work" className="px-6 pt-6 md:px-10">
      <h2 className={sectionTitleClass}>Selected Projects</h2>
      <div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2">
        {featured.map((work, i) => (
          <WorkCard key={work.slug} work={work} index={i} />
        ))}
      </div>
    </section>
  );
}
