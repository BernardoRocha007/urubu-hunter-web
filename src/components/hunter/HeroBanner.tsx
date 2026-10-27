'use client';

import React from 'react';
import { Target, TrendingDown, ShieldCheck } from 'lucide-react';

interface HeroBannerProps {
  totalItems: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ totalItems }) => {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-zinc-900/90 to-zinc-950/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-xl">
          <span className="text-xs uppercase tracking-widest font-mono text-lime-400 font-bold">
            Streetwear Intelligence
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tracking-tight">
            Garimpo AutÃ´nomo & AvaliaÃ§Ã£o de Estilo
          </h1>
          <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
            Monitorando lojas de nicho no Brasil. PeÃ§as prÃ©-filtradas em sub-1ms e avaliadas por IA para combinar com o seu perfil estÃ©tico.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 shrink-0">
          <div className="rounded-xl border border-white/5 bg-black/40 p-3.5 text-center">
            <Target className="w-4 h-4 mx-auto text-lime-400 mb-1" />
            <div className="text-lg font-bold text-white font-mono">{totalItems}</div>
            <div className="text-[10px] text-zinc-400 uppercase tracking-wider">Garimpados</div>
          </div>

          <div className="rounded-xl border border-white/5 bg-black/40 p-3.5 text-center">
            <TrendingDown className="w-4 h-4 mx-auto text-emerald-400 mb-1" />
            <div className="text-lg font-bold text-white font-mono">AtÃ© 30%</div>
            <div className="text-[10px] text-zinc-400 uppercase tracking-wider">Descontos</div>
          </div>

          <div className="rounded-xl border border-white/5 bg-black/40 p-3.5 text-center">
            <ShieldCheck className="w-4 h-4 mx-auto text-sky-400 mb-1" />
            <div className="text-lg font-bold text-white font-mono">100%</div>
            <div className="text-[10px] text-zinc-400 uppercase tracking-wider">Lojas Reais</div>
          </div>
        </div>
      </div>
    </section>
  );
};
