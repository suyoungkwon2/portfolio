"use client";

import { motion } from "framer-motion";
import { site } from "@/content/site";

const links = [
  { label: "Resume", href: site.resumeHref },
  { label: "LinkedIn", href: site.linkedinHref },
  { label: "Email", href: `mailto:${site.email}` },
  { label: "GitHub", href: site.githubHref },
];

export function Resume() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
      <span className="text-xs font-medium uppercase tracking-[0.25em] text-accent">Contact</span>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3"
      >
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-medium text-ink no-underline transition-colors hover:text-accent-3"
          >
            {link.label}
          </a>
        ))}
      </motion.div>
    </section>
  );
}
