import type { MeshSettings } from "@/components/GradientBackdrop";
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
  // Colors for a slowly moving mesh-gradient backdrop. With a thumbnail,
  // the image (a transparent PNG) sits on top of it.
  gradient?: string[];
  // Overrides for the backdrop's mesh shape (distortion, swirl, offsetY).
  mesh?: MeshSettings;
  // Looping demo clip shown in place of the thumbnail.
  video?: string;
  // "framed" (default) sits the clip in a small window on a gray panel (or
  // the gradient backdrop), for UI recordings; "full" fills the whole card,
  // for full-bleed footage.
  videoLayout?: "framed" | "full";
  // Still shown until the video loads (its first frame).
  videoPoster?: string;
};

// Shader backdrop palettes. Mesh gradients blend in RGB, so two far-apart
// hues meet in gray; keeping light tones between them keeps the mix bright.
//
// Asleep's lavender-blue, from the SomMind key visual, with a lilac accent.
const SOMMIND_GRADIENT = ["#C9D1E5", "#A8B5F3", "#EEF2FC", "#8AA2F4", "#D4C8F4"];
// The same family for AsleepTrack, minus the deep blue, with a soft mint
// beside a cool white so it fades into the blues through light, not gray.
const ASLEEPTRACK_GRADIENT = ["#C9D1E5", "#A8B5F3", "#EEF2FC", "#C8EEDF", "#F2FBF8"];
// Kurly's navy, from the AI Search / AI Curation key visuals: mostly navy
// with a lifted blue. The accents (lavender / purple) are mixed about halfway
// toward navy so they read as a soft tint, not a bright glow.
const KURLY_NAVY = ["#0F122E", "#1A1E44", "#0F122E", "#151A3C", "#0F122E"];
const AI_SEARCH_GRADIENT = [...KURLY_NAVY, "#6B63A8"];
const AI_CURATION_GRADIENT = [...KURLY_NAVY, "#5738A0"];
// Calmer shape for the Kurly cards: little distortion and no swirl, with
// the color spots shifted vertically.
const KURLY_MESH = { distortion: 0.12, swirl: 0, offsetY: 0.2 };
// PhoniTale's gray demo panel with a little SomMind sky blue mixed in.
const PHONITALE_GRADIENT = ["#E1E6E9", "#D3DCF0", "#EEF2FC", "#BFCBF2"];

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
    metrics: "$3.5M+ monthly revenue recovered · No-result rate 6.8% → 0.22%",
    year: "2024",
    thumbnail: "/images/ai-search/thumbnail.webp",
    gradient: AI_SEARCH_GRADIENT,
    mesh: KURLY_MESH,
  },
  {
    slug: "ai-curation",
    sector: "Projects",
    tag: "Automation at Scale",
    title: "AI Curation: Scaling Themed Campaigns",
    summary:
      "Built an AI system that lets merchandisers launch themed campaigns from a single input, validated at parity with expert human curation via a 49K-user A/B test.",
    metrics: "~2 days/week of merchandiser work saved · 25% of homepage slots",
    year: "2024",
    thumbnail: "/images/ai-curation/thumbnail.webp",
    gradient: AI_CURATION_GRADIENT,
    mesh: KURLY_MESH,
  },
  {
    slug: "asleeptrack",
    sector: "Projects",
    tag: "0 → 1 · B2B SaaS",
    title: "AsleepTrack: B2B Sleep AI Platform",
    summary:
      "Took Asleep's sleep-tracking AI from a hard-to-integrate model to a full API/SDK/Dashboard platform, landing SK Telecom, LG, and KB Healthcare as clients within 3 months of launch.",
    metrics: "$60K+ MRR within 3 months of launch · First B2B revenue line",
    year: "2023–24",
    thumbnail: "/images/asleeptrack/thumbnail.webp",
    gradient: ASLEEPTRACK_GRADIENT,
  },
  {
    slug: "sommind",
    sector: "Projects",
    tag: "0 → 1 · DTx",
    title: "SomMind: Insomnia Digital Therapeutic",
    summary:
      "Owned product, clinical-trial design, and regulatory strategy for a CBT-i mobile app built with Seoul National University Bundang Hospital, from patient research through certified clinical trial approval.",
    metrics: "K-GMP certified · K-FDA clinical trial approved",
    year: "2022–23",
    thumbnail: "/images/sommind/thumbnail.webp",
    gradient: SOMMIND_GRADIENT,
  },
  {
    slug: "sleepvice",
    sector: "Projects",
    tag: "0 → 1 · Voice UX",
    title: "SleepVice: Alexa Voice App for Sleep",
    summary:
      "Led product and voice design for an Alexa Skill that brings Asleep's sleep-tracking AI to the Echo, with sleep-stage smart alarms and lighting, refined through two rounds of usability testing.",
    metrics: "Korea's first Alexa Startups partner · Supported a $12M Series B",
    year: "2021–22",
    video: "/images/sleepvice/vid_thumbnail.mp4",
    videoLayout: "full",
    videoPoster: "/images/sleepvice/vid_thumbnail_poster.webp",
  },
  {
    slug: "mars",
    sector: "AI Research",
    tag: "Applied AI Research",
    title: "M.A.R.S: AI Clinical Documentation",
    summary:
      "Led a 4-person team building a 3-module GenAI pipeline that drafts discharge summaries from real patient records, for Seoul National University Bundang Hospital during Korea's national medical staffing crisis.",
    metrics: "2nd of 100 teams · Seoul National University Hospital Datathon",
    year: "2025",
    thumbnail: "/images/mars/thumbnail.webp",
    video: "/images/mars/vid_hero.mp4",
    videoLayout: "full",
    videoPoster: "/images/mars/vid_hero_poster.webp",
  },
  {
    slug: "phonitale",
    sector: "AI Research",
    tag: "Published Research",
    title: "PhoniTale: AI Memory Tricks for Foreign Words",
    summary:
      "Designed an NLP pipeline that generates phonologically grounded mnemonics for learners of typologically distant languages, matching the recall rate of human-authored study aids.",
    metrics: "EMNLP 2025 Main Conference · On par with human experts",
    year: "2025",
    video: "/images/phonitale/vid_web.mp4",
    gradient: PHONITALE_GRADIENT,
  },
];

// Only published projects get a card, in projectOrder.
export const works: WorkItem[] = projectOrder.map(
  (slug) => allWorks.find((w) => w.slug === slug)!,
);

// The landing page's "Selected Projects", in this order. The rest stay on
// the Projects and Research pages.
export const featuredSlugs = ["phonitale", "sommind", "ai-curation", "ai-search"];
