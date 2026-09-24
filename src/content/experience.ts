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
// CV_SuyoungKwon_2pages.pdf and docs/projects/*.md.
export const experience: ExperienceItem[] = [
  {
    org: "Carnegie Mellon University",
    logo: "/images/logo_cmu.png",
    link: "https://www.design.cmu.edu/about-our-programs/masters-degrees/master-design-design-interactions",
    category: "professional",
    role: "Research Assistant, School of Design",
    period: "Aug 2026 — Present",
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
    period: "Aug 2026 — May 2028 (Expected)",
    location: "Pittsburgh, PA",
    description: "Fellow, Block Student Fellowship on AI and Society.",
  },
  {
    org: "KAIST",
    logo: "/images/logo_kaist.jpeg",
    link: "https://www.kaist.ac.kr/en/",
    category: "education",
    role: "M.S., Information Management (Data Science minor)",
    period: "Sep 2024 — Aug 2026",
    location: "Seoul & Daejeon, Korea",
    description: "Academic Excellence Scholarship.",
  },
  {
    org: "Carnegie Mellon University",
    logo: "/images/logo_cmucs.jpeg",
    link: "https://www.cs.cmu.edu/",
    category: "professional",
    role: "Visiting Researcher, School of Computer Science",
    period: "Mar 2025 — Jun 2025",
    location: "Pittsburgh, PA",
    description:
      "Researched LLM-based vocabulary learning: co-first-authored publication at EMNLP 2025 Main.",
    highlights: [
      "[https://aclanthology.org/2025.emnlp-main.1299.pdf](https://aclanthology.org/2025.emnlp-main.1299.pdf)",
      "Advisors: Prof. [Rita Singh](https://www.lti.cs.cmu.edu/people/faculty/singh-rita.html), Prof. [Bhiksha Raj](https://www.lti.cs.cmu.edu/people/faculty/raj-bhiksha.html), Language Technologies Institute",
    ],
  },
  {
    org: "Kurly",
    logo: "/images/logo_kurly.jpeg",
    link: "https://www.kurly.com/main",
    category: "professional",
    role: "AI Product Manager",
    period: "Mar 2024 — Dec 2024",
    location: "Seoul, South Korea",
    description:
      "Led Kurly's AI transformation, scoping and shipping AI systems across search, recommendation, merchandising, and product data for a 3.5M MAU grocery platform.",
    highlights: [
      "AI Search with Google Cloud Vertex AI: Cut product-search no-result rate from 6.80% to 0.22% and raised product-search click-through rate (CTR) from 58.60% to 60.14% by implementing AI search — presented at Google Cloud Summit Seoul 2024",
      "Reduced AI search operating costs 30% below pilot-stage levels by building a proxy server for the production system",
      "Generative AI Copilot for Curated Collections: Automated 25% of key homepage sections with AI recommendation system across 200+ campaign topics while improving product diversity",
      "Real-time Popular Product Recommendations for Kurly Now: Built a time-of-day popular product recommendation system for instant delivery, reducing manual curation work",
      "AI Recipe Suite with Google Korea: Directed R&D on recipe generation, recipe image generation, and product recommendation, grounding features in Kurly's customer data",
      "Product Information Automation: Used OCR and LLMs to extract and structure regulatory product information, building AI-ready product data",
    ],
  },
  {
    org: "Asleep",
    logo: "/images/logo_asleep.jpeg",
    link: "https://www.asleep.ai/en/home",
    category: "professional",
    role: "Product Manager → UX Team Lead → Head of Sleep Track Platform",
    period: "Apr 2021 — Mar 2024",
    location: "Seoul, South Korea",
    subRoles: [
      {
        role: "Head of Sleep Track Platform / B2B SaaS Product Manager",
        period: "Apr 2023 – Mar 2024",
        description:
          "Asleep is an AI sleep-tech startup that analyzes sleep through everyday devices without wearables. I joined as the 10th employee and grew with the company from Seed to Series B.",
        highlights: [
          "Led end-to-end development process of Sleep Track, a B2B AI SaaS platform (API, SDK, Dashboard) that made AI sleep analysis easy for enterprise clients to adopt",
          "Reached $60K+ MRR within three months of launch, securing the company's first platform revenue",
          "Uncovered clients' adoption barriers through hands-on integration consulting, turning them into onboarding and product improvements",
          "Led a cross-functional team of 10 (front-end, back-end, product design, QA), aligning C-level, BD, and marketing on the roadmap",
        ],
      },
      {
        role: "UX Team Lead / DTx Product Manager",
        period: "Sep 2021 – Mar 2023",
        highlights: [
          "Led an insomnia CBT-I digital therapeutic (software as a medical device) in partnership with Seoul National University Bundang Hospital",
          "Conducted interviews and usability tests with middle-to-senior-aged insomnia patients to design around their digital fluency needs",
          "Managed the end-to-end regulatory process, securing KGMP certification and K-FDA clinical trial approval",
          "Led the UX team for Asleep's consumer mobile sleep app",
        ],
      },
      {
        role: "B2C App Product Manager",
        period: "Apr 2021 – Aug 2021",
        highlights: [
          "Launched Asleep's first AI sleep analysis MVP app, building the initial user base",
          "Co-developed the Sleepvice Amazon Alexa Skill with Amazon's Alexa Startup team, making Asleep the first official Amazon collaborator startup in Korea and contributing to its $12M Series B",
        ],
      },
    ],
  },
  {
    org: "Kookmin University",
    logo: "/images/logo_kmu.jpeg",
    link: "https://id-eng.kookmin.ac.kr/id-eng/index.do",
    category: "education",
    role: "Bachelor of Fine Arts, Industrial Design (UX Focused)",
    period: "2013 — 2018",
    location: "Seoul, South Korea",
    description: "Academic Excellence Scholarship.",
  },
  {
    org: "LG Electronics",
    logo: "/images/logo_lg.jpeg",
    link: "https://www.lg.com/us/",
    category: "professional",
    role: "Product UX Designer, Freelance",
    period: "Nov 2015 — Dec 2015",
    location: "Seoul Incheon Metropolitan Area",
    description:
      "Facilitated ideation workshops with designers, executives, engineers, and end-users at LG Electronics R&D Center to develop future concepts for home appliances.",
  },
];
