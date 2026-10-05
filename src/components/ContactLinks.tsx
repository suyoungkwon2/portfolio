import { ArrowUpRight, Copy } from "lucide-react";
import { site } from "@/content/site";
import { CopyEmailLink } from "./CopyEmailLink";

const linkClass = "inline-flex items-center gap-1.5 text-sm leading-[21px] text-ink no-underline transition-colors hover:text-accent-3";

const links = [
  { label: "LinkedIn", href: site.linkedinHref },
  { label: "GitHub", href: site.githubHref },
];

// Copy email, LinkedIn, GitHub. Stacked on Resume, in a row under the
// About story; the caller sets the layout through className.
export function ContactLinks({ className }: { className?: string }) {
  return (
    <ul className={className}>
      <li>
        <CopyEmailLink email={site.email} className={`${linkClass} text-left`}>
          Copy email
          <Copy aria-hidden className="size-3.5" />
        </CopyEmailLink>
      </li>
      {links.map((l) => (
        <li key={l.label}>
          <a href={l.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
            {l.label}
            <ArrowUpRight aria-hidden className="size-3.5" />
          </a>
        </li>
      ))}
    </ul>
  );
}
