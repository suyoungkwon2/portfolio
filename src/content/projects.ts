export type ProjectChips = {
  domain: string;
  problem: string;
  tech: string[];
};

export type RelatedLink = {
  label: string;
  url: string;
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
};

// Detail-page metadata for the shared ProjectHero template. Card-facing
// summary copy (title/summary/metrics for the grid) stays in works.ts —
// this file is the fuller, per-project record sourced from
// docs/projects/*.md (portfolio PDF + CVs).
export const projects: Record<string, ProjectMeta> = {
  mars: {
    slug: "mars",
    title: "MARS — AI Clinical Documentation",
    subtitle: "Re-engineering clinical workflow with GenAI",
    tagline: "Get time back. Move care forward.",
    period: "Sep – Oct 2025",
    role: ["Team Lead", "PM", "AI Research", "Prompt Engineering"],
    team: ["PM (me)", "2 LLM engineers", "1 clinical advisor"],
    org: "SNUBH × KAIST Datathon",
    chips: { domain: "Medical", problem: "Clinical Documentation", tech: ["NLP", "AI"] },
    relatedLinks: [
      {
        label:
          "KAIST College of Business Wins Excellence Award at 'M.A.R.S. Medical Record Generation Datathon'",
        url: "https://www.joongang.co.kr/article/25379464",
      },
      {
        label: "LinkedIn Post",
        url: "https://www.linkedin.com/posts/kaist-college-of-business_kcb-kaistqsvsmpqxmukr-tcustwswmtxuqsvsmpqxmukr-activity-7392430373407756288-_pUX",
      },
    ],
  },
  phonitale: {
    slug: "phonitale",
    title: "Phonitale — AI Vocabulary Mnemonics",
    subtitle: "AI-powered mnemonic foreign vocab learning",
    tagline: "Memorizing foreign words shouldn't feel like torture.",
    period: "Mar – Jun 2025",
    role: ["PM", "AI Research", "Evaluation Design", "Platform Dev"],
    team: ["5 researchers", "2 faculty advisors"],
    org: "CMU Language Technology Institute",
    chips: { domain: "Education", problem: "Learning Language", tech: ["NLP", "AI"] },
    relatedLinks: [
      {
        label:
          "Paper — PhoniTale: Phonologically Grounded Mnemonic Generation for Typologically Distant Language Pairs",
        url: "https://aclanthology.org/2025.emnlp-main.1299/",
      },
      {
        label: "Poster",
        url: "https://drive.google.com/file/d/1yHfr4sDJEUUNYvWxDWQx8vFcu5dwbRV9/view?usp=sharing",
      },
      {
        label: "Slide",
        url: "https://drive.google.com/file/d/1LGc0jKpugwi1ISWm76bRJMKiWknyEXxf/view?usp=sharing",
      },
      { label: "Evaluation Web", url: "https://phonitale.com/" },
    ],
  },
  sommind: {
    slug: "sommind",
    title: "SomMind — Insomnia Digital Therapeutic",
    subtitle: "Digital therapeutic app for severe insomnia",
    tagline: "Healthy sleep starts with a healthy mind.",
    period: "Jun 2022 – Mar 2023",
    role: ["Team Lead", "PM", "Clinical Program & Trial Design", "Regulatory"],
    team: ["Medical director", "product designer", "FE/BE/QA eng", "writer"],
    org: "Asleep × Seoul National University Bundang Hospital",
    chips: { domain: "Digital Health", problem: "Insomnia", tech: ["Digital Therapeutics", "CBT-i"] },
    relatedLinks: [
      {
        label: "CBT-i DTX Introduction Slide: Symposium Presentation Materials",
        url: "https://drive.google.com/file/d/1Pq8vjPSfQrwcYdiOhIpOvGTcVKvJTh6Q/view?usp=sharing",
      },
    ],
  },
  "ai-search": {
    slug: "ai-search",
    title: "AI Search — Recovering Lost Revenue",
    subtitle: "Enhancing search experience & driving sales",
    tagline: "Just type it out. We'll find what you need.",
    period: "May – Aug 2024",
    role: ["PM", "A/B Test Design", "CEO Communication", "QA"],
    team: ["1 ML engineer", "1 backend engineer"],
    org: "Kurly",
    chips: { domain: "Commerce", problem: "Search UX", tech: ["Vector Search", "AI"] },
    relatedLinks: [
      {
        label: "Developer Blog",
        url: "https://helloworld.kurly.com/blog/vertex-ai-search-NR/",
      },
      {
        label: "[YouTube] Next Commerce: Curation and AI — Google Cloud Summit 2024",
        url: "https://youtu.be/qv0YMg7kwuM?si=km0mZKGjRI3rPVdX&t=2333",
      },
    ],
  },
  "ai-curation": {
    slug: "ai-curation",
    title: "AI Curation — Scaling Themed Campaigns",
    subtitle: "AI-driven scaling of themed campaigns",
    tagline: "You name the theme. AI does the rest.",
    period: "Jun – Dec 2024",
    role: ["PM", "A/B Test Design", "UX Research", "CEO Communication"],
    team: ["1 ML engineer", "1 backend engineer"],
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
  },
  asleeptrack: {
    slug: "asleeptrack",
    title: "AsleepTrack — B2B Sleep AI Platform",
    subtitle: "Ultimate AI sleep tracking module",
    tagline: "Expand your service horizons with sleep integration.",
    period: "Apr 2023 – Mar 2024",
    role: ["Team Lead", "PM", "Customer Success", "Dev Docs Management"],
    team: ["Technical PM", "FE/BE/SDK eng", "QA eng", "product designer"],
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
  },
  sleepvice: {
    slug: "sleepvice",
    title: "SleepVice — Alexa Voice App for Sleep",
    subtitle: "Alexa voice application for best sleep quality",
    tagline: "Personal sleep coach right by your pillow.",
    period: "Jun 2021 – Jun 2022",
    role: ["PM", "VUI Design", "UX Research"],
    team: ["biz dev", "PM/VUI (me)", "engineer"],
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
