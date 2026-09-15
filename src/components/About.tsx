"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "./SectionHeading";

const proofPoints = [
  { value: "174x Revenue Lift", label: "AI Search @ E-Commerce Unicorn" },
  { value: "Seed to Series B", label: "0-to-1 Build @ Sleep-tech Startup" },
  { value: "KFDA Clinical Trial Approved", label: "For Insomnia DTx @ Sleep-tech Startup" },
  { value: "150K+ Downloads", label: "2-Week MVP Launch @ INFACTO" },
  { value: "EMNLP Publication", label: "NLP & Language Learning Research @ PhoniTale" },
];

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-28 md:px-10 md:py-40">
      <SectionHeading kicker="About" title="Product, with a reason to build it." />

      <div className="mt-8 grid gap-8 md:grid-cols-[auto_1fr] md:items-stretch">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="group aspect-square w-full max-w-[280px] justify-self-center overflow-hidden rounded-[5px] md:aspect-auto md:h-full md:w-72 md:justify-self-start"
        >
          <img
            src="/images/mel_profile.jpg"
            alt="Suyoung Mel Kwon"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </motion.div>

        <div className="flex flex-col gap-3">
          {proofPoints.map((point, i) => (
            <motion.div
              key={point.value}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
              className="flex flex-row items-baseline justify-between gap-4 rounded-xl border border-line bg-paper-2/60 px-6 py-3.5"
            >
              <p className="font-display text-lg font-medium leading-snug text-accent">
                {point.value}
              </p>
              <p className="text-right text-xs leading-relaxed text-ink-muted">
                {point.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mt-16 space-y-4 text-lg leading-relaxed text-ink-muted md:text-xl"
      >
        <p>
          I&apos;m a Product Manager with 4+ years building at the intersection of UX,
          data, and business strategy — leading AI transformation at Kurly, an
          e-commerce unicorn, and 0-to-1 product launches at Asleep, an AI healthcare
          startup. That range is sharpened by a Master of Information Management (Data
          Science minor) from KAIST and an M.Des in Interaction Design (HCI) at
          Carnegie Mellon.
        </p>
        <p>
          But the throughline hasn&apos;t changed: turning empathy into products that
          make a measurable difference — especially in healthcare, and increasingly in
          education.
        </p>
      </motion.div>
    </section>
  );
}
