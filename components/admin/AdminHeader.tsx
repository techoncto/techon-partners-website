'use client'

import Link from 'next/link'
import BrandLogo from '@/components/layout/BrandLogo'

export function AdminHeader() {
  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    window.location.href = '/admin'
  }

  return (
    <header className="bg-navy-900 h-16 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 cursor-pointer" aria-label="Techon Partners – Home">
          <BrandLogo onDark />
        </Link>
        <span className="text-slate-400 text-sm">/ Admin Portal</span>
      </div>
      <button onClick={handleLogout} className="text-sm text-slate-400 hover:text-white transition-colors">
        Log out
      </button>
    </header>
  )
}
