"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, ChevronLeft, ChevronRight, Home, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { EASE_OUT, StickyScene, useStill } from "../story/motion";
import { ProcessFlow, type ProcessStep } from "../story/ProcessFlow";
import { wrap } from "../story/ui";
import type { HomeItem, HomeSection, Product, Theme } from "./data";

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

// A product card from Kurly's web store, as in 01's homepage: photo, Add to
// cart, delivery tag, name and price.
export type WebProduct = {
  src: string;
  name: string;
  price: string;
  // Struck-through list price and the discount, when on sale.
  was?: string;
  off?: string;
};

export function WebProductCard({
  product,
  className,
}: {
  product: WebProduct;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col text-[#333]", className)}>
      <span className="block aspect-[720/936] overflow-hidden rounded-[4px] bg-[#f4f1ea]">
        {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized WebP */}
        <img src={product.src} alt="" loading="lazy" className="size-full object-cover" />
      </span>
      <span className="mt-2 flex h-9 items-center justify-center gap-1.5 rounded-[4px] border border-[#ddd] text-[15px]">
        <ShoppingCart className="size-4" strokeWidth={1.75} />
        Add to cart
      </span>
      <span className="mt-2.5 text-[13px] text-[#999]">Dawn Delivery</span>
      <span className="mt-0.5 text-[15px] leading-snug">{product.name}</span>
      {product.was && (
        <span className="mt-1 text-[13px] text-[#b5b5b5] line-through">{product.was}</span>
      )}
      <span className="flex gap-1.5 text-[17px] font-bold">
        {product.off && <span className="text-[#fa622f]">{product.off}</span>}
        {product.price}
      </span>
    </div>
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

// The homepage in 04 and 12, rebuilt from Kurly's app (Figma, 375 wide).
// Everything is sized in design pixels and converted to cqw, so the screen
// scales with the phone. The app bar and tab bar are exports; the campaign
// rows are live, so products can sell out.
const APP = "/images/ai-curation/app";
const px = (n: number) => `${(n / 3.75).toFixed(3)}cqw`;
// Where the rows start (right under the app bar), and the step from one to
// the next.
const ROW_TOP = 132;
const ROW_STEP = 457;
// How far the feed scrolls to reach the end of its three rows, in cqw.
export const FEED_END = (ROW_TOP + 2 * ROW_STEP + 425 + 64 - 821) / 3.75;

export type HomeDay = {
  sections: HomeSection[];
  // Product ids showing a Sold Out or No Longer Sold cover.
  soldOut?: string[];
  gone?: string[];
};
type CardState = "soldOut" | "gone" | undefined;

// The three buttons Kurly rotates through a row.
function CardButton({ kind }: { kind: number }) {
  return (
    <span
      className="flex items-center justify-center border border-[#dfe4eb] bg-white font-medium text-[#222]"
      style={{
        height: px(32),
        borderRadius: px(4),
        gap: px(4),
        fontSize: px(13),
      }}
    >
      {kind === 0 && (
        // eslint-disable-next-line @next/next/no-img-element -- static export
        <img src={`${APP}/icon-cart.svg`} alt="" style={{ width: px(14.8), height: px(13.2) }} />
      )}
      {kind === 1 && (
        <span
          className="relative border border-[#333]"
          style={{ width: px(14.5), height: px(11.5), borderRadius: px(1.5) }}
        >
          <span className="absolute inset-x-0 border-t border-[#333]" style={{ top: px(2.5) }} />
          <span
            className="absolute border-t border-[#333]"
            style={{ left: px(2), top: px(7.5), width: px(3) }}
          />
        </span>
      )}
      {["Add to Cart", "Buy Now", "Details"][kind]}
    </span>
  );
}

function HomeCard({ item, kind, state }: { item: HomeItem; kind: number; state: CardState }) {
  return (
    <div className="flex shrink-0 flex-col" style={{ width: px(150) }}>
      <span
        className="relative block overflow-hidden bg-[#f4f1ea]"
        style={{ height: px(195), borderRadius: px(4) }}
      >
        {item.src ? (
          // eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized WebP
          <img
            src={item.src}
            alt=""
            loading="lazy"
            className={cn(
              "size-full object-cover transition-[filter] duration-500",
              state && "grayscale",
            )}
          />
        ) : (
          <span className="grid size-full place-items-center" style={{ fontSize: px(40) }}>
            {item.emoji}
          </span>
        )}
        {item.coupon && (
          <span
            className="absolute bg-[#bd76ff] font-bold leading-none text-white"
            style={{
              left: px(8),
              top: px(8),
              padding: `${px(6)} ${px(6)}`,
              borderRadius: px(4),
              fontSize: px(12),
            }}
          >
            {item.coupon}
          </span>
        )}
        <AnimatePresence>
          {state && (
            <motion.span
              key={state}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 grid place-items-center bg-[#222]/55 font-semibold text-white"
              style={{ fontSize: px(15) }}
            >
              {state === "soldOut" ? "Sold Out" : "No Longer Sold"}
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      <span style={{ marginTop: px(6) }}>
        <CardButton kind={kind} />
      </span>
      <span
        className="line-clamp-2 text-[#222]"
        style={{
          marginTop: px(8),
          fontSize: px(14),
          lineHeight: px(20),
          height: px(40),
        }}
      >
        {item.name}
      </span>
      {item.was && (
        <span
          className="text-[#bcc4cc] line-through"
          style={{ marginTop: px(2), fontSize: px(12), lineHeight: px(15) }}
        >
          {item.was}
        </span>
      )}
      <span
        className="flex font-bold tracking-[-0.03em]"
        style={{
          marginTop: item.was ? 0 : px(2),
          gap: px(2),
          fontSize: px(14),
          lineHeight: px(19),
        }}
      >
        {item.off && <span className="text-[#fa622f]">{item.off}</span>}
        <span className="text-[#222]">{item.price}</span>
      </span>
      <span
        className="flex items-center text-[#a7b2bc]"
        style={{
          marginTop: px(8),
          gap: px(2),
          fontSize: px(12),
          lineHeight: px(15),
        }}
      >
        <span className="grid place-items-center" style={{ width: px(14), height: px(14) }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- static export */}
          <img src={`${APP}/icon-review.svg`} alt="" style={{ width: px(11.5), height: px(11) }} />
        </span>
        9,999+
      </span>
    </div>
  );
}

function HomeRow({ section, top, day }: { section: HomeSection; top: number; day: HomeDay }) {
  const state = (id: string): CardState =>
    day.gone?.includes(id) ? "gone" : day.soldOut?.includes(id) ? "soldOut" : undefined;
  return (
    <div className="absolute inset-x-0" style={{ top: px(top) }}>
      <div style={{ padding: `${px(16)} ${px(10)} 0 ${px(16)}` }}>
        <p
          className="flex items-center justify-between font-semibold text-[#222]"
          style={{ fontSize: px(18), lineHeight: px(22) }}
        >
          <span className="truncate">{section.title}</span>
          <span
            className="flex shrink-0 items-center font-normal text-[#672091]"
            style={{ fontSize: px(14) }}
          >
            Shop
            <ChevronRight style={{ width: px(18), height: px(18) }} strokeWidth={1.5} />
          </span>
        </p>
        <p
          className="truncate text-[#848f9a]"
          style={{ marginTop: px(4), fontSize: px(14), lineHeight: px(18) }}
        >
          {section.sub}
        </p>
      </div>
      <div className="flex" style={{ marginTop: px(27), paddingLeft: px(16), gap: px(8) }}>
        {section.items.slice(0, 3).map((item, i) => (
          <HomeCard key={item.id} item={item} kind={i} state={state(item.id)} />
        ))}
      </div>
    </div>
  );
}

export function HomeScreen({
  day,
  scroll = 0,
  glide = 0.45,
}: {
  day: HomeDay;
  // How far the feed has been scrolled up, in cqw, and how long it takes.
  scroll?: number;
  glide?: number;
}) {
  const still = useStill();
  return (
    <div aria-hidden className="@container relative size-full overflow-hidden bg-white font-sans">
      <motion.div
        initial={false}
        animate={{ y: `${-scroll}cqw` }}
        transition={still ? { duration: 0 } : { duration: glide, ease: [0.45, 0, 0.35, 1] }}
        className="absolute inset-0"
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={day.sections[0].title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={still ? { duration: 0 } : { duration: 0.4 }}
            className="absolute inset-0"
          >
            {day.sections.map((s, i) => (
              <HomeRow key={s.title} section={s} top={ROW_TOP + i * ROW_STEP} day={day} />
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* The app bar and tab bar stay put while the feed moves. */}
      {/* eslint-disable-next-line @next/next/no-img-element -- static export */}
      <img
        src={`${APP}/top-bar.svg`}
        alt=""
        className="absolute inset-x-0 top-0 z-10 w-full"
        style={{ height: px(132) }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element -- static export */}
      <img
        src={`${APP}/tab-bar.svg`}
        alt=""
        className="absolute inset-x-0 bottom-0 z-10 w-full bg-white"
        style={{ height: px(48) }}
      />
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

// An interview line, tidied up: serif italic, one sentence per line, and
// the label that says so.
export function QuoteCard({ quote, className }: { quote: string; className?: string }) {
  const sentences = quote.split(/(?<=[.?!])\s+/);
  return (
    <figure className={cn("flex flex-col gap-3 border-l-2 border-accent pl-5", className)}>
      <blockquote className="instrument-serif-regular-italic text-2xl leading-snug text-ink md:text-[1.75rem]">
        {sentences.map((line, i) => (
          <span key={i} className="block">
            {i === 0 && "“"}
            {line}
            {i === sentences.length - 1 && "”"}
          </span>
        ))}
      </blockquote>
      <figcaption className="text-xs text-ink-muted">{PARAPHRASED}</figcaption>
    </figure>
  );
}

// The same, as a message the MD team leader sent: it pops in when `shown`.
export function MessageCard({ quote, shown }: { quote: string; shown: boolean }) {
  const still = useStill();
  return (
    <figure className="flex flex-col gap-3">
      <motion.div
        initial={still ? false : { opacity: 0, scale: 0.85, y: -16 }}
        animate={shown ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.85, y: -16 }}
        transition={
          still ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 20, delay: 0.3 }
        }
        className="flex max-w-[30rem] origin-top-right gap-3 rounded-2xl border border-line bg-paper p-4 shadow-[0_20px_40px_-24px_rgba(21,21,21,0.35)]"
      >
        <MdAvatar tone={0} />
        <div className="flex min-w-0 flex-col gap-1">
          <p className="flex items-baseline gap-2 text-sm">
            <span className="font-semibold text-ink">MD Team Leader</span>
            <span className="text-xs text-ink-muted">10:12 AM</span>
          </p>
          <blockquote className="text-base leading-relaxed text-ink md:text-lg">{quote}</blockquote>
        </div>
      </motion.div>
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
                transition={{
                  duration: 0.6,
                  ease: EASE_OUT,
                  delay: 0.4 + hop * 0.22,
                }}
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
