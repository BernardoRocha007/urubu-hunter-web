import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface OfflineBannerProps {
  isOffline: boolean;
  onReconnect: () => void;
}

/**
 * Componente visual puro para aviso de backend desconectado.
 */
export const OfflineBanner: React.FC<OfflineBannerProps> = ({ isOffline, onReconnect }) => {
  if (!isOffline) return null;

  return (
    <div
      style={{
        background: 'hsla(350, 89%, 60%, 0.15)',
        borderBottom: '1px solid hsla(350, 89%, 60%, 0.4)',
        padding: '12px 24px',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        fontSize: '13px'
      }}
      id="offline-banner"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <AlertTriangle size={18} color="var(--accent-danger)" />
        <span>
          <strong>Backend Desconectado:</strong> O servidor Fastify não está rodando na porta 3001. 
          Inicie o backend rodando <code>pnpm dev</code> na raiz do projeto ou abra uma nova aba e rode <code>cd backend &amp;&amp; pnpm dev</code>.
        </span>
      </div>
      <button
        className="btn btn-secondary"
        style={{ padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}
        onClick={onReconnect}
      >
        <RefreshCw size={12} />
        <span>Reconectar</span>
      </button>
    </div>
  );
};
