import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms governing use of the Techon Partners website.",
  alternates: {
    canonical: "https://techonpartners.com/terms-of-service",
  },
  robots: { index: false, follow: false },
};

const lastUpdated = "March 2026";

export default function TermsOfServicePage() {
  return (
    <>
      {/* Page header */}
      <section className="bg-navy-900 pt-20 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-blue-600/8 blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-6">
          <p className="text-blue-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            Legal
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
            Terms of Service
          </h1>
          <p className="text-slate-400 text-sm">
            Last updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="prose-legal">

            <div className="mb-10">
              <p className="text-slate-600 leading-relaxed">
                These Terms of Service govern your use of the Techon Partners website
                located at{" "}
                <a href="https://techonpartners.com" className="text-blue-600 hover:underline">
                  techonpartners.com
                </a>
                . By accessing this website, you agree to these terms. If you do not
                agree, please do not use the site.
              </p>
            </div>

            <div className="space-y-10">

              <div>
                <h2 className="text-xl font-bold text-navy-800 mb-3">
                  Use of This Website
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  This website is provided for informational purposes only — to describe
                  the services offered by Techon Partners and to allow prospective clients
                  to make contact. You may use this site for lawful purposes consistent
                  with these terms. You agree not to misuse the site, attempt to disrupt
                  its operation, or use it in any way that could cause harm to Techon
                  Partners or others.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-navy-800 mb-3">
                  Informational Purposes Only
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  The content on this site — including descriptions of services,
                  approaches, and outcomes — is provided for general informational
                  purposes. Nothing on this website constitutes professional advice,
                  a guarantee of results, or a representation of what any specific
                  engagement will deliver. Every business situation is different, and
                  outcomes depend on factors specific to each client.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-navy-800 mb-3">
                  No Liability for Decisions
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  Techon Partners is not liable for any decisions made, actions taken,
                  or outcomes experienced as a result of reading content on this website.
                  If you are considering a significant business or technology decision,
                  we encourage you to speak directly with a qualified advisor — including,
                  if appropriate, us.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-navy-800 mb-3">
                  Intellectual Property
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  All content on this website — including text, design, structure, and
                  branding — is the property of Techon Partners and is protected by
                  applicable intellectual property laws. You may not reproduce, copy,
                  or redistribute any part of this site without our prior written
                  permission.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-navy-800 mb-3">
                  Third-Party Links
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  This website may include links to external sites (such as LinkedIn).
                  These are provided for convenience only. Techon Partners has no control
                  over the content or practices of external websites and accepts no
                  responsibility for them.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-navy-800 mb-3">
                  Disclaimer of Warranties
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  This website is provided &ldquo;as is&rdquo; without warranties of any
                  kind, express or implied. We make reasonable efforts to keep content
                  accurate and the site operational, but we do not guarantee that the
                  site will be error-free, uninterrupted, or free of outdated information.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-navy-800 mb-3">
                  Changes to These Terms
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  We may update these Terms of Service at any time. Changes will be
                  posted to this page with an updated date. Continued use of the website
                  after any update constitutes your acceptance of the revised terms.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-navy-800 mb-3">
                  Contact
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  If you have any questions about these Terms of Service, please reach
                  out at{" "}
                  <a
                    href="mailto:contact@techonpartners.com"
                    className="text-blue-600 hover:underline"
                  >
                    contact@techonpartners.com
                  </a>
                  .
                </p>
              </div>

            </div>
          </div>

          {/* Back link */}
          <div className="mt-14 pt-8 border-t border-slate-200">
            <Link
              href="/"
              className="text-slate-500 text-sm font-medium hover:text-navy-800 transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
