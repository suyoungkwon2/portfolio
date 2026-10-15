"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useState } from "react";
import { Accordion } from "@/components/project/Accordion";
import { cn } from "@/lib/utils";
import type { AssetId } from "./assets";
import { PhoneStage, QueryCaption } from "./ActConflict";
import { EASE_OUT, Reveal, StickyScene, useStill } from "./motion";
import { SearchSequence } from "./SearchSequence";
import {
  AssetMedia,
  B,
  Body,
  Chapter,
  PhoneFrame,
  ProcessStrip,
  SectionHeader,
  StandInTag,
  ThoughtBubble,
  useAsset,
  wrap,
} from "./ui";

// Act 3, Turn: 06 Define · 07 PoC Approach (spec §5.6–5.7). 07B is the
// page's climax: the same typos from 04, in the same phone, now found.

/* ------------------------------------------------------------------ */
/* 06 Define                                                           */
/* ------------------------------------------------------------------ */

function Question({ progress, live }: { progress?: MotionValue<number>; live: boolean }) {
  // The rest of the sentence dims so only the constraint stays lit.
  const idle = useMotionValue(0);
  const dim = useTransform(progress ?? idle, [0.06, 0.2], [1, 0.25]);
  const rest = live ? { opacity: dim } : undefined;
  return (
    <p className="font-display font-medium tracking-tight max-w-[24ch] text-[1.75rem] leading-[1.2] text-ink md:text-[2.6rem]">
      <motion.span style={rest}>How might we turn “No Results” into results, </motion.span>
      <strong className="font-normal text-accent">without rebuilding the search engine</strong>
      <motion.span style={rest}>?</motion.span>
    </p>
  );
}

function Opening({ animate }: { animate: boolean }) {
  const still = useStill() || !animate;
  return (
    <div className="grid items-center gap-10 md:grid-cols-[1.2fr_1fr]">
      <p className="text-lg leading-relaxed text-ink-muted md:text-xl">
        The opening: Kurly’s whole catalog already lived on <B>Google Cloud</B> (BigQuery, Vertex
        AI). We didn’t need a new engine. We could <B>add an AI layer</B> on top.
      </p>
      <div
        role="img"
        aria-label="“Rebuild” is crossed out and replaced by “Add”: an AI layer on BigQuery and Vertex AI sits on top of the existing search."
        className="flex flex-col items-center gap-6"
      >
        <p className="font-display font-medium tracking-tight flex items-baseline gap-4 text-[2rem] leading-none md:text-[2.5rem]">
          <span className="relative text-ink-muted">
            Rebuild
            <motion.span
              aria-hidden
              initial={still ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.4 }}
              className="absolute inset-x-0 top-1/2 h-[3px] origin-left bg-ink"
            />
          </span>
          <motion.span
            initial={still ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE_OUT, delay: 0.9 }}
            className="text-accent"
          >
            Add
          </motion.span>
        </p>
        <div className="flex w-full max-w-[320px] flex-col gap-2">
          <motion.div
            initial={still ? false : { opacity: 0, y: -28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT, delay: 1.2 }}
            className="flex flex-col items-center gap-2 rounded-xl border-2 border-accent bg-paper px-4 py-3"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
              AI layer
            </span>
            <span className="flex gap-2">
              {["BigQuery", "Vertex AI"].map((name) => (
                <span
                  key={name}
                  className="rounded-full bg-accent/[0.08] px-3 py-1 text-xs font-medium text-accent"
                >
                  {name}
                </span>
              ))}
            </span>
          </motion.div>
          <div className="rounded-xl bg-paper-2 px-4 py-3 text-center text-xs font-medium text-ink-muted">
            Existing search engine
          </div>
        </div>
      </div>
    </div>
  );
}

const RULES = [
  { name: "Only on failure", text: "AI runs only when the old search finds nothing." },
  {
    name: "Same business rules",
    text: "Every AI result respects Kurly’s business and inventory policies.",
  },
  { name: "Narrow scope first", text: "Typos, spacing, and synonyms only." },
];

