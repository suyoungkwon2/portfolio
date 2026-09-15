// Mirrors the domain/problem/tech chip coding from the source portfolio
// PDF (green/red/blue), remapped onto the site's restrained brand palette
// instead of introducing an off-system red. See globals.css's color
// system comment for why brand colors stay reserved for point moments.
const styles = {
  domain: "bg-accent-2-soft text-accent-2",
  problem: "bg-paper-2 text-ink-muted",
  tech: "bg-accent-soft text-accent",
} as const;

export function Chip({
  kind,
  children,
}: {
  kind: keyof typeof styles;
  children: React.ReactNode;
}) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles[kind]}`}>
      {children}
    </span>
  );
}
