import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no ambiguous chars (0/O, 1/I)
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

export async function POST(req: NextRequest) {
  try {
    const { clientName, clientEmail } = await req.json()

    if (!clientName || !clientEmail) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 })
    }

    // Generate a unique code (retry if collision)
    let code = ''
    let attempts = 0
    while (attempts < 5) {
      const candidate = generateCode()
      const { data } = await supabaseAdmin
        .from('invite_tokens')
        .select('id')
        .eq('code', candidate)
        .single()
      if (!data) { code = candidate; break }
      attempts++
    }

    if (!code) {
      return NextResponse.json({ error: 'Failed to generate a unique code. Please try again.' }, { status: 500 })
    }

    const { data: token, error: insertError } = await supabaseAdmin
      .from('invite_tokens')
      .insert({ code, client_name: clientName.trim(), client_email: clientEmail.trim().toLowerCase() })
      .select('id, code')
      .single()

    if (insertError || !token) {
      return NextResponse.json({ error: 'Failed to create invitation.', detail: insertError?.message }, { status: 500 })
    }

    const siteUrl = process.env.DEPLOY_PRIME_URL ?? new URL(req.url).origin
    const inviteLink = `${siteUrl}/onboard?code=${token.code}`

    // Send invite email
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'Techon Partners <onboarding@techonpartners.com>',
      to: clientEmail.trim(),
      subject: 'Your Techon Partners Onboarding Invitation',
      html: buildEmailHtml({ clientName: clientName.trim(), code: token.code, inviteLink, siteUrl }),
    })

    if (emailError) {
      console.error('Resend error:', emailError)
      // Token was created — still return success but note email failure
      return NextResponse.json({
        success: true,
        code: token.code,
        link: inviteLink,
        emailWarning: 'Invite created but email failed to send.',
      })
    }

    const sentAt = new Date().toISOString()
    let emailStatus = 'sent'

    // Fetch the initial status from Resend right after sending
    // This gives us a real status immediately (works locally without webhooks)
    if (emailData?.id) {
      try {
        await new Promise(r => setTimeout(r, 1000)) // brief pause for Resend to register the send
        const { data: emailInfo } = await resend.emails.get(emailData.id)
        if (emailInfo?.last_event) emailStatus = emailInfo.last_event
      } catch {
        // Non-fatal — default to 'sent'
      }
    }

    await supabaseAdmin
      .from('invite_tokens')
      .update({
        resend_email_id: emailData?.id,
        email_sent_at: sentAt,
        email_status: emailStatus,
      })
      .eq('id', token.id)

    return NextResponse.json({ success: true, code: token.code, link: inviteLink })
  } catch (err) {
    console.error('Invite error:', err)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}

function buildEmailHtml({
  clientName,
  code,
  inviteLink,
  siteUrl,
}: {
  clientName: string
  code: string
  inviteLink: string
  siteUrl: string
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f1f5f9;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" role="presentation" style="max-width:560px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Logo / header -->
        <tr>
          <td style="background:#0a1628;padding:0;text-align:center;">
            <img
              src="${siteUrl}/logo.png"
              alt="Techon Partners"
              width="560"
              style="display:block;margin:0 auto;width:100%;max-width:560px;height:auto;max-height:220px;object-fit:cover;border:0;"
            />
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            <p style="margin:0 0 6px;color:#0f172a;font-size:18px;font-weight:600;">Hello ${clientName},</p>
            <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.7;">
              You've been invited to complete the <strong>Techon Partners Onboarding Questionnaire</strong>.
              This helps us understand your business and technology landscape so we can hit the ground running together.
            </p>

            <!-- Invite code box -->
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 28px;">
              <tr>
                <td style="background:#f8fafc;border:2px dashed #cbd5e1;border-radius:12px;padding:24px;text-align:center;">
                  <p style="margin:0 0 8px;color:#64748b;font-size:13px;font-weight:500;text-transform:uppercase;letter-spacing:1px;">Your Invitation Code</p>
                  <p style="margin:0;color:#0f172a;font-size:32px;font-weight:800;letter-spacing:10px;font-family:'Courier New',Courier,monospace;">${code}</p>
                </td>
              </tr>
            </table>

            <p style="margin:0 0 28px;color:#64748b;font-size:14px;line-height:1.6;">
              Enter this code at <a href="${siteUrl}/onboard" style="color:#2563eb;text-decoration:none;font-weight:500;">${siteUrl}/onboard</a> along with your email address, or click the button below to get started directly.
            </p>

            <!-- CTA button -->
            <table cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <td style="background:#2563eb;border-radius:10px;">
                  <a href="${inviteLink}" style="display:inline-block;padding:14px 36px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;letter-spacing:0.2px;">
                    Start Onboarding &rarr;
                  </a>
                </td>
              </tr>
            </table>

            <hr style="border:none;border-top:1px solid #e2e8f0;margin:36px 0;">

            <p style="margin:0;color:#94a3b8;font-size:12px;line-height:1.7;">
              If you weren't expecting this invitation, you can safely ignore this email.<br>
              &copy; ${new Date().getFullYear()} Techon Partners &middot;
              <a href="${siteUrl}" style="color:#94a3b8;text-decoration:none;">${siteUrl}</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}
