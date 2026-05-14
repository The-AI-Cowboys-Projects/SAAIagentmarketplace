import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white pt-24 lg:pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-400 mb-8">Last updated: May 14, 2026</p>

        <div className="prose prose-gray max-w-none space-y-6 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the SA Agent Marketplace (&ldquo;Service&rdquo;), operated by
              AI Cowboys, Inc., you agree to be bound by these Terms of Service. If you do not
              agree, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Description of Service</h2>
            <p>
              The Service provides access to AI-powered agents designed for San Antonio civic,
              business, military, healthcare, and tourism use cases. Agents provide informational
              assistance and should not be relied upon as legal, medical, or financial advice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Subscriptions and Billing</h2>
            <p>
              Paid plans are billed monthly or annually via Stripe. You may cancel at any time;
              cancellation takes effect at the end of the current billing period. Refunds are
              handled on a case-by-case basis.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Acceptable Use</h2>
            <p>
              You agree not to misuse the Service, including but not limited to: attempting to
              reverse-engineer agent models, using agents for illegal purposes, or circumventing
              usage limits.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Limitation of Liability</h2>
            <p>
              The Service is provided &ldquo;as is&rdquo; without warranties of any kind. AI Cowboys, Inc.
              is not liable for any damages arising from your use of the Service, including
              decisions made based on agent outputs.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Contact</h2>
            <p>
              For questions about these terms, contact us at{' '}
              <a href="mailto:legal@aicowboys.com" className="text-navy-700 hover:text-navy-950 underline underline-offset-2">
                legal@aicowboys.com
              </a>.
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100">
          <Link href="/" className="text-sm text-navy-700 hover:text-navy-950">
            &larr; Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
