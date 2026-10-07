'use client'

import Link from 'next/link'

const tabs = [
  { id: 'invitations', label: 'Invitations', href: '/admin' },
  { id: 'submissions', label: 'Submissions', href: '/admin?tab=submissions' },
  { id: 'questionnaire', label: 'Questionnaire', href: '/admin/questionnaire' },
] as const

export type AdminTab = (typeof tabs)[number]['id']

export function AdminTabs({ active }: { active: AdminTab }) {
  return (
    <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 w-fit">
      {tabs.map(tab => (
        <Link
          key={tab.id}
          href={tab.href}
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
