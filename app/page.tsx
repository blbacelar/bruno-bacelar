import SmoothScroll from "@/components/SmoothScroll";
import Pipeline from "@/components/Pipeline";
import Hero from "@/components/Hero";
import Work from "@/components/Work";
import Stack from "@/components/Stack";
import { About, Contact } from "@/components/AboutContact";

export default function Home() {
  return (
    <SmoothScroll>
      <Pipeline />
      <main>
        <Hero />
        <Work />
        <Stack />
        <About />
        <Contact />
      </main>
    </SmoothScroll>
  );
}
