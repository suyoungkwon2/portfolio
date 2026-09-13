export type ExperienceItem = {
  org: string;
  role: string;
  period: string;
  location: string;
  description: string;
};

export const experience: ExperienceItem[] = [
  {
    org: "KAIST",
    role: "M.S. Candidate, Information Management (Data Science minor)",
    period: "2024 — Present",
    location: "Daejeon, Korea",
    description:
      "Graduate studies bridging human-centered design and data science, following an industry track building AI products at scale.",
  },
  {
    org: "Kurly",
    role: "AI Product Manager",
    period: "2022 — 2024",
    location: "Seoul, Korea",
    description:
      "Led enterprise-wide AI transformation initiatives at one of Korea's largest e-commerce unicorns, partnering with engineering, data science, and operations to ship AI-driven products.",
  },
  {
    org: "Asleep",
    role: "Product Manager, Cross-functional Team Lead",
    period: "2021 — 2022",
    location: "Seoul, Korea",
    description:
      "Owned 0-to-1 growth of sleep-tech products at an AI sleep startup, running user research and A/B tests to validate and scale new features.",
  },
];
