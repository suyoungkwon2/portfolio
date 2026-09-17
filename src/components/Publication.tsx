"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Fragment } from "react";
import { publications, type PublicationAuthor } from "@/content/publications";
import { SectionHeading } from "./SectionHeading";

function renderAuthors(authors: PublicationAuthor[]) {
  return authors.map((author, i) => (
    <Fragment key={author.name}>
      {author.name === "Su Young Kwon" ? (
        <span className="font-medium text-ink">{author.name}</span>
      ) : (
        author.name
      )}
      {author.equalContribution ? "*" : ""}
      {i < authors.length - 1 ? ", " : ""}
    </Fragment>
  ));
}

const hasEqualContribution = publications.some((item) =>
  item.authors.some((author) => author.equalContribution),
);

export function Publication() {
  return (
    <section id="publication" className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
      <SectionHeading kicker="Publication" title="What I've published." />

      <div className="mt-10 flex flex-col">
        {publications.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
            className="grid gap-4 border-t border-line py-6 first:border-t-0 md:grid-cols-[320px_1fr] md:items-start md:gap-6"
          >
            <a
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className="block w-full shrink-0 overflow-hidden rounded-xl bg-paper-2"
              style={{ aspectRatio: `${item.imageWidth} / ${item.imageHeight}` }}
            >
              <Image
                src={item.image}
                alt={item.title}
                width={item.imageWidth}
                height={item.imageHeight}
                className="h-full w-full object-cover"
              />
            </a>
            <div className="md:max-w-[80%]">
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-ink-muted">
                {item.venue} · {item.date}
              </p>
              <h3 className="font-display mt-1 text-xl font-medium">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-ink no-underline transition-colors hover:text-accent-3"
                >
                  {item.title}
                </a>
              </h3>
              <p className="mt-2 text-sm text-ink-muted">{renderAuthors(item.authors)}</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-ink-muted">
                <li>
                  <span className="font-medium text-ink">Summary:</span> {item.summary}
                </li>
                <li>
                  <span className="font-medium text-ink">Role:</span> {item.role}
                </li>
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

      {hasEqualContribution && <p className="mt-4 text-xs text-ink-muted">* Equal contribution</p>}
    </section>
  );
}
