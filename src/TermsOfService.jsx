import { ArrowLeft } from 'lucide-react'

export default function TermsOfService({ onBack }) {
  return (
    <div style={{ background: '#F7F4EE', minHeight: '100vh' }}>
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

      <main className="max-w-3xl mx-auto px-6 pt-12 pb-24">
        <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: '#4F8A6E', marginBottom: 14 }}>
          Legal
        </p>
        <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 600, lineHeight: 1.15, margin: '0 0 10px' }}>
          Terms of Service
        </h1>
        <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B66', fontSize: '0.875rem', margin: '0 0 40px' }}>
          Last updated: [DATE]
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

          <TermsSection title="1. About AdmitAI">
            <Placeholder text="Describe AdmitAI's purpose — an educational guidance tool to help students research universities and scholarships. State it is not a qualified financial or admissions advisor." />
          </TermsSection>

          <TermsSection title="2. Eligibility and accounts">
            <Placeholder text="State who may use the service (e.g. anyone, but if under 18 they should have parental awareness). Describe account creation rules." />
          </TermsSection>

          <TermsSection title="3. Acceptable use">
            <Placeholder text="Describe acceptable and prohibited uses of the service." />
          </TermsSection>

          <TermsSection title="4. Information accuracy">
            <Placeholder text="Explain that all cost estimates, scholarship details, and university information provided by AdmitAI are illustrative and may not be current — users must verify all figures with official sources before applying. The AI chat may also contain errors and should not be relied upon as professional advice." />
          </TermsSection>

          <TermsSection title="5. AI features">
            <Placeholder text="Describe the AI chat feature, note it is powered by third-party AI (Anthropic Claude), and state that AdmitAI does not guarantee the accuracy of AI-generated responses." />
          </TermsSection>

          <TermsSection title="6. Your data">
            <Placeholder text="Refer to the Privacy Policy for how user data is handled. State that users can delete their account and all data at any time." />
          </TermsSection>

          <TermsSection title="7. Intellectual property">
            <Placeholder text="State who owns the content and software, and what rights users have." />
          </TermsSection>

          <TermsSection title="8. Limitation of liability">
            <Placeholder text="State the extent to which AdmitAI is not liable for decisions users make based on information from the service." />
          </TermsSection>

          <TermsSection title="9. Changes to these terms">
            <Placeholder text="Explain how you will notify users of material changes." />
          </TermsSection>

          <TermsSection title="10. Governing law">
            <Placeholder text="State the governing jurisdiction." />
          </TermsSection>

          <TermsSection title="11. Contact">
            <Placeholder text="Email: [CONTACT EMAIL]" />
          </TermsSection>

        </div>
      </main>
    </div>
  )
}

function TermsSection({ title, children }) {
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
        ✏️ PASTE TERMS TEXT HERE — {text}
      </p>
    </div>
  )
}
