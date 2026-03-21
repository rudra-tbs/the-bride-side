import { useState, useEffect, useRef } from 'react'
import { useAppStore } from '@/store/app'
import type { Screen } from '@/types'

interface Result {
  id: string
  type: 'guest' | 'vendor' | 'task' | 'screen'
  label: string
  sub?: string
  action: () => void
}

const APP_SCREENS: Screen[] = ['dashboard', 'guests', 'vendors', 'budget', 'checklist', 'moodboard']

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [idx, setIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const { guests, vendors, clTasks, setScreen } = useAppStore()

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault(); setOpen(o => !o); setQuery('')
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  const q = query.toLowerCase()

  const results: Result[] = q.length < 1 ? [] : [
    ...APP_SCREENS
      .filter(s => s.includes(q))
      .map(s => ({
        id: s,
        type: 'screen' as const,
        label: s.charAt(0).toUpperCase() + s.slice(1),
        sub: 'Go to screen',
        action: () => { setScreen(s); setOpen(false) },
      })),
    ...guests.filter(g => g.name.toLowerCase().includes(q) || g.phone.includes(q))
      .slice(0, 4)
      .map(g => ({
        id: g.id,
        type: 'guest' as const,
        label: g.name,
        sub: `${g.rsvp_status} · ${g.side}'s side`,
        action: () => { setScreen('guests'); setOpen(false) },
      })),
    ...vendors.filter(v => v.name.toLowerCase().includes(q) || v.category.includes(q))
      .slice(0, 4)
      .map(v => ({
        id: v.id,
        type: 'vendor' as const,
        label: v.name,
        sub: `${v.category} · ${v.status}`,
        action: () => { setScreen('vendors'); setOpen(false) },
      })),
    ...clTasks.filter(t => t.name.toLowerCase().includes(q))
      .slice(0, 4)
      .map(t => ({
        id: t.id,
        type: 'task' as const,
        label: t.name,
        sub: t.is_done ? 'Done' : 'Pending',
        action: () => { setScreen('checklist'); setOpen(false) },
      })),
  ]

  const TYPE_EMOJI: Record<string, string> = { guest: '👤', vendor: '🤝', task: '✅', screen: '📋' }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setIdx(i => Math.min(i + 1, results.length - 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setIdx(i => Math.max(i - 1, 0)) }
    if (e.key === 'Enter' && results[idx]) results[idx].action()
  }

  if (!open) return null

  return (
    <div className="cp-backdrop" onClick={() => setOpen(false)}>
      <div className="cp-box" onClick={e => e.stopPropagation()}>
        <div className="cp-search-row">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ flexShrink: 0, color: 'var(--ink3)' }}>
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            ref={inputRef}
            className="cp-input"
            placeholder="Search guests, vendors, tasks…"
            value={query}
            onChange={e => { setQuery(e.target.value); setIdx(0) }}
            onKeyDown={onKeyDown}
          />
          <kbd className="cp-kbd">esc</kbd>
        </div>
        {results.length > 0 && (
          <div className="cp-results">
            {results.map((r, i) => (
              <button
                key={r.id}
                className={`cp-result${i === idx ? ' active' : ''}`}
                onClick={r.action}
                onMouseEnter={() => setIdx(i)}
              >
                <span className="cp-result-icon">{TYPE_EMOJI[r.type]}</span>
                <span className="cp-result-label">{r.label}</span>
                {r.sub && <span className="cp-result-sub">{r.sub}</span>}
              </button>
            ))}
          </div>
        )}
        {query.length > 0 && results.length === 0 && (
          <div className="cp-empty">No results for "{query}"</div>
        )}
        <div className="cp-footer">
          <span>↑↓ navigate</span><span>↵ select</span><span>esc close</span>
        </div>
      </div>
    </div>
  )
}
