'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export function helpUsesPopover(text: string) {
  return text.includes('\n')
}

function HelpBody({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/[^\s]+)/g)
  return (
    <>
      {parts.map((part, index) =>
        /^https?:\/\//.test(part) ? (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline break-all hover:text-blue-800"
          >
            {part.replace(/^https?:\/\/(www\.)?/, '')}
          </a>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  )
}

export function QuestionHelp({ text }: { text: string }) {
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 360 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLSpanElement>(null)

  function updatePosition() {
    const button = buttonRef.current
    if (!button) return
    const rect = button.getBoundingClientRect()
    const margin = 16
    const width = Math.min(360, window.innerWidth - margin * 2)
    let left = rect.left
    if (left + width > window.innerWidth - margin) {
      left = window.innerWidth - margin - width
    }
    if (left < margin) left = margin
    setCoords({ top: rect.bottom + 8, left, width })
  }

  useLayoutEffect(() => {
    if (!open) return
    updatePosition()
  }, [open])

  useEffect(() => {
    if (!open) return

    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node
      if (buttonRef.current?.contains(target) || panelRef.current?.contains(target)) return
      setOpen(false)
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    function onReposition() {
      updatePosition()
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', onReposition)
    window.addEventListener('scroll', onReposition, true)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onReposition)
      window.removeEventListener('scroll', onReposition, true)
    }
  }, [open])

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label="More about this question"
        aria-expanded={open}
        onClick={() => setOpen(value => !value)}
        className="ml-1.5 inline-flex h-5 w-5 shrink-0 items-center justify-center align-middle rounded-full border border-slate-300 text-[11px] font-semibold text-slate-500 hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        ?
      </button>
      {open &&
        createPortal(
          <span
            ref={panelRef}
            role="tooltip"
            style={{ top: coords.top, left: coords.left, width: coords.width }}
            className="fixed z-[80] rounded-lg border border-slate-200 bg-white p-3 text-xs font-normal leading-relaxed text-slate-600 shadow-lg whitespace-pre-wrap"
          >
            <HelpBody text={text} />
          </span>,
          document.body
        )}
    </>
  )
}
