import { NextRequest, NextResponse } from 'next/server'
import { getClientSession } from '@/lib/auth'
import { MAX_IMPORT_ROWS, type ImportedBudgetItem } from '@/lib/budget-audit-sheet'
import { buildBudgetAuditTemplate } from '@/lib/budget-audit-template'

export const runtime = 'nodejs'

function exportItems(value: unknown): ImportedBudgetItem[] {
  if (!Array.isArray(value)) return []

  return value.slice(0, MAX_IMPORT_ROWS).flatMap(entry => {
    if (!entry || typeof entry !== 'object') return []
    const row = entry as Record<string, unknown>
    const costText = typeof row.cost === 'number' ? String(row.cost) : String(row.cost ?? '').trim()
    const costNumber = Number(costText)
    const cost = costText !== '' && Number.isFinite(costNumber) ? Math.round(costNumber * 100) / 100 : null
    const item: ImportedBudgetItem = {
      expense: String(row.expense ?? '').slice(0, 500),
      cost,
      purpose: String(row.purpose ?? '').slice(0, 2000),
      action: String(row.action ?? '').slice(0, 50),
      billing_frequency: String(row.billing_frequency ?? '').slice(0, 50),
      billing_date: String(row.billing_date ?? '').slice(0, 200),
      notes: String(row.notes ?? '').slice(0, 5000),
    }
    const hasContent = item.expense || item.purpose || item.notes || item.cost != null || item.action || item.billing_frequency || item.billing_date
    return hasContent ? [item] : []
  })
}

export async function POST(req: NextRequest) {
  try {
    const session = await getClientSession(req)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json() as { items?: unknown }
    const items = exportItems(body.items)
    if (items.length === 0) {
      return NextResponse.json({ error: 'Add at least one expense before exporting.' }, { status: 400 })
    }

    const bytes = await buildBudgetAuditTemplate(items)
    return new NextResponse(Buffer.from(bytes), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="budget-audit.xlsx"',
        'Cache-Control': 'private, no-store',
      },
    })
  } catch (error) {
    console.error('Budget audit export error:', error)
    return NextResponse.json({ error: 'Could not export the spreadsheet.' }, { status: 500 })
  }
}
