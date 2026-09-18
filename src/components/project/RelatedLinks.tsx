import type { RelatedLink } from "@/content/projects";
import { Section } from "./Section";

export function RelatedLinks({ links }: { links: RelatedLink[] }) {
  if (links.length === 0) return null;

  return (
    <Section kicker="Related Links" wide>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.url}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-start gap-1.5 text-sm text-ink-muted transition-colors hover:text-accent-3"
            >
              <span className="underline decoration-line underline-offset-4 group-hover:decoration-accent-3">
                {link.label}
              </span>
              <span aria-hidden className="shrink-0">
                ↗
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
