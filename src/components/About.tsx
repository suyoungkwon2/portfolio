"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "./SectionHeading";

const pillars = [
  {
    title: "Heal the World",
    body: "I'm drawn to problems where technology can genuinely improve people's lives — healthcare and education first.",
  },
  {
    title: "0 → 1 builder",
    body: "I've led products from a blank page to launch, running user research and A/B tests to prove what actually works.",
  },
  {
    title: "Business impact",
    body: "Human-centered design plus data discipline — I ship things that move real metrics, not just demos.",
  },
];

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-28 md:px-10 md:py-40">
      <SectionHeading kicker="About" title="Product, with a reason to build it." />

      <motion.p
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-muted md:text-xl"
      >
        I&apos;m a Product Manager and Human-Centered Design–trained builder who has led
        AI transformation at Kurly, an e-commerce unicorn, and 0-to-1 growth at Asleep,
        an AI sleep-tech startup. Along the way I&apos;ve worked with researchers at CMU
        and KAIST — but the throughline is the same: turn ambiguity into products that
        make a measurable difference, especially in healthcare and education.
      </motion.p>

      <div className="mt-16 grid gap-8 sm:grid-cols-3">
        {pillars.map((pillar, i) => (
          <motion.div
            key={pillar.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
            className="rounded-xl border border-line bg-paper-2/60 p-6"
          >
            <h3 className="font-display text-lg font-medium text-ink">{pillar.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">{pillar.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
