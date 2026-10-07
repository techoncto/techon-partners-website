import { NextRequest, NextResponse } from 'next/server'
import { Workbook } from 'exceljs'
import { getClientSession } from '@/lib/auth'
import {
  BUDGET_AUDIT_SHEET_NAME,
  parseBudgetAuditRows,
  type SheetRow,
} from '@/lib/budget-audit-sheet'

export const runtime = 'nodejs'

const MAX_BYTES = 2 * 1024 * 1024

function isXlsx(buffer: Buffer): boolean {
  return buffer.length >= 4 && buffer[0] === 0x50 && buffer[1] === 0x4b && buffer[2] === 0x03 && buffer[3] === 0x04
}

function worksheetRows(workbook: Workbook): SheetRow[] {
  const sheet = workbook.getWorksheet(BUDGET_AUDIT_SHEET_NAME) ?? workbook.worksheets[0]
  if (!sheet) return []

  const rows: SheetRow[] = []
  sheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    const values = row.values as unknown[]
    const cells: unknown[] = []
    const width = Math.max(values.length - 1, 0)
    for (let index = 1; index <= width; index++) cells.push(values[index] ?? '')
    rows.push({ rowNumber, cells })
  })
  return rows
}

export async function POST(req: NextRequest) {
  try {
    const session = await getClientSession(req)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const form = await req.formData()
    const file = form.get('file')
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Choose an Excel file to upload.' }, { status: 400 })
    }
    if (!file.name.toLowerCase().endsWith('.xlsx')) {
      return NextResponse.json({ error: 'Upload the .xlsx template.' }, { status: 400 })
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'The spreadsheet must be 2 MB or smaller.' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    if (!isXlsx(buffer)) {
      return NextResponse.json({ error: 'Upload the .xlsx template.' }, { status: 400 })
    }

    const workbook = new Workbook()
    // exceljs types its buffer as a custom ArrayBuffer, which clashes with Node's Buffer.
    await workbook.xlsx.load(buffer as unknown as Parameters<Workbook['xlsx']['load']>[0])
    const parsed = parseBudgetAuditRows(worksheetRows(workbook))
    if ('error' in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 })
    }
    if (parsed.items.length === 0) {
      return NextResponse.json(
        { error: 'No expenses were found. Add at least one row under the headers and upload the file again.' },
        { status: 400 },
      )
    }

    return NextResponse.json({ items: parsed.items, warnings: parsed.warnings })
  } catch (error) {
    console.error('Budget audit import error:', error)
    return NextResponse.json({ error: 'Could not read that spreadsheet.' }, { status: 500 })
  }
}
