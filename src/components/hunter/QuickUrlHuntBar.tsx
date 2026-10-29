import React from 'react';
import { Globe, RefreshCw, Sparkles } from 'lucide-react';

interface QuickUrlHuntBarProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  isRunning: boolean;
}

/**
 * Componente visual puro para a barra de garimpo universal por URL.
 */
export const QuickUrlHuntBar: React.FC<QuickUrlHuntBarProps> = ({
  value,
  onChange,
  onSubmit,
  isRunning
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        background: 'var(--bg-surface)',
        padding: '12px 18px',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-subtle)',
        marginBottom: '16px'
      }}
      id="quick-url-hunter-bar"
    >
      <div style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center' }}>
        <Globe size={18} />
      </div>
      <input
        type="text"
        placeholder="Cole qualquer URL de loja ou produto (ex: pacecompany.com.br, carnan.com.br, link de produto...)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="filter-input"
        style={{ flexGrow: 1, fontSize: '13px' }}
        id="input-quick-hunt-url"
      />
      <button
        className="btn btn-primary"
        onClick={onSubmit}
        disabled={isRunning || !value.trim()}
        id="btn-quick-hunt-url"
        style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        {isRunning ? (
          <>
            <RefreshCw size={14} className="animate-spin" />
            <span>Garimpando...</span>
          </>
        ) : (
          <>
            <Sparkles size={14} />
            <span>Garimpar URL</span>
          </>
        )}
      </button>
    </div>
  );
};
