"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { Fragment } from "react";
import { publications, type PublicationAuthor, type PublicationCategory } from "@/content/publications";
import { linkClass } from "./ContactLinks";
import { sectionTitleClass } from "./PageTitle";

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

const linkLabel: Record<PublicationCategory, string> = {
  paper: "Read paper",
  patent: "Check patent",
};

const hasEqualContribution = publications.some((item) =>
  item.authors.some((author) => author.equalContribution),
);

export function Publication() {
  return (
    <section id="publication" className="scroll-mt-14 px-6 py-14 md:px-10 md:py-20 lg:scroll-mt-0">
      <h2 className={sectionTitleClass}>What I&apos;ve published</h2>

      <div className="mt-5 flex flex-col">
        {publications.map((item) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -40px 0px" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="grid gap-4 border-t border-line py-6 first:border-t-0 md:grid-cols-[320px_1fr] md:items-start md:gap-6"
          >
            <div
              className="w-full shrink-0 overflow-hidden rounded-md bg-paper-2"
              style={{ aspectRatio: `${item.imageWidth} / ${item.imageHeight}` }}
            >
              <Image
                src={item.image}
                alt={item.title}
                width={item.imageWidth}
                height={item.imageHeight}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="md:max-w-[80%]">
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-ink-muted">
                {item.venue} · {item.date}
              </p>
              <h3 className="font-display mt-1 text-xl font-medium text-ink">{item.title}</h3>
              <p className="mt-2 text-sm text-ink-muted">{renderAuthors(item.authors)}</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-[21px] text-ink">
                <li>
                  <span className="font-medium text-ink">Summary:</span> {item.summary}
                </li>
                <li>
                  <span className="font-medium text-ink">Role:</span> {item.role}
                </li>
              </ul>
              <div className="mt-4">
                <a href={item.link} target="_blank" rel="noreferrer" className={linkClass}>
                  {linkLabel[item.category]}
                  <ArrowUpRight aria-hidden className="size-3.5" />
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {hasEqualContribution && <p className="mt-4 text-xs text-ink-muted">* Equal contribution</p>}
    </section>
  );
}
