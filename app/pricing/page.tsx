'use client';

import React from 'react';
import { PricingTable, useUser } from '@clerk/nextjs';
import { AlertTriangle } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function PricingPage() {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.admin === true;

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-brand-500/30">
      <Header variant="default" />

      <main className="max-w-6xl mx-auto px-4 py-16">

        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 pb-1 bg-clip-text text-transparent bg-[linear-gradient(to_right,#ffffff,#e2e8f0,#99f6e4)]">
            JetShort Pricing
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Choose the plan that fits your needs. No hidden fees.
          </p>

          {isAdmin && (
            <div className="mt-8 inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-2 text-amber-500">
              <AlertTriangle className="w-5 h-5" />
              <p className="font-medium">
                You have the admin role, you have the unlimited plan
              </p>
            </div>
          )}
        </div>

        {/* Pricing Table */}
        <div className="w-full flex justify-center">
          <PricingTable newSubscriptionRedirectUrl="/subscription-cleanup" />
        </div>

        {/* FAQ Section (Optional enhancement) */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Can I change plans later?</h3>
              <p className="text-slate-400">Yes, you can upgrade or downgrade your plan at any time.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">What happens to my links if I cancel?</h3>
              <p className="text-slate-400">If you have more links than your new plan allows, you will be redirected to a page where you can choose which links to keep and which to delete.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
