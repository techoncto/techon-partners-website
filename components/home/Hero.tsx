import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-navy-900 pt-28 pb-20 sm:pt-36 sm:pb-24"
      aria-label="Hero"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-blue-600/8 blur-3xl" />
      </div>

      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-5xl mx-auto px-6 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-bold text-white leading-[1.08] tracking-tight max-w-4xl mx-auto">
          Fractional CTO Leadership for Companies{" "}
          <br className="hidden sm:block" />
          <span className="gradient-text">Navigating Growth and Complexity</span>
        </h1>

        <p className="mt-7 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
          Senior technology leadership inside your company, solving the systems
          and operational problems that emerge when growth outpaces infrastructure.
        </p>

        <div className="mt-10">
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
        </div>
      </div>
    </section>
  );
}
