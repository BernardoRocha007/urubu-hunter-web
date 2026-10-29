'use client';

import React from 'react';
import { Bell } from 'lucide-react';

export function WatchlistEmptyState() {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '36px 20px',
        background: 'var(--bg-deep)',
        borderRadius: 'var(--radius-md)',
        border: '1px dashed var(--border-subtle)',
        color: 'var(--text-muted)'
      }}
      id="watchlist-empty-state"
    >
      <Bell size={32} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
      <p style={{ fontWeight: 600, margin: '0 0 4px', color: 'var(--text-secondary)' }}>
        Nenhum produto sendo monitorado ainda
      </p>
      <p style={{ fontSize: '13px', margin: 0 }}>
        Cole o link de uma peça da Class, de uma skateshop ou de qualquer e-commerce acima para começar!
      </p>
    </div>
  );
}
