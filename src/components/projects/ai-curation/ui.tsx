"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, ChevronLeft, Home, Search, ShoppingCart, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { EASE_OUT, StickyScene, useStill } from "../story/motion";
import { ProcessFlow, type ProcessStep } from "../story/ProcessFlow";
import { wrap } from "../story/ui";
import type { Product, Theme } from "./data";

// Pieces only the AI Curation story uses: the rebuilt Kurly screens, MD
// avatars, quotes and the roadmap grid.

/* ------------------------------------------------------------------ */
/* Product tile                                                        */
/* ------------------------------------------------------------------ */

// A product photo (or its stand-in tile), square. `soldOut` greys it out
// under a Sold out badge. Sizes come from the parent.
export function ProductImage({
  product,
  soldOut = false,
  className,
}: {
  product: Product;
  soldOut?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative block aspect-square overflow-hidden rounded-[0.35em] bg-[#f4f1ea]",
        className,
      )}
    >
      {product.src ? (
        // eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized WebP
        <img
          src={product.src}
          alt=""
          loading="lazy"
          className={cn(
            "size-full object-cover transition-[filter] duration-500",
            soldOut && "grayscale",
          )}
        />
      ) : (
        <span aria-hidden className="grid size-full place-items-center bg-[#e4efd9] text-[1.6em]">
          {product.emoji}
        </span>
      )}
      <AnimatePresence>
        {soldOut && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 grid place-items-center bg-ink/45 text-[0.95em] font-semibold text-white"
          >
            Sold out
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Kurly screens                                                       */
/* ------------------------------------------------------------------ */

// Kurly's purple, for the rebuilt app chrome only.
const KURLY = "#5f0080";

function StatusBar() {
  return (
    <div className="flex h-[10cqw] items-end justify-between px-[7cqw] pb-[1cqw] text-[3.6cqw] font-semibold text-ink">
      <span>12:43</span>
      <span aria-hidden className="flex items-end gap-[0.6cqw]">
        {[1.6, 2.2, 2.8, 3.4].map((h) => (
          <span
            key={h}
            className="w-[0.8cqw] rounded-[0.2cqw] bg-ink"
            style={{ height: `${h}cqw` }}
          />
        ))}
        <span className="ml-[1cqw] h-[2.8cqw] w-[5.4cqw] rounded-[0.8cqw] border-[0.35cqw] border-ink/60" />
      </span>
    </div>
  );
}

// A campaign page: title bar, count, filter chips and a two-column grid.
export function CampaignScreen({
  theme,
  products = theme.products,
  shown = products.length,
  className,
}: {
  theme: Theme;
  products?: Product[];
  // How many products have landed (the rest are empty slots).
  shown?: number;
  className?: string;
}) {
  const still = useStill();
  return (
    <div aria-hidden className={cn("@container relative size-full bg-white", className)}>
      <StatusBar />
      <div className="flex h-[12cqw] items-center gap-[2cqw] px-[3cqw] text-[#333]">
        <ChevronLeft className="size-[5cqw] shrink-0" strokeWidth={2} />
        <span className="min-w-0 flex-1 truncate text-[4.4cqw] font-semibold">
          {theme.emoji} {theme.title}
        </span>
        <Home className="size-[5cqw] shrink-0" strokeWidth={1.75} />
        <ShoppingCart className="size-[5cqw] shrink-0" strokeWidth={1.75} />
      </div>
      <div className="flex items-center justify-between px-[4cqw] py-[1.5cqw] text-[3.2cqw] text-[#666]">
        <span>Total {products.length * 18}</span>
        <span className="flex items-center gap-[0.5cqw]">
          Recommended <ChevronDown className="size-[3cqw]" />
        </span>
      </div>
      <div className="flex gap-[1.5cqw] px-[4cqw] pb-[2.5cqw] text-[3.1cqw]">
        <span
          className="rounded-full border border-[#b072ff] px-[2.6cqw] py-[0.8cqw]"
          style={{ color: KURLY }}
        >
          Kurly Only
        </span>
        <span className="rounded-full border border-[#ddd] px-[2.6cqw] py-[0.8cqw] text-[#333]">
          New
        </span>
        <span className="rounded-full border border-[#ddd] px-[2.6cqw] py-[0.8cqw] text-[#333]">
          Category
        </span>
      </div>
      <ul className="grid grid-cols-2 gap-x-[2.5cqw] gap-y-[4cqw] px-[4cqw] text-[3.1cqw]">
        {products.map((product, i) => (
          <motion.li
            key={product.id}
            initial={false}
            animate={i < shown ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 8, scale: 0.96 }}
            transition={still ? { duration: 0 } : { duration: 0.35, ease: EASE_OUT }}
            className="flex flex-col gap-[1.2cqw]"
          >
            <ProductImage product={product} className="text-[3.6cqw]" />
            <span className="grid h-[6.5cqw] place-items-center rounded-[0.8cqw] border border-[#ddd] text-[3cqw] text-[#333]">
              Add to cart
            </span>
            <span className="line-clamp-2 leading-snug text-[#333]">{product.name}</span>
            <span className="text-[3.5cqw] font-semibold text-ink">{product.price}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

// The homepage in 04 and 12, laid out on fixed coordinates (in cqw, the
// screen being 100 wide) so the line between two copies of one product can
// be drawn exactly. Top to bottom: the day's themed campaign (6 products),
// a second campaign (3) and Best Sellers (3).
const TILE = 29;
const COL_X = [4, 35.5, 67];
const S1_TITLE = 34;
const S1_ROWS = [43, 89];
const S2_TITLE = 137;
const S2_ROW = 146;
const S3_TITLE = 197;
const S3_ROW = 206;
const TAB_BAR = 205;

export type HomeDay = {
  main: Theme;
  second: { theme: Theme; products: Product[] };
  // Product ids showing a Sold out badge.
  soldOut?: string[];
  // Draw the line between the first tile of each campaign (same product).
  same?: boolean;
};

function HomeTile({
  product,
  x,
  y,
  soldOut,
  ring,
}: {
  product: Product;
  x: number;
  y: number;
  soldOut: boolean;
  ring: boolean;
}) {
  return (
    <div
      className="absolute flex flex-col gap-[0.8cqw] text-[2.8cqw] leading-tight text-[#333]"
      style={{ left: `${x}cqw`, top: `${y}cqw`, width: `${TILE}cqw` }}
    >
      <ProductImage
        product={product}
        soldOut={soldOut}
        className={cn(
          "text-[3cqw] ring-offset-1 transition-shadow duration-300",
          ring && "ring-2 ring-accent",
        )}
      />
      <span className="line-clamp-2">{product.name}</span>
      <span className="text-[3cqw] font-semibold text-ink">{product.price}</span>
    </div>
  );
}

function HomeTitle({ theme, y, label }: { theme?: Theme; y: number; label?: string }) {
  return (
    <p
      className="absolute inset-x-[4cqw] flex items-center justify-between text-[4cqw] font-semibold text-ink"
      style={{ top: `${y}cqw` }}
    >
      <span className="truncate">{theme ? `${theme.emoji} ${theme.title}` : label}</span>
      <span className="text-[#999]">›</span>
    </p>
  );
}

export function HomeScreen({
  day,
  best,
  scroll = 0,
}: {
  day: HomeDay;
  best: Product[];
  // How far the feed has been flicked up, in cqw.
  scroll?: number;
}) {
  const still = useStill();
  const sold = (p: Product) => day.soldOut?.includes(p.id) ?? false;
  return (
    <div aria-hidden className="@container relative size-full overflow-hidden bg-white">
      <motion.div
        initial={false}
        animate={{ y: `${-scroll}cqw` }}
        transition={still ? { duration: 0 } : { duration: 0.45, ease: [0.3, 0.9, 0.3, 1] }}
        className="absolute inset-0"
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={day.main.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={still ? { duration: 0 } : { duration: 0.4 }}
            className="absolute inset-0"
          >
            <HomeTitle theme={day.main} y={S1_TITLE} />
            {day.main.products.slice(0, 6).map((p, i) => (
              <HomeTile
                key={p.id}
                product={p}
                x={COL_X[i % 3]}
                y={S1_ROWS[Math.floor(i / 3)]}
                soldOut={sold(p)}
                ring={!!day.same && i === 0}
              />
            ))}
            <HomeTitle theme={day.second.theme} y={S2_TITLE} />
            {day.second.products.map((p, i) => (
              <HomeTile
                key={p.id}
                product={p}
                x={COL_X[i]}
                y={S2_ROW}
                soldOut={sold(p)}
                ring={!!day.same && i === 0}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* The same product in both campaigns: a thin line down the margin. */}
        <svg
          viewBox="0 0 100 300"
          preserveAspectRatio="none"
          className="pointer-events-none absolute left-0 top-0 h-[300cqw] w-[100cqw]"
        >
          <motion.path
            d={`M4 ${S1_ROWS[0] + TILE / 2} C0.6 ${S1_ROWS[0] + TILE / 2} 0.6 ${S2_ROW + TILE / 2} 4 ${S2_ROW + TILE / 2}`}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth={1.25}
            vectorEffect="non-scaling-stroke"
            initial={false}
            animate={{ pathLength: day.same ? 1 : 0, opacity: day.same ? 1 : 0 }}
            transition={still ? { duration: 0 } : { duration: 0.6, ease: EASE_OUT, delay: 0.3 }}
          />
        </svg>

        <HomeTitle label="🏆 Best Sellers" y={S3_TITLE} />
        {best.map((p, i) => (
          <HomeTile key={p.id} product={p} x={COL_X[i]} y={S3_ROW} soldOut={sold(p)} ring={false} />
        ))}
      </motion.div>

      {/* The app's header and tab bar stay put while the feed moves. */}
      <div className="absolute inset-x-0 top-0 z-10 h-[31cqw] bg-white">
        <StatusBar />
        <div className="absolute inset-x-[4cqw] top-[11cqw] flex h-[9cqw] items-center gap-[2.5cqw]">
          <span className="text-[5.2cqw] font-bold tracking-tight" style={{ color: KURLY }}>
            Kurly
          </span>
          <span className="flex h-[7cqw] flex-1 items-center gap-[1.5cqw] rounded-full bg-[#f3f5f7] px-[3cqw] text-[3cqw] text-[#999]">
            <Search className="size-[3.4cqw]" />
            Search
          </span>
          <ShoppingCart className="size-[5cqw] text-[#333]" strokeWidth={1.75} />
        </div>
        <div className="absolute inset-x-[4cqw] top-[22cqw] flex gap-[5cqw] border-b border-[#eee] text-[3.4cqw] text-[#666]">
          {["Home", "New", "Best", "Deals"].map((tab, i) => (
            <span
              key={tab}
              className={cn("pb-[1.5cqw]", i === 0 && "border-b-2 font-semibold")}
              style={i === 0 ? { color: KURLY, borderColor: KURLY } : undefined}
            >
              {tab}
            </span>
          ))}
        </div>
      </div>
      <div
        className="absolute inset-x-0 bottom-0 flex justify-around border-t border-[#eee] bg-white pb-[4cqw] pt-[2.5cqw] text-[#999]"
        style={{ top: `${TAB_BAR}cqw` }}
      >
        <Home className="size-[5.5cqw]" style={{ color: KURLY }} />
        <Search className="size-[5.5cqw]" />
        <ShoppingCart className="size-[5.5cqw]" />
        <User className="size-[5.5cqw]" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mini phone                                                          */
/* ------------------------------------------------------------------ */

// A small device for groups of screens (the hero's four campaigns).
export function MiniPhone({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative aspect-[9/19] shrink-0 overflow-hidden rounded-[1.1rem] border-[4px] border-ink bg-paper shadow-[0_18px_36px_-18px_rgba(21,21,21,0.45)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* People                                                              */
/* ------------------------------------------------------------------ */

const AVATAR_TONES = [
  ["#e7e3f4", "#8e84b8"],
  ["#f3e6dc", "#b8917a"],
  ["#dfeee6", "#7ea692"],
  ["#e5ebf4", "#7f93b4"],
] as const;

// A merchandiser: head and shoulders in a soft circle.
export function MdAvatar({ tone = 0, className }: { tone?: number; className?: string }) {
  const [bg, fg] = AVATAR_TONES[tone % AVATAR_TONES.length];
  return (
    <svg aria-hidden viewBox="0 0 40 40" className={cn("size-10 shrink-0", className)}>
      <circle cx="20" cy="20" r="20" fill={bg} />
      <circle cx="20" cy="16" r="6.5" fill={fg} />
      <path d="M8 34c1.8-6.6 6.6-10 12-10s10.2 3.4 12 10a20 20 0 0 1-24 0Z" fill={fg} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Quotes                                                              */
/* ------------------------------------------------------------------ */

export const PARAPHRASED = "Paraphrased from interviews with the MD team.";

// An interview line, tidied up: quote marks and the label that says so.
export function QuoteCard({ quote, className }: { quote: string; className?: string }) {
  return (
    <figure className={cn("flex flex-col gap-3 border-l-2 border-accent pl-5", className)}>
      <blockquote className="font-display text-xl font-medium leading-snug tracking-tight text-ink md:text-2xl">
        “{quote}”
      </blockquote>
      <figcaption className="text-xs text-ink-muted">{PARAPHRASED}</figcaption>
    </figure>
  );
}

// The same, as a message the MD team sent: it pops in when `shown`.
export function MessageCard({ quote, shown }: { quote: string; shown: boolean }) {
  const still = useStill();
  return (
    <figure className="flex flex-col gap-3">
      <motion.div
        initial={still ? false : { opacity: 0, scale: 0.85, y: 16 }}
        animate={shown ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.85, y: 16 }}
        transition={
          still ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 20, delay: 0.3 }
        }
        className="flex max-w-[30rem] origin-bottom-left gap-3 rounded-2xl border border-line bg-paper p-4 shadow-[0_20px_40px_-24px_rgba(21,21,21,0.35)]"
      >
        <MdAvatar tone={0} />
        <div className="flex min-w-0 flex-col gap-1">
          <p className="flex items-baseline gap-2 text-sm">
            <span className="font-semibold text-ink">MD Team</span>
            <span className="text-xs text-ink-muted">10:12 AM</span>
          </p>
          <blockquote className="text-base leading-relaxed text-ink md:text-lg">
            “{quote}”
          </blockquote>
        </div>
      </motion.div>
      <figcaption className="text-xs text-ink-muted">{PARAPHRASED}</figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Roadmap                                                             */
/* ------------------------------------------------------------------ */

// Nine projects toward a personalized homepage. In 07 only the first is
// lit; in 12 it's done and the light spreads to the rest (`spread`).
export function RoadmapGrid9({ spread = false }: { spread?: boolean }) {
  const still = useStill();
  return (
    <ol
      aria-label={
        spread
          ? "Roadmap of nine projects: AI Curation, project 1, is done, and the next ones are lit up."
          : "Roadmap of nine projects: AI Curation is project 1 of 9."
      }
      className="grid w-full max-w-[26rem] grid-cols-3 gap-2"
    >
      {Array.from({ length: 9 }, (_, i) => {
        const first = i === 0;
        // Distance from the first cell, for the spreading light.
        const hop = Math.floor(i / 3) + (i % 3);
        return (
          <li
            key={i}
            className={cn(
              "relative grid h-14 place-items-center overflow-hidden rounded-xl border text-sm font-medium",
              first ? "border-accent bg-accent text-paper" : "border-line text-ink-muted",
            )}
          >
            {!first && spread && (
              <motion.span
                aria-hidden
                initial={still ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.4 + hop * 0.22 }}
                className="absolute inset-0 bg-accent/[0.09]"
              />
            )}
            <span className="relative flex items-center gap-1.5">
              {first && spread && <Check aria-hidden className="size-4" strokeWidth={2.5} />}
              {first ? "AI Curation" : `Project ${i + 1}`}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/* Progress                                                            */
/* ------------------------------------------------------------------ */

// The plan from 07 Define.
export const STRATEGY: ProcessStep[] = [
  {
    name: "AI PoC",
    text: "An internal copilot for MDs, to reach expert-level curation.",
  },
  {
    name: "Validation",
    text: "A large A/B test on the homepage, to match hand-picked campaigns.",
  },
  {
    name: "CEO Decision",
    text: "Bring the evidence to the CEO and get the go-ahead.",
    gate: true,
  },
  { name: "Integration", text: "Let AI run the core homepage slots." },
];

// Where the plan stands at the end of a chapter: it lands on `from` steps
// lit, and one scroll lights up to `lit`, ringing `current`. A spare step
// holds it.
export function ProgressBeat({
  from,
  lit,
  current,
  label,
}: {
  from: number;
  lit: number;
  current?: number;
  label: string;
}) {
  return (
    <StickyScene steps={3} vh={60} label={label}>
      {({ step, live }) => {
        const done = !live || step >= 1;
        return (
          <div className={cn(wrap, "flex w-full flex-col items-center gap-14")}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">
              Strategic Process
            </p>
            <div className="w-full">
              <ProcessFlow
                steps={STRATEGY}
                animate={false}
                lit={done ? lit : from}
                from={from}
                current={done ? current : from}
              />
            </div>
          </div>
        );
      }}
    </StickyScene>
  );
}
