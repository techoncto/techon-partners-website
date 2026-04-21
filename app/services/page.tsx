import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import CTABanner from "@/components/home/CTABanner";

export const metadata: Metadata = {
  title: "Services | Techon Partners",
  description:
    "Fractional CTO services from Techon Partners: technology strategy, systems and architecture, and execution leadership for growth-stage companies.",
  alternates: {
    canonical: "https://techonpartners.com/services",
  },
};

// ─── Data ────────────────────────────────────────────────────────────────────

const serviceAreas = [
  {
    id: "strategy",
    title: "Technology Strategy",
    description:
      "Most companies don't lack ideas. They lack a clear basis for making technology decisions. We work with leadership to establish that foundation: a current-state assessment, a prioritized roadmap, and a framework for evaluating where to invest, build, or integrate.",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "architecture",
    title: "Systems & Architecture",
    description:
      "Operational systems rarely fail all at once. They degrade gradually until growth forces the issue. We assess your platforms, integrations, and infrastructure to surface where risk is accumulating, and define what needs to change before it becomes a business problem.",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "delivery",
    title: "Execution & Delivery",
    description:
      "Slow or inconsistent delivery is almost never a hiring problem. It is a structure, clarity, and prioritization problem. We identify what is constraining output and put in place the leadership practices that allow teams to operate with pace and reliability.",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const engagementModels = [
  {
    id: "fractional",
    type: "Ongoing",
    title: "Ongoing Fractional CTO",
    description:
      "Techon Partners becomes part of your leadership team, operating with the same authority and context as a full-time CTO. The scope adjusts as the business evolves.",
    suitedFor:
      "Companies that need consistent, senior technology leadership but are not yet at the point where a full-time hire makes sense.",
    dark: false,
  },
  {
    id: "strategic",
    type: "Strategic",
    title: "Strategic Engagement",
    description:
      "Focused work on a specific challenge: a systems assessment, an architecture decision, a planning sprint, or interim leadership through a transition. Defined scope, clear outcome.",
    suitedFor:
      "Companies with a specific, time-bounded need for senior technical input or an independent point of view.",
    dark: true,
  },
  {
    id: "advisory",
    type: "Advisory",
    title: "Advisory",
    description:
      "Regular, structured access to senior technology leadership, without day-to-day involvement. Working sessions to pressure-test decisions, review direction, and provide experienced counsel alongside your existing technical lead.",
    suitedFor:
      "Companies with a capable internal technical lead who would benefit from senior, independent oversight.",
    dark: false,
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section
        className="bg-navy-900 pt-20 pb-24 relative overflow-hidden"
        aria-labelledby="services-page-heading"
      >
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-0 right-0 w-[500px] h-[400px] rounded-full bg-blue-600/8 blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="max-w-3xl">
            <p className="text-blue-400 text-xs font-semibold tracking-[0.2em] uppercase mb-5">
              Services
            </p>
            <h1
              id="services-page-heading"
              className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-6"
            >
              Fractional CTO Services
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
              Growth creates complexity faster than most companies can manage
              it. We provide the senior technology leadership to stay ahead of
              it, embedded in your organization and accountable for outcomes.
            </p>
          </div>
        </div>
      </section>

      {/* What engaging means */}
      <section className="py-16 bg-white border-b border-slate-100" aria-label="What engaging Techon Partners means">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 items-start">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-navy-800 leading-snug mb-3">
                What engaging Techon Partners means
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                CTO-level leadership as part of your team — not external to it.
              </p>
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  term: "Embedded, not external",
                  detail: "Inside your organization, in your meetings, your systems, your decisions.",
                },
                {
                  term: "Founder-led",
                  detail: "Every engagement is led by Isaac Drezdner directly. No associates involved.",
                },
                {
                  term: "Adaptive scope",
                  detail: "Broader when stakes are high, lighter when things are stable. Adjusted to what the business needs.",
                },
                {
                  term: "Month-to-month",
                  detail: "No long-term contracts. Engagements continue because they're working.",
                },
              ].map(({ term, detail }) => (
                <div key={term} className="flex gap-3">
                  <div className="w-1 rounded-full bg-blue-600 shrink-0 self-stretch" aria-hidden />
                  <div>
                    <dt className="text-navy-800 font-semibold text-sm mb-0.5">{term}</dt>
                    <dd className="text-slate-500 text-sm leading-relaxed">{detail}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Service areas */}
      <section className="py-24 bg-slate-50" aria-labelledby="service-areas-heading">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-14">
            <p className="text-blue-600 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
              Core Services
            </p>
            <h2
              id="service-areas-heading"
              className="text-3xl sm:text-4xl font-bold text-navy-800 leading-tight"
            >
              Where we create impact
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {serviceAreas.map(({ id, title, description, icon }) => (
              <article
                key={id}
                id={id}
                className="group bg-white rounded-2xl border border-slate-200 p-7 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-200"
              >
                <div className="w-9 h-9 rounded-lg bg-navy-900 flex items-center justify-center text-blue-400 mb-5 shrink-0">
                  {icon}
                </div>
                <h3 className="text-navy-800 font-bold text-base mb-3 group-hover:text-blue-600 transition-colors">
                  {title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement models */}
      <section className="py-24 bg-white" aria-labelledby="engagement-heading">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-14">
            <p className="text-blue-600 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
              Engagement Models
            </p>
            <h2
              id="engagement-heading"
              className="text-3xl sm:text-4xl font-bold text-navy-800 leading-tight max-w-2xl mb-4"
            >
              How we work
            </h2>
            <p className="text-slate-500 max-w-2xl leading-relaxed">
              Engagements are structured based on your situation, starting
              with what you&apos;re facing today and evolving as needed.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {engagementModels.map(({ id, type, title, description, suitedFor, dark }) => (
              <div
                key={id}
                className={`flex flex-col rounded-2xl border p-8 ${
                  dark
                    ? "bg-navy-900 border-navy-700"
                    : "bg-white border-slate-200"
                }`}
              >
                <span
                  className={`self-start text-xs font-semibold px-2.5 py-1 rounded-full mb-5 ${
                    dark
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/20"
                      : "bg-blue-50 text-blue-600"
                  }`}
                >
                  {type}
                </span>

                <h3
                  className={`text-lg font-bold mb-3 leading-snug ${
                    dark ? "text-white" : "text-navy-800"
                  }`}
                >
                  {title}
                </h3>

                <p
                  className={`text-sm leading-relaxed mb-6 flex-1 ${
                    dark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  {description}
                </p>

                <div
                  className={`rounded-xl p-4 mb-6 ${
                    dark
                      ? "bg-white/[0.04] border border-white/[0.06]"
                      : "bg-slate-50 border border-slate-200"
                  }`}
                >
                  <p
                    className={`text-xs font-semibold uppercase tracking-widest mb-1.5 ${
                      dark ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    Best suited for
                  </p>
                  <p
                    className={`text-sm leading-relaxed ${
                      dark ? "text-slate-300" : "text-slate-600"
                    }`}
                  >
                    {suitedFor}
                  </p>
                </div>

                <Button
                  href="/contact"
                  variant={dark ? "primary" : "outline"}
                >
                  Discuss This Model
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-slate-400 text-sm">
              Not sure which model fits?{" "}
              <a
                href="/contact"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Start with a discovery call.
              </a>{" "}
              We&apos;ll recommend the right structure for your situation.
            </p>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
