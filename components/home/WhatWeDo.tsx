const capabilities = [
  {
    title: "Technology Strategy",
    description:
      "Map the current state of your systems, identify the integration and operational risks holding growth back, and build a roadmap that business leadership can actually act on — not an engineering wish list.",
  },
  {
    title: "Engineering Leadership",
    description:
      "Run the engineering org day-to-day — setting the standard for how systems are built and maintained, making decisions at pace with the business, and making sure the team is working on what matters operationally.",
  },
  {
    title: "Systems & Architecture Review",
    description:
      "Assess every layer of the systems your operations depend on — core platforms, integrations, infrastructure, and data flows. Surface what's fragile, what's accumulating debt, and what's likely to break under continued growth.",
  },
  {
    title: "Integration & Automation",
    description:
      "Build reliable connections between your operational systems — core platforms, vendors, internal tools, and data pipelines. Replace manual handoffs with automated processes that hold up under volume.",
  },
  {
    title: "Team Building",
    description:
      "Structure the engineering org around the work — clear system ownership, a hiring process built for what you actually need, and the standards that keep teams from accumulating the problems they were hired to solve.",
  },
];

export default function WhatWeDo() {
  return (
    <section className="py-24 bg-white" aria-labelledby="what-we-do-heading">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-16 items-start">

          {/* Left — statement */}
          <div className="lg:sticky lg:top-24">
            <p className="text-blue-600 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
              What We Do
            </p>
            <h2
              id="what-we-do-heading"
              className="text-3xl sm:text-4xl font-bold text-navy-800 leading-tight mb-6"
            >
              Technical leadership{" "}
              <span className="text-slate-400 font-medium">
                for the systems that run your business.
              </span>
            </h2>
            <p className="text-slate-500 leading-relaxed text-base mb-6">
              Growth exposes the gaps. The operational systems, integrations, and workflows
              built for an earlier stage weren&apos;t designed for where you are now. Data
              gets unreliable. Manual processes become bottlenecks.               Without someone senior
              accountable for solving them — not just advising — the problems compound.
            </p>
            <p className="text-slate-500 leading-relaxed text-base">
              Techon Partners works inside your company as the senior technical leader —
              embedded in the decisions, the systems, and the execution, not advising
              from a distance.
            </p>

            {/* Credential callouts */}
            <div className="mt-10 grid grid-cols-3 gap-4">
              {[
                { stat: "10+", label: "Years in engineering leadership" },
                { stat: "Systems", label: "Operational depth and delivery" },
                { stat: "Proven", label: "Under real-world complexity" },
              ].map(({ stat, label }) => (
                <div key={label} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-2xl font-bold text-blue-600 mb-0.5">{stat}</div>
                  <div className="text-slate-600 text-xs font-medium">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — capabilities list */}
          <div className="space-y-4">
            {capabilities.map(({ title, description }, index) => (
              <div
                key={title}
                className="group flex gap-5 p-5 rounded-xl border border-slate-200 bg-white hover:border-blue-200 hover:shadow-sm transition-all duration-150"
              >
                <div className="w-8 h-8 rounded-lg bg-navy-900 flex items-center justify-center text-blue-400 font-bold text-xs shrink-0 mt-0.5">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div>
                  <h3 className="text-navy-800 font-semibold text-sm mb-1 group-hover:text-blue-600 transition-colors">
                    {title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
