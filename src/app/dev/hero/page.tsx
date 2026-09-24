import { notFound } from "next/navigation";
import { HeroBgPlayground } from "./HeroBgPlayground";

// Dev-only tuning page for the landing hero background. Production builds
// render a 404 here.
export const metadata = { robots: { index: false } };

export default function DevHeroPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <HeroBgPlayground />;
}
