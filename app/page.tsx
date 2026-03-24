import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import ValueStrip from "@/components/home/ValueStrip";
import WhatWeDo from "@/components/home/WhatWeDo";
import BreakingPoints from "@/components/home/BreakingPoints";
import ServicesPreview from "@/components/home/ServicesPreview";
import WhyFractionalCTO from "@/components/home/WhyFractionalCTO";
import OperationalDepth from "@/components/home/OperationalDepth";
import Process from "@/components/home/Process";
import AboutPreview from "@/components/home/AboutPreview";
import CTABanner from "@/components/home/CTABanner";

export const metadata: Metadata = {
  title: "Techon Partners | Fractional CTO for Growth and Complexity",
  description:
    "Techon Partners embeds senior technology leadership into growth-stage companies — solving the operational, integration, and system-level problems that emerge when growth outpaces the infrastructure behind it.",
  alternates: {
    canonical: "https://techonpartners.com",
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <ValueStrip />
      <WhatWeDo />
      <BreakingPoints />
      <ServicesPreview />
      <WhyFractionalCTO />
      <OperationalDepth />
      <Process />
      <AboutPreview />
      <CTABanner />
    </>
  );
}
