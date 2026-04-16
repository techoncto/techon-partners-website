const typicalFocus = [
  "Feature development and product velocity",
  "Consumer-facing scalability and uptime",
  "Growth loops and experimentation infrastructure",
  "Product metrics and roadmap execution",
];

const ourFocus = [
  "Operational systems running core business processes",
  "Integration reliability between platforms and vendors",
  "Workflow automation replacing manual dependencies",
  "Real-time visibility into operational data and system health",
];

const domains = [
  {
    title: "Core Operational Platforms",
    description:
      "Experience with the systems running finance, procurement, fulfillment, and business operations — and the work of adapting them to how a scaling company actually operates.",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <rect x="2" y="3" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 21h8m-4-4v4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Integration Architecture",
    description:
      "Designing reliable connections between operational platforms, third-party systems, and vendor APIs — built to stay stable as volume grows and dependencies change.",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <circle cx="5" cy="12" r="2" strokeLinecap="round" />
        <circle cx="19" cy="6" r="2" strokeLinecap="round" />
        <circle cx="19" cy="18" r="2" strokeLinecap="round" />
        <path d="M7 12h4m2-4.5 2.5-1.5m-2.5 10 2.5 1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11 12h2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Workflow Automation",
    description:
      "Replacing manual, error-prone processes with automated workflows — handling exceptions, routing work, and processing volume without adding operational headcount.",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 14v2h2v2h-2v2m0-6h2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 7h4M7 10v4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Operational Visibility",
    description:
      "Building the data pipelines, monitoring, and dashboards that give leadership a real picture of what's happening across systems — not reports that are hours old.",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path d="M3 12h2l3-7 4 14 3-9 2 4h4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Production Reliability",
    description:
      "Designing for stability under load — reducing incident frequency, improving recovery time, and building the confidence that operations won't be disrupted by the systems meant to support them.",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path d="M12 3 L20 7 V12 C20 16.4 16.4 20.9 12 22 C7.6 20.9 4 16.4 4 12 V7 Z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Data Flow & System Integrity",
    description:
      "Managing how data moves between systems — ensuring accuracy, timeliness, and consistency across the operational stack so decisions are made on information that can be trusted.",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path d="M4 7h16M4 12h16M4 17h10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function OperationalDepth() {
  return (
    <section
      className="py-24 bg-white border-t border-slate-200"
      aria-labelledby="operational-depth-heading"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="max-w-2xl mb-14">
          <p className="text-blue-600 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            Operational Depth
          </p>
          <h2
            id="operational-depth-heading"
            className="text-3xl sm:text-4xl font-bold text-navy-800 leading-tight mb-5"
          >
            Built for real-world operations,
            <br className="hidden sm:block" />{" "}
            <span className="text-slate-400 font-medium">not just product teams</span>
          </h2>
          <p className="text-slate-500 text-base leading-relaxed">
            Most engineering leadership comes from product-focused companies — shipping
            features, scaling consumer platforms, moving fast on roadmaps. That&apos;s a
            different discipline from the systems that run a business: integrations that
            move data between platforms, workflows that process thousands of transactions
            a day, and the operational tools leadership depends on to make decisions.
            That&apos;s where our experience is concentrated.
          </p>
        </div>

        {/* Contrast block */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-14">
          {/* Typical focus */}
          <div className="p-6 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-[0.15em] mb-4">
              Where most engineering leadership is focused
            </p>
            <ul className="space-y-3">
              {typicalFocus.map((item) => (
                <li key={item} className="flex items-start gap-3 text-slate-400 text-sm">
                  <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0 mt-2" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Our focus */}
          <div className="p-6 rounded-xl bg-white border border-blue-200 shadow-sm shadow-blue-50">
            <p className="text-blue-600 text-xs font-semibold uppercase tracking-[0.15em] mb-4">
              Where our depth is
            </p>
            <ul className="space-y-3">
              {ourFocus.map((item) => (
                <li key={item} className="flex items-start gap-3 text-navy-800 text-sm font-medium">
                  <svg
                    className="w-4 h-4 text-blue-500 shrink-0 mt-0.5"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden
                  >
                    <path d="M3 8l3.5 3.5L13 4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Domain grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {domains.map(({ title, description, icon }) => (
            <div
              key={title}
              className="flex gap-4 p-5 rounded-xl border border-slate-200 bg-white hover:border-blue-200 hover:shadow-sm transition-all duration-150"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                {icon}
              </div>
              <div>
                <h3 className="text-navy-800 font-semibold text-sm mb-1.5">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
