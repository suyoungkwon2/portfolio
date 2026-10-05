import type { Metadata } from "next";
import { About } from "@/components/About";
import { News } from "@/components/News";

export const metadata: Metadata = {
  description: "Suyoung (Mel) Kwon: why I build, and what I've been up to lately.",
};

// Hello Visitor: the person behind the work, then the latest news.
export default function AboutPage() {
  return (
    <main>
      <About />
      <News />
    </main>
  );
}
