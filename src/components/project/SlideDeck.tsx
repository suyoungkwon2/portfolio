import Image from "next/image";

// Interim case-study body: the project's portfolio-PDF spreads, rendered to
// /public/images/<slug>/slides/slide-<n>.webp (2400px wide, A3 landscape).
// Shown until the project gets a full detail page. Spreads run wider than
// the rest of the page (up to 1600px) because their text is small, but
// never taller than the screen (1.413 is their width / height); each also
// links to its full-resolution file for phones.
export function SlideDeck({ slug, title, count }: { slug: string; title: string; count: number }) {
  return (
    <section
      id="case-study"
      data-chapter="Case Study"
      className="mx-auto flex max-w-[1600px] scroll-mt-16 flex-col gap-6 px-4 py-14 md:px-6 md:py-20"
    >
      {Array.from({ length: count }, (_, i) => {
        const src = `/images/${slug}/slides/slide-${i + 1}.webp`;
        return (
          <a
            key={src}
            href={src}
            target="_blank"
            rel="noreferrer"
            className="mx-auto block w-full max-w-[calc((100svh-3rem)*1.413)]"
          >
            <Image
              src={src}
              alt={`${title}, case study page ${i + 1} of ${count}`}
              width={2400}
              height={1699}
              sizes="(min-width: 1600px) 1552px, 100vw"
              className="h-auto w-full rounded border border-line"
            />
          </a>
        );
      })}
      <p className="text-center text-xs text-ink-muted">Tap a page to open it at full resolution.</p>
    </section>
  );
}
