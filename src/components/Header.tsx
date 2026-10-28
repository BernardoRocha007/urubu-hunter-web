'use client';
import React from 'react';
import Image from 'next/image';
import { Sparkles, SlidersHorizontal, RefreshCw, Bell } from 'lucide-react';
import { DomainId, DomainDefinition, HuntStatus } from '@/types';

interface HeaderProps {
  currentDomain: DomainId;
  domains: Record<string, DomainDefinition>;
  onSelectDomain: (id: DomainId) => void;
  onOpenSettings: () => void;
  onOpenWatchlist: () => void;
  onOpenCustomHunt: () => void;
  onTriggerHunt: () => void;
  huntStatus: HuntStatus;
  watchlistCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentDomain,
  domains,
  onSelectDomain,
  onOpenSettings,
  onOpenWatchlist,
  onOpenCustomHunt,
  onTriggerHunt,
  huntStatus,
  watchlistCount
}) => {
  return (
    <header className="header" id="main-header">
      <div className="container header-content">
        <div className="brand-wrapper">
          <div className="brand-badge" style={{ padding: 0, overflow: 'hidden', borderRadius: '50%', border: '1.5px solid var(--border-highlight)', width: '38px', height: '38px' }}>
            <Image
              src="/urubu-icon.png"
              alt="Urubu Hunter Icon"
              width={38}
              height={38}
              priority
              style={{ objectFit: 'cover', borderRadius: '50%', display: 'block' }}
            />
          </div>
          <div className="brand-info">
            <h1 className="brand-title">URUBU HUNTER</h1>
          </div>
        </div>

        {/* Domain Switcher */}
        <div className="domain-switcher" id="domain-switcher">
          {Object.values(domains).map((d) => (
            <button
              key={d.id}
              className={`domain-btn ${currentDomain === d.id ? 'active' : ''}`}
              onClick={() => onSelectDomain(d.id)}
              id={`domain-btn-${d.id}`}
            >
              <span>{d.name.split(' ')[0].toUpperCase()}</span>
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="header-actions">
          <button
            className="btn btn-secondary"
            onClick={onOpenWatchlist}
            id="btn-open-watchlist"
            title="Monitorar Preços de Links e Alertas"
            style={{ position: 'relative' }}
          >
            <Bell size={15} />
            <span>Monitorar Preço</span>
            {watchlistCount > 0 && (
              <span className="badge-count">
                {watchlistCount}
              </span>
            )}
          </button>

          <button
            className="btn btn-secondary"
            onClick={onOpenSettings}
            id="btn-open-settings"
            title="Configurar Estilo e Filtros"
          >
            <SlidersHorizontal size={15} />
            <span>Meu Perfil</span>
          </button>

          <button
            className="btn btn-secondary"
            onClick={onOpenCustomHunt}
            id="btn-open-custom-hunt"
            title="Escolher quais lojas garimpar"
          >
            <Sparkles size={15} />
            <span>Garimpo Personalizado</span>
          </button>

          <button
            className="btn btn-primary"
            onClick={onTriggerHunt}
            disabled={huntStatus.isRunning}
            id="btn-trigger-hunt"
          >
            {huntStatus.isRunning ? (
              <>
                <RefreshCw size={15} className="animate-spin" />
                <span>Garimpando...</span>
              </>
            ) : (
              <>
                <RefreshCw size={15} />
                <span>Garimpar Tudo</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
