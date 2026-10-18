"use client";

import { AnimatePresence, motion, useInView, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { DashedBorder } from "@/components/Dashed";
import { cn } from "@/lib/utils";
import { EASE_OUT, Reveal, StickyScene, useStill } from "../story/motion";
import { ProcessFlow } from "../story/ProcessFlow";
import {
  B,
  Body,
  Chapter,
  DataNote,
  Fold,
  Question,
  SectionHeader,
  SectionLabel,
  Subhead,
  SubHeading,
  TermList,
  wrap,
} from "../story/ui";
import { MdAvatar, RoadmapGrid9, STRATEGY, WebProductCard, type WebProduct } from "./ui";

// Act 3, Listen: 06 Employee Interview · 07 Define (spec §5.7–5.8).

/* ------------------------------------------------------------------ */
/* 06 Employee Interview: WorkflowTrack                                */
/* ------------------------------------------------------------------ */

const WORKFLOW: { step: string; pain?: string }[] = [
  { step: "Trend Search", pain: "Researching trends took a long time" },
  { step: "Concept Definition" },
  { step: "Product Discovery", pain: "Matching products to a concept by hand" },
  { step: "Product Selection", pain: "Checking sales data one by one" },
  {
    step: "Enough SKUs?",
    pain: "Not enough products → back to Concept Definition",
  },
  { step: "Campaign Proposal" },
  { step: "Campaign Approval" },
  { step: "System Registration", pain: "Ordering every product slot by hand" },
  {
    step: "Campaign Operation",
    pain: "Watching for sold-out and low-stock items",
  },
];
// The time-consuming stretch: steps 1–5.
const SLOW_UNTIL = 5;
const slow = (i: number) => i < SLOW_UNTIL;
// Steps 3, 4, 5, 8 and 9.
const AUTOMATABLE = [2, 3, 4, 7, 8];
const automatable = (i: number) => AUTOMATABLE.includes(i);
// Their outline: 1px dashes, 3px apart.
const AUTOMATION_DASH = "1 3";

// One scroll step per workflow step, then the summary, then a spare.
const TRACK_STEPS = WORKFLOW.length + 2;
const col = (i: number) => `${((i + 0.5) / WORKFLOW.length) * 100}%`;
// In view, the MD also walks on their own, a step every 0.8s.
const AUTO_S = 0.8;
// In the summary, the slow stretch shows first, then what could be automated.
const AUTOMATION_DELAY = 0.4;

// The step to show: wherever scroll has got to, or the autoplay if it's ahead.
function useAutoStep(step: number, live: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const playing = live && inView;
  const [auto, setAuto] = useState(0);
  useEffect(() => {
    if (!playing || auto >= WORKFLOW.length) return;
    const timer = setTimeout(() => setAuto((a) => a + 1), AUTO_S * 1000);
    return () => clearTimeout(timer);
  }, [playing, auto]);
  // Leaving starts it over next time.
  if (!playing && auto !== 0) setAuto(0);
  return { ref, shown: Math.max(step, auto) };
}

function WorkflowTrack({ step, live }: { step: number; live: boolean }) {
  const still = useStill();
  const { ref, shown } = useAutoStep(step, live);
  // Step i (0–8) puts the MD on workflow step i; the next one is the summary.
  const at = Math.min(shown, WORKFLOW.length - 1);
  const summary = !live || shown >= WORKFLOW.length;
  const reached = (i: number) => !live || i <= at;
  return (
    <div
      ref={ref}
      role="img"
      aria-label="The campaign workflow in nine steps: Trend Search, Concept Definition, Product Discovery, Product Selection, Enough SKUs?, Campaign Proposal, Campaign Approval, System Registration, Campaign Operation. An MD walks the steps; pain points drop at Trend Search (researching trends took a long time), Product Discovery (matching products to a concept by hand), Product Selection (checking sales data one by one), Enough SKUs? (not enough products sends them back to Concept Definition), System Registration (ordering every product slot by hand) and Campaign Operation (watching for sold-out and low-stock items). Steps 1 to 5 are the most time-consuming; steps 3, 4, 5, 8 and 9 could be automated."
      className="relative w-full"
    >
      <div aria-hidden className="relative h-14">
        {/* ⏳ Most time-consuming, its legs on circles 1 and 5 */}
        <motion.div
          initial={false}
          animate={{ opacity: summary ? 1 : 0, y: summary ? 0 : 6 }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
          className="absolute inset-y-0"
          style={{
            left: col(0),
            width: `${((SLOW_UNTIL - 1) / WORKFLOW.length) * 100}%`,
          }}
        >
          <span className="absolute inset-x-0 bottom-0 top-3 rounded-t-md border-x border-t border-slow/60" />
          <span className="absolute left-1/2 top-0 -translate-x-1/2 whitespace-nowrap bg-paper px-2 text-sm font-medium text-slow">
            ⏳ Most time-consuming
          </span>
        </motion.div>

        <motion.p
          initial={false}
          animate={{ opacity: summary ? 1 : 0 }}
          transition={{
            duration: 0.4,
            delay: summary && live ? AUTOMATION_DELAY : 0,
          }}
          className="absolute right-0 top-0 flex items-center gap-2 text-sm text-ink-muted"
        >
          <span className="relative size-3">
            <DashedBorder radius={4} dash={AUTOMATION_DASH} className="text-automatable" />
          </span>
          Automation available
        </motion.p>

        {/* The MD */}
        {live && !summary && (
          <motion.span
            initial={false}
            animate={{ left: col(at) }}
            transition={{ type: "spring", stiffness: 160, damping: 20 }}
            className="absolute bottom-1 -ml-[18px]"
          >
            <MdAvatar tone={1} className="size-9" />
          </motion.span>
        )}
      </div>

      {/* The rail */}
      <ol className="relative grid grid-cols-9">
        <span aria-hidden className="absolute inset-x-[5.5%] top-4 z-[1] h-px bg-line" />
        {WORKFLOW.map((w, i) => (
          <li key={w.step} className="relative flex flex-col items-center gap-2 px-1 text-center">
            <motion.span
              aria-hidden
              initial={false}
              animate={{ opacity: summary && automatable(i) ? 1 : 0 }}
              transition={{
                duration: 0.4,
                delay: summary && live ? AUTOMATION_DELAY + 0.06 * i : 0,
              }}
              className="absolute -inset-y-2 inset-x-0.5"
            >
              <DashedBorder radius={12} dash={AUTOMATION_DASH} className="text-automatable" />
            </motion.span>
            <span
              className={cn(
                "relative z-[2] grid size-8 place-items-center rounded-full border text-xs font-semibold transition-colors duration-300",
                summary && slow(i)
                  ? "border-slow bg-slow text-paper"
                  : reached(i)
                    ? "border-ink bg-ink text-paper"
                    : "border-line bg-paper text-ink-muted",
              )}
            >
              {i + 1}
            </span>
            <span
              className={cn(
                "relative z-[2] text-[13px] font-medium leading-tight transition-colors duration-300",
                reached(i) ? "text-ink" : "text-ink-muted/60",
              )}
            >
              {w.step}
            </span>
          </li>
        ))}
      </ol>

      {/* Pain points drop in under their step and stay. */}
      <ol aria-hidden className="mt-5 grid min-h-[7.5rem] grid-cols-9">
        {WORKFLOW.map((w, i) => (
          <li key={w.step} className="px-1">
            {w.pain && (
              <motion.p
                initial={false}
                animate={reached(i) ? { opacity: 1, y: 0 } : { opacity: 0, y: -16 }}
                transition={
                  still
                    ? { duration: 0 }
                    : {
                        type: "spring",
                        stiffness: 300,
                        damping: 18,
                        delay: 0.25,
                      }
                }
                className="rounded-lg border border-alert/25 bg-alert/[0.06] p-2 text-[12px] leading-snug text-ink"
              >
                <span aria-hidden className="block">
                  😩
                </span>
                {w.pain}
              </motion.p>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

// Phones and reduced motion: the nine steps as a list.
function WorkflowList() {
  return (
    <ol className="flex flex-col gap-2">
      {WORKFLOW.map((w, i) => (
        <li
          key={w.step}
          className={cn(
            "relative flex flex-col gap-1.5 rounded-xl border p-3",
            automatable(i) ? "border-transparent" : "border-line",
          )}
        >
          {automatable(i) && (
            <DashedBorder radius={12} dash={AUTOMATION_DASH} className="text-automatable" />
          )}
          <p className="flex items-center gap-2 text-sm font-medium text-ink">
            <span
              className={cn(
                "grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-semibold text-paper",
                slow(i) ? "bg-slow" : "bg-ink",
              )}
            >
              {i + 1}
            </span>
            {w.step}
          </p>
          {w.pain && (
            <p className="text-sm text-ink">
              <span aria-hidden className="block">
                😩
              </span>
              {w.pain}
            </p>
          )}
        </li>
      ))}
      <li className="flex gap-4 pt-1 text-xs text-ink-muted">
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded-full bg-slow" />
          Most time-consuming
        </span>
        <span className="flex items-center gap-1.5">
          <span className="relative size-3">
            <DashedBorder radius={4} dash={AUTOMATION_DASH} className="text-automatable" />
          </span>
          Automation available
        </span>
      </li>
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/* 06 Employee Interview: what an MD checks before picking a product   */
/* ------------------------------------------------------------------ */

// A product an MD might weigh for “Matcha Core: Trending Now”, as listed on
// Kurly.
const CHECKED: WebProduct = {
  src: "/images/ai-curation/products/matcha-syrup.webp",
  name: "[Madvanilla] Matcha Syrup 300g",
  price: "₩15,600",
  was: "₩18,600",
  off: "16%",
};
// From the interviews: what MDs look up before a product goes in.
// Values are made up.
const CHECKS = [
  ["Brand", "Madvanilla"],
  ["Recent sales", "1,240 a week"],
  ["Stock", "170 left"],
  ["Discount", `${CHECKED.off} off`],
  ["Final price", CHECKED.price],
  ["In another campaign?", "No"],
] as const;
// Theme fit, then the six checks, then a spare hold.
const CHECK_STEPS = 3;

function SelectionCheck({ step, live }: { step: number; live: boolean }) {
  const still = useStill();
  const open = !live || step >= 1;
  return (
    <div
      role="img"
      aria-label={`A product, ${CHECKED.name}, checked for the theme “Matcha Core: Trending Now”. It fits the theme, then six more checks appear: ${CHECKS.map(([k, v]) => `${k}: ${v}`).join(", ")}.`}
      className="grid items-start gap-8 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] md:gap-14"
    >
      <div aria-hidden className="w-full max-w-60">
        <WebProductCard product={CHECKED} />
      </div>

      <div aria-hidden className="flex w-full max-w-[30rem] flex-col gap-3">
        <dl className="flex flex-col">
          <div className="flex items-baseline justify-between gap-4 border-b border-ink pb-3">
            <dt className="text-base text-ink-muted md:text-lg">
              Fits “Matcha Core: Trending Now”?
            </dt>
            <dd className="text-base font-semibold text-ink md:text-lg">Yes ✓</dd>
          </div>
          {CHECKS.map(([term, value], i) => (
            <motion.div
              key={term}
              initial={false}
              animate={open ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={
                still || !live
                  ? { duration: 0 }
                  : {
                      duration: 0.35,
                      ease: EASE_OUT,
                      delay: open ? 0.12 * i : 0,
                    }
              }
              className="flex items-baseline justify-between gap-4 border-b border-line py-3 last:border-b-0"
            >
              <dt className="text-base text-ink-muted md:text-lg">{term}</dt>
              <dd className="text-base text-ink md:text-lg">{value}</dd>
            </motion.div>
          ))}
        </dl>
        <DataNote>Illustrative values.</DataNote>
      </div>
    </div>
  );
}

function WorkflowHeader() {
  return (
    <div className="flex flex-col gap-3">
      <SubHeading>1 · Steps AI could take over</SubHeading>
      <Body className="max-w-[48rem]">
        <span className="block">Building one campaign took nine steps.</span>
        <span className="block">
          The first five took the most time, and <B>five of the nine could be automated</B>.
        </span>
      </Body>
    </div>
  );
}

function SelectionHeader() {
  return (
    <div className="flex flex-col gap-3">
      <SubHeading>2 · What MDs check before adding a product</SubHeading>
      <Body className="max-w-[48rem]">
        <span className="block">Fitting the theme was only the first test.</span>
        <span className="block">
          MDs also checked each product’s <B>brand, recent sales, stock, discount, final price</B>,
          and whether it was already in another campaign. That data sat in separate tools, so they
          looked it up <B>one product at a time</B>.
        </span>
      </Body>
    </div>
  );
}

const INSIGHTS = [
  ["Save matching time", "Less time matching products to a theme"],
  ["Show data in one view", "Sales, stock and price next to each product, not across sheets"],
  ["Rank automatically", "Products ordered without hand sorting"],
  ["Stay up to date", "Lists that update themselves when stock changes"],
] as const;

function InterviewHeader() {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeader label="06 EMPLOYEE INTERVIEW" headline="Where Does an MD’s Week Go?" />
      <Body className="max-w-[48rem]">
        To find the steps that took the most time and could be handed to AI, and to learn what MDs
        look for when they pick products, I interviewed <B>8 MDs and marketers</B>, from juniors to
        seniors, and mapped every step of building a campaign.
      </Body>
    </div>
  );
}

export function Interview() {
  return (
    <Chapter id="interview" label="06 Employee Interview" className="border-t border-line">
      <div className={cn(wrap, "pt-24 md:pt-32")}>
        <InterviewHeader />
      </div>

      <StickyScene
        steps={TRACK_STEPS}
        vh={55}
        label="An MD walking the campaign workflow"
        still={() => (
          <div className={cn(wrap, "flex flex-col gap-10")}>
            <WorkflowHeader />
            <WorkflowList />
          </div>
        )}
      >
        {({ step, live }) => (
          <div className={cn(wrap, "flex w-full flex-col gap-10")}>
            <WorkflowHeader />
            <WorkflowTrack step={step} live={live} />
          </div>
        )}
      </StickyScene>

      <StickyScene
        steps={CHECK_STEPS}
        vh={55}
        label="What an MD checks before adding a product"
        still={() => (
          <div className={cn(wrap, "flex flex-col gap-10")}>
            <SelectionHeader />
            <SelectionCheck step={CHECK_STEPS - 1} live={false} />
          </div>
        )}
      >
        {({ step, live }) => (
          <div className={cn(wrap, "flex w-full flex-col gap-10")}>
            <SelectionHeader />
            <SelectionCheck step={step} live={live} />
          </div>
        )}
      </StickyScene>

      <div className={cn(wrap, "flex flex-col gap-6 pb-24 pt-16 md:pb-32")}>
        <SectionLabel>So the system had to…</SectionLabel>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {INSIGHTS.map(([title, text], i) => (
            <Reveal
              as="li"
              key={title}
              delay={i * 0.08}
              className="flex flex-col gap-2 rounded-2xl border border-line bg-paper p-6"
            >
              <p className="font-display text-lg font-medium text-ink md:text-xl">{title}</p>
              <p className="text-base leading-relaxed text-ink-muted">{text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </Chapter>
  );
}

/* ------------------------------------------------------------------ */
/* 07 Define                                                           */
/* ------------------------------------------------------------------ */

function Hmw({ progress, live }: { progress?: MotionValue<number>; live: boolean }) {
  return (
    <Question
      lead="How might we let an MD launch a campaign just by naming a theme,"
      turn="without losing the quality of a hand-picked one"
      progress={progress}
      live={live}
    />
  );
}

const GOALS = [
  ["Internal efficiency", "Automate the manual workflow so MDs get their time back."],
  [
    "Customer experience",
    "Offer more diverse, high-quality campaigns that bring back the joy of discovery.",
  ],
] as const;
const FEATURES = [
  ["Find products by theme", "Type a theme, get a ranked product list."],
  ["Refresh every hour", "Sold-out or stale items are swapped out automatically."],
] as const;

function GoalsAndFeatures() {
  return (
    <div className="grid gap-12 md:grid-cols-2 md:gap-14">
      <div className="flex flex-col gap-6">
        <Subhead>Goals</Subhead>
        <TermList rows={GOALS} className="[&>div]:md:grid-cols-[11rem_1fr]" />
      </div>
      <div className="flex flex-col gap-6">
        <Subhead>Key Features</Subhead>
        <TermList rows={FEATURES} className="[&>div]:md:grid-cols-[11rem_1fr]" />
      </div>
    </div>
  );
}

function TheBar() {
  return (
    <p className="max-w-[52rem] font-display text-[1.75rem] font-medium leading-[1.2] tracking-tight text-ink text-balance md:text-[2.6rem]">
      AI didn’t have to beat our MDs. It had to be <B>as good as them</B>, so customers couldn’t
      tell the difference.
    </p>
  );
}

function Strategy({ animate }: { animate: boolean }) {
  return (
    <div className="flex flex-col gap-8">
      <Subhead>Strategic Process</Subhead>
      <ProcessFlow steps={STRATEGY} animate={animate} />
    </div>
  );
}

function BiggerPicture() {
  return (
    <Fold label="Bigger picture">
      <div className="grid gap-10 rounded-2xl border border-line p-6 md:grid-cols-[1fr_auto] md:gap-14 md:p-8">
        <div className="flex flex-col gap-6">
          <p className="font-display text-xl font-medium tracking-tight text-ink md:text-2xl">
            Project 1 of 9
          </p>
          <Body>
            This was the first project on a roadmap I designed toward{" "}
            <B>a fully personalized homepage</B>.
          </Body>
          <TermList
            className="[&>div]:md:grid-cols-[7rem_1fr]"
            rows={[
              ["Mission", "A fully personalized homepage"],
              ["Goal", "Get the most out of every slot"],
              ["Strategy", "Show products by each customer’s taste"],
            ]}
          />
        </div>
        <RoadmapGrid9 />
      </div>
    </Fold>
  );
}

const DEFINE_BEATS = 4;

export function Define() {
  return (
    <Chapter id="define" label="07 Define" className="border-t border-line">
      <StickyScene
        steps={DEFINE_BEATS}
        vh={100}
        label="From question to plan"
        still={() => (
          <div className={cn(wrap, "flex flex-col gap-16 py-14")}>
            <SectionLabel>07 DEFINE</SectionLabel>
            <Hmw live={false} />
            <GoalsAndFeatures />
            <TheBar />
            <Strategy animate={false} />
          </div>
        )}
      >
        {({ step, progress }) => (
          <div className={cn(wrap, "flex w-full flex-col gap-8 md:gap-10")}>
            <SectionLabel>07 DEFINE</SectionLabel>
            {/* Every beat, invisible, stacked in one cell: the box is as tall as
                the tallest beat, so the label sits still while beats swap. */}
            <div className="grid">
              {[
                <Hmw key="q" live={false} />,
                <GoalsAndFeatures key="g" />,
                <TheBar key="b" />,
                <Strategy key="s" animate={false} />,
              ].map((beat) => (
                <div key={beat.key} aria-hidden className="invisible col-start-1 row-start-1">
                  {beat}
                </div>
              ))}
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  className="col-start-1 row-start-1 w-full"
                  key={step}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.45, ease: EASE_OUT }}
                >
                  {step === 0 && <Hmw progress={progress} live />}
                  {step === 1 && <GoalsAndFeatures />}
                  {step === 2 && <TheBar />}
                  {step === 3 && <Strategy animate />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}
      </StickyScene>

      <div className={cn(wrap, "flex flex-col gap-24 pb-24 pt-8 md:pb-32")}>
        <BiggerPicture />
        {/* The question again, now that the plan is set. */}
        <Reveal>
          <Hmw live={false} />
        </Reveal>
      </div>
    </Chapter>
  );
}
