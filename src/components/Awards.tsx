"use client";

import { motion } from "framer-motion";
import { awards } from "@/content/awards";
import { sectionTitleClass } from "./PageTitle";

export function Awards() {
  return (
    <section className="px-6 py-14 md:px-10 md:py-20">
      <h2 className={sectionTitleClass}>Recognition along the way</h2>

      <div className="mt-5 flex flex-col">
        {awards.map((award) => (
          <motion.div
            key={`${award.title}-${award.year}`}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -40px 0px" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
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
