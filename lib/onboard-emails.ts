export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function formatAnswerValue(value: unknown): string {
  if (value == null || value === '') return '—'

  if (Array.isArray(value)) {
    return value.length > 0 ? value.map(item => String(item)).join(', ') : '—'
  }

  if (typeof value === 'object') {
    const composite = value as {
      selected?: unknown
      followUps?: Record<string, string>
      followUp?: string
    }

    if (Array.isArray(composite.selected)) {
      if (composite.selected.length === 0) return '—'
      return composite.selected
        .map(label => {
          const extra = composite.followUps?.[String(label)]
          return extra ? `${label}: ${extra}` : String(label)
        })
        .join('\n')
    }

    if (typeof composite.selected === 'string') {
      return composite.followUp
        ? `${composite.selected}: ${composite.followUp}`
        : composite.selected || '—'
    }
  }

  return String(value)
}

export function buildClientSubmittedEmail({
  firstName,
  siteUrl,
}: {
  firstName: string
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
          <td style="background:#0a1628;padding:0;text-align:center;">
            <img src="cid:tp-logo" alt="Techon Partners" width="560"
              style="display:block;margin:0 auto;width:100%;max-width:560px;height:auto;max-height:200px;object-fit:cover;border:0;" />
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <p style="margin:0 0 6px;color:#0f172a;font-size:18px;font-weight:600;">Hi ${escapeHtml(firstName)},</p>
            <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.7;">
              We received your onboarding questionnaire. Thank you — our team will review your responses and follow up soon.
            </p>
            <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.7;">
              You can still complete the <strong>Budget Audit</strong> and <strong>Team Resources</strong> sections if you have not already:
            </p>
            <table cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 12px;">
              <tr>
                <td style="background:#2563eb;border-radius:10px;">
                  <a href="${siteUrl}/onboard/budget-audit"
                    style="display:inline-block;padding:12px 28px;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;">
                    Budget Audit &rarr;
                  </a>
                </td>
              </tr>
            </table>
            <table cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 28px;">
              <tr>
                <td style="background:#2563eb;border-radius:10px;">
                  <a href="${siteUrl}/onboard/team"
                    style="display:inline-block;padding:12px 28px;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;">
                    Team Resources &rarr;
                  </a>
                </td>
              </tr>
            </table>
            <p style="margin:0;color:#94a3b8;font-size:12px;line-height:1.7;">
              Questions? Reply to this email or write us at
              <a href="mailto:onboarding@techonpartners.com" style="color:#94a3b8;">onboarding@techonpartners.com</a>.<br>
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

export interface SubmittedAnswerSection {
  partName: string
  categoryName: string
  items: { label: string; value: string }[]
}

export function buildInternalSubmittedEmail({
  firstName,
  lastName,
  email,
  companyName,
  siteUrl,
  sections,
}: {
  firstName: string
  lastName: string
  email: string
  companyName: string | null
  siteUrl: string
  sections: SubmittedAnswerSection[]
}): string {
  const fullName = escapeHtml(`${firstName} ${lastName}`.trim())
  const company = companyName ? escapeHtml(companyName) : '—'
  const safeEmail = escapeHtml(email)

  const sectionsHtml = sections
    .map(section => {
      const rows = section.items
        .map(item => `
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;vertical-align:top;width:42%;">
              <p style="margin:0;color:#64748b;font-size:12px;line-height:1.5;">${escapeHtml(item.label)}</p>
            </td>
            <td style="padding:10px 0 10px 16px;border-bottom:1px solid #e2e8f0;vertical-align:top;">
              <p style="margin:0;color:#0f172a;font-size:13px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(item.value)}</p>
            </td>
          </tr>`)
        .join('')

      return `
        <p style="margin:28px 0 8px;color:#2563eb;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;">
          ${escapeHtml(section.partName)}
        </p>
        <p style="margin:0 0 8px;color:#0f172a;font-size:16px;font-weight:600;">${escapeHtml(section.categoryName)}</p>
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">${rows}</table>`
    })
    .join('')

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f1f5f9;padding:40px 0;">
    <tr><td align="center">
      <table width="640" cellpadding="0" cellspacing="0" role="presentation" style="max-width:640px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:#0a1628;padding:24px 32px;">
            <p style="margin:0;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:1px;">New submission</p>
            <p style="margin:6px 0 0;color:#ffffff;font-size:20px;font-weight:700;">Onboarding questionnaire completed</p>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 6px;color:#0f172a;font-size:16px;font-weight:600;">${fullName}</p>
            <p style="margin:0 0 4px;color:#475569;font-size:14px;">${company}</p>
            <p style="margin:0 0 24px;color:#475569;font-size:14px;">
              <a href="mailto:${safeEmail}" style="color:#2563eb;text-decoration:none;">${safeEmail}</a>
            </p>
            <table cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 8px;">
              <tr>
                <td style="background:#2563eb;border-radius:10px;">
                  <a href="${siteUrl}/admin"
                    style="display:inline-block;padding:12px 28px;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;">
                    Open admin dashboard &rarr;
                  </a>
                </td>
              </tr>
            </table>
            ${sectionsHtml}
            <p style="margin:32px 0 0;color:#94a3b8;font-size:12px;line-height:1.7;">
              &copy; ${new Date().getFullYear()} Techon Partners
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}
