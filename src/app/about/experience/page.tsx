import type { Metadata } from "next";
import { Awards } from "@/components/Awards";
import { Experience } from "@/components/Experience";

export const metadata: Metadata = {
  title: "Experience | Suyoung Kwon",
  description: "Where Suyoung (Mel) Kwon has studied and built, and the recognition along the way.",
};

export default function ExperiencePage() {
  return (
    <main className="pt-6 md:pt-8">
      <Experience />
      <Awards />
    </main>
  );
}
