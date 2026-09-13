"use client";

import { motion } from "framer-motion";
import { research } from "@/content/research";
import { SectionHeading } from "./SectionHeading";

export function Research() {
  return (
    <section id="research" className="mx-auto max-w-6xl px-6 py-28 md:px-10 md:py-40">
      <SectionHeading kicker="Research" title="Where I've studied the questions." />

      <div className="mt-16 grid gap-6 sm:grid-cols-2">
        {research.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
            className="rounded-2xl border border-line bg-paper-2/50 p-6"
          >
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent-2">
              {item.period}
            </p>
            <h3 className="font-display mt-3 text-lg font-medium text-ink">{item.title}</h3>
            <p className="mt-1 text-sm text-ink-muted">{item.affiliation}</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
