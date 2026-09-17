"use client";

import { motion } from "framer-motion";
import { publications } from "@/content/publications";
import { SectionHeading } from "./SectionHeading";

export function Publication() {
  return (
    <section id="publication" className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
      <SectionHeading kicker="Publication" title="What I've published." />

      <div className="mt-16 grid gap-6 sm:grid-cols-2">
        {publications.map((item, i) => (
          <motion.a
            key={item.title}
            href={item.link}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
            className="block rounded-xl border border-line bg-paper-2/50 p-6 transition-colors hover:border-accent-2"
          >
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent-2">
              {item.venue} · {item.year}
            </p>
            <h3 className="font-display mt-3 text-lg font-medium text-ink">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">{item.description}</p>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
