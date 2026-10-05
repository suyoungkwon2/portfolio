import type { Metadata } from "next";
import { ArrowUpRight, Copy } from "lucide-react";
import { CopyEmailLink } from "@/components/CopyEmailLink";
import { PageTitle } from "@/components/PageTitle";
import { site } from "@/content/site";

export const metadata: Metadata = {
  description: "Suyoung (Mel) Kwon's resume and contact details.",
};

const contactLinkClass = "inline-flex items-center gap-1.5 text-sm leading-[21px] text-ink no-underline transition-colors hover:text-accent-3";

const contacts = [
  { label: "LinkedIn", href: site.linkedinHref },
  { label: "GitHub", href: site.githubHref },
];

// Resume and Contact in one place: the two resume versions first, then
// every way to reach me.
export default function ResumePage() {
  return (
    <main>
      <section className="px-6 pb-14 pt-12 md:px-10 md:pb-20 md:pt-16">
        <PageTitle>Resume</PageTitle>

        <div className="mt-6 max-w-2xl space-y-[21px] text-sm leading-[21px] text-ink">
          <p>My role combined product management and product design.</p>
          <p>
            I took products from initial idea to launch, balancing user needs, business goals, and technical
            constraints, while also owning user research, wireframing, and prototyping.
          </p>
          <p>Each resume below covers the same work from one role&apos;s perspective.</p>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          {site.resumes.map((r) => (
            <a
              key={r.label}
              href={r.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-w-44 items-center justify-center bg-ink px-8 py-3.5 text-base font-medium text-paper transition-opacity hover:opacity-80"
            >
              {`{ ${r.label} }`}
            </a>
          ))}
        </div>

        <div id="contact" className="mt-20 scroll-mt-14 lg:scroll-mt-0">
          <h2 className="font-manrope text-xl font-semibold tracking-[-0.02em] text-ink md:text-2xl">Get in touch</h2>
          <ul className="mt-5 space-y-2">
            <li>
              <CopyEmailLink email={site.email} className={`${contactLinkClass} text-left`}>
                Copy email
                <Copy aria-hidden className="size-3.5" />
              </CopyEmailLink>
            </li>
            {contacts.map((c) => (
              <li key={c.label}>
                <a href={c.href} target="_blank" rel="noopener noreferrer" className={contactLinkClass}>
                  {c.label}
                  <ArrowUpRight aria-hidden className="size-3.5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
