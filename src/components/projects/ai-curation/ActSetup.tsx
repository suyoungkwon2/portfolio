"use client";

import { motion, useAnimationFrame, useInView } from "framer-motion";
import { Check, Pencil, RotateCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { EASE_OUT, Reveal, StickyScene, useFitScale, useStill } from "../story/motion";
import { RolesChapter, type Role } from "../story/OrgChart";
import {
  B,
  BeatCopy,
  Body,
  CENTERED,
  Chapter,
  FlipLabel,
  HookLines,
  MetricCounter,
  SectionHeader,
  StoryHero,
  textLink,
  wrap,
  type CopyBeat,
  type Num,
} from "../story/ui";
import { CHINESE, HERO_THEMES, HOLIDAY, SNACK, type Theme } from "./data";
import { CampaignScreen, MdAvatar, MiniPhone, ProductImage } from "./ui";

// Act 1, Setup: Hero · 01 Context · 02 Impact · 03 R&R, and the hook into
// 04 (spec §5.0–5.4). The reader learns what was achieved before learning how.

const META = [
  ["Period", ["Jun 2024", "– Dec 2024"]],
  ["Role", ["AI Product Manager", "UX Research", "A/B Test Design", "CEO Communication", "QA"]],
  ["Team", ["AI PM (Me)", "1 ML Engineer", "1 Backend Engineer"]],
  ["Org", ["Kurly"]],
] as const;

/* ------------------------------------------------------------------ */
/* Hero: ThemeToCampaigns                                              */
/* ------------------------------------------------------------------ */

// One loop, in seconds: the four titles type out, the AI node lights, four
// dashed lines run to four phones, and the phones fill with products.
const KEY_S = 0.04;
const LINE_GAP_S = 0.25;
const TITLE_START = 0.4;
const LINE_STARTS = HERO_THEMES.reduce<number[]>((starts, theme, i) => {
  const prev = i === 0 ? TITLE_START : starts[i - 1] + HERO_THEMES[i - 1].title.length * KEY_S;
  return [...starts, i === 0 ? prev : prev + LINE_GAP_S];
}, []);
const TYPED_S =
  LINE_STARTS[LINE_STARTS.length - 1] + HERO_THEMES[HERO_THEMES.length - 1].title.length * KEY_S;
const AI_AT = TYPED_S + 0.5;
const LINES_AT = AI_AT + 0.35;
const LINES_S = 0.7;
const FILL_AT = LINES_AT + LINES_S;
const FILL_KEY_S = 0.09;
const SHOWN = 4; // products on each little screen
const LOOP_S = FILL_AT + 0.25 * 3 + SHOWN * FILL_KEY_S + 3.4;

type HeroFrame = {
  typed: number[];
  ai: boolean;
  lines: boolean;
  filled: number[];
  // The last moments of the loop fade everything back to an empty title card.
  out: boolean;
};

function heroFrame(t: number): HeroFrame {
  return {
    typed: HERO_THEMES.map((theme, i) =>
      Math.max(0, Math.min(theme.title.length, Math.floor((t - LINE_STARTS[i]) / KEY_S))),
    ),
    ai: t >= AI_AT,
    lines: t >= LINES_AT,
    filled: HERO_THEMES.map((_, i) =>
      Math.max(0, Math.min(SHOWN, Math.floor((t - FILL_AT - i * 0.25) / FILL_KEY_S) + 1)),
    ),
    out: t >= LOOP_S - 0.5,
  };
}

const sameHero = (a: HeroFrame, b: HeroFrame) =>
  a.ai === b.ai &&
  a.lines === b.lines &&
  a.out === b.out &&
  a.typed.every((n, i) => n === b.typed[i]) &&
  a.filled.every((n, i) => n === b.filled[i]);

// Scene geometry (px, inside a 460 × 540 box that scales to its column).
const SCENE_W = 460;
const SCENE_H = 540;
const PHONE_W = 100;
const PHONE_GAP = 20;
const PHONE_TOP = 326;
const phoneX = (i: number) =>
  (SCENE_W - (PHONE_W * 4 + PHONE_GAP * 3)) / 2 + i * (PHONE_W + PHONE_GAP);
const AI_Y = 214;
const LINE_Y = 268;
const TAG_Y = 290;

function TitleCard({ typed, caret }: { typed: number[]; caret: number }) {
  return (
    <div className="absolute left-1/2 top-0 w-[300px] -translate-x-1/2 rounded-xl border border-line bg-paper px-4 pb-2 pt-3 shadow-[0_20px_40px_-24px_rgba(21,21,21,0.35)]">
      <p className="flex items-center gap-1.5 border-b border-line pb-2 text-xs font-medium text-ink-muted">
        Title <Pencil aria-hidden className="size-3" strokeWidth={1.75} />
      </p>
      <ul className="text-[15px] text-ink">
        {HERO_THEMES.map((theme, i) => (
          <li
            key={theme.title}
            className="flex h-9 items-center gap-2 border-b border-dashed border-line last:border-b-0"
          >
            <span aria-hidden className={cn("transition-opacity", typed[i] === 0 && "opacity-0")}>
              {theme.emoji}
            </span>
            <span className="truncate">{theme.title.slice(0, typed[i])}</span>
            {caret === i && (
              <span aria-hidden className="-ml-1.5 inline-block h-4 w-px animate-pulse bg-ink" />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function AiNode({ on }: { on: boolean }) {
  return (
    <div className="absolute left-1/2 -translate-x-1/2" style={{ top: AI_Y }}>
      <motion.span
        aria-hidden
        initial={false}
        animate={{ opacity: on ? 1 : 0, scale: on ? 1 : 0.6 }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
        className="absolute -inset-5 rounded-full bg-accent/35 blur-xl"
      />
      <span
        className={cn(
          "relative grid h-10 w-16 place-items-center rounded-full font-display text-base font-semibold transition-colors duration-500",
          on ? "bg-accent text-paper" : "border border-line bg-paper text-ink-muted",
        )}
      >
        AI
      </span>
    </div>
  );
}

function Connectors({ on, still }: { on: boolean; still: boolean }) {
  const cx = SCENE_W / 2;
  const top = AI_Y + 40;
  return (
    <svg
      aria-hidden
      width={SCENE_W}
      height={SCENE_H}
      className="pointer-events-none absolute inset-0"
    >
      {/* Dashed lines, revealed along their length by a solid mask. */}
      {HERO_THEMES.map((_, i) => {
        const x = phoneX(i) + PHONE_W / 2;
        const d = `M${cx} ${top} V${LINE_Y} H${x} V${TAG_Y - 4}`;
        return (
          <g key={i}>
            <mask
              id={`hero-line-${i}`}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width={SCENE_W}
              height={SCENE_H}
            >
              <motion.path
                d={d}
                fill="none"
                stroke="#fff"
                strokeWidth={4}
                initial={false}
                animate={{ pathLength: on ? 1 : 0 }}
                transition={still ? { duration: 0 } : { duration: LINES_S, ease: "easeInOut" }}
              />
            </mask>
            <path
              d={d}
              mask={`url(#hero-line-${i})`}
              fill="none"
              stroke="var(--color-accent)"
              strokeOpacity={0.6}
              strokeWidth={1.25}
              strokeDasharray="3 4"
            />
          </g>
        );
      })}
    </svg>
  );
}

function ThemeToCampaigns() {
  const still = useStill();
  const { ref, scale } = useFitScale(SCENE_W);
  const inView = useInView(ref, { amount: 0.3 });
  const clock = useRef(0);
  const [frame, setFrame] = useState(() => heroFrame(still ? LOOP_S - 1 : 0));
  useAnimationFrame((_, delta) => {
    if (still || !inView) return;
    clock.current = (clock.current + delta / 1000) % LOOP_S;
    const next = heroFrame(clock.current);
    setFrame((f) => (sameHero(f, next) ? f : next));
  });
  // Reduced motion: the finished state, held.
  const shown = still ? heroFrame(LOOP_S - 1) : frame;
  const caret = shown.typed.findIndex((n, i) => n < HERO_THEMES[i].title.length);
  const fade = { duration: 0.45 };
  return (
    <div className="flex w-full flex-col items-center gap-5 md:w-[400px] lg:w-[460px]">
      <FlipLabel text={shown.filled[0] > 0 ? "Campaign" : "Theme"} on={shown.filled[0] > 0} />
      <div
        ref={ref}
        role="img"
        aria-label="Four campaign titles are typed into a title list: The Ultimate Snack Drop, Spicy Chinese Takeout Vibe, The Sweetest Year-End Vibe and Matcha Core: Trending Now. An AI node lights up, and four phones fill with a campaign of matching products for each title."
        className="relative w-full max-w-[460px]"
        style={{ aspectRatio: `${SCENE_W} / ${SCENE_H}` }}
      >
        <motion.div
          initial={false}
          animate={{ opacity: shown.out ? 0 : 1 }}
          transition={fade}
          className="absolute left-1/2 top-0 origin-top"
          style={{ width: SCENE_W, height: SCENE_H, transform: `translateX(-50%) scale(${scale})` }}
        >
          <TitleCard typed={shown.typed} caret={caret === -1 ? HERO_THEMES.length - 1 : caret} />
          <AiNode on={shown.ai} />
          <Connectors on={shown.lines} still={still} />
          {HERO_THEMES.map((theme, i) => (
            <div key={theme.title} className="absolute" style={{ left: phoneX(i), top: TAG_Y }}>
              <motion.p
                initial={false}
                animate={{ opacity: shown.lines ? 1 : 0, y: shown.lines ? 0 : 4 }}
                transition={{ duration: 0.3, delay: still ? 0 : LINES_S * 0.8 }}
                className="mb-2 w-[100px] truncate rounded-full bg-accent px-2 py-1 text-center text-[9px] font-semibold text-paper"
              >
                {theme.emoji} {theme.title}
              </motion.p>
              <MiniPhone className="w-[100px]">
                <CampaignScreen theme={theme} shown={shown.filled[i]} />
              </MiniPhone>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <StoryHero
      chips={{ type: "AI Transformation", domain: "Commerce", proof: "A/B Validated" }}
      title={
        <>
          AI Curation: <br />
          Scaling Themed Campaigns
        </>
      }
      tagline="“You name the theme. AI does the rest.”"
      body={
        <>
          At Kurly, every themed campaign on the homepage was picked by hand. When the team behind
          them shrank, the homepage went stale. I led an AI system that turns a theme into a full
          campaign and keeps it fresh on its own.
        </>
      }
      meta={META}
      device={<ThemeToCampaigns />}
    />
  );
}

/* ------------------------------------------------------------------ */
/* 01 Context: KurlyHomepage                                           */
/* ------------------------------------------------------------------ */

const CONTEXT_BEATS: CopyBeat[] = [
  {
    headline: "Curation Is What Kurly Sells",
    body: [
      <>
        Kurly built its brand on picks: customers trust that if Kurly shows a product, it’s worth
        buying.
      </>,
      <>
        On the homepage, <B>themed campaigns</B> bring a new theme and a fresh mix of products every
        day. It’s where customers discover something new and enjoy shopping.
      </>,
    ],
  },
  {
    headline: "But the Curation Went Stale",
    body: [
      <>
        A space meant to show something new and good every day started showing{" "}
        <B>the same campaigns and products, day after day</B>.
      </>,
      <>
        With fewer merchandisers (MDs) on the curation team, keeping the campaigns fresh kept
        getting pushed back.
      </>,
    ],
  },
];

// Kurly's homepage, rebuilt in Figma at 1440 wide and cut into bands: the
// header, the banner, then five themed campaigns. Heights are in page px.
const HOME = "/images/ai-curation/homepage";
const PAGE_W = 1440;
// The window crops the page's empty sides: it shows x 130…1310.
const CROP_X = 130;
const VIEW_W = 1180;
const TOP_BANDS = [
  { src: `${HOME}/header.webp`, h: 196 },
  { src: `${HOME}/banner.webp`, h: 370 },
];
const CAMPAIGNS = [
  { src: `${HOME}/fruit.webp`, h: 722, title: "This week’s fruit specials" },
  { src: `${HOME}/gourmet.webp`, h: 698, title: "An autumn gourmet journey" },
  { src: `${HOME}/hydration.webp`, h: 722, title: "Seasonal hydration" },
  { src: `${HOME}/kitchenware.webp`, h: 696, title: "The hottest kitchenware right now" },
  { src: `${HOME}/snacks.webp`, h: 702, title: "Snacks everyone loves" },
];
const CAMPAIGNS_Y = TOP_BANDS.reduce((y, b) => y + b.h, 0);
const CAMPAIGN_TOPS = CAMPAIGNS.reduce<number[]>(
  (tops, c, i) => [...tops, i === 0 ? CAMPAIGNS_Y : tops[i - 1] + CAMPAIGNS[i - 1].h],
  [],
);
// The window shows this much of the page, in page px.
const WINDOW_H = 1000;
// Once nobody refreshes it, the page reloads day after day onto this same
// lineup, its autumn campaign and all.
const STUCK = 1;
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAY_S = 2.2;
// The pop-out card shows the campaign from x 150 to 1290, then grows past
// the window's edges.
const CARD_X = 150;
const CARD_W = 1140;
const POP = 1.1;
// The tour plays on its own: a short look at the top of the page, then a
// stop per campaign.
const TOP_S = 1.2;
const STOP_S = 2.8;
// Within a stop, in seconds: the page glides, the card pops, holds, settles.
const POP_TIMES = [0, 0.8, 0.85, 1.25, 2.2, 2.55, 2.65].map((t) => t / STOP_S);
const SHADOW_OFF = "0 0 0 0 rgba(0,0,0,0)";
const SHADOW_ON = "0 24px 48px -12px rgba(0,0,0,0.35)";

function KurlyHomepage({ step, live }: { step: number; live: boolean }) {
  const { ref, scale } = useFitScale(VIEW_W);
  const inView = useInView(ref, { amount: 0.5 });
  const stale = live && step >= 1;
  const touring = live && !stale && inView;
  // -1 is the top of the page; 0…4 stop on each campaign.
  const [stop, setStop] = useState(-1);
  useEffect(() => {
    if (!touring) return;
    const timer = setTimeout(
      () => setStop((s) => (s + 1 >= CAMPAIGNS.length ? -1 : s + 1)),
      (stop < 0 ? TOP_S : STOP_S) * 1000,
    );
    return () => clearTimeout(timer);
  }, [touring, stop]);
  // Leaving the tour starts it over from the top next time.
  if (!touring && stop !== -1) setStop(-1);

  // Stale, the days tick by and each reload brings back the same page.
  const [day, setDay] = useState(0);
  const reloading = stale && inView;
  useEffect(() => {
    if (!reloading) return;
    const timer = setInterval(() => setDay((d) => d + 1), DAY_S * 1000);
    return () => clearInterval(timer);
  }, [reloading]);

  const focus = touring ? stop : -1;
  const centered = focus >= 0 ? focus : stale ? STUCK : -1;
  const y =
    centered >= 0 ? -(CAMPAIGN_TOPS[centered] + CAMPAIGNS[centered].h / 2 - WINDOW_H / 2) : 0;
  const card = focus >= 0 ? CAMPAIGNS[focus] : null;

  return (
    <div
      role="img"
      aria-label={
        stale
          ? `Kurly’s homepage, greyed out, reloads day after day, Monday to Sunday, and shows the same “${CAMPAIGNS[STUCK].title}” campaign every time.`
          : `Kurly’s homepage scrolls past its themed campaigns, each one lifting out of the page in turn: ${CAMPAIGNS.map((c) => `“${c.title}”`).join(", ")}.`
      }
      className="mx-auto w-full max-w-[640px] rounded-xl border border-line bg-paper shadow-[0_12px_40px_-16px_rgba(0,0,0,0.18)]"
    >
      <div className="flex items-center gap-1.5 rounded-t-xl border-b border-line bg-paper-2 px-3 py-2">
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-2 rounded-full bg-line" />
        ))}
        <span className="ml-3 truncate rounded-md bg-paper px-3 py-0.5 text-[11px] text-ink-muted">
          kurly.com
        </span>
        {/* Reload: pressed and turned once with every new day. */}
        <motion.span
          key={`reload-${stale ? day : -1}`}
          aria-hidden
          className="ml-1.5 grid size-5 place-items-center rounded-full"
          initial={false}
          animate={
            stale && day > 0
              ? {
                  rotate: [0, 360],
                  scale: [1, 0.85, 1],
                  backgroundColor: ["rgba(0,0,0,0.12)", "rgba(0,0,0,0)"],
                }
              : {}
          }
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          <RotateCw className="size-3 text-ink-muted" strokeWidth={2.25} />
        </motion.span>
        {stale && (
          <motion.span
            key={`day-${day}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="ml-auto text-[11px] font-medium text-ink-muted"
          >
            {DAYS[day % DAYS.length]}
          </motion.span>
        )}
      </div>
      <div className="relative">
        <div
          ref={ref}
          className="relative overflow-hidden rounded-b-xl"
          style={{ height: WINDOW_H * scale }}
        >
          <motion.div
            className={cn(
              "absolute left-0 top-0 origin-top-left transition-[filter,opacity] duration-700",
              stale && "opacity-70 grayscale",
            )}
            style={{ width: PAGE_W, scale, x: -CROP_X * scale }}
            initial={false}
            // The page is scaled about its top-left, so moves are in screen px.
            animate={{ y: y * scale }}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.1 }}
          >
            {TOP_BANDS.map((b) => (
              // eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized WebP
              <img key={b.src} src={b.src} alt="" width={PAGE_W} height={b.h} className="block" />
            ))}
            {CAMPAIGNS.map((c, i) => (
              <motion.div
                key={i}
                initial={false}
                animate={{ opacity: focus < 0 || i === focus ? 1 : 0.4 }}
                transition={{ duration: 0.5 }}
                className="bg-paper"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized WebP */}
                <img src={c.src} alt="" width={PAGE_W} height={c.h} className="block" />
              </motion.div>
            ))}
          </motion.div>
          {/* Each reload blanks the page for a beat, then the same page returns. */}
          {stale && (
            <motion.div
              key={day}
              aria-hidden
              className="absolute inset-0 bg-paper"
              initial={{ opacity: 0 }}
              animate={{ opacity: day === 0 ? 0 : [0, 0.95, 0.95, 0] }}
              transition={{ duration: 1.1, times: [0, 0.25, 0.45, 1], ease: "easeInOut" }}
            />
          )}
        </div>

        {/* The campaign in focus, lifted out of the page: a copy laid exactly
            over it that grows past the window's edges, then settles back. */}
        {card && (
          <motion.div
            key={focus}
            aria-hidden
            className="pointer-events-none absolute z-10 overflow-hidden bg-paper"
            style={{
              left: (CARD_X - CROP_X) * scale,
              top: ((WINDOW_H - card.h) / 2) * scale,
              width: CARD_W * scale,
              height: card.h * scale,
              borderRadius: 16,
            }}
            initial={{ scale: 1, opacity: 0, boxShadow: SHADOW_OFF }}
            animate={{
              scale: [1, 1, 1, POP, POP, 1, 1],
              opacity: [0, 0, 1, 1, 1, 1, 0],
              boxShadow: [
                SHADOW_OFF,
                SHADOW_OFF,
                SHADOW_OFF,
                SHADOW_ON,
                SHADOW_ON,
                SHADOW_OFF,
                SHADOW_OFF,
              ],
            }}
            transition={{ duration: STOP_S, times: POP_TIMES, ease: "easeInOut" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized WebP */}
            <img
              src={card.src}
              alt=""
              width={PAGE_W}
              height={card.h}
              className="block max-w-none"
              style={{ width: PAGE_W * scale, marginLeft: -CARD_X * scale }}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}

export function Context() {
  return (
    <Chapter id="context" label="01 Context">
      {/* Step 0 plays the homepage tour on its own; one scroll turns it stale. */}
      <StickyScene
        steps={3}
        label="Kurly’s homepage, campaign by campaign, then the same campaign again and again"
      >
        {({ step, live }) => (
          <div
            className={cn(wrap, "grid grid-cols-1 items-center gap-10 md:grid-cols-[1fr_1.2fr]")}
          >
            <BeatCopy
              label="01 CONTEXT"
              beats={CONTEXT_BEATS}
              active={live && step >= 1 ? 1 : 0}
              live={live}
            />
            <KurlyHomepage step={step} live={live} />
          </div>
        )}
      </StickyScene>
    </Chapter>
  );
}

/* ------------------------------------------------------------------ */
/* 02 Impact                                                           */
/* ------------------------------------------------------------------ */

// Lands with the labels, one scroll counts the numbers up, a spare step holds.
const IMPACT: { to: Num; extra?: string; label: string }[] = [
  { to: { value: 25, suffix: "%" }, label: "of Key Homepage Slots Fully Automated by AI" },
  { to: { value: 200, suffix: "+" }, label: "Themed Campaigns Run by AI" },
  { to: { value: 2 }, extra: "days / week", label: "of MD Time Saved" },
];

export const PRESS = [
  {
    outlet: "Economist Korea",
    date: "Feb 2025",
    url: "https://economist.co.kr/article/view/ecn202502140048",
  },
  { outlet: "Viva100", date: "Feb 2025", url: "https://www.viva100.com/article/20250216500401" },
];

// From the homepage's campaigns, out to the two places that asked for the
// same logic. Only Beauty Kurly has shipped (2025).
function BeyondDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const still = useStill();
  const drawn = still || inView;
  const draw = (delay: number) => ({
    initial: still ? false : { pathLength: 0 },
    animate: { pathLength: drawn ? 1 : 0 },
    transition: { duration: 0.7, ease: EASE_OUT, delay },
  });
  return (
    <div
      ref={ref}
      role="img"
      aria-label="Arrows run from the homepage’s themed campaigns to two chips: Search tab, and Beauty Kurly, checked, 2025."
      className="relative grid h-full min-h-[220px] w-full grid-cols-[auto_1fr_auto] items-center gap-4 px-6 py-8 md:px-10"
    >
      <div className="flex flex-col items-center gap-2">
        <span className="grid size-16 grid-cols-2 gap-1 rounded-2xl bg-accent p-3">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="rounded-[3px] bg-paper/85" />
          ))}
        </span>
        <span className="text-center text-xs font-medium text-ink">
          Homepage
          <br />
          campaigns
        </span>
      </div>
      <svg aria-hidden viewBox="0 0 120 120" preserveAspectRatio="none" className="h-28 w-full">
        <motion.path
          d="M2 60 C50 60 60 20 120 20"
          fill="none"
          stroke="var(--color-ink-muted)"
          strokeWidth={1.25}
          vectorEffect="non-scaling-stroke"
          {...draw(0.1)}
        />
        <motion.path
          d="M2 60 C50 60 60 100 120 100"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={1.75}
          vectorEffect="non-scaling-stroke"
          {...draw(0.3)}
        />
      </svg>
      <div className="flex flex-col gap-8">
        <span className="rounded-full border border-line bg-paper px-4 py-2 text-sm text-ink-muted">
          Search tab
        </span>
        <motion.span
          initial={still ? false : { opacity: 0, scale: 0.9 }}
          animate={drawn ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.8 }}
          className="flex items-center gap-1.5 rounded-full border border-accent bg-paper px-4 py-2 text-sm font-medium text-accent"
        >
          <Check aria-hidden className="size-4" strokeWidth={2.5} />
          Beauty Kurly
          <span className="font-normal text-ink-muted">2025</span>
        </motion.span>
      </div>
    </div>
  );
}

function ImpactScene({ step, live }: { step: number; live: boolean }) {
  // Once counted, the numbers stay, even when scrolling back up.
  const [counted, setCounted] = useState(false);
  if (live && step >= 1 && !counted) setCounted(true);
  const play = live ? counted : undefined;
  return (
    <div className={wrap}>
      <SectionHeader label="02 IMPACT" headline="From Hand-Picked to Self-Running" />
      <Reveal>
        <Body className="mt-6">
          Built an AI system that <B>curates as well as Kurly’s expert MDs</B>: in a{" "}
          <span className="whitespace-nowrap">2-week</span> A/B test, its campaigns performed on par
          with theirs.
        </Body>
      </Reveal>

      <div className="mt-12 grid gap-10 border-t border-line pt-10 md:grid-cols-3 md:gap-8">
        {IMPACT.map((m, i) => (
          <Reveal key={m.label} delay={i * 0.1} className="flex flex-col items-center gap-2">
            <MetricCounter
              to={m.to}
              extra={m.extra}
              label={m.label}
              countFrom={0}
              play={play}
              className={CENTERED}
            />
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-16 grid items-center gap-8 md:grid-cols-[1.25fr_1fr] md:gap-12">
        <div className="overflow-hidden rounded-xl border-[0.5px] border-line bg-paper-2">
          <BeyondDiagram />
        </div>
        <div className="flex flex-col items-start gap-4">
          <h3 className="font-display font-medium tracking-tight text-[1.4rem] leading-tight text-ink md:text-[1.75rem]">
            Proven on the Homepage, Expanded Beyond It
          </h3>
          <p className="text-base leading-relaxed text-ink-muted md:text-lg">
            Once it proved its value on the homepage, the same AI curation was rolled out to other
            slots across Kurly, including <B>Beauty Kurly</B>.
          </p>
          <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
            <span className="text-xs font-medium uppercase tracking-[0.15em] text-ink-muted">
              In the press
            </span>
            {PRESS.map((p) => (
              <a
                key={p.url}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className={textLink}
              >
                {p.outlet} ({p.date}) ↗
              </a>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

export function Impact() {
  return (
    <Chapter id="impact" label="02 Impact">
      <StickyScene steps={3} label="Results, counting up">
        {({ step, live }) => <ImpactScene step={step} live={live} />}
      </StickyScene>
    </Chapter>
  );
}

/* ------------------------------------------------------------------ */
/* 03 Role and Responsibility                                          */
/* ------------------------------------------------------------------ */

const ROLES: Role[] = [
  {
    title: "Strategy",
    // The ask came up from the MD team (05): their arrow draws bold.
    cue: "request",
    body: (
      <>
        Defined the problem from the interviews and set the plan:{" "}
        <B>give MDs an internal copilot first</B>, so they could trust the AI and help us improve
        it, then test it with customers, then launch. Framed it as the first step of a homepage
        personalization roadmap.
      </>
    ),
  },
  {
    title: "UX",
    cue: "me",
    body: (
      <>
        Interviewed <B>8 MDs and marketers</B> to map the campaign workflow. Designed the{" "}
        <B>Campaign Copilot UI</B> and the <B>Google Sheet</B> MDs use to launch campaigns, and
        trained MDs on every update with guides I wrote and kept up to date.
      </>
    ),
  },
  {
    title: "Execution",
    cue: "team",
    body: (
      <>
        Designed and ran the internal evaluations and the A/B test, worked with the ML engineer who
        built the curation algorithm, designed the system architecture that connected AI curation to
        Kurly’s <B>inventory and content management tools</B>, and led QA through launch.
      </>
    ),
  },
  {
    title: "Alignment",
    cue: "links",
    body: (
      <>
        Kept the CEO, the MD and marketing teams, and the data team on the same page, from model
        choice to rollout.
      </>
    ),
  },
];

export function Roles() {
  return (
    <RolesChapter
      headline="Turning an MD’s Craft into a System"
      roles={ROLES}
      below={[
        { label: "MD Team", w: 120 },
        { label: "Marketing Team", w: 158 },
        { label: "Data Team", w: 118 },
      ]}
      orgLabel="Team structure: the AI PM (me) reports to and gets approval from the C-level, works in one team with an ML engineer and a backend engineer, and works back and forth with the MD, marketing and data teams. The request came up from the MD team."
    />
  );
}

/* ------------------------------------------------------------------ */
/* Hook                                                                */
/* ------------------------------------------------------------------ */

export function Hook() {
  return (
    <div className="border-t border-line">
      <HookLines
        first="Customers came to Kurly to discover something new."
        second="The homepage kept showing them the same things."
        label="Customers came to discover; the homepage repeated itself"
      />
    </div>
  );
}
