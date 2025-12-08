'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteLinks } from './actions';
import { Trash2, AlertCircle, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Link {
  id: string;
  shortCode: string;
  originalUrl: string;
  alias?: string | null;
  clicks: number;
  createdAt: Date;
}

interface CleanupClientProps {
  initialLinks: Link[];
  limit: number;
  count: number;
  plan: string;
}

export default function CleanupClient({
  initialLinks,
  limit,
  count,
  plan,
}: CleanupClientProps) {
  const [links, setLinks] = useState(initialLinks);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const currentCount = links.length;
  const overLimitBy = Math.max(0, currentCount - limit);
  const selectedCount = selectedIds.size;
  const remainingAfterDelete = currentCount - selectedCount;
  const willBeUnderLimit = remainingAfterDelete <= limit;

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleDelete = async () => {
    if (selectedIds.size === 0) return;

    setIsDeleting(true);
    try {
      const result = await deleteLinks(Array.from(selectedIds));

      if (result.redirect) {
        router.push('/');
        return;
      }

      // Update local state if not redirected
      const newLinks = links.filter(link => !selectedIds.has(link.id));
      setLinks(newLinks);
      setSelectedIds(new Set());

      // If we are now under limit (though the action should have handled redirect if so, 
      // but maybe network latency or something), check locally
      if (newLinks.length <= limit) {
        router.push('/');
      }

    } catch (error) {
      console.error('Failed to delete links', error);
      alert('Failed to delete links. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 mb-8 backdrop-blur-sm">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-red-500/10 rounded-xl">
            <AlertCircle className="text-red-400 w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Subscription Limit Exceeded</h1>
            <p className="text-slate-400 leading-relaxed">
              Your current plan (<span className="font-semibold text-brand-400 capitalize">{plan.replace(/_/g, ' ')}</span>) allows for <span className="font-semibold text-white">{limit === Infinity ? 'Unlimited' : limit}</span> links, but you currently have <span className="font-semibold text-white">{count}</span>.
            </p>
            <p className="text-slate-400 mt-2">
              Please delete at least <span className="font-bold text-red-400">{overLimitBy}</span> links to continue using your dashboard.
            </p>
          </div>
        </div>

        <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-400">
              Selected: <span className="text-white font-medium">{selectedCount}</span>
            </div>
            <div className="text-sm text-slate-400">
              Remaining: <span className={`font-medium ${willBeUnderLimit ? 'text-green-400' : 'text-red-400'}`}>{remainingAfterDelete}</span>
              <span className="text-slate-600 ml-1">/ {limit === Infinity ? '∞' : limit}</span>
            </div>
          </div>

          <button
            onClick={handleDelete}
            disabled={!willBeUnderLimit || isDeleting || selectedCount === 0}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${willBeUnderLimit && selectedCount > 0
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
          >
            {isDeleting ? 'Deleting...' : (
              <>
                <Trash2 size={18} />
                Delete Selected & Continue
              </>
            )}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {links.map((link) => (
            <motion.div
              key={link.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className={`group relative overflow-hidden rounded-xl border transition-all duration-200 ${selectedIds.has(link.id)
                ? 'bg-red-500/5 border-red-500/30 shadow-[0_0_15px_-5px_rgba(239,68,68,0.1)]'
                : 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600'
                }`}
            >
              <div
                onClick={() => toggleSelection(link.id)}
                className="flex items-center gap-4 p-4 cursor-pointer"
              >
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedIds.has(link.id)
                  ? 'bg-red-500 border-red-500'
                  : 'border-slate-600 group-hover:border-slate-500 bg-slate-800'
                  }`}>
                  {selectedIds.has(link.id) && (
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-brand-300 font-medium truncate">
                      {link.alias || link.shortCode}
                    </span>
                    <span className="text-slate-600 text-xs">•</span>
                    <span className="text-xs text-slate-500">
                      {new Date(link.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm text-slate-400 truncate flex items-center gap-2">
                    <span className="truncate">{link.originalUrl}</span>
                    <a
                      href={link.originalUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-slate-600 hover:text-slate-400 p-1"
                    >
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-300">{link.clicks}</span>
                    <span className="text-xs uppercase tracking-wider">clicks</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
