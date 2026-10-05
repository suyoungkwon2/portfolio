import type { Metadata } from "next";
import { About } from "@/components/About";
import { Awards } from "@/components/Awards";
import { Experience } from "@/components/Experience";

export const metadata: Metadata = {
  description: "Suyoung (Mel) Kwon: why I build, where I've studied and built, and the recognition along the way.",
};

// The person behind the work, then the path so far.
export default function AboutPage() {
  return (
    <main>
      <About />
      <Experience />
      <Awards />
    </main>
  );
}
