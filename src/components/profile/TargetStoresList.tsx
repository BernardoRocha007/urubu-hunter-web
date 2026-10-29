'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface TargetStoresListProps {
  label?: string;
  placeholder?: string;
  stores: string[];
  inputValue: string;
  onInputChange: (val: string) => void;
  onAddStore: () => void;
  onRemoveStore: (store: string) => void;
}

/**
 * Componente modular para exibição e adição de lojas/marcas monitoradas no perfil.
 */
export function TargetStoresList({
  label = 'Lojas & Marcas Alvo (Instagram / Shopify URLs)',
  placeholder = 'Ex: sufgang.com.br, pacecompany.com.br...',
  stores,
  inputValue,
  onInputChange,
  onAddStore,
  onRemoveStore
}: TargetStoresListProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onAddStore();
    }
  };

  return (
    <div className="form-group">
      <label className="form-label">{label}</label>

      {/* Lista de lojas cadastradas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '8px' }}>
        {stores.map((store) => (
          <div
            key={store}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--bg-deep)',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px'
            }}
          >
            <span style={{ color: 'var(--text-secondary)' }}>{store}</span>
            <button
              type="button"
              onClick={() => onRemoveStore(store)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              title="Remover loja"
              id={`btn-remove-store-${store}`}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Campo de adição de loja */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          className="form-input"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          id="input-add-store"
        />
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onAddStore}
          id="btn-add-store"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
