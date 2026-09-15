export type StatItem = {
  value: string;
  label: string;
};

// Headline-number block — the "don't make me read the paragraph" summary
// that leads most sections here, per the brief's ask for scannable,
// PM-clear case studies over the original PDF's dense narrative prose.
export function StatGrid({ stats }: { stats: StatItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label}>
          <p className="font-display text-3xl font-medium text-accent md:text-4xl">
            {stat.value}
          </p>
          <p className="mt-1.5 text-sm leading-snug text-ink-muted">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
