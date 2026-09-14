export type ExperienceItem = {
  org: string;
  role: string;
  period: string;
  location: string;
  description: string;
};

// Real role history, sourced from CV_SuyoungKwon_2pages.pdf and
// cross-referenced against docs/projects/*.md.
export const experience: ExperienceItem[] = [
  {
    org: "Carnegie Mellon University",
    role: "Master of Design, Design for Interaction (HCI)",
    period: "2026 — 2028 (Expected)",
    location: "Pittsburgh, PA",
    description:
      "Deepening human-centered design practice, building on the CMU visiting-scholar research that produced a published EMNLP 2025 paper.",
  },
  {
    org: "KAIST",
    role: "M.S., Information Management (Data Science minor)",
    period: "2024 — 2026",
    location: "Daejeon, Korea",
    description:
      "Graduate studies bridging human-centered design and data science, alongside an industry track building AI products at scale.",
  },
  {
    org: "Kurly",
    role: "AI Product Manager, Data Service Development Team",
    period: "Mar 2024 — Dec 2024",
    location: "Seoul, Korea",
    description:
      "Drove Kurly's AI Transformation initiative — defined and shipped 8 AI solution systems across search, curation, and recipe generation. Built a Vertex AI search layer (174x revenue lift, presented at Google Cloud Summit Seoul 2024) and an AI curation system now running 25% of homepage promotional slots.",
  },
  {
    org: "Asleep",
    role: "Product Manager → Head of Sleep Track Platform",
    period: "Apr 2021 — Mar 2024",
    location: "Seoul, Korea",
    description:
      "10th early employee; grew with the company from Series Seed to B across three roles — launched Asleep's first MVP and its Amazon Alexa skill, led an insomnia DTx app to KGMP/K-FDA clinical trial approval, then built the B2B SaaS platform (API/SDK/Dashboard) that became Asleep's first revenue line at $70K MRR.",
  },
];
