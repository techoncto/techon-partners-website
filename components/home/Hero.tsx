import Button from "@/components/ui/Button";

const clients = [
  "Post-Series A",
  "High-growth Scale-ups",
  "Founder-led Operators",
  "PE-backed Platforms",
  "Pre-IPO Engineering",
  "Scaling Operational Businesses",
];

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-navy-900 pt-28 pb-0 sm:pt-36"
      aria-label="Hero"
    >
      {/* Ambient background glows */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-blue-600/8 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-cyan-500/6 blur-3xl" />
      </div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2.5 mb-7">
          <span className="text-slate-400 text-xs font-semibold tracking-[0.2em] uppercase">
            Techon Partners
          </span>
          <span className="w-px h-3 bg-slate-700" aria-hidden />
          <span className="text-slate-500 text-xs font-medium tracking-[0.15em] uppercase">
            Strategic Technology Leadership
          </span>
        </div>

        {/* H1 */}
        <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-bold text-white leading-[1.08] tracking-tight max-w-4xl mx-auto">
          Fractional CTO Leadership{" "}
          <br className="hidden sm:block" />
          for{" "}
          <span className="gradient-text">Growth and Complexity</span>
        </h1>

        {/* Subtext */}
        <p className="mt-7 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
          Techon Partners provides embedded CTO-level leadership inside your company —
          solving the operational, integration, and system-level problems that emerge when
          growth outpaces the infrastructure behind it.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button href="/contact" size="lg" variant="primary">
            Book a Discovery Call
            <svg
              className="w-4 h-4"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path d="M3 8h10m-4-4 4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Button>
          <Button
            href="/services"
            size="lg"
            variant="ghost"
            className="text-slate-400 hover:text-white hover:bg-white/5"
          >
            Explore Services
          </Button>
        </div>

        {/* Availability signal */}
        <div className="mt-6 inline-flex items-center gap-2 text-slate-500 text-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden />
          Currently taking on new engagements
        </div>

        {/* Social proof strip — blends into bottom of hero */}
        <div className="mt-20 pt-8 border-t border-white/[0.06]">
          <p className="text-slate-600 text-xs font-medium tracking-widest uppercase mb-5">
            Trusted by leadership teams at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 pb-10">
            {clients.map((name) => (
              <span
                key={name}
                className="text-slate-600 text-sm font-medium"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
