import React from 'react';
import { redirect } from 'next/navigation';
import { getSubscriptionStatus, getUserLinks } from './actions';
import CleanupClient from './CleanupClient';
import Header from '../../components/Header';

export const dynamic = 'force-dynamic';

export default async function CleanupPage() {
  const status = await getSubscriptionStatus();

  if (!status.isOverLimit) {
    redirect('/');
  }

  const links = await getUserLinks();

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-brand-500/30">
      <Header variant="disabled" sticky={true} />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <CleanupClient
          initialLinks={links}
          limit={status.limit}
          count={status.count}
          plan={status.plan}
        />
      </main>
    </div>
  );
}
