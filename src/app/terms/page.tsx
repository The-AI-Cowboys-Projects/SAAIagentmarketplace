import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | SA AI Agent Marketplace',
  description:
    'Terms of Service for the SA AI Agent Marketplace operated by AI Cowboys, Inc. Read our terms covering accounts, billing, acceptable use, and liability.',
  alternates: { canonical: 'https://sanantonioaiagents.com/terms' },
}

/* ─────────────────────────────────────────────────────────────────────────────
   TERMS OF SERVICE
───────────────────────────────────────────────────────────────────────────── */

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white pt-24 lg:pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12">
          <p className="text-xs font-semibold text-navy-600 uppercase tracking-widest mb-3">
            Legal
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-3">
            Terms of Service
          </h1>
          <p className="text-sm text-gray-400">
            Last updated: May 2026
          </p>
        </div>

        {/* Body */}
        <div className="space-y-10 text-gray-600 text-[15px] leading-relaxed">

          {/* 1 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">1. Agreement to Terms</h2>
            <p>
              These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement between
              you (&quot;User,&quot; &quot;you,&quot; or &quot;your&quot;) and AI Cowboys, Inc., a Texas corporation
              (&quot;AI Cowboys,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), governing your access to and use of
              the SA AI Agent Marketplace located at sanantonioaiagents.com (the &quot;Platform&quot;). By
              creating an account or using the Platform, you agree to be bound by these Terms. If
              you do not agree, do not use the Platform.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">2. Description of Service</h2>
            <p>
              The SA AI Agent Marketplace is an AI-powered platform that provides access to
              specialized AI agents designed for the San Antonio, Texas metropolitan area. Agents
              span categories including civic services, business operations, military and veteran
              affairs, healthcare navigation, tourism, and more. The Platform allows subscribers to
              interact with these agents through a browser-based interface to receive
              AI-generated information, summaries, and task assistance.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">3. Account Terms</h2>
            <p className="mb-3">
              To access the Platform, you must create an account. You agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate, current, and complete information during registration.</li>
              <li>Maintain and promptly update your account information.</li>
              <li>Keep your login credentials secure and confidential.</li>
              <li>Accept responsibility for all activity that occurs under your account.</li>
              <li>Notify us immediately at support@aicowboys.com if you suspect unauthorized access.</li>
            </ul>
            <p className="mt-3">
              You must be at least 18 years of age (or the age of majority in your jurisdiction) to
              create an account. We reserve the right to refuse service, terminate accounts, or
              remove content at our sole discretion.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">4. Subscription Plans and Billing</h2>
            <p className="mb-3">
              The Platform offers paid subscription plans:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-gray-900">Starter</strong> &mdash; $49 per month. Includes
                all 60 agents, 1,000 requests per month, and email support.
              </li>
              <li>
                <strong className="text-gray-900">Growth</strong> &mdash; $149 per month. Includes
                all 60 agents, 10,000 requests per month, up to 5 team seats, priority support,
                and a usage analytics dashboard.
              </li>
              <li>
                <strong className="text-gray-900">Partner</strong> &mdash; $499 per month. Includes
                unlimited requests, unlimited seats, a dedicated account manager, SSO/SAML
                authentication, custom integrations, and SLA-backed uptime.
              </li>
            </ul>
            <p className="mt-3">
              Annual billing is available at a discounted rate (approximately 20% savings).
              Subscriptions renew automatically at the end of each billing period. You may
              upgrade, downgrade, or cancel at any time; changes take effect at the start of
              the next billing cycle. All payments are processed through Stripe. Refunds are
              handled on a case-by-case basis; contact support@aicowboys.com for refund
              requests. Prices are subject to change with 30 days&apos; notice.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">5. Acceptable Use</h2>
            <p className="mb-3">
              You agree not to use the Platform to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Violate any applicable local, state, federal, or international law or regulation.</li>
              <li>Engage in any activity that is harmful, fraudulent, deceptive, or misleading.</li>
              <li>Attempt to gain unauthorized access to any part of the Platform, other accounts, or connected systems.</li>
              <li>Interfere with or disrupt the integrity or performance of the Platform.</li>
              <li>Use automated scripts, bots, or scrapers to access the Platform outside of approved API integrations.</li>
              <li>Redistribute, resell, or sublicense agent outputs without written permission.</li>
              <li>Use agent outputs to generate spam, phishing content, or malicious material.</li>
              <li>Misrepresent AI-generated content as human-authored professional advice.</li>
            </ul>
            <p className="mt-3">
              Violation of these terms may result in immediate account suspension or termination
              without refund.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">6. AI Output Disclaimers</h2>
            <p className="mb-3">
              All content generated by agents on the Platform is produced by artificial intelligence
              and is provided for informational purposes only.{' '}
              <strong className="text-gray-900">
                Agent outputs do not constitute professional advice of any kind.
              </strong>{' '}
              Specifically:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Agent outputs are not legal advice. Consult a licensed attorney for legal matters.</li>
              <li>Agent outputs are not medical advice. Consult a licensed healthcare provider for medical decisions.</li>
              <li>Agent outputs are not tax or financial advice. Consult a licensed CPA, financial advisor, or tax professional.</li>
              <li>Agent outputs are not official government guidance. Verify all information with the relevant government agency.</li>
              <li>Agent outputs related to VA claims, military benefits, or DoD matters are not a substitute for official VA or DoD guidance.</li>
            </ul>
            <p className="mt-3">
              AI Cowboys makes no warranty regarding the accuracy, completeness, timeliness, or
              reliability of any agent output. You assume full responsibility for any actions
              taken based on information provided by the Platform.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">7. Intellectual Property</h2>
            <p>
              The Platform, including its software, design, branding, agent architectures, and
              documentation, is the intellectual property of AI Cowboys, Inc. and is protected
              by applicable copyright, trademark, and trade secret laws. You retain ownership
              of any original content you input into the Platform. By using the Platform, you
              grant AI Cowboys a limited, non-exclusive license to process your inputs solely
              for the purpose of generating agent responses. We do not claim ownership of your
              inputs or use them to train models. Agent outputs are provided under a limited
              license for your personal or internal business use; they may not be resold or
              redistributed as a standalone product or service.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">8. Termination</h2>
            <p>
              You may cancel your subscription at any time through your account settings or by
              contacting support@aicowboys.com. We may suspend or terminate your access to the
              Platform at any time, with or without cause, and with or without notice, including
              for violation of these Terms. Upon termination, your right to use the Platform
              ceases immediately. Provisions that by their nature should survive termination
              (including, without limitation, intellectual property rights, disclaimers,
              limitations of liability, and governing law) will survive.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">9. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, AI Cowboys, Inc., its officers,
              directors, employees, agents, and affiliates shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages, or any loss of profits,
              revenue, data, or goodwill, arising out of or related to your use of or inability to
              use the Platform, regardless of the theory of liability. In no event shall our total
              aggregate liability exceed the greater of (a) the amount you paid to AI Cowboys in the
              twelve (12) months preceding the claim or (b) one hundred dollars ($100). The Platform
              is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, whether
              express or implied, including implied warranties of merchantability, fitness for a
              particular purpose, and non-infringement.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">10. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless AI Cowboys, Inc. and its officers,
              directors, employees, and agents from and against any and all claims, liabilities,
              damages, losses, and expenses (including reasonable attorneys&apos; fees) arising out of
              or relating to your use of the Platform, your violation of these Terms, or your
              violation of any rights of a third party.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">11. Governing Law and Dispute Resolution</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the
              State of Texas, without regard to its conflict of law principles. Any dispute arising
              out of or relating to these Terms or the Platform shall be resolved exclusively in the
              state or federal courts located in Bexar County, Texas, and you consent to the
              personal jurisdiction of such courts. You agree to waive any right to a jury trial
              in connection with any dispute arising under these Terms.
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">12. Changes to These Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Material changes will be
              communicated via email or a prominent notice on the Platform at least 30 days before
              they take effect. Your continued use of the Platform after the effective date of
              revised Terms constitutes acceptance of the changes.
            </p>
          </section>

          {/* 13 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">13. Severability</h2>
            <p>
              If any provision of these Terms is found to be unenforceable or invalid by a court of
              competent jurisdiction, that provision will be limited or eliminated to the minimum
              extent necessary, and the remaining provisions will remain in full force and effect.
            </p>
          </section>

          {/* 14 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">14. Contact Information</h2>
            <p>
              If you have questions about these Terms, please contact us:
            </p>
            <ul className="list-none mt-3 space-y-1">
              <li><strong className="text-gray-900">AI Cowboys, Inc.</strong></li>
              <li>San Antonio, Texas</li>
              <li>
                Email:{' '}
                <a href="mailto:legal@aicowboys.com" className="text-navy-700 hover:text-navy-950 underline underline-offset-2">
                  legal@aicowboys.com
                </a>
              </li>
              <li>
                Support:{' '}
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
