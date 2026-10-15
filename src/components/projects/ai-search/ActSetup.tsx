"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { ShoppingCart, Users } from "lucide-react";
import Link from "next/link";
import { ChipGroup } from "@/components/project/ChipGroup";
import { cn } from "@/lib/utils";
import type { AssetId } from "./assets";
import { Reveal, StickyScene, useStill } from "./motion";
import { LoopingSearch } from "./SearchSequence";
import {
  AssetMedia,
  B,
  Body,
  Chapter,
  MetricCounter,
  PhoneFrame,
  SectionHeader,
  StandInTag,
  useAsset,
  wrap,
} from "./ui";

// Act 1, Setup: Hero · 01 Context · 02 Impact · 03 R&R (spec §5.0–5.3).
// The reader learns what was achieved before learning how.

export const TALK_URL = "https://youtu.be/qv0YMg7kwuM?si=km0mZKGjRI3rPVdX&t=2333";

const META: [string, string][] = [
  ["Period", "May–Aug 2024"],
  ["Role", "AI Product Manager"],
  ["Team", "AI PM (me), 1 ML Engineer, 1 Backend Engineer"],
  ["Org", "Kurly"],
];

export function Hero() {
  const hasVideo = !!useAsset("hero-cabage-loop").src;
  return (
    <div className="border-b border-line">
      <div className={cn(wrap, "pb-16 pt-10 md:pb-24 md:pt-16")}>
        <Link
          href="/#work"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-accent-3"
        >
          <span aria-hidden>←</span> Selected Works
        </Link>

        <div className="mt-10 grid items-center gap-12 md:grid-cols-[1fr_auto] md:gap-16">
          <div className="order-2 flex flex-col items-start md:order-1">
            <ChipGroup
              chips={{ type: "AI Transformation", domain: "Commerce", proof: "A/B Validated" }}
            />
            <h1 className="font-display font-medium tracking-tight mt-6 text-[2.25rem] leading-[1.1] text-ink text-balance md:text-[3.25rem]">
              AI Search: Recovering Lost Revenue
            </h1>
            <p className="mt-4 text-lg italic text-ink-muted md:text-xl">
              “Just type it out. We’ll find what you need.”
            </p>
            <Body className="mt-6">
              On Kurly, one typo could end a shopping trip. I led an AI search that catches what the
              old engine missed, so every search can lead to a cart.
            </Body>

            <dl className="mt-10 grid w-full grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-6 lg:grid-cols-4">
              {META.map(([term, value]) => (
                <div key={term}>
                  <dt className="text-xs font-medium uppercase tracking-[0.15em] text-ink-muted">
                    {term}
                  </dt>
                  <dd className="font-display mt-1.5 text-sm font-medium text-ink">{value}</dd>
                </div>
              ))}
            </dl>

            <a
              href="#context"
              className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors hover:text-accent-3"
            >
              Follow one typo
              <motion.span
                aria-hidden
                animate={useStill() ? undefined : { y: [0, 4, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              >
                ↓
              </motion.span>
            </a>
          </div>

          <div className="order-1 flex justify-center md:order-2">
            <PhoneFrame>
              <AssetMedia
                id="hero-cabage-loop"
                priority
                fallback={<LoopingSearch query="cabage" emoji="🥬" />}
              />
              {!hasVideo && <StandInTag id="hero-cabage-loop" className="bottom-3 left-3" />}
            </PhoneFrame>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 01 Context                                                          */
/* ------------------------------------------------------------------ */

// Everyday grocery examples, not real query data (spec §5.1).
const CHIPS = ["milk", "strawberries", "salmon", "eggs", "tofu", "avocado"];
const CHIP_X = [-150, 120, -90, 160, -170, 80];

const chipWindow = (i: number) => {
  const start = 0.04 + i * 0.11;
  return [start, start + 0.17] as const;
};

function FallingChip({
  progress,
  i,
  label,
}: {
  progress: MotionValue<number>;
  i: number;
  label: string;
}) {
  const [s, e] = chipWindow(i);
  const y = useTransform(progress, [s, e], [-210, 0]);
  const x = useTransform(progress, [s, e], [CHIP_X[i], 0]);
  const opacity = useTransform(progress, [s - 0.03, s, e - 0.03, e], [0, 1, 1, 0]);
  const scale = useTransform(progress, [e - 0.05, e], [1, 0.6]);
  return (
    <motion.span
      aria-hidden
      style={{ x, y, opacity, scale }}
      className="absolute left-1/2 top-1/2 -ml-10 w-20 rounded-full bg-ink py-1.5 text-center text-xs font-medium text-paper"
    >
      {label}
    </motion.span>
  );
}

// The one that doesn't make it: falls, hits the bar, bounces off grey.
function BouncedChip({ progress }: { progress: MotionValue<number> }) {
  const [s, e] = chipWindow(CHIPS.length);
  const end = Math.min(e + 0.1, 1);
  const y = useTransform(progress, [s, e, end], [-210, -6, 92]);
  const x = useTransform(progress, [s, e, end], [40, 0, 150]);
  const rotate = useTransform(progress, [e, end], [0, 18]);
  const opacity = useTransform(progress, [s - 0.03, s], [0, 1]);
  const backgroundColor = useTransform(progress, [e - 0.01, e + 0.02], ["#151515", "#dcdcdc"]);
  const color = useTransform(progress, [e - 0.01, e + 0.02], ["#ffffff", "#4a4a4a"]);
  return (
    <motion.span
      style={{ x, y, rotate, opacity, backgroundColor, color }}
      className="absolute left-1/2 top-1/2 -ml-10 w-20 rounded-full py-1.5 text-center text-xs font-medium"
    >
      cabage
    </motion.span>
  );
}

function CartTick({ progress, i }: { progress: MotionValue<number>; i: number }) {
  const [, e] = chipWindow(i);
  const opacity = useTransform(progress, [e - 0.02, e + 0.02], [0, 1]);
  const scale = useTransform(progress, [e - 0.02, e + 0.03], [0.4, 1]);
  return (
    <motion.span
      style={{ opacity, scale }}
      className="grid size-8 place-items-center rounded-full bg-accent text-paper"
    >
      <ShoppingCart aria-hidden className="size-3.5" />
    </motion.span>
  );
}

function SearchRain({ progress }: { progress: MotionValue<number> }) {
  return (
    <div
      role="img"
      aria-label="Grocery searches drop into the search bar and turn into carts. The last one, “cabage”, bounces off."
      className="relative mx-auto h-[380px] w-full max-w-[440px]"
    >
      {CHIPS.map((label, i) => (
        <FallingChip key={label} progress={progress} i={i} label={label} />
      ))}
      <BouncedChip progress={progress} />
      <div className="absolute left-1/2 top-1/2 mt-5 flex w-[280px] -translate-x-1/2 items-center gap-2 rounded-full border border-ink/15 bg-paper px-4 py-3 shadow-sm">
        <svg aria-hidden viewBox="0 0 16 16" className="size-4 text-ink-muted">
          <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <span className="text-sm text-ink-muted">Search</span>
      </div>
      <div className="absolute left-1/2 top-1/2 mt-24 flex -translate-x-1/2 gap-2">
        {CHIPS.map((label, i) => (
          <CartTick key={label} progress={progress} i={i} />
        ))}
      </div>
    </div>
  );
}

export function Context() {
  return (
    <Chapter id="context" label="01 Context">
      <StickyScene steps={3} label="Searches flowing into the search bar">
        {({ progress }) => (
          <div className={cn(wrap, "grid items-center gap-10 md:grid-cols-[1fr_1.1fr]")}>
            <div className="flex flex-col gap-6">
              <SectionHeader
                label="01 CONTEXT"
                headline="Search Was Kurly’s Biggest Sales Channel"
              />
              <Body>
                Kurly is Korea’s dawn-delivery unicorn with <B>3.5M monthly users</B>. For them, the
                search bar is the front door: it drives more revenue than any other part of the app.
              </Body>
            </div>
            <SearchRain progress={progress} />
          </div>
        )}
      </StickyScene>
    </Chapter>
  );
}

/* ------------------------------------------------------------------ */
/* 02 Impact                                                           */
/* ------------------------------------------------------------------ */

export function Impact() {
  return (
    <Chapter id="impact" label="02 Impact" className="py-24 md:py-32">
      <div className={wrap}>
        <SectionHeader label="02 IMPACT" headline="From Dead Ends to Discoveries" />

        <div className="mt-14 grid gap-10 border-t border-line pt-10 md:grid-cols-3 md:gap-8">
          <Reveal>
            <MetricCounter
              from={{ value: 6.8, decimals: 2, suffix: "%" }}
              to={{ value: 0.22, decimals: 2, suffix: "%" }}
              label="No-Result Search Rate"
            />
          </Reveal>
          <Reveal delay={0.1}>
            <MetricCounter
              from={{ value: 58.6, decimals: 2, suffix: "%" }}
              to={{ value: 60.14, decimals: 2, suffix: "%" }}
              label="Search Click-Through Rate"
            />
          </Reveal>
          <Reveal delay={0.2}>
            <MetricCounter
              to={{ value: 5, prefix: "₩", suffix: "B" }}
              extra="(~$3.6M)"
              label="New Monthly Revenue from Former Dead Ends"
            />
          </Reveal>
        </div>

        <Reveal className="mt-14">
          <a
            href={TALK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group grid overflow-hidden rounded-2xl border border-line bg-paper-2/60 transition-colors hover:border-accent md:grid-cols-[1.15fr_1fr]"
          >
            <div className="relative aspect-video bg-line">
              <AssetMedia id="summit-stage-clip" />
            </div>
            <div className="flex flex-col justify-center gap-4 p-6 md:p-10">
              <h3 className="font-display font-medium tracking-tight text-[1.4rem] leading-tight text-ink md:text-[1.75rem]">
                Featured at Google Cloud Summit Seoul 2024
              </h3>
              <p className="text-base leading-relaxed text-ink-muted">
                Google selected this project as a leading enterprise case of AI innovation on GCP. I
                presented it on stage.
              </p>
              <span className="text-sm font-medium text-ink underline decoration-line underline-offset-4 transition-colors group-hover:text-accent-3 group-hover:decoration-accent-3">
                Watch the talk →
              </span>
            </div>
          </a>
        </Reveal>

        <p className="mt-8 text-sm text-ink-muted">Live in production 2 months after the PoC.</p>
      </div>
    </Chapter>
  );
}

/* ------------------------------------------------------------------ */
/* 03 R&R                                                              */
/* ------------------------------------------------------------------ */

type Role = { title: string; thumb?: AssetId; body: React.ReactNode; pop?: boolean };

const ROLES: Role[] = [
  {
    title: "Strategy",
    thumb: "arch-thumb",
    body: (
      <>
        Defined the problem and set the project scope. Proposed a simple rule:{" "}
        <B>AI steps in only when the old search finds nothing</B>, so we could ship without touching
        what already worked. Pitched the plan to the CEO and won approval for the rollout.
      </>
    ),
  },
  {
    title: "Execution",
    thumb: "dashboard-thumb",
    body: (
      <>
        Designed the system architecture with the engineers, built a demo page to choose the right
        data source, wrote the data schema, designed the A/B test and KPIs, designed and built the
        monitoring dashboard, and led QA through launch.
      </>
    ),
  },
  {
    title: "UX",
    thumb: "beta-label-ui",
    pop: true,
    body: (
      <>
        Designed the <B>“Beta” notice</B> that tells shoppers which results come from AI, so a new
        kind of result felt honest, not confusing.
      </>
    ),
  },
  {
    title: "Alignment",
    body: (
      <>
        Kept the CEO, search engineering, merchandising and marketing teams, and Google Cloud on the
        same page.
      </>
    ),
  },
];

function RoleThumb({ role }: { role: Role }) {
  const still = useStill();
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-paper-2">
      {role.thumb ? (
        <AssetMedia id={role.thumb} />
      ) : (
        <div className="grid h-full place-items-center">
          <Users aria-hidden strokeWidth={1.25} className="size-14 text-ink-muted" />
        </div>
      )}
      {/* beta-label-ui: the Beta label "pops" onto the results screen. */}
      {role.pop && (
        <motion.span
          aria-hidden
          initial={still ? false : { scale: 0, rotate: -12 }}
          whileInView={{ scale: 1, rotate: -6 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ type: "spring", stiffness: 420, damping: 14, delay: 0.5 }}
          className="absolute right-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-paper shadow-lg"
        >
          Beta
        </motion.span>
      )}
    </div>
  );
}

export function Roles() {
  return (
    <Chapter id="roles" label="03 R&R" className="border-t border-line py-24 md:py-32">
      <div className={wrap}>
        <SectionHeader label="03 R&R" headline="A Three-Person Team, a Company-Wide Change" />
        <ul className="mt-14 grid gap-x-8 gap-y-12 md:grid-cols-2">
          {ROLES.map((role, i) => (
            <Reveal as="li" key={role.title} delay={(i % 2) * 0.12} className="flex flex-col gap-5">
              <RoleThumb role={role} />
              <div className="flex flex-col gap-2">
                <h3 className="font-display text-lg font-medium text-ink">{role.title}</h3>
                <p className="text-[15px] leading-relaxed text-ink-muted">{role.body}</p>
              </div>
            </Reveal>
          ))}
        </ul>
        <p className="mt-14 text-sm font-medium text-ink-muted">
          AI PM (me) · 1 ML Engineer · 1 Backend Engineer
        </p>
      </div>
    </Chapter>
  );
}
