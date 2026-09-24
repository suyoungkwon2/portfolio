import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Media } from "@/components/Media";
import { Nav } from "@/components/Nav";
import { Publication } from "@/components/Publication";
import { SelectedWorks } from "@/components/SelectedWorks";

// The landing page is the proof: what I've shipped, published, and been
// featured for. The
// person behind it lives on /about.
export default function Home() {
  return (
    <>
      <Nav overlay />
      <main>
        <Hero />
        <SelectedWorks />
        <Publication />
        <Media />
      </main>
      <Footer />
    </>
  );
}
