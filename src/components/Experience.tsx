"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Fragment, useMemo, useState } from "react";
import { renderLinks } from "@/lib/renderLinks";
import { experience, type ExperienceCategory, type ExperienceSubRole } from "@/content/experience";
import { MoreToggle, Reveal } from "./Disclosure";
import { sectionTitleClass } from "./PageTitle";

type Filter = ExperienceCategory | "all";

const filters: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "education", label: "Education" },
  { key: "professional", label: "Professional" },
];

// Lists longer than this show only the first VISIBLE_HIGHLIGHTS items, with
// the rest behind a "+N more" toggle, so the strongest results stay visible
// without the long roles (Kurly, Asleep) dominating the page.
const COLLAPSE_OVER = 3;
const VISIBLE_HIGHLIGHTS = 2;

const listClass = "max-w-3xl list-disc space-y-1 pl-5 text-sm leading-[21px] text-ink";

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
            <li key={highlight}>{renderLinks(highlight)}</li>
          ))}
        </ul>
      )}
      {rest.length > 0 && (
        <>
          <Reveal open={open}>
            <ul className={`${shown.length > 0 ? "mt-1 " : ""}${listClass}`}>
              {rest.map((highlight) => (
                <li key={highlight}>{renderLinks(highlight)}</li>
              ))}
            </ul>
          </Reveal>
          <MoreToggle open={open} count={rest.length} onToggle={() => setOpen((v) => !v)} />
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
        <p className="mt-2 max-w-3xl text-sm leading-[21px] text-ink">{sub.description}</p>
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
    <section id="experience" className="px-6 py-14 md:px-10 md:py-20">
      <h2 className={sectionTitleClass}>What I&apos;ve been up to</h2>

      <div className="mt-5 flex items-center gap-3 text-sm">
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
        {filtered.map((item) => (
          // Each row fades in on its own as it enters the viewport, so no
          // per-index delay: that made rows further down the list lag.
          <motion.div
            key={`${item.org}-${item.role}`}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -40px 0px" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
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
                  <p className="mt-2 max-w-3xl text-sm leading-[21px] text-ink">
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
