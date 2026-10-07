'use client'

import { Suspense, useEffect, useState, type ReactNode } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { AdminTabs, UnsavedChangesProvider, type AdminTab } from '@/components/admin/AdminTabs'
import { LoginScreen } from '@/components/admin/LoginScreen'

function AdminTabBar() {
  const pathname = usePathname()
  const tabParam = useSearchParams().get('tab')
  const active: AdminTab = pathname.startsWith('/admin/questionnaire')
    ? 'questionnaire'
    : tabParam === 'submissions'
      ? 'submissions'
      : 'invitations'

  return <AdminTabs active={active} />
}

export function AdminShell({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState<boolean | null>(null)

  useEffect(() => {
    fetch('/api/admin/submissions')
      .then(res => setAuthed(res.ok))
      .catch(() => setAuthed(false))
  }, [])

  if (authed === null) {
    return (
      <div className="min-h-screen w-full min-w-0 bg-slate-100">
        <AdminHeader />
        <div className="flex items-center justify-center py-24">
          <div className="text-slate-400 text-sm">Loading…</div>
        </div>
      </div>
    )
  }

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />

  return (
    <UnsavedChangesProvider>
      <div className="min-h-screen w-full min-w-0 bg-slate-100">
        <AdminHeader />
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Suspense fallback={<div className="h-10" />}>
            <AdminTabBar />
          </Suspense>
          {children}
        </div>
      </div>
    </UnsavedChangesProvider>
  )
}
