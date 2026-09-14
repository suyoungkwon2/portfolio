export type WorkSector = "Healthcare / Education" | "AI / Business";

export type WorkItem = {
  slug: string;
  sector: WorkSector;
  tag: string;
  title: string;
  summary: string;
  metrics?: string;
  year: string;
};

// Real case studies, sourced and cross-referenced from
// docs/projects/*.md (portfolio PDF + CVs + legacy-jekyll write-ups).
// Site order matches docs/projects/README.md.
export const works: WorkItem[] = [
  {
    slug: "mars",
    sector: "Healthcare / Education",
    tag: "Applied AI Research",
    title: "MARS — AI Clinical Documentation",
    summary:
      "Led a 4-person team building a 3-module GenAI pipeline that drafts discharge summaries from real patient records, for Seoul National University Bundang Hospital during Korea's national medical staffing crisis.",
    metrics: "Excellence Award — 2nd of 10 finalists, SNUBH × KAIST Datathon",
    year: "2025",
  },
  {
    slug: "phonitale",
    sector: "Healthcare / Education",
    tag: "Published Research",
    title: "Phonitale — AI Vocabulary Mnemonics",
    summary:
      "Designed an NLP pipeline that generates phonologically grounded mnemonics for learners of typologically distant languages, matching the recall rate of human-authored study aids.",
    metrics: "Published, EMNLP 2025 Main Conference",
    year: "2025",
  },
  {
    slug: "sommind",
    sector: "Healthcare / Education",
    tag: "0 → 1 · DTx",
    title: "SomMind — Insomnia Digital Therapeutic",
    summary:
      "Owned product, clinical-trial design, and regulatory strategy for a CBT-i mobile app built with Seoul National University Bundang Hospital, from patient research through certified clinical trial approval.",
    metrics: "KGMP + K-FDA clinical trial approval secured",
    year: "2022–23",
  },
  {
    slug: "ai-search",
    sector: "AI / Business",
    tag: "AI Transformation",
    title: "AI Search — Recovering Lost Revenue",
    summary:
      "Shipped a Vertex AI search layer that rescues Kurly's 'No Result' searches, validated on a 3.5M-MAU A/B test, then hardened it for production with caching and cost controls.",
    metrics: "174x revenue lift · 35.5x ROI",
    year: "2024",
  },
  {
    slug: "ai-curation",
    sector: "AI / Business",
    tag: "Automation at Scale",
    title: "AI Curation — Scaling Themed Campaigns",
    summary:
      "Built an AI system that lets merchandisers launch themed campaigns from a single input, validated at parity with expert human curation via a 49K-user A/B test.",
    metrics: "25% of homepage slots · 200+ campaigns, zero manual ops",
    year: "2024",
  },
  {
    slug: "asleeptrack",
    sector: "AI / Business",
    tag: "0 → 1 · B2B SaaS",
    title: "AsleepTrack — B2B Sleep AI Platform",
    summary:
      "Took Asleep's sleep-tracking AI from a hard-to-integrate model to a full API/SDK/Dashboard platform, landing SK Telecom, LG, and KB Healthcare as clients within 3 months of launch.",
    metrics: "$70K MRR — company's first B2B revenue line",
    year: "2023–24",
  },
];

export const workSectors: WorkSector[] = ["Healthcare / Education", "AI / Business"];
