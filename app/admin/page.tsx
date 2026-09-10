'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import BrandLogo from '@/components/layout/BrandLogo'
import { formatAnswerValue } from '@/lib/onboard-emails'

// ── Types ──────────────────────────────────────────────────────

interface InviteToken {
  id: number
  code: string
  client_name: string
  client_email: string
  created_at: string
  used: boolean
  email_sent_at: string | null
  email_status: string
  initiated_at: string | null
  revoked_at: string | null
  revoked: boolean
  clients: { id: string; first_name: string; last_name: string; completed: boolean } | null
}

interface ClientRow {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  company_name: string | null
  address: string | null
  address2: string | null
  city: string | null
  state: string | null
  zip: string | null
  country: string | null
  completed: boolean
  created_at: string
  invite_token_id: number
  invite_tokens: { id: number; code: string; created_at: string; client_name: string } | null
  answers: { question_id: number }[]
}

interface AnswerRow {
  answer_value: unknown
  questions: {
    id: number
    label: string
    answer_type: string
    display_order: number
    categories: {
      id: number
      name: string
      display_order: number
      parts: {
        id: number
        name: string
        display_order: number
      }
    }
  } | null
}

interface BudgetItem {
  id: number
  expense: string
  cost: number | null
  purpose: string
  action: string
  billing_frequency: string
  billing_date: string
  notes: string
  display_order: number
}

interface TeamMemberRow {
  id: number
  team: string
  department: string
  role: string
  resource: string
  hours_per_week: number | null
  responsibilities: string
  software_used: string
  reports_to: string
  display_order: number
  team_skill_ratings?: { skill_id: string; proficiency: number; interest: number }[]
}

interface OrgChartMeta {
  id: number
  file_name: string
  mime_type: string
  created_at: string
}

// ── Helpers ────────────────────────────────────────────────────

const EMAIL_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  not_sent:        { label: 'Not sent',  color: 'bg-slate-100 text-slate-500' },
  queued:          { label: 'Queued',    color: 'bg-slate-100 text-slate-600' },
  sent:            { label: 'Sent',      color: 'bg-blue-50 text-blue-600' },
  delivered:       { label: 'Delivered', color: 'bg-blue-100 text-blue-700' },
  delivery_delayed:{ label: 'Delayed',   color: 'bg-amber-100 text-amber-600' },
  opened:          { label: 'Opened',    color: 'bg-emerald-100 text-emerald-700' },
  clicked:         { label: 'Clicked',   color: 'bg-green-100 text-green-700' },
  bounced:         { label: 'Bounced',   color: 'bg-red-100 text-red-600' },
  complained:      { label: 'Spam',      color: 'bg-red-100 text-red-600' },
  failed:          { label: 'Failed',    color: 'bg-red-100 text-red-600' },
}

function EmailStatusBadge({ status }: { status: string }) {
  const cfg = EMAIL_STATUS_LABELS[status] ?? { label: status, color: 'bg-slate-100 text-slate-400' }
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}>
      {cfg.label}
    </span>
  )
}

