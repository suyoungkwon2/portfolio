"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { pageTitleClass } from "./PageTitle";

// One point each for business, impact, scale, and AI depth, each tagged with
// its field. Keep these in sync with src/content/works.ts. In `value`,
// {braces} mark a unit or symbol that renders smaller. "3.5M‑MAU" and
// "co‑first" use non-breaking hyphens (U+2011) so they never split across
// lines.
const proofPoints = [
  { field: "B2B AI SaaS", value: "$60K+ {MRR}", label: "A sleep-tech startup's first B2B revenue line, built 0 → 1" },
  { field: "Digital Health", value: "K-FDA {Approved}", label: "Clinical trial for an insomnia digital therapeutic" },
  { field: "AI Search", value: "6.8{%} → 0.22{%}", label: "No-result searches on a 3.5M‑MAU grocery platform" },
  { field: "AI Research", value: "EMNLP 2025", label: "Main Conference paper, co‑first author" },
];

// The hats behind the work, in order, each with its picture.
const roles = [
  { title: "Product Manager", src: "/images/img_hero_2productmanager.jpg" },
  { title: "UX Designer", src: "/images/img_hero_3UXdesigner.jpg" },
  { title: "HCI Researcher", src: "/images/img_hero_4HCIresearcher.jpg" },
  { title: "Master @ CMU", src: "/images/img_hero_5mastercmu.jpg" },
];

// How long each role shows before the next one.
const ROLE_MS = 1600;

function StatValue({ value }: { value: string }) {
  return value.split(/\{(.*?)\}/).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="ml-0.5 text-[0.55em] font-medium tracking-normal">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

// Which role is showing: moves to the next every ROLE_MS and loops back to
// the first after the last.
function useRoleCycle() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % roles.length), ROLE_MS);
    return () => clearInterval(id);
  }, []);

  return step;
}

// The pictures stack in one frame and crossfade as the role changes.
function RoleMedia({ step, className }: { step: number; className?: string }) {
  return (
    <div className={cn("relative aspect-[512/300] overflow-hidden bg-paper-2 lg:aspect-auto", className)}>
      {roles.map((role, i) => {
        const active = i === step;
        const layer = cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out",
          active ? "opacity-100" : "opacity-0",
        );
        return (
          <Image
            key={role.src}
            src={role.src}
            alt=""
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className={layer}
          />
        );
      })}
    </div>
  );
}

export function Hero() {
  const step = useRoleCycle();
  const reduceMotion = useReducedMotion();
  const offset = reduceMotion ? "0em" : "0.35em";

  return (
    <section id="hero" className="flex flex-col px-6 pb-10 pt-12 md:px-10 md:pt-16">
      {/* From lg up the layout runs on the --u and --f units (app/layout.tsx):
          on narrower screens the text shrinks less and the picture gives up
          more of its width instead. The text column is sized in --f, so it always
          wraps the same way; the picture takes the rest of the row (up to
          about 1.8:1) and stretches to the text's height. */}
      <div className="flex flex-col gap-10 lg:flex-row lg:justify-between lg:gap-[calc(var(--u)*5.5)]">
        <div className="min-w-0 lg:w-[calc(var(--f)*60)] lg:shrink-0">
          <h1 className={pageTitleClass}>
            I’m Mel,
            <span className="sr-only">
              {" "}
              {roles.map((r) => r.title).join(", ")}
            </span>
            <span aria-hidden className="block h-[1.3em]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={roles[step].title}
                  initial={{ opacity: 0, y: offset }}
                  animate={{ opacity: 1, y: "0em" }}
                  exit={{ opacity: 0, y: `-${offset}` }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="block whitespace-nowrap"
                >
                  {roles[step].title}
                </motion.span>
              </AnimatePresence>
            </span>
          </h1>
          <p className="font-manrope mt-6 max-w-[24em] text-[22px] font-medium leading-[1.35] tracking-[-0.02em] text-ink md:text-[28px] lg:mt-[calc(var(--f)*2)] lg:max-w-none lg:text-[calc(var(--f)*2.5)]">
            I design &amp; ship B2C/B2B/AI products for startups and tech companies toward
            positive social impact
          </p>
        </div>
        <RoleMedia step={step} className="w-full lg:w-auto lg:min-w-0 lg:max-w-[calc(var(--f)*38)] lg:flex-1" />
      </div>

      {/* Numbered columns split by hairlines from xl up; two columns
          with no rules below that (four don't fit beside the sidebar). */}
      <div className="mt-14 grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-4 xl:gap-0">
        {proofPoints.map((p, i) => (
          <div key={p.value} className={cn("xl:px-6", i === 0 ? "xl:pl-0" : "xl:border-l xl:border-ink/15")}>
            <p className="flex items-baseline gap-2 text-[13px] text-ink">
              <span className="font-manrope text-[11px] font-medium tabular-nums text-ink-muted">
                {String(i + 1).padStart(2, "0")}
              </span>
              {p.field}
            </p>
            <p className="font-manrope mt-5 whitespace-nowrap text-[26px] font-semibold leading-none tracking-[-0.03em] text-ink md:text-[30px]">
              <StatValue value={p.value} />
            </p>
            <p className="mt-3 max-w-[30ch] text-sm leading-relaxed text-ink-muted">{p.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
