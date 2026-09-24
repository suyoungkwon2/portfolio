"use client";

import { useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { HeroBackground } from "./hero-bg/HeroBackground";

// One point each for business, impact, scale, and AI depth. Every one is
// backed by a case study on the site; keep these in sync with
// src/content/works.ts.
const proofPoints = [
  { value: "$60K+", unit: "MRR", label: "A sleep-tech startup's first B2B revenue line, built 0 → 1" },
  { value: "K-FDA", unit: "approved", label: "Clinical trial for an insomnia digital therapeutic" },
  { value: "6.8% → 0.22%", unit: "", label: "No-result searches on a 3.5M-MAU grocery platform" },
  // "co‑first" uses a non-breaking hyphen (U+2011) so it never splits across lines.
  { value: "AI research", unit: "", label: "Published at EMNLP 2025 Main Conference, co‑first author" },
];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  // The background stops animating once the hero has scrolled off screen.
  const [isPastHero, setIsPastHero] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setIsPastHero(v >= 1);
  });

  return (
    <section ref={sectionRef} id="hero" className="relative isolate bg-paper">
      <HeroBackground paused={isPastHero} className="absolute inset-0 -z-10" />
      {/* Fades the background into the page color at the bottom, so the
          hero blends into the next section instead of ending on a hard
          edge. */}
      <div className="absolute inset-x-0 bottom-0 -z-10 h-[30vh] bg-gradient-to-b from-transparent to-paper" />

      {/* Editorial layout on the same max-w-6xl grid as the sections below:
          a left-aligned headline, full-width subcopy, and
          the proof points set as type on a hairline rather than as cards.
          The two italic phrases are the two halves of the thesis (the user
          side and the business side). */}
      <div className="mx-auto flex min-h-svh max-w-6xl flex-col justify-center px-6 pb-20 pt-[calc(63px+5rem)] md:px-10">
        <h1 className="font-instrument text-[40px] font-normal leading-[1.05] tracking-[-0.01em] text-ink md:text-[70px]">
          I’m Mel.{" "}
          <br />
          I find <em>what people need</em>,{" "}
          <br />
          then make it work as <em>a business</em>.
        </h1>

        <p className="mt-10 text-base leading-relaxed text-ink-muted">
          Product Manager across AI, B2B SaaS, and digital health.{" "}
          {/* Desktop only; phones wrap naturally. */}
          <br className="hidden md:inline" />
          I lead cross-functional teams from user research to launch, toward products
          with lasting social impact.
        </p>

        <div className="mt-16 grid border-t border-ink/20 sm:grid-cols-2 lg:grid-cols-4">
          {proofPoints.map((p) => (
            <div key={p.value} className="border-b border-ink/10 py-5 sm:pr-8 lg:border-b-0">
              <p className="font-instrument text-[32px] leading-none text-ink md:text-[36px]">
                {p.value}
                {p.unit && <span className="ml-2 text-[0.65em] italic text-ink-muted">{p.unit}</span>}
              </p>
              <p className="mt-3 max-w-[30ch] text-sm leading-relaxed text-ink-muted">{p.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
