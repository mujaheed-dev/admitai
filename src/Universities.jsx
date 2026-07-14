import { useState, useEffect } from 'react'
import { Building2, Heart, Plus, CheckCircle } from 'lucide-react'
import { UNIVERSITIES, UNIVERSITY_COUNTRIES, UNIVERSITY_FIELDS } from './universitiesData.js'
import UniversityDetail from './UniversityDetail.jsx'
import ProfileMenu from './ProfileMenu.jsx'
import FilterDropdown from './FilterDropdown.jsx'
import { supabase } from './supabase.js'

// Default checklist for new university applications
const UNI_CHECKLIST = ['Transcripts', 'Personal statement', 'References', 'Application fee', 'Submitted']
function uid() { return Math.random().toString(36).slice(2, 10) }

// Alphabetical inside the pickers so long lists stay scannable
const COUNTRY_OPTIONS = ['All', ...[...UNIVERSITY_COUNTRIES].sort((a, b) => a.localeCompare(b))]
const FIELD_OPTIONS   = ['All', ...[...UNIVERSITY_FIELDS].sort((a, b) => a.localeCompare(b))]
// Same values as the Scholarships page's Level picker
const LEVEL_OPTIONS   = ['All', 'Undergraduate', 'Masters / PhD', 'Both']

// Paid-tier level gating comes in via the `planLevel` prop (from the user's
// subscription in App.jsx):
//   'Undergraduate'  -> undergrad plan (shows Undergraduate + Both)
//   'Masters / PhD'  -> postgrad plan (shows Masters / PhD + Both)
//   null             -> combined plan OR free account (everyone sees everything
//                       — free browsing is never restricted)
// Universities with level 'Both' always pass — same rule the scholarship
// tier filtering uses.

