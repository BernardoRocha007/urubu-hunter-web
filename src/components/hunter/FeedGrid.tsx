'use client';

import React, { useState, useMemo } from 'react';
import { CuratedItem } from '@/types/hunter';
import { FilterBar } from './FilterBar';
import { ItemCard } from './ItemCard';
import { sendFeedback } from '@/lib/api';
import { Sparkles, PackageOpen } from 'lucide-react';

interface FeedGridProps {
  initialItems: CuratedItem[];
  availableCategories: string[];
}

export const FeedGrid: React.FC<FeedGridProps> = ({ initialItems, availableCategories }) => {
  const [items, setItems] = useState<CuratedItem[]>(initialItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [saleOnly, setSaleOnly] = useState(false);
  const [minScore, setMinScore] = useState<number | undefined>();

  // Feedback otimista
  const handleFeedback = async (id: string, feedback: 'liked' | 'disliked' | 'saved' | null) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, feedback } : item))
    );
    try {
      await sendFeedback(id, feedback);
    } catch (err) {
      console.error('[Feedback error]:', err);
    }
  };

  // Filtragem ultra-rÃ¡pida no cliente
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (saleOnly && (!item.discountPct || item.discountPct <= 0)) return false;
      if (minScore && (item.evaluation?.score ?? 0) < minScore) return false;
      if (selectedCategory && item.category !== selectedCategory) return false;
      if (searchTerm) {
        const s = searchTerm.toLowerCase();
        return (
          item.title.toLowerCase().includes(s) ||
          item.brand.toLowerCase().includes(s) ||
          item.category.toLowerCase().includes(s)
        );
      }
      return true;
    });
  }, [items, searchTerm, selectedCategory, saleOnly, minScore]);

  return (
    <div className="flex flex-col gap-6">
      {/* Barra de Filtros Modular */}
      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        availableCategories={availableCategories}
        saleOnly={saleOnly}
        onToggleSaleOnly={() => setSaleOnly(!saleOnly)}
        minScore={minScore}
        onSelectMinScore={setMinScore}
      />

      {/* Grid de Itens */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} onFeedback={handleFeedback} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/5 bg-zinc-900/30 p-12 text-center flex flex-col items-center justify-center">
          <PackageOpen className="w-12 h-12 text-zinc-600 mb-3" />
          <h3 className="text-lg font-bold text-white">Nenhuma peÃ§a encontrada</h3>
          <p className="text-sm text-zinc-400 mt-1 max-w-sm">
            Tente ajustar os filtros acima ou aguarde o prÃ³ximo ciclo de garimpo da API C#.
          </p>
        </div>
      )}
    </div>
  );
};
