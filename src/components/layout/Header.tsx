'use client';

import React from 'react';
import { Sparkles, Activity } from 'lucide-react';

interface HeaderProps {
  totalItems: number;
}

export const Header: React.FC<HeaderProps> = ({ totalItems }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-black/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-lime-400/20 border border-lime-400/30 flex items-center justify-center text-lime-400 shadow-lg shadow-lime-950/40">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-white text-lg font-mono">URUBU</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-lime-400/10 text-lime-400 border border-lime-400/20">
                HUNTER
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-sans hidden sm:block">Curadoria de Moda com IA Multimodal</p>
          </div>
        </div>

        {/* Status & Stats */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-white/5 text-xs text-zinc-300 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <Activity className="w-3.5 h-3.5 text-zinc-400" />
            <span>.NET 10 API</span>
          </div>

          <div className="text-xs text-zinc-400 font-mono hidden md:block">
            <span className="text-white font-bold">{totalItems}</span> peÃ§as no feed
          </div>
        </div>
      </div>
    </header>
  );
};
