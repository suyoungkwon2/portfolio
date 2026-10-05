import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { CopyEmailLink } from "@/components/CopyEmailLink";
import { SectionHeading } from "@/components/SectionHeading";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Resume | Suyoung Kwon",
  description: "Suyoung (Mel) Kwon's resume and contact details.",
};

const valueClass = "text-ink no-underline transition-colors hover:text-accent-3";

const contacts = [
  { label: "LinkedIn", value: "linkedin.com/in/suyoungkwon", href: site.linkedinHref },
  { label: "GitHub", value: "github.com/suyoungkwon2", href: site.githubHref },
];

// Resume and Contact in one place: the PDF first, then every way to reach me.
export default function ResumePage() {
  return (
    <main>
      <section className="px-6 pb-14 pt-20 md:px-10 md:pb-20 md:pt-28">
        <SectionHeading kicker="Resume" title="My resume, and how to reach me." />

        <a
          href={site.resumeHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-12 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-opacity hover:opacity-80"
        >
          View resume (PDF)
          <ArrowUpRight aria-hidden className="size-4" />
        </a>
        <p className="mt-4 text-sm text-ink-muted">{site.availability}</p>

        <div id="contact" className="mt-20 scroll-mt-14 lg:scroll-mt-0">
          <span className="text-xs font-medium uppercase tracking-[0.25em] text-accent">Contact</span>
          <dl className="mt-6 max-w-2xl border-t border-line">
            <div className="grid grid-cols-[7rem_1fr] items-baseline gap-4 border-b border-line py-4">
              <dt className="text-sm text-ink-muted">Email</dt>
              <dd className="justify-self-start">
                <CopyEmailLink email={site.email} className={`${valueClass} text-left`}>
                  {site.email}
                </CopyEmailLink>
              </dd>
            </div>
            {contacts.map((c) => (
              <div key={c.label} className="grid grid-cols-[7rem_1fr] items-baseline gap-4 border-b border-line py-4">
                <dt className="text-sm text-ink-muted">{c.label}</dt>
                <dd>
                  <a href={c.href} target="_blank" rel="noopener noreferrer" className={valueClass}>
                    {c.value}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </main>
  );
}
