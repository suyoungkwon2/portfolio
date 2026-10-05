export type ExperienceCategory = "education" | "professional";

export type ExperienceSubRole = {
  role: string;
  period: string;
  description?: string;
  highlights?: string[];
};

export type ExperienceItem = {
  org: string;
  logo: string;
  link?: string;
  category: ExperienceCategory;
  role: string;
  period: string;
  location: string;
  description?: string;
  highlights?: string[];
  subRoles?: ExperienceSubRole[];
};

// Real role history, copied as closely as possible from LinkedIn
// (linkedin.com/in/suyoungkwon) as of Sep 2026, cross-referenced against
// CV_SuyoungKwon_1page_PM.pdf (Sep 2026; wins on titles and dates) and
// docs/projects/*.md.
export const experience: ExperienceItem[] = [
  {
    org: "Carnegie Mellon University",
    logo: "/images/logo_cmu.png",
    link: "https://www.design.cmu.edu/about-our-programs/masters-degrees/master-design-design-interactions",
    category: "professional",
    role: "Research Assistant, School of Design",
    period: "Aug 2026 – Present",
    location: "Pittsburgh, PA",
    description: "Researching spatial interaction at the intersection of design and HCI.",
    highlights: [
      "Advisor: Prof. [Daniel Rosenberg Muñoz](https://www.design.cmu.edu/profiles/daniel-rosenberg-munoz), School of Design",
    ],
  },
  {
    org: "Carnegie Mellon University",
    logo: "/images/logo_cmu.png",
    link: "https://www.design.cmu.edu/about-our-programs/masters-degrees/master-design-design-interactions",
    category: "education",
    role: "Master of Design, Design for Interaction (HCI)",
    period: "Aug 2026 – May 2028 (Expected)",
    location: "Pittsburgh, PA",
    description: "Fellow, Block Student Fellowship on AI and Society.",
  },
  {
    org: "KAIST",
    logo: "/images/logo_kaist.jpeg",
    link: "https://www.kaist.ac.kr/en/",
    category: "education",
    role: "M.S., Information Management (Data Science minor)",
    period: "Sep 2024 – Jun 2026",
    location: "Seoul & Daejeon, Korea",
    description: "Academic Excellence Scholarship.",
  },
  {
    org: "Carnegie Mellon University",
    logo: "/images/logo_cmucs.jpeg",
    link: "https://www.cs.cmu.edu/",
    category: "professional",
    role: "Visiting Scholar, School of Computer Science",
    period: "Jan 2025 – Jul 2025",
    location: "Pittsburgh, PA",
    description:
      "Researched LLM-based vocabulary learning: co-first-authored publication at EMNLP 2025 Main.",
    highlights: [
      "[https://aclanthology.org/2025.emnlp-main.1299.pdf](https://aclanthology.org/2025.emnlp-main.1299.pdf)",
      "Selected for the government-sponsored CMU AI Intensive Program ($41K), KAIST & IITP",
      "Advisors: Prof. [Rita Singh](https://www.lti.cs.cmu.edu/people/faculty/singh-rita.html), Prof. [Bhiksha Raj](https://www.lti.cs.cmu.edu/people/faculty/raj-bhiksha.html), Language Technologies Institute",
    ],
  },
  {
    org: "Kurly",
    logo: "/images/logo_kurly.jpeg",
    link: "https://www.kurly.com/main",
    category: "professional",
    role: "AI Product Manager",
    period: "Mar 2024 – Dec 2024",
    location: "Seoul, South Korea",
    description:
      "Led Kurly's AI transformation, scoping and shipping AI systems across search, recommendation, merchandising, and product data for a 3.5M MAU grocery platform.",
  },
  {
    org: "Asleep",
    logo: "/images/logo_asleep.jpeg",
    link: "https://www.asleep.ai/en/home",
    category: "professional",
    role: "Product Manager & Cross-Functional Team Manager",
    period: "Apr 2021 – Mar 2024",
    location: "Seoul, South Korea",
    subRoles: [
      {
        role: "Product Manager & Cross-Functional Team Manager (SaaS)",
        period: "Apr 2023 – Mar 2024",
        description:
          "I joined as the 10th employee and grew with the company from Seed to Series B. Led end-to-end development process of Sleep Track, a B2B AI SaaS platform (API, SDK, Dashboard) that made AI sleep analysis easy for enterprise clients to adopt.",
      },
      {
        role: "Product Manager & Cross-Functional Team Manager (DTx)",
        period: "Sep 2021 – Mar 2023",
        description:
          "Led an insomnia CBT-I digital therapeutic (software as a medical device) in partnership with Seoul National University Bundang Hospital.",
      },
      {
        role: "Product Manager",
        period: "Apr 2021 – Sep 2021",
        description:
          "Designed the UX of Asleep's first B2C app and the voice interface for the Sleepvice Amazon Alexa Skill.",
      },
    ],
  },
  {
    org: "Kookmin University",
    logo: "/images/logo_kmu.jpeg",
    link: "https://id-eng.kookmin.ac.kr/id-eng/index.do",
    category: "education",
    role: "Bachelor of Fine Arts, Industrial Design (UX/UI Focused)",
    period: "2013 – 2018",
    location: "Seoul, South Korea",
    description: "Academic Excellence Scholarship.",
  },
  {
    org: "LG Electronics",
    logo: "/images/logo_lg.jpeg",
    link: "https://www.lg.com/us/",
    category: "professional",
    role: "Product UX Designer, Freelance",
    period: "Nov 2015 – Dec 2015",
    location: "Seoul Incheon Metropolitan Area",
    description:
      "Facilitated ideation workshops with designers, executives, engineers, and end-users at LG Electronics R&D Center to develop future concepts for home appliances.",
  },
];
