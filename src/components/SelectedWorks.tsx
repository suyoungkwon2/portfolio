import { works, workSectors } from "@/content/works";
import { SectionHeading } from "./SectionHeading";
import { WorkCard } from "./WorkCard";

export function SelectedWorks() {
  return (
    <section id="work" className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
      <SectionHeading kicker="Selected Works" title="Products that moved the needle." />

      <div className="mt-16 flex flex-col gap-20">
        {workSectors.map((sector) => {
          const items = works.filter((w) => w.sector === sector);
          return (
            <div key={sector}>
              <h3 className="font-display text-xl font-medium text-ink md:text-2xl">
                {sector}
              </h3>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((work, i) => (
                  <WorkCard key={work.slug} work={work} index={i} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
