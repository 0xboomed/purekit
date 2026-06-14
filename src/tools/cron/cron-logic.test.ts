import { describe, it, expect } from 'vitest'
import { getNextExecutions } from './cron-logic'

// Use UTC for deterministic results regardless of machine timezone
const FROM = new Date(Date.UTC(2026, 0, 1, 0, 0, 0))

describe('getNextExecutions', () => {
  it('returns empty result for empty input', () => {
    const result = getNextExecutions('', 5, FROM)
    expect(result.error).toBeNull()
    expect(result.times).toEqual([])
  })

  it('returns empty result for whitespace input', () => {
    const result = getNextExecutions('   ', 5, FROM)
    expect(result.times).toEqual([])
  })

  it('computes next 5 executions in ascending order', () => {
    const result = getNextExecutions('*/5 * * * *', 5, FROM)
    expect(result.error).toBeNull()
    expect(result.times).toHaveLength(5)
    for (let i = 1; i < result.times.length; i++) {
      expect(result.times[i]!.getTime()).toBeGreaterThan(result.times[i - 1]!.getTime())
    }
  })

  it('every-minute expression returns consecutive minutes', () => {
    const result = getNextExecutions('* * * * *', 3, FROM)
    expect(result.times).toHaveLength(3)
    const diffs = result.times.map((d) => d.getTime())
    expect(diffs[1]! - diffs[0]!).toBe(60_000)
    expect(diffs[2]! - diffs[1]!).toBe(60_000)
  })

  it('every-5-minutes expression steps by 5 minutes', () => {
    const result = getNextExecutions('*/5 * * * *', 2, FROM)
    const diff = result.times[1]!.getTime() - result.times[0]!.getTime()
    expect(diff).toBe(5 * 60_000)
  })

  it('daily expression advances by one day', () => {
    const result = getNextExecutions('0 0 * * *', 2, FROM)
    const diff = result.times[1]!.getTime() - result.times[0]!.getTime()
    expect(diff).toBe(24 * 60 * 60_000)
  })

  it('respects the count parameter', () => {
    const result = getNextExecutions('0 * * * *', 3, FROM)
    expect(result.times).toHaveLength(3)
  })

  it('returns error for invalid expression', () => {
    const result = getNextExecutions('not a cron', 5, FROM)
    expect(result.error).toBeTruthy()
    expect(result.times).toEqual([])
  })

  it('returns error for out-of-range fields', () => {
    const result = getNextExecutions('0 0 32 * *', 5, FROM)
    expect(result.error).toBeTruthy()
    expect(result.times).toEqual([])
  })

  it('defaults count to 5 when omitted', () => {
    const result = getNextExecutions('* * * * *', undefined, FROM)
    expect(result.times).toHaveLength(5)
  })
})
