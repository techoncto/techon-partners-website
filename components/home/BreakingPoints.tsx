const breakingPoints = [
  {
    title: "Operational systems that can't keep up with increasing volume",
    description:
      "The platforms driving your operations were built for a different scale. As volume grows, they slow down, error out, or require constant manual intervention to keep running.",
  },
  {
    title: "Manual workflows that create bottlenecks",
    description:
      "Processes that once moved quickly are now choke points. Teams are spending hours on data entry, exception handling, and reconciliation work that should be automated — and the cost is visible in every department.",
  },
  {
    title: "Lack of real-time visibility into systems and data",
    description:
      "Leadership can't get a reliable picture of what's happening across operations without pulling reports manually or waiting for someone to compile the numbers. Decisions are made on stale data or gut feel.",
  },
  {
    title: "Fragile production environments with recurring issues",
    description:
      "The same incidents keep surfacing. Deployments carry risk. The team is reactive — patching the same problems repeatedly instead of building the stability that would let them stop.",
  },
  {
    title: "Complex integrations between systems and vendors",
    description:
      "Core systems, third-party platforms, data feeds, and vendor APIs are tightly coupled in fragile ways. When one changes, everything downstream is at risk — and nobody has a full map of the dependencies.",
  },
  {
    title: "Technical debt that's impacting business operations",
    description:
      "Shortcuts taken under pressure have accumulated into constraints. New features take longer than they should. Simple changes require extensive testing. The codebase is now a drag on the pace of the business.",
  },
];

export default function BreakingPoints() {
  return (
    <section
      className="py-24 bg-slate-50 border-y border-slate-200"
      aria-labelledby="breaking-points-heading"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="max-w-2xl mb-14">
          <p className="text-blue-600 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            The Pattern We See
          </p>
          <h2
            id="breaking-points-heading"
            className="text-3xl sm:text-4xl font-bold text-navy-800 leading-tight mb-5"
          >
            Where technology starts breaking
            <br className="hidden sm:block" />{" "}
            <span className="text-slate-400 font-medium">under growth</span>
          </h2>
          <p className="text-slate-500 text-base leading-relaxed">
            Growth puts pressure on the systems behind it. What worked at an earlier scale
            becomes a constraint at the next — and the gap between where your systems are
            and where the business needs to go creates real operational risk.
          </p>
        </div>

        {/* Breaking points grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {breakingPoints.map(({ title, description }, index) => (
            <div
              key={title}
              className="relative flex flex-col p-6 rounded-xl bg-white border border-slate-200 hover:border-blue-200 hover:shadow-sm transition-all duration-150"
            >
              {/* Index accent */}
              <div className="absolute top-5 right-5 text-[10px] font-bold text-slate-300 tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </div>

              {/* Warning indicator */}
              <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center mb-4 shrink-0">
                <svg
                  className="w-4 h-4 text-amber-500"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  aria-hidden
                >
                  <path
                    d="M8 2.5 L14 13.5 H2 Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M8 7v3" strokeLinecap="round" />
                  <circle cx="8" cy="11.5" r="0.5" fill="currentColor" stroke="none" />
                </svg>
              </div>

              <h3 className="text-navy-800 font-semibold text-sm leading-snug mb-2.5">
                {title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>

        {/* Closing statement */}
        <div className="mt-12 p-6 rounded-xl bg-navy-900 border border-white/[0.08]">
          <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
            <span className="text-white font-semibold">These aren&apos;t edge cases.</span>{" "}
            They&apos;re the predictable result of scaling without dedicated technology
            leadership. The companies that navigate them well have someone senior in the
            room — accountable to the business, not just to the engineering org.
          </p>
        </div>
      </div>
    </section>
  );
}
