import HomeButton from './HomeButton.jsx'
import { CONTACT_EMAIL } from './config.js'

export default function TermsOfService({ onBack }) {
  return (
    <div style={{ background: '#F7F4EE', minHeight: '100vh' }}>
      <header className="border-b sticky top-0 z-50" style={{ background: '#F7F4EEf8', borderColor: '#16302B1a', backdropFilter: 'blur(8px)' }}>
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <HomeButton onClick={onBack} />
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
          Last updated: 14 July 2026
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

          <TermsSection title="1. About AdmitAI">
            <p style={{ margin: '0 0 12px' }}>
              AdmitAI is an educational guidance tool. It helps students research universities and scholarships,
              understand costs, organise their applications, and get feedback on their own written work.
            </p>
            <p style={{ margin: 0 }}>
              AdmitAI is not a university, an official admissions body, a government service, or a licensed
              financial or immigration advisor. We do not submit applications on your behalf, and we do not make or
              influence admission or funding decisions. Any guidance we provide is intended to help you make your
              own informed decisions.
            </p>
          </TermsSection>

          <TermsSection title="2. Eligibility and accounts">
            <p style={{ margin: '0 0 12px' }}>
              Anyone may use AdmitAI. Many of our users are under 18. If you are under 18, please use AdmitAI with
              the awareness of a parent or guardian, and where the law of your country requires their consent, with
              that consent.
            </p>
            <p style={{ margin: '0 0 12px' }}>
              To use most features you must create an account with a valid email address. You are responsible for
              keeping your login details secure and for activity that happens under your account. Please give
              accurate information about yourself — the guidance you receive is only as good as the information it
              is based on. One person, one account.
            </p>
            <p style={{ margin: 0 }}>
              If a paid plan is purchased for someone under 18, it should be purchased by a parent or guardian
              using their own payment method.
            </p>
          </TermsSection>

          <TermsSection title="3. Acceptable use">
            <p style={{ margin: '0 0 12px' }}>
              Please use AdmitAI honestly and respectfully.
            </p>
            <p style={{ margin: '0 0 12px' }}>
              You may not: misuse, overload, or attempt to break the service; attempt to access other users&apos;
              accounts or data; use automated tools to scrape or bulk-extract our content; resell or redistribute
              our content or AI outputs as your own product; or use AdmitAI for anything unlawful.
            </p>
            <p style={{ margin: '0 0 12px' }}>
              Importantly: you must not present AI-assisted content as your own original work where an institution
              requires original work. Our AI gives you feedback on your writing — it does not write your
              application for you. How you use its feedback is your responsibility, and passing off AI-written
              material as your own can breach a university&apos;s rules and harm your application.
            </p>
            <p style={{ margin: 0 }}>
              We may suspend or terminate accounts that breach these rules.
            </p>
          </TermsSection>

          <TermsSection title="4. Information accuracy">
            <p style={{ margin: '0 0 12px' }}>
              We work hard to keep our information accurate and to show you where figures come from. However,
              tuition fees, living costs, deadlines, eligibility rules, and scholarship terms change frequently and
              vary by institution, course, and year.
            </p>
            <p style={{ margin: '0 0 12px' }}>
              Everything you see in AdmitAI — including costs, deadlines, requirements, and scholarship details —
              should be treated as a starting point, not as a final source of truth. Before you apply, pay any fee,
              or make any decision, you must verify the details directly with the official university or
              scholarship provider. Where we mark something as an estimate or as unverified, please take that
              seriously.
            </p>
            <p style={{ margin: 0 }}>
              We are not liable for decisions made solely on the basis of information in AdmitAI that later turns
              out to be out of date or incorrect.
            </p>
          </TermsSection>

          <TermsSection title="5. AI features">
            <p style={{ margin: '0 0 12px' }}>
              Some AdmitAI features are powered by artificial intelligence, using third-party AI technology
              (currently Anthropic&apos;s Claude). These include the AI chat, roadmap generator, essay feedback, CV
              builder, and interview practice.
            </p>
            <p style={{ margin: '0 0 12px' }}>
              AI can be wrong. It may give inaccurate, incomplete, or outdated information, even when it sounds
              confident. AI output is guidance to help your own thinking — it is not professional admissions,
              legal, financial, or immigration advice, and we do not guarantee its accuracy. Always check important
              details against official sources.
            </p>
            <p style={{ margin: '0 0 12px' }}>
              Our AI will not write your application essays for you, and it will not guarantee admission or funding,
              because no honest service can.
            </p>
            <p style={{ margin: 0 }}>
              Content you enter into AI features (such as essay text) is sent to our AI provider to generate a
              response. Please do not enter sensitive personal information you would not want processed this way.
            </p>
          </TermsSection>

          <TermsSection title="6. Your data">
            <p style={{ margin: '0 0 12px' }}>
              How we collect, use, and protect your information is explained in our Privacy Policy, which forms
              part of these terms.
            </p>
            <p style={{ margin: '0 0 12px' }}>
              In short: we collect only what we need to run the service, we do not sell your personal information,
              and we do not show third-party advertising. You can delete your account and its associated data at
              any time from your account menu. Deleting your account also cancels any active subscription, so you
              will not be billed afterwards.
            </p>
            <p style={{ margin: 0 }}>
              If you are a parent or guardian and want a child&apos;s data removed, email us at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#4F8A6E', fontWeight: 600 }}>{CONTACT_EMAIL}</a>.
            </p>
          </TermsSection>

          <TermsSection title="7. Intellectual property">
            <p style={{ margin: '0 0 12px' }}>
              AdmitAI, including its software, design, branding, and the way we organise and present our content,
              is owned by E-MAD TECH LIMITED. You may use the service for your own personal, non-commercial purpose
              of researching and applying to study. You may not copy, resell, or redistribute our content or
              software.
            </p>
            <p style={{ margin: '0 0 12px' }}>
              Content you create or provide — your essays, CV information, application notes, and messages —
              remains yours. By using the service, you give us permission to process that content only so far as is
              necessary to provide the features you have asked for.
            </p>
            <p style={{ margin: 0 }}>
              Third-party names, logos, and information about universities and scholarships belong to their
              respective owners and are referenced for informational purposes.
            </p>
          </TermsSection>

          <TermsSection title="8. Limitation of liability">
            <p style={{ margin: '0 0 12px' }}>
              AdmitAI is provided &quot;as is&quot; and &quot;as available.&quot; We do our best to keep it accurate
              and running, but we cannot promise it will always be available, error-free, or complete.
            </p>
            <p style={{ margin: '0 0 12px' }}>
              To the fullest extent permitted by law, E-MAD TECH LIMITED is not liable for indirect, incidental, or
              consequential losses arising from your use of AdmitAI — including losses relating to admission or
              funding decisions, missed deadlines, rejected applications, visa outcomes, or decisions you make
              based on information or AI output from the service. Admission and funding decisions are made by
              universities and scholarship providers, not by us.
            </p>
            <p style={{ margin: '0 0 12px' }}>
              Where we are found liable despite the above, our total liability is limited to the amount you have
              paid us in the twelve months before the claim arose.
            </p>
            <p style={{ margin: 0 }}>
              Nothing in these terms removes or limits any rights you have under the law of your country that
              cannot legally be waived, including consumer rights.
            </p>
          </TermsSection>

          {/* Real, filled-in policy — not a placeholder. Keep it in sync with
              the pricing page and the in-app cancellation flow. */}
          <TermsSection title="9. Subscriptions, billing & cancellation">
            <p style={{ margin: '0 0 12px' }}>
              AdmitAI offers optional paid plans as <strong>monthly subscriptions</strong>. Browsing universities
              and scholarships is always free; a plan unlocks the AI tools and, on undergraduate/postgraduate
              tiers, level-specific content.
            </p>
            <p style={{ margin: '0 0 12px' }}>
              <strong>Pricing and currency.</strong> All prices are shown and charged in <strong>US dollars
              (USD)</strong>. If your card or bank account is denominated in another currency, your bank may
              convert the amount to your local currency at its current exchange rate; the converted amount and any
              conversion fees are set by your bank, not by AdmitAI.
            </p>
            <p style={{ margin: '0 0 12px' }}>
              <strong>Payment processing.</strong> Payments are processed securely by our payment provider,
              Flutterwave. AdmitAI never sees or stores your card details.
            </p>
            <p style={{ margin: '0 0 12px' }}>
              <strong>Cancellation and refunds.</strong> You can cancel anytime from your account menu.
              Cancellation stops future billing, so you are not charged again. Your access continues until the end
              of the period you have already paid for, after which your account automatically returns to the free
              plan. <strong>No refunds are given for the current month.</strong> Your subscription renews
              automatically each month until you cancel; if a renewal payment fails, access may end after your
              current paid period. Deleting your account also cancels any active subscription so you are not billed
              afterwards.
            </p>
            <p style={{ margin: '0 0 12px' }}>
              <strong>Fair-use limit.</strong> "Unlimited" AI access on paid plans is subject to a fair-use cap of
              <strong> 300 AI requests per month</strong> to prevent abuse. This is far more than typical use of a
              full application season requires.
            </p>
            <p style={{ margin: 0 }}>
              A subscription improves the tools available to you; it does not affect or guarantee any admission
              decision — no service can promise those. Something went wrong with a payment? Email us at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#4F8A6E', fontWeight: 600 }}>{CONTACT_EMAIL}</a>{' '}
              and we&apos;ll help.
            </p>
          </TermsSection>

          <TermsSection title="10. Changes to these terms">
            <p style={{ margin: '0 0 12px' }}>
              As AdmitAI grows, we may update these terms — for example to describe new features or to reflect
              changes in the law.
            </p>
            <p style={{ margin: '0 0 12px' }}>
              If we make a material change, we will update the &quot;Last updated&quot; date at the top of this
              page and, where the change significantly affects your rights or your subscription, we will make a
              reasonable effort to notify you (for example, by email or a notice in the app) before it takes
              effect.
            </p>
            <p style={{ margin: 0 }}>
              If you continue to use AdmitAI after a change takes effect, that means you accept the updated terms.
              If you do not accept them, you can cancel your subscription and delete your account at any time.
            </p>
          </TermsSection>

          <TermsSection title="11. Governing law">
            <p style={{ margin: '0 0 12px' }}>
              These terms are governed by the laws of the Federal Republic of Nigeria, where E-MAD TECH LIMITED is
              registered, and any dispute will be subject to the jurisdiction of the Nigerian courts.
            </p>
            <p style={{ margin: 0 }}>
              This does not remove any protection given to you by the mandatory consumer laws of the country where
              you live. If you are a consumer, you may also have the right to bring a claim in your own
              country&apos;s courts.
            </p>
          </TermsSection>

          <TermsSection title="12. Contact">
            <p style={{ margin: 0 }}>
              Questions about these terms or your subscription? Email us at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#4F8A6E', fontWeight: 600 }}>{CONTACT_EMAIL}</a>.
            </p>
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
