'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/onboard/home', label: 'Home' },
  { href: '/onboard/questionnaire', label: 'Questionnaire' },
  { href: '/onboard/budget-audit', label: 'Budget Audit' },
  { href: '/onboard/team', label: 'Team' },
]

export default function OnboardNav() {
  const pathname = usePathname()

  // Hide nav on login / invite / password pages
  const showNav = NAV_ITEMS.some(item => pathname.startsWith(item.href)) || pathname.startsWith('/onboard/profile')
  if (!showNav) return null

  return (
    <nav className="flex items-center gap-1">
      {NAV_ITEMS.map(item => {
        const active = item.href === '/onboard/home'
          ? pathname === '/onboard/home'
          : pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch={false}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              active
                ? 'bg-white/15 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/10'
            }`}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
