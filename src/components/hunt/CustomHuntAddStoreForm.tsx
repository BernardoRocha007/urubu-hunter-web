'use client';

import React from 'react';
import { Plus, AlertCircle } from 'lucide-react';

interface CustomHuntAddStoreFormProps {
  inputValue: string;
  errorMsg: string | null;
  onInputChange: (val: string) => void;
  onAddStore: () => void;
}

export function CustomHuntAddStoreForm({
  inputValue,
  errorMsg,
  onInputChange,
  onAddStore
}: CustomHuntAddStoreFormProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onAddStore();
    }
  };

  return (
    <div
      style={{
        padding: '14px 16px',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-subtle)'
      }}
    >
      <label
        htmlFor="input-quick-add-store"
        style={{
          display: 'block',
          fontSize: '13px',
          fontWeight: 600,
          color: '#FFFFFF',
          marginBottom: '8px'
        }}
      >
        Adicionar qualquer loja ou produto para garimpar
      </label>

      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Cole qualquer URL de loja ou produto (Ex: pacecompany.com.br, carnan.com.br...)"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="filter-input"
          style={{ flexGrow: 1, fontSize: '13px' }}
          id="input-quick-add-store"
        />
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onAddStore}
          style={{ fontSize: '13px', padding: '8px 14px' }}
          id="btn-quick-add-store"
        >
          <Plus size={16} />
          <span>Adicionar</span>
        </button>
      </div>

      {errorMsg && (
        <aside
          role="alert"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--accent-danger)',
            fontSize: '12px',
            marginTop: '8px'
          }}
        >
          <AlertCircle size={14} />
          <span>{errorMsg}</span>
        </aside>
      )}
    </div>
  );
}
