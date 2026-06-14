import { describe, it, expect } from 'vitest'
import {
  timestampToMs,
  isValidTimestamp,
  dateStringToTimestamp,
  getRelative,
} from './timestamp-logic'

const NOW = Date.UTC(2026, 0, 1, 12, 0, 0)

describe('timestampToMs', () => {
  it('passes through milliseconds', () => {
    expect(timestampToMs(1700000000000, 'ms')).toBe(1700000000000)
  })

  it('converts seconds to ms', () => {
    expect(timestampToMs(1700000000, 's')).toBe(1700000000000)
  })
})

describe('isValidTimestamp', () => {
  it('accepts a valid seconds timestamp', () => {
    expect(isValidTimestamp(1700000000, 's')).toBe(true)
  })

  it('accepts a valid ms timestamp', () => {
    expect(isValidTimestamp(1700000000000, 'ms')).toBe(true)
  })

  it('rejects wildly out-of-range timestamps', () => {
    expect(isValidTimestamp(1e20, 's')).toBe(false)
    expect(isValidTimestamp(NaN, 'ms')).toBe(false)
  })
})

describe('dateStringToTimestamp', () => {
  it('converts ISO date string to ms', () => {
    const ts = dateStringToTimestamp('2026-01-01T12:00:00Z', 'ms')
    expect(ts).toBe(Date.UTC(2026, 0, 1, 12, 0, 0))
  })

  it('converts ISO date string to seconds', () => {
    const ts = dateStringToTimestamp('2026-01-01T12:00:00Z', 's')
    expect(ts).toBe(Math.floor(Date.UTC(2026, 0, 1, 12, 0, 0) / 1000))
  })

  it('returns null for invalid date string', () => {
    expect(dateStringToTimestamp('not a date', 's')).toBeNull()
    expect(dateStringToTimestamp('', 'ms')).toBeNull()
  })
})

describe('getRelative', () => {
  it('reports seconds bucket for recent past', () => {
    const result = getRelative(NOW - 30_000, NOW)
    expect(result.bucket).toBe('seconds')
    expect(result.value).toBe(30)
    expect(result.isFuture).toBe(false)
  })

  it('reports minutes bucket', () => {
    const result = getRelative(NOW - 5 * 60_000, NOW)
    expect(result.bucket).toBe('minutes')
    expect(result.value).toBe(5)
    expect(result.isFuture).toBe(false)
  })

  it('reports hours bucket', () => {
    const result = getRelative(NOW - 3 * 3_600_000, NOW)
    expect(result.bucket).toBe('hours')
    expect(result.value).toBe(3)
  })

  it('reports days bucket for large diffs', () => {
    const result = getRelative(NOW - 2 * 86_400_000, NOW)
    expect(result.bucket).toBe('days')
    expect(result.value).toBe(2)
  })

  it('marks future timestamps correctly', () => {
    const result = getRelative(NOW + 5 * 60_000, NOW)
    expect(result.isFuture).toBe(true)
    expect(result.bucket).toBe('minutes')
  })

  it('returns seconds bucket for exactly now', () => {
    const result = getRelative(NOW, NOW)
    expect(result.bucket).toBe('seconds')
    expect(result.value).toBe(0)
    expect(result.isFuture).toBe(false)
  })
})