// A university matches a level if it teaches at that level — 'Both' entries
// genuinely offer undergrad AND postgrad, so they match either choice.
function matchesLevel(uniLevel, wanted) {
  if (!wanted || wanted === 'All') return true
  if (wanted === 'Both') return uniLevel === 'Both'
  return uniLevel === wanted || uniLevel === 'Both'
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function Universities({
  answers, planLevel, onGoToBoard, onBack,
  user, firstName, onSignOut, onGoToDashboard,
  onGoToScholarships, onGoToPrivacy, onGoToTerms, onDeleted, onGoToPricing,
}) {
  const [countryFilter, setCountryFilter] = useState('All')
  const [fieldFilter,   setFieldFilter]   = useState('All')
  const [levelFilter,   setLevelFilter]   = useState('All')
  const [selectedUni,   setSelectedUni]   = useState(null)
  const [activeView,    setActiveView]    = useState('all')  // 'all' | 'saved'

  // Saved state
  const [savedIds,     setSavedIds]     = useState(new Set())
  const [savingId,     setSavingId]     = useState(null)      // ID being toggled right now

  // Add-to-applications state
  const [addingId,     setAddingId]     = useState(null)      // ID being added
  const [addedIds,     setAddedIds]     = useState(new Set()) // IDs successfully added this session

  const hasBoard    = answers && onGoToBoard
  const displayName = firstName || (user?.email?.split('@')[0]) || ''

  // ── Load saved IDs on mount ────────────────────────────────────────────────
  useEffect(() => {
    if (!user || !supabase) return
    supabase
      .from('saved_universities')
      .select('university_id')
      .eq('user_id', user.id)
      .then(({ data }) => {
        if (data?.length) setSavedIds(new Set(data.map(r => r.university_id)))
      })
      .catch(() => {})
  }, [user])

  // ── Toggle save ────────────────────────────────────────────────────────────
  async function toggleSave(e, universityId) {
    e.stopPropagation()
    if (!supabase || !user || savingId) return
    setSavingId(universityId)

    const alreadySaved = savedIds.has(universityId)
    // Optimistic update
    setSavedIds(prev => {
      const next = new Set(prev)
      alreadySaved ? next.delete(universityId) : next.add(universityId)
      return next
    })

    try {
      if (alreadySaved) {
        await supabase.from('saved_universities')
          .delete().eq('user_id', user.id).eq('university_id', universityId)
      } else {
        await supabase.from('saved_universities')
          .insert({ user_id: user.id, university_id: universityId })
      }
    } catch {
      // Revert on error
      setSavedIds(prev => {
        const next = new Set(prev)
        alreadySaved ? next.add(universityId) : next.delete(universityId)
        return next
      })
    } finally {
      setSavingId(null)
    }
  }

  // ── Add to My Applications ─────────────────────────────────────────────────
  async function addToApplications(e, university) {
    e.stopPropagation()
    if (!supabase || !user || addingId) return
    setAddingId(university.id)
    try {
      const checklist = UNI_CHECKLIST.map(text => ({ id: uid(), text, done: false }))
      const { error } = await supabase.from('applications').insert({
        user_id: user.id,
        type: 'university',
        name: university.name,
        country: university.country,
        checklist,
        status: 'not_started',
      })
      if (!error) setAddedIds(prev => new Set([...prev, university.id]))
    } catch { /* silent */ }
    finally { setAddingId(null) }
  }

  // ── Filter & derive lists ──────────────────────────────────────────────────
  // Plan gating first (no-op while planLevel is null), then user filters.
  const planVisible = UNIVERSITIES.filter(u => matchesLevel(u.level, planLevel))

  const matchesFilters = u => {
    const countryOk = countryFilter === 'All' || u.country === countryFilter
    const fieldOk   = fieldFilter === 'All' || u.knownFor.includes(fieldFilter)
    const levelOk   = matchesLevel(u.level, levelFilter)
    return countryOk && fieldOk && levelOk
  }

  const allFiltered = planVisible.filter(matchesFilters)

  const savedList     = planVisible.filter(u => savedIds.has(u.id))
  const savedFiltered = savedList.filter(matchesFilters)

  const displayList = activeView === 'saved' ? savedFiltered : allFiltered

  const tabStyle = (isActive) => ({
    background: isActive ? '#16302B' : 'none',
    color: isActive ? '#F7F4EE' : '#16302B99',
    border: 'none', borderRadius: 100, padding: '6px 13px',
    fontSize: '0.85rem', fontFamily: 'Hanken Grotesk, sans-serif',
    fontWeight: isActive ? 600 : 500, cursor: isActive ? 'default' : 'pointer', whiteSpace: 'nowrap',
  })

  return (
    <div className="min-h-screen" style={{ background: '#F7F4EE' }}>

      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 border-b" style={{ background: '#F7F4EEf5', borderColor: '#16302B20', backdropFilter: 'blur(8px)' }}>
        {/* Mobile: two rows */}
        <div className="sm:hidden max-w-3xl mx-auto px-6 pt-3.5 pb-3">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 }}>
            <button onClick={onGoToDashboard} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '1.1rem', fontWeight: 600 }}>
              AdmitAI
            </button>
            <GhostBtn onClick={selectedUni ? () => setSelectedUni(null) : onBack}>
              {selectedUni ? '← Universities' : '← Home'}
            </GhostBtn>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 2 }}>
              {hasBoard && <button style={tabStyle(false)} onClick={onGoToBoard}>My Board</button>}
              {onGoToScholarships && <button style={tabStyle(false)} onClick={onGoToScholarships}>Scholarships</button>}
              <button style={tabStyle(true)}>Universities</button>
            </div>
            <ProfileMenu user={user} firstName={firstName} onSignOut={onSignOut} onGoToPrivacy={onGoToPrivacy} onGoToTerms={onGoToTerms} onDeleted={onDeleted} onGoToPricing={onGoToPricing} />
          </div>
        </div>
        {/* Desktop: single row */}
        <div className="hidden sm:flex max-w-3xl mx-auto px-6 py-3 items-center justify-between gap-3">
          <button onClick={onGoToDashboard} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '1.1rem', fontWeight: 600, flexShrink: 0 }}>
            AdmitAI
          </button>
          <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
            {hasBoard && <button style={tabStyle(false)} onClick={onGoToBoard}>My Board</button>}
            {onGoToScholarships && <button style={tabStyle(false)} onClick={onGoToScholarships}>Scholarships</button>}
            <button style={tabStyle(true)}>Universities</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
            <ProfileMenu user={user} firstName={firstName} onSignOut={onSignOut} onGoToPrivacy={onGoToPrivacy} onGoToTerms={onGoToTerms} onDeleted={onDeleted} onGoToPricing={onGoToPricing} />
            <GhostBtn onClick={selectedUni ? () => setSelectedUni(null) : onBack}>
              {selectedUni ? '← Universities' : '← Home'}
            </GhostBtn>
          </div>
        </div>
      </header>

      {/* ── Detail OR list ── */}
      {selectedUni ? (
        <UniversityDetail
          university={selectedUni}
          onBack={() => setSelectedUni(null)}
          isSaved={savedIds.has(selectedUni.id)}
          onToggleSave={e => toggleSave(e, selectedUni.id)}
          onAddToApp={e => addToApplications(e, selectedUni)}
          addedToApp={addedIds.has(selectedUni.id)}
        />
      ) : (
        <>
          {/* Personal header */}
          <div className="max-w-3xl mx-auto px-6 pt-10 pb-6">
            <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: '#4F8A6E', margin: '0 0 10px' }}>
              Universities
            </p>
            <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: 'clamp(1.5rem, 4vw, 2.1rem)', fontWeight: 600, lineHeight: 1.2, margin: '0 0 10px' }}>
              {displayName ? `Real numbers for real schools, ${displayName}.` : 'Real numbers for real schools.'}
            </h1>
            <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B88', fontSize: '0.975rem', lineHeight: 1.6, margin: 0 }}>
              Specific universities — fees, entry requirements, and deadlines — so you know exactly what you&apos;re applying to.
            </p>
          </div>

          {/* View toggle + filters */}
          <div className="max-w-3xl mx-auto px-6 pb-2">
            {/* All / Saved tabs */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
              <button
                onClick={() => setActiveView('all')}
                style={{
                  padding: '7px 16px', borderRadius: 100,
                  border: `1.5px solid ${activeView === 'all' ? '#16302B' : '#16302B18'}`,
                  background: activeView === 'all' ? '#16302B' : '#fff',
                  color: activeView === 'all' ? '#F7F4EE' : '#16302B',
                  fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.85rem',
                  fontWeight: activeView === 'all' ? 600 : 400, cursor: 'pointer',
                }}
              >
                All universities
              </button>
              <button
                onClick={() => setActiveView('saved')}
                style={{
                  padding: '7px 16px', borderRadius: 100,
                  border: `1.5px solid ${activeView === 'saved' ? '#E07A2F' : '#16302B18'}`,
                  background: activeView === 'saved' ? '#FDF0E6' : '#fff',
                  color: activeView === 'saved' ? '#C0601A' : '#16302B',
                  fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.85rem',
                  fontWeight: activeView === 'saved' ? 600 : 400, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                <Heart size={13} fill={activeView === 'saved' ? '#E07A2F' : 'none'} color={activeView === 'saved' ? '#E07A2F' : '#16302B66'} strokeWidth={2} />
                Saved{savedIds.size > 0 && ` (${savedIds.size})`}
              </button>
            </div>

            {/* Filter dropdowns — same picker pattern as the Scholarships page */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
              <FilterDropdown label="Country" options={COUNTRY_OPTIONS} active={countryFilter} onChange={setCountryFilter} />
              <FilterDropdown label="Field"   options={FIELD_OPTIONS}   active={fieldFilter}   onChange={setFieldFilter} />
              <FilterDropdown label="Level"   options={LEVEL_OPTIONS}   active={levelFilter}   onChange={setLevelFilter} />
            </div>
            <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B99', fontSize: '0.875rem', margin: '14px 0 20px' }}>
              <strong style={{ color: '#16302B', fontWeight: 600 }}>{displayList.length}</strong>{' '}
              {displayList.length === 1 ? 'university' : 'universities'}{activeView === 'saved' ? ' saved' : ' found'}
            </p>
          </div>

          {/* Cards */}
          <div className="max-w-3xl mx-auto px-6 pb-20">
            {displayList.length === 0 ? (
              activeView === 'saved'
                ? <SavedEmptyState onBrowse={() => setActiveView('all')} />
                : <EmptyState countryFilter={countryFilter} />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {displayList.map(u => (
                  <UniversityCard
                    key={u.id}
                    university={u}
                    onSelect={setSelectedUni}
                    isSaved={savedIds.has(u.id)}
                    onToggleSave={e => toggleSave(e, u.id)}
                    savingId={savingId}
                    showAddToApp={activeView === 'saved'}
                    onAddToApp={e => addToApplications(e, u)}
                    addedToApp={addedIds.has(u.id)}
                    addingId={addingId}
                  />
                ))}
              </div>
            )}

            {activeView === 'all' && (
              <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.82rem', color: '#16302B44', fontStyle: 'italic', textAlign: 'center', margin: '32px 0 0', lineHeight: 1.5 }}>
                We're verifying more universities before adding them — quality over quantity.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function GhostBtn({ onClick, children }) {
  return (
    <button onClick={onClick} style={{ background: 'none', border: '1.5px solid #16302B30', borderRadius: 100, padding: '6px 16px', cursor: 'pointer', fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B', fontSize: '0.82rem', fontWeight: 500, whiteSpace: 'nowrap' }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = '#16302B')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = '#16302B30')}
    >
      {children}
    </button>
  )
}

// ─── university card ──────────────────────────────────────────────────────────

function UniversityCard({ university: u, onSelect, isSaved, onToggleSave, savingId, showAddToApp, onAddToApp, addedToApp, addingId }) {
  const [hovered, setHovered] = useState(false)
  const visibleTags  = u.knownFor.slice(0, 3)
  const tuitionShort = u.tuitionIntl.split(' for ')[0].split('(')[0].trim()
  const bestScholarship = (u.scholarships || []).find(s => s.verified)
  const isSaving = savingId === u.id
  const isAdding = addingId === u.id

  return (
    <div
      onClick={() => onSelect(u)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: isSaved ? '#FFFCF9' : bestScholarship ? '#FAFEF9' : '#fff',
        borderRadius: 20,
        border: `1.5px solid ${
          hovered      ? '#4F8A6E55'
          : isSaved    ? '#E07A2F28'
          : bestScholarship ? '#4F8A6E28'
          : '#16302B0d'
        }`,
        boxShadow: hovered ? '0 12px 40px rgba(22,48,43,0.11)' : '0 2px 10px rgba(22,48,43,0.06)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease',
        cursor: 'pointer', userSelect: 'none',
        padding: '24px 24px 20px',
      }}
    >
      {/* Top: name + verified + heart */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
        <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: 'clamp(1rem, 2.5vw, 1.1rem)', fontWeight: 600, lineHeight: 1.25, margin: 0, minWidth: 0 }}>
          {u.name}
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, marginTop: 2 }}>
          {u.verified && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#E4F5EC', color: '#2D7A52', border: '1px solid #4F8A6E22', borderRadius: 100, padding: '2px 9px', fontSize: '0.68rem', fontFamily: 'Hanken Grotesk, sans-serif', fontWeight: 700, whiteSpace: 'nowrap' }}>
              ✓ Verified
            </span>
          )}
          {/* Save heart button */}
          <button
            onClick={onToggleSave}
            title={isSaved ? 'Remove from saved' : 'Save university'}
            style={{ background: 'none', border: 'none', cursor: isSaving ? 'default' : 'pointer', padding: '2px 4px', display: 'flex', alignItems: 'center', opacity: isSaving ? 0.5 : 1, transition: 'opacity 0.15s, transform 0.15s' }}
            onMouseEnter={e => { if (!isSaving) e.currentTarget.style.transform = 'scale(1.15)' }}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <Heart size={17} strokeWidth={2} fill={isSaved ? '#E07A2F' : 'none'} color={isSaved ? '#E07A2F' : '#16302B44'} />
          </button>
        </div>
      </div>

      {/* Location */}
      <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B77', fontSize: '0.82rem', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 5 }}>
        <span>{u.flag}</span><span>{u.city}, {u.country}</span>
      </p>

      {/* Ranking */}
      <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B', fontSize: '0.875rem', fontWeight: 600, fontStyle: 'italic', margin: '0 0 10px', lineHeight: 1.3 }}>
        {u.ranking}
      </p>

      {/* Scholarship badge */}
      {bestScholarship && (
        <div style={{ marginBottom: 12 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', background: '#E4F5EC', color: '#2D7A52', border: '1px solid #4F8A6E22', borderRadius: 100, padding: '3px 10px', fontSize: '0.68rem', fontFamily: 'Hanken Grotesk, sans-serif', fontWeight: 700, whiteSpace: 'nowrap' }}>
            {bestScholarship.percentage} scholarship
          </span>
        </div>
      )}

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
        {visibleTags.map(f => (
          <span key={f} style={{ background: '#4F8A6E10', color: '#2D7A52', border: '1px solid #4F8A6E20', borderRadius: 100, padding: '3px 11px', fontSize: '0.75rem', fontFamily: 'Hanken Grotesk, sans-serif', fontWeight: 500 }}>
            {f}
          </span>
        ))}
        {u.knownFor.length > 3 && (
          <span style={{ background: '#16302B08', color: '#16302B55', borderRadius: 100, padding: '3px 11px', fontSize: '0.75rem', fontFamily: 'Hanken Grotesk, sans-serif' }}>
            +{u.knownFor.length - 3} more
          </span>
        )}
      </div>

      {/* Bottom row */}
      <div style={{ borderTop: '1px solid #16302B08', paddingTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
        <div>
          <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#16302B44', margin: '0 0 3px' }}>
            Intl tuition
          </p>
          <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: '#16302B', margin: 0 }}>
            {tuitionShort}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {/* Add to Applications button — shown in saved view */}
          {showAddToApp && (
            <button
              onClick={onAddToApp}
              disabled={isAdding}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                background: addedToApp ? '#EAF3EE' : '#fff',
                color: addedToApp ? '#2D7A52' : '#16302B',
                border: `1.5px solid ${addedToApp ? '#4F8A6E44' : '#16302B18'}`,
                borderRadius: 100, padding: '5px 12px',
                fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.75rem', fontWeight: 600,
                cursor: isAdding ? 'default' : 'pointer', transition: 'all 0.15s',
                opacity: isAdding ? 0.6 : 1,
              }}
            >
              {addedToApp
                ? <><CheckCircle size={12} strokeWidth={2.5} /> In My Applications</>
                : isAdding
                  ? '…'
                  : <><Plus size={12} strokeWidth={2.5} /> My Applications</>
              }
            </button>
          )}
          <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.82rem', fontWeight: 500, color: hovered ? '#E07A2F' : '#16302B44', whiteSpace: 'nowrap', transition: 'color 0.22s' }}>
            View details →
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── empty states ─────────────────────────────────────────────────────────────

function EmptyState({ countryFilter }) {
  return (
    <div style={{ background: '#fff', borderRadius: 20, padding: '40px 28px', textAlign: 'center', border: '1px solid #16302B0d' }}>
      <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#EAF3EE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
        <Building2 size={22} color="#4F8A6E" strokeWidth={1.75} />
      </div>
      <p style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '1rem', fontWeight: 600, margin: '0 0 6px' }}>
        {countryFilter === 'All' ? 'More universities coming soon' : `Universities in ${countryFilter} coming soon`}
      </p>
      <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B66', fontSize: '0.875rem', margin: 0, lineHeight: 1.5 }}>
        We verify each university before adding it — so you get accurate fees and deadlines, not guesses.
      </p>
    </div>
  )
}

function SavedEmptyState({ onBrowse }) {
  return (
    <div style={{ background: '#fff', borderRadius: 20, padding: '40px 28px', textAlign: 'center', border: '1px solid #16302B0d' }}>
      <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#FDF0E6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
        <Heart size={22} color="#E07A2F" strokeWidth={1.75} />
      </div>
      <p style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '1rem', fontWeight: 600, margin: '0 0 8px' }}>
        No saved universities yet
      </p>
      <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B66', fontSize: '0.875rem', margin: '0 0 20px', lineHeight: 1.55 }}>
        Tap the ♥ on any university to save it here for quick access.
      </p>
      <button
        onClick={onBrowse}
        style={{ background: '#16302B', color: '#F7F4EE', border: 'none', borderRadius: 100, padding: '9px 20px', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
      >
        Browse universities
      </button>
    </div>
  )
}
