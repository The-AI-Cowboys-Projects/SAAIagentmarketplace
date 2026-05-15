import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Disclaimer | SA AI Agent Marketplace',
  description:
    'AI Disclaimer for the SA AI Agent Marketplace. AI agent outputs are informational only and do not constitute professional advice.',
  alternates: { canonical: 'https://sanantonioaiagents.com/disclaimer' },
}

/* ─────────────────────────────────────────────────────────────────────────────
   AI DISCLAIMER
───────────────────────────────────────────────────────────────────────────── */

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-white pt-24 lg:pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12">
          <p className="text-xs font-semibold text-navy-600 uppercase tracking-widest mb-3">
            Legal
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-3">
            AI Disclaimer
          </h1>
          <p className="text-sm text-gray-400">
            Last updated: May 2026
          </p>
        </div>

        {/* Body */}
        <div className="space-y-10 text-gray-600 text-[15px] leading-relaxed">

          {/* 1 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">1. General Disclaimer</h2>
            <p>
              The SA AI Agent Marketplace, operated by AI Cowboys, Inc. (&quot;AI Cowboys&quot;), provides
              access to AI-powered agents that generate information, summaries, and task
              assistance using artificial intelligence.{' '}
              <strong className="text-gray-900">
                All agent outputs are for informational purposes only and do not constitute
                professional advice of any kind.
              </strong>{' '}
              You should not rely on agent outputs as a substitute for professional judgment,
              consultation, or services from qualified individuals.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">2. Healthcare Disclaimer</h2>
            <p>
              AI agents on this Platform are{' '}
              <strong className="text-gray-900">not medical professionals</strong> and do not
              provide medical advice, diagnoses, or treatment recommendations. Agent outputs
              related to healthcare, wellness, symptoms, medications, or medical conditions are
              for general informational purposes only and are not a substitute for professional
              medical care.
            </p>
            <p className="mt-3">
              Always consult a licensed physician, nurse practitioner, or other qualified
              healthcare provider before making medical decisions. Do not disregard, avoid, or
              delay seeking medical advice based on information provided by an AI agent.
            </p>
            <p className="mt-3">
              <strong className="text-gray-900">
                The Platform is not HIPAA-compliant.
              </strong>{' '}
              Do not enter protected health information (PHI), including medical records, patient
              identifiers, diagnoses, or treatment histories, into agent conversations. AI Cowboys
              is not a covered entity or business associate under HIPAA and does not accept
              responsibility for PHI disclosed through the Platform.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">3. Military and Veterans Affairs Disclaimer</h2>
            <p>
              AI agents that address military-related topics, including VA benefits, disability
              claims, GI Bill education benefits, TRICARE, military transition services, and
              JBSA-related information, provide{' '}
              <strong className="text-gray-900">
                general informational summaries only.
              </strong>
            </p>
            <p className="mt-3">
              Agent outputs are{' '}
              <strong className="text-gray-900">
                not official guidance from the U.S. Department of Defense (DoD), the U.S.
                Department of Veterans Affairs (VA), or any branch of the Armed Forces.
              </strong>{' '}
              Benefits eligibility, claims processes, and policy details change frequently.
              Always verify information with official VA resources at{' '}
              <a
                href="https://www.va.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="text-navy-700 hover:text-navy-950 underline underline-offset-2"
              >
                va.gov
              </a>
              , your local VA regional office, or an accredited Veterans Service Organization (VSO)
              before taking action on claims, benefits, or entitlements.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">4. Legal and Tax Disclaimer</h2>
            <p>
              AI agent outputs do not constitute legal advice, tax advice, or financial advice.
              Agents are{' '}
              <strong className="text-gray-900">
                not licensed attorneys, certified public accountants, enrolled agents, or
                registered financial advisors.
              </strong>
            </p>
            <p className="mt-3">
              Information provided about permits, zoning, business licensing, tax obligations,
              contracts, regulations, or legal rights is general in nature and may not reflect
              current law or your specific circumstances. Always consult a licensed attorney for
              legal matters, a licensed CPA or enrolled agent for tax matters, and a registered
              financial advisor for investment decisions.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">5. Civic and Voting Disclaimer</h2>
            <p>
              AI agents that provide information about elections, voter registration, polling
              locations, ballot measures, or civic processes are{' '}
              <strong className="text-gray-900">strictly nonpartisan</strong> and provide
              general information only.
            </p>
            <p className="mt-3">
              Agent outputs are not endorsements of any candidate, party, or ballot measure.
              Election information, including deadlines, polling locations, and registration
              requirements, is subject to change. Always verify voting information with official
              sources, including the{' '}
              <a
                href="https://www.bexar.org/elections"
                target="_blank"
                rel="noopener noreferrer"
                className="text-navy-700 hover:text-navy-950 underline underline-offset-2"
              >
                Bexar County Elections Department
              </a>
              , the{' '}
              <a
                href="https://www.sos.texas.gov/elections"
                target="_blank"
                rel="noopener noreferrer"
                className="text-navy-700 hover:text-navy-950 underline underline-offset-2"
              >
                Texas Secretary of State
              </a>
              , or{' '}
              <a
                href="https://www.vote.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="text-navy-700 hover:text-navy-950 underline underline-offset-2"
              >
                vote.gov
              </a>
              .
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">6. Data Accuracy and Currency</h2>
            <p>
              AI agents generate responses using publicly available data, including government
              databases, public records, published schedules, and other open sources. This data
              may not be current, complete, or accurate at the time you access it. Agents may
              occasionally produce inaccurate, incomplete, or outdated information.
            </p>
            <p className="mt-3">
              AI Cowboys does not guarantee the accuracy, completeness, timeliness, or reliability
              of any agent output. Schedules, hours of operation, fees, eligibility requirements,
              and other details referenced by agents are subject to change without notice by the
              originating source.{' '}
              <strong className="text-gray-900">
                You are responsible for independently verifying all information before relying
                on it.
              </strong>
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">7. User Responsibility</h2>
            <p>
              You acknowledge and agree that you are solely responsible for evaluating the
              appropriateness, accuracy, and usefulness of any information provided by AI agents.
              You assume full responsibility for any decisions, actions, or omissions based on
              agent outputs. AI Cowboys shall not be liable for any loss, damage, or harm
              resulting from your reliance on agent-generated content.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">8. Emergency Situations</h2>
            <div className="bg-red-50 border border-red-200 rounded-xl p-5 mt-2">
              <p className="text-red-900 font-semibold mb-2">
                This Platform is not an emergency service.
              </p>
              <p className="text-red-800">
                If you are experiencing a medical emergency, fire, crime in progress, or any
                situation requiring immediate assistance,{' '}
                <strong>call 911 immediately.</strong> Do not use an AI agent to seek help in an
                emergency.
              </p>
            </div>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">9. Mental Health and Crisis Resources</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mt-2">
              <p className="text-blue-900 font-semibold mb-3">
                AI agents are not mental health counselors or crisis responders.
              </p>
              <p className="text-blue-800 mb-3">
                If you or someone you know is in emotional distress or experiencing a mental
                health crisis, please contact one of the following resources:
              </p>
              <ul className="space-y-2 text-blue-800">
                <li>
                  <strong className="text-blue-900">988 Suicide &amp; Crisis Lifeline:</strong>{' '}
                  Call or text <strong>988</strong> (available 24/7)
                </li>
                <li>
                  <strong className="text-blue-900">Crisis Text Line:</strong>{' '}
                  Text <strong>HOME</strong> to <strong>741741</strong>
                </li>
                <li>
                  <strong className="text-blue-900">Veterans Crisis Line:</strong>{' '}
                  Call <strong>988</strong>, then press <strong>1</strong>, or text <strong>838255</strong>
                </li>
                <li>
                  <strong className="text-blue-900">SAMHSA National Helpline:</strong>{' '}
                  <strong>1-800-662-4357</strong> (free, confidential, 24/7)
                </li>
              </ul>
            </div>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">10. AI Limitations</h2>
            <p>
              AI agents use large language models and other AI technologies that have inherent
              limitations. Agents may produce responses that are plausible-sounding but factually
              incorrect, commonly referred to as &quot;hallucinations.&quot; Agents do not have real-time
              awareness, cannot access private or restricted systems, and cannot perform actions
              in the physical world. Agents do not remember previous conversations between
              sessions due to our zero data retention policy.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">11. No Professional Relationship</h2>
            <p>
              Use of the Platform does not create a professional-client relationship of any kind
              between you and AI Cowboys, Inc. No attorney-client, doctor-patient,
              advisor-client, or fiduciary relationship is formed through your interactions
              with AI agents. AI Cowboys does not hold professional licenses in law, medicine,
              accounting, financial advising, or any other regulated profession.
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">12. Contact Information</h2>
            <p>
              If you have questions about this AI Disclaimer, please contact us:
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
