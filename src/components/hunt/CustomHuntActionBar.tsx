'use client';

import React from 'react';

interface CustomHuntActionBarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

export function CustomHuntActionBar({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll
}: CustomHuntActionBarProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
        padding: '10px 14px',
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)'
      }}
    >
      <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
        <strong style={{ color: 'var(--accent-primary)', fontSize: '14px' }}>
          {selectedCount}
        </strong>{' '}
        de <strong>{totalCount}</strong> lojas selecionadas
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          type="button"
          className="btn btn-secondary"
          style={{ padding: '4px 10px', fontSize: '12px' }}
          onClick={onSelectAll}
          id="btn-select-all-stores"
        >
          Selecionar Todas
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          style={{ padding: '4px 10px', fontSize: '12px' }}
          onClick={onDeselectAll}
          id="btn-deselect-all-stores"
        >
          Limpar Seleção
        </button>
      </div>
    </div>
  );
}
