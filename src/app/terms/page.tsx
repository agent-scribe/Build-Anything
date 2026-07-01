import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Sbuild terms of service — rules, rights, and responsibilities for using our platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-300">
      <nav className="border-b border-zinc-800/80 bg-[#09090b]/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <Link href="/" className="text-lg font-bold text-white">
            Sbuild
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="text-sm text-zinc-400 hover:text-white"
            >
              Privacy
            </Link>
            <Link
              href="/"
              className="text-sm text-zinc-400 hover:text-white"
            >
              Home
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="mb-2 text-3xl font-bold text-white">Terms of Service</h1>
        <p className="mb-10 text-sm text-zinc-500">
          Effective date: July 1, 2026 &middot; Last updated: July 1, 2026
        </p>

        <div className="space-y-8 text-sm leading-relaxed text-zinc-400">
          {/* Intro */}
          <p>
            These Terms of Service (&quot;Terms&quot;) govern your access to and
            use of the Sbuild platform and services operated by Sbuild Studio
            (&quot;Sbuild,&quot; &quot;we,&quot; &quot;us,&quot; or
            &quot;our&quot;). By creating an account or using the Service, you
            agree to these Terms. If you do not agree, please do not use the
            Service.
          </p>

          {/* 1 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-200">
              1. Description of Service
            </h2>
            <p>
              Sbuild is an AI-powered website and online store generator. Users
              describe a business in natural language, and the platform
              generates a complete, multi-page website or e-commerce store. Users
              can then customize the output using a visual editor and export
              clean HTML or React code. The Service includes starter templates,
              AI-assisted editing, e-commerce components, and collaboration
              features.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-200">
              2. Eligibility
            </h2>
            <p>
              You must be at least 16 years of age to use the Service. By using
              the Service, you represent and warrant that you meet this
              requirement and have the legal capacity to enter into these Terms.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-200">
              3. User Accounts
            </h2>
            <p>
              You are responsible for maintaining the confidentiality of your
              account credentials. You agree to provide accurate, current, and
              complete information during registration, to update your
              information as needed, and to notify us immediately of any
              unauthorized access. You are solely responsible for all activity
              under your account.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-200">
              4. Acceptable Use
            </h2>
            <p>You agree not to use the Service to:</p>
            <ul className="mt-2 list-inside list-disc space-y-1 pl-2">
              <li>
                Generate content that is illegal, harmful, threatening, abusive,
                defamatory, obscene, or otherwise objectionable
              </li>
              <li>
                Create websites that infringe on any third-party intellectual
                property, trademark, or copyright
              </li>
              <li>
                Distribute malware, phishing pages, or deceptive content
              </li>
              <li>
                Impersonate any person or entity, or misrepresent your
                affiliation
              </li>
              <li>
                Attempt to reverse-engineer, decompile, or extract source code
                from the platform beyond what is exported through the official
                export feature
              </li>
              <li>
                Resell access to the Service without written authorization
              </li>
              <li>
                Generate adult, weapon-related, or otherwise prohibited content
              </li>
            </ul>
            <p className="mt-3">
              We reserve the right to suspend or terminate accounts that violate
              these rules, without refund.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-200">
              5. Intellectual Property
            </h2>
            <p className="mb-2 font-medium text-zinc-300">
              5.1 Your Content
            </p>
            <p className="mb-3">
              You retain full ownership of the content you create using Sbuild,
              including generated websites, customizations, and exported code.
              You grant us a limited, non-exclusive license to host and process
              your content solely for the purpose of providing the Service.
            </p>
            <p className="mb-2 font-medium text-zinc-300">
              5.2 Our Platform
            </p>
            <p className="mb-3">
              The Sbuild platform — including its source code, design,
              architecture, branding, and documentation — is the intellectual
              property of Sbuild Studio (or its successor upon sale of the
              business). All rights not expressly granted herein are reserved.
            </p>
            <p className="mb-2 font-medium text-zinc-300">
              5.3 Templates
            </p>
            <p>
              Templates included in the Service are licensed for use within
              websites generated by the platform. You may use template-generated
              output commercially. You may not redistribute the raw template
              source files separately from a generated website.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-200">
              6. Subscriptions &amp; Billing
            </h2>
            <p className="mb-2">
              The Service offers Free, Pro ($29/month), and Studio ($99/month)
              plans. Paid subscriptions are billed monthly in advance through
              our payment processor.
            </p>
            <p className="mb-2">
              <strong className="text-zinc-300">Cancellation:</strong> You may
              cancel your subscription at any time from your account settings.
              Access to paid features continues until the end of the current
              billing period.
            </p>
            <p className="mb-2">
              <strong className="text-zinc-300">Refunds:</strong> We offer a
              7-day refund window for first-time subscribers who are not
              satisfied. After 7 days, refunds are handled on a case-by-case
              basis at our discretion.
            </p>
            <p>
              <strong className="text-zinc-300">Price Changes:</strong> We may
              adjust pricing with 30 days&apos; written notice. Existing
              subscribers retain their current rate until the next renewal
              cycle after the notice period.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-200">
              7. AI-Generated Content
            </h2>
            <p>
              Websites generated by the Service use AI (Anthropic Claude) to
              produce content based on your prompts. While we strive for high
              quality, AI-generated content may contain inaccuracies. You are
              responsible for reviewing and editing all generated content before
              publishing. We do not guarantee that AI-generated content is free
              from errors, biases, or intellectual property concerns.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-200">
              8. Disclaimer of Warranties
            </h2>
            <p>
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS
              AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR
              IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF
              MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
              NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE
              UNINTERRUPTED, ERROR-FREE, OR SECURE.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-200">
              9. Limitation of Liability
            </h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, WEBUILD STUDIO AND ITS
              OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR
              ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
              DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF REVENUE, DATA, OR
              BUSINESS OPPORTUNITY, ARISING OUT OF OR RELATED TO YOUR USE OF THE
              SERVICE. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID
              US IN THE 12 MONTHS PRECEDING THE CLAIM.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-200">
              10. Indemnification
            </h2>
            <p>
              You agree to indemnify and hold harmless Sbuild Studio from any
              claims, damages, losses, or expenses (including reasonable
              attorney&apos;s fees) arising from your use of the Service, your
              violation of these Terms, or your infringement of any third-party
              rights.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-200">
              11. Termination
            </h2>
            <p>
              We may suspend or terminate your account at any time for violation
              of these Terms. Upon termination, your right to use the Service
              ceases immediately. You may export your projects before
              termination. Provisions that by their nature should survive
              termination (including IP ownership, limitation of liability, and
              indemnification) shall survive.
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-200">
              12. Governing Law &amp; Disputes
            </h2>
            <p>
              These Terms are governed by the laws of the jurisdiction in which
              Sbuild Studio is incorporated, without regard to conflict of law
              provisions. Any disputes shall be resolved through good-faith
              negotiation first, then binding arbitration if negotiation fails,
              unless you are in a jurisdiction where arbitration clauses are
              unenforceable, in which case local courts of competent
              jurisdiction shall apply.
            </p>
          </section>

          {/* 13 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-200">
              13. Modifications to Terms
            </h2>
            <p>
              We reserve the right to update these Terms at any time. We will
              notify registered users of material changes via email or in-app
              notification at least 14 days before the changes take effect.
              Continued use of the Service after the effective date constitutes
              acceptance of the updated Terms.
            </p>
          </section>

          {/* 14 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-200">
              14. Severability
            </h2>
            <p>
              If any provision of these Terms is found to be unenforceable, the
              remaining provisions continue in full force and effect.
            </p>
          </section>

          {/* 15 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-200">
              15. Contact
            </h2>
            <p>
              For questions about these Terms, contact us at{" "}
              <a
                href="mailto:legal@sbuild.studio"
                className="text-[#6d5efc] underline underline-offset-2 hover:text-[#8b7efc]"
              >
                legal@sbuild.studio
              </a>
              .
            </p>
          </section>

          {/* Flippa-friendly asset transfer note */}
          <section className="mt-8 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
            <p className="text-xs text-zinc-500">
              <strong className="text-zinc-400">
                Asset Transfer &amp; Business Sale:
              </strong>{" "}
              In the event this business is sold or transferred, the new owner
              assumes all rights and obligations under these Terms. All
              intellectual property, source code, templates, branding, and
              customer relationships transfer in full to the buyer. Users will
              be notified of any change in the operating entity within 30 days.
              The buyer receives a perpetual, irrevocable license to all
              platform code, templates, and documentation included in the sale.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-zinc-800/60 py-6 text-center text-xs text-zinc-600">
        &copy; {new Date().getFullYear()} Sbuild Studio. All rights reserved.
        &nbsp;&middot;&nbsp;
        <Link href="/terms" className="hover:text-zinc-400">
          Terms of Service
        </Link>
        &nbsp;&middot;&nbsp;
        <Link href="/privacy" className="hover:text-zinc-400">
          Privacy Policy
        </Link>
      </footer>
    </div>
  );
}
