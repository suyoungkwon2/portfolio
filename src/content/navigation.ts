import { works, type WorkSector } from "./works";

export type NavNode = {
  label: string;
  href: string;
  children?: NavNode[];
};

// "MARS: AI Clinical Documentation" -> "MARS"
const shortTitle = (title: string) => title.split(":")[0];

const workFiles = (sector: WorkSector): NavNode[] =>
  works
    .filter((w) => w.sector === sector)
    .map((w) => ({ label: shortTitle(w.title), href: `/work/${w.slug}` }));

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
  {
    label: "About",
    href: "/about",
    children: [
      { label: "Hello Visitor", href: "/about" },
      { label: "Experience", href: "/about/experience" },
    ],
  },
];
