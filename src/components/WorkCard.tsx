"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/content/projects";
import type { WorkItem } from "@/content/works";
import { ChipGroup } from "./project/ChipGroup";
import { GradientBackdrop } from "./GradientBackdrop";
import { InViewVideo } from "./InViewVideo";

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
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: (index % 2) * 0.08, ease: "easeOut" }}
    >
      <Link href={`/work/${work.slug}`} className="group block">
        {work.video && work.videoLayout === "full" ? (
          <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-line">
            <InViewVideo
              src={work.video}
              poster={work.videoPoster}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.25,0.1,0,1)] group-hover:scale-[1.03]"
            />
          </div>
        ) : work.video ? (
          // Same framing as the case study's hero demo block: the clip sits
          // in a rounded 440:340 window centered on a light gray panel (or
          // a shader backdrop, when the work has a gradient).
          <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-lg bg-[#E1E6E9] py-3">
            {work.gradient && (
              <GradientBackdrop colors={work.gradient} className="absolute inset-0" />
            )}
            <div className="relative aspect-[440/340] h-full overflow-hidden rounded-[7.5px] transition-transform duration-[800ms] ease-[cubic-bezier(0.25,0.1,0,1)] group-hover:scale-[1.03]">
              <InViewVideo
                src={work.video}
                className="absolute -left-[2px] top-0 h-full w-[calc(100%+4px)] max-w-none object-cover"
              />
            </div>
          </div>
        ) : work.gradient ? (
          <div className="relative aspect-[16/10] overflow-hidden rounded-lg">
            <GradientBackdrop
              colors={work.gradient}
              mesh={work.mesh}
              className="absolute inset-0"
            />
            {work.thumbnail && (
              <Image
                src={work.thumbnail}
                alt=""
                fill
                sizes="(min-width: 1152px) 524px, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.25,0.1,0,1)] group-hover:scale-[1.03]"
              />
            )}
          </div>
        ) : work.thumbnail ? (
          <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-ink">
            <Image
              src={work.thumbnail}
              alt=""
              fill
              sizes="(min-width: 1152px) 524px, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.25,0.1,0,1)] group-hover:scale-[1.03]"
            />
          </div>
        ) : (
          <div className="aspect-[16/10] overflow-hidden rounded-lg bg-ink">
            <div
              className={`h-full w-full bg-gradient-to-br ${sectorAccent[work.sector]} transition-transform duration-[800ms] ease-[cubic-bezier(0.25,0.1,0,1)] group-hover:scale-[1.03]`}
            />
          </div>
        )}

        {/* Chips, title, and headline result only; the case study page has the rest. */}
        <div className="mt-4 flex flex-col gap-1">
          <ChipGroup chips={projects[work.slug].chips} className="mb-2" />
          <h3 className="font-display text-xl font-medium text-ink">{work.title}</h3>
          {work.metrics && <p className="text-sm font-medium text-accent">{work.metrics}</p>}
        </div>
      </Link>
    </motion.div>
  );
}
