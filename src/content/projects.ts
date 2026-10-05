export type ProjectChips = {
  domain: string;
  problem: string;
  tech: string[];
};

export type RelatedLink = {
  label: string;
  url: string;
};

// "10s Summary" — the What / Why / How strip under the hero.
export type ProjectSummary = {
  what: string;
  why: string;
  how: string;
};

export type ProjectMeta = {
  slug: string;
  title: string;
  subtitle: string;
  tagline: string;
  period: string;
  role: string[];
  team: string[];
  org: string;
  chips: ProjectChips;
  relatedLinks: RelatedLink[];
  summary?: ProjectSummary;
  // Number of portfolio-PDF spreads in /public/images/<slug>/slides. Without
  // a detail component the route shows these slides as the page body; with
  // one, they follow it.
  slides?: number;
};

// Detail-page metadata for the shared ProjectHero template. Card-facing
// summary copy (title/summary/metrics for the grid) stays in works.ts —
// this file is the fuller, per-project record sourced from
// docs/projects/*.md (portfolio PDF + CVs).
export const projects: Record<string, ProjectMeta> = {
  mars: {
    slug: "mars",
    title: "M.A.R.S: AI Clinical Documentation",
    subtitle: "Hospital LLM Datathon",
    tagline: "Get time back. Move care forward.",
    period: "September 2025\n- October 2025",
    role: ["Team Lead & PM", "System Design", "Prompt Engineering", "Clinical Evaluation"],
    team: ["PM (Me)", "2 LLM Engineers", "1 Clinical Advisor"],
    org: "Seoul National University Hospital",
    chips: { domain: "Medical", problem: "Clinical Documentation", tech: ["NLP", "AI"] },
    // News and LinkedIn links are shown under the Result headline in MarsOverview.
    relatedLinks: [],
    summary: {
      what: "Built an LLM system that writes discharge summaries from real hospital records. Won 2nd place in Seoul National University Bundang Hospital's datathon.",
      why: "Doctors spend up to 30% of their time turning messy notes into discharge summaries, and a national strike left them even more short-staffed.",
      how: "Cleaned up noisy, duplicated records, then designed department-specific, multi-step prompts with guardrails against hallucination, validated by clinicians.",
    },
    slides: 4,
  },
  phonitale: {
    slug: "phonitale",
    title: "PhoniTale: AI Memory Tricks for Foreign Words",
    subtitle: "AI Research Project",
    tagline: "Memorizing foreign words shouldn't feel like torture.",
    period: "March 2025\n- June 2025",
    role: ["Evaluation Design", "UX/UI Design", "Platform Dev", "Data Analysis"],
    team: ["Evaluation Lead (Me)*", "2 Engineers*", "1 PhD Student", "3 Faculty Advisors"],
    org: "CMU\nSchool of Computer Science, Language Technology Institute",
    chips: { domain: "Education", problem: "Learning Language", tech: ["NLP", "AI"] },
    // Shown under the Result headline in PhonitaleDetail instead.
    relatedLinks: [],
    summary: {
      what: "Built an AI that helps you memorize foreign words by linking them to sound-alike words in your own language. Published at EMNLP 2025.",
      why: "For languages that sound very different, like English and Korean, LLM-based methods couldn’t produce good mnemonics.",
      how: "Mapped foreign sounds into native syllables, matched them to real words, and wove them into a memorable sentence. It worked as well as mnemonics written by human experts.",
    },
  },
  sommind: {
    slug: "sommind",
    title: "SomMind: Insomnia Digital Therapeutic",
    subtitle: "Digital Therapeutic App",
    tagline: "Healthy sleep starts with a healthy mind.",
    period: "June 2022\n- March 2023",
    role: ["Team Lead", "PM", "Clinical Program & Trial Design", "Regulatory"],
    team: [
      "Team Lead & PM (Me)",
      "Medical Director",
      "Product Designer",
      "FE/BE/QA Engineers",
      "Content Writer",
    ],
    org: "Asleep × Seoul National University Bundang Hospital",
    chips: { domain: "Digital Health", problem: "Insomnia", tech: ["Digital Therapeutics", "CBT-i"] },
    relatedLinks: [
      {
        label: "CBT-i DTx Introduction Slide: Symposium Presentation Materials",
        url: "https://drive.google.com/file/d/1Pq8vjPSfQrwcYdiOhIpOvGTcVKvJTh6Q/view?usp=sharing",
      },
    ],
    summary: {
      what: "Built a 4-week insomnia therapy app with Seoul National University Bundang Hospital, so a clinic-only treatment can be done at home. It earned medical-device certification and K-FDA approval for its clinical trial.",
      why: "The best drug-free treatment for insomnia means weekly clinic visits, paper sleep diaries, and too few trained therapists, so most patients end up relying on sleeping pills instead.",
      how: "Broke the therapy into short animated lessons and a quick daily sleep diary, and had the app adjust each patient's bedtime every week based on how they actually slept.",
    },
    slides: 5,
  },
  "ai-search": {
    slug: "ai-search",
    title: "AI Search: Recovering Lost Revenue",
    subtitle: "AI Transformation",
    tagline: "Just type it out. We'll find what you need.",
    period: "May 2024\n- August 2024",
    role: ["PM", "A/B Test Design", "CEO Communication", "QA"],
    team: ["PM (Me)", "1 ML Engineer", "1 Backend Engineer"],
    org: "Kurly",
    chips: { domain: "Commerce", problem: "Search UX", tech: ["Vector Search", "AI"] },
    relatedLinks: [
      {
        label: "Developer Blog",
        url: "https://helloworld.kurly.com/blog/vertex-ai-search-NR/",
      },
      {
        label: "[YouTube] Next Commerce: Curation and AI, Google Cloud Summit 2024",
        url: "https://youtu.be/qv0YMg7kwuM?si=km0mZKGjRI3rPVdX&t=2333",
      },
    ],
    summary: {
      what: "Cut \"no results\" searches from 6.8% to 0.22%, unlocking ₩5B (~$3.6M) in new monthly revenue.",
      why: "The search engine couldn't handle typos, spacing, or synonyms, so 7% of searches on Kurly's biggest revenue channel hit a dead end.",
      how: "When the old search came up empty, we fell back to semantic search with Vertex AI, so \"cabage\" still finds cabbage.",
    },
    slides: 4,
  },
  "ai-curation": {
    slug: "ai-curation",
    title: "AI Curation: Scaling Themed Campaigns",
    subtitle: "Internal Tool + AI Transformation",
    tagline: "You name the theme. AI does the rest.",
    period: "June 2024\n- December 2024",
    role: ["PM", "A/B Test Design", "UX Research", "CEO Communication"],
    team: ["PM (Me)", "1 ML Engineer", "1 Backend Engineer"],
    org: "Kurly",
    chips: { domain: "Commerce", problem: "Work Efficiency", tech: ["Vector Search", "AI"] },
    relatedLinks: [
      {
        label:
          "AI Revolutionizes Grocery Shopping: Kurly's Full-Scale Implementation from Recommendations to Search Optimization",
        url: "https://economist.co.kr/article/view/ecn202502140048",
      },
      {
        label:
          "The Rise of Hyper-Personalization: Active Adoption of AI-Based Product Recommendations in Retail",
        url: "https://www.viva100.com/article/20250216500401",
      },
    ],
    summary: {
      what: "Automated themed campaigns with AI, now running 200+ campaigns across 25% of Kurly's key homepage slots, with no human curation.",
      why: "With fewer merchandisers, campaigns went stale, sold-out items lingered, and there was no way to scale.",
      how: "Built a system where you type a theme and AI picks, ranks, and refreshes products every hour. An A/B test showed it performs on par with human curators.",
    },
    slides: 4,
  },
  asleeptrack: {
    slug: "asleeptrack",
    title: "AsleepTrack: B2B Sleep AI Platform",
    subtitle: "B2B AI SaaS Platform",
    tagline: "Expand your service horizons with sleep integration.",
    period: "April 2023\n- March 2024",
    role: ["Team Lead", "PM", "Customer Success", "Dev Docs Management"],
    team: [
      "Team Lead & PM (Me)",
      "Technical PM",
      "FE/BE/SDK Engineers",
      "QA Engineer",
      "Product Designer",
    ],
    org: "Asleep",
    chips: { domain: "B2B SaaS", problem: "AI Integration", tech: ["SaaS", "API/SDK"] },
    relatedLinks: [
      { label: "AsleepTrack", url: "https://www.asleep.ai/en/home" },
      { label: "Developer Documents", url: "https://docs-en.asleep.ai/" },
      { label: "AWS x Asleep Video", url: "https://www.youtube.com/watch?v=ZKWwMvpdFZ0" },
      {
        label: "Service Introduction Video",
        url: "https://youtu.be/KekgHje_LNU?si=13DuZC0CJOKpM1vL",
      },
    ],
    summary: {
      what: "Turned Asleep's sleep-tracking AI into an API, SDK, and dashboard that other companies plug into their own apps. It became the company's first B2B revenue line, at $60K+ MRR.",
      why: "Asleep's AI tracked sleep more accurately than Apple Watch or Fitbit, but plugging the raw model into a client's product was so hard that no one could adopt it at scale.",
      how: "Wrapped the model in a simple module that needs only a phone microphone, with docs and pay-as-you-go pricing. SK Telecom, LG, and KB Healthcare signed on within 3 months of launch.",
    },
    slides: 4,
  },
  sleepvice: {
    slug: "sleepvice",
    title: "SleepVice: Alexa Voice App for Sleep",
    subtitle: "Alexa Voice App (Skill)",
    tagline: "Personal sleep coach right by your pillow.",
    period: "June 2021\n- June 2022",
    role: ["PM", "VUI Design", "UX Research"],
    team: ["PM & VUI Designer (Me)", "Business Developer", "Software Engineer"],
    org: "Asleep",
    chips: { domain: "Smart Home", problem: "Sleep Distress", tech: ["Alexa", "IoT", "VUI"] },
    relatedLinks: [
      {
        label: "Asleep Becomes Korea's First Official Partner for Amazon Alexa",
        url: "https://www.sedaily.com/article/13252269",
      },
      {
        label: "Asleep Secures ₩16 Billion Series B Investment; Valuation Hits ₩90 Billion",
        url: "https://platum.kr/archives/183395",
      },
      {
        label: '"Alexa, How Did I Sleep Last Night?": Asleep Joins Forces with Amazon Alexa',
        url: "https://medigatenews.com/news/2902071943",
      },
      {
        label: "14 Incredible Startups Innovating with Alexa at CES",
        url: "https://developer.amazon.com/en-US/blogs/alexa/device-makers/2022/01/ces-alexa-startups",
      },
      {
        label: "Asleep x Amazon SleepVice Skill Introduction Video",
        url: "https://youtu.be/0YZh3R8lwuI",
      },
    ],
    summary: {
      what: "Built an Alexa voice app that tracks your sleep and coaches you through the night. It made Asleep Korea's first official Amazon Alexa startup partner and landed a spot at CES 2022.",
      why: "50 to 70 million Americans have a sleep disorder, and the bedroom itself (light, noise, routine) is a big part of it. Asleep's AI could read sleep stages but had no way to act on the room.",
      how: "Designed voice conversations for sleep reports, smart alarms, and lights that dim and brighten with your sleep stage. Two rounds of user testing made it shorter and friendlier, raising task success from 83% to 88%.",
    },
    slides: 4,
  },
};

// Published projects, in site order: AI Research first, then Projects, to
// match the Selected Works sections. Drives the cards, the generated /work
// routes, and prev/next nav on the detail pages.
export const projectOrder = [
  "mars",
  "phonitale",
  "sommind",
  "ai-curation",
  "ai-search",
  "sleepvice",
  "asleeptrack",
];
