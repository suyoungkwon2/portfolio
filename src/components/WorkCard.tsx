"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { WorkItem } from "@/content/works";

// Placeholder thumbnail tint per sector, until real case-study screenshots
// replace it — kept as a soft (not saturated) tint to match the image-
// forward, chrome-free card this is modeled on (tushar.work's Selected
// Work grid: plain thumbnail + text below, no card border or background).
const sectorAccent: Record<WorkItem["sector"], string> = {
  "Healthcare / Education": "from-accent-soft via-accent-soft/40 to-transparent",
  "AI / Business": "from-accent-2-soft via-accent-2-soft/40 to-transparent",
};

export function WorkCard({ work, index }: { work: WorkItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08, ease: "easeOut" }}
    >
      <Link href={`/work/${work.slug}`} className="group block">
        <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-ink">
          <div
            className={`h-full w-full bg-gradient-to-br ${sectorAccent[work.sector]} transition-transform duration-[800ms] ease-[cubic-bezier(0.25,0.1,0,1)] group-hover:scale-[1.03]`}
          />
        </div>

        <div className="mt-4 flex flex-col gap-1">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-ink-muted">
            {work.tag} · {work.year}
          </p>
          <h3 className="font-display text-xl font-medium text-ink">{work.title}</h3>
          <p className="text-sm leading-relaxed text-ink-muted">{work.summary}</p>
          {work.metrics && <p className="mt-1 text-sm font-medium text-accent">{work.metrics}</p>}
        </div>
      </Link>
    </motion.div>
  );
}
