import { Kicker } from "@/components/project/TenSecondSummary";

// Building blocks for the chaptered case-study layout (PhoniTale, MARS).
// Deliberately NOT the shared <Section> component (./Section.tsx): that
// component's plain-text kicker and py-14/py-20 rhythm is load-bearing for
// the older case studies, while this layout uses a filled-pill kicker and
// tighter px-[88px] py-10 spacing.

// Shared kicker + title + body shell for every "feature" block.
export function CaseSection({
  kicker,
  title,
  align = "center",
  children,
}: {
  kicker: string;
  title: string;
  align?: "left" | "center";
  children: React.ReactNode;
}) {
  const centered = align === "center";
  return (
    <section className="mx-auto flex max-w-[1200px] flex-col gap-4 px-6 py-8 md:px-[88px] md:py-10">
      <Kicker>{kicker}</Kicker>
      <h2
        className={`mt-4 font-display text-2xl font-semibold leading-tight text-ink sm:text-3xl ${
          centered ? "text-center" : ""
        }`}
      >
        {title}
      </h2>
      <div className={`flex flex-col gap-6 ${centered ? "items-center text-center" : ""}`}>
        {children}
      </div>
    </section>
  );
}

// Icon tile on a grey panel, with an accent title and a short description.
export function IconStat({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col items-center gap-4">
      <div className="flex h-[150px] w-full items-center justify-center overflow-hidden bg-line">
        {icon}
      </div>
      <div className="flex flex-col gap-1.5 text-center">
        <p className="font-display text-xl font-semibold text-accent">{title}</p>
        <p className="text-sm leading-snug text-ink-muted">{description}</p>
      </div>
    </div>
  );
}

// External links stacked under a Result headline (paper, poster, news...).
export function ResultLinks({ links }: { links: { label: string; url: string }[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {links.map((link) => (
        <li key={link.url}>
          <a
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="w-fit text-sm text-ink-muted underline underline-offset-2 hover:text-ink"
          >
            {link.label} ↗
          </a>
        </li>
      ))}
    </ul>
  );
}
