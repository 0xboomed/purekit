/// <reference types="vite/client" />

declare module 'pagedjs' {
  export class Chunker {
    constructor(content: string, renderTo: HTMLElement, options?: Record<string, unknown>)
  }

  export class Polisher {
    constructor(options?: Record<string, unknown>)
  }

  export class Previewer {
    preview(
      content: string,
      stylesheets?: Array<{ url: string }>,
      renderTo?: HTMLElement,
      options?: Record<string, unknown>
    ): Promise<Chunker>
  }

  export class Handler {
    constructor(chunker: Chunker, polisher: Polisher, caller: unknown)
  }

  export function registerHandlers(handlers: Handler[]): void
  export function initializeHandlers(handlers: Handler[]): Handler[]
}
