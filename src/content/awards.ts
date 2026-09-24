export type AwardItem = {
  title: string;
  issuer: string;
  year: string;
};

// Recognition for the About page, sourced from CV_SuyoungKwon_2pages.pdf
// and the old site. Video and press links live in the landing page's
// Media section (src/content/media.ts), not here. Scholarships were dropped
// as weak signal for PM hiring, and the CMU AI Intensive Program moved to
// the CMU Visiting Researcher entry in experience.ts.
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
    // Presented on stage by Kurly's CEO; the project itself was Mel's.
    title: "Featured Case Study, Google Cloud Summit Seoul 2024",
    issuer: "Google Cloud · AI Search at Kurly",
    year: "2024",
  },
];
