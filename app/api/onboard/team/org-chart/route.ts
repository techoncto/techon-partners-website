import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getClientSession } from '@/lib/auth'

const BUCKET = 'org-charts'
const MAX_BYTES = 10 * 1024 * 1024
const ALLOWED_EXTENSIONS: Record<string, string> = {
  pdf: 'application/pdf',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
}

function fileExtension(name: string): string {
  const i = name.lastIndexOf('.')
  return i >= 0 ? name.slice(i + 1).toLowerCase() : ''
}

function sniffMime(buffer: Buffer): string | null {
  if (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return 'image/png'
  }
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'image/jpeg'
  }
  if (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buffer.subarray(8, 12).toString('ascii') === 'WEBP'
  ) {
    return 'image/webp'
  }
  if (buffer.length >= 5 && buffer.subarray(0, 5).toString('latin1') === '%PDF-') {
    return 'application/pdf'
  }
  return null
}

function safeFileName(name: string): string {
  const base = name.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/^\.+/, '')
  return (base || 'org-chart').slice(0, 120)
}

export async function POST(req: NextRequest) {
  try {
    const session = await getClientSession(req.cookies)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const form = await req.formData()
    const file = form.get('file')
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Please choose a file to upload.' }, { status: 400 })
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'File must be 10 MB or smaller.' }, { status: 400 })
    }

    const ext = fileExtension(file.name)
    const expectedMime = ALLOWED_EXTENSIONS[ext]
    if (!expectedMime) {
      return NextResponse.json({ error: 'Upload a PDF, PNG, JPG, or WebP file.' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const sniffedMime = sniffMime(buffer)
    if (!sniffedMime || sniffedMime !== expectedMime) {
      return NextResponse.json({ error: 'Upload a PDF, PNG, JPG, or WebP file.' }, { status: 400 })
    }

    const { data: existing } = await supabaseAdmin
      .from('client_org_charts')
      .select('file_path')
      .eq('client_id', session.clientId)
      .maybeSingle()

    const fileName = safeFileName(file.name)
    const filePath = `${session.clientId}/${crypto.randomUUID()}-${fileName}`

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(filePath, buffer, { contentType: sniffedMime, upsert: false })

    if (uploadError) {
      console.error('Org chart upload error:', uploadError)
      return NextResponse.json({ error: 'Failed to upload file.' }, { status: 500 })
    }

    if (existing?.file_path) {
      await supabaseAdmin.storage.from(BUCKET).remove([existing.file_path])
    }

    const row = {
      client_id: session.clientId,
      file_path: filePath,
      file_name: fileName,
      mime_type: sniffedMime,
    }

    const { data, error: upsertError } = existing
      ? await supabaseAdmin
          .from('client_org_charts')
          .update({ ...row, created_at: new Date().toISOString() })
          .eq('client_id', session.clientId)
          .select('id, file_name, mime_type, created_at')
          .single()
      : await supabaseAdmin
          .from('client_org_charts')
          .insert(row)
          .select('id, file_name, mime_type, created_at')
          .single()

    if (upsertError) {
      console.error('Org chart metadata error:', upsertError)
      return NextResponse.json({ error: 'Failed to save file.' }, { status: 500 })
    }

    return NextResponse.json({ ok: true, orgChart: data })
  } catch {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getClientSession(req.cookies)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: existing } = await supabaseAdmin
      .from('client_org_charts')
      .select('file_path')
      .eq('client_id', session.clientId)
      .maybeSingle()

    if (existing?.file_path) {
      await supabaseAdmin.storage.from(BUCKET).remove([existing.file_path])
    }

    await supabaseAdmin
      .from('client_org_charts')
      .delete()
      .eq('client_id', session.clientId)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
