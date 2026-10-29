'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  SlidersHorizontal,
  RefreshCw,
  Bell,
  LogOut,
  Shield
} from 'lucide-react';
import { DomainId, DomainDefinition, HuntStatus } from '@/types';
import { useAuth } from '@/hooks/useAuth';

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
  const { usuario, estaAutenticado, logout } = useAuth();
  const isAdmin = usuario?.role === 'Admin' || (usuario?.politicas && usuario.politicas.includes('GerenciamentoUsuarios'));

  return (
    <header className="header" id="main-header">
      <div className="container header-content">
        <div className="brand-wrapper">
          <div
            className="brand-badge"
            style={{
              padding: 0,
              overflow: 'hidden',
              borderRadius: '50%',
              border: '1.5px solid var(--border-highlight)',
              width: '38px',
              height: '38px'
            }}
          >
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
            type="button"
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
            type="button"
            className="btn btn-secondary"
            onClick={onOpenSettings}
            id="btn-open-settings"
            title="Configurar Estilo e Filtros"
          >
            <SlidersHorizontal size={15} />
            <span>Meu Perfil</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={onOpenCustomHunt}
            id="btn-open-custom-hunt"
            title="Escolher quais lojas garimpar"
          >
            <Sparkles size={15} />
            <span>Garimpo Personalizado</span>
          </button>

          <button
            type="button"
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

          {/* Botão de Gestão de Usuários (Apenas Admin ou detentores da política GerenciamentoUsuarios) */}
          {estaAutenticado && isAdmin && (
            <Link
              href="/admin/usuarios"
              className="btn btn-secondary"
              id="btn-header-admin-usuarios"
              title="Gestão de Usuários e Permissões"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                borderColor: 'rgba(255, 184, 0, 0.4)',
                color: '#FFB800',
                textDecoration: 'none'
              }}
            >
              <Shield size={14} color="#FFB800" />
              <span>Gestão Usuários</span>
            </Link>
          )}

          {/* Autenticação & Usuário */}
          {estaAutenticado && usuario ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                padding: '4px 10px 4px 8px',
                borderRadius: 'var(--radius-sm)'
              }}
              id="header-user-badge"
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#000000',
                  fontSize: '11px',
                  fontWeight: 800
                }}
              >
                {usuario.nome.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {usuario.nome.split(' ')[0]}
              </span>
              <button
                type="button"
                onClick={logout}
                className="icon-btn"
                title="Sair da Conta"
                style={{
                  color: 'var(--text-muted)',
                  padding: '2px',
                  marginLeft: '4px',
                  cursor: 'pointer'
                }}
                id="btn-header-logout"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="btn btn-secondary"
              id="btn-header-login"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                fontWeight: 700,
                letterSpacing: '0.04em'
              }}
            >
              <span>ENTRAR</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
