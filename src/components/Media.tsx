"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { media } from "@/content/media";
import { SectionHeading } from "./SectionHeading";

// Thumbnail cards, styled like WorkCard, so video and press appearances
// read as visual proof rather than a list of text links.
export function Media() {
  return (
    <section id="media" className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
      <SectionHeading kicker="In the Media" title="Where the work was featured." />

      <div className="mt-16 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {media.map((item, i) => (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: "easeOut" }}
          >
            <a href={item.href} target="_blank" rel="noopener noreferrer" className="group block">
              <div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-ink">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.25,0.1,0,1)] group-hover:scale-[1.03]"
                />
              </div>

              <div className="mt-4 flex flex-col gap-1">
                <p className="flex justify-between text-xs font-medium uppercase tracking-[0.15em] text-ink-muted">
                  <span>{item.kind === "video" ? "Video" : "News"}</span>
                  <span>{item.date}</span>
                </p>
                <h3 className="font-display text-xl font-medium text-ink transition-colors group-hover:text-accent-3">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-ink-muted">{item.caption}</p>
              </div>
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
