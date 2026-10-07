import { NextRequest, NextResponse } from 'next/server'
import { getClientSession } from '@/lib/auth'
import { buildBudgetAuditTemplate } from '@/lib/budget-audit-template'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  try {
    const session = await getClientSession(req)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const bytes = await buildBudgetAuditTemplate()
    return new NextResponse(Buffer.from(bytes), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="budget-audit-template.xlsx"',
        'Cache-Control': 'private, no-store',
      },
    })
  } catch (error) {
    console.error('Budget audit template error:', error)
    return NextResponse.json({ error: 'Could not build the template.' }, { status: 500 })
  }
}
