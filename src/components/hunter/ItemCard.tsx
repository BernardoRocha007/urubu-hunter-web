'use client';

import React from 'react';
import { ExternalLink, Heart, Bookmark, Sparkles } from 'lucide-react';
import { CuratedItem } from '@/types/hunter';

interface ItemCardProps {
  item: CuratedItem;
  onFeedback: (id: string, feedback: 'liked' | 'disliked' | 'saved' | null) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onFeedback }) => {
  const score = item.evaluation?.score ?? 0;
  const isLiked = item.feedback === 'liked';
  const isSaved = item.feedback === 'saved';

  const scoreBadgeColor =
    score >= 90
      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
      : score >= 80
      ? 'bg-lime-400/20 text-lime-300 border-lime-400/30'
      : 'bg-zinc-800 text-zinc-300 border-zinc-700';

  return (
    <article className="group relative flex flex-col rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-md overflow-hidden hover:border-lime-400/40 transition-all duration-300 hover:shadow-xl hover:shadow-lime-950/10">
      {/* Image container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-black/40">
        <img
          src={item.images[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800'}
          alt={item.title}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Score Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold border backdrop-blur-md shadow-md ${scoreBadgeColor}">
          <Sparkles className="w-3 h-3" />
          <span>{score}% Match</span>
        </div>

        {/* Discount Badge */}
        {item.discountPct && item.discountPct > 0 ? (
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500 text-black shadow-md">
            -{item.discountPct}%
          </div>
        ) : null}

        {/* Action overlay buttons */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
          <button
            onClick={() => onFeedback(item.id, isLiked ? null : 'liked')}
            className={`p-2 rounded-full border backdrop-blur-md transition-colors ${
              isLiked
                ? 'bg-rose-500/90 text-white border-rose-400'
                : 'bg-black/60 text-zinc-300 border-white/10 hover:text-white hover:border-white/30'
            }`}
            title="Curtir peÃ§a"
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={() => onFeedback(item.id, isSaved ? null : 'saved')}
            className={`p-2 rounded-full border backdrop-blur-md transition-colors ${
              isSaved
                ? 'bg-amber-500/90 text-black border-amber-400'
                : 'bg-black/60 text-zinc-300 border-white/10 hover:text-white hover:border-white/30'
            }`}
            title="Salvar na lista"
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="p-4 flex flex-col flex-grow justify-between gap-3">
        <div>
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span>{item.brand}</span>
            <span className="capitalize">{item.category}</span>
          </div>

          <h3 className="font-semibold text-white text-sm mt-1 line-clamp-2 group-hover:text-lime-300 transition-colors">
            {item.title}
          </h3>

          {/* AI Verdict */}
          {item.evaluation?.verdict && (
            <p className="text-[12px] text-zinc-400 mt-2 line-clamp-2 italic border-l-2 border-lime-400/40 pl-2">
              "{item.evaluation.verdict}"
            </p>
          )}
        </div>

        {/* Price and Store CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div>
            <div className="text-xs text-zinc-500 line-through">
              {item.originalPrice ? `R$ ${item.originalPrice.toFixed(2)}` : ''}
            </div>
            <div className="text-base font-extrabold text-white font-mono">
              R$ {item.price.toFixed(2)}
            </div>
          </div>

          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-lime-400 hover:text-black text-xs font-semibold text-zinc-200 transition-all border border-white/10 hover:border-lime-400 shadow-sm"
          >
            <span>Ver Loja</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
};
