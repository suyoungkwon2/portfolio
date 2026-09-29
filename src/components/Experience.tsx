"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Fragment, useMemo, useState } from "react";
import { experience, type ExperienceCategory, type ExperienceSubRole } from "@/content/experience";
import { SectionHeading } from "./SectionHeading";

type Filter = ExperienceCategory | "all";

const filters: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "education", label: "Education" },
  { key: "professional", label: "Professional" },
];

// Renders "[label](url)" segments in highlight text as underlined links.
function renderHighlight(text: string) {
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = linkPattern.exec(text))) {
    if (match.index > lastIndex) {
      nodes.push(<Fragment key={key++}>{text.slice(lastIndex, match.index)}</Fragment>);
    }
    nodes.push(
      <a
        key={key++}
        href={match[2]}
        target="_blank"
        rel="noreferrer"
        className="underline underline-offset-2 hover:text-ink"
      >
        {match[1]}
      </a>,
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    nodes.push(<Fragment key={key++}>{text.slice(lastIndex)}</Fragment>);
  }
  return nodes;
}

// Lists longer than this show only the first VISIBLE_HIGHLIGHTS items, with
// the rest behind a "+N more" toggle, so the strongest results stay visible
// without the long roles (Kurly, Asleep) dominating the page.
const COLLAPSE_OVER = 3;
const VISIBLE_HIGHLIGHTS = 2;

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className="shrink-0 transition-transform duration-200"
      style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
    >
      <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Reveal({ open, children }: { open: boolean; children: React.ReactNode }) {
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const listClass = "max-w-3xl list-disc space-y-1 pl-5 text-sm leading-relaxed text-ink-muted";

function Highlights({ items, visible }: { items: string[]; visible?: number }) {
  const [open, setOpen] = useState(false);
  const limit = visible ?? (items.length > COLLAPSE_OVER ? VISIBLE_HIGHLIGHTS : items.length);
  const shown = items.slice(0, limit);
  const rest = items.slice(limit);

  return (
    <div className="mt-2">
      {shown.length > 0 && (
        <ul className={listClass}>
          {shown.map((highlight) => (
            <li key={highlight}>{renderHighlight(highlight)}</li>
          ))}
        </ul>
      )}
      {rest.length > 0 && (
        <>
          <Reveal open={open}>
            <ul className={`${shown.length > 0 ? "mt-1 " : ""}${listClass}`}>
              {rest.map((highlight) => (
                <li key={highlight}>{renderHighlight(highlight)}</li>
              ))}
            </ul>
          </Reveal>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="mt-2 flex items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-accent-3"
          >
            {open ? "Show less" : `+ ${rest.length} more`}
            <Chevron open={open} />
          </button>
        </>
      )}
    </div>
  );
}

// The latest role at a company shows its top highlights; earlier roles show
// just role + period, with every highlight behind the same "+N more" toggle.
function SubRole({ sub, latest }: { sub: ExperienceSubRole; latest: boolean }) {
  return (
    <div>
      <p className="font-medium text-ink">{sub.role}</p>
      <p className="mt-0.5 text-sm text-ink-muted">{sub.period}</p>
      {sub.description && (
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-muted">{sub.description}</p>
      )}
      {sub.highlights && sub.highlights.length > 0 && (
        <Highlights items={sub.highlights} visible={latest ? undefined : 0} />
      )}
    </div>
  );
}

export function Experience() {
  const [filter, setFilter] = useState<Filter>("all");
  const filtered = useMemo(
    () => (filter === "all" ? experience : experience.filter((item) => item.category === filter)),
    [filter],
  );

  return (
    <section className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
      <SectionHeading kicker="Experience" title="Where I've built." />

      <div className="mt-8 flex items-center gap-3 text-sm">
        {filters.map((f, i) => (
          <Fragment key={f.key}>
            {i > 0 && <span className="text-line">|</span>}
            <button
              type="button"
              onClick={() => setFilter(f.key)}
              className={
                filter === f.key
                  ? "font-bold text-ink underline underline-offset-4"
                  : "text-ink-muted transition-colors hover:text-ink"
              }
            >
              {f.label}
            </button>
          </Fragment>
        ))}
      </div>

      <div className="mt-8 flex flex-col">
        {filtered.map((item, i) => (
          <motion.div
            key={`${item.org}-${item.role}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
            className="grid gap-2 border-t border-line py-5 first:border-t-0 md:grid-cols-[3fr_7fr] md:gap-8"
          >
            <div className="flex gap-3">
              <Image
                src={item.logo}
                alt={`${item.org} logo`}
                width={40}
                height={40}
                className="mt-0.5 h-10 w-10 shrink-0 rounded-md object-cover"
              />
              <div>
                {item.link ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="font-display text-lg font-medium text-ink no-underline transition-colors hover:text-accent-3"
                  >
                    {item.org}
                  </a>
                ) : (
                  <p className="font-display text-lg font-medium text-ink">{item.org}</p>
                )}
                <p className="mt-1 text-sm text-ink-muted">{item.period}</p>
                <p className="text-sm text-ink-muted">{item.location}</p>
              </div>
            </div>
            <div>
              {item.subRoles ? (
                <div className="flex flex-col gap-5">
                  {item.subRoles.map((sub, j) => (
                    <SubRole key={sub.role} sub={sub} latest={j === 0} />
                  ))}
                </div>
              ) : (
                <>
                  <p className="font-medium text-ink">{item.role}</p>
                  <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-muted">
                    {item.description}
                  </p>
                  {item.highlights && item.highlights.length > 0 && (
                    <Highlights items={item.highlights} />
                  )}
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
