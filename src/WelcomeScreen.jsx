// Arrival screen shown once after sign-up (full version) or log-in (brief version).

export default function WelcomeScreen({ mode, firstName, onContinue }) {
  const isNew = mode === 'new'

  return (
    <>
      <style>{`
        @keyframes wc-fade-up {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes wc-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .wc-icon  { animation: wc-fade-up 0.6s ease both 0.0s; }
        .wc-h1    { animation: wc-fade-up 0.6s ease both ${isNew ? '0.10s' : '0.0s'}; }
        .wc-sub   { animation: wc-fade-up 0.6s ease both 0.22s; }
        .wc-body  { animation: wc-fade-up 0.6s ease both 0.34s; }
        .wc-btn   { animation: wc-fade-up 0.6s ease both ${isNew ? '0.48s' : '0.18s'}; }
        .wc-hint  { animation: wc-fade     0.5s ease both ${isNew ? '0.72s' : '0.36s'}; }
      `}</style>

      <div
        style={{
          minHeight: '100vh',
          background: '#F7F4EE',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 24px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 480, width: '100%' }}>

          {isNew ? (
            /* ── Full welcome for new users ───────────────────────────── */
            <>
              <div className="wc-icon" style={{ fontSize: '2.8rem', lineHeight: 1, marginBottom: 28 }}>
                🌱
              </div>

              <h1
                className="wc-h1"
                style={{
                  fontFamily: 'Fraunces, Georgia, serif',
                  color: '#16302B',
                  fontSize: 'clamp(2rem, 6vw, 3rem)',
                  fontWeight: 600,
                  lineHeight: 1.15,
                  margin: '0 0 14px',
                }}
              >
                Welcome, {firstName} 👋
              </h1>

              <p
                className="wc-sub"
                style={{
                  fontFamily: 'Fraunces, Georgia, serif',
                  color: '#E07A2F',
                  fontSize: 'clamp(1.1rem, 3vw, 1.35rem)',
                  fontWeight: 500,
                  fontStyle: 'italic',
                  lineHeight: 1.3,
                  margin: '0 0 20px',
                }}
              >
                You&apos;re in the right place.
              </p>

              <p
                className="wc-body"
                style={{
                  fontFamily: 'Hanken Grotesk, sans-serif',
                  color: '#16302B88',
                  fontSize: '1.05rem',
                  lineHeight: 1.65,
                  margin: '0 0 40px',
                }}
              >
                No more guessing. No more doing this alone — let&apos;s find where you can actually afford to study.
              </p>

              <button
                className="wc-btn"
                onClick={onContinue}
                style={{
                  background: '#E07A2F',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 100,
                  padding: '15px 36px',
                  fontFamily: 'Hanken Grotesk, sans-serif',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 6px 24px rgba(224,122,47,0.32)',
                }}
              >
                Let&apos;s build your board →
              </button>

              <p
                className="wc-hint"
                style={{
                  fontFamily: 'Hanken Grotesk, sans-serif',
                  fontSize: '0.78rem',
                  color: '#16302B44',
                  marginTop: 18,
                }}
              >
                Takes about 1 minute.
              </p>
            </>
          ) : (
            /* ── Brief welcome-back for returning users ───────────────── */
            <>
              <h1
                className="wc-h1"
                style={{
                  fontFamily: 'Fraunces, Georgia, serif',
                  color: '#16302B',
                  fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
                  fontWeight: 600,
                  lineHeight: 1.2,
                  margin: '0 0 10px',
                }}
              >
                Welcome back, {firstName} 👋
              </h1>

              <p
                className="wc-body"
                style={{
                  fontFamily: 'Hanken Grotesk, sans-serif',
                  color: '#16302B77',
                  fontSize: '1rem',
                  lineHeight: 1.55,
                  margin: '0 0 32px',
                }}
              >
                Ready to explore your options?
              </p>

              <button
                className="wc-btn"
                onClick={onContinue}
                style={{
                  background: '#16302B',
                  color: '#F7F4EE',
                  border: 'none',
                  borderRadius: 100,
                  padding: '13px 32px',
                  fontFamily: 'Hanken Grotesk, sans-serif',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Build my board →
              </button>
            </>
          )}
        </div>
      </div>
    </>
  )
}
