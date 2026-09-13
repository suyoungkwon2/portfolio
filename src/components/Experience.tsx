"use client";

import { motion } from "framer-motion";
import { experience } from "@/content/experience";
import { SectionHeading } from "./SectionHeading";

export function Experience() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-28 md:px-10 md:py-40">
      <SectionHeading kicker="Experience" title="Where I've built." />

      <div className="mt-16 flex flex-col">
        {experience.map((item, i) => (
          <motion.div
            key={item.org}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
            className="grid gap-2 border-t border-line py-8 first:border-t-0 md:grid-cols-[1fr_2fr] md:gap-8"
          >
            <div>
              <p className="font-display text-lg font-medium text-ink">{item.org}</p>
              <p className="mt-1 text-sm text-ink-muted">
                {item.period} · {item.location}
              </p>
            </div>
            <div>
              <p className="font-medium text-ink">{item.role}</p>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
