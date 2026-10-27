'use client';

import React from 'react';
import { Search, Tag, Sparkles } from 'lucide-react';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory?: string;
  onSelectCategory: (cat?: string) => void;
  availableCategories: string[];
  saleOnly: boolean;
  onToggleSaleOnly: () => void;
  minScore?: number;
  onSelectMinScore: (score?: number) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  availableCategories,
  saleOnly,
  onToggleSaleOnly,
  minScore,
  onSelectMinScore
}) => {
  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl border border-white/10 bg-zinc-900/60 backdrop-blur-md">
      {/* Search and Quick Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar por marca (Class, Sufgang, Pace) ou peÃ§a..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-white/10 bg-black/50 text-white placeholder-zinc-500 focus:outline-none focus:border-lime-400/50 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {/* Sale Only Toggle */}
          <button
            onClick={onToggleSaleOnly}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              saleOnly
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-black/30 border-white/10 text-zinc-400 hover:text-white'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Em PromoÃ§Ã£o</span>
          </button>

          {/* Min Score Filter */}
          <button
            onClick={() => onSelectMinScore(minScore ? undefined : 80)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              minScore
                ? 'bg-lime-400/20 border-lime-400/40 text-lime-300'
                : 'bg-black/30 border-white/10 text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{minScore ? `Score â‰¥ ${minScore}%` : 'Qualquer Score'}</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      {availableCategories.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
          <button
            onClick={() => onSelectCategory(undefined)}
            className={`px-3 py-1 text-xs rounded-full border transition-colors shrink-0 ${
              !selectedCategory
                ? 'bg-white text-black font-semibold border-white'
                : 'bg-black/40 text-zinc-400 border-white/5 hover:border-white/20 hover:text-white'
            }`}
          >
            Todas as Categorias
          </button>
          {availableCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat === selectedCategory ? undefined : cat)}
              className={`px-3 py-1 text-xs rounded-full border transition-colors shrink-0 ${
                cat === selectedCategory
                  ? 'bg-lime-400 text-black font-semibold border-lime-400'
                  : 'bg-black/40 text-zinc-400 border-white/5 hover:border-white/20 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
