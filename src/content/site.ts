export const site = {
  name: "Suyoung Mel Kwon",
  shortName: "Mel",
  role: "Product Manager",
  tagline:
    "I'm a Product Manager dedicated to bridging the gap between people and technology to deliver impact where it is needed most.",
  email: "suyoungkwon77@gmail.com",
  resumeHref: "https://drive.google.com/file/d/1IQdQYWXbsZb0afdeOxoJc1aGZrb-FBHD/view",
  linkedinHref: "https://www.linkedin.com/in/suyoungkwon/",
  githubHref: "https://github.com/suyoungkwon2",
  heroVideoSrc: "/video/heal-the-world.mp4",
  bgMusicSrc: "/video/bg-music.mp4",
  bgMusicStartSeconds: 4 * 60 + 57,
} as const;

export type NavItem = {
  label: string;
  href: string;
};

export const navItems: NavItem[] = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Publication", href: "#publication" },
  { label: "Contact", href: "#contact" },
];
