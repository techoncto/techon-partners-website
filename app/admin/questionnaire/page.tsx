'use client'

import { useEffect, useState } from 'react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { AdminTabs, UnsavedChangesProvider } from '@/components/admin/AdminTabs'
import { LoginScreen } from '@/components/admin/LoginScreen'
import { QuestionnaireEditor } from './QuestionnaireEditor'

export default function QuestionnaireAdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null)

  useEffect(() => {
    fetch('/api/admin/submissions')
      .then(res => setAuthed(res.ok))
      .catch(() => setAuthed(false))
  }, [])

  if (authed === null) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-slate-400 text-sm">Loading…</div>
      </div>
    )
  }

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />

  return (
    <div className="min-h-screen bg-slate-100">
      <AdminHeader />
      <UnsavedChangesProvider>
        <div className="max-w-6xl mx-auto px-6 pt-8">
          <AdminTabs active="questionnaire" />
        </div>
        <QuestionnaireEditor />
      </UnsavedChangesProvider>
    </div>
  )
}
