export type PublicationItem = {
  title: string;
  venue: string;
  year: string;
  link: string;
  description: string;
};

// Peer-reviewed work. Link and venue verified against LinkedIn
// (linkedin.com/in/suyoungkwon) as of Sep 2026.
export const publications: PublicationItem[] = [
  {
    title: "Phonitale — AI Vocabulary Mnemonics",
    venue: "EMNLP 2025 Main Conference",
    year: "2025",
    link: "https://aclanthology.org/2025.emnlp-main.1299.pdf",
    description:
      "Co-first-authored publication on LLM-based vocabulary learning, developed as a Visiting Researcher at Carnegie Mellon University's Language Technologies Institute with Prof. Rita Singh and Prof. Bhiksha Raj.",
  },
];
