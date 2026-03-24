import Button from "@/components/ui/Button";

const scenarios = [
  {
    signal: "Your operational systems are failing under growth",
    detail:
      "The platforms running your core operations weren't designed for where you are now. Volume is exposing their limits — through slowdowns, data errors, manual workarounds, and incidents that keep repeating. The cost of staying the course is compounding.",
  },
  {
    signal: "Integrations between your systems are fragile or broken",
    detail:
      "Data doesn't flow reliably between the tools, platforms, and vendors your business depends on. Changes in one system break things downstream. Nobody has a clear picture of the full dependency map — and every integration is a single point of failure.",
  },
  {
    signal: "Manual workflows have become a business constraint",
    detail:
      "Processes that made sense at an earlier stage are now bottlenecks. Teams are spending significant time on reconciliation, data entry, and exception handling that should be automated — slowing operations and limiting what the business can take on.",
  },
  {
    signal: "The engineering org has outgrown its structure",
    detail:
      "You've grown the team, but the org still runs like it did when there were five people. Roles are unclear, system ownership is fragmented, and the most experienced people are handling work that shouldn't require them.",
  },
  {
    signal: "A high-stakes system decision is approaching",
    detail:
      "A platform migration, a new operational system, a major integration build, or a re-architecture. The decision will shape what the business can build and operate for the next two to three years — and you need someone with direct experience making these calls, with accountability for the outcome.",
  },
  {
    signal: "Investors or acquirers are asking questions you can't fully answer",
    detail:
      "Technical due diligence is underway or approaching. You need an honest internal assessment of your systems, integrations, and technical debt before an external party forms their own view — from someone who can speak directly to what they're asking.",
  },
];

export default function WhyFractionalCTO() {
  return (
    <section
      className="py-24 bg-navy-900 relative overflow-hidden"
      aria-labelledby="why-fractional-heading"
    >
      {/* Background texture */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-blue-600/8 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14 items-end">
          <div>
            <p className="text-blue-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
              Why Hire a Fractional CTO
            </p>
            <h2
              id="why-fractional-heading"
              className="text-3xl sm:text-4xl font-bold text-white leading-tight"
            >
              Situations We&apos;re Built For
            </h2>
          </div>
          <div>
            <p className="text-slate-400 leading-relaxed">
              Companies come to Techon Partners when growth has made their technology
              problems operational — systems that can&apos;t keep up, integrations that
              are breaking down, and workflows that were never built to scale. If any of
              these sound familiar, we should talk.
            </p>
          </div>
        </div>

        {/* Scenario cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenarios.map(({ signal, detail }) => (
            <div
              key={signal}
              className="p-6 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-blue-500/30 transition-all duration-150 group"
            >
              {/* Signal */}
              <div className="flex items-start gap-3 mb-3">
                <span className="w-5 h-5 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-blue-600/30 transition-colors">
                  <svg
                    className="w-3 h-3 text-blue-400"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden
                  >
                    <path d="M6 2v4l2.5 2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="6" cy="6" r="4.5" />
                  </svg>
                </span>
                <h3 className="text-white font-semibold text-sm leading-snug">{signal}</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed pl-8">{detail}</p>
            </div>
          ))}
        </div>

        {/* Bottom prompt */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-5 pt-10 border-t border-white/[0.08]">
          <p className="text-slate-400 text-sm max-w-lg">
            Not sure if a fractional engagement is the right fit? We&apos;ll tell you honestly
            in the first call — and point you in the right direction if it&apos;s not.
          </p>
          <Button href="/contact" variant="outline" className="border-blue-500/40 text-blue-400 hover:bg-blue-600/10 hover:border-blue-400 shrink-0">
            Start the Conversation
          </Button>
        </div>
      </div>
    </section>
  );
}
