## Commands

npm run dev          # Start dev server (localhost:5173)
npm run build        # TypeScript check + production build
npm run preview      # Preview production build

## What This Is

A zero-install, fully offline Markdown-to-PDF web tool. SPA built with Vite 6 + React 19 + TypeScript. All processing happens in-browser — no server, no uploads.

See @docs/requirements/04-需求规格书.md for full product spec.

## Architecture

```
src/
  components/        # UI components by feature area
    toolbar/         # Top bar (theme toggle, upload, export)
    editor-pane/     # CodeMirror 6 Markdown editor
    preview-pane/    # react-markdown live preview
    status-bar/      # Cursor position, auto-save indicator
    file-upload/     # Drag-drop + file picker
  stores/            # Zustand (slices pattern + persist middleware)
    slices/          # editor-slice.ts, ui-slice.ts
  hooks/             # Shared hooks (useDebounce, useFileUpload)
  lib/               # Pre-configured library instances
  styles/            # preview.css (GitHub-flavored), print.css (Phase 2)
```

Data flow: CodeMirror onChange → Zustand store → 200ms debounce → react-markdown renders.

## Code Conventions

- **Language**: TypeScript strict mode, no `any`
- **Imports**: Use `@/` path alias for cross-directory imports, relative for same-directory
- **State**: Zustand with slices pattern. Selectors for store reads — never `useAppStore()` without a selector
- **CSS**: Tailwind CSS v4 (CSS-first). No `tailwind.config.js`. Custom tokens in `@theme {}` blocks only
- **Components**: Named exports, one component per file. No default exports
- **Formatting**: No comments unless the WHY is non-obvious. No doc blocks

## Things That Will Bite You

- Tailwind v4 uses `@import "tailwindcss"` — do NOT use v3 directives (`@tailwind base;` etc.)
- No `tailwind.config.js` exists. All customization goes through CSS `@theme {}` blocks
- `@codemirror/language-data` bundles ALL language modes (~1.2MB). Lazy-loading optimization needed later
- CodeMirror 6 scroll container is `view.scrollDOM`, NOT the wrapper div
- `react-markdown` v10 requires React 18+; uses `Components` type for custom renderers
- Zustand v5 slices pattern requires `StateCreator<CombinedState, [], [], SliceState>` generics
- Preview rendering is debounced (200ms). The debounce hook is in `src/hooks/use-debounce.ts`

## Workflow

- Run `npx tsc -b` to typecheck after code changes
- Run `npm run build` to verify production build passes
- Git user is already configured per-repo
- 中文用于沟通和 UI，英文用于代码、commit message 和文件名
