import type { Metadata } from "next";
import { Media } from "@/components/Media";

export const metadata: Metadata = {
  title: "Media | Suyoung Kwon",
  description: "Videos and press featuring Suyoung (Mel) Kwon's work.",
};

export default function MediaPage() {
  return (
    <main className="pt-6 md:pt-8">
      <Media />
    </main>
  );
}
