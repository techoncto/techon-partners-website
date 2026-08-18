import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Events Resend will POST to this endpoint.
// Register this URL in Resend → Webhooks:
//   https://resend.com/webhooks  →  add  https://techonpartners.com/api/webhooks/resend
// Select events: email.sent, email.delivered, email.opened, email.clicked, email.bounced, email.complained

// Priority order — only update if the new event is "more advanced" than the current one
const EVENT_RANK: Record<string, number> = {
  not_sent:        0,
  queued:          1,
  sent:            2,
  delivered:       3,
  opened:          4,
  clicked:         5,
  delivery_delayed: 2,
  bounced:         10, // terminal — always overwrite
  complained:      10,
  failed:          10,
}

// Map Resend webhook event type → our status string
function eventToStatus(type: string): string {
  const map: Record<string, string> = {
    'email.queued':           'queued',
    'email.sent':             'sent',
    'email.delivered':        'delivered',
    'email.opened':           'opened',
    'email.clicked':          'clicked',
    'email.bounced':          'bounced',
    'email.complained':       'complained',
    'email.delivery_delayed': 'delivery_delayed',
    'email.failed':           'failed',
  }
  return map[type] ?? 'sent'
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const eventType: string = body?.type ?? ''
    const emailId: string = body?.data?.email_id ?? ''

    if (!emailId || !eventType) {
      return NextResponse.json({ error: 'Missing email_id or type.' }, { status: 400 })
    }

    const newStatus = eventToStatus(eventType)

    // Find the invite token with this Resend email ID
    const { data: token, error: fetchError } = await supabaseAdmin
      .from('invite_tokens')
      .select('id, email_status')
      .eq('resend_email_id', emailId)
      .single()

    if (fetchError || !token) {
      // Not found — could be a different email, ignore silently
      return NextResponse.json({ ok: true })
    }

    // Only update if the new status is more advanced (or terminal)
    const currentRank = EVENT_RANK[token.email_status] ?? 0
    const newRank = EVENT_RANK[newStatus] ?? 0

    if (newRank >= currentRank) {
      await supabaseAdmin
        .from('invite_tokens')
        .update({ email_status: newStatus })
        .eq('id', token.id)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Resend webhook error:', err)
    return NextResponse.json({ error: 'Webhook processing failed.' }, { status: 500 })
  }
}
