import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import FAQAccordion from "@/components/contact/FAQAccordion";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Techon Partners to book a free discovery call and discuss your technology challenges and strategic leadership needs.",
  alternates: {
    canonical: "https://techonpartners.com/contact",
  },
};

export default function ContactPage() {
  return (
    <>
      {/* Page header */}
      <section className="bg-navy-900 pt-20 pb-20" aria-labelledby="contact-page-heading">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-4">
            Get in Touch
          </p>
          <h1
            id="contact-page-heading"
            className="text-4xl sm:text-5xl font-bold text-white leading-tight max-w-2xl mx-auto mb-6"
          >
            Let&apos;s Start a Conversation
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Fill out the form below and we&apos;ll respond within 24 hours to schedule a
            free 30-minute discovery call.
          </p>
        </div>
      </section>

      {/* Contact section */}
      <section className="py-24 bg-white" aria-label="Contact form and information">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            {/* Form */}
            <div className="lg:col-span-3">
              <ContactForm />
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-2 space-y-8" aria-label="Contact details">
              <div>
                <h2 className="text-navy-800 font-semibold text-base mb-4">
                  Prefer to Reach Out Directly?
                </h2>
                <div className="space-y-4">
                  <a
                    href="mailto:contact@techonpartners.com"
                    className="flex items-center gap-3 text-slate-600 hover:text-blue-600 transition-colors group"
                  >
                    <span className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors shrink-0">
                      <svg
                        className="w-5 h-5"
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
                    <div>
                      <p className="text-xs text-slate-400 mb-0.5">Email</p>
                      <p className="text-sm font-medium">contact@techonpartners.com</p>
                    </div>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/isaac-drezdner-30b584138/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-slate-600 hover:text-blue-600 transition-colors group"
                  >
                    <span className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors shrink-0">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-xs text-slate-400 mb-0.5">LinkedIn</p>
                      <p className="text-sm font-medium">Connect on LinkedIn</p>
                    </div>
                  </a>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100">
                <h3 className="text-navy-800 font-semibold text-sm mb-2">Response Time</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  All enquiries are personally reviewed by our Founder &amp; CTO. We aim
                  to respond within{" "}
                  <strong className="text-navy-800">24 hours</strong> on business days.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <h3 className="text-navy-800 font-semibold text-sm mb-2">Based In</h3>
                <p className="text-slate-600 text-sm">
                  United States · Available globally for remote engagements
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-slate-50" aria-labelledby="faq-heading">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-blue-600 text-sm font-semibold tracking-widest uppercase mb-3">
              FAQ
            </p>
            <h2 id="faq-heading" className="text-3xl font-bold text-navy-800">
              Common Questions
            </h2>
          </div>
          <FAQAccordion />
        </div>
      </section>
    </>
  );
}
