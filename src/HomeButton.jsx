import { ArrowLeft } from 'lucide-react'

// The single, app-wide "exit to home" control. Same label, icon, styling, and
// top-left placement on every page, so users always know where to get out.
// Always returns to the dashboard/home (the onClick passed in).
export default function HomeButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label="Back to home"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0,
        background: 'none', border: 'none', cursor: 'pointer', padding: '4px 2px',
        fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B88',
        fontSize: '0.875rem', fontWeight: 500, whiteSpace: 'nowrap',
        transition: 'color 0.15s',
      }}
      onMouseEnter={e => (e.currentTarget.style.color = '#16302B')}
      onMouseLeave={e => (e.currentTarget.style.color = '#16302B88')}
    >
      <ArrowLeft size={16} strokeWidth={2} />
      Home
    </button>
  )
}
