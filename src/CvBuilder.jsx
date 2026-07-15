import { useState, useEffect, useRef } from 'react'
import {
  FileText, GraduationCap, Star, Briefcase, Users, Wrench, Trophy,
  FlaskConical, Target, Sparkles, Copy, Download, Check,
  BookmarkPlus, BookmarkCheck, Trash2, ChevronLeft, RotateCcw,
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { supabase } from './supabase.js'
import ProfileMenu from './ProfileMenu.jsx'
import HomeButton from './HomeButton.jsx'

// ─── CV types ─────────────────────────────────────────────────────────────────

const CV_TYPES = [
  {
    id: 'academic',
    label: 'Academic CV',
    Icon: GraduationCap,
    color: '#2D7A52',
    bg: '#E4F5EC',
    border: '#4F8A6E28',
    tagline: 'For university applications',
    desc: 'Highlights your education, academic performance, research, and field-relevant skills. Clean and fact-driven.',
  },
  {
    id: 'scholarship',
    label: 'Scholarship CV',
    Icon: Trophy,
    color: '#9A5010',
    bg: '#FDF0E6',
    border: '#E07A2F28',
    tagline: 'For funding applications',
    desc: 'Leads with achievements and leadership. Shows who you are beyond grades — your impact and potential.',
  },
  {
    id: 'graduate',
    label: 'Graduate School CV',
    Icon: FlaskConical,
    color: '#3B5BA5',
    bg: '#EEF2FB',
    border: '#3B5BA528',
    tagline: "For master's & PhD applications",
    desc: 'Centres on your research background, academic intent, and how your experience prepares you for graduate study.',
  },
]

// ─── form sections ────────────────────────────────────────────────────────────

const FORM_SECTIONS = [
  {
    key: 'education',
    label: 'Education',
    Icon: GraduationCap,
    required: true,
    placeholder: 'List your schools newest-first.\ne.g.\nUniversity of Lagos, BSc Computer Science, 2022–2026 (expected)\nXYZ Secondary School, 2016–2022',
    hint: 'Include institution, degree, dates, and any notable grades.',
    keyFor: ['academic', 'scholarship', 'graduate'],
  },
  {
    key: 'grades',
    label: 'Academic Performance',
    Icon: Star,
    required: false,
    placeholder: "e.g.\nGPA 4.2/5.0 · Dean's List 2022–2024 · 3rd in class of 120\nWASSCE: 7 A*s",
    hint: 'GPA, class rank, honours, exam scores, or other notable results.',
    keyFor: ['academic', 'graduate'],
  },
  {
    key: 'achievements',
    label: 'Achievements & Awards',
    Icon: Trophy,
    required: false,
    placeholder: 'e.g.\nNational coding competition winner, 2023\nSchool prize — best mathematics student, 2021\nDepartmental scholarship recipient',
    hint: 'Prizes, competitions, bursaries, or recognition. Include year and context.',
    keyFor: ['scholarship'],
  },
  {
    key: 'research',
    label: 'Research & Projects',
    Icon: FlaskConical,
    required: false,
    placeholder: 'e.g.\nFinal-year project: AI crop disease detection using CNN (2024)\nLab assistant — protein folding research, Prof Smith\'s lab (2023)\nPublished: "Title" — Journal of Y, 2024',
    hint: 'Research, lab work, academic papers, capstone projects, or notable coursework.',
    keyFor: ['academic', 'graduate'],
  },
  {
    key: 'activities',
    label: 'Leadership & Activities',
    Icon: Users,
    required: false,
    placeholder: 'e.g.\nPresident, Computer Science Society, 2023–2024 — organised 3 hackathons\nVolunteer tutor, local secondary school, 2022\nMember, university debate club',
    hint: 'Clubs, sports, volunteering, student government. Include your role and impact.',
    keyFor: ['scholarship'],
  },
  {
    key: 'experience',
    label: 'Work & Volunteer Experience',
    Icon: Briefcase,
    required: false,
    placeholder: 'e.g.\nSoftware intern, TechCorp, Jun–Aug 2023 — built REST APIs serving 10,000+ daily users\nVolunteer, Lagos Food Bank, 2022 — packed and delivered 200+ food parcels weekly',
    hint: 'Jobs, internships, placements, or volunteering. Describe what you did and any impact.',
    keyFor: ['scholarship', 'graduate'],
  },
  {
    key: 'skills',
    label: 'Skills',
    Icon: Wrench,
    required: false,
    placeholder: 'e.g.\nProgramming: Python, JavaScript, React, SQL\nLanguages: English (native), French (conversational)\nSoftware: MATLAB, AutoCAD, Figma',
    hint: 'Technical skills, spoken languages, software, certifications, or lab techniques.',
    keyFor: ['academic', 'graduate'],
  },
  {
    key: 'statement',
    label: 'Goals & Personal Statement',
    Icon: Target,
    required: false,
    placeholder: 'e.g.\nI am applying for the DAAD scholarship to pursue a master\'s in AI at TU Berlin. My goal is to build machine learning tools that improve agricultural productivity in West Africa...',
    hint: 'Your goals and motivation. Optional — but especially valuable for scholarship and graduate CVs.',
    keyFor: ['scholarship', 'graduate'],
  },
]

const EMPTY_FORM = {
  name: '', email: '', phone: '', location: '',
  education: '', grades: '', achievements: '', research: '',
  activities: '', experience: '', skills: '', statement: '',
}

// ─── CV-specific markdown renderer ────────────────────────────────────────────

const CV_MD = {
  h1: ({ children }) => (
    <div style={{ marginBottom: 6 }}>
      <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1.55rem', fontWeight: 700, color: '#16302B', margin: 0, lineHeight: 1.2 }}>
        {children}
      </h1>
    </div>
  ),
  h2: ({ children }) => (
    <div style={{ marginTop: 20, marginBottom: 8, paddingBottom: 5, borderBottom: '1.5px solid #16302B18' }}>
      <h2 style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.7rem', fontWeight: 800, color: '#4F8A6E', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
        {children}
      </h2>
    </div>
  ),
  hr: () => <hr style={{ border: 'none', borderTop: '1px solid #16302B14', margin: '10px 0' }} />,
  p: ({ children }) => (
    <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.88rem', color: '#16302B', lineHeight: 1.6, margin: '0 0 5px' }}>
      {children}
    </p>
  ),
  strong: ({ children }) => <strong style={{ fontWeight: 700, color: '#16302B' }}>{children}</strong>,
  em: ({ children }) => <em style={{ fontStyle: 'italic', color: '#16302B88' }}>{children}</em>,
  ul: ({ children }) => <ul style={{ margin: '3px 0 8px', paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 2 }}>{children}</ul>,
  ol: ({ children }) => <ol style={{ margin: '3px 0 8px', paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 2 }}>{children}</ol>,
  li: ({ children }) => (
    <li style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.875rem', color: '#16302B', lineHeight: 1.55 }}>
      {children}
    </li>
  ),
}

// ─── page shell (module-level — MUST NOT be defined inside CvBuilder) ─────────
// Defining a component inside another component's render function creates a new
// function reference on every re-render, so React unmounts/remounts the whole
// subtree and every input loses focus after a single keystroke.

function PageShell({ topRef, onGoToDashboard, user, firstName, onSignOut, onGoToPrivacy, onGoToTerms, onDeleted, onGoToPricing, children }) {
  return (
    <>
      <style>{`
        .cv-section-anim { animation: cv-in 0.3s ease both; }
        @keyframes cv-in { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .cv-textarea { font-family:'Hanken Grotesk',sans-serif; font-size:0.9rem; color:#16302B; line-height:1.6; background:#fff; border:1.5px solid #16302B1a; border-radius:14px; padding:12px 14px; width:100%; box-sizing:border-box; resize:vertical; min-height:100px; outline:none; transition:border-color 0.2s, box-shadow 0.2s; }
        .cv-textarea:focus { border-color:rgba(79,138,110,0.45); box-shadow:0 4px 16px rgba(22,48,43,0.09); }
        .cv-textarea::placeholder { color:#16302B44; }
        .cv-input { font-family:'Hanken Grotesk',sans-serif; font-size:0.9rem; color:#16302B; background:#fff; border:1.5px solid #16302B1a; border-radius:12px; padding:10px 14px; width:100%; box-sizing:border-box; outline:none; transition:border-color 0.2s, box-shadow 0.2s; }
        .cv-input:focus { border-color:rgba(79,138,110,0.45); box-shadow:0 4px 16px rgba(22,48,43,0.09); }
        .cv-input::placeholder { color:#16302B44; }
      `}</style>
      <div style={{ background: '#F7F4EE', minHeight: '100vh' }}>
        <header className="sticky top-0 z-50" style={{ background: '#F7F4EEf8', borderBottom: '1px solid #16302B1a', backdropFilter: 'blur(8px)' }}>
          <div className="max-w-3xl mx-auto px-5 sm:px-6 py-3 flex items-center justify-between gap-3">
            <HomeButton onClick={onGoToDashboard} />
            <span style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '1rem', fontWeight: 600 }}>CV Builder</span>
            <ProfileMenu user={user} firstName={firstName} onSignOut={onSignOut} onGoToPrivacy={onGoToPrivacy} onGoToTerms={onGoToTerms} onDeleted={onDeleted} onGoToPricing={onGoToPricing} />
          </div>
        </header>
        <main ref={topRef} className="max-w-3xl mx-auto px-5 sm:px-6 pt-8 pb-24">
          {children}
        </main>
      </div>
    </>
  )
}

