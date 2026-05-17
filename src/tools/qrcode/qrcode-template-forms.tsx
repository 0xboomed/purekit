import { useState, useEffect } from 'react'
import { useT } from '@/i18n/context'
import { ToolInput } from '@/components/shared/tool-input'
import { ToolSegmentedControl } from '@/components/shared/tool-segmented-control'
import type { TemplateType, WifiFields, VcardFields, EmailFields } from './qrcode-templates'
import { encodeWifi, encodeVcard, encodePhone, encodeEmail, encodeUrl } from './qrcode-templates'

const inputClass = 'w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-gray-700 outline-none transition-shadow focus:border-brand focus:ring-2 focus:ring-brand/15 dark:border-border-dark dark:bg-gray-900 dark:text-gray-200'
const labelClass = 'mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400'

function Field({ label, value, onChange, placeholder, type = 'text' }: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={inputClass} />
    </div>
  )
}

function TextForm({ onChange }: { onChange: (text: string) => void }) {
  const { t } = useT()
  const [text, setText] = useState('https://github.com')
  useEffect(() => { onChange(text) }, [text, onChange])
  return <ToolInput value={text} onChange={setText} placeholder={t('qrcode.inputPlaceholder')} mono={false} rows={3} />
}

function UrlForm({ onChange }: { onChange: (text: string) => void }) {
  const { t } = useT()
  const [url, setUrl] = useState('github.com')
  useEffect(() => { onChange(encodeUrl(url)) }, [url, onChange])
  return <Field label="URL" value={url} onChange={setUrl} placeholder={t('qrcode.urlPlaceholder')} />
}

function WifiForm({ onChange }: { onChange: (text: string) => void }) {
  const { t } = useT()
  const [fields, setFields] = useState<WifiFields>({ ssid: '', password: '', encryption: 'WPA' })
  useEffect(() => { onChange(encodeWifi(fields)) }, [fields, onChange])
  const update = (key: keyof WifiFields, val: string) => setFields((f) => ({ ...f, [key]: val }))
  return (
    <div className="space-y-3">
      <Field label={t('qrcode.wifiSsid')} value={fields.ssid} onChange={(v) => update('ssid', v)} />
      <Field label={t('qrcode.wifiPassword')} value={fields.password} onChange={(v) => update('password', v)} />
      <div>
        <label className={labelClass}>{t('qrcode.wifiEncryption')}</label>
        <select value={fields.encryption} onChange={(e) => update('encryption', e.target.value)} className={inputClass}>
          <option value="WPA">{t('qrcode.wifiWpa')}</option>
          <option value="WEP">{t('qrcode.wifiWep')}</option>
          <option value="nopass">{t('qrcode.wifiNone')}</option>
        </select>
      </div>
    </div>
  )
}

function VcardForm({ onChange }: { onChange: (text: string) => void }) {
  const { t } = useT()
  const [fields, setFields] = useState<VcardFields>({ name: '', phone: '', email: '', org: '' })
  useEffect(() => { onChange(encodeVcard(fields)) }, [fields, onChange])
  const update = (key: keyof VcardFields, val: string) => setFields((f) => ({ ...f, [key]: val }))
  return (
    <div className="space-y-3">
      <Field label={t('qrcode.vcardName')} value={fields.name} onChange={(v) => update('name', v)} />
      <Field label={t('qrcode.vcardPhone')} value={fields.phone} onChange={(v) => update('phone', v)} />
      <Field label={t('qrcode.vcardEmail')} value={fields.email} onChange={(v) => update('email', v)} />
      <Field label={t('qrcode.vcardOrg')} value={fields.org} onChange={(v) => update('org', v)} />
    </div>
  )
}

function PhoneForm({ onChange }: { onChange: (text: string) => void }) {
  const { t } = useT()
  const [phone, setPhone] = useState('')
  useEffect(() => { onChange(encodePhone(phone)) }, [phone, onChange])
  return <Field label={t('qrcode.phoneNumber')} value={phone} onChange={setPhone} placeholder={t('qrcode.phonePlaceholder')} />
}

function EmailForm({ onChange }: { onChange: (text: string) => void }) {
  const { t } = useT()
  const [fields, setFields] = useState<EmailFields>({ to: '', subject: '', body: '' })
  useEffect(() => { onChange(encodeEmail(fields)) }, [fields, onChange])
  const update = (key: keyof EmailFields, val: string) => setFields((f) => ({ ...f, [key]: val }))
  return (
    <div className="space-y-3">
      <Field label={t('qrcode.emailTo')} value={fields.to} onChange={(v) => update('to', v)} />
      <Field label={t('qrcode.emailSubject')} value={fields.subject} onChange={(v) => update('subject', v)} />
      <Field label={t('qrcode.emailBody')} value={fields.body} onChange={(v) => update('body', v)} />
    </div>
  )
}

const FORMS: Record<TemplateType, React.FC<{ onChange: (text: string) => void }>> = {
  text: TextForm,
  url: UrlForm,
  wifi: WifiForm,
  vcard: VcardForm,
  phone: PhoneForm,
  email: EmailForm,
}

export function TemplateInput({ template, onTemplateChange, onChange }: { template: TemplateType; onTemplateChange: (t: TemplateType) => void; onChange: (text: string) => void }) {
  const { t } = useT()
  const Form = FORMS[template]
  const templates: TemplateType[] = ['text', 'url', 'wifi', 'vcard', 'phone', 'email']
  return (
    <div>
      <label className={labelClass}>{t('qrcode.template')}</label>
      <ToolSegmentedControl
        options={templates.map((tpl) => ({
          value: tpl,
          label: t(`qrcode.template${tpl.charAt(0).toUpperCase() + tpl.slice(1)}` as `qrcode.template${string}`),
        }))}
        value={template}
        onChange={onTemplateChange}
      />
      <div className="mt-3">
        <Form onChange={onChange} />
      </div>
    </div>
  )
}
