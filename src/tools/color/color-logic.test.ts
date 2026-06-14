import { describe, it, expect } from 'vitest'
import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  relativeLuminance,
  contrastRatio,
} from './color-logic'

describe('hexToRgb', () => {
  it('parses 6-digit hex', () => {
    expect(hexToRgb('#3b82f6')).toEqual({ r: 59, g: 130, b: 246 })
  })

  it('parses without hash', () => {
    expect(hexToRgb('ffffff')).toEqual({ r: 255, g: 255, b: 255 })
  })

  it('parses uppercase', () => {
    expect(hexToRgb('#FF8800')).toEqual({ r: 255, g: 136, b: 0 })
  })

  it('returns null for invalid input', () => {
    expect(hexToRgb('#fff')).toBeNull()
    expect(hexToRgb('xyz')).toBeNull()
    expect(hexToRgb('')).toBeNull()
  })
})

describe('rgbToHex', () => {
  it('converts to hex with padding', () => {
    expect(rgbToHex({ r: 0, g: 0, b: 0 })).toBe('#000000')
    expect(rgbToHex({ r: 255, g: 255, b: 255 })).toBe('#ffffff')
  })

  it('rounds fractional values', () => {
    expect(rgbToHex({ r: 59.6, g: 130.2, b: 246 })).toBe('#3c82f6')
  })
})

describe('rgbToHsl', () => {
  it('converts pure red', () => {
    expect(rgbToHsl({ r: 255, g: 0, b: 0 })).toEqual({ h: 0, s: 100, l: 50 })
  })

  it('converts white (achromatic)', () => {
    expect(rgbToHsl({ r: 255, g: 255, b: 255 })).toEqual({ h: 0, s: 0, l: 100 })
  })

  it('converts black (achromatic)', () => {
    expect(rgbToHsl({ r: 0, g: 0, b: 0 })).toEqual({ h: 0, s: 0, l: 0 })
  })

  it('converts green to hue 120', () => {
    expect(rgbToHsl({ r: 0, g: 255, b: 0 })).toEqual({ h: 120, s: 100, l: 50 })
  })

  it('converts blue to hue 240', () => {
    expect(rgbToHsl({ r: 0, g: 0, b: 255 })).toEqual({ h: 240, s: 100, l: 50 })
  })
})

describe('hslToRgb', () => {
  it('converts red from hsl', () => {
    expect(hslToRgb({ h: 0, s: 100, l: 50 })).toEqual({ r: 255, g: 0, b: 0 })
  })

  it('converts achromatic white', () => {
    expect(hslToRgb({ h: 0, s: 0, l: 100 })).toEqual({ r: 255, g: 255, b: 255 })
  })

  it('converts achromatic black', () => {
    expect(hslToRgb({ h: 0, s: 0, l: 0 })).toEqual({ r: 0, g: 0, b: 0 })
  })

  it('converts green from hsl', () => {
    expect(hslToRgb({ h: 120, s: 100, l: 50 })).toEqual({ r: 0, g: 255, b: 0 })
  })
})

describe('rgbToHsl <-> hslToRgb round-trip', () => {
  it('round-trips mid-gray', () => {
    const rgb = { r: 128, g: 128, b: 128 }
    const hsl = rgbToHsl(rgb)
    const back = hslToRgb(hsl)
    expect(back.r).toBeGreaterThan(125)
    expect(back.r).toBeLessThan(131)
  })
})

describe('relativeLuminance', () => {
  it('white has luminance 1', () => {
    expect(relativeLuminance({ r: 255, g: 255, b: 255 })).toBeCloseTo(1, 2)
  })

  it('black has luminance 0', () => {
    expect(relativeLuminance({ r: 0, g: 0, b: 0 })).toBeCloseTo(0, 2)
  })
})

describe('contrastRatio', () => {
  it('identical colors have ratio 1', () => {
    expect(contrastRatio({ r: 100, g: 100, b: 100 }, { r: 100, g: 100, b: 100 })).toBeCloseTo(1, 2)
  })

  it('black vs white has ratio 21', () => {
    expect(contrastRatio({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 })).toBeCloseTo(21, 0)
  })

  it('is symmetric', () => {
    const a = { r: 59, g: 130, b: 246 }
    const b = { r: 255, g: 255, b: 255 }
    expect(contrastRatio(a, b)).toBeCloseTo(contrastRatio(b, a), 5)
  })
})
