/**
 * AdmitAI Design System — single source of truth.
 *
 * Import from here and reference these values when building new components
 * or auditing existing ones. Nothing in the app imports from this file yet —
 * it documents what the codebase uses and provides tokens for future work.
 */

// ─── Color palette ────────────────────────────────────────────────────────────

export const color = {
  // Core
  ink:   '#16302B',   // primary text, dark UI elements
  paper: '#F7F4EE',   // page background
  amber: '#E07A2F',   // CTAs, accents, warnings
  sage:  '#4F8A6E',   // positive, verified, progress

  // Ink opacity steps (for UI hierarchy without separate grey palette)
  inkDim:   '#16302B88',  // ~53% — secondary text, muted labels
  inkMuted: '#16302B66',  // ~40% — placeholder, helper text
  inkFaint: '#16302B44',  // ~27% — borders, dividers
  inkGhost: '#16302B0d',  // ~5%  — card borders, subtle dividers

  // Semantic states
  success:   '#2D7A52',
  successBg: '#E4F5EC',
  warning:   '#9A5010',
  warningBg: '#FDF0E6',
  danger:    '#9B2335',
  dangerBg:  '#FDECEA',

  // Tints
  sageTint:  '#EAF3EE',
  amberTint: '#FDF0E6',
}

// ─── Typography ───────────────────────────────────────────────────────────────

export const font = {
  heading: 'Fraunces, Georgia, serif',
  body:    'Hanken Grotesk, sans-serif',
  mono:    'ui-monospace, monospace',
}

/**
 * Type scale — use these values consistently.
 *
 *  pageTitle     h1 on full pages            clamp(1.6rem, 4.5vw, 2.2rem)
 *  sectionTitle  h1 on detail/inner pages    clamp(1.6rem, 4.5vw, 2.2rem)  (same)
 *  cardTitle     h2 inside cards             1.08rem
 *  bodyLg        lead paragraphs, sub-heads  1rem
 *  body          standard body copy          0.9rem
 *  small         helper text, captions       0.82rem
 *  micro         badges, tags, labels        0.72rem  ← uppercase labels use this
 *  eyebrow       page-level section labels   0.75rem  ← above page h1 headings
 */
export const size = {
  pageTitle:    'clamp(1.6rem, 4.5vw, 2.2rem)',
  sectionTitle: 'clamp(1.6rem, 4.5vw, 2.2rem)',
  cardTitle:    '1.08rem',
  bodyLg:       '1rem',
  body:         '0.9rem',
  small:        '0.82rem',
  micro:        '0.72rem',
  eyebrow:      '0.75rem',
}

// ─── Spacing ──────────────────────────────────────────────────────────────────

export const space = {
  // Standard page container max-width (all inner pages)
  pageMaxW: 'max-w-3xl',       // 48rem / 768px
  dashMaxW: 'max-w-4xl',       // 56rem / 896px (dashboard grid needs more room)

  // Standard horizontal page padding (Tailwind)
  pagePad: 'px-6',             // 24px each side

  // Page content top padding (px, below nav)
  pageTop: 40,

  // Internal section gap (px)
  sectionGap: 24,

  // Card internal padding (px)
  cardPadX: 24,
  cardPadY: 22,
}

// ─── Cards ───────────────────────────────────────────────────────────────────

export const card = {
  // All standard cards use these values
  borderRadius: 20,
  border:       '1px solid #16302B0d',
  shadow:       '0 2px 10px rgba(22,48,43,0.06)',
  shadowHover:  '0 10px 36px rgba(22,48,43,0.10)',
  transformHover: 'translateY(-3px)',
}

// ─── Buttons ──────────────────────────────────────────────────────────────────

export const btn = {
  // Primary — dark fill
  primary: {
    background: color.ink, color: color.paper, border: 'none',
    borderRadius: 100, padding: '10px 22px',
    fontFamily: font.body, fontSize: size.body, fontWeight: 600,
    cursor: 'pointer',
  },
  // Primary — amber fill (CTAs)
  amber: {
    background: color.amber, color: '#fff', border: 'none',
    borderRadius: 100, padding: '10px 22px',
    fontFamily: font.body, fontSize: size.body, fontWeight: 600,
    cursor: 'pointer',
  },
  // Ghost — outlined
  ghost: {
    background: 'none', color: color.ink,
    border: '1.5px solid rgba(22,48,43,0.22)',
    borderRadius: 100, padding: '7px 18px',
    fontFamily: font.body, fontSize: '0.85rem', fontWeight: 500,
    cursor: 'pointer',
  },
  // Back button — text only with icon
  back: {
    background: 'none', border: 'none', cursor: 'pointer',
    padding: '0 0 24px',           // ← 24px bottom always
    display: 'flex', alignItems: 'center', gap: 7,
    fontFamily: font.body, color: color.inkDim,
    fontSize: '0.875rem', fontWeight: 500,
  },
}

// ─── Inputs ───────────────────────────────────────────────────────────────────

export const input = {
  base: {
    width: '100%', border: '1.5px solid #16302B18', borderRadius: 10,
    padding: '10px 14px', fontFamily: font.body,
    fontSize: size.body, color: color.ink, outline: 'none',
    background: '#fff', boxSizing: 'border-box',
  },
  focus: { borderColor: 'rgba(79,138,110,0.45)' },
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

export const nav = {
  // Standard sticky nav wrapper
  header: {
    background: '#F7F4EEf8',
    borderColor: '#16302B1a',
    backdropFilter: 'blur(8px)',
  },
  // Inner content padding (Tailwind)
  innerClass: 'max-w-3xl mx-auto px-6 py-4',
}

// ─── Section labels (uppercase eyebrow inside detail pages) ──────────────────

export const sectionLabel = {
  fontFamily: font.body,
  fontSize: size.micro,       // 0.72rem
  fontWeight: 700,
  letterSpacing: '0.09em',
  textTransform: 'uppercase',
  color: '#16302B55',
  margin: '0 0 12px',
}
