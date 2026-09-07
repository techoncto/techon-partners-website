'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import OnboardNav from './OnboardNav'
import ProfileDrawer from './ProfileDrawer'
import type { Profile } from './ProfileEditor'

const AUTH_PATHS = ['/onboard/home', '/onboard/questionnaire', '/onboard/budget-audit', '/onboard/team', '/onboard/profile']

export default function OnboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const isForm = pathname.startsWith('/onboard/questionnaire')
  const showSidebar = AUTH_PATHS.some(path => pathname.startsWith(path))
  const [profileOpen, setProfileOpen] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    if (pathname.startsWith('/onboard/profile')) {
      setProfileOpen(true)
      router.replace('/onboard/home')
    }
  }, [pathname, router])

  useEffect(() => {
    if (!showSidebar) return
    let cancelled = false
    fetch('/api/onboard/me', { credentials: 'include' })
      .then(async res => {
        if (res.status === 401) {
          window.location.href = '/onboard/login'
          return
        }
        const data = await res.json()
        if (!cancelled && data.profile) setProfile(data.profile)
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [showSidebar, pathname])

  async function handleLogout() {
    await fetch('/api/onboard/logout', { method: 'POST' })
    window.location.href = '/onboard/login'
  }

  return (
    <div className={`bg-slate-50 flex flex-col ${isForm ? 'h-dvh overflow-hidden' : 'min-h-dvh'}`}>
      <header className="bg-navy-900 h-16 px-6 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-white font-semibold text-lg tracking-tight hover:text-slate-300 transition-colors cursor-pointer">Techon Partners</Link>
          {showSidebar ? (
            <Link href="/onboard/home" className="text-slate-400 text-sm hover:text-slate-200 transition-colors cursor-pointer">
              / Client Onboarding
            </Link>
          ) : (
            <span className="text-slate-400 text-sm">/ Client Onboarding</span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <OnboardNav />
          {showSidebar && (
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm text-slate-500 hover:text-white transition-colors cursor-pointer"
            >
              Log out
            </button>
          )}
        </div>
      </header>

      <div className="relative flex flex-1 min-h-0">
        {showSidebar && (
          <aside className="w-56 shrink-0 bg-slate-100 flex flex-col px-3 py-5 z-[1]">
            <p className="px-2 mb-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Account
            </p>
            <button
              type="button"
              onClick={() => setProfileOpen(true)}
              className={`text-left rounded-xl px-3 py-3.5 transition-colors ${
                profileOpen ? 'bg-white shadow-sm' : 'hover:bg-white/70'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="w-9 h-9 rounded-lg bg-navy-800 text-white text-xs font-semibold flex items-center justify-center shrink-0">
                  {profile
                    ? `${profile.first_name[0] ?? ''}${profile.last_name[0] ?? ''}`.toUpperCase()
                    : '—'}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-navy-800 truncate">
                    {profile ? `${profile.first_name} ${profile.last_name}` : 'Profile'}
                  </span>
                  {profile?.company_name && (
                    <span className="block text-xs text-slate-500 mt-0.5 truncate">{profile.company_name}</span>
                  )}
                  <span className="block text-xs text-blue-600 font-medium mt-2">
                    {profileOpen ? 'Open' : 'View / edit'}
                  </span>
                </span>
              </div>
            </button>
          </aside>
        )}

        <div className="flex-1 min-w-0 flex flex-col">
          <main
            className={
              isForm
                ? 'flex-1 min-h-0 overflow-hidden flex flex-col items-center px-4 sm:px-6 py-4'
                : 'flex-1 w-full flex flex-col items-center justify-start py-12 px-6 sm:px-10'
            }
          >
            {children}
          </main>
          {!isForm && (
            <footer className="py-3 text-center text-slate-400 text-xs shrink-0">
              © {new Date().getFullYear()} Techon Partners. All rights reserved.
            </footer>
          )}
        </div>

        <ProfileDrawer
          open={profileOpen}
          onClose={() => setProfileOpen(false)}
          onSaved={setProfile}
        />
      </div>
    </div>
  )
}
