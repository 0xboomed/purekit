const JSONLD_ID = 'tool-jsonld'

export interface ToolSeo {
  name: string
  description: string
  path: string
}

export function setToolJsonLd({ name, description, path }: ToolSeo): void {
  let script = document.getElementById(JSONLD_ID) as HTMLScriptElement | null
  if (!script) {
    script = document.createElement('script')
    script.id = JSONLD_ID
    script.type = 'application/ld+json'
    document.head.appendChild(script)
  }

  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `${name} - PureKit`,
    url: `https://purekit-app.vercel.app${path}`,
    description,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any (Web Browser)',
    browserRequirements: 'Requires JavaScript',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    isAccessibleForFree: true,
  }

  script.textContent = JSON.stringify(data)
}

export function clearToolJsonLd(): void {
  document.getElementById(JSONLD_ID)?.remove()
}
