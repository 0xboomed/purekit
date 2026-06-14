import { describe, it, expect } from 'vitest'
import { convertFromAscii, convertFromRadix } from './base-converter-logic'

describe('convertFromAscii', () => {
  it('converts uppercase A', () => {
    const result = convertFromAscii('A')
    expect(result.dec).toBe('65')
    expect(result.hex).toBe('41')
    expect(result.bin).toBe('1000001')
    expect(result.oct).toBe('101')
    expect(result.ascii).toBe('A')
  })

  it('converts lowercase a', () => {
    const result = convertFromAscii('a')
    expect(result.dec).toBe('97')
    expect(result.hex).toBe('61')
  })

  it('converts digit 0', () => {
    const result = convertFromAscii('0')
    expect(result.dec).toBe('48')
  })

  it('converts space character', () => {
    const result = convertFromAscii(' ')
    expect(result.dec).toBe('32')
    expect(result.ascii).toBe(' ')
  })

  it('hex output is uppercase', () => {
    const result = convertFromAscii('~')
    expect(result.dec).toBe('126')
    expect(result.hex).toBe('7E')
  })
})

describe('convertFromRadix', () => {
  it('parses decimal', () => {
    const result = convertFromRadix('255', 10)
    expect(result?.dec).toBe('255')
    expect(result?.hex).toBe('FF')
    expect(result?.bin).toBe('11111111')
  })

  it('parses hex (uppercase input)', () => {
    const result = convertFromRadix('FF', 16)
    expect(result?.dec).toBe('255')
  })

  it('parses hex (lowercase input)', () => {
    const result = convertFromRadix('ff', 16)
    expect(result?.dec).toBe('255')
  })

  it('parses binary', () => {
    const result = convertFromRadix('1010', 2)
    expect(result?.dec).toBe('10')
    expect(result?.hex).toBe('A')
  })

  it('parses octal', () => {
    const result = convertFromRadix('17', 8)
    expect(result?.dec).toBe('15')
  })

  it('converts number to ASCII when in range', () => {
    const result = convertFromRadix('65', 10)
    expect(result?.ascii).toBe('A')
  })

  it('returns empty ASCII for code point out of range', () => {
    const result = convertFromRadix('999999999', 10)
    expect(result?.ascii).toBe('')
  })

  it('returns null for invalid input in given radix', () => {
    expect(convertFromRadix('2', 2)).toBeNull()
    expect(convertFromRadix('G', 16)).toBeNull()
    expect(convertFromRadix('8', 8)).toBeNull()
  })
})
