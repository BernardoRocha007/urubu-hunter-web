'use client';

import React from 'react';
import { Target, RefreshCw, Plus, AlertCircle } from 'lucide-react';

interface WatchlistAddFormProps {
  url: string;
  targetPrice: string;
  isSubmitting: boolean;
  errorMsg: string | null;
  onUrlChange: (url: string) => void;
  onTargetPriceChange: (price: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function WatchlistAddForm({
  url,
  targetPrice,
  isSubmitting,
  errorMsg,
  onUrlChange,
  onTargetPriceChange,
  onSubmit
}: WatchlistAddFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      style={{
        background: 'var(--bg-deep)',
        padding: '16px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        marginBottom: '20px'
      }}
    >
      <fieldset style={{ border: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <label className="form-label" htmlFor="input-watchlist-url">
            Link do Produto (Qualquer loja ou e-commerce)
          </label>
          <input
            id="input-watchlist-url"
            type="url"
            className="form-input"
            placeholder="Ex: https://classofficial.com.br/products/... ou kunx.com.br/produtos/..."
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label
              className="form-label"
              htmlFor="input-watchlist-target-price"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Target size={14} color="#FFFFFF" />
              <span>Preço Alvo Desejado (R$) - Opcional</span>
            </label>
            <input
              id="input-watchlist-target-price"
              type="number"
              step="0.01"
              className="form-input"
              placeholder="Ex: 250.00"
              value={targetPrice}
              onChange={(e) => onTargetPriceChange(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
            id="btn-submit-watchlist"
            style={{ height: '42px', padding: '0 20px', whiteSpace: 'nowrap' }}
          >
            {isSubmitting ? (
              <>
                <RefreshCw size={15} className="animate-spin" />
                <span>Analisando Site...</span>
              </>
            ) : (
              <>
                <Plus size={15} />
                <span>Monitorar Este Produto</span>
              </>
            )}
          </button>
        </div>
      </fieldset>

      {errorMsg && (
        <aside
          role="alert"
          style={{
            marginTop: '12px',
            padding: '10px 14px',
            background: 'rgba(255, 51, 102, 0.1)',
            border: '1px solid rgba(255, 51, 102, 0.3)',
            borderRadius: '6px',
            color: '#FF3366',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </aside>
      )}
    </form>
  );
}
