import { useState } from 'react'
import FilterDropdown from './FilterDropdown.jsx'
import { UNIVERSITY_FIELDS } from './universitiesData.js'

// Stored as the field answer when the student doesn't know yet — the Board
// treats any string the same way, this one just reads friendlier.
export const ANY_FIELD = 'Any field'

// Full field vocabulary from the university data — same list the
// Universities page filter uses, alphabetical so search feels predictable.
const FIELD_CHOICES = [...UNIVERSITY_FIELDS].sort((a, b) => a.localeCompare(b))

// Custom budgets are capped here; anything above behaves like the '$35k+'
// preset anyway, and it keeps typos ($2,000,000,000) out of the data.
const MAX_CUSTOM_BUDGET = 1000000

const QUESTIONS = [
  {
    id: 'budget',
    question: "What's your annual budget, all-in?",
    hint: 'Include tuition, housing, and living costs.',
    type: 'single',
    options: [
      { label: 'Under $10k', value: 10000 },
      { label: '$10–20k', value: 20000 },
      { label: '$20–35k', value: 35000 },
      { label: '$35k+', value: 1e9 },
    ],
  },
  {
    id: 'field',
    question: 'What do you want to study?',
    hint: "Search for your exact field — or skip ahead if you're still deciding.",
    type: 'field',
  },
  {
    id: 'regions',
    question: 'Which regions are you open to?',
    hint: 'Select all that apply.',
    type: 'multi',
    options: [
      { label: 'Europe', value: 'Europe' },
      { label: 'UK & Ireland', value: 'UK & Ireland' },
      { label: 'North America', value: 'North America' },
      { label: 'Asia', value: 'Asia' },
      { label: 'Middle East', value: 'Middle East' },
      { label: 'Africa', value: 'Africa' },
      { label: 'Open to anywhere', value: 'anywhere' },
    ],
  },
]

const TOTAL = QUESTIONS.length

