import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initSentry, Sentry } from './sentry.js'

// Start error tracking before anything renders so we catch startup errors too.
initSentry()

// Shown only if the whole app crashes — otherwise the user would see a blank
// screen. Keeps them oriented and gives a one-tap recovery.
function CrashFallback() {
  return (
    <div style={{
      minHeight: '100vh', background: '#F7F4EE', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: 24,
      fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B',
    }}>
      <div style={{
        background: '#fff', border: '1px solid #16302B0d', borderRadius: 20,
        boxShadow: '0 2px 10px rgba(22,48,43,0.06)', padding: '40px 32px',
        textAlign: 'center', maxWidth: 420,
      }}>
        <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1.35rem', fontWeight: 600, margin: '0 0 10px' }}>
          Something went wrong
        </h1>
        <p style={{ color: '#16302B88', fontSize: '0.95rem', lineHeight: 1.6, margin: '0 0 22px' }}>
          The page hit an unexpected error — our team has been notified. Please reload and try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            background: '#E07A2F', color: '#fff', border: 'none', borderRadius: 100,
            padding: '11px 26px', fontFamily: 'Hanken Grotesk, sans-serif',
            fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
          }}
        >
          Reload
        </button>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Sentry.ErrorBoundary fallback={<CrashFallback />}>
      <App />
    </Sentry.ErrorBoundary>
  </StrictMode>,
)
