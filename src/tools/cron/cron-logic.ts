import { CronExpressionParser } from 'cron-parser'

export interface CronParseResult {
  times: Date[]
  error: string | null
}

export function getNextExecutions(
  expr: string,
  count = 5,
  currentDate?: Date,
): CronParseResult {
  if (!expr.trim()) return { times: [], error: null }
  try {
    const interval = CronExpressionParser.parse(expr, currentDate ? { currentDate } : undefined)
    const times: Date[] = []
    for (let i = 0; i < count; i++) {
      times.push(interval.next().toDate())
    }
    return { times, error: null }
  } catch (e) {
    return { times: [], error: e instanceof Error ? e.message : String(e) }
  }
}
