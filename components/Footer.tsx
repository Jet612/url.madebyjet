import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-20 bg-slate-950 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <Link href="https://madebyjet.dev" className="text-slate-400 hover:text-brand-400 transition-colors font-poppins font-bold text-lg" target="_blank" rel="noopener noreferrer">Made by Jet</Link>
            <p className="text-slate-400 text-sm">
              &copy; {new Date().getFullYear()} Jackson Tavares. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
