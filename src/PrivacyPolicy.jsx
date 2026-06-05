import { ArrowLeft } from 'lucide-react'

export default function PrivacyPolicy({ onBack }) {
  return (
    <div style={{ background: '#F7F4EE', minHeight: '100vh' }}>
      {/* Minimal nav */}
      <header className="border-b sticky top-0 z-50" style={{ background: '#F7F4EEf8', borderColor: '#16302B1a', backdropFilter: 'blur(8px)' }}>
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B88', fontSize: '0.875rem', fontWeight: 500, padding: 0 }}
            onMouseEnter={e => (e.currentTarget.style.color = '#16302B')}
            onMouseLeave={e => (e.currentTarget.style.color = '#16302B88')}
          >
            <ArrowLeft size={16} strokeWidth={2} />
            Back
          </button>
          <span style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '1rem', fontWeight: 600 }}>
            AdmitAI
          </span>
          <div style={{ width: 60 }} />
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 pt-12 pb-24">
        <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: '#4F8A6E', marginBottom: 14 }}>
          Legal
        </p>
        <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 600, lineHeight: 1.15, margin: '0 0 10px' }}>
          Privacy Policy
        </h1>
        <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B66', fontSize: '0.875rem', margin: '0 0 40px' }}>
          Last updated: [DATE]
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

          {/* ── PASTE YOUR POLICY TEXT IN THE SECTIONS BELOW ── */}

          <PolicySection title="1. Who we are">
            {/* PASTE PRIVACY POLICY TEXT HERE */}
            <Placeholder text="Describe your organisation and this policy's scope here." />
          </PolicySection>

          <PolicySection title="2. What data we collect">
            <Placeholder text="List the categories of data you collect (e.g. account data, usage data, AI chat messages, application tracking data)." />
          </PolicySection>

          <PolicySection title="3. How we use your data">
            <Placeholder text="Explain each purpose for which you process personal data, and the legal basis for each." />
          </PolicySection>

          <PolicySection title="4. How long we keep your data">
            <Placeholder text="State your retention periods for each category of data." />
          </PolicySection>

          <PolicySection title="5. Who we share data with">
            <Placeholder text="List third-party processors (e.g. Supabase for authentication and data storage, Anthropic for AI features) and the purpose of each." />
          </PolicySection>

          <PolicySection title="6. AI features">
            <Placeholder text="Explain that messages sent to the AdmitAI chat feature are processed by the Anthropic API, and describe any relevant data handling." />
          </PolicySection>

          <PolicySection title="7. Your rights">
            <Placeholder text="State user rights (access, correction, deletion, portability, etc.) and how to exercise them. Note that users can delete their account and all associated data from within the app." />
          </PolicySection>

          <PolicySection title="8. Cookies and tracking">
            <Placeholder text="Describe any cookies or tracking technologies used." />
          </PolicySection>

          <PolicySection title="9. Children and young people">
            <Placeholder text="This service may be used by students under 18. Describe your approach to protecting younger users and any parental consent requirements." />
          </PolicySection>

          <PolicySection title="10. Changes to this policy">
            <Placeholder text="Explain how users will be informed of future changes." />
          </PolicySection>

          <PolicySection title="11. Contact us">
            <Placeholder text="Provide your contact details for privacy-related queries. Email: [CONTACT EMAIL]" />
          </PolicySection>

        </div>
      </main>
    </div>
  )
}

function PolicySection({ title, children }) {
  return (
    <section>
      <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '1.15rem', fontWeight: 600, margin: '0 0 12px', lineHeight: 1.25 }}>
        {title}
      </h2>
      <div style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.95rem', color: '#16302B', lineHeight: 1.7 }}>
        {children}
      </div>
    </section>
  )
}

function Placeholder({ text }) {
  return (
    <div style={{ background: '#FDF0E6', border: '1px dashed #E07A2F55', borderRadius: 10, padding: '14px 18px' }}>
      <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.85rem', color: '#9A5010', fontStyle: 'italic', margin: 0, lineHeight: 1.6 }}>
        ✏️ PASTE PRIVACY POLICY TEXT HERE — {text}
      </p>
    </div>
  )
}
