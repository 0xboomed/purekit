import { describe, it, expect } from 'vitest'
import { parseUrl } from './url-parser-logic'

describe('parseUrl', () => {
  it('parses a full URL with all components', () => {
    const { data, isError } = parseUrl('https://example.com:8080/path/to/page?a=1&b=2#section')
    expect(isError).toBe(false)
    expect(data?.protocol).toBe('https:')
    expect(data?.hostname).toBe('example.com')
    expect(data?.port).toBe('8080')
    expect(data?.pathname).toBe('/path/to/page')
    expect(data?.hash).toBe('#section')
    expect(data?.params).toEqual([
      { key: 'a', value: '1' },
      { key: 'b', value: '2' },
    ])
  })

  it('preserves order of query params', () => {
    const { data } = parseUrl('https://x.com/?zebra=1&apple=2&mango=3')
    expect(data?.params.map((p) => p.key)).toEqual(['zebra', 'apple', 'mango'])
  })

  it('handles URL with no path', () => {
    const { data } = parseUrl('https://example.com')
    expect(data?.pathname).toBe('/')
    expect(data?.params).toEqual([])
  })

  it('handles URL with no query params', () => {
    const { data } = parseUrl('https://example.com/path')
    expect(data?.params).toEqual([])
    expect(data?.hash).toBe('')
  })

  it('handles URL with hash only', () => {
    const { data } = parseUrl('https://example.com/path#anchor')
    expect(data?.hash).toBe('#anchor')
  })

  it('handles default ports (empty string)', () => {
    const { data } = parseUrl('https://example.com/path')
    expect(data?.port).toBe('')
  })

  it('decodes encoded query values', () => {
    const { data } = parseUrl('https://example.com/?q=hello%20world')
    expect(data?.params[0]?.value).toBe('hello world')
  })

  it('returns error flag for invalid input', () => {
    expect(parseUrl('not a url').isError).toBe(true)
    expect(parseUrl('://missing-protocol').isError).toBe(true)
  })

  it('returns no error for empty input (not parsed)', () => {
    const result = parseUrl('   ')
    expect(result.isError).toBe(false)
    expect(result.data).toBeNull()
  })

  it('requires a protocol (relative URLs are invalid for URL constructor)', () => {
    expect(parseUrl('example.com/path').isError).toBe(true)
  })
})
