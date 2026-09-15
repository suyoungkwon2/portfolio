import type { WorkSector } from "@/content/works";

export type ProjectChips = {
  domain: string;
  problem: string;
  tech: string[];
};

export type ProjectMeta = {
  slug: string;
  sector: WorkSector;
  tag: string;
  year: string;
  title: string;
  subtitle: string;
  tagline: string;
  period: string;
  role: string;
  team: string;
  org: string;
  chips: ProjectChips;
};

// Detail-page metadata for the shared ProjectHero template. Card-facing
// summary copy (title/summary/metrics for the grid) stays in works.ts —
// this file is the fuller, per-project record sourced from
// docs/projects/*.md (portfolio PDF + CVs).
export const projects: Record<string, ProjectMeta> = {
  mars: {
    slug: "mars",
    sector: "Healthcare / Education",
    tag: "Applied AI Research",
    year: "2025",
    title: "MARS — AI Clinical Documentation",
    subtitle: "Re-engineering clinical workflow with GenAI",
    tagline: "Get time back. Move care forward.",
    period: "Sep – Oct 2025 · 27-day datathon",
    role: "Team Lead, PM, AI Research, Prompt Engineering",
    team: "4 — PM (me), 2 LLM engineers, 1 clinical advisor",
    org: "SNUBH × KAIST Datathon",
    chips: { domain: "Medical", problem: "Clinical Documentation", tech: ["NLP", "AI"] },
  },
  phonitale: {
    slug: "phonitale",
    sector: "Healthcare / Education",
    tag: "Published Research",
    year: "2025",
    title: "Phonitale — AI Vocabulary Mnemonics",
    subtitle: "AI-powered mnemonic foreign vocab learning",
    tagline: "Memorizing foreign words shouldn't feel like torture.",
    period: "Mar – Jun 2025",
    role: "PM, AI Research, Evaluation Design, Platform Dev",
    team: "5 researchers + 2 faculty advisors",
    org: "CMU Language Technology Institute",
    chips: { domain: "Education", problem: "Learning Language", tech: ["NLP", "AI"] },
  },
  sommind: {
    slug: "sommind",
    sector: "Healthcare / Education",
    tag: "0 → 1 · DTx",
    year: "2022–23",
    title: "SomMind — Insomnia Digital Therapeutic",
    subtitle: "Digital therapeutic app for severe insomnia",
    tagline: "Healthy sleep starts with a healthy mind.",
    period: "Jun 2022 – Mar 2023",
    role: "Team Lead, PM, Clinical Program & Trial Design, Regulatory",
    team: "Medical director, product designer, FE/BE/QA eng, writer",
    org: "Asleep × Seoul National University Bundang Hospital",
    chips: { domain: "Digital Health", problem: "Insomnia", tech: ["Digital Therapeutics", "CBT-i"] },
  },
  "ai-search": {
    slug: "ai-search",
    sector: "AI / Business",
    tag: "AI Transformation",
    year: "2024",
    title: "AI Search — Recovering Lost Revenue",
    subtitle: "Enhancing search experience & driving sales",
    tagline: "Just type it out. We'll find what you need.",
    period: "May – Aug 2024",
    role: "PM, A/B Test Design, CEO Communication, QA",
    team: "1 ML engineer, 1 backend engineer",
    org: "Kurly",
    chips: { domain: "Commerce", problem: "Search UX", tech: ["Vector Search", "AI"] },
  },
  "ai-curation": {
    slug: "ai-curation",
    sector: "AI / Business",
    tag: "Automation at Scale",
    year: "2024",
    title: "AI Curation — Scaling Themed Campaigns",
    subtitle: "AI-driven scaling of themed campaigns",
    tagline: "You name the theme. AI does the rest.",
    period: "Jun – Dec 2024",
    role: "PM, A/B Test Design, UX Research, CEO Communication",
    team: "1 ML engineer, 1 backend engineer",
    org: "Kurly",
    chips: { domain: "Commerce", problem: "Work Efficiency", tech: ["Vector Search", "AI"] },
  },
  asleeptrack: {
    slug: "asleeptrack",
    sector: "AI / Business",
    tag: "0 → 1 · B2B SaaS",
    year: "2023–24",
    title: "AsleepTrack — B2B Sleep AI Platform",
    subtitle: "Ultimate AI sleep tracking module",
    tagline: "Expand your service horizons with sleep integration.",
    period: "Apr 2023 – Mar 2024",
    role: "Team Lead, PM, Customer Success, Dev Docs Management",
    team: "Technical PM, FE/BE/SDK eng, QA eng, product designer",
    org: "Asleep",
    chips: { domain: "B2B SaaS", problem: "AI Integration", tech: ["SaaS", "API/SDK"] },
  },
  sleepvice: {
    slug: "sleepvice",
    sector: "Healthcare / Education",
    tag: "Bonus · VUI Application",
    year: "2021–22",
    title: "SleepVice — Alexa Voice App for Sleep",
    subtitle: "Alexa voice application for best sleep quality",
    tagline: "Personal sleep coach right by your pillow.",
    period: "Jun 2021 – Jun 2022",
    role: "PM, VUI Design, UX Research",
    team: "3-person task force — biz dev, PM/VUI (me), engineer",
    org: "Asleep",
    chips: { domain: "Smart Home", problem: "Sleep Distress", tech: ["Alexa", "IoT", "VUI"] },
  },
};

// Site order, matching docs/projects/README.md — drives prev/next nav on
// the detail pages. sleepvice ships as a detail page (source content
// exists) but has no Selected Works card yet — see that file's README
// for the open placement decision.
export const projectOrder = [
  "mars",
  "phonitale",
  "sommind",
  "ai-search",
  "ai-curation",
  "asleeptrack",
  "sleepvice",
];
