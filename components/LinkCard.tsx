import React, { useState } from 'react';
import { ShortenedLink } from '../types';
import { Copy, ExternalLink, BarChart2, Trash2, Check, Sparkles, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';

interface LinkCardProps {
  link: ShortenedLink;
  onDelete: (id: string) => void;
  onVisit: (id: string) => void;
}

const LinkCard: React.FC<LinkCardProps> = ({ link, onDelete, onVisit }) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const displayUrl = `url.madebyjet.dev/${link.alias || link.shortCode}`;
  
  const handleCopy = () => {
    navigator.clipboard.writeText(displayUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVisit = () => {
    onVisit(link.id);
    window.open(link.originalUrl, '_blank');
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-xl p-5 hover:border-brand-500/30 transition-colors group relative overflow-hidden"
    >
      {/* Decorative gradient blob */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-brand-500/10 rounded-full blur-2xl group-hover:bg-brand-500/20 transition-all duration-500" />

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 relative z-10">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
             <h3 className="text-xl font-mono font-semibold text-brand-300 truncate tracking-tight">
              /{link.alias || link.shortCode}
            </h3>
            {link.aiSummary && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Sparkles size={10} className="mr-1" /> AI Generated
              </span>
            )}
          </div>
         
          <div className="flex items-center text-sm text-slate-400 mb-3 truncate w-full">
            <span className="truncate max-w-[300px]">{link.originalUrl}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {link.aiTags?.map(tag => (
              <span key={tag} className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md bg-slate-700/50 text-slate-300 border border-slate-600">
                {tag}
              </span>
            ))}
            <span className="text-xs text-slate-500 ml-auto md:ml-0">
              {new Date(link.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 md:self-center">
          <div className="flex flex-col items-end mr-4 border-r border-slate-700/50 pr-4">
            <span className="text-2xl font-bold text-white">{link.clicks}</span>
            <span className="text-xs text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <BarChart2 size={10} /> Clicks
            </span>
          </div>

          <button 
            onClick={() => setShowQr(!showQr)}
            className="p-2 rounded-lg bg-slate-700/30 hover:bg-slate-700 text-slate-300 transition-colors"
            title="QR Code"
          >
            <QrCode size={18} />
          </button>

          <button 
            onClick={handleCopy}
            className="p-2 rounded-lg bg-slate-700/30 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Copy Short Link"
          >
            {copied ? <Check size={18} className="text-brand-400" /> : <Copy size={18} />}
          </button>
          
          <button 
            onClick={handleVisit}
            className="p-2 rounded-lg bg-slate-700/30 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Visit Original"
          >
            <ExternalLink size={18} />
          </button>
          
          <button 
            onClick={() => onDelete(link.id)}
            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-transparent hover:border-red-500/30 transition-all"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showQr && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-slate-700/50 flex flex-col items-center justify-center p-4 bg-white/5 rounded-lg">
              <div className="bg-white p-2 rounded-lg">
                <QRCodeSVG value={displayUrl} size={120} />
              </div>
              <p className="text-xs text-slate-400 mt-2 font-mono">{displayUrl}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {link.aiSummary && (
        <div className="mt-3 text-xs text-slate-400 bg-slate-900/30 p-2 rounded border border-slate-700/30 flex items-start gap-2">
          <Sparkles size={12} className="mt-0.5 text-brand-400 flex-shrink-0" />
          {link.aiSummary}
        </div>
      )}
    </motion.div>
  );
};

export default LinkCard;