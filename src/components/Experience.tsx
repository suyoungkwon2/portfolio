"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Fragment } from "react";
import { experience } from "@/content/experience";
import { SectionHeading } from "./SectionHeading";

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

export function Experience() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
      <SectionHeading kicker="Experience" title="Where I've built." />

      <div className="mt-16 flex flex-col">
        {experience.map((item, i) => (
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
                    className="font-display text-lg font-medium text-ink no-underline transition-colors hover:text-accent-2"
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
              <p className="font-medium text-ink">{item.role}</p>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-muted">
                {item.description}
              </p>
              {item.highlights && item.highlights.length > 0 && (
                <ul className="mt-2 max-w-3xl list-disc space-y-1 pl-5 text-sm leading-relaxed text-ink-muted">
                  {item.highlights.map((highlight) => (
                    <li key={highlight}>{renderHighlight(highlight)}</li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
