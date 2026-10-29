'use client';

import React from 'react';
import { ExternalLink, Trash2, TrendingDown, CheckCircle2 } from 'lucide-react';
import { WatchlistItem } from '@/types';

interface WatchlistProductCardProps {
  item: WatchlistItem;
  onDelete: (id: string, title: string) => void;
}

export function WatchlistProductCard({ item, onDelete }: WatchlistProductCardProps) {
  const lastPrice = typeof item.lastPrice === 'number' ? item.lastPrice : 0;
  const initialPrice = typeof item.initialPrice === 'number' ? item.initialPrice : 0;
  const hasPriceDropped = lastPrice < initialPrice;
  const discountFromInitial =
    initialPrice > 0 ? Math.round(((initialPrice - lastPrice) / initialPrice) * 100) : 0;
  const targetReached = item.targetPrice != null && lastPrice <= item.targetPrice;

  return (
    <article
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '12px',
        background: 'var(--bg-deep)',
        borderRadius: 'var(--radius-md)',
        border: targetReached
          ? '1px solid #00F5A0'
          : hasPriceDropped
          ? '1px solid #FF3366'
          : '1px solid var(--border-subtle)'
      }}
      id={`watchlist-item-${item.id}`}
    >
      <img
        src={item.imageUrl || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=100'}
        alt={item.title}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '8px',
          objectFit: 'cover',
          background: 'var(--bg-surface)'
        }}
        loading="lazy"
      />

      <div style={{ flex: 1, minWidth: 0 }}>
        <header style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span
            style={{
              fontSize: '11px',
              textTransform: 'uppercase',
              fontWeight: 700,
              letterSpacing: '0.5px',
              color: 'var(--accent-cyan)'
            }}
          >
            {item.brand}
          </span>
          {hasPriceDropped && (
            <span
              style={{
                background: 'rgba(255, 51, 102, 0.2)',
                color: '#FF3366',
                fontSize: '11px',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: '4px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px'
              }}
            >
              <TrendingDown size={12} />
              -{discountFromInitial}%
            </span>
          )}
          {targetReached && (
            <span
              style={{
                background: 'rgba(0, 245, 160, 0.2)',
                color: '#00F5A0',
                fontSize: '11px',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: '4px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px'
              }}
            >
              <CheckCircle2 size={12} />
              Meta Atingida!
            </span>
          )}
        </header>

        <h4
          style={{
            margin: '0 0 6px',
            fontSize: '14px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            color: 'var(--text-primary)'
          }}
        >
          {item.title}
        </h4>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px' }}>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Preço: </span>
            <strong
              style={{
                color: hasPriceDropped ? '#00F5A0' : 'var(--text-primary)'
              }}
            >
              R$ {lastPrice.toFixed(2)}
            </strong>
          </div>

          {item.targetPrice != null && (
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Alvo: </span>
              <strong style={{ color: '#FF6B00' }}>
                R$ {Number(item.targetPrice).toFixed(2)}
              </strong>
            </div>
          )}

          <time
            style={{ color: 'var(--text-muted)', fontSize: '11px' }}
            dateTime={item.lastCheckedAt || undefined}
          >
            Checado:{' '}
            {item.lastCheckedAt
              ? new Date(item.lastCheckedAt).toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })
              : 'Recentemente'}
          </time>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-icon"
          title="Abrir página do produto na loja"
          style={{ color: 'var(--text-secondary)' }}
          id={`link-visit-${item.id}`}
        >
          <ExternalLink size={16} />
        </a>

        <button
          type="button"
          className="btn-icon"
          onClick={() => onDelete(item.id, item.title)}
          title="Remover do monitoramento"
          style={{ color: '#FF3366' }}
          id={`btn-delete-${item.id}`}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </article>
  );
}
