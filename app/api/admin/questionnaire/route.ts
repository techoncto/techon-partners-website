import { NextRequest, NextResponse } from 'next/server'
import { httpStatus, loadQuestionnaire, saveQuestionnaire, type SavePart } from '@/lib/questionnaire-admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const parts = await loadQuestionnaire()
    return NextResponse.json({ parts })
  } catch (error) {
    console.error('Questionnaire fetch error:', error)
    return NextResponse.json({ error: 'Failed to load questionnaire.' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const parts = await saveQuestionnaire((body?.parts ?? []) as SavePart[])
    return NextResponse.json({ parts })
  } catch (error) {
    const status = httpStatus(error)
    const message = error instanceof Error ? error.message : 'Something went wrong.'
    if (status >= 500) console.error('Questionnaire save error:', error)
    return NextResponse.json({ error: status >= 500 ? 'Failed to save.' : message }, { status })
  }
}
