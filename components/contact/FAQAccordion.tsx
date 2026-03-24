"use client";

import { useState } from "react";

const faqs = [
  {
    q: "What does a Fractional CTO actually do?",
    a: "A Fractional CTO provides the same strategic and technical leadership as a full-time CTO, but on a part-time or project basis. At Techon Partners, that means technology strategy, engineering team leadership, architecture decisions, vendor evaluation, and board-level communication — all without the cost of a full-time executive hire.",
  },
  {
    q: "How many hours per week does Techon Partners work with a client?",
    a: "It depends on the engagement model. Advisory retainers are typically 4–8 hours/month. Embedded Fractional engagements are usually 2–3 days per week. We agree on the right level during the discovery phase and can adjust as your needs evolve.",
  },
  {
    q: "Does Techon Partners work with companies outside the US?",
    a: "Yes. We work with companies globally. Most collaboration happens asynchronously, with regular video calls. Time zone overlap is something we discuss during the scoping process.",
  },
  {
    q: "How long does a typical engagement last?",
    a: "Most engagements run 3–12 months, with month-to-month renewals. Some clients engage Techon Partners for a focused 4-week project; others have had us embedded for 2+ years. There are no lock-in contracts.",
  },
  {
    q: "What types of companies does Techon Partners work with?",
    a: "We work with companies across industries — the common thread is growth pressure, not sector. The problems we solve tend to appear when a company is scaling faster than its technology and engineering org can keep up: systems under strain, teams without clear structure, delivery that has become unpredictable. If that describes your situation, industry is rarely a barrier. We'll tell you honestly in the first call if we're not the right fit.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-slate-200 last:border-b-0">
      <button
        type="button"
        className="w-full py-5 flex items-center justify-between text-left gap-4 hover:text-blue-600 transition-colors"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="text-navy-800 font-medium text-sm">{q}</span>
        <span
          className={`shrink-0 w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center transition-transform ${open ? "rotate-45" : ""}`}
          aria-hidden
        >
          <svg
            className="w-3 h-3 text-slate-600"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M6 2v8M2 6h8" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      {open && <p className="pb-5 text-slate-500 text-sm leading-relaxed">{a}</p>}
    </div>
  );
}

export default function FAQAccordion() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-200 overflow-hidden px-6">
      {faqs.map((faq) => (
        <FAQItem key={faq.q} {...faq} />
      ))}
    </div>
  );
}
