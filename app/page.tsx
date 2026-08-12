import Hero from "@/components/sections/Hero";
import ProblemStatement from "@/components/sections/ProblemStatement";
import Philosophy from "@/components/sections/Philosophy";
import Solutions from "@/components/sections/Solutions";
import ResearchPreview from "@/components/sections/ResearchPreview";
import Vision from "@/components/sections/Vision";
import Methodology from "@/components/sections/Methodology";
import FinalCTA from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <ProblemStatement />
      <Philosophy />
      <Solutions />
      <ResearchPreview />
      <Vision />
      <Methodology />
      <FinalCTA />
    </>
  );
}