export default function IntakeFlow({ onComplete, onBack, firstName }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({ budget: null, field: null, regions: [] })
  // Custom budget entry — raw digit string, formatted with commas on render
  const [customOpen, setCustomOpen]     = useState(false)
  const [customBudget, setCustomBudget] = useState('')
  const customValid = Number(customBudget) > 0

  const q = QUESTIONS[step]
  const progressPct = ((step + 1) / TOTAL) * 100

  function handleSingle(value) {
    const next = { ...answers, [q.id]: value }
    setAnswers(next)
    if (step < TOTAL - 1) {
      setStep(step + 1)
    } else {
      onComplete(next)
    }
  }

  function toggleRegion(value) {
    setAnswers(prev => {
      if (value === 'anywhere') {
        return { ...prev, regions: prev.regions.includes('anywhere') ? [] : ['anywhere'] }
      }
      const without = prev.regions.filter(r => r !== 'anywhere' && r !== value)
      return {
        ...prev,
        regions: prev.regions.includes(value) ? without : [...without, value],
      }
    })
  }

  function handleBack() {
    if (step === 0) onBack()
    else setStep(step - 1)
  }

  const canContinue = q.type === 'multi' ? answers.regions.length > 0 : true

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F7F4EE' }}>
      {/* Progress bar only — no logo or step counter */}
      <div style={{ height: 3, background: '#16302B0f' }}>
        <div
          style={{
            height: '100%',
            width: `${progressPct}%`,
            background: '#4F8A6E',
            transition: 'width 0.35s ease',
          }}
        />
      </div>

      {/* Content */}
      <div
        className="flex-1 flex flex-col justify-center px-6 py-12"
        style={{ maxWidth: 520, margin: '0 auto', width: '100%' }}
      >
        <button
          onClick={handleBack}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'Hanken Grotesk, sans-serif',
            color: '#16302B66',
            fontSize: '0.875rem',
            padding: '0 0 28px 0',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          ← Back
        </button>

        {/* Warm intro on first question only */}
        {step === 0 && firstName && (
          <p style={{
            fontFamily: 'Hanken Grotesk, sans-serif',
            color: '#16302B77',
            fontSize: '0.95rem',
            lineHeight: 1.6,
            margin: '0 0 22px',
            fontStyle: 'italic',
          }}>
            Let's find where you can afford to study, {firstName}. Just a few quick questions.
          </p>
        )}

        <h2
          style={{
            fontFamily: 'Fraunces, Georgia, serif',
            color: '#16302B',
            fontSize: 'clamp(1.4rem, 4vw, 1.9rem)',
            fontWeight: 600,
            lineHeight: 1.25,
            margin: '0 0 8px 0',
          }}
        >
          {q.question}
        </h2>
        <p
          style={{
            fontFamily: 'Hanken Grotesk, sans-serif',
            color: '#16302B99',
            fontSize: '0.95rem',
            margin: '0 0 32px 0',
          }}
        >
          {q.hint}
        </p>

        {/* Options */}
        {q.type === 'field' ? (
          // Full searchable field list — same picker as the Universities and
          // Scholarships filters, so typing "pha" surfaces Pharmacy.
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
            <FilterDropdown
              label="Field of study"
              options={FIELD_CHOICES}
              active={answers.field && answers.field !== ANY_FIELD ? answers.field : 'All'}
              onChange={handleSingle}
            />
            <OptionButton
              label="Not sure yet — open to any field"
              onClick={() => handleSingle(ANY_FIELD)}
            />
          </div>
        ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {q.options.map(opt => {
            const isSelected =
              q.type === 'multi'
                ? answers.regions.includes(opt.value)
                : false

            return (
              <OptionButton
                key={String(opt.value)}
                label={opt.label}
                selected={isSelected}
                isMulti={q.type === 'multi'}
                onClick={() =>
                  q.type === 'single'
                    ? handleSingle(opt.value)
                    : toggleRegion(opt.value)
                }
              />
            )
          })}

          {/* Custom budget — typed amount flows into matching exactly like a preset */}
          {q.id === 'budget' && (
            <>
              <OptionButton
                label="Custom amount…"
                selected={customOpen}
                onClick={() => setCustomOpen(v => !v)}
              />
              {customOpen && (
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{
                    flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 8,
                    background: '#fff', border: '1.5px solid #4F8A6E',
                    borderRadius: 14, padding: '0 18px',
                  }}>
                    <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontWeight: 600, color: '#16302B77' }}>$</span>
                    <input
                      autoFocus
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="7,500"
                      aria-label="Custom annual budget in US dollars"
                      value={customBudget ? Number(customBudget).toLocaleString('en-US') : ''}
                      onChange={e => {
                        const digits = e.target.value.replace(/[^0-9]/g, '')
                        setCustomBudget(digits ? String(Math.min(Number(digits), MAX_CUSTOM_BUDGET)) : '')
                      }}
                      onKeyDown={e => { if (e.key === 'Enter' && customValid) handleSingle(Number(customBudget)) }}
                      style={{
                        flex: 1, minWidth: 0, border: 'none', outline: 'none',
                        background: 'transparent', color: '#16302B',
                        fontFamily: 'Hanken Grotesk, sans-serif', fontWeight: 500,
                        // 16px prevents iOS Safari from auto-zooming the page
                        fontSize: 16, padding: '16px 0',
                      }}
                    />
                    <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B55', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>/ year</span>
                  </div>
                  <button
                    onClick={() => customValid && handleSingle(Number(customBudget))}
                    disabled={!customValid}
                    style={{
                      padding: '0 22px', borderRadius: 14, border: 'none',
                      cursor: customValid ? 'pointer' : 'not-allowed',
                      background: customValid ? '#E07A2F' : '#16302B18',
                      color: customValid ? '#fff' : '#16302B44',
                      fontFamily: 'Hanken Grotesk, sans-serif',
                      fontSize: '0.95rem', fontWeight: 600,
                      transition: 'background 0.2s, color 0.2s',
                    }}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        )}

        {/* Continue button for multi-select */}
        {q.type === 'multi' && (
          <button
            onClick={() => canContinue && onComplete(answers)}
            disabled={!canContinue}
            style={{
              marginTop: 24,
              width: '100%',
              padding: '16px 24px',
              borderRadius: 100,
              border: 'none',
              cursor: canContinue ? 'pointer' : 'not-allowed',
              background: canContinue ? '#E07A2F' : '#16302B18',
              color: canContinue ? '#fff' : '#16302B44',
              fontFamily: 'Hanken Grotesk, sans-serif',
              fontSize: '1rem',
              fontWeight: 600,
              transition: 'background 0.2s, color 0.2s',
            }}
          >
            See my board →
          </button>
        )}
      </div>
    </div>
  )
}

function OptionButton({ label, selected, isMulti, onClick }) {
  const [hovered, setHovered] = useState(false)

  const active = selected || hovered

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: selected ? '#EAF3EE' : hovered ? '#f5f2ec' : '#fff',
        border: `1.5px solid ${selected ? '#4F8A6E' : hovered ? '#4F8A6E66' : '#16302B1a'}`,
        borderRadius: 14,
        padding: '17px 22px',
        textAlign: 'left',
        cursor: 'pointer',
        fontFamily: 'Hanken Grotesk, sans-serif',
        color: '#16302B',
        fontSize: '0.975rem',
        fontWeight: 500,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        transition: 'all 0.15s ease',
        width: '100%',
      }}
    >
      {label}
      {isMulti && selected && (
        <span
          style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: '#4F8A6E',
            color: '#fff',
            fontSize: '0.7rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          ✓
        </span>
      )}
      {isMulti && !selected && (
        <span
          style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            border: '1.5px solid #16302B22',
            flexShrink: 0,
          }}
        />
      )}
    </button>
  )
}
