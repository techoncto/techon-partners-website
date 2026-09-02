'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface RowData {
  id?: number
  _key: string
  expense: string
  cost: string
  purpose: string
  action: string
  billing_frequency: string
  billing_date: string
  notes: string
}

const ACTIONS = ['', 'Keep It', 'Review It', 'Trash It']
const FREQUENCIES = ['', 'One-time', 'Monthly', 'Quarterly', 'Annually']
const MONTH_DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1))

const ACTION_COLORS: Record<string, string> = {
  'Keep It':    'text-green-700 bg-green-50',
  'Review It':  'text-amber-700 bg-amber-50',
  'Trash It':   'text-red-700 bg-red-50',
}

function newRow(): RowData {
  return {
    _key: String(Date.now() + Math.random()),
    expense: '',
    cost: '',
    purpose: '',
    action: '',
    billing_frequency: '',
    billing_date: '',
    notes: '',
  }
}

function parseItemId(value: unknown): number | undefined {
  const n = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN
  return Number.isInteger(n) && n > 0 ? n : undefined
}

function mapItems(items: Record<string, unknown>[]): RowData[] {
  return items.map(item => {
    const id = parseItemId(item.id)
    return {
      id,
      _key: id != null ? String(id) : String(Date.now() + Math.random()),
    expense: String(item.expense ?? ''),
    cost: item.cost != null ? String(item.cost) : '',
    purpose: String(item.purpose ?? ''),
    action: String(item.action ?? ''),
    billing_frequency: String(item.billing_frequency ?? ''),
    billing_date: String(item.billing_date ?? ''),
    notes: String(item.notes ?? ''),
    }
  })
}

const inputClass =
  'w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-navy-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white placeholder-slate-300'

const selectClass =
  'w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-navy-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'

function parseDateList(value: string): string[] {
  return value.split(',').map(v => v.trim()).filter(Boolean)
}

function formatDateLabel(iso: string): string {
  const [y, m, d] = iso.split('-')
  if (!y || !m || !d) return iso
  return `${m}/${d}/${y}`
}

function BillingDateField({
  frequency,
  value,
  onChange,
}: {
  frequency: string
  value: string
  onChange: (val: string) => void
}) {
  if (!frequency) {
    return (
      <input
        disabled
        placeholder="Select frequency first"
        className={`${inputClass} disabled:bg-slate-50 disabled:text-slate-400`}
      />
    )
  }

  if (frequency === 'Monthly') {
    return (
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={selectClass}
      >
        <option value="">Day…</option>
        {MONTH_DAYS.map(day => (
          <option key={day} value={day}>
            {day}
          </option>
        ))}
      </select>
    )
  }

  if (frequency === 'Quarterly') {
    const dates = parseDateList(value).slice(0, 4)
    const atMax = dates.length >= 4
    return (
      <div className="space-y-1.5">
        {dates.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {dates.map(date => (
              <button
                key={date}
                type="button"
                onClick={() => onChange(dates.filter(d => d !== date).join(','))}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-100 text-navy-800 text-xs hover:bg-red-50 hover:text-red-600"
                title="Remove date"
              >
                {formatDateLabel(date)}
                <span className="leading-none">×</span>
              </button>
            ))}
          </div>
        )}
        {atMax ? (
          <p className="text-[11px] text-slate-400">Maximum of 4 payments</p>
        ) : (
          <input
            type="date"
            value=""
            onChange={e => {
              const next = e.target.value
              if (!next || dates.includes(next) || dates.length >= 4) return
              onChange([...dates, next].sort().join(','))
            }}
            className={inputClass}
          />
        )}
      </div>
    )
  }

  return (
    <input
      type="date"
      value={value}
      onChange={e => onChange(e.target.value)}
      className={inputClass}
    />
  )
}

