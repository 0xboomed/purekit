export type TimestampUnit = 's' | 'ms'

export type RelativeBucket = 'seconds' | 'minutes' | 'hours' | 'days'

export function timestampToMs(ts: number, unit: TimestampUnit): number {
  return unit === 'ms' ? ts : ts * 1000
}

export function isValidTimestamp(ts: number, unit: TimestampUnit): boolean {
  const ms = timestampToMs(ts, unit)
  const d = new Date(ms)
  return !isNaN(d.getTime())
}

export function dateStringToTimestamp(dateStr: string, unit: TimestampUnit): number | null {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return null
  return unit === 'ms' ? d.getTime() : Math.floor(d.getTime() / 1000)
}

export interface RelativeResult {
  value: number
  bucket: RelativeBucket
  isFuture: boolean
}

export function getRelative(ms: number, nowMs: number): RelativeResult {
  const diff = nowMs - ms
  const abs = Math.abs(diff)
  const isFuture = diff < 0

  if (abs < 60_000) return { value: Math.floor(abs / 1000), bucket: 'seconds', isFuture }
  if (abs < 3_600_000) return { value: Math.floor(abs / 60_000), bucket: 'minutes', isFuture }
  if (abs < 86_400_000) return { value: Math.floor(abs / 3_600_000), bucket: 'hours', isFuture }
  return { value: Math.floor(abs / 86_400_000), bucket: 'days', isFuture }
}
