"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "./SectionHeading";

// Opening section of the About page: the "why" behind the work. It names
// no companies, titles, or metrics on purpose; the landing page and the
// Experience section right below already carry those.
export function About() {
  return (
    <section id="about" className="px-6 pb-14 pt-20 md:px-10 md:pb-20 md:pt-28">
      <SectionHeading kicker="About" title="Product, with a reason to build it." />

      <div className="mt-12 grid gap-10 md:grid-cols-[auto_1fr] md:items-start">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="group aspect-[4/5] w-full max-w-[280px] justify-self-center overflow-hidden rounded-[5px] md:w-72 md:justify-self-start"
        >
          <img
            src="/images/mel_profile.webp"
            alt="Suyoung Mel Kwon"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="space-y-5 text-lg leading-relaxed text-ink-muted"
        >
          <p>
            I grew up in a family that lives with autism. It taught me to pay attention to
            people&apos;s pain points, to think from the perspective of underserved communities,
            and to care about work that creates positive social impact.
          </p>
          <p>
            In particular, I aim to fix the root of a problem rather than its surface, in a way
            that can sustain itself and reach people at scale.
          </p>
          <p>
            I&apos;ve worked across UX design, AI and data, and product management, and I bring
            all three to every problem I take on.
          </p>
          <p>
            Problems like these are rarely solved alone, which is why I love bringing talented
            people together on cross-functional teams toward a shared goal.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
