import Link from "next/link";

const services = [
  {
    title: "Technology Strategy",
    description:
      "Clear roadmap aligned with business priorities.",
    href: "/services#strategy",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Systems & Architecture",
    description:
      "Stable, scalable systems and integrations.",
    href: "/services#architecture",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <circle cx="5" cy="12" r="2" strokeLinecap="round" />
        <circle cx="19" cy="6" r="2" strokeLinecap="round" />
        <circle cx="19" cy="18" r="2" strokeLinecap="round" />
        <path d="M7 12h6m0-4.5 2.5-1.5m-2.5 10 2.5 1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Execution & Delivery",
    description:
      "Leadership that improves how your team operates and delivers.",
    href: "/services#leadership",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function WhatWeDo() {
  return (
    <section className="py-24 bg-white" aria-labelledby="what-we-do-heading">
      <div className="max-w-5xl mx-auto px-6">
        <div className="max-w-2xl mb-14">
          <p className="text-blue-600 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            What We Do
          </p>
          <h2
            id="what-we-do-heading"
            className="text-3xl sm:text-4xl font-bold text-navy-800 leading-tight mb-5"
          >
            CTO-level leadership, embedded in your company
          </h2>
          <p className="text-slate-500 text-base leading-relaxed">
            Techon Partners works inside your organization as your senior
            technology leader, accountable for strategy, systems, and
            execution. Not advising from a distance, but directly involved
            in decisions and delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map(({ title, description, href, icon }) => (
            <Link
              key={title}
              href={href}
              className="group flex flex-col p-7 rounded-2xl border border-slate-200 bg-white hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-200"
            >
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 group-hover:bg-blue-100 transition-colors">
                {icon}
              </div>
              <h3 className="text-navy-800 font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                {title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed flex-1">
                {description}
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Learn more
                <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M2 7h10m-4-4 4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
