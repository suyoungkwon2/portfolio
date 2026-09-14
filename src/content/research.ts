export type ResearchItem = {
  title: string;
  affiliation: string;
  period: string;
  description: string;
};

// Real research history, sourced from CV_SuyoungKwon_2pages.pdf and
// docs/projects/02-phonitale.md.
export const research: ResearchItem[] = [
  {
    title: "Visiting Scholar, Language Technology Institute",
    affiliation: "Carnegie Mellon University, School of Computer Science",
    period: "Mar — Jun 2025",
    description:
      "Developed and evaluated PhoniTale, a novel NLP mnemonic-generation system, with Professors Rita Singh and Bhiksha Raj — published at the EMNLP 2025 Main Conference.",
  },
  {
    title: "Research Assistant, Digital Humanities & Computational Social Sciences",
    affiliation: "KAIST",
    period: "Sep 2025 — Present",
    description:
      "Researching space & narrative theory and supporting data analysis for the National Library of Korea database project, advised by Professor Seohyon Jung.",
  },
];
