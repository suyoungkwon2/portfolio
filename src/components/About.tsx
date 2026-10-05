"use client";

import { motion } from "framer-motion";
import { PageTitle, sectionTitleClass } from "./PageTitle";

// Opening section of the About page: the "why" behind the work, with the
// portrait on the right. It names no companies, titles, or metrics on
// purpose; the landing page and the Experience section below carry those.
export function About() {
  return (
    <section id="about" className="px-6 pb-14 pt-12 md:px-10 md:pb-20 md:pt-16">
      <PageTitle>About</PageTitle>

      <div className="mt-12 grid gap-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-16 lg:gap-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="min-w-0 max-w-[700px]"
        >
          <h2 className={sectionTitleClass}>Product, with a reason to build it</h2>
          <div className="mt-5 space-y-[21px] text-sm leading-[21px] text-ink">
            <p>I&apos;m Mel. Product manager/designer from Korea, based in Pittsburgh.</p>
            <p>
              I grew up in a family that lives with autism. It taught me early to notice the pain
              points people learn to live with, especially in communities that products tend to
              overlook, and to care about work that creates real social impact.
            </p>
            <p>
              To me, impact means fixing the root of a problem rather than its surface, in a way that
              can sustain itself and reach people at scale. That kind of work is rarely done alone,
              which is why I love bringing talented people together on cross-functional teams toward
              a shared goal.
            </p>
            <p>
              I work across UX design, AI and data, and product management, and I&apos;m always open
              to new experiences, new things to learn, and new people to meet.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="group aspect-[4/5] w-full max-w-[280px] order-first justify-self-center overflow-hidden rounded-[5px] md:order-none md:w-72 md:justify-self-end"
        >
          <img
            src="/images/mel_profile.webp"
            alt="Suyoung Mel Kwon"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </motion.div>
      </div>
    </section>
  );
}
