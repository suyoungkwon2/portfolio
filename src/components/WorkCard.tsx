"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { WorkItem } from "@/content/works";

const sectorAccent: Record<WorkItem["sector"], string> = {
  "Healthcare / Education": "from-accent/25 via-accent/10 to-transparent",
  "AI / Business": "from-accent-2/25 via-accent-2/10 to-transparent",
};

// Tag pill picks up the sector's own point color instead of a neutral
// gray badge, so the color-coding started by the card's gradient carries
// through consistently.
const sectorTag: Record<WorkItem["sector"], string> = {
  "Healthcare / Education": "bg-accent-soft/70 text-accent",
  "AI / Business": "bg-accent-2-soft/60 text-accent-2",
};

export function WorkCard({ work, index }: { work: WorkItem; index: number }) {
  return (
    <motion.a
      href={`#work-${work.slug}`}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08, ease: "easeOut" }}
      whileHover={{ y: -6 }}
      className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-paper-2/50 transition-shadow hover:shadow-xl hover:shadow-ink/5"
    >
      <div
        className={`relative flex h-44 items-end bg-gradient-to-br ${sectorAccent[work.sector]} p-5`}
      >
        <span
          className={`rounded-full border border-ink/10 px-3 py-1 text-xs font-medium backdrop-blur ${sectorTag[work.sector]}`}
        >
          {work.tag}
        </span>
        <ArrowUpRight className="absolute right-5 top-5 h-5 w-5 text-ink/30 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-3" />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-6">
        <div className="flex items-center justify-between text-xs text-ink-muted">
          <span>{work.sector}</span>
          <span>{work.year}</span>
        </div>
        <h3 className="font-display text-xl font-medium text-ink">{work.title}</h3>
        <p className="text-sm leading-relaxed text-ink-muted">{work.summary}</p>
        {work.metrics && (
          <p className="mt-auto pt-3 text-sm font-medium text-accent">{work.metrics}</p>
        )}
      </div>
    </motion.a>
  );
}
