export function PullQuote({
  children,
  attribution,
}: {
  children: React.ReactNode;
  attribution?: string;
}) {
  return (
    <blockquote className="border-l-2 border-accent-3 pl-6">
      <p className="instrument-serif-regular-italic text-xl leading-snug text-ink md:text-2xl">
        {children}
      </p>
      {attribution && (
        <cite className="mt-3 block text-sm not-italic text-ink-muted">— {attribution}</cite>
      )}
    </blockquote>
  );
}
