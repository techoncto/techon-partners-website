const values = [
  {
    label: "CTO-Level Execution",
    detail: "Strategy and execution from someone who has held the CTO role, with the same accountability.",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Embedded in Days",
    detail: "No long onboarding. We move fast, ask the right questions, and start delivering week one.",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Flexible Engagement",
    detail: "Scale our involvement up or down as your needs evolve. Month-to-month by default.",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "No Lock-In",
    detail: "No long-term contracts. We earn the relationship through results, not obligation.",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function ValueStrip() {
  return (
    <section
      className="bg-white border-b border-slate-200"
      aria-label="Core value propositions"
    >
      <div className="max-w-6xl mx-auto px-6">
        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
          {values.map(({ label, detail, icon }) => (
            <div
              key={label}
              className="flex items-start gap-4 py-7 px-0 lg:px-8 first:pl-0 last:pr-0"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                {icon}
              </div>
              <div>
                <dt className="text-navy-800 font-semibold text-sm mb-0.5">{label}</dt>
                <dd className="text-slate-500 text-sm leading-relaxed">{detail}</dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
