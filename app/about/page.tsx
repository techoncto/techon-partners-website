import type { Metadata } from "next";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About | Techon Partners",
  description:
    "Techon Partners provides fractional CTO leadership for growth-stage companies. Every engagement is led personally by Founder & CTO Isaac Drezdner.",
  alternates: {
    canonical: "https://techonpartners.com/about",
  },
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section
        className="bg-navy-900 pt-20 pb-20 relative overflow-hidden"
        aria-labelledby="about-page-heading"
      >
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-blue-600/8 blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="max-w-2xl">
            <p className="text-blue-400 text-xs font-semibold tracking-[0.2em] uppercase mb-5">
              Techon Partners
            </p>
            <h1
              id="about-page-heading"
              className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-5"
            >
              About Techon Partners
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Technology leadership grounded in real-world execution.
            </p>
          </div>
        </div>
      </section>

      {/* About the firm */}
      <section className="py-16 bg-white border-b border-slate-100" aria-label="About the firm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl">
            <p className="text-slate-600 text-base leading-relaxed mb-4">
              Techon Partners provides fractional CTO leadership for companies
              where growth has created technology complexity that existing
              leadership can no longer manage alongside everything else.
            </p>
            <p className="text-slate-600 text-base leading-relaxed">
              The focus is on restoring clarity, structure, and execution in
              the systems that directly impact how the business runs.
            </p>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="py-24 bg-slate-50" aria-labelledby="founder-heading">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12 items-start">

            {/* Profile card */}
            <div className="rounded-2xl bg-navy-900 overflow-hidden">
              <div className="aspect-[4/3] bg-navy-800 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-navy-800 via-navy-900 to-blue-950/60" aria-hidden />
                <div className="relative text-center">
                  <div className="w-20 h-20 rounded-full bg-navy-700 border-2 border-navy-600 mx-auto mb-3 flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-slate-500"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-label="Profile photo placeholder"
                    >
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                    </svg>
                  </div>
                  <p className="text-slate-500 text-xs">Photo</p>
                </div>
              </div>
              <div className="p-6 border-t border-white/[0.06]">
                <p className="text-white font-semibold text-base mb-0.5">Isaac Drezdner</p>
                <p className="text-blue-400 text-sm font-medium">Founder &amp; CTO, Techon Partners</p>
                <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" aria-hidden />
                    <span className="text-emerald-400 text-xs font-medium">Available</span>
                  </span>
                  <a
                    href="https://www.linkedin.com/in/isaac-drezdner-30b584138/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-500 text-xs hover:text-slate-300 transition-colors"
                  >
                    LinkedIn &rarr;
                  </a>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <p className="text-blue-600 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
                Leadership
              </p>
              <h2
                id="founder-heading"
                className="text-3xl sm:text-4xl font-bold text-navy-800 leading-tight mb-6"
              >
                10+ years in operational systems.{" "}
                <span className="text-slate-400 font-medium">
                  Every engagement run personally.
                </span>
              </h2>
              <p className="text-slate-500 leading-relaxed mb-4">
                Isaac Drezdner has spent over a decade leading engineering teams
                through the work that determines how operations run: ERP
                implementations, integration architecture, workflow automation,
                and scaling platforms under real business pressure. Not advisory
                work. Engagements with accountability for outcomes.
              </p>
              <p className="text-slate-500 leading-relaxed mb-8">
                Every engagement is led directly by Isaac. The person you speak
                to on the first call is the one assessing your systems, shaping
                the approach, and staying involved week over week.
              </p>
              <Button href="/contact" variant="primary">
                Start a Conversation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How we think */}
      <section className="py-20 bg-white border-t border-slate-100" aria-labelledby="how-we-think-heading">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-14 items-start">
            <div>
              <p className="text-blue-600 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
                Our Perspective
              </p>
              <h2
                id="how-we-think-heading"
                className="text-2xl sm:text-3xl font-bold text-navy-800 leading-snug"
              >
                How we think
              </h2>
            </div>
            <div className="space-y-5 text-slate-500 text-base leading-relaxed">
              <p>
                Growth doesn&apos;t just add revenue. It adds complexity. The
                systems, workflows, and integrations that worked at an earlier
                stage start to strain. What was a manageable process becomes a
                constraint. What was a reasonable architecture becomes a risk.
              </p>
              <p>
                Most of these problems aren&apos;t purely technical. They&apos;re
                structural. The decisions that created them were reasonable at
                the time, made under pressure and without the full picture.
                Solving them requires someone who can see the business and the
                systems together, and make tradeoffs with both in mind.
              </p>
              <p>
                That&apos;s the work. Not strategy decks or outside
                recommendations, but direct involvement in the systems,
                decisions, and execution until the problem is actually resolved.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How we work */}
      <section className="py-16 bg-slate-50 border-t border-slate-100" aria-labelledby="how-we-work-heading">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-14 items-start">
            <div>
              <p className="text-blue-600 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
                Our Approach
              </p>
              <h2
                id="how-we-work-heading"
                className="text-2xl sm:text-3xl font-bold text-navy-800 leading-snug"
              >
                How we work
              </h2>
            </div>
            <p className="text-slate-500 text-base leading-relaxed">
              Techon Partners operates as part of your leadership team, with
              direct accountability for outcomes and a focus on practical
              execution.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-navy-900 py-20" aria-label="Contact">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full bg-blue-600/10 blur-3xl" />
        </div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-600/40 to-transparent" aria-hidden />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <p className="text-slate-300 text-lg sm:text-xl leading-relaxed mb-8 max-w-xl mx-auto">
            If your systems or teams are starting to strain under growth, a short
            conversation is usually the best place to start.
          </p>
          <Button href="/contact" size="lg" variant="primary">
            Book a Discovery Call
            <svg
              className="w-4 h-4"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path d="M3 8h10m-4-4 4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Button>
        </div>
      </section>
    </>
  );
}
