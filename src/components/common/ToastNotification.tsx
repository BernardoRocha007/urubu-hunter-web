import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ToastNotificationProps {
  message: string | null;
}

/**
 * Componente visual puro para exibição de notificações flutuantes (toast).
 */
export const ToastNotification: React.FC<ToastNotificationProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        background: 'hsl(224, 20%, 15%)',
        color: '#FFFFFF',
        border: '1px solid var(--border-highlight)',
        padding: '12px 20px',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        zIndex: 1000,
        fontSize: '14px',
        fontWeight: 500,
        animation: 'fadeIn 200ms ease-out'
      }}
      id="system-toast-notification"
    >
      <CheckCircle2 size={16} color="var(--accent-success)" />
      <span>{message}</span>
    </div>
  );
};
