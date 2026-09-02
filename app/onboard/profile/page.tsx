'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import ProfileEditor, { formatAddress, type Profile } from '../ProfileEditor'

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch('/api/onboard/me')
        const data = await res.json()
        if (!res.ok) {
          if (!cancelled) setError(data.error ?? 'Failed to load your profile.')
          return
        }
        if (!cancelled) setProfile(data.profile)
      } catch {
        if (!cancelled) setError('Failed to load your profile.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  if (loading) {
    return (
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-sm">
          Loading your profile…
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="w-full max-w-2xl">
        <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-red-600 text-sm">
          {error || 'Something went wrong.'}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl space-y-4">
      <Link href="/onboard/home" className="text-sm text-blue-600 hover:text-blue-700">
        ← Back to home
      </Link>

      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h1 className="text-xl font-bold text-navy-900">Your information</h1>
            <p className="text-slate-400 text-sm mt-0.5">You can update these details anytime.</p>
          </div>
          {!editing && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              Edit
            </button>
          )}
        </div>

        {editing ? (
          <ProfileEditor
            profile={profile}
            onCancel={() => setEditing(false)}
            onSaved={(next) => {
              setProfile(next)
              setEditing(false)
            }}
          />
        ) : (
          <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
            <div>
              <dt className="text-slate-400 text-xs font-medium">Name</dt>
              <dd className="text-navy-800 mt-0.5">{profile.first_name} {profile.last_name}</dd>
            </div>
            <div>
              <dt className="text-slate-400 text-xs font-medium">Company</dt>
              <dd className="text-navy-800 mt-0.5">{profile.company_name || '—'}</dd>
            </div>
            <div>
              <dt className="text-slate-400 text-xs font-medium">Email</dt>
              <dd className="text-navy-800 mt-0.5">{profile.email}</dd>
            </div>
            <div>
              <dt className="text-slate-400 text-xs font-medium">Phone</dt>
              <dd className="text-navy-800 mt-0.5">{profile.phone || '—'}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-slate-400 text-xs font-medium">Address</dt>
              <dd className="text-navy-800 mt-0.5 whitespace-pre-line">{formatAddress(profile)}</dd>
            </div>
          </dl>
        )}
      </section>
    </div>
  )
}
