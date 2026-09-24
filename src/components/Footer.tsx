import { site } from "@/content/site";
import { CopyEmailLink } from "./CopyEmailLink";

const linkClass =
  "cursor-pointer text-lg font-medium text-ink no-underline transition-colors hover:text-accent-3";

// Shared by every page, so contact details and the internship status are
// always one scroll away rather than living only on the About page.
export function Footer() {
  return (
    <footer id="contact" className="border-t border-line pb-10 pt-20 md:pt-28">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <span className="text-xs font-medium uppercase tracking-[0.25em] text-accent">Contact</span>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          <a href={site.resumeHref} target="_blank" rel="noopener noreferrer" className={linkClass}>
            Resume
          </a>
          <a href={site.linkedinHref} target="_blank" rel="noopener noreferrer" className={linkClass}>
            LinkedIn
          </a>
          <CopyEmailLink email={site.email} className={linkClass} />
          <a href={site.githubHref} target="_blank" rel="noopener noreferrer" className={linkClass}>
            GitHub
          </a>
        </div>
        {/* mt-10 leaves room for the Email button's "Copied to clipboard" note. */}
        <p className="mt-10 text-center text-sm text-ink-muted">{site.availability}</p>

        <p className="mt-20 text-sm text-ink-muted">
          © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  );
}
