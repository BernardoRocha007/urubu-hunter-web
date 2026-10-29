'use client';

import React from 'react';

interface PriceRangeFieldProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (val: number) => void;
}

/**
 * Componente modular para controle de limite de preço com slider responsivo.
 */
export function PriceRangeField({
  label,
  value,
  min = 100,
  max = 2000,
  step = 50,
  onChange
}: PriceRangeFieldProps) {
  return (
    <div className="form-group">
      <label className="form-label">
        {label}: R$ {value}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10) || min)}
        id="range-max-price"
      />
    </div>
  );
}
