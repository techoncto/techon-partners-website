import Link from "next/link";
import Button from "@/components/ui/Button";

const services = [
  {
    id: "strategy",
    tag: "Strategy",
    title: "Technology Strategy & Systems Planning",
    summary:
      "A technology direction rooted in how your business operates — identifying system risks, prioritizing investments, and producing a plan leadership can act on.",
    deliverables: [
      "Current-state systems and integration audit",
      "12–18 month prioritized roadmap",
      "Buy vs. build vs. integrate framework",
      "Operational risk register and prioritized action plan",
    ],
    href: "/services#strategy",
    accent: "from-blue-600 to-blue-700",
  },
  {
    id: "leadership",
    tag: "Leadership",
    title: "Engineering Leadership & Org Design",
    summary:
      "Day-to-day technical leadership embedded in your team — setting the standard for how systems are built, decisions are made, and operational work gets done.",
    deliverables: [
      "Engineering org design and headcount planning",
      "Hiring process and interview frameworks",
      "Engineering standards and performance culture",
      "System ownership and accountability structure",
    ],
    href: "/services#leadership",
    accent: "from-cyan-600 to-blue-600",
  },
  {
    id: "architecture",
    tag: "Systems",
    title: "Systems, Integrations & Architecture",
    summary:
      "Structured assessment of the operational platforms and integrations your business depends on — surfacing fragility, debt, and risk before they become incidents.",
    deliverables: [
      "Operational systems and integration audit",
      "Scalability and reliability assessment",
      "Technical debt inventory and prioritization",
      "Modernization plan with phased execution",
    ],
    href: "/services#architecture",
    accent: "from-blue-700 to-navy-800",
  },
];

export default function ServicesPreview() {
  return (
    <section className="py-24 bg-slate-50" aria-labelledby="services-preview-heading">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-blue-600 text-xs font-semibold tracking-[0.2em] uppercase mb-3">
              Services
            </p>
            <h2
              id="services-preview-heading"
              className="text-3xl sm:text-4xl font-bold text-navy-800 leading-tight"
            >
              Where We Focus
            </h2>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors shrink-0"
          >
            View all services
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M3 8h10m-4-4 4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* Service cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map(({ tag, title, summary, deliverables, href, accent }) => (
            <article
              key={tag}
              className="group flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-0.5 transition-all duration-200"
            >
              {/* Accent bar */}
              <div className={`h-1 bg-gradient-to-r ${accent}`} aria-hidden />

              <div className="flex flex-col flex-1 p-7">
                {/* Tag */}
                <span className="inline-flex self-start text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full mb-4">
                  {tag}
                </span>

                <h3 className="text-navy-800 font-bold text-lg leading-snug mb-3 group-hover:text-blue-600 transition-colors">
                  {title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-5">{summary}</p>

                {/* Deliverables */}
                <ul className="space-y-2 mb-6 flex-1" aria-label={`${title} deliverables`}>
                  {deliverables.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-slate-600 text-sm">
                      <span className="w-1 h-1 rounded-full bg-blue-400 shrink-0 mt-2" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>

                <Link
                  href={href}
                  className="inline-flex items-center gap-1.5 text-blue-600 text-sm font-medium hover:gap-2.5 transition-all"
                >
                  Learn more
                  <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="M2 7h10m-4-4 4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom CTA row */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-200">
          <p className="text-slate-500 text-sm">
            Also available: Technical Due Diligence, Workflow Automation, Integration Architecture, and Vendor Selection.
          </p>
          <Button href="/services" variant="outline">
            Explore All Services
          </Button>
        </div>
      </div>
    </section>
  );
}
