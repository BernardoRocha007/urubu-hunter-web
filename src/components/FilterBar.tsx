'use client';
import React from 'react';
import { Search, Flame, Zap, Trash2 } from 'lucide-react';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  saleOnly: boolean;
  onToggleSaleOnly: () => void;
  minScore: number | undefined;
  onSelectMinScore: (score: number | undefined) => void;
  selectedCategory: string | undefined;
  onSelectCategory: (cat: string | undefined) => void;
  availableCategories: string[];
  onClearFeed: () => void;
  isClearingFeed?: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  onSearchChange,
  saleOnly,
  onToggleSaleOnly,
  minScore,
  onSelectMinScore,
  selectedCategory,
  onSelectCategory,
  availableCategories,
  onClearFeed,
  isClearingFeed
}) => {
  return (
    <div className="filter-bar" id="items-filter-bar">
      <div className="filter-group">
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '10px' }} />
          <input
            type="text"
            className="filter-input"
            style={{ paddingLeft: '34px', width: '220px' }}
            placeholder="Buscar peça, marca ou tag..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            id="input-search-items"
          />
        </div>

        {/* Quick Toggles */}
        <button
          className={`filter-chip ${saleOnly ? 'active' : ''}`}
          onClick={onToggleSaleOnly}
          id="chip-filter-sale"
        >
          <Flame size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
          Apenas Promoções
        </button>

        <button
          className={`filter-chip ${minScore === 85 ? 'active' : ''}`}
          onClick={() => onSelectMinScore(minScore === 85 ? undefined : 85)}
          id="chip-filter-top-match"
        >
          <Zap size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
          Top Match (&gt;85%)
        </button>

        {/* Botão Limpar Feed (Mantém Likes) */}
        <button
          className="filter-chip"
          onClick={onClearFeed}
          disabled={isClearingFeed}
          id="btn-clear-feed"
          title="Limpar itens não favoritados (seus likes e itens salvos serão preservados)"
          style={{
            borderColor: 'hsla(350, 89%, 60%, 0.3)',
            color: 'var(--text-secondary)'
          }}
        >
          <Trash2 size={13} color="var(--accent-danger)" style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
          <span>{isClearingFeed ? 'Limpando...' : 'Limpar Feed'}</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="filter-group">
        <button
          className={`filter-chip ${!selectedCategory ? 'active' : ''}`}
          onClick={() => onSelectCategory(undefined)}
          id="chip-category-all"
        >
          Todas Categorias
        </button>
        {availableCategories.map((cat) => (
          <button
            key={cat}
            className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => onSelectCategory(selectedCategory === cat ? undefined : cat)}
            id={`chip-category-${cat.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};
