export const site = {
  name: "Suyoung Mel Kwon",
  shortName: "Mel",
  role: "Product Manager",
  tagline:
    "I'm a Product Manager dedicated to bridging the gap between people and technology to deliver impact where it is needed most.",
  email: "suyoungkwon77@gmail.com",
  resumeHref: "https://drive.google.com/file/d/1PyDfVu6MhDkOzzKji6-AHsZYKFoIlTdy/view?usp=sharing",
  linkedinHref: "https://www.linkedin.com/in/suyoungkwon/",
  githubHref: "https://github.com/suyoungkwon2",
  availability: "Open to Summer 2027 product internships.",
} as const;

export type NavItem = {
  label: string;
  href: string;
  external?: boolean;
};

// The logo links home (where Work lives), so Work has no nav item of its
// own. Resume opens the external PDF in a new tab.
export const navItems: NavItem[] = [
  { label: "Resume", href: site.resumeHref, external: true },
  { label: "About", href: "/about" },
];
