export type BaseKey = 'bin' | 'oct' | 'dec' | 'hex' | 'ascii'

export interface BaseConversion {
  bin: string
  oct: string
  dec: string
  hex: string
  ascii: string
}

export const EMPTY_CONVERSION: BaseConversion = {
  bin: '',
  oct: '',
  dec: '',
  hex: '',
  ascii: '',
}

export interface BaseField {
  key: BaseKey
  labelKey: string
  radix: number | null
  placeholder: string
}

export const FIELDS: BaseField[] = [
  { key: 'bin', labelKey: 'baseconverter.binary', radix: 2, placeholder: '0b' },
  { key: 'oct', labelKey: 'baseconverter.octal', radix: 8, placeholder: '0o' },
  { key: 'dec', labelKey: 'baseconverter.decimal', radix: 10, placeholder: '0' },
  { key: 'hex', labelKey: 'baseconverter.hexadecimal', radix: 16, placeholder: '0x' },
  { key: 'ascii', labelKey: 'baseconverter.ascii', radix: null, placeholder: 'A' },
]

const ASCII_MIN = 0
const UNICODE_MAX = 0x10ffff

export function convertFromAscii(char: string): BaseConversion {
  const code = char.charCodeAt(0)
  return {
    bin: code.toString(2),
    oct: code.toString(8),
    dec: code.toString(10),
    hex: code.toString(16).toUpperCase(),
    ascii: char,
  }
}

export function convertFromRadix(value: string, radix: number): BaseConversion | null {
  const parsed = parseInt(value, radix)
  if (isNaN(parsed)) return null
  return {
    bin: parsed.toString(2),
    oct: parsed.toString(8),
    dec: parsed.toString(10),
    hex: parsed.toString(16).toUpperCase(),
    ascii: parsed >= ASCII_MIN && parsed <= UNICODE_MAX ? String.fromCodePoint(parsed) : '',
  }
}
