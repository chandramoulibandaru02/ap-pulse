import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Terms and conditions for using AP Pulse.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-serif text-3xl font-bold mb-2">Terms and Conditions</h1>
      <p className="text-sm text-[#888] mb-8">Last updated: October 2026</p>
      <div className="prose-style space-y-6 text-[#333] text-sm leading-relaxed">
        <section>
          <h2 className="font-serif text-xl font-bold mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing or using AP Pulse (&quot;the Website&quot;), you agree to be bound by these Terms and
            Conditions. If you do not agree to these terms, please do not use the Website.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-xl font-bold mb-3">2. Use of Content</h2>
          <p>
            All content published on AP Pulse, including articles, photographs, graphics, and other
            material, is the property of AP Pulse or its content providers and is protected by applicable
            copyright laws. You may not reproduce, republish, distribute, or exploit any content from
            this Website without prior written permission.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-xl font-bold mb-3">3. Accuracy of Information</h2>
          <p>
            AP Pulse makes reasonable efforts to ensure the accuracy and timeliness of published news.
            However, we do not guarantee the completeness or accuracy of any information and are not
            responsible for errors or omissions. News content reflects conditions at the time of
            publication and may not be updated.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-xl font-bold mb-3">4. External Links</h2>
          <p>
            The Website may contain links to third-party websites. These links are provided for
            convenience only. AP Pulse does not endorse and is not responsible for the content or
            practices of linked websites.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-xl font-bold mb-3">5. Prohibited Use</h2>
          <p>You must not use the Website to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Violate any applicable law or regulation</li>
            <li>Infringe upon the intellectual property rights of others</li>
            <li>Transmit harmful, offensive, or misleading content</li>
            <li>Attempt to gain unauthorized access to any system or data</li>
          </ul>
        </section>
        <section>
          <h2 className="font-serif text-xl font-bold mb-3">6. Limitation of Liability</h2>
          <p>
            To the extent permitted by law, AP Pulse shall not be liable for any indirect, incidental,
            or consequential damages arising from your use of or inability to use the Website.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-xl font-bold mb-3">7. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms and Conditions at any time. Continued use of the
            Website after changes constitutes acceptance of the revised terms.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-xl font-bold mb-3">8. Governing Law</h2>
          <p>
            These Terms shall be governed by the laws of India. Any disputes shall be subject to the
            jurisdiction of courts in Andhra Pradesh, India.
          </p>
        </section>
        <section className="pt-4 border-t border-[#e5e5e5]">
          <p className="text-xs text-[#888]">
            These terms are provided for informational purposes. For legal advice specific to your
            situation, consult a qualified legal professional.
          </p>
        </section>
      </div>
    </div>
  );
}
