import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ clientId: string }> }) {
  try {
    const { clientId } = await params

    const { data, error } = await supabaseAdmin
      .from('client_org_charts')
      .select('file_path, file_name')
      .eq('client_id', clientId)
      .maybeSingle()

    if (error || !data) {
      return NextResponse.json({ error: 'No org chart uploaded.' }, { status: 404 })
    }

    const { data: signed, error: signError } = await supabaseAdmin.storage
      .from('org-charts')
      .createSignedUrl(data.file_path, 60)

    if (signError || !signed?.signedUrl) {
      return NextResponse.json({ error: 'Failed to open file.' }, { status: 500 })
    }

    return NextResponse.redirect(signed.signedUrl)
  } catch {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
