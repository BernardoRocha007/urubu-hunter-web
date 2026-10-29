'use client';

import React from 'react';
import { Store, CheckSquare, Square, ExternalLink } from 'lucide-react';

interface CustomHuntStoreItemProps {
  storeUrl: string;
  storeName: string;
  isSelected: boolean;
  onToggle: (url: string) => void;
}

export function CustomHuntStoreItem({
  storeUrl,
  storeName,
  isSelected,
  onToggle
}: CustomHuntStoreItemProps) {
  return (
    <article
      onClick={() => onToggle(storeUrl)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        background: isSelected ? '#161616' : 'var(--bg-card)',
        border: isSelected ? '1px solid #444444' : '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-sm)',
        cursor: 'pointer',
        transition: 'all 150ms ease-in-out'
      }}
      className="hover-card"
      id={`store-item-${storeName.toLowerCase()}`}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ color: isSelected ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
          {isSelected ? <CheckSquare size={20} /> : <Square size={20} />}
        </div>

        <div
          style={{
            width: '34px',
            height: '34px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)'
          }}
        >
          <Store size={18} />
        </div>

        <div>
          <div
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: isSelected ? '#FFFFFF' : 'var(--text-primary)'
            }}
          >
            {storeName}
          </div>
          <div
            style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
              maxWidth: '360px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {storeUrl}
          </div>
        </div>
      </div>

      <a
        href={storeUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        style={{
          color: 'var(--text-muted)',
          padding: '6px',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          alignItems: 'center'
        }}
        title="Visitar loja"
        id={`link-store-${storeName.toLowerCase()}`}
      >
        <ExternalLink size={14} />
      </a>
    </article>
  );
}
