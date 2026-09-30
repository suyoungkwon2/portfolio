import { news } from "@/content/news";
import { renderLinks } from "@/lib/renderLinks";
import { SectionHeading } from "./SectionHeading";

// Fixed-height list that scrolls in place (as on the previous site), so the
// full history is there without stretching the page. About five items show
// before scrolling; the bottom fade hints there's more.
export function News() {
  return (
    <section id="news" className="mx-auto max-w-6xl px-6 py-14 md:px-10 md:py-20">
      <SectionHeading kicker="News" title="What I've been up to." />

      <div className="relative mt-12 overflow-hidden rounded-2xl border border-line bg-white">
        <ul
          tabIndex={0}
          aria-label="News, scrollable"
          className="flex max-h-[24rem] flex-col overflow-y-auto overscroll-contain px-6 pb-10 md:px-8"
        >
          {news.map((item, i) => (
            <li
              key={`${item.date}-${item.content}`}
              className={`grid gap-1 py-4 sm:grid-cols-[7rem_1fr] sm:gap-6 ${i > 0 ? "border-t border-line" : ""}`}
            >
              <span className="text-sm font-medium text-ink-muted">{item.date}</span>
              <p className="text-sm leading-relaxed text-ink">{renderLinks(item.content)}</p>
            </li>
          ))}
        </ul>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent"
        />
      </div>
    </section>
  );
}
