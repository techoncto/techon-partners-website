import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { Resend } from 'resend'
import crypto from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
    }

    const normalised = email.trim().toLowerCase()

    // Always return success to avoid user enumeration
    const { data: client } = await supabaseAdmin
      .from('clients')
      .select('id, first_name')
      .eq('email', normalised)
      .single()

    if (client) {
      const token     = crypto.randomBytes(32).toString('hex')
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour

      // Invalidate any existing unused tokens for this client
      await supabaseAdmin
        .from('password_resets')
        .update({ used_at: new Date().toISOString() })
        .eq('client_id', client.id)
        .is('used_at', null)

      await supabaseAdmin
        .from('password_resets')
        .insert({ client_id: client.id, token, expires_at: expiresAt })

      const siteUrl   = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://techonpartners.com'
      const resetLink = `${siteUrl}/onboard/reset-password?token=${token}`

      await resend.emails.send({
        from:    'Techon Partners <onboarding@techonpartners.com>',
        to:      normalised,
        subject: 'Reset your Techon Partners password',
        html:    buildResetEmail({ firstName: client.first_name, resetLink, siteUrl }),
      })
    }

    // Always 200 so attackers can't enumerate emails
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Forgot password error:', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}

function buildResetEmail({
  firstName,
  resetLink,
  siteUrl,
}: {
  firstName: string
  resetLink: string
  siteUrl: string
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f1f5f9;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" role="presentation" style="max-width:560px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <tr>
          <td style="background:#0a1628;padding:28px 40px;text-align:center;">
            <img src="${siteUrl}/logo.png" alt="Techon Partners" width="240"
              style="display:block;margin:0 auto;max-width:240px;height:auto;border:0;" />
          </td>
        </tr>

        <tr>
          <td style="padding:40px;">
            <p style="margin:0 0 6px;color:#0f172a;font-size:18px;font-weight:600;">Hi ${firstName},</p>
            <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.7;">
              We received a request to reset your password. Click the button below — the link is valid for <strong>1 hour</strong>.
            </p>

            <table cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 28px;">
              <tr>
                <td style="background:#2563eb;border-radius:10px;">
                  <a href="${resetLink}"
                    style="display:inline-block;padding:14px 36px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;letter-spacing:0.2px;">
                    Reset Password &rarr;
                  </a>
                </td>
              </tr>
            </table>

            <p style="margin:0 0 24px;color:#64748b;font-size:13px;line-height:1.6;">
              If the button doesn't work, paste this link into your browser:<br>
              <a href="${resetLink}" style="color:#2563eb;word-break:break-all;">${resetLink}</a>
            </p>

            <p style="margin:0 0 0;color:#94a3b8;font-size:12px;line-height:1.7;">
              If you didn't request a password reset, you can safely ignore this email. Your password won't change.<br>
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
