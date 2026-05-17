import QRCode from 'qrcode'

export type DotStyle = 'square' | 'rounded' | 'circle' | 'diamond'

export interface GradientConfig {
  colors: [string, string]
  angle: number // degrees, 0=top-to-bottom
}

export interface RenderOptions {
  size: number
  margin: number
  fg: string
  bg: string
  dotStyle: DotStyle
  gradient?: GradientConfig | null
}

// QR spec byte-mode capacity per version per error correction level
const CAPACITY_TABLE: Record<number, Record<string, number>> = {
  1: { L: 17, M: 14, Q: 11, H: 7 },
  2: { L: 32, M: 26, Q: 20, H: 14 },
  3: { L: 53, M: 42, Q: 32, H: 24 },
  4: { L: 78, M: 62, Q: 46, H: 34 },
  5: { L: 106, M: 84, Q: 60, H: 44 },
  6: { L: 134, M: 106, Q: 74, H: 58 },
  7: { L: 154, M: 122, Q: 86, H: 64 },
  8: { L: 192, M: 152, Q: 108, H: 84 },
  9: { L: 230, M: 180, Q: 130, H: 98 },
  10: { L: 271, M: 213, Q: 151, H: 119 },
  11: { L: 321, M: 251, Q: 177, H: 137 },
  12: { L: 367, M: 287, Q: 203, H: 155 },
  13: { L: 425, M: 331, Q: 241, H: 177 },
  14: { L: 458, M: 362, Q: 258, H: 194 },
  15: { L: 520, M: 412, Q: 292, H: 220 },
  16: { L: 586, M: 450, Q: 322, H: 250 },
  17: { L: 644, M: 504, Q: 364, H: 280 },
  18: { L: 718, M: 560, Q: 394, H: 310 },
  19: { L: 792, M: 624, Q: 442, H: 338 },
  20: { L: 858, M: 666, Q: 482, H: 382 },
  21: { L: 929, M: 711, Q: 509, H: 403 },
  22: { L: 1003, M: 779, Q: 565, H: 439 },
  23: { L: 1091, M: 857, Q: 611, H: 461 },
  24: { L: 1171, M: 911, Q: 661, H: 511 },
  25: { L: 1273, M: 997, Q: 715, H: 535 },
  26: { L: 1367, M: 1059, Q: 751, H: 593 },
  27: { L: 1465, M: 1125, Q: 805, H: 625 },
  28: { L: 1528, M: 1190, Q: 868, H: 658 },
  29: { L: 1628, M: 1264, Q: 908, H: 698 },
  30: { L: 1732, M: 1370, Q: 982, H: 742 },
  31: { L: 1840, M: 1452, Q: 1030, H: 790 },
  32: { L: 1952, M: 1538, Q: 1112, H: 842 },
  33: { L: 2068, M: 1628, Q: 1168, H: 898 },
  34: { L: 2188, M: 1722, Q: 1228, H: 958 },
  35: { L: 2303, M: 1809, Q: 1283, H: 983 },
  36: { L: 2431, M: 1911, Q: 1351, H: 1051 },
  37: { L: 2563, M: 1989, Q: 1423, H: 1093 },
  38: { L: 2699, M: 2099, Q: 1499, H: 1139 },
  39: { L: 2809, M: 2213, Q: 1579, H: 1219 },
  40: { L: 2953, M: 2331, Q: 1663, H: 1273 },
}

export interface CapacityInfo {
  used: number
  total: number
  version: number
  percent: number
}

export function getCapacityInfo(text: string, level: string): CapacityInfo | null {
  if (!text) return null
  try {
    const qr = QRCode.create(text, { errorCorrectionLevel: level as 'L' | 'M' | 'Q' | 'H' })
    const used = new TextEncoder().encode(text).length
    const total = CAPACITY_TABLE[qr.version]?.[level] ?? 0
    return { used, total, version: qr.version, percent: total > 0 ? (used / total) * 100 : 100 }
  } catch {
    return null
  }
}

export function getBitMatrix(text: string, level: string) {
  return QRCode.create(text, { errorCorrectionLevel: level as 'L' | 'M' | 'Q' | 'H' })
}

function drawModule(
  ctx: CanvasRenderingContext2D,
  row: number,
  col: number,
  cellSize: number,
  margin: number,
  style: DotStyle,
) {
  const x = col * cellSize + margin
  const y = row * cellSize + margin
  const s = cellSize

  switch (style) {
    case 'square':
      ctx.fillRect(x, y, s, s)
      break
    case 'rounded': {
      const r = s * 0.3
      ctx.beginPath()
      ctx.roundRect(x, y, s, s, r)
      ctx.fill()
      break
    }
    case 'circle': {
      const r = s * 0.45
      ctx.beginPath()
      ctx.arc(x + s / 2, y + s / 2, r, 0, Math.PI * 2)
      ctx.fill()
      break
    }
    case 'diamond': {
      const cx = x + s / 2
      const cy = y + s / 2
      const half = s * 0.5
      ctx.beginPath()
      ctx.moveTo(cx, cy - half)
      ctx.lineTo(cx + half, cy)
      ctx.lineTo(cx, cy + half)
      ctx.lineTo(cx - half, cy)
      ctx.closePath()
      ctx.fill()
      break
    }
  }
}

