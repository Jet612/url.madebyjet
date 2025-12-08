'use client';

import React from 'react';
import Link from 'next/link';
import { useUser, UserButton } from '@clerk/nextjs';

interface HeaderProps {
  variant?: 'default' | 'simple' | 'disabled';
  showPricing?: boolean;
  sticky?: boolean;
}

export default function Header({ variant = 'default', showPricing = false, sticky = false }: HeaderProps) {
  const { isSignedIn, isLoaded } = useUser();

  const headerClasses = sticky
    ? 'py-4 border-b border-white/5 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50'
    : 'py-4';

  const logoClasses = variant === 'disabled'
    ? 'flex items-center gap-2 font-poppins font-bold text-xl tracking-tighter text-slate-100 opacity-50 cursor-not-allowed pointer-events-none'
    : 'flex items-center gap-2 font-poppins font-bold text-xl tracking-tighter text-slate-100';

  return (
    <header className={headerClasses}>
      <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
        <Link href="/" className={logoClasses}>
          <img src="https://madebyjet.dev/favicon.png" alt="Logo" width={30} height={30} />
          <span>Jet<span className="text-brand-400">Short</span></span>
        </Link>
        <div className="flex items-center gap-4">
          {variant === 'default' && (
            <>
              {showPricing && (
                <Link href="/pricing" className="text-slate-300 hover:text-brand-400 transition-colors font-medium text-sm">
                  Pricing
                </Link>
              )}
              {isLoaded && (
                isSignedIn ? (
                  <>
                    {showPricing && <div className="h-6 w-px bg-slate-800"></div>}
                    <UserButton />
                  </>
                ) : !showPricing ? (
                  <div className="flex items-center gap-4">
                    <Link href="/sign-in" className="text-slate-300 hover:text-white transition-colors font-medium text-sm">
                      Sign in
                    </Link>
                    <Link href="/sign-up" className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all border border-slate-700">
                      Get Started
                    </Link>
                  </div>
                ) : null
              )}
            </>
          )}
          {variant === 'simple' && isLoaded && isSignedIn && (
            <UserButton />
          )}
        </div>
      </div>
    </header>
  );
}
