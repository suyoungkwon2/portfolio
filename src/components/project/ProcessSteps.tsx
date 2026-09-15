export type ProcessStep = {
  title: string;
  body: string;
};

// A condensed Discover/Define/Develop/Deliver-style flow — every project
// in docs/projects used some variant of this process; this renders it as
// a scannable row of steps instead of the PDF's full narrative writeup.
export function ProcessSteps({ steps }: { steps: ProcessStep[] }) {
  return (
    <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, i) => (
        <li key={step.title} className="border-t-2 border-ink pt-4">
          <span className="text-xs font-medium uppercase tracking-[0.15em] text-ink-muted">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="font-display mt-2 text-base font-medium text-ink">{step.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
