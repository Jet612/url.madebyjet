import React, { useState } from 'react';
import { ShortenedLink } from '../types';
import { Copy, ExternalLink, BarChart2, Trash2, Check, QrCode, Download, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';

interface LinkCardProps {
  link: ShortenedLink;
  onDelete: (id: string) => void;
  onVisit: (id: string) => void;
}

const LinkCard: React.FC<LinkCardProps> = ({ link, onDelete, onVisit }) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [qrCopied, setQrCopied] = useState(false);

  const displayUrl = `https://url.madebyjet.dev/${link.alias || link.shortCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(displayUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQr = () => {
    const canvas = document.getElementById(`qr-${link.id}`) as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.download = `qr-${link.alias || link.shortCode}.png`;
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const copyQrImage = async () => {
    const canvas = document.getElementById(`qr-${link.id}`) as HTMLCanvasElement;
    if (canvas) {
      try {
        canvas.toBlob(async (blob) => {
          if (blob) {
            await navigator.clipboard.write([
              new ClipboardItem({
                [blob.type]: blob,
              }),
            ]);
            setQrCopied(true);
            setTimeout(() => setQrCopied(false), 2000);
          }
        });
      } catch (err) {
        console.error('Failed to copy QR code', err);
      }
    }
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
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-500/20 rounded-full blur-3xl group-hover:bg-brand-500/30 transition-all duration-500" />
      <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all duration-500" />

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 relative z-10">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-mono font-semibold text-brand-300 truncate tracking-tight">
              <span className="text-slate-500">url.madebyjet.dev/</span>{link.alias || link.shortCode}
            </h3>
          </div>

          <div className="flex items-center text-sm text-slate-400 mb-3 truncate w-full">
            <span className="truncate max-w-[300px]">{link.originalUrl}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500">
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
                <QRCodeCanvas
                  id={`qr-${link.id}`}
                  value={displayUrl}
                  size={120}
                  level="H"
                />
              </div>
              <p className="text-xs text-slate-400 mt-2 font-mono mb-3">{displayUrl}</p>

              <div className="flex items-center gap-2">
                <button
                  onClick={copyQrImage}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-colors border border-slate-700/50 hover:border-brand-500/30"
                >
                  {qrCopied ? <Check size={14} className="text-brand-400" /> : <Copy size={14} />}
                  Copy Image
                </button>
                <button
                  onClick={downloadQr}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-colors border border-slate-700/50 hover:border-brand-500/30"
                >
                  <Download size={14} />
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LinkCard;