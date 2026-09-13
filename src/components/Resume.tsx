"use client";

import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { site } from "@/content/site";
import { SectionHeading } from "./SectionHeading";

export function Resume() {
  return (
    <section id="resume" className="mx-auto max-w-6xl px-6 py-28 md:px-10 md:py-40">
      <SectionHeading kicker="Resume" title="The one-page version." align="center" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mx-auto mt-12 flex max-w-xl flex-col items-center gap-6 rounded-3xl border border-line bg-paper-2/50 px-8 py-14 text-center"
      >
        <p className="max-w-sm text-sm leading-relaxed text-ink-muted">
          Every case study above, distilled to one page — roles, impact, and the
          skills behind them.
        </p>
        <a
          href={site.resumeHref}
          download
          className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-opacity hover:opacity-85"
        >
          <Download className="h-4 w-4" />
          Download Resume
        </a>
      </motion.div>
    </section>
  );
}
