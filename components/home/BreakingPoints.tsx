const problems = [
  {
    title: "Systems that can't keep up with volume",
    description:
      "The platforms running your operations weren't built for this scale. They slow down, break, and require constant workarounds.",
  },
  {
    title: "Fragile integrations between tools and vendors",
    description:
      "Data doesn't flow reliably. A change in one system breaks things downstream, and nobody has the full dependency map.",
  },
  {
    title: "Manual processes that create bottlenecks and don't scale",
    description:
      "Teams spend hours on reconciliation, data entry, and exception handling that should be automated. The cost to the business is real.",
  },
  {
    title: "No clear technology leadership accountable for outcomes",
    description:
      "Decisions get deferred, technical debt compounds, and there's no one senior enough to own the path forward.",
  },
];

export default function BreakingPoints() {
  return (
    <section
      className="py-24 bg-slate-50 border-y border-slate-200"
      aria-labelledby="problems-heading"
    >
      <div className="max-w-5xl mx-auto px-6">
        <div className="max-w-2xl mb-12">
          <p className="text-blue-600 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            The Pattern We See
          </p>
          <h2
            id="problems-heading"
            className="text-3xl sm:text-4xl font-bold text-navy-800 leading-tight"
          >
            When growth creates complexity
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {problems.map(({ title, description }) => (
            <div
              key={title}
              className="flex gap-4 p-6 rounded-xl bg-white border border-slate-200"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
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
              <div>
                <h3 className="text-navy-800 font-semibold text-sm leading-snug mb-1.5">
                  {title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
