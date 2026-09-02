'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { SKILL_CATALOG, coverageLevel } from '@/lib/skill-catalog'

interface RowData {
  id?: number
  _key: string
  team: string
  department: string
  role: string
  resource: string
  hours_per_week: string
  responsibilities: string
  software_used: string
  reports_to: string
}

interface Rating {
  team_member_id: number
  skill_id: string
  proficiency: number
  interest: number
}

interface OrgChartMeta {
  id: number
  file_name: string
  mime_type: string
  created_at: string
}

const inputClass =
  'w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-navy-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white placeholder-slate-300'

function newRow(): RowData {
  return {
    _key: String(Date.now() + Math.random()),
    team: '',
    department: '',
    role: '',
    resource: '',
    hours_per_week: '',
    responsibilities: '',
    software_used: '',
    reports_to: '',
  }
}

function parseItemId(value: unknown): number | undefined {
  const n = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN
  return Number.isInteger(n) && n > 0 ? n : undefined
}

function mapMembers(items: Record<string, unknown>[]): RowData[] {
  return items.map(item => {
    const id = parseItemId(item.id)
    return {
      id,
      _key: id != null ? String(id) : String(Date.now() + Math.random()),
      team: String(item.team ?? ''),
      department: String(item.department ?? ''),
      role: String(item.role ?? ''),
      resource: String(item.resource ?? ''),
      hours_per_week: item.hours_per_week != null ? String(item.hours_per_week) : '',
      responsibilities: String(item.responsibilities ?? ''),
      software_used: String(item.software_used ?? ''),
      reports_to: String(item.reports_to ?? ''),
    }
  })
}

function memberLabel(row: RowData): string {
  return row.resource || row.role || 'Unnamed'
}

const COVERAGE_STYLES = {
  none: { label: 'No coverage at 2,2+', className: 'bg-red-50 text-red-700' },
  one: { label: '1 person at 2,2+', className: 'bg-amber-50 text-amber-700' },
  two: { label: '2+ people at 2,2+', className: 'bg-green-50 text-green-700' },
}

