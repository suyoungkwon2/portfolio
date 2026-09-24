"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "./SectionHeading";

// Opening section of the About page: the "why" behind the work. The
// landing page carries the proof points; this is where the values live.
export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 pb-20 pt-36 md:px-10 md:pb-28 md:pt-44">
      <SectionHeading kicker="About" title="Product, with a reason to build it." />

      <div className="mt-12 grid gap-10 md:grid-cols-[auto_1fr] md:items-start">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="group aspect-[4/5] w-full max-w-[280px] justify-self-center overflow-hidden rounded-[5px] md:w-72 md:justify-self-start"
        >
          <img
            src="/images/mel_profile.jpg"
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
            I trained as an industrial designer, and what drew me in was a small moment: the
            point where a product quietly makes someone&apos;s day easier. My first product
            job put that to the test. At Asleep, I interviewed middle-aged and older
            insomnia patients, designed a digital therapeutic around what they could
            actually use, and took it through clinical trial approval.
          </p>
          <p>
            That work taught me the lesson I still build around: a product that helps people
            only keeps helping them if it can sustain itself. So I became the person who
            carries a product from user research to a business that works, from
            Asleep&apos;s first B2B revenue line to AI search for 3.5 million grocery
            shoppers at Kurly.
          </p>
          <p>
            &ldquo;Heal the World&rdquo; has been my quiet north star for a long time: build
            things that leave people a little better off. I&apos;m now pursuing a Master of
            Design at Carnegie Mellon, and I&apos;m most drawn to healthcare, where
            I&apos;ve built before, and education, where I want to build next.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
