import { About } from "@/components/About";
import { Awards } from "@/components/Awards";
import { Experience } from "@/components/Experience";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { Research } from "@/components/Research";
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
        <Research />
        <Awards />
        <Resume />
      </main>
      <Footer />
    </>
  );
}
