'use client';

import React, { useState, useEffect } from 'react';
import { Link2, Wand2, Loader2, Search, ArrowRight, Github } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { ShortenedLink, SortOption } from '../types';
import { generateShortCode, isValidUrl } from '../utils/base62';
import { generateSmartAlias } from '../services/geminiService';
import LinkCard from '../components/LinkCard';

const LOCAL_STORAGE_KEY = 'jetshort_links';

export default function Home() {
  const [url, setUrl] = useState('');
  const [links, setLinks] = useState<ShortenedLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState('');
  const [apiKeyExists, setApiKeyExists] = useState(false);

  // Check for API key on mount
  useEffect(() => {
    setApiKeyExists(!!process.env.NEXT_PUBLIC_GEMINI_API_KEY);
  }, []);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        setLinks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse links", e);
      }
    }
  }, []);

  // Save to local storage whenever links change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(links));
  }, [links]);

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
      let aiData = null;
      
      // Only try AI if enabled and API key exists
      if (aiEnabled && process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
        aiData = await generateSmartAlias(url);
      }

      const newLink: ShortenedLink = {
        id: crypto.randomUUID(),
        originalUrl: url,
        shortCode: generateShortCode(),
        alias: aiData?.suggestedAlias,
        createdAt: Date.now(),
        clicks: 0,
        aiTags: aiData?.tags,
        aiSummary: aiData?.summary
      };

      setLinks(prev => [newLink, ...prev]);
      setUrl('');
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setLinks(prev => prev.filter(l => l.id !== id));
  };

  const handleVisit = (id: string) => {
    setLinks(prev => prev.map(l => 
      l.id === id ? { ...l, clicks: l.clicks + 1 } : l
    ));
  };

  const filteredLinks = links.filter(link => 
    link.originalUrl.toLowerCase().includes(filter.toLowerCase()) || 
    (link.alias && link.alias.toLowerCase().includes(filter.toLowerCase())) ||
    (link.aiTags && link.aiTags.some(t => t.toLowerCase().includes(filter.toLowerCase())))
  );

  return (
    <div className="min-h-screen bg-custom-gradient font-sans text-slate-100 selection:bg-brand-500/30">
      
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-900/50 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Link2 className="text-white" size={20} />
            </div>
            <span className="font-playfair font-bold text-xl tracking-tight">
              Jet<span className="text-brand-400">Short</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
             <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
            >
              <Github size={20} />
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        
        {/* Hero / Input Section */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-brand-200">
              Shorten Your Links intelligently
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Transform long, ugly URLs into short, memorable brands. Powered by Gemini for smart alias generation.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto group">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 via-purple-500 to-brand-500 rounded-2xl opacity-30 group-hover:opacity-60 transition duration-500 blur-lg"></div>
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
                  type="button"
                  onClick={() => setAiEnabled(!aiEnabled)}
                  className={`p-2 rounded-lg transition-all ${aiEnabled ? 'text-brand-400 bg-brand-400/10' : 'text-slate-600 hover:text-slate-400'}`}
                  title={aiEnabled ? "AI Alias Enabled" : "Enable AI Alias"}
                >
                  <Wand2 size={20} />
                </button>
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
              <p className="absolute -bottom-8 left-4 text-red-400 text-sm animate-pulse">
                {error}
              </p>
            )}
          </form>

          <div className="mt-4 text-center">
             {!apiKeyExists && (
               <p className="text-xs text-yellow-500/80 bg-yellow-500/10 inline-block px-3 py-1 rounded-full border border-yellow-500/20">
                 Note: No NEXT_PUBLIC_GEMINI_API_KEY found. AI features will be disabled.
               </p>
             )}
          </div>
        </section>

        {/* List Section */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold font-playfair flex items-center gap-2">
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
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 mt-20 bg-slate-950 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} MadeByJet.dev. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

