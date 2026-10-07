'use client'

import { createContext, useContext, useEffect, useMemo, useState, type MouseEvent, type ReactNode } from 'react'
import Link from 'next/link'

const tabs = [
  { id: 'invitations', label: 'Invitations', href: '/admin' },
  { id: 'submissions', label: 'Submissions', href: '/admin?tab=submissions' },
  { id: 'questionnaire', label: 'Questionnaire', href: '/admin/questionnaire' },
] as const

export type AdminTab = (typeof tabs)[number]['id']

const UnsavedChangesContext = createContext<{
  dirty: boolean
  setDirty: (dirty: boolean) => void
} | null>(null)

export function UnsavedChangesProvider({ children }: { children: ReactNode }) {
  const [dirty, setDirty] = useState(false)
  const value = useMemo(() => ({ dirty, setDirty }), [dirty])
  return <UnsavedChangesContext.Provider value={value}>{children}</UnsavedChangesContext.Provider>
}

export function useSetUnsavedChanges(dirty: boolean) {
  const setDirty = useContext(UnsavedChangesContext)?.setDirty
  useEffect(() => {
    setDirty?.(dirty)
  }, [setDirty, dirty])
}

export function AdminTabs({ active }: { active: AdminTab }) {
  const unsaved = useContext(UnsavedChangesContext)

  function onTabClick(event: MouseEvent<HTMLAnchorElement>, tab: (typeof tabs)[number]) {
    if (tab.id === active) {
      event.preventDefault()
      return
    }
    if (unsaved?.dirty && !window.confirm('You have unsaved questionnaire changes. Leave without saving?')) {
      event.preventDefault()
    }
  }

  return (
    <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 w-fit">
      {tabs.map(tab => (
        <Link
          key={tab.id}
          href={tab.href}
          onClick={event => onTabClick(event, tab)}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
            active === tab.id
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  )
}
