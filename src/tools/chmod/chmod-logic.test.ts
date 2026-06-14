import { describe, it, expect } from 'vitest'
import {
  octalToPermissions,
  permissionsToOctal,
  permissionsToSymbolic,
  sanitizeOctal,
} from './chmod-logic'

describe('octalToPermissions', () => {
  it('parses 755 correctly', () => {
    const perms = octalToPermissions('755')
    expect(perms.owner).toEqual({ read: true, write: true, execute: true })
    expect(perms.group).toEqual({ read: true, write: false, execute: true })
    expect(perms.other).toEqual({ read: true, write: false, execute: true })
  })

  it('parses 000 as no permissions', () => {
    const perms = octalToPermissions('000')
    expect(perms.owner).toEqual({ read: false, write: false, execute: false })
    expect(perms.group).toEqual({ read: false, write: false, execute: false })
    expect(perms.other).toEqual({ read: false, write: false, execute: false })
  })

  it('parses 777 as full permissions', () => {
    const perms = octalToPermissions('777')
    expect(perms.owner).toEqual({ read: true, write: true, execute: true })
    expect(perms.group).toEqual({ read: true, write: true, execute: true })
    expect(perms.other).toEqual({ read: true, write: true, execute: true })
  })

  it('parses 600 as owner read/write only', () => {
    const perms = octalToPermissions('600')
    expect(perms.owner).toEqual({ read: true, write: true, execute: false })
    expect(perms.group).toEqual({ read: false, write: false, execute: false })
    expect(perms.other).toEqual({ read: false, write: false, execute: false })
  })

  it('pads short octal strings with leading zeros', () => {
    const perms = octalToPermissions('7')
    expect(perms.owner).toEqual({ read: false, write: false, execute: false })
    expect(perms.group).toEqual({ read: false, write: false, execute: false })
    expect(perms.other).toEqual({ read: true, write: true, execute: true })
  })
})

describe('permissionsToOctal', () => {
  it('converts full owner permissions to 700 range', () => {
    const perms = octalToPermissions('755')
    expect(permissionsToOctal(perms)).toBe('755')
  })

  it('round-trips 777', () => {
    expect(permissionsToOctal(octalToPermissions('777'))).toBe('777')
  })

  it('round-trips 000', () => {
    expect(permissionsToOctal(octalToPermissions('000'))).toBe('000')
  })

  it('round-trips 644', () => {
    expect(permissionsToOctal(octalToPermissions('644'))).toBe('644')
  })
})

describe('permissionsToSymbolic', () => {
  it('converts 755 to rwxr-xr-x', () => {
    expect(permissionsToSymbolic(octalToPermissions('755'))).toBe('rwxr-xr-x')
  })

  it('converts 777 to rwxrwxrwx', () => {
    expect(permissionsToSymbolic(octalToPermissions('777'))).toBe('rwxrwxrwx')
  })

  it('converts 000 to ---------', () => {
    expect(permissionsToSymbolic(octalToPermissions('000'))).toBe('---------')
  })

  it('converts 600 to rw-------', () => {
    expect(permissionsToSymbolic(octalToPermissions('600'))).toBe('rw-------')
  })
})

describe('sanitizeOctal', () => {
  it('strips non-octal characters', () => {
    expect(sanitizeOctal('7a5b')).toBe('75')
  })

  it('strips digit 8 and 9 (invalid octal)', () => {
    expect(sanitizeOctal('789')).toBe('7')
  })

  it('limits to 3 digits', () => {
    expect(sanitizeOctal('7777')).toBe('777')
  })

  it('handles empty input', () => {
    expect(sanitizeOctal('')).toBe('')
  })
})
