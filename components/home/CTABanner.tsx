import Button from "@/components/ui/Button";

export default function CTABanner() {
  return (
    <section
      className="relative overflow-hidden bg-navy-900 py-24"
      aria-labelledby="cta-heading"
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-blue-600/12 blur-3xl" />
      </div>

      {/* Top border accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-600/40 to-transparent" aria-hidden />

      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-600/10 text-blue-400 text-xs font-semibold tracking-widest uppercase mb-8">
          Let&apos;s Work Together
        </div>

        <h2
          id="cta-heading"
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6"
        >
          Your next technology decision
          <br className="hidden sm:block" />
          is too important to get wrong.
        </h2>

        <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
          Book a free 30-minute call. We&apos;ll assess your situation, share our honest
          view, and tell you directly whether this is the right engagement for what
          you&apos;re facing.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
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
            Browse Services
          </Button>
        </div>

        {/* Trust signals */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-slate-600 text-xs">
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-emerald-500" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M2 7l3.5 3.5L12 3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Respond within 24 hours
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-emerald-500" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M2 7l3.5 3.5L12 3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            No long-term contracts required
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-emerald-500" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M2 7l3.5 3.5L12 3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Honest fit assessment, no pitch
          </span>
        </div>
      </div>
    </section>
  );
}
