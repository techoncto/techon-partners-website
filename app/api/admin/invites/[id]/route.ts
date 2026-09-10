import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const tokenId = parseInt(id, 10)

    if (isNaN(tokenId)) {
      return NextResponse.json({ error: 'Invalid invitation ID.' }, { status: 400 })
    }

    // Fetch the token first to check eligibility
    const { data: token, error: fetchError } = await supabaseAdmin
      .from('invite_tokens')
      .select('id, initiated_at, used, revoked')
      .eq('id', tokenId)
      .single()

    if (fetchError || !token) {
      return NextResponse.json({ error: 'Invitation not found.' }, { status: 404 })
    }

    if (token.revoked) {
      return NextResponse.json({ error: 'Invitation is already revoked.' }, { status: 409 })
    }

    // Only allow revoking if the client has not started onboarding yet
    if (token.initiated_at || token.used) {
      return NextResponse.json(
        { error: 'Cannot revoke an invitation that has already been initiated.' },
        { status: 409 }
      )
    }

    const { error: updateError } = await supabaseAdmin
      .from('invite_tokens')
      .update({ revoked: true, revoked_at: new Date().toISOString() })
      .eq('id', tokenId)

    if (updateError) {
      return NextResponse.json({ error: 'Failed to revoke invitation.', detail: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Revoke invite error:', err)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
