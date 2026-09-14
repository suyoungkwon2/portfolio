export type AwardItem = {
  title: string;
  issuer: string;
  year: string;
};

// Real honors, sourced from CV_SuyoungKwon_2pages.pdf — most recent and
// most relevant to the AI/PM narrative.
export const awards: AwardItem[] = [
  {
    title: "1st Place, Global Data Convergence Talent Program Showcase",
    issuer: "Ministry of Science and ICT",
    year: "2025",
  },
  {
    title: "Excellence Award, LLM Clinical Note Datathon",
    issuer: "Seoul National University Bundang Hospital",
    year: "2025",
  },
  {
    title: "Conference Scholarship, EMNLP 2025",
    issuer: "KAIST & IITP",
    year: "2025",
  },
  {
    title: "Government-Sponsored CMU AI Intensive Program ($41K)",
    issuer: "KAIST & IITP",
    year: "2025",
  },
  {
    title: "Academic Excellence Scholarship (Half-Tuition)",
    issuer: "KAIST College of Business",
    year: "2025",
  },
];
