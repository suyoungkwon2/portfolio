import { About } from "@/components/About";
import { Awards } from "@/components/Awards";
import { Experience } from "@/components/Experience";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { Publication } from "@/components/Publication";
import { Resume } from "@/components/Resume";
import { SelectedWorks } from "@/components/SelectedWorks";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <SelectedWorks />
        <Experience />
        <Publication />
        <Awards />
        <Resume />
      </main>
      <Footer />
    </>
  );
}
