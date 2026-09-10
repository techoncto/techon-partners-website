import type { Metadata } from 'next'
import Script from 'next/script'
import OnboardShell from './OnboardShell'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Client Onboarding | Techon Partners',
  robots: { index: false, follow: false },
}

export default function OnboardLayout({ children }: { children: React.ReactNode }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  return (
    <>
      {apiKey && (
        <Script
          id="google-maps"
          src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly&loading=async`}
          strategy="beforeInteractive"
        />
      )}
      <OnboardShell>{children}</OnboardShell>
    </>
  )
}
