import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getClientSession } from '@/lib/auth'

interface ItemInput {
  id?: number
  expense: string
  cost: number | null
  purpose: string
  action: string
  billing_frequency: string
  billing_date: string
  notes: string
  display_order: number
}

function toIntId(value: unknown): number | null {
  const n = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN
  return Number.isInteger(n) && n > 0 ? n : null
}

export async function GET() {
  try {
    const session = await getClientSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabaseAdmin
      .from('budget_audit_items')
      .select('id, expense, cost, purpose, action, billing_frequency, billing_date, notes, display_order')
      .eq('client_id', session.clientId)
      .is('deleted_at', null)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Budget audit load error:', error)
      return NextResponse.json({ error: 'Failed to load items.' }, { status: 500 })
    }

    return NextResponse.json({ items: data ?? [] })
  } catch {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getClientSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json() as { items: ItemInput[]; deletedIds?: unknown[] }
    const items = body.items ?? []
    const deletedIds = (body.deletedIds ?? []).map(toIntId).filter((id): id is number => id !== null)

    if (deletedIds.length > 0) {
      const { error: softDeleteError } = await supabaseAdmin
        .from('budget_audit_items')
        .update({ deleted_at: new Date().toISOString() })
        .eq('client_id', session.clientId)
        .in('id', deletedIds)
        .is('deleted_at', null)

      if (softDeleteError) {
        console.error('Budget audit soft-delete error:', softDeleteError)
        return NextResponse.json({ error: 'Failed to save.' }, { status: 500 })
      }
    }

    const toUpdate = items.filter(item => toIntId(item.id) !== null)
    const toInsert = items.filter(item => toIntId(item.id) === null)

    for (const [idx, item] of toUpdate.entries()) {
      const id = toIntId(item.id)!
      const { error: updateError } = await supabaseAdmin
        .from('budget_audit_items')
        .update({
          expense: item.expense ?? '',
          cost: item.cost ?? null,
          purpose: item.purpose ?? '',
          action: item.action ?? '',
          billing_frequency: item.billing_frequency ?? '',
          billing_date: item.billing_date ?? '',
          notes: item.notes ?? '',
          display_order: item.display_order ?? idx,
        })
        .eq('id', id)
        .eq('client_id', session.clientId)
        .is('deleted_at', null)

      if (updateError) {
        console.error('Budget audit update error:', updateError)
        return NextResponse.json({ error: 'Failed to save.' }, { status: 500 })
      }
    }

    if (toInsert.length > 0) {
      const rows = toInsert.map((item, idx) => ({
        client_id: session.clientId,
        expense: item.expense ?? '',
        cost: item.cost ?? null,
        purpose: item.purpose ?? '',
        action: item.action ?? '',
        billing_frequency: item.billing_frequency ?? '',
        billing_date: item.billing_date ?? '',
        notes: item.notes ?? '',
        display_order: item.display_order ?? toUpdate.length + idx,
      }))

      const { error: insertError } = await supabaseAdmin
        .from('budget_audit_items')
        .insert(rows)

      if (insertError) {
        console.error('Budget audit insert error:', insertError)
        return NextResponse.json({ error: 'Failed to save.' }, { status: 500 })
      }
    }

    const { data: saved } = await supabaseAdmin
      .from('budget_audit_items')
      .select('id, expense, cost, purpose, action, billing_frequency, billing_date, notes, display_order')
      .eq('client_id', session.clientId)
      .is('deleted_at', null)
      .order('display_order', { ascending: true })

    return NextResponse.json({ ok: true, items: saved ?? [] })
  } catch {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
