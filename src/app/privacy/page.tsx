import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | SA AI Agent Marketplace',
  description:
    'Privacy Policy for the SA AI Agent Marketplace. Learn how AI Cowboys, Inc. collects, uses, and protects your data with zero conversation retention.',
  alternates: { canonical: 'https://sanantonioaiagents.com/privacy' },
}

/* ─────────────────────────────────────────────────────────────────────────────
   PRIVACY POLICY
───────────────────────────────────────────────────────────────────────────── */

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white pt-24 lg:pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12">
          <p className="text-xs font-semibold text-navy-600 uppercase tracking-widest mb-3">
            Legal
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-3">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-400">
            Last updated: May 2026
          </p>
        </div>

        {/* Body */}
        <div className="space-y-10 text-gray-600 text-[15px] leading-relaxed">

          {/* 1 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">1. Introduction</h2>
            <p>
              AI Cowboys, Inc. (&quot;AI Cowboys,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the
              SA AI Agent Marketplace at sanantonioaiagents.com (the &quot;Platform&quot;). This Privacy
              Policy explains how we collect, use, store, and protect your personal information
              when you use the Platform. By using the Platform, you consent to the practices
              described in this policy.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">2. Information We Collect</h2>

            <h3 className="text-sm font-semibold text-gray-900 mt-4 mb-2">2.1 Account Information</h3>
            <p>
              When you create an account, we collect your name, email address, and authentication
              credentials. If you sign up using a third-party provider (such as Google), we receive
              basic profile information from that provider. Account data is stored and managed
              through Supabase, our authentication and database provider.
            </p>

            <h3 className="text-sm font-semibold text-gray-900 mt-4 mb-2">2.2 Payment Information</h3>
            <p>
              Payment processing is handled entirely by Stripe. We do not store credit card
              numbers, bank account details, or other sensitive payment data on our servers.
              Stripe may collect and store payment information in accordance with its own privacy
              policy. We receive only a confirmation of payment status, subscription plan, and
              billing history.
            </p>

            <h3 className="text-sm font-semibold text-gray-900 mt-4 mb-2">2.3 Usage Data</h3>
            <p>
              We collect anonymized usage analytics to improve the Platform, including pages
              visited, features used, agent interaction counts (but not content), session
              duration, device type, browser type, and approximate geographic location derived
              from IP address. We do not use this data to build individual user profiles for
              advertising purposes.
            </p>

            <h3 className="text-sm font-semibold text-gray-900 mt-4 mb-2">2.4 Agent Conversations</h3>
            <p>
              <strong className="text-gray-900">
                We maintain a zero data retention policy for agent conversations.
              </strong>{' '}
              The content of your interactions with AI agents is not stored, logged, or retained
              after your session ends. Conversation data is processed in memory to generate
              responses and is discarded immediately. We do not use your conversation content to
              train AI models. This zero-retention approach is a core privacy commitment of the
              Platform.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">3. How We Use Your Information</h2>
            <p className="mb-3">We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Create and manage your account.</li>
              <li>Process subscription payments and manage billing.</li>
              <li>Provide, maintain, and improve the Platform and its agents.</li>
              <li>Send transactional communications (account confirmations, billing receipts, service updates).</li>
              <li>Monitor Platform performance and detect security threats.</li>
              <li>Comply with legal obligations.</li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">4. Data Sharing</h2>
            <p className="mb-3">
              <strong className="text-gray-900">We do not sell your personal data.</strong> We share
              information only in the following limited circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-gray-900">Service providers:</strong> We use Supabase
                (authentication, database), Stripe (payments), and Vercel (hosting) to operate
                the Platform. These providers process data on our behalf under contractual
                obligations to protect your information.
              </li>
              <li>
                <strong className="text-gray-900">Legal requirements:</strong> We may disclose
                information if required by law, subpoena, court order, or government request, or
                to protect the rights, property, or safety of AI Cowboys, our users, or the public.
              </li>
              <li>
                <strong className="text-gray-900">Business transfers:</strong> In the event of a
                merger, acquisition, or sale of assets, user data may be transferred as part of the
                transaction. We will notify affected users before their data becomes subject to a
                different privacy policy.
              </li>
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">5. Cookies and Tracking Technologies</h2>
            <p className="mb-3">
              The Platform uses cookies and similar technologies for the following purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-gray-900">Essential cookies:</strong> Required for
                authentication, session management, and security. These cannot be disabled.
              </li>
              <li>
                <strong className="text-gray-900">Analytics cookies:</strong> Used to collect
                anonymized usage data to improve Platform performance. You can opt out of analytics
                cookies through your browser settings.
              </li>
            </ul>
            <p className="mt-3">
              We do not use advertising cookies or third-party tracking pixels. We do not engage in
              cross-site tracking.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">6. Data Retention</h2>
            <p className="mb-3">We retain different types of data for different periods:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-gray-900">Account information:</strong> Retained for the
                duration of your active account plus 30 days after deletion to allow for account
                recovery.
              </li>
              <li>
                <strong className="text-gray-900">Billing records:</strong> Retained for 7 years
                to comply with tax and accounting obligations.
              </li>
              <li>
                <strong className="text-gray-900">Usage analytics:</strong> Retained in anonymized
                form for up to 24 months.
              </li>
              <li>
                <strong className="text-gray-900">Agent conversations:</strong> Not retained. Zero
                data retention, as described in Section 2.4.
              </li>
            </ul>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">7. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your data, including
              encryption in transit (TLS 1.2+), encryption at rest, secure authentication via
              Supabase, and regular security assessments. However, no method of electronic
              transmission or storage is completely secure, and we cannot guarantee absolute
              security.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">8. Your Rights</h2>
            <p className="mb-3">
              Depending on your jurisdiction, you may have the following rights regarding your
              personal data:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-gray-900">Access:</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong className="text-gray-900">Correction:</strong> Request correction of inaccurate or incomplete data.</li>
              <li><strong className="text-gray-900">Deletion:</strong> Request deletion of your personal data, subject to legal retention requirements.</li>
              <li><strong className="text-gray-900">Portability:</strong> Request your data in a structured, machine-readable format.</li>
              <li><strong className="text-gray-900">Opt-out:</strong> Opt out of non-essential data collection, including analytics cookies.</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at{' '}
              <a href="mailto:legal@aicowboys.com" className="text-navy-700 hover:text-navy-950 underline underline-offset-2">
                legal@aicowboys.com
              </a>
              . We will respond to verified requests within 45 days.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">9. California Privacy Rights (CCPA/CPRA)</h2>
            <p className="mb-3">
              If you are a California resident, the California Consumer Privacy Act (CCPA) and the
              California Privacy Rights Act (CPRA) provide you with additional rights:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-gray-900">Right to know:</strong> You may request
                disclosure of the categories and specific pieces of personal information we have
                collected, the sources of collection, the business purpose, and the categories of
                third parties with whom we share data.
              </li>
              <li>
                <strong className="text-gray-900">Right to delete:</strong> You may request
                deletion of your personal information, subject to certain exceptions.
              </li>
              <li>
                <strong className="text-gray-900">Right to opt out of sale:</strong> We do not sell
                personal information. No opt-out is necessary, but you may submit a request for
                confirmation.
              </li>
              <li>
                <strong className="text-gray-900">Right to non-discrimination:</strong> We will not
                discriminate against you for exercising your CCPA/CPRA rights.
              </li>
              <li>
                <strong className="text-gray-900">Right to correct:</strong> You may request
                correction of inaccurate personal information.
              </li>
              <li>
                <strong className="text-gray-900">Right to limit use of sensitive data:</strong> We
                collect minimal sensitive data and use it only for providing the Platform.
              </li>
            </ul>
            <p className="mt-3">
              To submit a CCPA/CPRA request, email{' '}
              <a href="mailto:legal@aicowboys.com" className="text-navy-700 hover:text-navy-950 underline underline-offset-2">
                legal@aicowboys.com
              </a>{' '}
              with the subject line &quot;California Privacy Request.&quot; We will verify your identity
              before processing your request.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">10. Children&apos;s Privacy</h2>
            <p>
              The Platform is not intended for use by individuals under the age of 13. We do not
              knowingly collect personal information from children under 13. If we become aware
              that we have collected data from a child under 13, we will promptly delete that
              information. If you believe a child under 13 has provided us with personal
              information, please contact us at{' '}
              <a href="mailto:legal@aicowboys.com" className="text-navy-700 hover:text-navy-950 underline underline-offset-2">
                legal@aicowboys.com
              </a>
              .
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">11. Third-Party Links</h2>
            <p>
              The Platform may contain links to third-party websites or services. We are not
              responsible for the privacy practices of those third parties. We encourage you to
              review the privacy policies of any third-party sites you visit.
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">12. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Material changes will be
              communicated via email or a prominent notice on the Platform at least 30 days before
              they take effect. Your continued use of the Platform after the effective date
              constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* 13 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">13. Contact Information</h2>
            <p>
              For privacy-related questions or requests, please contact us:
            </p>
            <ul className="list-none mt-3 space-y-1">
              <li><strong className="text-gray-900">AI Cowboys, Inc.</strong></li>
              <li>San Antonio, Texas</li>
              <li>
                Privacy inquiries:{' '}
                <a href="mailto:legal@aicowboys.com" className="text-navy-700 hover:text-navy-950 underline underline-offset-2">
                  legal@aicowboys.com
                </a>
              </li>
              <li>
                General support:{' '}
                <a href="mailto:support@aicowboys.com" className="text-navy-700 hover:text-navy-950 underline underline-offset-2">
                  support@aicowboys.com
                </a>
              </li>
              <li>
                Web:{' '}
                <a href="https://sanantonioaiagents.com" className="text-navy-700 hover:text-navy-950 underline underline-offset-2">
                  sanantonioaiagents.com
                </a>
              </li>
            </ul>
          </section>

        </div>
      </div>
    </div>
  )
}
