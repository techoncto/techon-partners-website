import Button from "@/components/ui/Button";
import Link from "next/link";

export default function AboutPreview() {
  return (
    <section className="py-24 bg-slate-50" aria-labelledby="about-preview-heading">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-14 items-center">

          {/* Leadership card */}
          <div className="rounded-2xl bg-navy-900 overflow-hidden">
            <div className="p-7 flex items-start gap-5">
              <div className="w-14 h-14 rounded-xl bg-navy-700 border border-navy-600 flex items-center justify-center shrink-0">
                <svg
                  className="w-7 h-7 text-slate-500"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-label="Founder profile"
                >
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm mb-0.5">Isaac Drezdner</p>
                <p className="text-blue-400 text-xs font-semibold uppercase tracking-wide">
                  Founder &amp; CTO, Techon Partners
                </p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-[10px] tracking-tight shrink-0">
                TP
              </div>
            </div>

            <div className="border-t border-white/[0.07] px-7 py-5">
              <p className="text-slate-400 text-sm leading-relaxed">
                &ldquo;Every engagement is led personally — embedded in your
                systems and decisions, not advising from a distance.&rdquo;
              </p>
            </div>

            <div className="border-t border-white/[0.07] px-7 py-4 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden />
                <span className="text-emerald-400 text-xs font-medium">
                  Available for engagements
                </span>
              </span>
              <a
                href="https://www.linkedin.com/in/isaac-drezdner-30b584138/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 text-xs hover:text-slate-300 transition-colors"
              >
                LinkedIn &rarr;
              </a>
            </div>
          </div>

          {/* Copy */}
          <div>
            <p className="text-blue-600 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
              Led by Isaac Drezdner
            </p>
            <h2
              id="about-preview-heading"
              className="text-3xl sm:text-4xl font-bold text-navy-800 leading-tight mb-5"
            >
              10+ years in operational systems.{" "}
              <span className="text-slate-400 font-medium">
                Every engagement run personally.
              </span>
            </h2>
            <p className="text-slate-500 leading-relaxed mb-5">
              Isaac Drezdner has spent 10+ years leading engineering teams
              through core system implementations, complex integrations, and
              platform scaling under real business load. Hands-on leadership
              with accountability for outcomes.
            </p>
            <p className="text-slate-500 leading-relaxed mb-8">
              The person you speak to on the first call is the one
              delivering the engagement. Direct access to senior leadership
              from day one.
            </p>

            <div className="flex items-center gap-4">
              <Button href="/about" variant="primary">
                About the Firm
              </Button>
              <Link
                href="/contact"
                className="text-slate-500 text-sm font-medium hover:text-navy-800 transition-colors"
              >
                Start a conversation &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