// ─── main component ───────────────────────────────────────────────────────────

export default function CvBuilder({ firstName, user, isPaid, onGoToPricing, onGoToDashboard, onSignOut, onGoToPrivacy, onGoToTerms, onDeleted }) {

  const [step,          setStep]         = useState(1)  // 1=type, 2=form, 3=result
  const [cvType,        setCvType]       = useState(null)
  const [form,          setForm]         = useState(EMPTY_FORM)
  const [generatedCv,   setGeneratedCv]  = useState(null)
  const [loading,       setLoading]      = useState(false)
  const [error,         setError]        = useState(null)
  const [savedCvs,      setSavedCvs]    = useState([])
  const [saving,        setSaving]      = useState(false)
  const [savedCurrentId, setSavedCurrentId] = useState(null)
  const [copySuccess,   setCopySuccess]  = useState(false)
  const [formError,     setFormError]   = useState(null)

  const topRef = useRef(null)

  // CV Builder is paid-only. `isPaid` comes from the user's subscription
  // (App.jsx) and only controls what renders — the build-cv edge function
  // re-checks the subscription server-side on every call.
  const typeConfig = CV_TYPES.find(t => t.id === cvType)

  // shellProps is passed to the module-level PageShell (defined outside this component
  // so its identity stays stable across re-renders — prevents focus loss on input)
  const shellProps = { topRef, onGoToDashboard, user, firstName, onSignOut, onGoToPrivacy, onGoToTerms, onDeleted, onGoToPricing }

  // ── Load saved CVs ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user || !supabase) return
    supabase.from('user_cvs').select('id, cv_type, cv_name, cv_text, form_data, created_at')
      .eq('user_id', user.id).order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setSavedCvs(data) })
      .catch(() => {})
  }, [user])

  function setField(key, value) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function pickType(id) {
    setCvType(id)
    setGeneratedCv(null)
    setSavedCurrentId(null)
    setStep(2)
    setTimeout(() => topRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  // ── Generate ─────────────────────────────────────────────────────────────────
  async function handleGenerate(e) {
    e.preventDefault()
    if (loading) return
    if (!form.name.trim()) { setFormError('Please enter your full name.'); return }
    if (!form.education.trim() && !form.experience.trim() && !form.achievements.trim()) {
      setFormError('Please fill in at least your Education or Experience before generating.'); return
    }
    setFormError(null)
    setError(null)
    setLoading(true)
    setSavedCurrentId(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      if (!token) throw new Error('Not authenticated')

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/build-cv`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ cvType, form }),
        }
      )
      const data = await res.json()

      if (data.paidOnly) {
        setError('Upgrade to generate a CV with AI.')
      } else {
        setGeneratedCv(data.reply)
        setStep(3)
        setTimeout(() => topRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
      }
    } catch (err) {
      console.error('build-cv error:', err)
      setError("Couldn't reach the AI — please try again in a moment.")
    } finally {
      setLoading(false)
    }
  }

  // ── Copy ──────────────────────────────────────────────────────────────────────
  async function handleCopy() {
    if (!generatedCv) return
    try {
      await navigator.clipboard.writeText(generatedCv)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2200)
    } catch { /* silently ignore */ }
  }

  // ── Download ──────────────────────────────────────────────────────────────────
  function handleDownload() {
    if (!generatedCv) return
    const name = form.name.trim().replace(/\s+/g, '_') || 'My'
    const blob = new Blob([generatedCv], { type: 'text/plain;charset=utf-8' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `${name}_CV.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // ── Save ──────────────────────────────────────────────────────────────────────
  async function handleSave() {
    if (!generatedCv || saving || !supabase || !user) return
    setSaving(true)
    try {
      const { data, error } = await supabase.from('user_cvs').insert({
        user_id:   user.id,
        cv_type:   cvType,
        cv_name:   form.name.trim() || 'Unnamed',
        cv_text:   generatedCv,
        form_data: form,
      }).select().single()

      if (!error && data) {
        setSavedCurrentId(data.id)
        setSavedCvs(prev => [data, ...prev])
      }
    } catch { /* silent */ } finally {
      setSaving(false)
    }
  }

  // ── Load saved ────────────────────────────────────────────────────────────────
  function handleLoadSaved(saved) {
    setCvType(saved.cv_type)
    setGeneratedCv(saved.cv_text)
    if (saved.form_data) setForm({ ...EMPTY_FORM, ...saved.form_data })
    setSavedCurrentId(saved.id)
    setStep(3)
    setTimeout(() => topRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  // ── Delete saved ──────────────────────────────────────────────────────────────
  async function handleDeleteSaved(id) {
    if (!supabase || !user) return
    await supabase.from('user_cvs').delete().eq('id', id).eq('user_id', user.id)
    setSavedCvs(prev => prev.filter(c => c.id !== id))
    if (savedCurrentId === id) setSavedCurrentId(null)
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // PAID-ONLY UPGRADE WALL — shown immediately, before any form or generation
  // ─────────────────────────────────────────────────────────────────────────────
  if (!isPaid) return (
    <PageShell {...shellProps}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 600, lineHeight: 1.2, margin: '0 0 8px' }}>
          Build your CV
        </h1>
        <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B88', fontSize: '0.95rem', lineHeight: 1.6, margin: 0, maxWidth: 500 }}>
          Choose the type of CV you need. The AI will structure and phrase your real information professionally — nothing is invented.
        </p>
      </div>

      <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #16302B0d', boxShadow: '0 2px 10px rgba(22,48,43,0.06)', padding: 'clamp(32px, 7vw, 48px) clamp(24px, 6vw, 40px)', textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#FDF0E6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Sparkles size={26} color="#E07A2F" strokeWidth={1.8} />
        </div>
        <p style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: 'clamp(1.1rem, 3vw, 1.3rem)', fontWeight: 600, lineHeight: 1.4, margin: '0 auto 10px', maxWidth: 440 }}>
          Find your options free — upgrade when you want the AI to help you get in.
        </p>
        <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B88', fontSize: '0.92rem', lineHeight: 1.6, margin: '0 auto 24px', maxWidth: 420 }}>
          ✨ Unlock essay review, CV builder, mock interviews, and unlimited AI guidance — from $14.99/month.
        </p>
        <button onClick={onGoToPricing} style={{ background: '#E07A2F', color: '#fff', border: 'none', borderRadius: 100, padding: '11px 30px', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
          See plans →
        </button>
      </div>
    </PageShell>
  )

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP 1 — Type selection
  // ─────────────────────────────────────────────────────────────────────────────
  if (step === 1) return (
    <PageShell {...shellProps}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 600, lineHeight: 1.2, margin: '0 0 8px' }}>
          Build your CV
        </h1>
        <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B88', fontSize: '0.95rem', lineHeight: 1.6, margin: 0, maxWidth: 500 }}>
          Choose the type of CV you need. The AI will structure and phrase your real information professionally — nothing is invented.
        </p>
      </div>

      {/* Type cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 36 }}>
        {CV_TYPES.map(t => (
          <button
            key={t.id}
            onClick={() => pickType(t.id)}
            style={{
              background: '#fff', borderRadius: 20, border: `1.5px solid ${t.border}`,
              padding: '22px 24px', cursor: 'pointer', textAlign: 'left',
              display: 'flex', alignItems: 'flex-start', gap: 18,
              boxShadow: '0 2px 10px rgba(22,48,43,0.06)',
              transition: 'box-shadow 0.2s, transform 0.2s, border-color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 10px 36px rgba(22,48,43,0.11)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = t.color + '44' }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 10px rgba(22,48,43,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = t.border }}
          >
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <t.Icon size={22} color={t.color} strokeWidth={1.8} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: t.color, margin: '0 0 3px' }}>
                {t.tagline}
              </p>
              <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '1.1rem', fontWeight: 600, margin: '0 0 5px', lineHeight: 1.2 }}>
                {t.label}
              </h2>
              <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B80', fontSize: '0.875rem', margin: 0, lineHeight: 1.5 }}>
                {t.desc}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Saved CVs */}
      {savedCvs.length > 0 && (
        <div>
          <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: '#16302B55', margin: '0 0 12px' }}>
            Your saved CVs
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {savedCvs.map(cv => {
              const type = CV_TYPES.find(t => t.id === cv.cv_type)
              const date = new Date(cv.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
              return (
                <div key={cv.id} style={{ background: '#fff', borderRadius: 14, border: '1px solid #16302B0d', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <button
                    onClick={() => handleLoadSaved(cv)}
                    style={{ flex: 1, textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: 0, minWidth: 0 }}
                  >
                    <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.68rem', color: type?.color ?? '#16302B88', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 3px' }}>
                      {type?.label ?? cv.cv_type} · {date}
                    </p>
                    <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.9rem', color: '#16302B', margin: 0, lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {cv.cv_name}
                    </p>
                  </button>
                  <button
                    onClick={() => handleDeleteSaved(cv.id)}
                    title="Delete this CV"
                    style={{ flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 8, color: '#16302B44', transition: 'color 0.15s, background 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#9B2335'; e.currentTarget.style.background = '#9B233510' }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#16302B44'; e.currentTarget.style.background = 'none' }}
                  >
                    <Trash2 size={14} strokeWidth={2} />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </PageShell>
  )

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP 2 — Form
  // ─────────────────────────────────────────────────────────────────────────────
  if (step === 2) return (
    <PageShell {...shellProps}>
      {/* Type badge + back */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button
          onClick={() => setStep(1)}
          style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.82rem', color: '#16302B88', fontWeight: 500, padding: 0, flexShrink: 0 }}
          onMouseEnter={e => (e.currentTarget.style.color = '#16302B')}
          onMouseLeave={e => (e.currentTarget.style.color = '#16302B88')}
        >
          <ChevronLeft size={14} strokeWidth={2.5} />
          Change type
        </button>
        {typeConfig && (
          <span style={{ background: typeConfig.bg, color: typeConfig.color, borderRadius: 100, padding: '4px 12px', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.04em' }}>
            {typeConfig.label}
          </span>
        )}
      </div>

      <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: 'clamp(1.4rem, 4vw, 1.9rem)', fontWeight: 600, lineHeight: 1.2, margin: '0 0 6px' }}>
        Your information
      </h1>
      <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B88', fontSize: '0.9rem', lineHeight: 1.6, margin: '0 0 28px', maxWidth: 500 }}>
        Fill in as much as you can. The AI will only include sections where you&apos;ve provided real information — nothing is invented.
      </p>

      <form onSubmit={handleGenerate}>

        {/* Personal details — 2-col grid */}
        <div style={{ background: '#fff', borderRadius: 18, border: '1px solid #16302B0d', padding: '22px 22px 18px', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#EAF3EE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FileText size={15} color="#4F8A6E" strokeWidth={2} />
            </div>
            <span style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1rem', fontWeight: 600, color: '#16302B' }}>Personal Details</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { key: 'name',     label: 'Full Name *', placeholder: 'e.g. Amara Osei' },
              { key: 'email',    label: 'Email',       placeholder: 'e.g. amara@email.com' },
              { key: 'phone',    label: 'Phone',       placeholder: 'e.g. +233 20 123 4567' },
              { key: 'location', label: 'City / Country', placeholder: 'e.g. Accra, Ghana' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.78rem', fontWeight: 600, color: '#16302B88', display: 'block', marginBottom: 5, letterSpacing: '0.01em' }}>
                  {label}
                </label>
                <input
                  className="cv-input"
                  type="text"
                  value={form[key]}
                  onChange={e => setField(key, e.target.value)}
                  placeholder={placeholder}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Textarea sections */}
        {FORM_SECTIONS.map(sec => {
          const isKey = sec.keyFor.includes(cvType)
          return (
            <div key={sec.key} style={{ background: '#fff', borderRadius: 18, border: `1px solid ${isKey ? sec.key === 'education' ? '#4F8A6E20' : '#16302B10' : '#16302B0a'}`, padding: '18px 22px', marginBottom: 14, opacity: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: isKey ? '#EAF3EE' : '#F0EDE7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <sec.Icon size={14} color={isKey ? '#4F8A6E' : '#16302B66'} strokeWidth={2} />
                </div>
                <span style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '0.95rem', fontWeight: 600, color: '#16302B' }}>{sec.label}</span>
                {isKey && (
                  <span style={{ background: '#EAF3EE', color: '#4F8A6E', borderRadius: 100, padding: '2px 9px', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.04em', marginLeft: 4 }}>
                    Key
                  </span>
                )}
              </div>
              <textarea
                className="cv-textarea"
                rows={4}
                value={form[sec.key]}
                onChange={e => setField(sec.key, e.target.value)}
                placeholder={sec.placeholder}
              />
              <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.76rem', color: '#16302B55', margin: '5px 0 0', lineHeight: 1.5 }}>
                {sec.hint}
              </p>
            </div>
          )
        })}

        {/* Errors */}
        {formError && (
          <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.85rem', color: '#9B2335', margin: '0 0 16px', background: '#FDF2F4', borderRadius: 10, padding: '10px 14px' }}>
            {formError}
          </p>
        )}
        {error && (
          <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.85rem', color: '#9B2335', margin: '0 0 16px', background: '#FDF2F4', borderRadius: 10, padding: '10px 14px' }}>
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%', padding: '14px 24px', background: loading ? '#16302B44' : '#16302B',
            color: '#F7F4EE', border: 'none', borderRadius: 100, cursor: loading ? 'default' : 'pointer',
            fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.975rem', fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = '0.88' }}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          {loading ? (
            <>
              <Sparkles size={16} strokeWidth={2} className="animate-spin" />
              Generating your CV…
            </>
          ) : (
            <>
              <Sparkles size={16} strokeWidth={2} />
              Generate my {typeConfig?.label ?? 'CV'}
            </>
          )}
        </button>
      </form>
    </PageShell>
  )

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP 3 — Result
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <PageShell {...shellProps}>
      {/* Breadcrumb + actions */}
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
        <button
          onClick={() => setStep(2)}
          style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.82rem', color: '#16302B88', fontWeight: 500, padding: 0, flexShrink: 0 }}
          onMouseEnter={e => (e.currentTarget.style.color = '#16302B')}
          onMouseLeave={e => (e.currentTarget.style.color = '#16302B88')}
        >
          <ChevronLeft size={14} strokeWidth={2.5} />
          Edit info
        </button>
        {typeConfig && (
          <span style={{ background: typeConfig.bg, color: typeConfig.color, borderRadius: 100, padding: '4px 12px', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.04em' }}>
            {typeConfig.label}
          </span>
        )}
        <div style={{ flex: 1 }} />
        {/* Action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={handleCopy}
            title="Copy to clipboard"
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: copySuccess ? '#E4F5EC' : '#fff', border: `1.5px solid ${copySuccess ? '#4F8A6E44' : '#16302B1a'}`, borderRadius: 100, padding: '7px 15px', cursor: 'pointer', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.82rem', fontWeight: 600, color: copySuccess ? '#2D7A52' : '#16302B', transition: 'all 0.2s' }}
          >
            {copySuccess ? <Check size={13} strokeWidth={2.5} /> : <Copy size={13} strokeWidth={2} />}
            {copySuccess ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={handleDownload}
            title="Download as .txt"
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', border: '1.5px solid #16302B1a', borderRadius: 100, padding: '7px 15px', cursor: 'pointer', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.82rem', fontWeight: 600, color: '#16302B', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#16302B44' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#16302B1a' }}
          >
            <Download size={13} strokeWidth={2} />
            Download
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !!savedCurrentId}
            title={savedCurrentId ? 'Saved' : 'Save this CV'}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: savedCurrentId ? '#E4F5EC' : '#16302B', border: 'none', borderRadius: 100, padding: '7px 15px', cursor: (saving || savedCurrentId) ? 'default' : 'pointer', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.82rem', fontWeight: 600, color: savedCurrentId ? '#2D7A52' : '#F7F4EE', transition: 'opacity 0.2s' }}
            onMouseEnter={e => { if (!saving && !savedCurrentId) e.currentTarget.style.opacity = '0.85' }}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            {savedCurrentId ? <BookmarkCheck size={13} strokeWidth={2.5} /> : <BookmarkPlus size={13} strokeWidth={2} />}
            {saving ? 'Saving…' : savedCurrentId ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>

      {/* Regenerate button */}
      <div style={{ marginBottom: 14, display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: '1.5px solid #16302B1a', borderRadius: 100, padding: '6px 14px', cursor: loading ? 'default' : 'pointer', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.78rem', fontWeight: 500, color: '#16302B88', transition: 'all 0.15s' }}
          onMouseEnter={e => { if (!loading) { e.currentTarget.style.borderColor = '#16302B44'; e.currentTarget.style.color = '#16302B' } }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#16302B1a'; e.currentTarget.style.color = '#16302B88' }}
        >
          <RotateCcw size={12} strokeWidth={2.5} />
          Regenerate
        </button>
      </div>

      {/* CV display */}
      <div className="cv-section-anim" style={{ background: '#fff', borderRadius: 20, border: '1px solid #16302B0d', padding: 'clamp(24px, 5vw, 40px)', boxShadow: '0 4px 24px rgba(22,48,43,0.07)', lineHeight: 1.6 }}>
        <ReactMarkdown components={CV_MD}>{generatedCv}</ReactMarkdown>
      </div>

      {/* Honesty note */}
      <div style={{ marginTop: 16, padding: '12px 16px', background: '#EAF3EE44', borderRadius: 12, border: '1px solid #4F8A6E18' }}>
        <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.78rem', color: '#16302B88', margin: 0, lineHeight: 1.55 }}>
          <strong style={{ color: '#2D7A52', fontWeight: 700 }}>Honesty note:</strong> AdmitAI only formats and rephrases information you provided — it never invents achievements, grades, or experience you didn&apos;t include.
        </p>
      </div>

      {/* Saved CVs */}
      {savedCvs.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: '#16302B55', margin: '0 0 12px' }}>
            Your saved CVs
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {savedCvs.map(cv => {
              const type = CV_TYPES.find(t => t.id === cv.cv_type)
              const date = new Date(cv.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
              const isActive = cv.id === savedCurrentId
              return (
                <div key={cv.id} style={{ background: isActive ? '#EAF3EE' : '#fff', borderRadius: 14, border: `1px solid ${isActive ? '#4F8A6E28' : '#16302B0d'}`, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <button
                    onClick={() => handleLoadSaved(cv)}
                    style={{ flex: 1, textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: 0, minWidth: 0 }}
                  >
                    <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.68rem', color: type?.color ?? '#16302B88', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 3px' }}>
                      {type?.label ?? cv.cv_type} · {date}
                    </p>
                    <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.9rem', color: '#16302B', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {cv.cv_name}
                    </p>
                  </button>
                  <button
                    onClick={() => handleDeleteSaved(cv.id)}
                    title="Delete"
                    style={{ flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 8, color: '#16302B44', transition: 'color 0.15s, background 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#9B2335'; e.currentTarget.style.background = '#9B233510' }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#16302B44'; e.currentTarget.style.background = 'none' }}
                  >
                    <Trash2 size={14} strokeWidth={2} />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </PageShell>
  )
}
