'use client';

import React from 'react';

interface SizePickerProps {
  label: string;
  availableSizes: string[];
  selectedSizes: string[];
  onToggleSize: (size: string) => void;
}

/**
 * Componente modular para seleção de tamanhos de vestuário e calçados.
 */
export function SizePicker({
  label,
  availableSizes,
  selectedSizes,
  onToggleSize
}: SizePickerProps) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {availableSizes.map((sz, idx) => {
          const isSelected = selectedSizes.includes(sz);
          return (
            <button
              key={`${sz}-${idx}`}
              type="button"
              className={`filter-chip ${isSelected ? 'active' : ''}`}
              onClick={() => onToggleSize(sz)}
              id={`size-toggle-${sz}`}
            >
              {sz}
            </button>
          );
        })}
      </div>
    </div>
  );
}
