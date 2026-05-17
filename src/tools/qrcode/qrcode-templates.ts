export type TemplateType = 'text' | 'url' | 'wifi' | 'vcard' | 'phone' | 'email'

export interface WifiFields {
  ssid: string
  password: string
  encryption: 'WPA' | 'WEP' | 'nopass'
}

export interface VcardFields {
  name: string
  phone: string
  email: string
  org: string
}

export interface EmailFields {
  to: string
  subject: string
  body: string
}

export function encodeWifi(fields: WifiFields): string {
  const { ssid, password, encryption } = fields
  if (!ssid.trim()) return ''
  return `WIFI:T:${encryption};S:${escapeSpecial(ssid)};P:${escapeSpecial(password)};;`
}

export function encodeVcard(fields: VcardFields): string {
  const { name, phone, email, org } = fields
  if (!name.trim()) return ''
  const parts = ['BEGIN:VCARD', 'VERSION:3.0']
  parts.push(`FN:${name}`)
  const [last, ...rest] = name.split(/\s+/)
  parts.push(`N:${last};${rest.join(' ')}`)
  if (phone) parts.push(`TEL:${phone}`)
  if (email) parts.push(`EMAIL:${email}`)
  if (org) parts.push(`ORG:${org}`)
  parts.push('END:VCARD')
  return parts.join('\n')
}

export function encodePhone(phone: string): string {
  if (!phone.trim()) return ''
  return `tel:${phone.trim()}`
}

export function encodeEmail(fields: EmailFields): string {
  const { to, subject, body } = fields
  if (!to.trim()) return ''
  let result = `mailto:${to.trim()}`
  const params: string[] = []
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`)
  if (body) params.push(`body=${encodeURIComponent(body)}`)
  if (params.length) result += '?' + params.join('&')
  return result
}

export function encodeUrl(url: string): string {
  if (!url.trim()) return ''
  const trimmed = url.trim()
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

function escapeSpecial(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/;/g, '\\;').replace(/:/g, '\\:').replace(/,/g, '\\,')
}
