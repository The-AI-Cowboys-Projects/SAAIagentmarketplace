import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white pt-24 lg:pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-8">Last updated: May 14, 2026</p>

        <div className="prose prose-gray max-w-none space-y-6 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
            <p>
              When you create an account, we collect your email address and, optionally, your name.
              We use Supabase Auth for authentication and Stripe for payment processing. We do not
              store passwords directly — authentication is handled by Supabase.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Agent Conversation Data</h2>
            <p>
              Agent conversations are processed in real time and are not used for model training.
              We retain minimal session metadata for service quality and debugging purposes.
              We do not sell or share your agent interaction data with third parties.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Payment Information</h2>
            <p>
              Payment processing is handled entirely by Stripe. We never see or store your full
              credit card number. Stripe&rsquo;s privacy policy applies to all payment data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Cookies</h2>
            <p>
              We use essential cookies for authentication session management. We do not use
              third-party tracking cookies or advertising pixels.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Contact</h2>
            <p>
              For privacy-related questions, contact us at{' '}
              <a href="mailto:privacy@aicowboys.com" className="text-navy-700 hover:text-navy-950 underline underline-offset-2">
                privacy@aicowboys.com
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
