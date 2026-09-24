"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { WorkItem } from "@/content/works";

// Placeholder thumbnail tint per sector, until real case-study screenshots
// replace it — kept as a soft (not saturated) tint to match the image-
// forward, chrome-free card this is modeled on (tushar.work's Selected
// Work grid: plain thumbnail + text below, no card border or background).
const sectorAccent: Record<WorkItem["sector"], string> = {
  "AI Research": "from-accent-soft via-accent-soft/40 to-transparent",
  "Projects": "from-accent-2-soft via-accent-2-soft/40 to-transparent",
};

export function WorkCard({ work, index }: { work: WorkItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: (index % 2) * 0.08, ease: "easeOut" }}
    >
      <Link href={`/work/${work.slug}`} className="group block">
        <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-ink">
          <div
            className={`h-full w-full bg-gradient-to-br ${sectorAccent[work.sector]} transition-transform duration-[800ms] ease-[cubic-bezier(0.25,0.1,0,1)] group-hover:scale-[1.03]`}
          />
        </div>

        {/* Title and headline result only; the case study page has the rest. */}
        <div className="mt-4 flex flex-col gap-1">
          <h3 className="font-display text-xl font-medium text-ink">{work.title}</h3>
          {work.metrics && <p className="text-sm font-medium text-accent">{work.metrics}</p>}
        </div>
      </Link>
    </motion.div>
  );
}
