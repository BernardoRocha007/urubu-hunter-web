'use client';

import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  maxWidth?: string;
  children: ReactNode;
}

/**
 * Componente base de Modal acessível, com backdrop blur e contenção de clique.
 * Elimina divs repetitivas de overlay e content em todas as modais do sistema.
 */
export function Modal({ isOpen, onClose, id, maxWidth, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      id={`${id}-overlay`}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        id={id}
        style={maxWidth ? { maxWidth } : undefined}
      >
        {children}
      </div>
    </div>
  );
}

interface ModalHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  onClose: () => void;
  closeId?: string;
}

/**
 * Cabeçalho semântico e unificado para modais.
 */
export function ModalHeader({
  title,
  subtitle,
  icon,
  onClose,
  closeId = 'btn-close-modal'
}: ModalHeaderProps) {
  return (
    <header className="modal-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {icon && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            {icon}
          </div>
        )}
        <div>
          <h3 style={{ margin: 0 }}>{title}</h3>
          {subtitle && (
            <p style={{ margin: '3px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <button
        type="button"
        className="icon-btn"
        onClick={onClose}
        id={closeId}
        aria-label="Fechar modal"
        style={{ color: 'var(--text-secondary)' }}
      >
        <X size={18} />
      </button>
    </header>
  );
}

interface ModalFooterProps {
  children: ReactNode;
  style?: React.CSSProperties;
}

/**
 * Rodapé semântico para botões de ação e cancelamento em modais.
 */
export function ModalFooter({ children, style }: ModalFooterProps) {
  return (
    <footer
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '12px',
        marginTop: '24px',
        ...style
      }}
    >
      {children}
    </footer>
  );
}
