import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Techon Partners collects, uses, and protects information submitted through this website.",
  alternates: {
    canonical: "https://techonpartners.com/privacy-policy",
  },
  robots: { index: false, follow: false },
};

const lastUpdated = "March 2026";

export default function PrivacyPolicyPage() {
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
            Privacy Policy
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
                Techon Partners (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;)
                operates this website at{" "}
                <a href="https://techonpartners.com" className="text-blue-600 hover:underline">
                  techonpartners.com
                </a>
                . This Privacy Policy explains how we handle information you provide
                when you visit or contact us through this site. We take your privacy
                seriously and keep our practices simple and transparent.
              </p>
            </div>

            <div className="space-y-10">

              <div>
                <h2 className="text-xl font-bold text-navy-800 mb-3">
                  Information We Collect
                </h2>
                <p className="text-slate-600 leading-relaxed mb-3">
                  We only collect information you voluntarily provide to us. This includes:
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-2" aria-hidden />
                    <span>
                      <strong className="text-navy-800">Contact form submissions</strong> — your
                      name, email address, company name (if provided), and the message you write.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-2" aria-hidden />
                    <span>
                      <strong className="text-navy-800">Basic analytics</strong> — if we use
                      analytics tools, they may collect anonymised data such as page views,
                      browser type, and general geographic region. No personally identifiable
                      information is collected through analytics.
                    </span>
                  </li>
                </ul>
                <p className="text-slate-600 leading-relaxed mt-3">
                  We do not use tracking pixels, advertising networks, or any tools designed
                  to follow you across other websites.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-navy-800 mb-3">
                  How We Use Your Information
                </h2>
                <p className="text-slate-600 leading-relaxed mb-3">
                  Information you submit through this site is used solely to:
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-2" aria-hidden />
                    <span>Respond to your inquiry or schedule an initial conversation.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-2" aria-hidden />
                    <span>Understand how the site is being used so we can improve it.</span>
                  </li>
                </ul>
                <p className="text-slate-600 leading-relaxed mt-3">
                  We do not use your contact information for marketing or add you to any
                  mailing lists without your explicit consent.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-navy-800 mb-3">
                  Data Sharing
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  We do not sell, rent, or trade your personal information to any third
                  party. We may use trusted third-party services (such as a contact form
                  platform or email provider) to process and deliver your messages — these
                  services are used only to facilitate communication and are not permitted
                  to use your data for their own purposes.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-navy-800 mb-3">
                  Data Retention
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  We retain contact form submissions only for as long as is necessary to
                  respond to your inquiry or maintain a record of business communication.
                  If you would like your information removed, contact us at the address
                  below and we will action it promptly.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-navy-800 mb-3">
                  Data Security
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  We take reasonable technical and organisational precautions to protect
                  information submitted through this site. This website is served over HTTPS.
                  While no online transmission is entirely risk-free, we handle any
                  information you provide with care and discretion.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-navy-800 mb-3">
                  Your Rights
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  You have the right to request access to, correction of, or deletion of
                  any personal information we hold about you. To exercise any of these
                  rights, contact us directly at the email address below.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-navy-800 mb-3">
                  Changes to This Policy
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  We may update this Privacy Policy from time to time. Any changes will
                  be reflected on this page with an updated date at the top. Continued
                  use of this website after an update constitutes acceptance of the
                  revised policy.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-navy-800 mb-3">
                  Contact
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  If you have any questions about this Privacy Policy or how we handle
                  your information, please contact us at{" "}
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
