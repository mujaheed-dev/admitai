import { useState, useEffect, useRef } from 'react'
import { ChevronDown, Check } from 'lucide-react'

// Shared compact filter picker — a pill button that opens a scrollable
// dropdown list. Used by the Scholarships AND Universities pages so the
// filter UI looks and behaves identically everywhere.
export default function FilterDropdown({ label, options, active, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const isFiltered = active !== 'All'

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
          boxShadow: '0 8px 32px rgba(22,48,43,0.14)', padding: '6px',
          minWidth: 190, maxWidth: 'min(320px, 86vw)', maxHeight: 280, overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}>
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false) }}
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
          ))}
        </div>
      )}
    </div>
  )
}