function Rules({ animate }: { animate: boolean }) {
  const still = useStill() || !animate;
  return (
    <div className="flex flex-col gap-8">
      <p className="text-lg text-ink-muted md:text-xl">Three rules the AI had to follow:</p>
      <ol className="grid gap-4 md:grid-cols-3">
        {RULES.map((rule, i) => (
          <motion.li
            key={rule.name}
            initial={still ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.15 + i * 0.15 }}
            className="flex flex-col gap-3 rounded-2xl border border-line bg-paper p-6"
          >
            <span className="font-display font-medium tracking-tight text-2xl leading-none text-accent">
              {i + 1}
            </span>
            <p className="font-display text-base font-medium text-ink">{rule.name}</p>
            <p className="text-sm leading-relaxed text-ink-muted">{rule.text}</p>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

const KPIS = [
  ["Shopper", "No-Result Rate, Click-Through Rate, Add-to-Cart Rate, Purchase Rate"],
  ["Business", "Cart Value, Purchase Value, Revenue per Search, Profit Margin, AI API Cost"],
];

export function Define() {
  return (
    <Chapter id="define" label="06 Define" className="border-t border-line">
      <StickyScene
        steps={3}
        vh={100}
        label="From question to rules"
        still={() => (
          <div className={cn(wrap, "flex flex-col gap-16 py-14")}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              06 DEFINE
            </p>
            <Question live={false} />
            <Opening animate={false} />
            <Rules animate={false} />
          </div>
        )}
      >
        {({ step, progress }) => (
          <div className={cn(wrap, "flex flex-col gap-10")}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              06 DEFINE
            </p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.45, ease: EASE_OUT }}
              >
                {step === 0 && <Question progress={progress} live />}
                {step === 1 && <Opening animate />}
                {step === 2 && <Rules animate />}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </StickyScene>

      <div className={cn(wrap, "flex flex-col gap-10 pb-28 pt-6 md:pb-36")}>
        <ProcessStrip at="Define" />
        <Accordion label="How we’d measure success" className="items-start">
          <dl className="grid gap-4 rounded-2xl border border-line p-6 md:grid-cols-2">
            {KPIS.map(([group, list]) => (
              <div key={group} className="flex flex-col gap-1.5">
                <dt className="text-xs font-semibold uppercase tracking-[0.15em] text-ink">
                  {group}
                </dt>
                <dd className="text-sm leading-relaxed text-ink-muted">{list}</dd>
              </div>
            ))}
          </dl>
        </Accordion>
      </div>
    </Chapter>
  );
}

/* ------------------------------------------------------------------ */
/* 07A How it works                                                    */
/* ------------------------------------------------------------------ */

const card = "flex flex-col gap-3 rounded-2xl border border-line bg-paper p-6 md:p-7";
const cardTitle = "text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted";

type Column = { name: string; result: "none" | "mixed" | "exact" };
const COLUMNS: Column[] = [
  { name: "Kurly search", result: "none" },
  { name: "Web crawling", result: "mixed" },
  { name: "Structured data", result: "exact" },
];
const MIXED = ["🧀", "🍝", "🥫", "🫙"];

// `DataSourceShowdown`: one query, three result sets, one winner. Coded
// stand-in until the Gradio demo recording (datasource-showdown) exists.
function DataSourceShowdown() {
  const asset = useAsset("datasource-showdown");
  if (asset.src) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-2xl border border-line">
        <AssetMedia id="datasource-showdown" fit="contain" />
      </div>
    );
  }
  return (
    <div className="relative rounded-2xl border border-line bg-paper-2/60 p-5 md:p-7">
      <StandInTag id="datasource-showdown" className="right-3 top-3" />
      <div className="mx-auto flex max-w-sm items-center gap-2 rounded-full border border-ink/15 bg-paper px-4 py-2.5">
        <span className="text-xs text-ink-muted">Query</span>
        <span className="font-mono text-sm text-ink">granma padano</span>
      </div>
      <ol className="mt-6 grid gap-4 md:grid-cols-3">
        {COLUMNS.map((col, i) => {
          const winner = col.result === "exact";
          return (
            <Reveal
              as="li"
              key={col.name}
              delay={i * 0.15}
              className={cn(
                "relative flex flex-col gap-3 rounded-xl border bg-paper p-4",
                winner ? "border-2 border-accent" : "border-line",
              )}
            >
              <div className="flex items-center justify-between">
                <span className={cn("text-sm font-semibold", winner ? "text-accent" : "text-ink")}>
                  {col.name}
                </span>
                {winner && (
                  <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-paper">
                    Winner
                  </span>
                )}
              </div>
              {col.result === "none" ? (
                <div className="grid aspect-[2/1] place-items-center rounded-lg bg-paper-2 text-xs text-ink-muted">
                  No products found
                </div>
              ) : (
                <ul aria-hidden className="grid grid-cols-4 gap-1.5">
                  {(col.result === "exact" ? ["🧀", "🧀", "🧀", "🧀"] : MIXED).map((e, k) => (
                    <li
                      key={k}
                      className={cn(
                        "grid aspect-square place-items-center rounded-md bg-paper-2 text-xl",
                        col.result === "mixed" && "opacity-60 grayscale-[40%]",
                      )}
                    >
                      {e}
                    </li>
                  ))}
                </ul>
              )}
              <span className="sr-only">
                {col.result === "none" && "No results."}
                {col.result === "mixed" && "Some results, not all of them cheese."}
                {col.result === "exact" && "Grana Padano cheeses, exactly."}
              </span>
            </Reveal>
          );
        })}
      </ol>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 07B Try it yourself                                                 */
/* ------------------------------------------------------------------ */

type Demo = {
  id: string;
  label: string;
  type: string;
  video: AssetId;
  emoji: string;
  bubble: string;
  // Stand-in result tiles until the recordings exist.
  product: string;
};

// Spec §5.7 data. The contextual query isn't chosen yet, so its chip is
// left out until it is (TODO in the spec).
const DEMOS: Demo[] = [
  {
    id: "misspelling",
    label: "cabage",
    type: "Misspelling",
    video: "demo-cabage",
    emoji: "😊",
    bubble: "There it is.",
    product: "🥬",
  },
  {
    id: "spacing",
    label: "ca bbage",
    type: "Spacing",
    video: "demo-ca-bbage",
    emoji: "😊",
    bubble: "There it is.",
    product: "🥬",
  },
  {
    id: "synonym",
    label: "lettuce",
    type: "Synonym",
    video: "demo-lettuce",
    emoji: "😮",
    bubble: "Oh, that’s what it’s called.",
    product: "🥬",
  },
  {
    id: "foreign",
    label: "granma padano",
    type: "Foreign word",
    video: "demo-granma-padano",
    emoji: "😮",
    bubble: "Oh, that’s what it’s called.",
    product: "🧀",
  },
  // { id: "contextual", label: "TODO", type: "Contextual", video: "demo-contextual", emoji: "😊", bubble: "There it is.", product: "" },
];

function DemoScreen({ demo }: { demo: Demo }) {
  const has = !!useAsset(demo.video).src;
  return (
    <>
      <AssetMedia
        id={demo.video}
        fallback={<SearchSequence query={demo.label} emoji={demo.product} recover />}
      />
      {!has && <StandInTag id={demo.video} className="bottom-3 left-3" />}
    </>
  );
}

// `QueryDemo` (▶ Interactive): pick a query, watch it fail for half a
// second, then come back with AI results.
function QueryDemo() {
  const [selected, setSelected] = useState(DEMOS[0].id);
  // Bumped on every press, so pressing the same chip replays it.
  const [run, setRun] = useState(0);
  const still = useStill();
  const demo = DEMOS.find((d) => d.id === selected)!;
  // Typing + half a second of No Result, then the bubble.
  const bubbleDelay = still ? 0 : 0.25 + demo.label.length * 0.09 + 0.5 + 0.5;

  return (
    <div className="flex flex-col gap-10">
      <div
        role="group"
        aria-label="Choose a search to try"
        className="flex flex-wrap justify-center gap-2"
      >
        {DEMOS.map((d) => {
          const on = d.id === selected;
          return (
            <button
              key={d.id}
              type="button"
              aria-pressed={on}
              onClick={() => {
                setSelected(d.id);
                setRun((r) => r + 1);
              }}
              className={cn(
                "flex flex-col items-start rounded-xl border px-4 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                on
                  ? "border-accent bg-accent text-paper"
                  : "border-line bg-paper text-ink hover:border-accent",
              )}
            >
              <span className="font-mono text-sm">{d.label}</span>
              <span
                className={cn(
                  "text-[10px] uppercase tracking-[0.15em]",
                  on ? "text-paper/70" : "text-ink-muted",
                )}
              >
                {d.type}
              </span>
            </button>
          );
        })}
      </div>

      <PhoneStage
        caption={<QueryCaption type={demo.type} query={demo.label} note="After" />}
        phone={
          <PhoneFrame>
            <div key={`${selected}-${run}`} className="absolute inset-0" aria-live="polite">
              <DemoScreen demo={demo} />
            </div>
          </PhoneFrame>
        }
        bubble={
          <motion.div
            key={`${selected}-${run}`}
            initial={still ? false : { opacity: 0, x: -10, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: EASE_OUT, delay: bubbleDelay }}
          >
            <ThoughtBubble emoji={demo.emoji} text={demo.bubble} />
          </motion.div>
        }
      />
    </div>
  );
}

export function PocApproach() {
  return (
    <Chapter id="poc" label="07 PoC Approach" className="border-t border-line pt-24 md:pt-32">
      <div className={wrap}>
        <SectionHeader
          label="07 POC APPROACH"
          headline="Teaching Search to Understand, Not Just Match"
        />

        <div className="mt-14 grid gap-4 md:grid-cols-3 md:grid-rows-[auto_auto]">
          <Reveal className={cn(card, "md:col-start-1 md:row-start-1")}>
            <p className={cardTitle}>Engine</p>
            <p className="text-[15px] leading-relaxed text-ink-muted">
              Vertex AI Search blends text matching with <B>meaning-based (embedding) search</B>,
              and plugs straight into the data Kurly already had.
            </p>
          </Reveal>
          <Reveal
            delay={0.1}
            className={cn(
              card,
              "border-ink/20 md:col-span-2 md:col-start-2 md:row-span-2 md:row-start-1 md:p-9",
            )}
          >
            <p className={cardTitle}>Data</p>
            <h3 className="font-display font-medium tracking-tight text-[1.5rem] leading-tight text-ink md:text-[1.9rem]">
              Crawl the website, or feed it clean data?
            </h3>
            <p className="text-base leading-relaxed text-ink-muted">
              The fastest route was letting the AI crawl Kurly’s product pages. But we couldn’t
              control what a crawler would pick up, and messy data means unreliable results. Instead
              of guessing, I built a <B>quick demo page</B> that showed three results side by side
              for any query: today’s Kurly search, web-crawled data, and our own{" "}
              <B>structured product data</B> from BigQuery. Structured data won clearly, so we built
              on it.
            </p>
            <p className="mt-auto border-t border-line pt-4 text-xs leading-relaxed text-ink-muted">
              Title, description, sales status, related keywords and more, each set as searchable,
              indexable, or retrievable.
            </p>
          </Reveal>
          <Reveal delay={0.2} className={cn(card, "md:col-start-1 md:row-start-2")}>
            <p className={cardTitle}>Tuning</p>
            <p className="text-[15px] leading-relaxed text-ink-muted">
              We fine-tuned the model with query-product pairs from Kurly’s own collections, so it
              learned <B>how Kurly shoppers talk</B>.
            </p>
          </Reveal>
        </div>

        <div className="mt-6">
          <DataSourceShowdown />
        </div>
      </div>

      <div id="try-it" className={cn(wrap, "flex flex-col gap-12 pb-28 pt-28 md:pb-36 md:pt-40")}>
        <div className="flex flex-col items-center gap-5 text-center">
          <SectionHeader as="h3" headline="Same Typos. This Time, Real Results." />
          <Body className="text-center">
            Qualitative checks showed clearly better results for all five query types. That was
            enough to ask for a full A/B test.
          </Body>
        </div>
        <QueryDemo />
      </div>
    </Chapter>
  );
}
