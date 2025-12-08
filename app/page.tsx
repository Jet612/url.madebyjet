'use client';

import React, { useState, useEffect } from 'react';
import { Link2, Loader2, Search, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/nextjs';

import { ShortenedLink } from '../types';
import { isValidUrl } from '../utils/base62';
import LinkCard from '../components/LinkCard';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getSubscriptionStatus } from './subscription-cleanup/actions';

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [links, setLinks] = useState<ShortenedLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState<string | React.ReactNode>('');

  // Fetch links from database when user is signed in
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      checkSubscription();
      fetchLinks();
    } else if (isLoaded && !isSignedIn) {
      setLinks([]);
    }
  }, [isLoaded, isSignedIn]);

  const checkSubscription = async () => {
    try {
      const status = await getSubscriptionStatus();
      if (status.isOverLimit) {
        router.push('/subscription-cleanup');
      }
    } catch (err) {
      console.error('Error checking subscription:', err);
    }
  };

  const fetchLinks = async () => {
    setFetching(true);
    try {
      const response = await fetch('/api/links');
      if (response.ok) {
        const data = await response.json();
        setLinks(data);
      }
    } catch (err) {
      console.error('Error fetching links:', err);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url) return;
    if (!isValidUrl(url)) {
      setError('Please enter a valid URL (include http:// or https://)');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ originalUrl: url }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        if (errorData.code === 'LIMIT_REACHED') {
          setError(
            <span>
              {errorData.error} Please <Link href="/pricing" className="underline hover:text-brand-400 font-medium">upgrade your plan</Link> to create more.
            </span>
          );
          return;
        }

        throw new Error(errorData.error || 'Failed to create link. Please try again later.');
      }

      const newLink = await response.json();
      setLinks(prev => [newLink, ...prev]);
      setUrl('');
    } catch (err: any) {
      console.error('Full error:', err);
      // Show more detailed error message
      const errorMessage = err.message || 'Something went wrong. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/links/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setLinks(prev => prev.filter(l => l.id !== id));
      }
    } catch (err) {
      console.error('Error deleting link:', err);
    }
  };

  const handleVisit = async (id: string) => {
    try {
      await fetch(`/api/links/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ incrementClicks: true }),
      });

      // Optimistically update the UI
      setLinks(prev => prev.map(l =>
        l.id === id ? { ...l, clicks: l.clicks + 1 } : l
      ));
    } catch (err) {
      console.error('Error updating clicks:', err);
    }
  };

  const filteredLinks = links.filter(link =>
    link.originalUrl.toLowerCase().includes(filter.toLowerCase()) ||
    (link.alias && link.alias.toLowerCase().includes(filter.toLowerCase())) ||
    link.shortCode.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-brand-500/30">
      <Header variant="default" showPricing={true} />

      <main className="max-w-4xl mx-auto px-4 py-12">

        {/* Hero / Input Section */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h1
              className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text bg-[linear-gradient(to_right,#ffffff,#e2e8f0,#99f6e4)] text-transparent"
            >
              Shorten Your Links
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Transform long, ugly URLs into short, memorable links.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto group">
            <div className="absolute -inset-1 bg-[linear-gradient(to_right,#14b8a6,#a855f7,#14b8a6)] rounded-2xl opacity-30 group-hover:opacity-50 transition duration-500 blur-lg"></div>
            <div className="relative bg-slate-900 border border-slate-700 rounded-2xl p-2 flex items-center shadow-2xl">
              <div className="pl-4 text-slate-500">
                <Link2 size={20} />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste your long link here..."
                className="flex-1 bg-transparent border-none text-white placeholder-slate-500 focus:ring-0 px-4 py-3 outline-none w-full"
              />

              <div className="flex items-center gap-2 pr-2">
                <button
                  type="submit"
                  disabled={loading || !url}
                  className="bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg shadow-brand-500/20 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      <span className="hidden sm:inline">Processing</span>
                    </>
                  ) : (
                    <>
                      Shorten <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
            {error && (
              <p className="absolute -bottom-8 left-4 text-red-400 text-sm">
                {error}
              </p>
            )}
          </form>
        </section>

        {/* List Section */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold font-poppins flex items-center gap-2">
              Your Links <span className="text-sm font-sans font-normal text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">{links.length}</span>
            </h2>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="text"
                placeholder="Search links..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-slate-800/50 border border-slate-700/50 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-all w-full sm:w-64"
              />
            </div>
          </div>

          <div className="grid gap-4">
            {fetching ? (
              <div className="text-center py-20">
                <Loader2 className="animate-spin mx-auto text-brand-400" size={32} />
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredLinks.length > 0 ? (
                  filteredLinks.map((link) => (
                    <LinkCard
                      key={link.id}
                      link={link}
                      onDelete={handleDelete}
                      onVisit={handleVisit}
                    />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/20"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-4 text-slate-600">
                      <Link2 size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-slate-300">No links found</h3>
                    <p className="text-slate-500 max-w-xs mx-auto mt-2">
                      Paste a URL above to create your first shortened link.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

