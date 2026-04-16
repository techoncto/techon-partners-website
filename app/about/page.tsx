import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import CTABanner from "@/components/home/CTABanner";

export const metadata: Metadata = {
  title: "About",
  description:
    "Techon Partners provides fractional CTO leadership for growth-stage companies — specializing in operational systems, ERP integration, workflow automation, and scaling engineering organizations under real-world load.",
  alternates: {
    canonical: "https://techonpartners.com/about",
  },
};

// ─── Data ────────────────────────────────────────────────────────────────────

const principles = [
  {
    title: "Radical Honesty",
    description:
      "We deliver direct, honest assessments — even when the answer isn't what you hoped for. Flattery doesn't help you build a company.",
  },
  {
    title: "Speed Over Perfection",
    description:
      "Good decisions made quickly beat perfect decisions made too late. We help companies move with appropriate confidence and appropriate speed.",
  },
  {
    title: "Business-Minded Technology",
    description:
      "Every technical decision has a commercial implication. We keep engineering work tightly connected to revenue, growth, and user outcomes.",
  },
  {
    title: "Sustainable Engineering",
    description:
      "Teams that burn out don't deliver. We advocate for sustainable pace, engineering quality, and a culture that retains the people you need most.",
  },
];

const highlights = [
  {
    title: "ERP Implementation & Integration",
    description:
      "Led ERP deployment and post-implementation integration work across operational businesses — connecting finance, procurement, and operational data to the systems teams depend on day-to-day.",
  },
  {
    title: "Integration Architecture",
    description:
      "Designed and rebuilt integration layers between operational platforms, vendor systems, and internal tools — replacing fragile point-to-point connections with reliable architectures that hold up as volume and system changes accumulate.",
  },
  {
    title: "Workflow Automation",
    description:
      "Delivered automation programs that replaced significant manual operational overhead — reconciliation, exception handling, data entry, and reporting — with scalable automated processes.",
  },
  {
    title: "Platform Scaling Under Load",
    description:
      "Led infrastructure and platform work for systems under real operational pressure — increasing transaction volumes, growing data sets, and expanding teams — with uptime and reliability requirements that couldn't be negotiated.",
  },
  {
    title: "Engineering Org Growth",
    description:
      "Built engineering teams from small founding groups to structured, multi-team organizations with clear system ownership, defined hiring processes, and engineering standards suited to operational environments.",
  },
  {
    title: "Platform & Systems Modernization",
    description:
      "Led cloud migration programs, infrastructure rebuilds, and operational platform re-architectures — designed and executed to avoid disrupting business continuity during transition.",
  },
];

const expertise = [
  { area: "Engineering Leadership", detail: "Org design, system ownership structures, hiring frameworks, and performance culture" },
  { area: "ERP & Operational Platforms", detail: "Implementation, configuration, and integration of operational systems across finance, procurement, and operations" },
  { area: "Systems & Architecture", detail: "Operational system scalability, integration architecture, technical debt, and infrastructure decisions" },
  { area: "Platform & Systems Modernization", detail: "Legacy platform migration, systems re-architecture, integration modernisation, and cloud infrastructure adoption" },
  { area: "Workflow Automation", detail: "Replacing manual operational processes with automated workflows — exception handling, routing, and data processing at scale" },
  { area: "Technical Due Diligence", detail: "System and integration assessments for operational businesses, PE, VC, and strategic acquirers" },
];

