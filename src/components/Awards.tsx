"use client";

import { motion } from "framer-motion";
import { awards } from "@/content/awards";
import { SectionHeading } from "./SectionHeading";

export function Awards() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-28 md:px-10 md:py-40">
      <SectionHeading kicker="Awards & Honors" title="Recognition along the way." />

      <div className="mt-16 flex flex-col">
        {awards.map((award, i) => (
          <motion.div
            key={`${award.title}-${award.year}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, delay: i * 0.06, ease: "easeOut" }}
            className="flex items-center justify-between gap-4 border-t border-line py-5 first:border-t-0"
          >
            <div>
              <p className="font-medium text-ink">{award.title}</p>
              <p className="text-sm text-ink-muted">{award.issuer}</p>
            </div>
            <span className="text-sm text-ink-muted">{award.year}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
