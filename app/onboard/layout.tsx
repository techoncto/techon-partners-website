import type { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Client Onboarding | Techon Partners',
  robots: { index: false, follow: false },
}

export default function OnboardLayout({ children }: { children: React.ReactNode }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {apiKey && (
        <Script
          id="google-maps"
          src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly&loading=async`}
          strategy="beforeInteractive"
        />
      )}
      <header className="bg-navy-900 py-4 px-6 flex items-center gap-3">
        <a href={process.env.NEXT_PUBLIC_SITE_URL} className="text-white font-semibold text-lg tracking-tight hover:text-slate-300 transition-colors">Techon Partners</a>
        <span className="text-slate-400 text-sm">/ Client Onboarding</span>
      </header>
      <main className="flex-1 flex flex-col items-center justify-start py-10 px-4">
        {children}
      </main>
      <footer className="py-4 text-center text-slate-400 text-xs">
        © {new Date().getFullYear()} Techon Partners. All rights reserved.
      </footer>
    </div>
  )
}
