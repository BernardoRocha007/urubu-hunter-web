'use client';

import React from 'react';
import { Settings2 } from 'lucide-react';

interface WatchlistTabsProps {
  activeTab: 'products' | 'alerts';
  onTabChange: (tab: 'products' | 'alerts') => void;
  count: number;
}

export function WatchlistTabs({ activeTab, onTabChange, count }: WatchlistTabsProps) {
  return (
    <nav
      style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '12px',
        marginBottom: '20px'
      }}
      aria-label="Abas do Monitor de Preços"
    >
      <button
        type="button"
        className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-secondary'}`}
        onClick={() => onTabChange('products')}
        style={{ fontSize: '13px', padding: '6px 16px' }}
        id="tab-watchlist-products"
      >
        <span>Produtos Monitorados ({count})</span>
      </button>

      <button
        type="button"
        className={`btn ${activeTab === 'alerts' ? 'btn-primary' : 'btn-secondary'}`}
        onClick={() => onTabChange('alerts')}
        style={{ fontSize: '13px', padding: '6px 16px' }}
        id="tab-watchlist-alerts"
      >
        <Settings2 size={14} />
        <span>Configurar WhatsApp & E-mail</span>
      </button>
    </nav>
  );
}
