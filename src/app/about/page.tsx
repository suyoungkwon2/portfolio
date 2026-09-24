import type { Metadata } from "next";
import { About } from "@/components/About";
import { Awards } from "@/components/Awards";
import { Experience } from "@/components/Experience";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "About — Suyoung Kwon",
  description:
    "Suyoung (Mel) Kwon — why I build, where I've built, and the recognition along the way.",
};

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main>
        <About />
        <Experience />
        <Awards />
      </main>
      <Footer />
    </>
  );
}
