import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-line px-6 py-10 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-ink-muted sm:flex-row">
        <p>© {new Date().getFullYear()} {site.name}</p>
        <a href={`mailto:${site.email}`} className="transition-colors hover:text-ink">
          {site.email}
        </a>
      </div>
    </footer>
  );
}