const workingPrinciples = [
  {
    number: "01",
    title: "Embedded, Not Advisory",
    description:
      "We attend your team meetings, join your Slack, and participate in the conversations that matter. We function as a working member of your leadership team — not an external party who shows up once a month with a slide deck.",
  },
  {
    number: "02",
    title: "Accountability Through Ownership",
    description:
      "Every engagement has clear deliverables, measurable outcomes, and a regular review cadence. We take ownership of results alongside you — not just credit for the recommendations.",
  },
  {
    number: "03",
    title: "No Agenda But Yours",
    description:
      "We don't represent vendor interests, recruit for fees, or sell software. Our only incentive is to give you the most useful advice possible and help you execute it well.",
  },
  {
    number: "04",
    title: "Honest Fit Assessment",
    description:
      "If a Techon Partners engagement isn't the right fit for your situation, we will tell you in the first call and point you toward what actually is. We'd rather be useful than win a contract.",
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <>
      {/* ── Section 1: The Firm ──────────────────────────────────────────── */}

      {/* Hero */}
      <section className="bg-navy-900 pt-20 pb-24 relative overflow-hidden" aria-labelledby="about-page-heading">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-blue-600/8 blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-16 items-center">
            <div>
              <p className="text-blue-400 text-xs font-semibold tracking-[0.2em] uppercase mb-5">
                About Techon Partners
              </p>
              <h1
                id="about-page-heading"
                className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-6"
              >
                A Boutique Technology
                <br />
                Leadership Firm
              </h1>
              <p className="text-slate-400 text-lg leading-relaxed mb-4">
                Techon Partners was founded on a simple observation: growth creates
                technology problems that require senior leadership to solve — and most
                companies hit that point before they can justify a full-time CTO hire.
              </p>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                We embed directly into client companies to provide that leadership layer —
                operating as working partners accountable to outcomes, not external advisors
                delivering reports.
              </p>
              <div className="flex items-center gap-4">
                <Button href="/contact" variant="primary">
                  Work With Us
                </Button>
                <Button
                  href="/services"
                  variant="ghost"
                  className="text-slate-300 hover:text-white hover:bg-white/5"
                >
                  View Services
                </Button>
              </div>
            </div>

            {/* Firm identity card */}
            <div className="lg:pl-8">
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm tracking-tight shrink-0">
                    TP
                  </div>
                  <div>
                    <p className="text-white font-semibold">Techon Partners</p>
                    <p className="text-slate-400 text-sm">Strategic Technology Leadership</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  {[
                    { label: "Type", value: "Boutique Technology Leadership Firm" },
                    { label: "Founded", value: "2023" },
                    { label: "Model", value: "Fractional CTO Engagements" },
                    { label: "Base", value: "United States · Global" },
                    { label: "Focus", value: "Companies navigating growth and scale" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-start justify-between gap-4 text-sm border-b border-white/[0.06] pb-3 last:border-0 last:pb-0">
                      <span className="text-slate-500 shrink-0">{label}</span>
                      <span className="text-slate-300 text-right">{value}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden />
                  <span className="text-emerald-400 text-xs font-medium">
                    Accepting new engagements
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="py-24 bg-white" aria-labelledby="principles-heading">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 items-start">
            <div>
              <p className="text-blue-600 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
                What We Stand For
              </p>
              <h2
                id="principles-heading"
                className="text-3xl sm:text-4xl font-bold text-navy-800 leading-tight mb-4"
              >
                The Principles That Guide Every Engagement
              </h2>
              <p className="text-slate-500 leading-relaxed">
                These aren&apos;t brand values written for a website. They shape how we
                diagnose problems, make recommendations, and work alongside teams — especially
                when the situation is difficult.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {principles.map(({ title, description }) => (
                <div
                  key={title}
                  className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all"
                >
                  <h3 className="text-navy-800 font-semibold text-base mb-2">{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: Founder & CTO ─────────────────────────────────────── */}

      <section className="py-24 bg-slate-50" aria-labelledby="founder-heading">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="max-w-2xl mb-16">
            <p className="text-blue-600 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
              Leadership
            </p>
            <h2
              id="founder-heading"
              className="text-3xl sm:text-4xl font-bold text-navy-800 leading-tight mb-4"
            >
              Founder &amp; CTO
            </h2>
            <p className="text-slate-500 leading-relaxed">
              Every Techon Partners engagement is personally led by our Founder &amp; CTO.
              There is no delegation to junior associates. When you work with Techon Partners,
              you work directly with the principal.
            </p>
          </div>

          {/* Profile + bio */}
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-12 mb-20">
            {/* Profile card */}
            <div className="space-y-4">
              <div className="rounded-2xl bg-navy-900 overflow-hidden">
                {/* Photo area */}
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

                {/* Name + title */}
                <div className="p-6 border-t border-white/[0.06]">
                  <p className="text-white font-semibold text-base mb-0.5">Isaac Drezdner</p>
                  <p className="text-blue-400 text-sm font-medium">Founder &amp; CTO</p>
                  <p className="text-slate-500 text-sm">Techon Partners</p>
                  <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" aria-hidden />
                    <span className="text-emerald-400 text-xs font-medium">Available for engagements</span>
                  </div>
                </div>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { stat: "10+", label: "Years in engineering leadership" },
                  { stat: "Ops", label: "Systems powering real-world operations" },
                  { stat: "Ops", label: "Systems & platform delivery" },
                  { stat: "Scale", label: "Systems under real-world load" },
                ].map(({ stat, label }) => (
                  <div
                    key={label}
                    className="p-4 rounded-xl bg-white border border-slate-200 text-center"
                  >
                    <div className="text-xl font-bold text-blue-600 mb-0.5">{stat}</div>
                    <div className="text-slate-500 text-xs leading-tight">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div>
              <p className="text-slate-600 leading-relaxed mb-5">
                Isaac Drezdner has spent over a decade in engineering leadership roles
                that sit at the intersection of technology and operations — building
                ERP-integrated platforms, designing integration architectures between
                systems, leading automation programs, and scaling the engineering
                organizations behind them.
              </p>
              <p className="text-slate-600 leading-relaxed mb-5">
                The problems that surface in operational businesses aren&apos;t
                theoretical. They show up as slow deployments, broken data flows, manual
                workarounds, and systems that weren&apos;t built for the volume they&apos;re
                now handling. These are the situations Isaac has navigated directly — as
                the person accountable for the outcome, not as an outside advisor.
              </p>
              <p className="text-slate-600 leading-relaxed mb-10">
                That direct experience is what every Techon Partners engagement is built
                on. When you work with us, you work with someone who has run these systems,
                managed these tradeoffs, and lived with the consequences of getting them
                right — or wrong.
              </p>

              {/* Experience highlights */}
              <div>
                <p className="text-navy-700 text-xs font-semibold uppercase tracking-widest mb-6">
                  Experience Highlights
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {highlights.map(({ title, description }) => (
                    <div
                      key={title}
                      className="flex gap-4 p-5 rounded-xl border border-slate-200 bg-white hover:border-blue-200 transition-colors"
                    >
                      <div className="w-1 rounded-full bg-blue-600 shrink-0 self-stretch" aria-hidden />
                      <div>
                        <h3 className="text-navy-800 font-semibold text-sm mb-1.5">{title}</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Expertise */}
          <div>
            <p className="text-navy-700 text-xs font-semibold uppercase tracking-widest mb-6">
              Areas of Expertise
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {expertise.map(({ area, detail }) => (
                <div key={area} className="p-5 rounded-xl bg-white border border-slate-200">
                  <h3 className="text-navy-800 font-semibold text-sm mb-1">{area}</h3>
                  <p className="text-slate-500 text-sm">{detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: How We Work ───────────────────────────────────────── */}

      <section className="py-24 bg-white" aria-labelledby="how-we-work-heading">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-16 items-start">
            <div className="lg:sticky lg:top-24">
              <p className="text-blue-600 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
                Our Approach
              </p>
              <h2
                id="how-we-work-heading"
                className="text-3xl sm:text-4xl font-bold text-navy-800 leading-tight mb-5"
              >
                Engaged Partners,
                <br />
                Not Outside Consultants
              </h2>
              <p className="text-slate-500 leading-relaxed mb-8">
                Our working model is designed to deliver value from the first week and adapt
                as your company&apos;s needs evolve. We operate as part of your leadership
                team — with the same access, accountability, and commitment.
              </p>
              <Button href="/contact" variant="primary">
                Start a Conversation
              </Button>
            </div>

            <div className="space-y-4">
              {workingPrinciples.map(({ number, title, description }) => (
                <div
                  key={number}
                  className="flex gap-5 p-6 rounded-xl border border-slate-200 bg-white hover:border-blue-200 hover:shadow-sm transition-all"
                >
                  <div className="w-9 h-9 rounded-lg bg-navy-900 flex items-center justify-center text-blue-400 font-bold text-xs shrink-0 mt-0.5">
                    {number}
                  </div>
                  <div>
                    <h3 className="text-navy-800 font-semibold text-base mb-2">{title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
