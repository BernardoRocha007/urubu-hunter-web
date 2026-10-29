import React from 'react';
import { Search } from 'lucide-react';

interface EmptyStateProps {
  isLoading: boolean;
  onTriggerHunt: () => void;
}

/**
 * Componente visual puro para estado vazio de produtos no feed.
 */
export const EmptyState: React.FC<EmptyStateProps> = ({ isLoading, onTriggerHunt }) => {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '60px 20px',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-sm)',
        border: '1px dashed var(--border-subtle)',
        margin: '20px 0'
      }}
      id="empty-items-state"
    >
      <div style={{ marginBottom: '14px', display: 'flex', justifyContent: 'center' }}>
        <Search size={32} color="var(--text-muted)" strokeWidth={1.5} />
      </div>
      <h3
        style={{
          fontSize: '16px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          marginBottom: '8px'
        }}
      >
        {isLoading ? 'Buscando produtos...' : 'Nenhum achado encontrado com esses filtros'}
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '20px' }}>
        {isLoading
          ? 'Carregando os achados do banco de dados...'
          : 'Ajuste seus filtros ou clique em "Garimpar Tudo" para vasculhar as marcas cadastradas.'}
      </p>
      {!isLoading && (
        <button className="btn btn-primary" onClick={onTriggerHunt}>
          Garimpar Tudo
        </button>
      )}
    </div>
  );
};
