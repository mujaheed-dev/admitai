import HomeButton from './HomeButton.jsx'
import { CONTACT_EMAIL } from './config.js'

export default function PrivacyPolicy({ onBack }) {
  return (
    <div style={{ background: '#F7F4EE', minHeight: '100vh' }}>
      {/* Minimal nav */}
      <header className="border-b sticky top-0 z-50" style={{ background: '#F7F4EEf8', borderColor: '#16302B1a', backdropFilter: 'blur(8px)' }}>
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <HomeButton onClick={onBack} />
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
          Last updated: 14 July 2026
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

          <PolicySection title="1. Who we are">
            <p style={{ margin: '0 0 12px' }}>
              AdmitAI is operated by E-MAD TECH LIMITED, a company registered in Nigeria. AdmitAI is an educational
              guidance tool that helps students research universities and scholarships, organise their
              applications, and get AI-assisted feedback on their own work.
            </p>
            <p style={{ margin: '0 0 12px' }}>
              This policy explains what personal information we collect when you use AdmitAI, why we collect it, who
              we share it with, and the choices and rights you have. It applies to the AdmitAI website and app at
              admitai.app.
            </p>
            <p style={{ margin: 0 }}>
              We try to collect as little as we can, to be clear about what we do with it, and to make it easy for
              you to take it back.
            </p>
          </PolicySection>

          <PolicySection title="2. What data we collect">
            <p style={{ margin: '0 0 12px' }}>
              <strong>Account data.</strong> Your first name, email address, and a password. Passwords are securely
              hashed by our authentication provider — we never see them in readable form.
            </p>
            <p style={{ margin: '0 0 12px' }}>
              <strong>Study and application data.</strong> The information you enter to use the tools: your budget,
              intended field and level of study, target countries, your saved board, universities and scholarships
              you save, and the applications you track (including checklists, deadlines, and status).
            </p>
            <p style={{ margin: '0 0 12px' }}>
              <strong>AI content.</strong> What you send to our AI features and what they send back. This includes
              your chat messages, roadmap requests, essays or personal statements you paste in for feedback, the
              information you enter into the CV builder, and your answers in interview practice.
            </p>
            <p style={{ margin: '0 0 12px' }}>
              <strong>Subscription data.</strong> If you subscribe, we store which plan you are on, your
              subscription status, and a payment reference. We do not collect or store your card details — see
              section 5.
            </p>
            <p style={{ margin: '0 0 12px' }}>
              <strong>Technical data.</strong> Basic information needed to operate the service securely and
              reliably, such as usage counts for our free-use limits and error logs.
            </p>
            <p style={{ margin: 0 }}>
              We do not ask for identity documents, bank account numbers, or card details inside the app.
            </p>
          </PolicySection>

          <PolicySection title="3. How we use your data">
            <p style={{ margin: '0 0 10px' }}>
              We use your data to:
            </p>
            <ul style={{ margin: '0 0 12px', paddingLeft: 22, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>Create and secure your account, and to sign you in.</li>
              <li>
                Provide the core features: matching you to countries and universities within your budget, showing
                relevant scholarships, generating your roadmap, giving feedback on your writing, building your CV,
                running interview practice, and tracking your applications.
              </li>
              <li>
                Remember your work between visits, so your board, saved items, applications, and chat history are
                there when you return.
              </li>
              <li>Manage subscriptions, apply free-use limits and fair-use caps, and prevent abuse.</li>
              <li>
                Communicate with you about your account (for example, email confirmation, password reset, or a
                reply to a support request).
              </li>
              <li>Keep AdmitAI working, secure, and improving.</li>
            </ul>
            <p style={{ margin: '0 0 12px' }}>
              Where the law requires a legal basis (for example under GDPR), we rely on: performance of a contract
              (providing the service you asked for), your consent (which you give at sign-up and can withdraw by
              deleting your account), and our legitimate interests (keeping the service secure and preventing
              abuse).
            </p>
            <p style={{ margin: 0 }}>
              We do not sell your personal information. We do not show third-party advertising. We do not use your
              personal content to train AI models.
            </p>
          </PolicySection>

          <PolicySection title="4. How long we keep your data">
            <p style={{ margin: '0 0 12px' }}>
              We keep your account and the data connected to it for as long as your account exists, so that your
              work is there when you come back.
            </p>
            <p style={{ margin: '0 0 12px' }}>
              If you delete your account, we delete your personal data — your profile, saved board, saved
              universities, tracked applications, AI chat history, and usage records — from our active systems.
              Deletion is immediate and permanent from your side; residual copies may persist for a short period in
              routine backups held by our providers before being overwritten.
            </p>
            <p style={{ margin: 0 }}>
              We may keep a minimal record of subscription and payment transactions for as long as required by law
              (for example, for tax and accounting purposes), even after account deletion. This does not include
              card details, which we never hold.
            </p>
          </PolicySection>

          <PolicySection title="5. Who we share data with">
            <p style={{ margin: '0 0 10px' }}>
              We do not sell your data. We share it only with the service providers we need to run AdmitAI:
            </p>
            <ul style={{ margin: '0 0 12px', paddingLeft: 22, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>
                <strong>Supabase</strong> — hosts our database and handles authentication. Your account and all the
                data described in section 2 are stored here.
              </li>
              <li>
                <strong>Anthropic</strong> — provides the AI that powers our AI features. Content you send to those
                features is processed by Anthropic to generate a response (see section 6).
              </li>
              <li>
                <strong>Flutterwave</strong> — processes subscription payments. If you subscribe, you enter your
                card details directly with Flutterwave. AdmitAI never sees or stores your card number, CVV, or PIN.
                We receive only a confirmation that payment succeeded and a reference.
              </li>
              <li>
                <strong>Resend</strong> — sends our account emails (for example, confirmation and password reset).
              </li>
              <li>
                <strong>Vercel and Cloudflare</strong> — host and deliver the website.
              </li>
            </ul>
            <p style={{ margin: 0 }}>
              These providers process data on our behalf, under their own security and privacy commitments. Some of
              them may process data outside your country. We may also disclose data if we are legally required to
              do so.
            </p>
          </PolicySection>

          <PolicySection title="6. AI features">
            <p style={{ margin: '0 0 12px' }}>
              Our AI features are powered by Anthropic&apos;s Claude. When you use them, the content you enter is
              sent to Anthropic&apos;s API so that a response can be generated and returned to you.
            </p>
            <p style={{ margin: '0 0 10px' }}>
              This includes:
            </p>
            <ul style={{ margin: '0 0 12px', paddingLeft: 22, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>Your chat messages to the AI.</li>
              <li>The country, field, and level you enter for a roadmap.</li>
              <li>The full text of any essay or personal statement you paste in for feedback.</li>
              <li>The information you enter into the CV builder.</li>
              <li>Your answers during interview practice.</li>
            </ul>
            <p style={{ margin: '0 0 12px' }}>
              Please be aware that a personal statement is often deeply personal — it may describe your family,
              your circumstances, or difficulties you have faced. If you paste it in, that text is sent to our AI
              provider. Only include what you are comfortable having processed this way, and avoid entering
              sensitive information you do not need to share (for example, ID numbers or financial account
              details).
            </p>
            <p style={{ margin: '0 0 12px' }}>
              Your AI conversations are stored in your account so you can return to them, and you can delete them
              at any time — either individually or by deleting your account.
            </p>
            <p style={{ margin: 0 }}>
              We do not use your content to train AI models.
            </p>
          </PolicySection>

          <PolicySection title="7. Your rights">
            <p style={{ margin: '0 0 10px' }}>
              You have the right to:
            </p>
            <ul style={{ margin: '0 0 12px', paddingLeft: 22, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>Access the information we hold about you.</li>
              <li>
                Correct it if it is wrong — you can update your profile and your entries at any time in the app.
              </li>
              <li>
                Delete it — you can delete your account and its associated data at any time from your account menu.
                This is a real deletion, not a deactivation, and it also cancels any active subscription so you are
                not billed again.
              </li>
              <li>Withdraw consent by deleting your account.</li>
              <li>
                Object to or restrict certain processing, and to request a copy of your data, where the law of your
                country (for example GDPR) gives you those rights.
              </li>
            </ul>
            <p style={{ margin: 0 }}>
              To exercise any right that is not already available in the app, email us at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#4F8A6E', fontWeight: 600 }}>{CONTACT_EMAIL}</a>.
              We will respond as promptly as we can. If you are not satisfied with our response, you may have the
              right to complain to your local data protection authority.
            </p>
          </PolicySection>

          <PolicySection title="8. Cookies and tracking">
            <p style={{ margin: '0 0 10px' }}>
              We keep this simple. AdmitAI uses only what it needs to work:
            </p>
            <ul style={{ margin: '0 0 12px', paddingLeft: 22, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>
                Essential cookies and local browser storage, used to keep you signed in and to remember basic
                preferences during your session. These are necessary for the service to function.
              </li>
            </ul>
            <p style={{ margin: '0 0 12px' }}>
              We do not use advertising cookies, we do not run third-party ad trackers, and we do not sell tracking
              data. Our hosting providers may collect basic technical logs (such as IP address and browser type)
              for security and reliability.
            </p>
            <p style={{ margin: 0 }}>
              If we ever introduce optional analytics or marketing cookies, we will ask for your consent first and
              update this policy.
            </p>
          </PolicySection>

          <PolicySection title="9. Children and young people">
            <p style={{ margin: '0 0 12px' }}>
              AdmitAI is designed for students, and many of our users are under 18. We take that responsibility
              seriously.
            </p>
            <ul style={{ margin: '0 0 12px', paddingLeft: 22, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>
                We collect the minimum information needed to help you, and we never sell it or use it for
                advertising.
              </li>
              <li>We do not require identity documents, financial details, or unnecessary personal information.</li>
              <li>Paid plans should be purchased by a parent or guardian using their own payment method.</li>
              <li>
                If you are under 18, please use AdmitAI with the awareness of a parent or guardian, and — where the
                law of your country requires it — with their consent.
              </li>
            </ul>
            <p style={{ margin: '0 0 12px' }}>
              Parents and guardians: if you want to review or delete a child&apos;s information, email us at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#4F8A6E', fontWeight: 600 }}>{CONTACT_EMAIL}</a>{' '}
              and we will help you. If we learn that we have collected information from a young person in a way that
              does not meet the requirements of their country, we will correct or delete it.
            </p>
            <p style={{ margin: 0 }}>
              Please do not include information about other people (for example, in an essay or CV) that they would
              not want shared.
            </p>
          </PolicySection>

          <PolicySection title="10. Changes to this policy">
            <p style={{ margin: '0 0 12px' }}>
              As AdmitAI develops, we may update this policy — for example, if we add a feature or change a
              provider.
            </p>
            <p style={{ margin: '0 0 12px' }}>
              If we make a material change, we will update the &quot;Last updated&quot; date at the top of this
              page and, where the change significantly affects your privacy, we will make a reasonable effort to
              notify you (for example, by email or a notice in the app) before it takes effect.
            </p>
            <p style={{ margin: 0 }}>
              If you do not agree with a change, you can delete your account at any time.
            </p>
          </PolicySection>

          <PolicySection title="11. Contact us">
            <p style={{ margin: '0 0 12px' }}>
              Questions about your privacy, your data, or this policy? Email us at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#4F8A6E', fontWeight: 600 }}>{CONTACT_EMAIL}</a>.
            </p>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              E-MAD TECH LIMITED (operating AdmitAI)<br />
              Registered in Nigeria<br />
              <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#4F8A6E', fontWeight: 600 }}>{CONTACT_EMAIL}</a>
            </p>
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
