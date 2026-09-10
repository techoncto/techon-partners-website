import { readFile } from 'node:fs/promises'
import path from 'node:path'

export const EMAIL_LOGO_CID = 'tp-logo'

export function emailLogoSrc() {
  return `cid:${EMAIL_LOGO_CID}`
}

export async function getEmailLogoAttachment() {
  try {
    const content = await readFile(path.join(process.cwd(), 'public', 'logo.png'))
    return {
      filename: 'logo.png',
      content,
      contentId: EMAIL_LOGO_CID,
      contentType: 'image/png',
    }
  } catch (err) {
    console.error('Email logo attachment missing:', err)
    return null
  }
}
