import Link from 'next/link'

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-white pt-24 lg:pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Refund Policy</h1>
        <p className="text-sm text-gray-400 mb-8">Last updated: May 14, 2026</p>

        <div className="prose prose-gray max-w-none space-y-6 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Subscription Cancellation</h2>
            <p>
              You may cancel your SA Agent Marketplace subscription at any time from your account
              dashboard. Upon cancellation, your subscription remains active until the end of the
              current billing period. You will continue to have full access to your plan&rsquo;s
              features until that date, after which your account will revert to the free tier.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Refund Eligibility</h2>
            <p>
              <strong className="text-gray-900">Annual plans:</strong> If you purchased an annual
              subscription, you may request a full refund within 14 days of the initial purchase or
              renewal date. Refund requests made after the 14-day window are not eligible.
            </p>
            <p className="mt-3">
              <strong className="text-gray-900">Monthly plans:</strong> Monthly subscriptions are
              non-refundable. No partial-month refunds will be issued for cancellations made
              mid-billing cycle. Your access continues through the end of the paid period.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">3. How to Request a Refund</h2>
            <p>
              To request a refund, send an email to{' '}
              <a href="mailto:billing@aicowboys.com" className="text-navy-700 hover:text-navy-950 underline underline-offset-2">
                billing@aicowboys.com
              </a>{' '}
              with your account email address and the reason for your request. Please include
              &ldquo;Refund Request&rdquo; in the subject line for faster processing.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Processing Time</h2>
            <p>
              Approved refunds are processed within 5&ndash;10 business days. The refund will be
              credited to your original payment method via Stripe. Depending on your bank or card
              issuer, it may take an additional 3&ndash;5 business days for the refund to appear
              on your statement.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Contact</h2>
            <p>
              For billing questions or refund inquiries, contact us at{' '}
              <a href="mailto:billing@aicowboys.com" className="text-navy-700 hover:text-navy-950 underline underline-offset-2">
                billing@aicowboys.com
              </a>.
              This policy is operated by AI Cowboys, Inc. and applies to all SA Agent Marketplace
              subscriptions.
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
