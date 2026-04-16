import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import CTABanner from "@/components/home/CTABanner";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Techon Partners provides fractional CTO leadership across technology strategy, engineering leadership, systems and integration architecture, execution and operational flow, platform modernization, and executive advisory.",
  alternates: {
    canonical: "https://techonpartners.com/services",
  },
};

// ─── Data ────────────────────────────────────────────────────────────────────

const serviceAreas = [
  {
    id: "strategy",
    number: "01",
    title: "Technology & Systems Strategy",
    description:
      "Most growing companies accumulate technology decisions rather than making them deliberately. Techon Partners works with leadership to define a clear direction for systems and technology investment — one grounded in how the business operates, not engineering preference.",
    context:
      "Systems and investment roadmapping, operational risk assessment, build vs. buy vs. integrate decisions, and technology governance.",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "leadership",
    number: "02",
    title: "Engineering Leadership & Org Design",
    description:
      "Technical teams without strong leadership default to firefighting. Techon Partners provides the day-to-day leadership that sets the standard for system quality, resolves ambiguity fast, and creates the conditions for teams to operate with consistency — not just survive.",
    context:
      "Engineering org design, hiring and interview frameworks, system ownership structures, performance culture, and senior talent development.",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "architecture",
    number: "03",
    title: "Systems, Integrations & Architecture",
    description:
      "The systems you depend on today become the constraints of tomorrow. Techon Partners assesses your operational platforms, integration architecture, and infrastructure — identifying where risk is accumulating and what needs to change before it becomes a problem.",
    context:
      "Operational system assessment, integration architecture review, scalability and reliability analysis, technical debt evaluation, and security posture review.",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "delivery",
    number: "04",
    title: "Execution, Delivery & Operational Flow",
    description:
      "Slow delivery is rarely a talent problem — it is a structural one. Techon Partners identifies the process and system factors that constrain output, and puts in place the execution practices that allow teams and operational workflows to run with reliability and pace.",
    context:
      "Delivery cadence and planning structure, operational workflow design, incident management, and cross-functional execution alignment.",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "modernization",
    number: "05",
    title: "Platform & Systems Modernization",
    description:
      "Legacy platforms constrain growth and increase operational risk. Techon Partners has led operational system and platform modernization programs — from cloud migrations and integration redesigns to full architecture transitions — and understands how to execute them without disrupting business continuity.",
    context:
      "Operational platform migration, systems re-architecture, integration modernisation, and cloud infrastructure adoption.",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "advisory",
    number: "06",
    title: "Executive Advisory",
    description:
      "Technology decisions increasingly require CTO-level input in non-technical rooms — board meetings, investor conversations, and M&A processes. Techon Partners provides the senior technical voice that leadership teams need to navigate these situations with confidence.",
    context:
      "Board and investor communication, technical due diligence, vendor and partnership evaluation.",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" />
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
      "A sustained, embedded engagement in which Techon Partners functions as part of your leadership team — attending meetings, making decisions, and providing continuous CTO-level presence on a part-time basis.",
    suitedFor:
      "Companies that need consistent technology leadership but are not yet at the scale to justify a full-time CTO hire.",
    dark: false,
  },
  {
    id: "advisory",
    type: "Advisory",
    title: "Strategic Advisory",
    description:
      "Regular, structured engagement focused on strategic direction and senior technical guidance. Techon Partners works with your existing technical leadership to improve decision quality and provide experienced oversight — without day-to-day involvement.",
    suitedFor:
      "Companies with a capable internal technical lead who would benefit from experienced, external counsel at a strategic level.",
    dark: true,
  },
  {
    id: "focused",
    type: "Project",
    title: "Focused Engagement",
    description:
      "A time-bounded engagement with a specific, defined objective — a technical due diligence review, an architecture assessment, an interim leadership gap, or a strategic planning sprint. Scoped to deliver a clear outcome within a defined period.",
    suitedFor:
      "Situations requiring senior technical expertise for a defined purpose, without the need for an ongoing relationship.",
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
              Techon Partners provides senior technology leadership on a flexible, embedded
              basis. The scope of each engagement is shaped by what the company actually
              needs — not by a package or a program.
            </p>
          </div>
        </div>
      </section>

      {/* Intro — what fractional CTO support means here */}
      <section className="py-20 bg-white border-b border-slate-100" aria-label="What we provide">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-16 items-center">
            <div>
              <p className="text-blue-600 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
                What Engaging Techon Partners Means
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-navy-800 leading-tight mb-5">
                CTO-level leadership that is part of your team, not external to it
              </h2>
              <p className="text-slate-500 leading-relaxed mb-4">
                Fractional CTO support is not a consulting retainer. Techon Partners operates
                as a working member of your leadership team — with real accountability,
                access to your systems and people, and a stake in the outcome.
              </p>
              <p className="text-slate-500 leading-relaxed">
                Every engagement is led personally by our Founder &amp; CTO. The scope,
                pace, and focus of the work evolve as your company does. There are no fixed
                modules, no standard deliverables, and no programs to complete.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {[
                {
                  label: "Embedded, not external",
                  detail: "We work inside your organisation — attending meetings, joining conversations, making calls.",
                },
                {
                  label: "Personally led",
                  detail: "Every engagement is led by our Founder & CTO. No delegation to associates.",
                },
                {
                  label: "Adaptive scope",
                  detail: "The engagement adjusts to what you need — broader when stakes are high, lighter when things are stable.",
                },
                {
                  label: "No lock-in",
                  detail: "Month-to-month by default. We earn the relationship through results, not contract length.",
                },
              ].map(({ label, detail }) => (
                <div
                  key={label}
                  className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200"
                >
                  <div className="w-1.5 rounded-full bg-blue-600 shrink-0 self-stretch" aria-hidden />
                  <div>
                    <p className="text-navy-800 font-semibold text-sm mb-0.5">{label}</p>
                    <p className="text-slate-500 text-sm leading-relaxed">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Service areas */}
      <section className="py-24 bg-slate-50" aria-labelledby="service-areas-heading">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-14">
            <p className="text-blue-600 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
              Core Service Areas
            </p>
            <h2
              id="service-areas-heading"
              className="text-3xl sm:text-4xl font-bold text-navy-800 leading-tight max-w-2xl"
            >
              Where Techon Partners Focuses
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {serviceAreas.map(({ id, number, title, description, context, icon }) => (
              <article
                key={id}
                id={id}
                className="group bg-white rounded-2xl border border-slate-200 p-7 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-200"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-navy-900 flex items-center justify-center text-blue-400 shrink-0">
                    {icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-slate-400 text-xs font-mono">{number}</span>
                    </div>
                    <h3 className="text-navy-800 font-bold text-base group-hover:text-blue-600 transition-colors">
                      {title}
                    </h3>
                  </div>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">{description}</p>
                <p className="text-slate-400 text-xs leading-relaxed border-t border-slate-100 pt-4">
                  <span className="text-slate-500 font-medium">Includes: </span>
                  {context}
                </p>
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
              How We Work Together
            </h2>
            <p className="text-slate-500 max-w-2xl leading-relaxed">
              Every company&apos;s situation is different. The right engagement model depends
              on your current leadership structure, stage of growth, and the nature of the
              challenge you&apos;re facing. We scope each engagement around what you
              actually need.
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
                {/* Type badge */}
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

                {/* Suited for */}
                <div
                  className={`rounded-xl p-4 mb-6 ${
                    dark ? "bg-white/[0.04] border border-white/[0.06]" : "bg-slate-50 border border-slate-200"
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
                Start with a discovery call
              </a>{" "}
              — we&apos;ll recommend the right structure for your situation.
            </p>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
