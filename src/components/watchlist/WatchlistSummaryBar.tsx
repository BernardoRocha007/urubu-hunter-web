'use client';

import React from 'react';
import { RefreshCw } from 'lucide-react';

interface WatchlistSummaryBarProps {
  phone?: string;
  email?: string;
  hasItems: boolean;
  isChecking: boolean;
  onCheckNow: () => void;
}

export function WatchlistSummaryBar({
  phone,
  email,
  hasItems,
  isChecking,
  onCheckNow
}: WatchlistSummaryBarProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}
    >
      <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
        {phone || email ? (
          <span>
            Alertas ativos para: <strong>{phone || email}</strong>
          </span>
        ) : (
          <span>Configure seu WhatsApp ou E-mail na aba ao lado para receber alertas de queda de preço.</span>
        )}
      </div>

      {hasItems && (
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCheckNow}
          disabled={isChecking}
          id="btn-check-watchlist-prices"
          style={{ fontSize: '12px', padding: '6px 12px' }}
        >
          <RefreshCw size={14} className={isChecking ? 'animate-spin' : ''} />
          <span>{isChecking ? 'Checando...' : 'Verificar Preços Agora'}</span>
        </button>
      )}
    </div>
  );
}
