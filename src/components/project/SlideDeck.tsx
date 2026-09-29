import Image from "next/image";

// Interim case-study body: the project's portfolio-PDF spreads, rendered to
// /public/images/<slug>/slides/slide-<n>.webp (2400px wide, A3 landscape).
// Shown until the project gets a full detail page. Each slide links to its
// full-resolution file so the dense spreads stay readable on phones.
export function SlideDeck({ slug, title, count }: { slug: string; title: string; count: number }) {
  return (
    <section
      id="case-study"
      data-chapter="Case Study"
      className="mx-auto flex max-w-6xl scroll-mt-16 flex-col gap-6 px-6 py-14 md:px-10 md:py-20"
    >
      {Array.from({ length: count }, (_, i) => {
        const src = `/images/${slug}/slides/slide-${i + 1}.webp`;
        return (
          <a key={src} href={src} target="_blank" rel="noreferrer" className="block">
            <Image
              src={src}
              alt={`${title}, case study page ${i + 1} of ${count}`}
              width={2400}
              height={1699}
              sizes="(min-width: 1152px) 1072px, 100vw"
              className="h-auto w-full rounded-lg border border-line"
            />
          </a>
        );
      })}
      <p className="text-center text-xs text-ink-muted">Tap a page to open it at full resolution.</p>
    </section>
  );
}
