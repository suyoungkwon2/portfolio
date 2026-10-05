import { Hero } from "@/components/Hero";
import { SelectedWorks } from "@/components/SelectedWorks";

// Work, the landing page: the hero, then the case studies. Research,
// Media, Resume, and About each have their own page in the sidebar.
export default function Home() {
  return (
    <main>
      {/* The Work section stays hidden until the hero's photos spread. */}
      <Hero>
        <SelectedWorks />
      </Hero>
    </main>
  );
}
