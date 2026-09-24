export type MediaItem = {
  kind: "video" | "news";
  date: string;
  title: string;
  caption: string;
  href: string;
  image: string;
};

// Press and video appearances, newest first, ported from the old site's
// Media section (images re-exported from suyoungkwon.com/assets/img/media).
export const media: MediaItem[] = [
  {
    // JoongAng Ilbo, Nov 4 2025.
    kind: "news",
    date: "Nov 2025",
    title: "M.A.R.S. Datathon Excellence Award",
    caption: "Recognized for an LLM pipeline that drafts hospital discharge summaries.",
    href: "https://www.joongang.co.kr/article/25379464",
    image: "/images/media/mars.jpg",
  },
  {
    // Korea's Ministry of Science and ICT, Nov 1 2025.
    kind: "video",
    date: "Nov 2025",
    title: "Global Data Convergence Talent Program",
    caption: "1st place at the program's final showcase.",
    href: "https://youtu.be/Z5kwMPRbVgM?t=75",
    image: "/images/media/data-convergence.jpg",
  },
  {
    // Presented on stage by Kurly's CEO; the project itself was Mel's.
    kind: "video",
    date: "Sep 2024",
    title: "Google Cloud Summit Seoul 2024",
    caption: "Kurly's AI Search, the project I led, featured on stage as a Google Cloud case study.",
    href: "https://youtu.be/qv0YMg7kwuM?t=2333",
    image: "/images/media/google-cloud-summit.jpg",
  },
  {
    // Mel presents on camera here.
    kind: "video",
    date: "Dec 2023",
    title: "Asleep × AWS",
    caption: "Presented Asleep and its sleep-tracking platform in AWS's partner showcase.",
    href: "https://www.youtube.com/watch?v=ZKWwMvpdFZ0&t=26s",
    image: "/images/media/asleep-aws.jpg",
  },
  {
    // Medigate News, Dec 9 2021.
    kind: "news",
    date: "Dec 2021",
    title: "Asleep × Amazon Alexa",
    caption: "Asleep became Korea's first official Amazon Alexa collaboration partner.",
    href: "https://medigatenews.com/news/2902071943",
    image: "/images/media/asleep-amazon.jpg",
  },
];