export default function BudgetAuditPage() {
  const [rows, setRows] = useState<RowData[]>([newRow()])
  const [deletedIds, setDeletedIds] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedMsg, setSavedMsg] = useState(false)
  const [error, setError] = useState('')
  const lastRowRef = useRef<HTMLTableRowElement>(null)
  const scrollToNewRow = useRef(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/onboard/budget-audit')
        const data = await res.json()
        if (data.items && data.items.length > 0) {
          setRows(mapItems(data.items))
        }
      } catch {
        setError('Failed to load your budget audit. Please refresh the page.')
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
      }
      const next = prev.filter(r => r._key !== key)
      return next.length === 0 ? [newRow()] : next
    })
  }

  function update(key: string, field: keyof Omit<RowData, '_key' | 'id'>, value: string) {
    setRows(prev => prev.map(r => {
      if (r._key !== key) return r
      if (field === 'billing_frequency' && r.billing_frequency !== value) {
        return { ...r, billing_frequency: value, billing_date: '' }
      }
      return { ...r, [field]: value }
    }))
  }

  const total = rows.reduce((sum, r) => {
    const n = parseFloat(r.cost)
    return isNaN(n) ? sum : sum + n
  }, 0)

  const handleSave = useCallback(async () => {
    setError('')
    setSavedMsg(false)
    setSaving(true)
    try {
      const items = rows.map((r, idx) => ({
        id: r.id,
        expense: r.expense,
        cost: r.cost !== '' ? parseFloat(r.cost) : null,
        purpose: r.purpose,
        action: r.action,
        billing_frequency: r.billing_frequency,
        billing_date:
          r.billing_frequency === 'Quarterly'
            ? parseDateList(r.billing_date).slice(0, 4).join(',')
            : r.billing_date,
        notes: r.notes,
        display_order: idx,
      }))
      const res = await fetch('/api/onboard/budget-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, deletedIds }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Failed to save. Please try again.')
        return
      }
      if (data.items?.length > 0) {
        setRows(mapItems(data.items))
      }
      setDeletedIds([])
      setSavedMsg(true)
      setTimeout(() => setSavedMsg(false), 3000)
    } finally {
      setSaving(false)
    }
  }, [rows, deletedIds])

  if (loading) {
    return (
      <div className="w-full max-w-7xl">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
          <div className="text-slate-400 text-sm">Loading your budget audit…</div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h1 className="text-xl font-bold text-navy-900 mb-2">Budget Audit</h1>
        <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
          Review your credit card statement and write down all your recurring expenses: technology or
          sales vendors, contractors, SaaS licenses, CRMs, web hosting, Zoom, Slack, Asana —
          everything. As you add each item, grade it: <span className="font-medium text-green-700">Keep It</span>,{' '}
          <span className="font-medium text-amber-700">Review It</span>, or{' '}
          <span className="font-medium text-red-700">Trash It</span>.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {(['Keep It', 'Review It', 'Trash It'] as const).map(action => {
          const matching = rows.filter(r => r.action === action)
          const subtotal = matching.reduce((s, r) => {
            const n = parseFloat(r.cost)
            return isNaN(n) ? s : s + n
          }, 0)
          const colors: Record<string, string> = {
            'Keep It':   'border-green-200 bg-green-50',
            'Review It': 'border-amber-200 bg-amber-50',
            'Trash It':  'border-red-200 bg-red-50',
          }
          const textColors: Record<string, string> = {
            'Keep It':   'text-green-700',
            'Review It': 'text-amber-700',
            'Trash It':  'text-red-700',
          }
          return (
            <div key={action} className={`rounded-xl border p-4 ${colors[action]}`}>
              <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${textColors[action]}`}>
                {action}
              </p>
              <p className={`text-xl font-bold ${textColors[action]}`}>
                ${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className={`text-xs mt-0.5 ${textColors[action]} opacity-70`}>
                {matching.length} item{matching.length !== 1 ? 's' : ''}
              </p>
            </div>
          )
        })}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-auto max-h-[min(32rem,calc(100vh-22rem))]">
          <table className="w-full text-sm min-w-[1180px]">
            <thead className="sticky top-0 z-10">
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-[16%]">
                  Expense
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-[11%] min-w-[7.5rem]">
                  Cost ($)
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-[18%]">
                  Purpose
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-[11%]">
                  Action
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-[12%]">
                  Billing Frequency
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-[14%] min-w-[10.5rem]">
                  Billing Date
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-[16%]">
                  Notes
                </th>
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
                    <input
                      type="text"
                      value={row.expense}
                      onChange={e => update(row._key, 'expense', e.target.value)}
                      placeholder="e.g. Zoom"
                      className={inputClass}
                    />
                  </td>
                  <td className="px-4 py-2.5">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={row.cost}
                      onChange={e => update(row._key, 'cost', e.target.value)}
                      placeholder="0.00"
                      className={`${inputClass} tabular-nums`}
                    />
                  </td>
                  <td className="px-4 py-2.5">
                    <input
                      type="text"
                      value={row.purpose}
                      onChange={e => update(row._key, 'purpose', e.target.value)}
                      placeholder="e.g. Video calls"
                      className={inputClass}
                    />
                  </td>
                  <td className="px-4 py-2.5">
                    <select
                      value={row.action}
                      onChange={e => update(row._key, 'action', e.target.value)}
                      className={`${selectClass} ${row.action ? ACTION_COLORS[row.action] ?? '' : ''} font-medium`}
                    >
                      {ACTIONS.map(a => (
                        <option key={a} value={a} className="text-navy-900 bg-white font-normal">
                          {a || 'Select…'}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2.5">
                    <select
                      value={row.billing_frequency}
                      onChange={e => update(row._key, 'billing_frequency', e.target.value)}
                      className={selectClass}
                    >
                      {FREQUENCIES.map(f => (
                        <option key={f} value={f}>
                          {f || 'Select…'}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2.5">
                    <BillingDateField
                      frequency={row.billing_frequency}
                      value={row.billing_date}
                      onChange={val => update(row._key, 'billing_date', val)}
                    />
                  </td>
                  <td className="px-4 py-2.5">
                    <textarea
                      value={row.notes}
                      onChange={e => update(row._key, 'notes', e.target.value)}
                      placeholder="Optional notes…"
                      rows={2}
                      className={`${inputClass} resize-y min-h-[2.4rem] leading-snug`}
                    />
                  </td>
                  <td className="px-2 py-2.5 text-center">
                    <button
                      onClick={() => removeRow(row._key)}
                      title="Remove row"
                      className="text-slate-300 hover:text-red-400 transition-colors text-lg font-light leading-none"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-slate-200 bg-white flex items-center justify-between gap-4">
          <button
            onClick={addRow}
            className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span className="text-lg font-light leading-none">+</span>
            Add Row
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total</span>
            <span className="font-bold text-navy-900 text-sm tabular-nums">
              ${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {savedMsg && (
              <span className="text-sm text-green-600 font-medium">Saved!</span>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
