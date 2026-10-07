import { Workbook } from 'exceljs'
import {
  BILLING_FREQUENCIES,
  BUDGET_ACTIONS,
  BUDGET_AUDIT_SHEET_NAME,
  TEMPLATE_HEADERS,
  type ImportedBudgetItem,
} from '@/lib/budget-audit-sheet'

const DATA_ROWS = 300

function listFormula(values: readonly string[]): string {
  return `"${values.join(',')}"`
}

export async function buildBudgetAuditTemplate(items: ImportedBudgetItem[] = []): Promise<Uint8Array> {
  const workbook = new Workbook()
  workbook.creator = 'Techon Partners'
  workbook.created = new Date()

  const sheet = workbook.addWorksheet(BUDGET_AUDIT_SHEET_NAME)
  const instructions = workbook.addWorksheet('Instructions')
  instructions.columns = [{ width: 28 }, { width: 88 }]
  instructions.getCell('A1').value = 'Budget audit template'
  instructions.getCell('A1').font = { bold: true, size: 16, color: { argb: 'FF0F2744' } }
  instructions.mergeCells('A1:B1')

  const lines: [string, string][] = [
    ['How to use it', 'Fill in the Budget Audit sheet, one expense per row. Save the file, then upload it on the Budget Audit page. The form fills in from your rows and saves them. Export Excel downloads the rows currently on the page into this same sheet.'],
    ['Expense', 'The vendor or cost, such as Zoom, Slack, or web hosting.'],
    ['Cost', 'The dollar amount for one billing period. Example: 49.99'],
    ['Purpose', 'What you use it for.'],
    ['Action', 'Keep It, Review It, or Trash It. Use the dropdown.'],
    ['Billing Frequency', 'One-time, Monthly, Quarterly, or Annually. Use the dropdown.'],
    ['Billing Date — Monthly', 'The day of the month, from 1 to 31. Example: 15'],
    ['Billing Date — One-time or Annually', 'A single date. Example: 2026-03-15'],
    ['Billing Date — Quarterly', 'Up to four dates separated by commas. Example: 2026-01-15, 2026-04-15, 2026-07-15, 2026-10-15'],
    ['Notes', 'Optional.'],
    ['Headers', 'Do not rename or remove the header row on the Budget Audit sheet.'],
  ]

  lines.forEach((line, index) => {
    const row = instructions.getRow(index + 3)
    row.getCell(1).value = line[0]
    row.getCell(1).font = { bold: true }
    row.getCell(2).value = line[1]
    row.getCell(2).alignment = { wrapText: true, vertical: 'top' }
    row.height = 32
  })

  sheet.views = [{ state: 'frozen', ySplit: 1 }]
  sheet.columns = [
    { header: TEMPLATE_HEADERS[0], key: 'expense', width: 28 },
    { header: TEMPLATE_HEADERS[1], key: 'cost', width: 14 },
    { header: TEMPLATE_HEADERS[2], key: 'purpose', width: 36 },
    { header: TEMPLATE_HEADERS[3], key: 'action', width: 16 },
    { header: TEMPLATE_HEADERS[4], key: 'frequency', width: 20 },
    { header: TEMPLATE_HEADERS[5], key: 'date', width: 42 },
    { header: TEMPLATE_HEADERS[6], key: 'notes', width: 36 },
  ]

  const header = sheet.getRow(1)
  header.font = { bold: true, color: { argb: 'FFFFFFFF' } }
  header.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F2744' } }
  header.alignment = { vertical: 'middle' }
  header.height = 22

  sheet.getColumn(2).numFmt = '$#,##0.00'
  sheet.getColumn(6).numFmt = '@'

  items.forEach((item, index) => {
    const row = sheet.getRow(index + 2)
    row.getCell(1).value = item.expense
    if (item.cost != null) row.getCell(2).value = item.cost
    row.getCell(3).value = item.purpose
    row.getCell(4).value = item.action
    row.getCell(5).value = item.billing_frequency
    row.getCell(6).value = item.billing_date
    row.getCell(7).value = item.notes
  })

  const lastValidatedRow = Math.max(DATA_ROWS, items.length) + 1
  for (let rowNumber = 2; rowNumber <= lastValidatedRow; rowNumber++) {
    const actionCell = sheet.getCell(rowNumber, 4)
    actionCell.dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: [listFormula(BUDGET_ACTIONS)],
      showErrorMessage: true,
      errorStyle: 'warning',
      errorTitle: 'Action',
      error: 'Choose Keep It, Review It, or Trash It.',
    }

    const frequencyCell = sheet.getCell(rowNumber, 5)
    frequencyCell.dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: [listFormula(BILLING_FREQUENCIES)],
      showErrorMessage: true,
      errorStyle: 'warning',
      errorTitle: 'Billing frequency',
      error: 'Choose One-time, Monthly, Quarterly, or Annually.',
    }
  }

  const buffer = await workbook.xlsx.writeBuffer()
  return new Uint8Array(buffer)
}
