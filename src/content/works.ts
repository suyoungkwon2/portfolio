import { projectOrder } from "./projects";

export type WorkSector = "Projects" | "AI Research";

export type WorkItem = {
  slug: string;
  sector: WorkSector;
  tag: string;
  title: string;
  summary: string;
  metrics?: string;
  year: string;
  // 16:10 card image (1600x1000); falls back to a sector gradient.
  thumbnail?: string;
  // Looping demo clip shown in place of the thumbnail.
  video?: string;
};

// Real case studies, sourced and cross-referenced from
// docs/projects/*.md (portfolio PDF + CVs + legacy-jekyll write-ups).
// Card copy for every case study, published or not; `works` below picks the
// published ones in projectOrder (projects.ts).
const allWorks: WorkItem[] = [
  {
    slug: "ai-search",
    sector: "Projects",
    tag: "AI Transformation",
    title: "AI Search: Recovering Lost Revenue",
    summary:
      "Shipped a Vertex AI search layer that rescues Kurly's 'No Result' searches, validated on a 3.5M-MAU A/B test, then hardened it for production with caching and cost controls.",
    metrics: "No-result rate 6.8% → 0.22% · 30% lower operating cost",
    year: "2024",
    thumbnail: "/images/ai-search/thumbnail.webp",
  },
  {
    slug: "ai-curation",
    sector: "Projects",
    tag: "Automation at Scale",
    title: "AI Curation: Scaling Themed Campaigns",
    summary:
      "Built an AI system that lets merchandisers launch themed campaigns from a single input, validated at parity with expert human curation via a 49K-user A/B test.",
    metrics: "25% of homepage slots · 200+ campaigns, zero manual ops",
    year: "2024",
    thumbnail: "/images/ai-curation/thumbnail.webp",
  },
  {
    slug: "asleeptrack",
    sector: "Projects",
    tag: "0 → 1 · B2B SaaS",
    title: "AsleepTrack: B2B Sleep AI Platform",
    summary:
      "Took Asleep's sleep-tracking AI from a hard-to-integrate model to a full API/SDK/Dashboard platform, landing SK Telecom, LG, and KB Healthcare as clients within 3 months of launch.",
    metrics: "$60K+ MRR, the company's first B2B revenue line",
    year: "2023–24",
  },
  {
    slug: "sommind",
    sector: "Projects",
    tag: "0 → 1 · DTx",
    title: "SomMind: Insomnia Digital Therapeutic",
    summary:
      "Owned product, clinical-trial design, and regulatory strategy for a CBT-i mobile app built with Seoul National University Bundang Hospital, from patient research through certified clinical trial approval.",
    metrics: "KGMP + K-FDA clinical trial approval secured",
    year: "2022–23",
  },
  {
    slug: "mars",
    sector: "AI Research",
    tag: "Applied AI Research",
    title: "MARS: AI Clinical Documentation",
    summary:
      "Led a 4-person team building a 3-module GenAI pipeline that drafts discharge summaries from real patient records, for Seoul National University Bundang Hospital during Korea's national medical staffing crisis.",
    metrics: "Excellence Award, 2nd of 10 finalists, SNUBH × KAIST Datathon",
    year: "2025",
    thumbnail: "/images/mars/thumbnail.webp",
  },
  {
    slug: "phonitale",
    sector: "AI Research",
    tag: "Published Research",
    title: "PhoniTale: AI Memory Tricks for Foreign Words",
    summary:
      "Designed an NLP pipeline that generates phonologically grounded mnemonics for learners of typologically distant languages, matching the recall rate of human-authored study aids.",
    metrics: "Published, EMNLP 2025 Main Conference",
    year: "2025",
    video: "/images/phonitale/vid_web.mp4",
  },
];

// Only published projects get a card, in projectOrder.
export const works: WorkItem[] = projectOrder.map(
  (slug) => allWorks.find((w) => w.slug === slug)!,
);

// AI Research leads for now (temporary ordering).
export const workSectors: WorkSector[] = ["AI Research", "Projects"];
