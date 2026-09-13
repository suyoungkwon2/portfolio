export const site = {
  name: "Suyoung Kwon",
  shortName: "Mel",
  role: "Product Manager",
  tagline:
    "I'm a Product Manager dedicated to bridging the gap between people and technology to deliver impact where it is needed most.",
  email: "suyoungkwon77@gmail.com",
  resumeHref: "/resume.pdf",
  heroVideoSrc: "/video/heal-the-world.mp4",
  bgMusicSrc: "/video/bg-music.mp4",
  bgMusicStartSeconds: 4 * 60 + 54,
} as const;

export type NavItem = {
  label: string;
  href: string;
};

export const navItems: NavItem[] = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Research", href: "#research" },
  { label: "Resume", href: "#resume" },
];
