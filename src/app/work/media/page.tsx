import type { Metadata } from "next";
import { Media } from "@/components/Media";

export const metadata: Metadata = {
  description: "Videos and press featuring Suyoung (Mel) Kwon's work.",
};

export default function MediaPage() {
  return (
    <main>
      <Media />
    </main>
  );
}
