"use client";

import { useRef, useState, type FormEvent } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const contactReasons = [
  "Technology Strategy",
  "Team Building",
  "Architecture Review",
  "Digital Transformation",
  "Technical Due Diligence",
  "Something Else",
];

type FormState = {
  name: string;
  email: string;
  company: string;
  reason: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormState | "recaptcha", string>>;

const inputClass =
  "w-full px-4 py-2.5 rounded-xl border bg-white text-navy-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow";

export default function ContactForm() {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errors, setErrors] = useState<FormErrors>({});
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    company: "",
    reason: "",
    message: "",
  });

  const validate = (): FormErrors => {
    const e: FormErrors = {};

    if (!form.name.trim()) e.name = "Full name is required.";
    if (!form.email.trim()) {
      e.email = "Work email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Enter a valid email address.";
    }
    if (!form.company.trim()) e.company = "Company name is required.";
    if (!form.reason) e.reason = "Please select a service area.";
    if (!form.message.trim()) e.message = "Please describe your situation.";

    if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && !recaptchaRef.current?.getValue()) {
      e.recaptcha = "Please complete the reCAPTCHA verification.";
    }

    return e;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setStatus("submitting");

    try {
      const body = new URLSearchParams({
        "form-name": "contact",
        "g-recaptcha-response": recaptchaRef.current?.getValue() ?? "",
        ...form,
      }).toString();

      const res = await fetch("/netlify-forms.html", {
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
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
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
            <path
              d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
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
          className="px-6 py-2.5 rounded-xl bg-navy-900 text-white text-sm font-medium hover:bg-navy-700 transition-colors cursor-pointer"
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
            aria-describedby={errors.name ? "name-error" : undefined}
            aria-invalid={!!errors.name}
            className={`${inputClass} ${errors.name ? "border-red-400" : "border-slate-200"}`}
          />
          {errors.name && (
            <p id="name-error" className="mt-1.5 text-xs text-red-500">{errors.name}</p>
          )}
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
            aria-describedby={errors.email ? "email-error" : undefined}
            aria-invalid={!!errors.email}
            className={`${inputClass} ${errors.email ? "border-red-400" : "border-slate-200"}`}
          />
          {errors.email && (
            <p id="email-error" className="mt-1.5 text-xs text-red-500">{errors.email}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="company" className="block text-sm font-medium text-navy-700 mb-1.5">
          Company Name <span className="text-red-500" aria-hidden>*</span>
        </label>
        <input
          id="company"
          name="company"
          type="text"
          required
          autoComplete="organization"
          value={form.company}
          onChange={handleChange}
          placeholder="Acme Inc."
          aria-describedby={errors.company ? "company-error" : undefined}
          aria-invalid={!!errors.company}
          className={`${inputClass} ${errors.company ? "border-red-400" : "border-slate-200"}`}
        />
        {errors.company && (
          <p id="company-error" className="mt-1.5 text-xs text-red-500">{errors.company}</p>
        )}
      </div>

      <div>
        <label htmlFor="reason" className="block text-sm font-medium text-navy-700 mb-1.5">
          How Can I Help? <span className="text-red-500" aria-hidden>*</span>
        </label>
        <select
          id="reason"
          name="reason"
          required
          value={form.reason}
          onChange={handleChange}
          aria-describedby={errors.reason ? "reason-error" : undefined}
          aria-invalid={!!errors.reason}
          className={`${inputClass} ${errors.reason ? "border-red-400" : "border-slate-200"}`}
        >
          <option value="">Select a service area...</option>
          {contactReasons.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        {errors.reason && (
          <p id="reason-error" className="mt-1.5 text-xs text-red-500">{errors.reason}</p>
        )}
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
          aria-describedby={errors.message ? "message-error" : undefined}
          aria-invalid={!!errors.message}
          className={`${inputClass} ${errors.message ? "border-red-400" : "border-slate-200"} resize-y min-h-[120px]`}
        />
        {errors.message && (
          <p id="message-error" className="mt-1.5 text-xs text-red-500">{errors.message}</p>
        )}
      </div>

      {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
        <div>
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            onChange={() => {
              if (errors.recaptcha) setErrors((prev) => ({ ...prev, recaptcha: undefined }));
            }}
          />
          {errors.recaptcha && (
            <p className="mt-1.5 text-xs text-red-500">{errors.recaptcha}</p>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full sm:w-auto px-8 py-3 rounded-xl bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 active:bg-blue-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 shadow-sm"
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
