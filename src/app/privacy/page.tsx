import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Sbuild privacy policy — how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-300">
      <nav className="border-b border-zinc-800/80 bg-[#09090b]/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <Link href="/" className="text-lg font-bold text-white">
            Sbuild
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/terms"
              className="text-sm text-zinc-400 hover:text-white"
            >
              Terms
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
        <h1 className="mb-2 text-3xl font-bold text-white">Privacy Policy</h1>
        <p className="mb-10 text-sm text-zinc-500">
          Effective date: July 1, 2026 &middot; Last updated: July 1, 2026
        </p>

        <div className="space-y-8 text-sm leading-relaxed text-zinc-400">
          {/* Intro */}
          <p>
            Sbuild Studio (&quot;Sbuild,&quot; &quot;we,&quot; &quot;us,&quot;
            or &quot;our&quot;) operates the website and SaaS platform located
            at{" "}
            <a
              href="https://webuild-studio.netlify.app"
              className="text-[#6d5efc] underline underline-offset-2 hover:text-[#8b7efc]"
            >
              webuild-studio.netlify.app
            </a>{" "}
            (the &quot;Service&quot;). This Privacy Policy explains how we
            collect, use, disclose, and safeguard your information when you visit
            or use the Service. By using the Service you consent to the
            practices described herein.
          </p>

          {/* 1 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-200">
              1. Information We Collect
            </h2>
            <p className="mb-2 font-medium text-zinc-300">
              1.1 Information You Provide
            </p>
            <p className="mb-3">
              Account registration data (name, email address), profile
              information, projects and site documents you create, support
              requests, and any other content you voluntarily submit.
            </p>
            <p className="mb-2 font-medium text-zinc-300">
              1.2 Automatically Collected Data
            </p>
            <p className="mb-3">
              When you access the Service we may automatically collect device
              and browser information (type, OS, screen resolution), IP address
              (anonymized where possible), pages visited and features used, and
              referral URL. This data is collected via Google Analytics 4 and
              only when you have accepted analytics cookies through our cookie
              consent banner.
            </p>
            <p className="mb-2 font-medium text-zinc-300">
              1.3 Payment Information
            </p>
            <p>
              If you subscribe to a paid plan, payment details (card number,
              billing address) are collected and processed directly by our
              payment processor (e.g., Stripe, Paddle, or LemonSqueezy). We
              never store raw card numbers on our servers.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-200">
              2. How We Use Your Information
            </h2>
            <p>We use collected information to:</p>
            <ul className="mt-2 list-inside list-disc space-y-1 pl-2">
              <li>Provide, operate, and maintain the Service</li>
              <li>Process transactions and send related confirmations</li>
              <li>Respond to support requests and customer service inquiries</li>
              <li>Send service-related notices (e.g., updates, security alerts)</li>
              <li>Analyze usage patterns to improve the product</li>
              <li>Detect and prevent fraud or abuse</li>
            </ul>
            <p className="mt-3">
              We do <strong className="text-zinc-300">not</strong> sell, rent,
              or trade your personal data to third parties for marketing
              purposes.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-200">
              3. Legal Basis for Processing (GDPR)
            </h2>
            <p>
              If you are located in the European Economic Area (EEA) or the
              United Kingdom, we process your data under the following legal
              bases: performance of a contract (providing the Service you signed
              up for), legitimate interests (improving the Service, preventing
              fraud), consent (analytics cookies, marketing emails — which you
              may withdraw at any time), and legal obligation (compliance with
              applicable laws).
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-200">
              4. Cookies &amp; Tracking Technologies
            </h2>
            <p className="mb-2">
              We use the following categories of cookies:
            </p>
            <p className="mb-1">
              <strong className="text-zinc-300">Essential cookies</strong> —
              required for authentication, session management, and security.
              These cannot be disabled.
            </p>
            <p className="mb-1">
              <strong className="text-zinc-300">Analytics cookies</strong> —
              Google Analytics 4 (GA4) to measure traffic and feature usage.
              These are loaded <em>only</em> after you accept cookies via the
              consent banner.
            </p>
            <p className="mt-2">
              If you decline analytics cookies, GA4 scripts are never loaded
              and no analytics data is transmitted. You can change your
              preference at any time by clearing your browser&apos;s local
              storage for this site.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-200">
              5. Third-Party Services
            </h2>
            <p>We integrate with the following third-party services:</p>
            <ul className="mt-2 list-inside list-disc space-y-1 pl-2">
              <li>
                <strong className="text-zinc-300">Google Analytics 4</strong>{" "}
                — usage analytics ({" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#6d5efc] underline underline-offset-2 hover:text-[#8b7efc]"
                >
                  Google Privacy Policy
                </a>
                )
              </li>
              <li>
                <strong className="text-zinc-300">Anthropic Claude API</strong>{" "}
                — AI-powered site generation (prompts are sent to Anthropic&apos;s
                API; no personal data is included in generation requests)
              </li>
              <li>
                <strong className="text-zinc-300">Payment Processor</strong>{" "}
                — Stripe, Paddle, or LemonSqueezy (handles billing; we do not
                store card details)
              </li>
              <li>
                <strong className="text-zinc-300">Hosting</strong> — Netlify /
                Vercel (CDN and serverless functions)
              </li>
            </ul>
            <p className="mt-2">
              Each third-party service operates under its own privacy policy.
              We encourage you to review them.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-200">
              6. Data Storage &amp; Security
            </h2>
            <p>
              Project data is stored securely using industry-standard
              encryption. In the current MVP release, user-generated content is
              stored in your browser&apos;s local storage. In production
              deployments, data is stored in encrypted PostgreSQL databases
              (e.g., Supabase or Neon) with automated backups. We implement
              HTTPS everywhere, parameterized queries, CSRF protection, and
              strict Content Security Policy headers.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-200">
              7. Data Retention
            </h2>
            <p>
              We retain your account data for as long as your account is active
              or as needed to provide the Service. If you delete your account,
              we remove your personal data within 30 days, except where
              retention is required by law (e.g., financial records). Anonymized
              analytics data may be retained indefinitely for product
              improvement.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-200">
              8. Your Rights
            </h2>
            <p>Depending on your jurisdiction, you may have the right to:</p>
            <ul className="mt-2 list-inside list-disc space-y-1 pl-2">
              <li>Access the personal data we hold about you</li>
              <li>Correct inaccurate or incomplete data</li>
              <li>Request deletion of your data (&quot;right to be forgotten&quot;)</li>
              <li>Export your data in a portable format</li>
              <li>Withdraw consent for analytics cookies at any time</li>
              <li>Object to or restrict processing of your data</li>
              <li>Lodge a complaint with a supervisory authority</li>
            </ul>
            <p className="mt-2">
              <strong className="text-zinc-300">
                California residents (CCPA):
              </strong>{" "}
              You have the right to know what personal information is collected,
              request deletion, and opt out of the sale of personal information.
              We do not sell personal information.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-200">
              9. Children&apos;s Privacy
            </h2>
            <p>
              The Service is not directed to individuals under 16. We do not
              knowingly collect personal data from children. If we learn that we
              have collected data from a child, we will delete it promptly.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-200">
              10. International Data Transfers
            </h2>
            <p>
              Your data may be processed in countries other than your own
              (including the United States) where our hosting providers and
              third-party services operate. We ensure appropriate safeguards
              (e.g., Standard Contractual Clauses) are in place for such
              transfers.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-200">
              11. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will
              notify registered users of material changes via email or an
              in-app notice. Continued use of the Service after changes
              constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-200">
              12. Contact Us
            </h2>
            <p>
              If you have questions about this Privacy Policy or wish to
              exercise your data rights, contact us at{" "}
              <a
                href="mailto:privacy@sbuild.studio"
                className="text-[#6d5efc] underline underline-offset-2 hover:text-[#8b7efc]"
              >
                privacy@sbuild.studio
              </a>
              .
            </p>
          </section>

          {/* Ownership note */}
          <section className="mt-8 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
            <p className="text-xs text-zinc-500">
              <strong className="text-zinc-400">Asset Transfer Note:</strong>{" "}
              Upon sale of this business, all rights, obligations, and data
              processing responsibilities described in this Privacy Policy
              transfer to the new owner. Users will be notified of any change
              in data controller within 30 days of the transfer.
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
