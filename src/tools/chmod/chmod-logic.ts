export type Role = 'owner' | 'group' | 'other'
export type Perm = 'read' | 'write' | 'execute'

export const PERM_VALUES: Record<Perm, number> = { read: 4, write: 2, execute: 1 }
export const PERM_LETTERS: Record<Perm, string> = { read: 'r', write: 'w', execute: 'x' }
export const ROLES: Role[] = ['owner', 'group', 'other']
export const PERMS: Perm[] = ['read', 'write', 'execute']

export type Permissions = Record<Role, Record<Perm, boolean>>

export const EMPTY_PERMISSIONS: Permissions = {
  owner: { read: false, write: false, execute: false },
  group: { read: false, write: false, execute: false },
  other: { read: false, write: false, execute: false },
}

export function octalToPermissions(octal: string): Permissions {
  const perms: Permissions = {
    owner: { ...EMPTY_PERMISSIONS.owner },
    group: { ...EMPTY_PERMISSIONS.group },
    other: { ...EMPTY_PERMISSIONS.other },
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

export function permissionsToOctal(perms: Permissions): string {
  return ROLES.map((role) =>
    PERMS.reduce((sum, p) => sum + (perms[role][p] ? PERM_VALUES[p] : 0), 0),
  ).join('')
}

export function permissionsToSymbolic(perms: Permissions): string {
  return ROLES.map((role) =>
    PERMS.map((p) => (perms[role][p] ? PERM_LETTERS[p] : '-')).join(''),
  ).join('')
}

export function sanitizeOctal(value: string): string {
  return value.replace(/[^0-7]/g, '').slice(0, 3)
}
