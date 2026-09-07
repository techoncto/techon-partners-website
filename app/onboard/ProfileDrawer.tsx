'use client'

import { useEffect, useState } from 'react'
import ProfileEditor, { formatAddress, type Profile } from './ProfileEditor'
import { redirectToOnboardLogin } from './redirectToLogin'

export default function ProfileDrawer({
  open,
  onClose,
  onSaved,
}: {
  open: boolean
  onClose: () => void
  onSaved?: (profile: Profile) => void
}) {
  const [rendered, setRendered] = useState(false)
  const [visible, setVisible] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    if (open) {
      setRendered(true)
      const id = requestAnimationFrame(() => setVisible(true))
      return () => cancelAnimationFrame(id)
    }
    setVisible(false)
    const t = setTimeout(() => {
      setRendered(false)
      setEditing(false)
    }, 300)
    return () => clearTimeout(t)
  }, [open])

  useEffect(() => {
    if (!open) return
    let cancelled = false
    setLoading(true)
    setError('')
    fetch('/api/onboard/me', { credentials: 'include' })
      .then(async res => {
        if (res.status === 401) {
          await redirectToOnboardLogin()
          return
        }
        const data = await res.json()
        if (!res.ok) throw new Error(data.error ?? 'Failed to load profile.')
        if (!cancelled) setProfile(data.profile)
      })
      .catch(err => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load profile.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!rendered) return null

  return (
    <div className="absolute inset-0 z-10 overflow-hidden">
      <button
        type="button"
        aria-label="Close profile"
        onClick={onClose}
        className={`absolute inset-0 bg-navy-900/30 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
      />
      <aside
        className={`absolute inset-y-0 left-0 w-full max-w-lg bg-white shadow-xl overflow-y-auto transition-transform duration-300 ease-out ${
          visible ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-semibold text-navy-900">Your information</h2>
            <p className="text-slate-400 text-sm">You can update these details anytime.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-navy-800 text-sm font-medium px-2 py-1"
          >
            Close
          </button>
        </div>

        <div className="p-6">
          {loading && (
            <p className="text-slate-400 text-sm">Loading…</p>
          )}
          {error && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>
          )}
          {!loading && !error && profile && (
            editing ? (
              <ProfileEditor
                profile={profile}
                onCancel={() => setEditing(false)}
                onSaved={(next) => {
                  setProfile(next)
                  setEditing(false)
                  onSaved?.(next)
                }}
              />
            ) : (
              <>
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
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="mt-6 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Edit
                </button>
              </>
            )
          )}
        </div>
      </aside>
    </div>
  )
}
