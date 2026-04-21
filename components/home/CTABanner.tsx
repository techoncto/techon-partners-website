import Button from "@/components/ui/Button";

export default function CTABanner() {
  return (
    <section
      className="relative overflow-hidden bg-navy-900 py-24"
      aria-labelledby="cta-heading"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-blue-600/12 blur-3xl" />
      </div>

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-600/40 to-transparent" aria-hidden />

      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <h2
          id="cta-heading"
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5"
        >
          Let&apos;s talk about what you&apos;re facing.
        </h2>

        <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
          Book a free 30-minute call. We&apos;ll give you an honest assessment
          and tell you directly whether this is the right fit.
        </p>

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

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-slate-600 text-xs">
          <span>No long-term contracts</span>
          <span className="w-px h-3 bg-slate-700" aria-hidden />
          <span>Response within 24 hours</span>
          <span className="w-px h-3 bg-slate-700" aria-hidden />
          <span>Honest fit assessment</span>
        </div>
      </div>
    </section>
  );
}
