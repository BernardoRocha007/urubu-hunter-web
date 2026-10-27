'use client';
import React from 'react';
import { Heart, ThumbsDown, ExternalLink, Sparkles } from 'lucide-react';
import { CuratedItem } from '@/types';

interface ItemCardProps {
  item: CuratedItem;
  onFeedback: (id: string, feedback: 'liked' | 'disliked' | null) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onFeedback }) => {
  const isHighMatch = item.evaluation.score >= 80;
  const isLiked = item.feedback === 'liked';
  const isDisliked = item.feedback === 'disliked';

  return (
    <article className="item-card" id={`item-card-${item.id}`}>
      {/* Media / Image */}
      <div className="card-media">
        <img
          src={item.images[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'}
          alt={item.title}
          className="card-image"
          loading="lazy"
        />

        {/* Score Badge */}
        <div className={`badge-score ${isHighMatch ? 'high' : 'medium'}`}>
          <Sparkles size={13} />
          <span>{item.evaluation.score}% Match</span>
        </div>

        {/* Discount Badge */}
        {item.discountPct && item.discountPct > 0 && (
          <div className="badge-discount">
            -{item.discountPct}% OFF
          </div>
        )}

        {/* Brand */}
        <div className="badge-brand">
          {item.brand}
        </div>
      </div>

      {/* Content */}
      <div className="card-content">
        <h3 className="card-title" title={item.title}>
          {item.title}
        </h3>

        {/* Price Row */}
        <div className="card-price-row">
          <span className="current-price">
            R$ {item.price.toFixed(2).replace('.', ',')}
          </span>
          {item.originalPrice && item.originalPrice > item.price && (
            <span className="original-price">
              R$ {item.originalPrice.toFixed(2).replace('.', ',')}
            </span>
          )}
        </div>

        {/* AI Verdict */}
        <div className="ai-verdict">
          <div className="ai-verdict-header">
            <Sparkles size={12} />
            <span>Curadoria de Estilo</span>
          </div>
          <p>{item.evaluation.verdict}</p>
        </div>

        {/* Tags and Sizes */}
        <div className="tags-row">
          {item.availableSizes.map((sz) => (
            <span key={sz} className="tag-pill" style={{ fontWeight: 600 }}>
              {sz}
            </span>
          ))}
          {item.evaluation.detectedTags.slice(0, 3).map((t) => (
            <span key={t} className="tag-pill">
              #{t}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="card-actions">
          <div className="feedback-buttons">
            <button
              className={`icon-btn ${isLiked ? 'liked' : ''}`}
              onClick={() => onFeedback(item.id, isLiked ? null : 'liked')}
              title={isLiked ? 'Curtido!' : 'Gostei'}
              id={`btn-like-${item.id}`}
            >
              <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
            </button>
            <button
              className={`icon-btn ${isDisliked ? 'disliked' : ''}`}
              onClick={() => onFeedback(item.id, isDisliked ? null : 'disliked')}
              title="Não tem meu estilo"
              id={`btn-dislike-${item.id}`}
            >
              <ThumbsDown size={16} />
            </button>
          </div>

          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-buy"
            id={`btn-buy-${item.id}`}
          >
            <span>Ver na Loja</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </article>
  );
};
