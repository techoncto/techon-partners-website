"use client";

import { useState, type FormEvent } from "react";

const contactReasons = [
  "Technology Strategy",
  "Team Building",
  "Architecture Review",
  "Digital Transformation",
  "Technical Due Diligence",
  "Something Else",
];

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    reason: "",
    message: "",
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const body = new URLSearchParams({
        "form-name": "contact",
        ...form,
      }).toString();

      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });

      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (status === "error") {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-7 h-7 text-red-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="text-navy-800 font-bold text-xl mb-2">Something went wrong</h2>
        <p className="text-slate-500 text-sm mb-5">
          The message couldn&apos;t be sent. Please try again or email directly at{" "}
          <a href="mailto:contact@techonpartners.com" className="text-blue-600 hover:underline">
            contact@techonpartners.com
          </a>
          .
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="px-6 py-2.5 rounded-xl bg-navy-900 text-white text-sm font-medium hover:bg-navy-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-10 text-center">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-7 h-7 text-green-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="text-navy-800 font-bold text-xl mb-2">Message Sent!</h2>
        <p className="text-slate-500 text-sm">
          Thanks for reaching out. I&apos;ll be in touch within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      name="contact"
      data-netlify="true"
      className="space-y-5"
      aria-label="Contact form"
      noValidate
    >
      <input type="hidden" name="form-name" value="contact" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-navy-700 mb-1.5">
            Full Name <span className="text-red-500" aria-hidden>*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Jane Smith"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-navy-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-navy-700 mb-1.5">
            Work Email <span className="text-red-500" aria-hidden>*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            placeholder="jane@company.com"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-navy-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
          />
        </div>
      </div>

      <div>
        <label htmlFor="company" className="block text-sm font-medium text-navy-700 mb-1.5">
          Company Name
        </label>
        <input
          id="company"
          name="company"
          type="text"
          autoComplete="organization"
          value={form.company}
          onChange={handleChange}
          placeholder="Acme Inc."
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-navy-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
        />
      </div>

      <div>
        <label htmlFor="reason" className="block text-sm font-medium text-navy-700 mb-1.5">
          How Can I Help?
        </label>
        <select
          id="reason"
          name="reason"
          value={form.reason}
          onChange={handleChange}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-navy-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
        >
          <option value="">Select a service area...</option>
          {contactReasons.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-navy-700 mb-1.5">
          Tell Me About Your Situation <span className="text-red-500" aria-hidden>*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={form.message}
          onChange={handleChange}
          placeholder="What challenges are you facing? What are you hoping to achieve? The more context you share, the more useful our first call will be."
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-navy-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow resize-y min-h-[120px]"
        />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full sm:w-auto px-8 py-3 rounded-xl bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 active:bg-blue-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
      >
        {status === "submitting" ? (
          <>
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </button>
    </form>
  );
}
