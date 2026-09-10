import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import BreakingPoints from "@/components/home/BreakingPoints";
import WhatWeDo from "@/components/home/WhatWeDo";
import AboutPreview from "@/components/home/AboutPreview";
import CTABanner from "@/components/home/CTABanner";

export const metadata: Metadata = {
  title: "Techon Partners | Fractional CTO for Growth and Complexity",
  description:
    "Techon Partners embeds senior technology leadership into growth-stage companies, solving the operational, integration, and system-level problems that emerge when growth outpaces the infrastructure behind it.",
  alternates: {
    canonical: "https://techonpartners.com",
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <BreakingPoints />
      <WhatWeDo />
      <AboutPreview />
      <CTABanner />
    </>
  );
}
