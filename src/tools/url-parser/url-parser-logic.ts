export interface ParsedUrl {
  protocol: string
  hostname: string
  port: string
  pathname: string
  hash: string
  params: Array<{ key: string; value: string }>
}

export interface ParseResult {
  data: ParsedUrl | null
  isError: boolean
}

export function parseUrl(input: string): ParseResult {
  if (!input.trim()) return { data: null, isError: false }
  try {
    const url = new URL(input)
    const params: Array<{ key: string; value: string }> = []
    url.searchParams.forEach((value, key) => {
      params.push({ key, value })
    })
    return {
      data: {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port,
        pathname: url.pathname,
        hash: url.hash,
        params,
      },
      isError: false,
    }
  } catch {
    return { data: null, isError: true }
  }
}
