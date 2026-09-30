export type NewsItem = {
  date: string;
  // "[label](url)" segments render as links.
  content: string;
};

// Carried over from the previous Jekyll site's "Latest News" (_data/news.yml
// at tag jekyll-final), newest first.
export const news: NewsItem[] = [
  {
    date: "Sep 2026",
    content:
      "Selected for the inaugural cohort of the [Block Student Fellowship on AI and Society](https://www.cmu.edu/block-center/our-work/block-ai-society-fellowship) at Carnegie Mellon University.",
  },
  {
    date: "Aug 2026",
    content:
      "Started my Master of Design (MDes) in Interaction Design at [Carnegie Mellon University School of Design](https://design.cmu.edu/about-our-programs/masters-degrees/master-design-design-interactions)!",
  },
  {
    date: "Feb 2026",
    content:
      "Started advising [ZiggsAI](http://ziggsai.com/), a multi-AI agent collaboration platform startup, on Business and PM strategies.",
  },
  {
    date: "Nov 2025",
    content:
      "Won the 1st Prize at the Global Data Convergence Talent Program Showcase, hosted by the Ministry of Science & ICT and IITP.",
  },
  {
    date: "Nov 2025",
    content:
      "Presented our latest research at the EMNLP 2025 Main Conference in Suzhou, China.",
  },
  {
    date: "Oct 2025",
    content:
      "Awarded the Excellence Award at the LLM Clinical Note Challenge organized by [Seoul National University Bundang Hospital.](https://www.snubh.org/dh/en/)",
  },
  {
    date: "Aug 2025",
    content:
      "Our research paper ['PhoniTale'](https://aclanthology.org/2025.emnlp-main.1299/) has been accepted to the [EMNLP 2025 Main Conference.](https://2025.emnlp.org/)",
  },
  {
    date: "Jan 2025",
    content:
      "Started as a Visiting Scholar at [CMU School of Computer Science!](https://s3d.cmu.edu/)",
  },
  {
    date: "Dec 2024",
    content:
      "Launched the AI Collection Automation project for [Kurly Home](https://www.kurly.com/main), streamlining generation and operations.",
  },
  {
    date: "Sep 2024",
    content:
      "Started my Master's in Information Management at [KAIST](https://www.kaist.ac.kr/en/)!",
  },
  {
    date: "Aug 2024",
    content:
      "Successfully launched the hourly popular product collection automation for Kurly Now.",
  },
  {
    date: "Jul 2024",
    content:
      "Launched the [AI Search project](https://helloworld.kurly.com/blog/vertex-ai-search-NR/) at Kurly, which was featured as a success story at the [Google Cloud Summit 2024.](https://youtu.be/qv0YMg7kwuM?si=km0mZKGjRI3rPVdX&t=2333)",
  },
  {
    date: "May 2024",
    content:
      "Initiated collaborative research on AI Recipes with the Google Cloud team.",
  },
  {
    date: "Mar 2024",
    content:
      "Joined [Kurly](https://www.kurly.com/introduce), a leading e-commerce unicorn in Korea, as the first AI Product Manager!",
  },
  {
    date: "Jul 2023",
    content:
      "Beta testing has commenced for ['Sweet Sleep,'](https://www.medigatenews.com/news/2672943927) a PoC service in collaboration with LG Electronics.",
  },
  {
    date: "Jul 2023",
    content:
      "Officially launched ['Asleep Track,'](https://docs-en.asleep.ai/) a B2B AI SaaS product.",
  },
  {
    date: "Apr 2023",
    content:
      "Appointed as the Head of the Sleep Track Platform Team.",
  },
  {
    date: "Apr 2023",
    content:
      "Clinical trials have officially begun for 'SomMind,' a digital therapeutic (DTx) app for insomnia.",
  },
  {
    date: "Jun 2022",
    content:
      "Appointed as the Leader of both the UX Team and the DTx Team, taking on my first cross-functional leadership role.",
  },
  {
    date: "Dec 2021",
    content:
      "Led the project that resulted in Asleep being selected as the [first Amazon Alexa collaboration partner in Korea](https://www.sedaily.com/article/13252269).",
  },
  {
    date: "Sep 2021",
    content:
      "Promoted to Product Team Lead, overseeing the UX/Design functional group.",
  },
  {
    date: "Apr 2021",
    content:
      "Joined [Asleep](https://www.asleep.ai/en/home), an AI sleep-tech startup, as a Product Manager!",
  },
];
