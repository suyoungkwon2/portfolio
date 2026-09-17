export type PublicationCategory = "paper" | "patent";

export type PublicationAuthor = {
  name: string;
  equalContribution?: boolean;
};

export type PublicationItem = {
  category: PublicationCategory;
  title: string;
  link: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  authors: PublicationAuthor[];
  venue: string;
  date: string;
  summary: string;
  role: string;
};

// Papers and patents, in reverse-chronological order, copied as closely as
// possible from suyoungkwon.com/publications/ as of Sep 2026. Equal-
// contribution (*) markers match that site's author bylines.
export const publications: PublicationItem[] = [
  {
    category: "paper",
    title:
      "PhoniTale: Phonologically Grounded Mnemonic Generation for Typologically Distant Language Pairs",
    link: "https://aclanthology.org/2025.emnlp-main.1299/",
    image: "/images/publication_phonitale.jpg",
    imageWidth: 1174,
    imageHeight: 1230,
    authors: [
      { name: "Sana Kang", equalContribution: true },
      { name: "Myeongseok Gwon", equalContribution: true },
      { name: "Su Young Kwon", equalContribution: true },
      { name: "Jaewook Lee" },
      { name: "Andrew Lan" },
      { name: "Bhiksha Raj" },
      { name: "Rita Singh" },
    ],
    venue: "EMNLP 2025 Main Conference",
    date: "Nov 2025",
    summary:
      "Generates phonologically grounded mnemonics that help learners memorize vocabulary in a typologically distant language.",
    role: "Designed and ran the user study evaluating the mnemonics, then led the data analysis.",
  },
  {
    category: "patent",
    title: "AI-Based Non-Contact Sleep Analysis Method and Real-Time Sleep Environment Creation Method",
    link: "https://patents.google.com/patent/KR102681197B1/en",
    image: "/images/publication_aisleep.jpg",
    imageWidth: 1174,
    imageHeight: 1230,
    authors: [
      { name: "Dongheon Lee" },
      { name: "Chieun Ahn" },
      { name: "Su Young Kwon" },
      { name: "Yoonpyo Koo" },
      { name: "Sang Hyun Lee" },
      { name: "Jinhwan Jung" },
      { name: "Chae Eun Lee" },
      { name: "Junki Hong" },
      { name: "Hye Ah Park" },
      { name: "Hyunggug Kim" },
      { name: "So Ra Kang" },
      { name: "Jaehyun Bae" },
      { name: "Woojung Lim" },
    ],
    venue: "KR102681197B1",
    date: "Issued Jul 2024",
    summary: "AI-based non-contact sleep analysis and real-time sleep environment control, without wearables.",
    role: "Co-inventor on Asleep's underlying sleep-analysis method.",
  },
  {
    category: "paper",
    title: "An Improvement of Usability of 'Study Helper' Application through Usability Test",
    link: "https://www.dbpia.co.kr/journal/articleDetail?nodeId=NODE06553621",
    image: "/images/publication_studyhelper.jpg",
    imageWidth: 1174,
    imageHeight: 982,
    authors: [
      { name: "Su Young Kwon", equalContribution: true },
      { name: "Jee-soo Kim", equalContribution: true },
      { name: "Kyuhyeon Lee", equalContribution: true },
      { name: "Soyeon Hong", equalContribution: true },
      { name: "Myeong-Heum Yeoun" },
    ],
    venue: "Korean Society of Design Science (KSDS)",
    date: "Oct 2015",
    summary: "Usability study identifying and fixing UI issues in a student study-planning app.",
    role: "Conducted the usability testing, then redesigned the interface and validated the improvements.",
  },
];
