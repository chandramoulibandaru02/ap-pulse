import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for AP Pulse.",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-serif text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-[#888] mb-8">Last updated: October 2026</p>

      <div className="space-y-6 text-[#333] text-sm leading-relaxed">
        <section>
          <h2 className="font-serif text-xl font-bold mb-3">1. Information We Collect</h2>
          <p>
            AP Pulse is a read-only news publication. We do not require registration or login for
            readers. We may collect anonymous usage data through standard web analytics, including:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Pages visited and time spent on each page</li>
            <li>General geographic location (country or region)</li>
            <li>Device type, browser, and operating system</li>
            <li>Referring website or search query</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold mb-3">2. How We Use Information</h2>
          <p>Any data collected is used solely to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Understand how readers use the Website</li>
            <li>Improve the Website&apos;s performance and content</li>
            <li>Diagnose technical issues</li>
          </ul>
          <p className="mt-2">
            We do not sell, rent, or share your data with third parties for marketing purposes.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold mb-3">3. Cookies</h2>
          <p>
            The Website may use essential cookies for basic functionality. No tracking cookies are
            used for advertising. You may disable cookies in your browser settings, which may affect
            some Website features.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold mb-3">4. Third-Party Services</h2>
          <p>The Website uses the following third-party services:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Firebase</strong> — for database and authentication (admin only)</li>
            <li><strong>ImgBB</strong> — for image storage and delivery</li>
            <li><strong>Vercel</strong> — for website hosting</li>
          </ul>
          <p className="mt-2">
            Each service has its own privacy policy. We encourage you to review them.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold mb-3">5. External Links</h2>
          <p>
            AP Pulse is not responsible for the privacy practices of external websites linked from our
            content.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold mb-3">6. Children&apos;s Privacy</h2>
          <p>
            The Website does not knowingly collect personal information from children under 13.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold mb-3">7. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. The updated date at the top of this
            page reflects the most recent revision.
          </p>
        </section>

        <section className="pt-4 border-t border-[#e5e5e5]">
          <p className="text-xs text-[#888]">
            This policy is provided for informational purposes. For legal advice specific to your
            situation, consult a qualified legal professional.
          </p>
        </section>
      </div>
    </div>
  );
}