// ── Login screen ──────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Invalid password.'); return }
      onLogin()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Same top nav as the dashboard */}
      <header className="bg-navy-900 h-16 px-6 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 cursor-pointer" aria-label="Techon Partners – Home">
          <BrandLogo onDark />
        </Link>
        <span className="text-slate-400 text-sm">/ Admin Portal</span>
      </header>

      {/* Centered login card */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Card header strip */}
            <div className="bg-navy-900 px-8 py-6">
              <h1 className="text-white font-semibold text-lg">Welcome back</h1>
              <p className="text-slate-400 text-sm mt-0.5">Sign in to the admin portal</p>
            </div>

            <div className="px-8 py-7">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-navy-800 mb-1.5">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-navy-900 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {error && (
                  <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg text-sm transition-colors"
                >
                  {loading ? 'Signing in…' : 'Sign In'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Invite panel ───────────────────────────────────────────────

function InvitePanel({ onInviteSent }: { onInviteSent: () => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [result, setResult] = useState<{ code: string; link: string; emailWarning?: string } | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState<'code' | 'link' | null>(null)

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setResult(null)
    setLoading(true)
    try {
      const res = await fetch('/api/admin/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientName: name, clientEmail: email }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Failed to send invite.'); return }
      setResult({ code: data.code, link: data.link, emailWarning: data.emailWarning })
      onInviteSent()
    } finally {
      setLoading(false)
    }
  }

  function copy(text: string, type: 'code' | 'link') {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h2 className="font-semibold text-navy-900 mb-1">Send Invitation</h2>
      <p className="text-sm text-slate-500 mb-5">Generate a unique code and send it to the client via email.</p>

      <form onSubmit={handleSend} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Client Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder="Jane Smith"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-navy-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Client Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="jane@company.com"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-navy-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          {loading ? 'Sending…' : 'Send Invite'}
        </button>
      </form>

      {result && (
        <div className="mt-5 p-4 bg-green-50 border border-green-200 rounded-lg space-y-3">
          {result.emailWarning
            ? <p className="text-sm font-semibold text-amber-700">Invite created — but email failed to send. Share the code manually.</p>
            : <p className="text-sm font-semibold text-green-800">Invite sent successfully!</p>
          }
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 w-12 shrink-0">Code:</span>
              <code className="flex-1 font-mono text-sm font-bold tracking-widest text-navy-900 bg-white border border-slate-200 rounded px-2 py-1">
                {result.code}
              </code>
              <button onClick={() => copy(result.code, 'code')} className="text-xs text-blue-600 hover:underline shrink-0">
                {copied === 'code' ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 w-12 shrink-0">Link:</span>
              <span className="flex-1 text-xs text-slate-600 truncate">{result.link}</span>
              <button onClick={() => copy(result.link, 'link')} className="text-xs text-blue-600 hover:underline shrink-0">
                {copied === 'link' ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Revoke confirm modal ────────────────────────────────────────

function RevokeModal({
  token,
  onConfirm,
  onCancel,
  loading,
}: {
  token: InviteToken
  onConfirm: () => void
  onCancel: () => void
  loading: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm p-6">
        <h3 className="font-semibold text-navy-900 text-base mb-1">Revoke invitation?</h3>
        <p className="text-sm text-slate-500 mb-1">
          This will revoke the invite for <span className="font-medium text-navy-800">{token.client_name}</span>.
        </p>
        <p className="text-xs text-slate-400 mb-6">
          The code <code className="font-mono font-semibold text-navy-700 bg-slate-100 px-1.5 py-0.5 rounded">{token.code}</code> will be marked as revoked and can no longer be used.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            {loading ? 'Revoking…' : 'Revoke'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Invitations tab ────────────────────────────────────────────

function InvitationsTable({ refreshKey }: { refreshKey: number }) {
  const [tokens, setTokens] = useState<InviteToken[]>([])
  const [loading, setLoading] = useState(true)
  const [revoking, setRevoking] = useState(false)
  const [confirmToken, setConfirmToken] = useState<InviteToken | null>(null)
  const [revokeError, setRevokeError] = useState<string | null>(null)
  const [hideRevoked, setHideRevoked] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/invites')
    const data = await res.json()
    setTokens(data.tokens ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load, refreshKey])

  async function handleRevoke() {
    if (!confirmToken) return
    setRevoking(true)
    setRevokeError(null)
    try {
      const res = await fetch(`/api/admin/invites/${confirmToken.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) {
        setRevokeError(data.error ?? 'Failed to revoke invitation.')
        setConfirmToken(null)
      } else {
        const revokedAt = new Date().toISOString()
        setTokens(prev => prev.map(t => t.id === confirmToken.id ? { ...t, revoked: true, revoked_at: revokedAt } : t))
        setConfirmToken(null)
      }
    } finally {
      setRevoking(false)
    }
  }

  function tokenStatus(token: InviteToken) {
    if (token.revoked) {
      return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600">Revoked</span>
    }
    if (token.clients?.completed) {
      return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Completed</span>
    }
    if (token.used && token.clients) {
      return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">Registered</span>
    }
    if (token.initiated_at) {
      return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">In Progress</span>
    }
    return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500">Pending</span>
  }

  const canRevoke = (token: InviteToken) => !token.revoked && !token.initiated_at && !token.used

  const visible = hideRevoked ? tokens.filter(t => !t.revoked) : tokens
  const revokedCount = tokens.filter(t => t.revoked).length

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-navy-900">Invitations</h2>
            <p className="text-xs text-slate-400 mt-0.5">All sent invites including pending and unused codes</p>
          </div>
          <div className="flex items-center gap-4">
            {revokedCount > 0 && (
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hideRevoked}
                  onChange={e => setHideRevoked(e.target.checked)}
                  className="w-3.5 h-3.5 accent-slate-500 cursor-pointer"
                />
                <span className="text-xs text-slate-500">
                  Hide revoked{hideRevoked ? ` (${revokedCount})` : ''}
                </span>
              </label>
            )}
            <span className="text-xs text-slate-400">{visible.length} invite{visible.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {revokeError && (
          <div className="mx-6 mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-center justify-between">
            <span>{revokeError}</span>
            <button onClick={() => setRevokeError(null)} className="text-red-400 hover:text-red-600 ml-4 text-lg font-light leading-none">✕</button>
          </div>
        )}

        {loading && <div className="px-6 py-10 text-center text-slate-400 text-sm">Loading…</div>}

        {!loading && tokens.length === 0 && (
          <div className="px-6 py-10 text-center text-slate-400 text-sm">No invitations sent yet.</div>
        )}

        {!loading && tokens.length > 0 && visible.length === 0 && (
          <div className="px-6 py-10 text-center text-slate-400 text-sm">No active invitations. <button onClick={() => setHideRevoked(false)} className="text-blue-500 hover:underline">Show revoked</button></div>
        )}

        {!loading && visible.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Recipient</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Code</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Sent</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Initiated</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody>
                {visible.map(token => (
                  <tr
                    key={token.id}
                    className={`border-b border-slate-100 last:border-0 transition-colors ${token.revoked ? 'bg-slate-50/60 opacity-60' : 'hover:bg-slate-50'}`}
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-navy-900">{token.client_name}</p>
                      <p className="text-xs text-slate-400">{token.client_email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <code className="font-mono text-xs font-semibold tracking-widest text-navy-800 bg-slate-100 px-2 py-1 rounded">
                        {token.code}
                      </code>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs">
                      {token.email_sent_at ? (
                        <>
                          <span>{new Date(token.email_sent_at).toLocaleDateString()}</span>
                          <span className="block text-slate-300">
                            {new Date(token.email_sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <EmailStatusBadge status={token.email_status} />
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs">
                      {token.initiated_at ? (
                        <>
                          <span>{new Date(token.initiated_at).toLocaleDateString()}</span>
                          <span className="block text-slate-300">
                            {new Date(token.initiated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {tokenStatus(token)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {canRevoke(token) && (
                        <button
                          onClick={() => setConfirmToken(token)}
                          className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 text-xs font-medium rounded-lg transition-colors"
                        >
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {confirmToken && (
        <RevokeModal
          token={confirmToken}
          onConfirm={handleRevoke}
          onCancel={() => setConfirmToken(null)}
          loading={revoking}
        />
      )}
    </>
  )
}

// ── Answer detail drawer ───────────────────────────────────────

const ACTION_COLORS: Record<string, string> = {
  'Keep It':   'bg-green-100 text-green-700',
  'Review It': 'bg-amber-100 text-amber-700',
  'Trash It':  'bg-red-100 text-red-600',
}

function UncompleteModal({
  client,
  onConfirm,
  onCancel,
  loading,
}: {
  client: ClientRow
  onConfirm: () => void
  onCancel: () => void
  loading: boolean
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm p-6">
        <h3 className="font-semibold text-navy-900 text-base mb-1">Reopen this questionnaire?</h3>
        <p className="text-sm text-slate-500 mb-1">
          <span className="font-medium text-navy-800">{client.first_name} {client.last_name}</span> will be able to edit and submit again.
        </p>
        <p className="text-xs text-slate-400 mb-6">
          Existing answers stay saved.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-navy-900 hover:bg-navy-800 disabled:opacity-50 text-white text-sm font-semibold rounded-lg"
          >
            {loading ? 'Reopening…' : 'Reopen'}
          </button>
        </div>
      </div>
    </div>
  )
}

function AnswerDrawer({
  client,
  onClose,
  onRequestUncomplete,
}: {
  client: ClientRow
  onClose: () => void
  onRequestUncomplete: () => void
}) {
  const [answers, setAnswers] = useState<AnswerRow[]>([])
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMemberRow[]>([])
  const [orgChart, setOrgChart] = useState<OrgChartMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [drawerTab, setDrawerTab] = useState<'questionnaire' | 'budget' | 'team'>('questionnaire')

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/admin/submissions/${client.id}`)
      const data = await res.json()
      setAnswers(data.answers ?? [])
      setBudgetItems(data.budgetItems ?? [])
      setTeamMembers(data.teamMembers ?? [])
      setOrgChart(data.orgChart ?? null)
      setLoading(false)
    }
    load()
  }, [client.id])

  type CatType = NonNullable<NonNullable<AnswerRow['questions']>['categories']>
  const grouped = answers.reduce<Record<string, { cat: CatType; answers: AnswerRow[] }>>((acc, a) => {
    if (!a.questions) return acc
    const catId = a.questions.categories.id
    if (!acc[catId]) acc[catId] = { cat: a.questions.categories, answers: [] }
    acc[catId].answers.push(a)
    return acc
  }, {})

  const sortedGroups = Object.values(grouped).sort((a, b) => a.cat.display_order - b.cat.display_order)

  const budgetTotal = budgetItems.reduce((s, item) => s + (item.cost ?? 0), 0)

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-full max-w-2xl bg-white shadow-2xl overflow-y-auto flex flex-col">
        {/* Drawer header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white z-10">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-navy-900">{client.first_name} {client.last_name}</h2>
              {client.completed ? (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Completed</span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">In Progress</span>
              )}
            </div>
            <p className="text-xs text-slate-500">{client.email}{client.phone ? ` · ${client.phone}` : ''}</p>
            {client.company_name && <p className="text-xs text-slate-500">{client.company_name}</p>}
            {(client.address || client.city) && (
              <p className="text-xs text-slate-400">
                {[client.address, client.address2, client.city, client.state, client.zip, client.country]
                  .filter(Boolean).join(', ')}
              </p>
            )}
            {client.completed && (
              <button
                onClick={onRequestUncomplete}
                className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 text-xs font-medium transition-colors"
              >
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                Reopen questionnaire
              </button>
            )}
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl font-light ml-4 shrink-0">✕</button>
        </div>

        {/* Drawer tabs */}
        <div className="flex gap-1 px-6 pt-4 pb-0 border-b border-slate-100">
          {([
            { id: 'questionnaire', label: 'Questionnaire' },
            { id: 'budget', label: `Budget Audit${budgetItems.length > 0 ? ` (${budgetItems.length})` : ''}` },
            { id: 'team', label: `Team${teamMembers.length > 0 ? ` (${teamMembers.length})` : ''}` },
          ] as { id: 'questionnaire' | 'budget' | 'team'; label: string }[]).map(t => (
            <button
              key={t.id}
              onClick={() => setDrawerTab(t.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
                drawerTab === t.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Questionnaire tab */}
        {drawerTab === 'questionnaire' && (
          <div className="p-6 space-y-8 flex-1">
            {loading && <p className="text-slate-400 text-sm">Loading answers…</p>}
            {!loading && sortedGroups.length === 0 && (
              <p className="text-slate-400 text-sm">No answers submitted yet.</p>
            )}
            {sortedGroups.map(({ cat, answers: catAnswers }) => (
              <div key={cat.id}>
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-0.5">{cat.parts?.name ?? ''}</p>
                <h3 className="font-semibold text-navy-900 mb-4">{cat.name}</h3>
                <div className="space-y-4">
                  {catAnswers
                    .sort((a, b) => (a.questions?.display_order ?? 0) - (b.questions?.display_order ?? 0))
                    .map((a, i) => (
                      <div key={i} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                        <p className="text-xs text-slate-500 mb-1">{a.questions?.label}</p>
                        <p className="text-sm text-navy-800 whitespace-pre-wrap">{formatAnswerValue(a.answer_value)}</p>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Team tab */}
        {drawerTab === 'team' && (
          <div className="p-6 flex-1 space-y-6">
            {loading && <p className="text-slate-400 text-sm">Loading team…</p>}
            {!loading && (
              <>
                <div className="bg-slate-50 rounded-xl border border-slate-200 px-4 py-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Org chart</p>
                  {orgChart ? (
                    <a
                      href={`/api/admin/submissions/${client.id}/org-chart`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {orgChart.file_name}
                    </a>
                  ) : (
                    <p className="text-sm text-slate-400">No org chart uploaded.</p>
                  )}
                </div>

                {teamMembers.length === 0 ? (
                  <p className="text-slate-400 text-sm">No team members submitted yet.</p>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-sm min-w-[640px]">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50">
                          <th className="text-left px-3 py-2.5 text-xs font-semibold text-slate-500 uppercase">Resource</th>
                          <th className="text-left px-3 py-2.5 text-xs font-semibold text-slate-500 uppercase">Role</th>
                          <th className="text-left px-3 py-2.5 text-xs font-semibold text-slate-500 uppercase">Team</th>
                          <th className="text-left px-3 py-2.5 text-xs font-semibold text-slate-500 uppercase">Hrs</th>
                          <th className="text-left px-3 py-2.5 text-xs font-semibold text-slate-500 uppercase">Reports to</th>
                          <th className="text-left px-3 py-2.5 text-xs font-semibold text-slate-500 uppercase">Skills rated</th>
                        </tr>
                      </thead>
                      <tbody>
                        {teamMembers.map(m => (
                          <tr key={m.id} className="border-b border-slate-100 last:border-0">
                            <td className="px-3 py-3">
                              <p className="font-medium text-navy-900">{m.resource || '—'}</p>
                              {m.software_used && <p className="text-xs text-slate-400 mt-0.5">{m.software_used}</p>}
                            </td>
                            <td className="px-3 py-3 text-navy-800">{m.role || '—'}</td>
                            <td className="px-3 py-3 text-slate-500 text-xs">{[m.team, m.department].filter(Boolean).join(' · ') || '—'}</td>
                            <td className="px-3 py-3 text-navy-800 tabular-nums">{m.hours_per_week ?? '—'}</td>
                            <td className="px-3 py-3 text-slate-500 text-xs">{m.reports_to || '—'}</td>
                            <td className="px-3 py-3 text-slate-500 text-xs">
                              {(m.team_skill_ratings ?? []).filter(r => r.proficiency > 0 || r.interest > 0).length}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Budget Audit tab */}
        {drawerTab === 'budget' && (
          <div className="p-6 flex-1">
            {loading && <p className="text-slate-400 text-sm">Loading budget audit…</p>}
            {!loading && budgetItems.length === 0 && (
              <p className="text-slate-400 text-sm">No budget audit items submitted yet.</p>
            )}
            {!loading && budgetItems.length > 0 && (
              <div className="space-y-4">
                {/* Summary */}
                <div className="flex items-center justify-between bg-slate-50 rounded-xl border border-slate-200 px-4 py-3">
                  <span className="text-sm font-medium text-slate-500">{budgetItems.length} items</span>
                  <span className="text-sm font-bold text-navy-900">
                    Total: ${budgetTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Items */}
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-sm min-w-[560px]">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50">
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Expense</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Cost</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Action</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Frequency</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {budgetItems.map(item => (
                        <tr key={item.id} className="border-b border-slate-100 last:border-0">
                          <td className="px-4 py-3">
                            <p className="font-medium text-navy-900">{item.expense || '—'}</p>
                            {item.purpose && <p className="text-xs text-slate-400 mt-0.5">{item.purpose}</p>}
                          </td>
                          <td className="px-4 py-3 text-navy-800 font-medium">
                            {item.cost != null
                              ? `$${item.cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                              : '—'}
                          </td>
                          <td className="px-4 py-3">
                            {item.action ? (
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ACTION_COLORS[item.action] ?? 'bg-slate-100 text-slate-500'}`}>
                                {item.action}
                              </span>
                            ) : '—'}
                          </td>
                          <td className="px-4 py-3 text-slate-500 text-xs">
                            {[item.billing_frequency, item.billing_date?.replaceAll(',', ' · ')].filter(Boolean).join(' · ') || '—'}
                          </td>
                          <td className="px-4 py-3 text-slate-400 text-xs">{item.notes || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Submissions tab ────────────────────────────────────────────

function SubmissionsTable({ refreshKey }: { refreshKey: number }) {
  const [clients, setClients] = useState<ClientRow[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<ClientRow | null>(null)
  const [confirmClient, setConfirmClient] = useState<ClientRow | null>(null)
  const [uncompleting, setUncompleting] = useState(false)
  const [uncompleteError, setUncompleteError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/submissions')
    const data = await res.json()
    setClients(data.clients ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load, refreshKey])

  async function handleUncomplete() {
    if (!confirmClient) return
    setUncompleting(true)
    setUncompleteError(null)
    try {
      const res = await fetch(`/api/admin/submissions/${confirmClient.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: false }),
      })
      const data = await res.json()
      if (!res.ok) {
        setUncompleteError(data.error ?? 'Failed to update questionnaire status.')
        setConfirmClient(null)
        return
      }
      setClients(prev => prev.map(c => c.id === confirmClient.id ? { ...c, completed: false } : c))
      setSelected(prev => prev?.id === confirmClient.id ? { ...prev, completed: false } : prev)
      setConfirmClient(null)
    } finally {
      setUncompleting(false)
    }
  }

  function statusBadge(client: ClientRow) {
    if (client.completed) {
      return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Completed</span>
    }
    if ((client.answers?.length ?? 0) > 0) {
      return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">In Progress</span>
    }
    return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">Registered</span>
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-navy-900">Client Submissions</h2>
            <p className="text-xs text-slate-400 mt-0.5">Registered clients and their questionnaire progress</p>
          </div>
          <span className="text-xs text-slate-400">{clients.length} client{clients.length !== 1 ? 's' : ''}</span>
        </div>

        {uncompleteError && (
          <div className="mx-6 mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-center justify-between">
            <span>{uncompleteError}</span>
            <button onClick={() => setUncompleteError(null)} className="text-red-400 hover:text-red-600 ml-4 text-lg font-light leading-none">✕</button>
          </div>
        )}

        {loading && <div className="px-6 py-10 text-center text-slate-400 text-sm">Loading…</div>}

        {!loading && clients.length === 0 && (
          <div className="px-6 py-10 text-center text-slate-400 text-sm">No clients have registered yet.</div>
        )}

        {!loading && clients.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Client</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Company</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Invite Code</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Registered</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody>
                {clients.map(client => (
                  <tr key={client.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-navy-900">{client.first_name} {client.last_name}</p>
                      <p className="text-xs text-slate-400">{client.email}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{client.company_name ?? '—'}</td>
                    <td className="px-6 py-4">
                      <code className="font-mono text-xs font-semibold tracking-widest text-navy-800 bg-slate-100 px-2 py-1 rounded">
                        {client.invite_tokens?.code ?? '—'}
                      </code>
                    </td>
                    <td className="px-6 py-4">{statusBadge(client)}</td>
                    <td className="px-6 py-4 text-slate-400 text-xs">
                      {new Date(client.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {client.completed && (
                          <button
                            onClick={() => setConfirmClient(client)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 text-xs font-medium transition-colors"
                          >
                            Reopen
                          </button>
                        )}
                        <button
                          onClick={() => setSelected(client)}
                          className="inline-flex items-center px-2.5 py-1.5 rounded-md bg-slate-900 text-white hover:bg-slate-800 text-xs font-medium transition-colors"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <AnswerDrawer
          client={selected}
          onClose={() => setSelected(null)}
          onRequestUncomplete={() => setConfirmClient(selected)}
        />
      )}

      {confirmClient && (
        <UncompleteModal
          client={confirmClient}
          onConfirm={handleUncomplete}
          onCancel={() => setConfirmClient(null)}
          loading={uncompleting}
        />
      )}
    </>
  )
}

// ── Main dashboard ─────────────────────────────────────────────

type Tab = 'invitations' | 'submissions'

function Dashboard() {
  const [tab, setTab] = useState<Tab>('invitations')
  const [refreshKey, setRefreshKey] = useState(0)

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    window.location.reload()
  }

  function bump() { setRefreshKey(k => k + 1) }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Top nav */}
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

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <InvitePanel onInviteSent={bump} />

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 w-fit">
          {([
            { id: 'invitations', label: 'Invitations' },
            { id: 'submissions', label: 'Submissions' },
          ] as { id: Tab; label: string }[]).map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === t.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'invitations' && <InvitationsTable refreshKey={refreshKey} />}
        {tab === 'submissions' && <SubmissionsTable refreshKey={refreshKey} />}
      </div>
    </div>
  )
}

// ── Root export ────────────────────────────────────────────────

export default function AdminPage() {
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

  return <Dashboard />
}