export default function TeamPage() {
  const [tab, setTab] = useState<'resources' | 'skills'>('resources')
  const [rows, setRows] = useState<RowData[]>([newRow()])
  const [deletedIds, setDeletedIds] = useState<number[]>([])
  const [ratings, setRatings] = useState<Rating[]>([])
  const [orgChart, setOrgChart] = useState<OrgChartMeta | null>(null)
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null)
  const [openCategory, setOpenCategory] = useState<string>(SKILL_CATALOG[0].id)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savingSkills, setSavingSkills] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [savedMsg, setSavedMsg] = useState('')
  const [error, setError] = useState('')
  const lastRowRef = useRef<HTMLTableRowElement>(null)
  const scrollToNewRow = useRef(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const savedMembers = rows.filter(r => r.id != null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/onboard/team')
        const data = await res.json()
        if (data.members && data.members.length > 0) {
          const mapped = mapMembers(data.members)
          setRows(mapped)
          if (mapped[0]?.id) setSelectedMemberId(mapped[0].id)
        }
        setRatings(data.ratings ?? [])
        setOrgChart(data.orgChart ?? null)
      } catch {
        setError('Failed to load team data. Please refresh the page.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    if (!scrollToNewRow.current) return
    scrollToNewRow.current = false
    lastRowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [rows])

  function addRow() {
    scrollToNewRow.current = true
    setRows(prev => [...prev, newRow()])
  }

  function removeRow(key: string) {
    setRows(prev => {
      const target = prev.find(r => r._key === key)
      if (target?.id) {
        setDeletedIds(ids => ids.includes(target.id!) ? ids : [...ids, target.id!])
        if (selectedMemberId === target.id) setSelectedMemberId(null)
      }
      const next = prev.filter(r => r._key !== key)
      return next.length === 0 ? [newRow()] : next
    })
  }

  function update(key: string, field: keyof Omit<RowData, '_key' | 'id'>, value: string) {
    setRows(prev => prev.map(r => (r._key === key ? { ...r, [field]: value } : r)))
  }

  const handleSave = useCallback(async () => {
    setError('')
    setSavedMsg('')
    setSaving(true)
    try {
      const items = rows.map((r, idx) => ({
        id: r.id,
        team: r.team,
        department: r.department,
        role: r.role,
        resource: r.resource,
        hours_per_week: r.hours_per_week !== '' ? parseFloat(r.hours_per_week) : null,
        responsibilities: r.responsibilities,
        software_used: r.software_used,
        reports_to: r.reports_to,
        display_order: idx,
      }))
      const res = await fetch('/api/onboard/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, deletedIds }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Failed to save. Please try again.')
        return
      }
      if (data.members?.length > 0) {
        const mapped = mapMembers(data.members)
        setRows(mapped)
        if (selectedMemberId == null && mapped[0]?.id) setSelectedMemberId(mapped[0].id)
      }
      setDeletedIds([])
      setSavedMsg('Saved!')
      setTimeout(() => setSavedMsg(''), 3000)
    } finally {
      setSaving(false)
    }
  }, [rows, deletedIds, selectedMemberId])

  async function handleUpload(file: File) {
    setError('')
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/onboard/team/org-chart', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Upload failed.')
        return
      }
      setOrgChart(data.orgChart)
      setSavedMsg('Org chart uploaded.')
      setTimeout(() => setSavedMsg(''), 3000)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function handleRemoveChart() {
    setError('')
    const res = await fetch('/api/onboard/team/org-chart', { method: 'DELETE' })
    if (!res.ok) {
      setError('Could not remove the org chart.')
      return
    }
    setOrgChart(null)
  }

  function ratingFor(memberId: number, skillId: string): Rating {
    return ratings.find(r => r.team_member_id === memberId && r.skill_id === skillId)
      ?? { team_member_id: memberId, skill_id: skillId, proficiency: 0, interest: 0 }
  }

  function setScore(memberId: number, skillId: string, field: 'proficiency' | 'interest', value: number) {
    setRatings(prev => {
      const idx = prev.findIndex(r => r.team_member_id === memberId && r.skill_id === skillId)
      if (idx === -1) return [...prev, { team_member_id: memberId, skill_id: skillId, proficiency: field === 'proficiency' ? value : 0, interest: field === 'interest' ? value : 0 }]
      return prev.map((r, i) => (i === idx ? { ...r, [field]: value } : r))
    })
  }

  function coverageCount(skillId: string): number {
    return ratings.filter(r => r.skill_id === skillId && r.proficiency >= 2 && r.interest >= 2).length
  }

  async function saveSkills() {
    if (selectedMemberId == null) return
    setError('')
    setSavingSkills(true)
    try {
      const memberRatings = ratings.filter(r => r.team_member_id === selectedMemberId)
      const res = await fetch('/api/onboard/team/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId: selectedMemberId, ratings: memberRatings }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Failed to save skills.')
        return
      }
      setSavedMsg('Skills saved!')
      setTimeout(() => setSavedMsg(''), 3000)
    } finally {
      setSavingSkills(false)
    }
  }

  if (loading) {
    return (
      <div className="w-full max-w-7xl">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
          <div className="text-slate-400 text-sm">Loading team resources…</div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h1 className="text-xl font-bold text-navy-900 mb-2">Team Resources</h1>
        <p className="text-sm text-slate-500 max-w-3xl leading-relaxed">
          Add each person on the team (or TBD / agency). Then complete the Skills Matrix for those
          people — the CEO or manager can fill it in; individual logins are not required.
        </p>
      </div>

      <div className="flex gap-1 bg-white rounded-xl border border-slate-200 p-1 w-fit">
        {([
          { id: 'resources', label: 'Team Resources' },
          { id: 'skills', label: 'Skills Matrix' },
        ] as const).map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              tab === t.id ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-navy-900'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">
          {error}
        </div>
      )}

      {tab === 'resources' && (
        <>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-sm font-semibold text-navy-900 mb-1">Org chart (optional)</h2>
            <p className="text-xs text-slate-500 mb-4">PDF, PNG, JPG, or WebP up to 10 MB.</p>
            <div className="flex flex-wrap items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.webp,application/pdf,image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0]
                  if (file) void handleUpload(file)
                }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-navy-900 text-sm font-medium rounded-lg disabled:opacity-50"
              >
                {uploading ? 'Uploading…' : orgChart ? 'Replace file' : 'Upload org chart'}
              </button>
              {orgChart && (
                <>
                  <span className="text-sm text-navy-800">{orgChart.file_name}</span>
                  <button onClick={() => void handleRemoveChart()} className="text-sm text-red-500 hover:underline">
                    Remove
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-auto max-h-[min(32rem,calc(100vh-22rem))]">
              <table className="w-full text-sm min-w-[1280px]">
                <thead className="sticky top-0 z-10">
                  <tr className="border-b border-slate-100 bg-slate-50">
                    {['Team', 'Department', 'Role', 'Resource', 'Hours/Week', 'Responsibilities', 'Software Used', 'Reports To'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                    <th className="w-10 px-2 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => (
                    <tr
                      key={row._key}
                      ref={idx === rows.length - 1 ? lastRowRef : undefined}
                      className={`border-b border-slate-100 last:border-0 align-top ${idx % 2 === 0 ? '' : 'bg-slate-50/40'}`}
                    >
                      <td className="px-4 py-2.5">
                        <input value={row.team} onChange={e => update(row._key, 'team', e.target.value)} placeholder="e.g. Tech" className={inputClass} />
                      </td>
                      <td className="px-4 py-2.5">
                        <input value={row.department} onChange={e => update(row._key, 'department', e.target.value)} placeholder="e.g. Engineering" className={inputClass} />
                      </td>
                      <td className="px-4 py-2.5">
                        <input value={row.role} onChange={e => update(row._key, 'role', e.target.value)} placeholder="e.g. CTO" className={inputClass} />
                      </td>
                      <td className="px-4 py-2.5">
                        <input value={row.resource} onChange={e => update(row._key, 'resource', e.target.value)} placeholder="Name, Agency, or TBD" className={inputClass} />
                      </td>
                      <td className="px-4 py-2.5">
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          value={row.hours_per_week}
                          onChange={e => update(row._key, 'hours_per_week', e.target.value)}
                          placeholder="40"
                          className={`${inputClass} tabular-nums w-24`}
                        />
                      </td>
                      <td className="px-4 py-2.5">
                        <textarea value={row.responsibilities} onChange={e => update(row._key, 'responsibilities', e.target.value)} rows={2} className={`${inputClass} resize-y min-h-[2.4rem]`} />
                      </td>
                      <td className="px-4 py-2.5">
                        <input value={row.software_used} onChange={e => update(row._key, 'software_used', e.target.value)} placeholder="e.g. Jira, GitHub" className={inputClass} />
                      </td>
                      <td className="px-4 py-2.5">
                        <input value={row.reports_to} onChange={e => update(row._key, 'reports_to', e.target.value)} placeholder="e.g. CEO" className={inputClass} />
                      </td>
                      <td className="px-2 py-2.5 text-center">
                        <button onClick={() => removeRow(row._key)} title="Remove row" className="text-slate-300 hover:text-red-400 text-lg font-light leading-none">
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-slate-200 bg-white flex items-center justify-between gap-4">
              <button onClick={addRow} className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700">
                <span className="text-lg font-light leading-none">+</span>
                Add person
              </button>
              <div className="flex items-center gap-3">
                {savedMsg && <span className="text-sm text-green-600 font-medium">{savedMsg}</span>}
                <button
                  onClick={() => void handleSave()}
                  disabled={saving}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg"
                >
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {tab === 'skills' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {savedMembers.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-sm text-slate-500 mb-4">
                Save at least one person on Team Resources first. The skills matrix is filled out for those people by the CEO or manager.
              </p>
              <button onClick={() => setTab('resources')} className="text-sm font-medium text-blue-600 hover:underline">
                Go to Team Resources
              </button>
            </div>
          ) : (
            <div className="flex min-h-[32rem]">
              <aside className="w-56 shrink-0 border-r border-slate-100 p-3 space-y-1 overflow-y-auto">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide px-2 mb-2">People</p>
                {savedMembers.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMemberId(m.id!)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                      selectedMemberId === m.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-navy-800 hover:bg-slate-50'
                    }`}
                  >
                    <span className="block truncate">{memberLabel(m)}</span>
                    {m.role && <span className="block text-xs text-slate-400 truncate">{m.role}</span>}
                  </button>
                ))}
              </aside>
              <div className="flex-1 flex flex-col min-w-0">
                <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between gap-3">
                  <p className="text-sm text-slate-500">
                    Rate proficiency and interest 0–2. Coverage uses people at <span className="font-medium text-navy-800">2,2 or higher</span>.
                  </p>
                  <div className="flex items-center gap-3">
                    {savedMsg && <span className="text-sm text-green-600 font-medium">{savedMsg}</span>}
                    <button
                      onClick={() => void saveSkills()}
                      disabled={savingSkills || selectedMemberId == null}
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg"
                    >
                      {savingSkills ? 'Saving…' : 'Save skills'}
                    </button>
                  </div>
                </div>
                <div className="overflow-auto flex-1 p-4 space-y-2">
                  {SKILL_CATALOG.map(cat => (
                    <div key={cat.id} className="border border-slate-100 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setOpenCategory(open => (open === cat.id ? '' : cat.id))}
                        className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 text-left"
                      >
                        <span className="text-sm font-semibold text-navy-900">{cat.name}</span>
                        <span className="text-slate-400 text-xs">{openCategory === cat.id ? 'Hide' : 'Show'}</span>
                      </button>
                      {openCategory === cat.id && selectedMemberId != null && (
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-slate-100">
                              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Skill</th>
                              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500 w-28">Proficiency</th>
                              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500 w-28">Interest</th>
                              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500 w-44">Team coverage</th>
                            </tr>
                          </thead>
                          <tbody>
                            {cat.skills.map(skill => {
                              const rating = ratingFor(selectedMemberId, skill.id)
                              const level = coverageLevel(coverageCount(skill.id))
                              const style = COVERAGE_STYLES[level]
                              return (
                                <tr key={skill.id} className="border-b border-slate-50 last:border-0">
                                  <td className="px-4 py-2 text-navy-800">{skill.name}</td>
                                  <td className="px-4 py-2">
                                    <select
                                      value={rating.proficiency}
                                      onChange={e => setScore(selectedMemberId, skill.id, 'proficiency', Number(e.target.value))}
                                      className={inputClass}
                                    >
                                      <option value={0}>0</option>
                                      <option value={1}>1</option>
                                      <option value={2}>2</option>
                                    </select>
                                  </td>
                                  <td className="px-4 py-2">
                                    <select
                                      value={rating.interest}
                                      onChange={e => setScore(selectedMemberId, skill.id, 'interest', Number(e.target.value))}
                                      className={inputClass}
                                    >
                                      <option value={0}>0</option>
                                      <option value={1}>1</option>
                                      <option value={2}>2</option>
                                    </select>
                                  </td>
                                  <td className="px-4 py-2">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${style.className}`}>
                                      {style.label}
                                    </span>
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
