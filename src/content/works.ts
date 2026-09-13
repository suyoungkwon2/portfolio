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

// Placeholder case studies — swap title/summary/metrics for the real
// content once the long-form write-ups are trimmed down.
export const works: WorkItem[] = [
  {
    slug: "healthcare-case-1",
    sector: "Healthcare / Education",
    tag: "0 → 1",
    title: "[Case Study Title]",
    summary: "[One or two sentences on the problem, your role, and the outcome.]",
    metrics: "[Key business impact metric]",
    year: "2024",
  },
  {
    slug: "healthcare-case-2",
    sector: "Healthcare / Education",
    tag: "Growth",
    title: "[Case Study Title]",
    summary: "[One or two sentences on the problem, your role, and the outcome.]",
    metrics: "[Key business impact metric]",
    year: "2023",
  },
  {
    slug: "healthcare-case-3",
    sector: "Healthcare / Education",
    tag: "Research",
    title: "[Case Study Title]",
    summary: "[One or two sentences on the problem, your role, and the outcome.]",
    metrics: "[Key business impact metric]",
    year: "2023",
  },
  {
    slug: "ai-business-case-1",
    sector: "AI / Business",
    tag: "AI Transformation",
    title: "[Case Study Title]",
    summary: "[One or two sentences on the problem, your role, and the outcome.]",
    metrics: "[Key business impact metric]",
    year: "2024",
  },
  {
    slug: "ai-business-case-2",
    sector: "AI / Business",
    tag: "A/B Testing",
    title: "[Case Study Title]",
    summary: "[One or two sentences on the problem, your role, and the outcome.]",
    metrics: "[Key business impact metric]",
    year: "2023",
  },
  {
    slug: "ai-business-case-3",
    sector: "AI / Business",
    tag: "0 → 1",
    title: "[Case Study Title]",
    summary: "[One or two sentences on the problem, your role, and the outcome.]",
    metrics: "[Key business impact metric]",
    year: "2022",
  },
];

export const workSectors: WorkSector[] = ["Healthcare / Education", "AI / Business"];
