// Marks a new chapter inside a long case study (Overview / Process /
// Evaluation / Reflection) — a centered label between two rules, with an
// italic one-line summary of what the chapter covers. The id and
// data-chapter attribute register it in the sidebar tree.
export function ChapterDivider({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div
      id={title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
      data-chapter={title}
      className="mx-auto flex max-w-[1200px] scroll-mt-16 flex-col items-center gap-2 px-6 py-10 md:px-[88px]"
    >
      <div className="flex w-full items-center gap-8">
        <div className="h-px flex-1 bg-line" />
        <span className="font-display text-xl font-semibold text-accent sm:text-2xl">{title}</span>
        <div className="h-px flex-1 bg-line" />
      </div>
      <p className="text-center text-base italic text-ink-muted">{subtitle}</p>
    </div>
  );
}
