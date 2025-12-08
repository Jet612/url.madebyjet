import React from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'Terms of Service - JetShort',
  description: 'Terms of Service for JetShort URL Shortener',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-brand-500/30">
      <Header variant="simple" sticky={true} />

      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="prose prose-invert prose-slate max-w-none">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 pb-1 bg-clip-text text-transparent bg-[linear-gradient(to_right,#ffffff,#e2e8f0,#99f6e4)]">
            Terms of Service
          </h1>
          <p className="text-slate-400 text-sm mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div className="space-y-8 text-slate-300">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-slate-400 leading-relaxed">
                By accessing and using JetShort ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
              <p className="text-slate-400 leading-relaxed">
                JetShort is a URL shortening service that allows users to create shortened links and generate QR codes. The Service is provided "as is" and we reserve the right to modify, suspend, or discontinue any part of the Service at any time without prior notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. User Accounts</h2>
              <p className="text-slate-400 leading-relaxed mb-3">
                To use certain features of the Service, you must register for an account. You agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-400 ml-4">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security of your password and identification</li>
                <li>Accept all responsibility for activities that occur under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Acceptable Use</h2>
              <p className="text-slate-400 leading-relaxed mb-3">
                You agree not to use the Service to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-400 ml-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others</li>
                <li>Transmit any malicious code, viruses, or harmful data</li>
                <li>Engage in phishing, spamming, or other fraudulent activities</li>
                <li>Distribute malware or engage in any activity that could harm our systems or users</li>
                <li>Use the Service for any illegal or unauthorized purpose</li>
                <li>Attempt to gain unauthorized access to any portion of the Service</li>
                <li>Interfere with or disrupt the Service or servers connected to the Service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Subscription Plans and Limits</h2>
              <p className="text-slate-400 leading-relaxed">
                The Service offers different subscription plans with varying link limits. You are responsible for managing your links within the limits of your chosen plan. If you exceed your plan's limits, you may be required to upgrade your plan or delete links to comply with your current plan's restrictions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Content and Links</h2>
              <p className="text-slate-400 leading-relaxed mb-3">
                You are solely responsible for the content of the URLs you shorten using the Service. We do not endorse, support, or verify the content of shortened links. You agree that:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-400 ml-4">
                <li>You have the right to use and share the content you link to</li>
                <li>The content does not violate any third-party rights</li>
                <li>You will not use the Service to link to illegal, harmful, or offensive content</li>
                <li>We reserve the right to remove or disable any link at our sole discretion</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Intellectual Property</h2>
              <p className="text-slate-400 leading-relaxed">
                The Service and its original content, features, and functionality are owned by JetShort and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. You may not copy, modify, distribute, sell, or lease any part of the Service without our prior written consent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Termination</h2>
              <p className="text-slate-400 leading-relaxed">
                We may terminate or suspend your account and access to the Service immediately, without prior notice, for any reason, including if you breach these Terms. Upon termination, your right to use the Service will cease immediately. If you have more links than your plan allows after cancellation, you will be given the opportunity to select which links to keep.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Disclaimer of Warranties</h2>
              <p className="text-slate-400 leading-relaxed">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. Limitation of Liability</h2>
              <p className="text-slate-400 leading-relaxed">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, JETSHORT SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES RESULTING FROM YOUR USE OF THE SERVICE.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">11. Changes to Terms</h2>
              <p className="text-slate-400 leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the new Terms on this page and updating the "Last updated" date. Your continued use of the Service after such modifications constitutes acceptance of the updated Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">12. Contact Information</h2>
              <p className="text-slate-400 leading-relaxed">
                If you have any questions about these Terms, please contact us at <Link href="https://madebyjet.dev" className="text-brand-400 hover:text-brand-300 underline" target="_blank" rel="noopener noreferrer">madebyjet.dev</Link>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