export function renderToCanvas(
  canvas: HTMLCanvasElement,
  text: string,
  level: string,
  opts: RenderOptions,
  logo?: HTMLImageElement | null,
): void {
  const qr = QRCode.create(text, { errorCorrectionLevel: level as 'L' | 'M' | 'Q' | 'H' })
  const modules = qr.modules
  const count = modules.size
  const cellSize = (opts.size - opts.margin * 2) / count

  canvas.width = opts.size
  canvas.height = opts.size

  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = opts.bg
  ctx.fillRect(0, 0, opts.size, opts.size)

  if (opts.gradient) {
    const angle = (opts.gradient.angle - 90) * Math.PI / 180
    const cx = opts.size / 2
    const cy = opts.size / 2
    const len = opts.size / 2
    const grad = ctx.createLinearGradient(
      cx - Math.cos(angle) * len,
      cy - Math.sin(angle) * len,
      cx + Math.cos(angle) * len,
      cy + Math.sin(angle) * len,
    )
    grad.addColorStop(0, opts.gradient.colors[0])
    grad.addColorStop(1, opts.gradient.colors[1])
    ctx.fillStyle = grad
  } else {
    ctx.fillStyle = opts.fg
  }

  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      if (modules.get(row, col)) {
        drawModule(ctx, row, col, cellSize, opts.margin, opts.dotStyle)
      }
    }
  }

  if (logo) {
    const logoSize = opts.size * 0.2
    const padding = logoSize * 0.15
    const totalSize = logoSize + padding * 2
    const x = (opts.size - totalSize) / 2
    const y = (opts.size - totalSize) / 2

    ctx.fillStyle = opts.bg
    ctx.beginPath()
    ctx.roundRect(x, y, totalSize, totalSize, padding * 0.5)
    ctx.fill()

    ctx.drawImage(logo, x + padding, y + padding, logoSize, logoSize)
  }
}

function svgModule(
  row: number,
  col: number,
  cellSize: number,
  margin: number,
  style: DotStyle,
  fill: string,
): string {
  const x = col * cellSize + margin
  const y = row * cellSize + margin
  const s = cellSize

  switch (style) {
    case 'square':
      return `<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="${fill}"/>`
    case 'rounded': {
      const r = s * 0.3
      return `<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="${r}" fill="${fill}"/>`
    }
    case 'circle': {
      const r = s * 0.45
      return `<circle cx="${x + s / 2}" cy="${y + s / 2}" r="${r}" fill="${fill}"/>`
    }
    case 'diamond': {
      const cx = x + s / 2
      const cy = y + s / 2
      const half = s * 0.5
      return `<polygon points="${cx},${cy - half} ${cx + half},${cy} ${cx},${cy + half} ${cx - half},${cy}" fill="${fill}"/>`
    }
  }
}

export function renderToSvg(
  text: string,
  level: string,
  opts: RenderOptions,
  logoDataUrl?: string | null,
): string {
  const qr = QRCode.create(text, { errorCorrectionLevel: level as 'L' | 'M' | 'Q' | 'H' })
  const modules = qr.modules
  const count = modules.size
  const cellSize = (opts.size - opts.margin * 2) / count

  const useGrad = !!opts.gradient
  let defs = ''
  let fill = opts.fg

  if (useGrad && opts.gradient) {
    const angle = (opts.gradient.angle - 90) * Math.PI / 180
    const cx = opts.size / 2
    const cy = opts.size / 2
    const len = opts.size / 2
    const x1 = cx - Math.cos(angle) * len
    const y1 = cy - Math.sin(angle) * len
    const x2 = cx + Math.cos(angle) * len
    const y2 = cy + Math.sin(angle) * len
    defs = `<defs><linearGradient id="fgGrad" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" gradientUnits="userSpaceOnUse">` +
      `<stop offset="0%" stop-color="${opts.gradient.colors[0]}"/>` +
      `<stop offset="100%" stop-color="${opts.gradient.colors[1]}"/>` +
      `</linearGradient></defs>`
    fill = 'url(#fgGrad)'
  }

  let elements = ''
  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      if (modules.get(row, col)) {
        elements += svgModule(row, col, cellSize, opts.margin, opts.dotStyle, fill)
      }
    }
  }

  let logoSvg = ''
  if (logoDataUrl) {
    const logoSize = opts.size * 0.2
    const padding = logoSize * 0.15
    const totalSize = logoSize + padding * 2
    const x = (opts.size - totalSize) / 2
    const y = (opts.size - totalSize) / 2
    logoSvg = `<rect x="${x}" y="${y}" width="${totalSize}" height="${totalSize}" rx="${padding * 0.5}" fill="${opts.bg}"/>` +
      `<image x="${x + padding}" y="${y + padding}" width="${logoSize}" height="${logoSize}" href="${logoDataUrl}"/>`
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${opts.size} ${opts.size}" width="${opts.size}" height="${opts.size}">` +
    defs +
    `<rect width="${opts.size}" height="${opts.size}" fill="${opts.bg}"/>` +
    elements +
    logoSvg +
    `</svg>`
}
