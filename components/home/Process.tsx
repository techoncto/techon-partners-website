const steps = [
  {
    number: "01",
    title: "Discovery Call",
    description:
      "A free 30-minute conversation to understand your business, team, and technology challenges. We listen first. No pitch.",
    detail: "30 min · Free · No obligation",
  },
  {
    number: "02",
    title: "Assessment & Proposal",
    description:
      "Within a week, we deliver a candid assessment of your situation and a proposed engagement scope — with clear deliverables and outcomes.",
    detail: "3–5 business days",
  },
  {
    number: "03",
    title: "Kick-off & Embed",
    description:
      "We agree on goals, communication cadence, and success criteria. Embedded work begins immediately — no ramp-up lag.",
    detail: "Week one delivery",
  },
  {
    number: "04",
    title: "Ongoing Partnership",
    description:
      "Regular working sessions, direct availability between calls, and hands-on delivery. Monthly reviews keep the engagement aligned as needs evolve.",
    detail: "Month-to-month by default",
  },
];

export default function Process() {
  return (
    <section className="py-24 bg-white" aria-labelledby="process-heading">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <p className="text-blue-600 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            How It Works
          </p>
          <h2
            id="process-heading"
            className="text-3xl sm:text-4xl font-bold text-navy-800 leading-tight mb-4"
          >
            From First Call to Embedded Delivery
          </h2>
          <p className="text-slate-500 text-base leading-relaxed">
            A straightforward process designed to move quickly — the problems you
            have today can&apos;t wait six months for an engagement to ramp up.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line — desktop */}
          <div
            className="hidden lg:block absolute top-[2.25rem] h-px bg-slate-200 z-0"
            aria-hidden
            style={{ left: "calc(1rem + 2.25rem / 2)", right: "calc(1rem + 2.25rem / 2)" }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map(({ number, title, description, detail }, index) => (
              <div key={number} className="relative flex flex-col">
                {/* Step indicator */}
                <div className="relative z-10 flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-full bg-navy-900 border-2 border-blue-600 flex items-center justify-center shrink-0">
                    <span className="text-blue-400 font-bold text-xs">{number}</span>
                  </div>
                  {/* Mobile connector line */}
                  {index < steps.length - 1 && (
                    <div className="lg:hidden flex-1 h-px bg-slate-200" aria-hidden />
                  )}
                </div>

                {/* Content */}
                <div>
                  <div className="inline-flex items-center mb-2.5">
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                      {detail}
                    </span>
                  </div>
                  <h3 className="text-navy-800 font-semibold text-base mb-2">{title}</h3>
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
