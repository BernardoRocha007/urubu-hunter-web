'use client';
import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, ExternalLink, RefreshCw, Bell, Target, TrendingDown, CheckCircle2, AlertCircle, Mail, Phone, Send, Settings2 } from 'lucide-react';
import { WatchlistItem, UserNotificationConfig } from '@/types';

interface WatchlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  watchlist: WatchlistItem[];
  onRefreshWatchlist: () => void;
  onShowToast: (msg: string) => void;
}

export const WatchlistModal: React.FC<WatchlistModalProps> = ({
  isOpen,
  onClose,
  watchlist,
  onRefreshWatchlist,
  onShowToast
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'products' | 'alerts'>('products');
  const [url, setUrl] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isTestingAlert, setIsTestingAlert] = useState(false);
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Notification Config state
  const [notifConfig, setNotifConfig] = useState<UserNotificationConfig>({
    email: '',
    phone: '',
    notifyOnPriceDrop: true,
    notifyOnTargetMet: true,
    channels: {
      email: true,
      whatsapp: true,
      telegram: false,
      discord: false
    }
  });

  // Load notification config
  useEffect(() => {
    fetch('/api/notifications/config')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.channels) {
          setNotifConfig(data);
        }
      })
      .catch(console.error);
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !url.startsWith('http')) {
      setErrorMsg('Por favor, insira uma URL válida iniciando com http:// ou https://');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: url.trim(),
          targetPrice: targetPrice ? parseFloat(targetPrice) : undefined
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao analisar e cadastrar produto.');
      }

      onShowToast(`"${data.title}" adicionado ao monitoramento.`);
      setUrl('');
      setTargetPrice('');
      onRefreshWatchlist();
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    try {
      const res = await fetch(`/api/watchlist/${id}`, { method: 'DELETE' });
      if (res.ok) {
        onShowToast(`"${title}" removido do monitoramento.`);
        onRefreshWatchlist();
      }
    } catch (err) {
      console.error('Erro ao deletar item da watchlist:', err);
    }
  };

  const handleCheckNow = async () => {
    setIsChecking(true);
    try {
      const res = await fetch('/api/watchlist/check', { method: 'POST' });
      const data = await res.json();
      onRefreshWatchlist();
      if (data.priceDropsDetected > 0) {
        onShowToast(`${data.priceDropsDetected} queda(s) de preço detectada(s). Alerta enviado.`);
      } else {
        onShowToast('Preços verificados. Nenhuma nova alteração detectada.');
      }
    } catch (err) {
      console.error('Erro ao checar watchlist:', err);
    } finally {
      setIsChecking(false);
    }
  };

  const handleSaveAlerts = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingConfig(true);
    try {
      const res = await fetch('/api/notifications/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notifConfig)
      });
      if (res.ok) {
        onShowToast('Configurações de alerta salvas com sucesso.');
      }
    } catch (err) {
      console.error('Erro ao salvar config de notificação:', err);
    } finally {
      setIsSavingConfig(false);
    }
  };

  const handleTestAlert = async () => {
    setIsTestingAlert(true);
    try {
      const res = await fetch('/api/notifications/test', { method: 'POST' });
      if (res.ok) {
        onShowToast('Alerta de teste enviado com sucesso. Verifique seus canais.');
      }
    } catch (err) {
      console.error('Erro ao disparar teste:', err);
    } finally {
      setIsTestingAlert(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} id="watchlist-modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '740px' }}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #FF3366, #FF6B00)',
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF'
            }}>
              <Bell size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0 }}>Monitor de Preços & Alertas</h3>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
                Cole qualquer link de produto. O Hunter vigia o preço e te avisa no celular ou e-mail!
              </p>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '12px',
          marginBottom: '20px'
        }}>
          <button
            type="button"
            className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('products')}
            style={{ fontSize: '13px', padding: '6px 16px' }}
          >
            <span>Produtos Monitorados ({watchlist.length})</span>
          </button>

          <button
            type="button"
            className={`btn ${activeTab === 'alerts' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('alerts')}
            style={{ fontSize: '13px', padding: '6px 16px' }}
          >
            <Settings2 size={14} />
            <span>Configurar WhatsApp & E-mail</span>
          </button>
        </div>

        {/* TAB 1: PRODUTOS MONITORADOS */}
        {activeTab === 'products' && (
          <>
            {/* Form para Adicionar URL */}
            <form onSubmit={handleAddProduct} style={{
              background: 'var(--bg-deep)',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>Link do Produto (Qualquer loja ou e-commerce)</span>
                  </label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="Ex: https://classofficial.com.br/products/... ou kunx.com.br/produtos/..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                  <div style={{ flex: 1 }}>
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Target size={14} color="#FFFFFF" />
                      <span>Preço Alvo Desejado (R$) - Opcional</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      placeholder="Ex: 250.00"
                      value={targetPrice}
                      onChange={(e) => setTargetPrice(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                    style={{ height: '42px', padding: '0 20px', whiteSpace: 'nowrap' }}
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw size={15} className="animate-spin" />
                        <span>Analisando Site...</span>
                      </>
                    ) : (
                      <>
                        <Plus size={15} />
                        <span>Monitorar Este Produto</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {errorMsg && (
                <div style={{
                  marginTop: '12px',
                  padding: '10px 14px',
                  background: 'rgba(255, 51, 102, 0.1)',
                  border: '1px solid rgba(255, 51, 102, 0.3)',
                  borderRadius: '6px',
                  color: '#FF3366',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <AlertCircle size={16} />
                  <span>{errorMsg}</span>
                </div>
              )}
            </form>

            {/* Action Bar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                {notifConfig.phone || notifConfig.email ? (
                  <span>Alertas ativos para: <strong>{notifConfig.phone || notifConfig.email}</strong></span>
                ) : (
                  <span>Configure seu WhatsApp ou E-mail na aba ao lado para receber alertas de queda de preço.</span>
                )}
              </div>

              {watchlist.length > 0 && (
                <button
                  className="btn btn-secondary"
                  onClick={handleCheckNow}
                  disabled={isChecking}
                  style={{ fontSize: '12px', padding: '6px 12px' }}
                >
                  <RefreshCw size={14} className={isChecking ? 'animate-spin' : ''} />
                  <span>{isChecking ? 'Checando...' : 'Verificar Preços Agora'}</span>
                </button>
              )}
            </div>

            {/* Lista de Itens Monitorados */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '380px', overflowY: 'auto' }}>
              {watchlist.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '36px 20px',
                  background: 'var(--bg-deep)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px dashed var(--border-subtle)',
                  color: 'var(--text-muted)'
                }}>
                  <Bell size={32} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                  <p style={{ fontWeight: 600, margin: '0 0 4px', color: 'var(--text-secondary)' }}>
                    Nenhum produto sendo monitorado ainda
                  </p>
                  <p style={{ fontSize: '13px', margin: 0 }}>
                    Cole o link de uma peça da Class, de uma skateshop ou de qualquer e-commerce acima para começar!
                  </p>
                </div>
              ) : (
                watchlist.map((item) => {
                  const hasPriceDropped = item.lastPrice < item.initialPrice;
                  const discountFromInitial = item.initialPrice > 0 
                    ? Math.round(((item.initialPrice - item.lastPrice) / item.initialPrice) * 100)
                    : 0;
                  const targetReached = item.targetPrice && item.lastPrice <= item.targetPrice;

                  return (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        padding: '12px',
                        background: 'var(--bg-deep)',
                        borderRadius: 'var(--radius-md)',
                        border: targetReached 
                          ? '1px solid #00F5A0' 
                          : hasPriceDropped 
                          ? '1px solid #FF3366' 
                          : '1px solid var(--border-subtle)'
                      }}
                    >
                      <img
                        src={item.imageUrl || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=100'}
                        alt={item.title}
                        style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '8px',
                          objectFit: 'cover',
                          background: 'var(--bg-surface)'
                        }}
                      />

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{
                            fontSize: '11px',
                            textTransform: 'uppercase',
                            fontWeight: 700,
                            letterSpacing: '0.5px',
                            color: 'var(--accent-cyan)'
                          }}>
                            {item.brand}
                          </span>
                          {hasPriceDropped && (
                            <span style={{
                              background: 'rgba(255, 51, 102, 0.2)',
                              color: '#FF3366',
                              fontSize: '11px',
                              fontWeight: 700,
                              padding: '2px 6px',
                              borderRadius: '4px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '2px'
                            }}>
                              <TrendingDown size={12} />
                              -{discountFromInitial}%
                            </span>
                          )}
                          {targetReached && (
                            <span style={{
                              background: 'rgba(0, 245, 160, 0.2)',
                              color: '#00F5A0',
                              fontSize: '11px',
                              fontWeight: 700,
                              padding: '2px 6px',
                              borderRadius: '4px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '2px'
                            }}>
                              <CheckCircle2 size={12} />
                              Meta Atingida!
                            </span>
                          )}
                        </div>

                        <h4 style={{
                          margin: '0 0 6px',
                          fontSize: '14px',
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          color: 'var(--text-primary)'
                        }}>
                          {item.title}
                        </h4>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px' }}>
                          <div>
                            <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Preço: </span>
                            <span style={{
                              fontWeight: 700,
                              color: hasPriceDropped ? '#00F5A0' : 'var(--text-primary)'
                            }}>
                              R$ {item.lastPrice.toFixed(2)}
                            </span>
                          </div>

                          {item.targetPrice && (
                            <div>
                              <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Alvo: </span>
                              <span style={{ fontWeight: 600, color: '#FF6B00' }}>
                                R$ {item.targetPrice.toFixed(2)}
                              </span>
                            </div>
                          )}

                          <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                            Checado: {new Date(item.lastCheckedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-icon"
                          title="Abrir página do produto na loja"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          <ExternalLink size={16} />
                        </a>

                        <button
                          className="btn-icon"
                          onClick={() => handleDelete(item.id, item.title)}
                          title="Remover do monitoramento"
                          style={{ color: '#FF3366' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}

        {/* TAB 2: CONFIGURAÇÃO DE ALERTAS (TELEFONE & EMAIL) */}
        {activeTab === 'alerts' && (
          <form onSubmit={handleSaveAlerts} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{
              background: 'var(--bg-deep)',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)'
            }}>
              <h4 style={{ margin: '0 0 12px', fontSize: '15px', color: 'var(--text-primary)' }}>
                Como você deseja ser avisado?
              </h4>
              <p style={{ margin: '0 0 16px', fontSize: '13px', color: 'var(--text-muted)' }}>
                Sempre que um produto monitorado entrar em promoção ou bater sua meta de preço, você receberá um alerta automático.
              </p>

              {/* WhatsApp / Celular */}
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={14} color="#00F5A0" />
                  <span>Seu WhatsApp / Telefone Celular (com DDD)</span>
                </label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="Ex: 11999998888 ou (11) 99999-8888"
                  value={notifConfig.phone || ''}
                  onChange={(e) => setNotifConfig({ ...notifConfig, phone: e.target.value })}
                />
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', fontSize: '13px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={notifConfig.channels.whatsapp}
                    onChange={(e) => setNotifConfig({
                      ...notifConfig,
                      channels: { ...notifConfig.channels, whatsapp: e.target.checked }
                    })}
                  />
                  <span>Ativar alertas via WhatsApp</span>
                </label>
              </div>

              {/* E-mail */}
              <div className="form-group" style={{ marginBottom: '8px' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={14} color="#FF6B00" />
                  <span>Seu E-mail para Notificações</span>
                </label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="Ex: seuemail@gmail.com"
                  value={notifConfig.email || ''}
                  onChange={(e) => setNotifConfig({ ...notifConfig, email: e.target.value })}
                />
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', fontSize: '13px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={notifConfig.channels.email}
                    onChange={(e) => setNotifConfig({
                      ...notifConfig,
                      channels: { ...notifConfig.channels, email: e.target.checked }
                    })}
                  />
                  <span>Ativar alertas via E-mail</span>
                </label>
              </div>
            </div>

            {/* Botões de Ação */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleTestAlert}
                disabled={isTestingAlert || (!notifConfig.phone && !notifConfig.email)}
                style={{ fontSize: '13px' }}
              >
                <Send size={14} className={isTestingAlert ? 'animate-spin' : ''} />
                <span>{isTestingAlert ? 'Enviando...' : 'Testar Notificação Agora'}</span>
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSavingConfig}
                style={{ padding: '0 24px' }}
              >
                <CheckCircle2 size={16} />
                <span>{isSavingConfig ? 'Salvando...' : 'Salvar Preferências de Alerta'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
