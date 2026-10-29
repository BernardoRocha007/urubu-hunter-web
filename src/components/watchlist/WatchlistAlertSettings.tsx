'use client';

import React from 'react';
import { Phone, Mail, Send, CheckCircle2 } from 'lucide-react';
import { UserNotificationConfig } from '@/types';

interface WatchlistAlertSettingsProps {
  notifConfig: UserNotificationConfig;
  isTestingAlert: boolean;
  isSavingConfig: boolean;
  onChangeConfig: (config: UserNotificationConfig) => void;
  onTestAlert: () => void;
  onSave: (e: React.FormEvent) => void;
}


export function WatchlistAlertSettings({
  notifConfig,
  isTestingAlert,
  isSavingConfig,
  onChangeConfig,
  onTestAlert,
  onSave
}: WatchlistAlertSettingsProps) {
  return (
    <form onSubmit={onSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <fieldset
        style={{
          border: '1px solid var(--border-subtle)',
          background: 'var(--bg-deep)',
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          margin: 0
        }}
      >
        <legend style={{ padding: '0 8px', fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
          Canais de Notificação
        </legend>
        <p style={{ margin: '4px 0 16px', fontSize: '13px', color: 'var(--text-muted)' }}>
          Sempre que um produto monitorado entrar em promoção ou bater sua meta de preço, você receberá um alerta automático.
        </p>

        {/* WhatsApp / Celular */}
        <div className="form-group" style={{ marginBottom: '16px' }}>
          <label
            htmlFor="input-alert-phone"
            className="form-label"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Phone size={14} color="#00F5A0" />
            <span>Seu WhatsApp / Telefone Celular (com DDD)</span>
          </label>
          <input
            id="input-alert-phone"
            type="tel"
            className="form-input"
            placeholder="Ex: 11999998888 ou (11) 99999-8888"
            value={notifConfig.phone || ''}
            onChange={(e) => onChangeConfig({ ...notifConfig, phone: e.target.value })}
          />
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '6px',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            <input
              type="checkbox"
              checked={notifConfig.channels?.whatsapp ?? false}
              onChange={(e) =>
                onChangeConfig({
                  ...notifConfig,
                  channels: { ...(notifConfig.channels || {}), whatsapp: e.target.checked }
                })
              }
            />
            <span>Ativar alertas via WhatsApp</span>
          </label>
        </div>

        {/* E-mail */}
        <div className="form-group" style={{ marginBottom: '8px' }}>
          <label
            htmlFor="input-alert-email"
            className="form-label"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Mail size={14} color="#FF6B00" />
            <span>Seu E-mail para Notificações</span>
          </label>
          <input
            id="input-alert-email"
            type="email"
            className="form-input"
            placeholder="Ex: seuemail@gmail.com"
            value={notifConfig.email || ''}
            onChange={(e) => onChangeConfig({ ...notifConfig, email: e.target.value })}
          />
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '6px',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            <input
              type="checkbox"
              checked={notifConfig.channels?.email ?? false}
              onChange={(e) =>
                onChangeConfig({
                  ...notifConfig,
                  channels: { ...(notifConfig.channels || {}), email: e.target.checked }
                })
              }
            />
            <span>Ativar alertas via E-mail</span>
          </label>
        </div>
      </fieldset>

      {/* Botões de Ação */}
      <footer style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onTestAlert}
          disabled={isTestingAlert || (!notifConfig.phone && !notifConfig.email)}
          id="btn-test-notification"
          style={{ fontSize: '13px' }}
        >
          <Send size={14} className={isTestingAlert ? 'animate-spin' : ''} />
          <span>{isTestingAlert ? 'Enviando...' : 'Testar Notificação Agora'}</span>
        </button>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSavingConfig}
          id="btn-save-alerts-config"
          style={{ padding: '0 24px' }}
        >
          <CheckCircle2 size={16} />
          <span>{isSavingConfig ? 'Salvando...' : 'Salvar Preferências de Alerta'}</span>
        </button>
      </footer>
    </form>
  );
}
