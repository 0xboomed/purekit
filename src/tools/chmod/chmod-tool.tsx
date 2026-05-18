import { useState, useCallback, useEffect } from 'react'
import { ToolPage } from '@/components/shared/tool-page'
import { ToolCard } from '@/components/shared/tool-card'
import { CopyButton } from '@/components/shared/copy-button'
import { useT } from '@/i18n/context'

type Role = 'owner' | 'group' | 'other'
type Perm = 'read' | 'write' | 'execute'

const PERM_VALUES: Record<Perm, number> = { read: 4, write: 2, execute: 1 }
const PERM_LETTERS: Record<Perm, string> = { read: 'r', write: 'w', execute: 'x' }
const ROLES: Role[] = ['owner', 'group', 'other']
const PERMS: Perm[] = ['read', 'write', 'execute']
const PRESETS = [
  { octal: '755', label: '755' },
  { octal: '644', label: '644' },
  { octal: '777', label: '777' },
  { octal: '600', label: '600' },
  { octal: '700', label: '700' },
  { octal: '750', label: '750' },
]

function octalToPermissions(octal: string): Record<Role, Record<Perm, boolean>> {
  const perms: Record<Role, Record<Perm, boolean>> = {
    owner: { read: false, write: false, execute: false },
    group: { read: false, write: false, execute: false },
    other: { read: false, write: false, execute: false },
  }
  const digits = octal.padStart(3, '0').slice(0, 3).split('').map(Number)
  ROLES.forEach((role, i) => {
    const d = digits[i] ?? 0
    perms[role].read = !!(d & 4)
    perms[role].write = !!(d & 2)
    perms[role].execute = !!(d & 1)
  })
  return perms
}

function permissionsToOctal(perms: Record<Role, Record<Perm, boolean>>): string {
  return ROLES.map((role) =>
    PERMS.reduce((sum, p) => sum + (perms[role][p] ? PERM_VALUES[p] : 0), 0),
  ).join('')
}

function permissionsToSymbolic(perms: Record<Role, Record<Perm, boolean>>): string {
  return ROLES.map((role) =>
    PERMS.map((p) => (perms[role][p] ? PERM_LETTERS[p] : '-')).join(''),
  ).join('')
}

export default function ChmodTool() {
  const { t } = useT()
  const [perms, setPerms] = useState<Record<Role, Record<Perm, boolean>>>({
    owner: { read: true, write: true, execute: true },
    group: { read: true, write: false, execute: true },
    other: { read: true, write: false, execute: true },
  })
  const [octalInput, setOctalInput] = useState('755')

  const octal = permissionsToOctal(perms)
  const symbolic = permissionsToSymbolic(perms)

  const toggle = useCallback((role: Role, perm: Perm) => {
    setPerms((prev) => ({
      ...prev,
      [role]: { ...prev[role], [perm]: !prev[role][perm] },
    }))
  }, [])

  const applyOctal = useCallback((value: string) => {
    const clean = value.replace(/[^0-7]/g, '').slice(0, 3)
    setOctalInput(clean)
    if (clean.length === 3) {
      setPerms(octalToPermissions(clean))
    }
  }, [])

  const applyPreset = useCallback((octalStr: string) => {
    setOctalInput(octalStr)
    setPerms(octalToPermissions(octalStr))
  }, [])

  useEffect(() => {
    setOctalInput(octal)
  }, [octal])

  return (
    <ToolPage>
      <div className="mx-auto max-w-2xl space-y-4">
        {/* Output display */}
        <ToolCard>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div>
                <div className="text-xs text-gray-400">{t('chmod.octal')}</div>
                <code className="text-2xl font-bold tracking-wider text-gray-800 dark:text-gray-100">-{octal}</code>
              </div>
              <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />
              <div>
                <div className="text-xs text-gray-400">{t('chmod.symbolic')}</div>
                <code className="text-2xl font-bold tracking-wider text-gray-800 dark:text-gray-100">-{symbolic}</code>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CopyButton text={`-${octal}`} />
              <CopyButton text={`-${symbolic}`} />
            </div>
          </div>
        </ToolCard>

        {/* Octal input */}
        <ToolCard title={t('chmod.octalInput')}>
          <div className="flex items-center gap-2">
            <span className="text-lg font-mono text-gray-400">-</span>
            <input
              type="text"
              value={octalInput}
              onChange={(e) => applyOctal(e.target.value)}
              maxLength={3}
              placeholder="755"
              className="w-24 rounded-lg border border-border bg-white px-3 py-2 font-mono text-lg text-center text-gray-700 outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 dark:border-border-dark dark:bg-gray-900 dark:text-gray-200"
            />
          </div>
        </ToolCard>

        {/* Permission grid */}
        <ToolCard title={t('chmod.permissions')}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="pb-2 text-left text-xs font-medium text-gray-400" />
                  {PERMS.map((p) => (
                    <th key={p} className="pb-2 text-center text-xs font-medium uppercase text-gray-400">
                      {t(`chmod.perm_${p}`)}
                    </th>
                  ))}
                  <th className="pb-2 text-center text-xs font-medium text-gray-400">{t('chmod.value')}</th>
                </tr>
              </thead>
              <tbody>
                {ROLES.map((role) => (
                  <tr key={role}>
                    <td className="py-1.5 pr-3 text-sm font-medium text-gray-600 dark:text-gray-300">
                      {t(`chmod.role_${role}`)}
                    </td>
                    {PERMS.map((p) => (
                      <td key={p} className="py-1.5 text-center">
                        <button
                          onClick={() => toggle(role, p)}
                          className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                            perms[role][p]
                              ? 'bg-brand/10 text-brand dark:bg-brand/20'
                              : 'bg-gray-100 text-gray-300 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-600 dark:hover:bg-gray-700'
                          }`}
                        >
                          {perms[role][p] ? PERM_LETTERS[p] : '-'}
                        </button>
                      </td>
                    ))}
                    <td className="py-1.5 text-center font-mono text-sm text-gray-500">
                      {PERMS.reduce((sum, p) => sum + (perms[role][p] ? PERM_VALUES[p] : 0), 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ToolCard>

        {/* Presets */}
        <ToolCard title={t('chmod.presets')}>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.octal}
                onClick={() => applyPreset(preset.octal)}
                className={`rounded-lg px-4 py-2 font-mono text-sm font-medium transition-colors ${
                  octal === preset.octal
                    ? 'bg-brand text-white'
                    : 'border border-border bg-white text-gray-600 hover:bg-gray-50 dark:border-border-dark dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </ToolCard>
      </div>
    </ToolPage>
  )
}
