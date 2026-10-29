import React from 'react';
import { AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  totalItems: number;
  isLoading: boolean;
  onGoToPage: (page: number) => void;
}

/**
 * Componente visual puro para navegação de páginas server-side.
 */
export const PaginationControls: React.FC<PaginationControlsProps> = ({
  page,
  totalPages,
  totalItems,
  isLoading,
  onGoToPage
}) => {
  if (totalPages <= 1) return null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginTop: '40px',
        marginBottom: '20px',
        padding: '16px 20px',
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-subtle)'
      }}
      id="pagination-controls"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Mostrando <strong style={{ color: 'var(--text-primary)' }}>{(page - 1) * 20 + 1}</strong> a{' '}
          <strong style={{ color: 'var(--text-primary)' }}>{Math.min(page * 20, totalItems)}</strong> de{' '}
          <strong style={{ color: 'var(--text-primary)' }}>{totalItems}</strong> produtos
        </div>

        {totalItems >= 500 && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontWeight: 600,
              padding: '3px 10px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(234, 179, 8, 0.12)',
              color: '#FACC15',
              border: '1px solid rgba(234, 179, 8, 0.35)',
              letterSpacing: '0.01em'
            }}
            id="badge-max-items-reached"
            title="Limite máximo de 500 itens atingido para garantir fluidez e economia de memória no seu computador."
          >
            <AlertTriangle size={13} />
            <span>Limite máximo atingido (500)</span>
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          className="btn btn-secondary"
          onClick={() => onGoToPage(page - 1)}
          disabled={page <= 1 || isLoading}
          style={{
            padding: '8px 14px',
            fontSize: '12px',
            borderRadius: 'var(--radius-sm)',
            cursor: page <= 1 ? 'not-allowed' : 'pointer',
            opacity: page <= 1 ? 0.4 : 1
          }}
          id="btn-prev-page"
        >
          <ChevronLeft size={14} />
          <span>Anterior</span>
        </button>

        {/* Numeração de Páginas */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
            .map((p, idx, arr) => {
              const showEllipsis = idx > 0 && p - arr[idx - 1] > 1;
              return (
                <React.Fragment key={p}>
                  {showEllipsis && (
                    <span style={{ padding: '6px 8px', color: 'var(--text-muted)', fontSize: '12px' }}>
                      ...
                    </span>
                  )}
                  <button
                    className={`btn ${p === page ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => onGoToPage(p)}
                    disabled={isLoading}
                    style={{
                      minWidth: '34px',
                      height: '34px',
                      padding: '0 8px',
                      fontSize: '12px',
                      fontWeight: p === page ? 700 : 500,
                      borderRadius: 'var(--radius-sm)',
                      background: p === page ? 'var(--accent-primary)' : 'var(--bg-card)',
                      borderColor: p === page ? 'var(--accent-primary)' : 'var(--border-subtle)',
                      color: p === page ? '#000000' : 'var(--text-primary)'
                    }}
                    id={`btn-page-${p}`}
                  >
                    {p}
                  </button>
                </React.Fragment>
              );
            })}
        </div>

        <button
          className="btn btn-secondary"
          onClick={() => onGoToPage(page + 1)}
          disabled={page >= totalPages || isLoading}
          style={{
            padding: '8px 14px',
            fontSize: '12px',
            borderRadius: 'var(--radius-sm)',
            cursor: page >= totalPages ? 'not-allowed' : 'pointer',
            opacity: page >= totalPages ? 0.4 : 1
          }}
          id="btn-next-page"
        >
          <span>Próxima</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};
