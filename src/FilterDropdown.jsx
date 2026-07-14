import { useState, useEffect, useRef } from 'react'
import { ChevronDown, Check, Search } from 'lucide-react'

// Shared compact filter picker — a pill button that opens a scrollable
// dropdown list. Used by the Scholarships AND Universities pages so the
// filter UI looks and behaves identically everywhere.
//
// Long lists (more than SEARCH_THRESHOLD options) automatically get a
// type-to-filter search box at the top of the panel; short lists (e.g. the
// Level picker) stay as a plain list. Override with the `searchable` prop.
const SEARCH_THRESHOLD = 8

export default function FilterDropdown({ label, options, active, onChange, searchable }) {
  const [open, setOpen]   = useState(false)
  const [query, setQuery] = useState('')
  const ref = useRef(null)
  const inputRef = useRef(null)
  const isFiltered = active !== 'All'
  const hasSearch = searchable ?? options.length > SEARCH_THRESHOLD

  // Close on click/tap outside
  useEffect(() => {
    if (!open) return
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [open])

  // Fresh search each time the panel opens; focus the input so users can
  // type immediately (desktop) / get the keyboard right away (mobile).
  useEffect(() => {
    if (open) {
      setQuery('')
      if (hasSearch) {
        // Delay lets the panel mount before focusing
        const t = setTimeout(() => inputRef.current?.focus(), 30)
        return () => clearTimeout(t)
      }
    }
  }, [open, hasSearch])

  // Case-insensitive match anywhere in the option text
  const q = query.trim().toLowerCase()
  const visible = q ? options.filter(opt => opt.toLowerCase().includes(q)) : options

  function select(opt) {
    onChange(opt)
    setOpen(false)
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') setOpen(false)
    // Enter picks the first (best) match — fast keyboard flow
    if (e.key === 'Enter' && q && visible.length > 0) select(visible[0])
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          background: isFiltered ? '#16302B' : '#fff',
          color: isFiltered ? '#F7F4EE' : '#16302B',
          border: `1.5px solid ${isFiltered ? '#16302B' : '#16302B1a'}`,
          borderRadius: 100, padding: '7px 14px',
          fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.82rem',
          fontWeight: isFiltered ? 600 : 400, cursor: 'pointer',
          transition: 'all 0.15s', maxWidth: '78vw',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {label}{isFiltered ? `: ${active}` : ''}
        </span>
        <ChevronDown size={12} strokeWidth={2} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s', flexShrink: 0 }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute', left: 0, top: 'calc(100% + 6px)', zIndex: 50,
          background: '#fff', border: '1px solid #16302B12', borderRadius: 14,
          boxShadow: '0 8px 32px rgba(22,48,43,0.14)',
          minWidth: 210, maxWidth: 'min(320px, 86vw)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          {/* Type-to-filter box — only for long lists */}
          {hasSearch && (
            <div style={{ padding: '8px 8px 6px', borderBottom: '1px solid #16302B0d', background: '#fff' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 7,
                background: '#F7F4EE', border: '1px solid #16302B14',
                borderRadius: 10, padding: '7px 10px',
              }}>
                <Search size={14} color="#16302B55" strokeWidth={2} style={{ flexShrink: 0 }} />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder={`Search ${label.toLowerCase()}…`}
                  aria-label={`Search ${label}`}
                  style={{
                    flex: 1, minWidth: 0, border: 'none', outline: 'none',
                    background: 'transparent', color: '#16302B',
                    fontFamily: 'Hanken Grotesk, sans-serif',
                    // 16px prevents iOS Safari from auto-zooming the page
                    fontSize: 16, lineHeight: 1.3,
                  }}
                />
              </div>
            </div>
          )}

          {/* Options list — scrollable below the (sticky) search box */}
          <div style={{ padding: 6, maxHeight: 240, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
            {visible.length === 0 ? (
              <p style={{
                fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.85rem',
                color: '#16302B55', textAlign: 'center', padding: '16px 12px', margin: 0,
              }}>
                No matches for “{query.trim()}”
              </p>
            ) : (
              visible.map(opt => (
                <button
                  key={opt}
                  onClick={() => select(opt)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                    width: '100%', textAlign: 'left', padding: '8px 12px', borderRadius: 8,
                    border: 'none', background: active === opt ? '#16302B0a' : 'none',
                    fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.85rem',
                    color: '#16302B', fontWeight: active === opt ? 600 : 400,
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => { if (active !== opt) e.currentTarget.style.background = '#F7F4EE' }}
                  onMouseLeave={e => { if (active !== opt) e.currentTarget.style.background = 'none' }}
                >
                  {opt}
                  {active === opt && <Check size={13} color="#4F8A6E" strokeWidth={2.5} style={{ flexShrink: 0 }} />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
