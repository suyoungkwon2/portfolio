import { works, type WorkSector } from "./works";

export type NavNode = {
  label: string;
  href: string;
  children?: NavNode[];
};

// "M.A.R.S: AI Clinical Documentation" -> "M.A.R.S"
const shortTitle = (title: string) => title.split(":")[0];

const workFiles = (sector: WorkSector): NavNode[] =>
  works
    .filter((w) => w.sector === sector)
    .map((w) => ({ label: shortTitle(w.title), href: `/work/${w.slug}` }));

// The two case-study folders. Inside any case study both stay open, so
// the visitor can see every project and research piece at once.
export const caseStudyFolders = ["/work/projects", "/work/research"];
export const isCaseStudyPath = (path: string) => works.some((w) => `/work/${w.slug}` === path);

// The sidebar's folder tree. A folder links to its own page and expands
// while the visitor is anywhere inside it; published case studies are
// listed under their sector automatically.
export const navTree: NavNode[] = [
  {
    label: "Work",
    href: "/",
    children: [
      { label: "Projects", href: "/work/projects", children: workFiles("Projects") },
      {
        label: "Research",
        href: "/work/research",
        children: [
          ...workFiles("AI Research"),
          { label: "Publication", href: "/work/research#publication" },
        ],
      },
      { label: "Media", href: "/work/media" },
    ],
  },
  { label: "Resume", href: "/resume" },
  { label: "About", href: "/about" },
];
