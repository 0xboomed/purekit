import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorView, keymap } from '@codemirror/view'
import { useAppStore } from '@/stores/use-app-store'
import type { EditorView as EditorViewType } from '@codemirror/view'

function wrapSelection(view: EditorViewType, before: string, after: string) {
  const { from, to } = view.state.selection.main
  const selected = view.state.sliceDoc(from, to)
  view.dispatch({
    changes: { from, to, insert: before + selected + after },
    selection: { anchor: from + before.length, head: to + before.length },
  })
  return true
}

export function EditorPane() {
  const markdownContent = useAppStore((s) => s.markdownContent)
  const setMarkdownContent = useAppStore((s) => s.setMarkdownContent)
  const setCursorPosition = useAppStore((s) => s.setCursorPosition)
  const theme = useAppStore((s) => s.theme)

  const editorViewRef = useRef<EditorViewType | null>(null)
  const isSyncingScroll = useRef(false)

  const cursorListener = useMemo(
    () =>
      EditorView.updateListener.of((update) => {
        if (update.selectionSet || update.docChanged) {
          const head = update.state.selection.main.head
          const line = update.state.doc.lineAt(head)
          setCursorPosition(line.number, head - line.from + 1)
        }
      }),
    [setCursorPosition],
  )

  const markdownKeymap = useMemo(
    () =>
      keymap.of([
        {
          key: 'Mod-b',
          run: (view) => wrapSelection(view, '**', '**'),
        },
        {
          key: 'Mod-i',
          run: (view) => wrapSelection(view, '*', '*'),
        },
        {
          key: 'Mod-k',
          run: (view) => wrapSelection(view, '[', '](url)'),
        },
        {
          key: 'Mod-s',
          run: () => true, // Prevent browser save dialog
        },
      ]),
    [],
  )

  const extensions = useMemo(
    () => [
      markdown({ base: markdownLanguage, codeLanguages: languages }),
      EditorView.lineWrapping,
      cursorListener,
      markdownKeymap,
      ...(theme === 'dark' ? [oneDark] : []),
    ],
    [theme, cursorListener, markdownKeymap],
  )

  const onCreateEditor = useCallback((view: EditorViewType) => {
    editorViewRef.current = view
  }, [])

  const onChange = useCallback(
    (value: string) => {
      setMarkdownContent(value)
    },
    [setMarkdownContent],
  )

  // Synced scrolling: editor ↔ preview
  useEffect(() => {
    const view = editorViewRef.current
    if (!view) return

    const scroller = view.scrollDOM

    const handleEditorScroll = () => {
      if (isSyncingScroll.current) return
      isSyncingScroll.current = true

      const preview = document.querySelector('.preview-pane') as HTMLElement | null
      if (preview) {
        const ratio = scroller.scrollTop / (scroller.scrollHeight - scroller.clientHeight)
        preview.scrollTop = ratio * (preview.scrollHeight - preview.clientHeight)
      }

      requestAnimationFrame(() => {
        isSyncingScroll.current = false
      })
    }

    scroller.addEventListener('scroll', handleEditorScroll, { passive: true })
    return () => scroller.removeEventListener('scroll', handleEditorScroll)
  }, [markdownContent]) // Re-attach when editor is recreated

  useEffect(() => {
    const preview = document.querySelector('.preview-pane') as HTMLElement | null
    if (!preview) return

    const handlePreviewScroll = () => {
      if (isSyncingScroll.current) return
      const view = editorViewRef.current
      if (!view) return

      isSyncingScroll.current = true
      const scroller = view.scrollDOM
      const ratio = preview.scrollTop / (preview.scrollHeight - preview.clientHeight)
      scroller.scrollTop = ratio * (scroller.scrollHeight - scroller.clientHeight)

      requestAnimationFrame(() => {
        isSyncingScroll.current = false
      })
    }

    preview.addEventListener('scroll', handlePreviewScroll, { passive: true })
    return () => preview.removeEventListener('scroll', handlePreviewScroll)
  }, [])

  const [editorHeight, setEditorHeight] = useState('100%')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setEditorHeight(`${entry.contentRect.height}px`)
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="h-full">
      <CodeMirror
        value={markdownContent}
        height={editorHeight}
        theme={theme === 'dark' ? 'dark' : 'light'}
        extensions={extensions}
        onChange={onChange}
        onCreateEditor={onCreateEditor}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightSpecialChars: true,
          history: true,
          foldGutter: true,
          drawSelection: true,
          dropCursor: true,
          allowMultipleSelections: false,
          indentOnInput: true,
          syntaxHighlighting: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: false,
          rectangularSelection: false,
          crosshairCursor: false,
          highlightActiveLine: true,
          highlightSelectionMatches: true,
        }}
      />
    </div>
  )
}
