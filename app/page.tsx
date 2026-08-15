import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import ProblemStatement from "@/components/sections/ProblemStatement";
import Philosophy from "@/components/sections/Philosophy";
import Solutions from "@/components/sections/Solutions";
import ResearchPreview from "@/components/sections/ResearchPreview";
import Vision from "@/components/sections/Vision";
import Methodology from "@/components/sections/Methodology";
import FinalCTA from "@/components/sections/FinalCTA";
import People from "@/components/sections/People";
import ResearchContext from "@/components/sections/ResearchContext";
import FAQ from "@/components/sections/FAQ";

export const metadata: Metadata = {
  title: "Home",
  description: "PrepHatch investigates how people can work with AI more clearly.",
};

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
      <ResearchContext />
      <People />
      <FAQ />
      <FinalCTA />
    </>
  );
}
