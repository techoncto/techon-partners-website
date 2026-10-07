export const BUDGET_AUDIT_SHEET_NAME = 'Budget Audit'

export const TEMPLATE_HEADERS = [
  'Expense',
  'Cost',
  'Purpose',
  'Action',
  'Billing Frequency',
  'Billing Date',
  'Notes',
] as const

export const BUDGET_ACTIONS = ['Keep It', 'Review It', 'Trash It'] as const
export const BILLING_FREQUENCIES = ['One-time', 'Monthly', 'Quarterly', 'Annually'] as const

export const MAX_IMPORT_ROWS = 500
export const MAX_QUARTERLY_DATES = 4

export interface ImportedBudgetItem {
  expense: string
  cost: number | null
  purpose: string
  action: string
  billing_frequency: string
  billing_date: string
  notes: string
}

export interface SheetRow {
  rowNumber: number
  cells: unknown[]
}

export interface ParsedBudgetSheet {
  items: ImportedBudgetItem[]
  warnings: string[]
}

type Field = keyof ImportedBudgetItem

const HEADER_FIELDS: Record<string, Field> = {
  expense: 'expense',
  cost: 'cost',
  purpose: 'purpose',
  action: 'action',
  billingfrequency: 'billing_frequency',
  frequency: 'billing_frequency',
  billingdate: 'billing_date',
  date: 'billing_date',
  notes: 'notes',
  note: 'notes',
}

const ACTION_ALIASES: Record<string, (typeof BUDGET_ACTIONS)[number]> = {
  'keep it': 'Keep It',
  keep: 'Keep It',
  'review it': 'Review It',
  review: 'Review It',
  'trash it': 'Trash It',
  trash: 'Trash It',
}

const FREQUENCY_ALIASES: Record<string, (typeof BILLING_FREQUENCIES)[number]> = {
  'one-time': 'One-time',
  'one time': 'One-time',
  onetime: 'One-time',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  annually: 'Annually',
  annual: 'Annually',
  yearly: 'Annually',
}

function unwrap(value: unknown): unknown {
  if (value == null) return ''
  if (value instanceof Date) return value
  if (typeof value !== 'object') return value

  const record = value as Record<string, unknown>
  if (Array.isArray(record.richText)) {
    return record.richText
      .map(part => (part && typeof part === 'object' && 'text' in part ? String(part.text ?? '') : ''))
      .join('')
  }
  if ('result' in record) return unwrap(record.result)
  if (typeof record.text === 'string') return record.text
  if ('error' in record) return ''
  return value
}

function textOf(value: unknown): string {
  const raw = unwrap(value)
  if (raw == null) return ''
  if (raw instanceof Date) return ''
  if (typeof raw === 'number') return Number.isFinite(raw) ? String(raw) : ''
  if (typeof raw === 'boolean') return raw ? 'true' : 'false'
  if (typeof raw === 'string') return raw.trim()
  return ''
}

function headerKey(value: unknown): string {
  return textOf(value).toLowerCase().replace(/[^a-z]/g, '')
}

function isBlank(value: unknown): boolean {
  const raw = unwrap(value)
  if (raw == null || raw === '') return true
  if (typeof raw === 'string') return raw.trim() === ''
  return false
}

