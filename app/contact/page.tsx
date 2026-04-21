import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import FAQAccordion from "@/components/contact/FAQAccordion";

export const metadata: Metadata = {
  title: "Contact | Techon Partners",
  description:
    "Book a free 30-minute discovery call with Techon Partners. We'll assess your situation and tell you honestly whether this is the right fit.",
  alternates: {
    canonical: "https://techonpartners.com/contact",
  },
};

const reassurances = [
  {
    label: "No long-term commitment",
    detail: "Engagements are month-to-month by default.",
  },
  {
    label: "Honest fit assessment",
    detail: "If we're not the right fit, we'll tell you in the first call.",
  },
  {
    label: "Response within 24 hours",
    detail: "All inquiries are reviewed personally by Isaac Drezdner.",
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy-900 pt-20 pb-24 relative overflow-hidden" aria-labelledby="contact-page-heading">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-0 right-0 w-[500px] h-[400px] rounded-full bg-blue-600/8 blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="max-w-2xl">
            <p className="text-blue-400 text-xs font-semibold tracking-[0.2em] uppercase mb-5">
              Contact
            </p>
            <h1
              id="contact-page-heading"
              className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-5"
            >
              Book a Discovery Call
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              A free 30-minute conversation to understand your situation. No
              pitch. Just an honest discussion about whether we&apos;re the
              right fit.
            </p>
          </div>
        </div>
      </section>

      {/* Contact section */}
      <section className="py-24 bg-slate-50" aria-label="Contact form and information">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14 items-start">

            {/* Form card */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                {/* Accent bar */}
                <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-500" aria-hidden />
                <div className="p-8 sm:p-10">
                  <p className="text-navy-800 font-semibold text-base mb-1">
                    Start the conversation
                  </p>
                  <p className="text-slate-500 text-sm mb-8">
                    We&apos;ll follow up within 24 hours to arrange a call.
                  </p>
                  <ContactForm />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-2 space-y-6 lg:pt-2" aria-label="Contact details">

              {/* Reassurance */}
              <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <div className="h-1 bg-gradient-to-r from-emerald-500 to-emerald-400" aria-hidden />
                <div className="p-6 space-y-5">
                  <p className="text-navy-800 font-semibold text-sm">
                    What to expect
                  </p>
                  {reassurances.map(({ label, detail }) => (
                    <div key={label} className="flex gap-3">
                      <svg
                        className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden
                      >
                        <path d="M2 8l4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div>
                        <p className="text-navy-800 font-medium text-sm mb-0.5">{label}</p>
                        <p className="text-slate-500 text-sm leading-relaxed">{detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct contact */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-navy-800 font-semibold text-sm mb-4">
                  Or reach out directly
                </p>
                <div className="space-y-3">
                  <a
                    href="mailto:contact@techonpartners.com"
                    className="flex items-center gap-3 text-slate-600 hover:text-blue-600 transition-colors group"
                  >
                    <span className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-blue-600 group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors shrink-0">
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden
                      >
                        <path
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="text-sm font-medium">contact@techonpartners.com</span>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/isaac-drezdner-30b584138/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-slate-600 hover:text-blue-600 transition-colors group"
                  >
                    <span className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-blue-600 group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors shrink-0">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </span>
                    <span className="text-sm font-medium">Connect on LinkedIn</span>
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-white border-t border-slate-200" aria-labelledby="faq-heading">
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-12">
            <p className="text-blue-600 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
              FAQ
            </p>
            <h2 id="faq-heading" className="text-3xl font-bold text-navy-800">
              Common questions
            </h2>
          </div>
          <FAQAccordion />
        </div>
      </section>
    </>
  );
}
