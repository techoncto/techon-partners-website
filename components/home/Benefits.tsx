import SectionHeader from "@/components/ui/SectionHeader";

const benefits = [
  {
    stat: "60%",
    label: "Lower cost than full-time",
    description: "Get a seasoned CTO-level leader at a fraction of the fully-loaded cost of a full-time hire.",
  },
  {
    stat: "Day 1",
    label: "Immediate impact",
    description: "No ramp-up lag. I embed quickly, ask the right questions, and start driving value from the first week.",
  },
  {
    stat: "∞",
    label: "Flexible engagement",
    description: "Scale my involvement up or down as your needs evolve — from a few hours a week to deeply embedded.",
  },
  {
    stat: "15+",
    label: "Years of hands-on experience",
    description: "Backed by deep experience across startups, scale-ups, and enterprise digital transformation programs.",
  },
];

const differentiators = [
  {
    title: "Builders, not just consultants",
    description:
      "We've shipped products, hired teams, and made the hard calls. The advice we give is grounded in real accountability.",
  },
  {
    title: "Business-first thinking",
    description:
      "Technology is a means, not an end. We keep engineering decisions tightly connected to revenue, growth, and user value.",
  },
  {
    title: "Transparent communication",
    description:
      "You'll always know what we're doing and why. No jargon, no surprises — just clear reporting and open dialogue.",
  },
  {
    title: "No lock-in",
    description:
      "Month-to-month engagements by default. We earn your trust every month rather than relying on long contracts.",
  },
];

export default function Benefits() {
  return (
    <section className="py-24 bg-slate-50" aria-labelledby="benefits-heading">
      <div className="max-w-6xl mx-auto px-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {benefits.map(({ stat, label, description }) => (
            <div
              key={label}
              className="p-6 rounded-2xl bg-white border border-slate-200 text-center"
            >
              <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-1">{stat}</div>
              <div className="text-navy-800 font-semibold text-sm mb-2">{label}</div>
              <p className="text-slate-500 text-xs leading-relaxed">{description}</p>
            </div>
          ))}
        </div>

        {/* Differentiators */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionHeader
              eyebrow="Why Techon Partners"
              title="The Techon Partners Difference"
              subtitle="Not just strategic advice — hands-on partnership that moves your engineering forward."
              align="left"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {differentiators.map(({ title, description }) => (
              <div key={title} className="flex gap-4">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-blue-600" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-navy-800 font-semibold text-sm mb-1">{title}</h3>
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