function toIsoDate(year: number, month: number, day: number): string | null {
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return null
  if (year < 1900 || year > 2200 || month < 1 || month > 12 || day < 1 || day > 31) return null
  const dt = new Date(Date.UTC(year, month - 1, day))
  if (dt.getUTCFullYear() !== year || dt.getUTCMonth() !== month - 1 || dt.getUTCDate() !== day) return null
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function parseDateString(value: string): string | null {
  const text = value.trim()
  const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(text)
  if (iso) return toIsoDate(Number(iso[1]), Number(iso[2]), Number(iso[3]))

  const us = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/.exec(text)
  if (us) {
    let year = Number(us[3])
    if (year < 100) year += 2000
    return toIsoDate(year, Number(us[1]), Number(us[2]))
  }
  return null
}

/** Excel serials below 32 are day-of-month numbers, not calendar dates. */
function calendarDate(value: unknown): string | null {
  const raw = unwrap(value)
  if (raw instanceof Date && !Number.isNaN(raw.getTime())) {
    return toIsoDate(raw.getFullYear(), raw.getMonth() + 1, raw.getDate())
  }
  if (typeof raw === 'number' && Number.isFinite(raw) && raw >= 32) {
    const ms = Date.UTC(1899, 11, 30) + Math.round(raw) * 86400000
    const dt = new Date(ms)
    return toIsoDate(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate())
  }
  const text = textOf(raw)
  if (!text) return null
  return parseDateString(text)
}

function dayOfMonth(value: unknown): number | null {
  const raw = unwrap(value)
  if (typeof raw === 'number' && Number.isInteger(raw) && raw >= 1 && raw <= 31) return raw
  if (raw instanceof Date && !Number.isNaN(raw.getTime())) return raw.getDate()

  const text = textOf(raw)
  if (/^\d{1,2}$/.test(text)) {
    const day = Number(text)
    if (day >= 1 && day <= 31) return day
  }
  const iso = calendarDate(raw)
  if (!iso) return null
  return Number(iso.slice(-2))
}

function splitDateList(value: unknown): string[] {
  const raw = unwrap(value)
  if (raw instanceof Date || (typeof raw === 'number' && raw >= 32)) {
    const iso = calendarDate(raw)
    return iso ? [iso] : []
  }
  return textOf(raw)
    .split(/[,;\n|]+/)
    .map(part => part.trim())
    .filter(Boolean)
}

function parseCost(value: unknown): number | null {
  const raw = unwrap(value)
  if (raw == null || raw === '') return null
  if (typeof raw === 'number' && Number.isFinite(raw)) return Math.round(raw * 100) / 100
  const cleaned = textOf(raw).replace(/[$,\s]/g, '')
  if (!cleaned) return null
  const amount = Number(cleaned)
  if (!Number.isFinite(amount)) return null
  return Math.round(amount * 100) / 100
}

function matchAction(value: string): string | null {
  if (!value) return ''
  return ACTION_ALIASES[value.trim().toLowerCase()] ?? null
}

function matchFrequency(value: string): string | null {
  if (!value) return ''
  return FREQUENCY_ALIASES[value.trim().toLowerCase()] ?? null
}

function billingDateFor(frequency: string, value: unknown, warnings: string[], rowNumber: number): string {
  if (isBlank(value)) return ''

  if (frequency === 'Monthly') {
    const day = dayOfMonth(value)
    if (day == null) {
      warnings.push(`Row ${rowNumber}: billing date should be a day of the month from 1 to 31.`)
      return ''
    }
    return String(day)
  }

  if (frequency === 'Quarterly') {
    const parts = splitDateList(value)
    if (parts.length === 0) {
      warnings.push(`Row ${rowNumber}: quarterly billing needs up to 4 dates, separated by commas.`)
      return ''
    }
    const dates: string[] = []
    let invalid = false
    for (const part of parts) {
      const iso = parseDateString(part) ?? calendarDate(part)
      if (!iso) invalid = true
      else if (!dates.includes(iso)) dates.push(iso)
    }
    dates.sort()
    if (invalid) {
      warnings.push(`Row ${rowNumber}: some quarterly dates could not be read. Use YYYY-MM-DD.`)
    }
    if (dates.length > MAX_QUARTERLY_DATES) {
      warnings.push(`Row ${rowNumber}: quarterly billing keeps only 4 dates. Extra dates were dropped.`)
    }
    return dates.slice(0, MAX_QUARTERLY_DATES).join(',')
  }

  if (frequency === 'One-time' || frequency === 'Annually') {
    const parts = splitDateList(value)
    const iso = parts.length > 0 ? (parseDateString(parts[0]) ?? calendarDate(parts[0])) : calendarDate(value)
    if (!iso) {
      warnings.push(`Row ${rowNumber}: billing date should be a date such as 2026-03-15.`)
      return ''
    }
    if (parts.length > 1) {
      warnings.push(`Row ${rowNumber}: only the first billing date was used.`)
    }
    return iso
  }

  const iso = calendarDate(value)
  if (iso) return iso
  const day = dayOfMonth(value)
  if (day != null && textOf(value) !== '' && /^\d{1,2}$/.test(textOf(value))) return String(day)
  if (!isBlank(value)) {
    warnings.push(`Row ${rowNumber}: billing date was left blank because it could not be read.`)
  }
  return ''
}

function findHeader(rows: SheetRow[]): { index: number; columns: Partial<Record<Field, number>> } | null {
  const scan = rows.slice(0, 15)
  for (let index = 0; index < scan.length; index++) {
    const columns: Partial<Record<Field, number>> = {}
    scan[index].cells.forEach((cell, cellIndex) => {
      const field = HEADER_FIELDS[headerKey(cell)]
      if (field && columns[field] == null) columns[field] = cellIndex
    })
    if (columns.expense != null) return { index, columns }
  }
  return null
}

export function parseBudgetAuditRows(rows: SheetRow[]): ParsedBudgetSheet | { error: string } {
  const header = findHeader(rows)
  if (!header) {
    return {
      error: 'This file is missing the Expense column. Download the template and keep the header row.',
    }
  }

  const warnings: string[] = []
  const items: ImportedBudgetItem[] = []
  const dataRows = rows.slice(header.index + 1)

  for (const row of dataRows) {
    if (row.cells.every(isBlank)) continue
    if (items.length >= MAX_IMPORT_ROWS) {
      warnings.push(`Only the first ${MAX_IMPORT_ROWS} expenses were imported.`)
      break
    }

    const cell = (field: Field) => {
      const index = header.columns[field]
      return index == null ? '' : row.cells[index]
    }

    const expense = textOf(cell('expense'))
    const purpose = textOf(cell('purpose'))
    const notes = textOf(cell('notes'))
    const costValue = cell('cost')
    const cost = parseCost(costValue)
    if (!isBlank(costValue) && cost == null) {
      warnings.push(`Row ${row.rowNumber}: cost was not a number and was left blank.`)
    }

    const actionText = textOf(cell('action'))
    const action = matchAction(actionText)
    if (action == null) {
      warnings.push(`Row ${row.rowNumber}: action "${actionText}" was not recognized and was left blank.`)
    }

    const frequencyText = textOf(cell('billing_frequency'))
    const frequency = matchFrequency(frequencyText)
    if (frequency == null) {
      warnings.push(`Row ${row.rowNumber}: billing frequency "${frequencyText}" was not recognized and was left blank.`)
    }

    const billingFrequency = frequency ?? ''
    const billingDate = billingDateFor(billingFrequency, cell('billing_date'), warnings, row.rowNumber)

    if (!expense && !purpose && !notes && cost == null && !billingFrequency && !billingDate && !(action ?? '')) {
      continue
    }

    items.push({
      expense,
      cost,
      purpose,
      action: action ?? '',
      billing_frequency: billingFrequency,
      billing_date: billingDate,
      notes,
    })
  }

  return { items, warnings }
}
