'use client';
import React, { useState, useEffect } from 'react';
import { X, Store, CheckSquare, Square, Sparkles, Plus, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';

interface CustomHuntModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetStores: string[];
  domainName: string;
  onTriggerCustomHunt: (selectedStores: string[]) => void;
  isHunting: boolean;
  onAddNewStore?: (newStoreUrl: string) => void;
}

export const CustomHuntModal: React.FC<CustomHuntModalProps> = ({
  isOpen,
  onClose,
  targetStores,
  domainName,
  onTriggerCustomHunt,
  isHunting,
  onAddNewStore
}) => {
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [newStoreInput, setNewStoreInput] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);

  // Inicializa a seleção com todas as lojas salvas ao abrir o modal
  useEffect(() => {
    if (isOpen) {
      setSelectedStores([...targetStores]);
      setNewStoreInput('');
      setInputError(null);
    }
  }, [isOpen, targetStores]);

  if (!isOpen) return null;

  const toggleStore = (storeUrl: string) => {
    setSelectedStores(prev => 
      prev.includes(storeUrl)
        ? prev.filter(url => url !== storeUrl)
        : [...prev, storeUrl]
    );
  };

  const handleSelectAll = () => {
    setSelectedStores([...targetStores]);
  };

  const handleDeselectAll = () => {
    setSelectedStores([]);
  };

  const handleAddStore = () => {
    let trimmed = newStoreInput.trim();
    if (!trimmed) return;

    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      trimmed = `https://${trimmed}`;
    }

    try {
      const parsed = new URL(trimmed);
      trimmed = (parsed.pathname === '/' || !parsed.pathname)
        ? parsed.origin
        : `${parsed.origin}${parsed.pathname.replace(/\/+$/, '')}`;
    } catch {
      trimmed = trimmed.split('?')[0].replace(/\/+$/, '');
    }

    if (targetStores.includes(trimmed) || selectedStores.includes(trimmed)) {
      setInputError('Esta loja já está na sua lista.');
      return;
    }

    setInputError(null);
    if (onAddNewStore) {
      onAddNewStore(trimmed);
    }
    setSelectedStores(prev => [...prev, trimmed]);
    setNewStoreInput('');
  };

  const handleStartHunt = () => {
    if (selectedStores.length === 0 || isHunting) return;
    onTriggerCustomHunt(selectedStores);
  };

  // Extrai um nome amigável a partir da URL
  const formatStoreName = (url: string) => {
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.replace(/^www\./, '');
      const parts = host.split('.');
      const brand = parts[0];
      return brand.charAt(0).toUpperCase() + brand.slice(1);
    } catch {
      return url;
    }
  };

  return (
    <div className="modal-overlay" id="custom-hunt-modal-overlay">
      <div 
        className="modal-content"
        id="custom-hunt-modal"
        style={{
          maxWidth: '620px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.9), 0 0 0 1px #222222'
        }}
      >
        {/* Modal Header */}
        <div className="modal-header" style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sparkles size={18} color="var(--text-primary)" />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#FFFFFF', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
                Garimpo Personalizado
              </h2>
              <p style={{ margin: '3px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
                Selecione quais lojas salvas em <strong>{domainName}</strong> você deseja vasculhar agora
              </p>
            </div>
          </div>
          <button 
            className="btn btn-icon" 
            onClick={onClose}
            id="btn-close-custom-hunt"
            style={{ color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ padding: '20px 24px', overflowY: 'auto', flexGrow: 1 }}>
          {/* Quick Actions Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            padding: '10px 14px',
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--accent-primary)', fontSize: '14px' }}>
                {selectedStores.length}
              </strong> de <strong>{targetStores.length}</strong> lojas selecionadas
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '4px 10px', fontSize: '12px' }}
                onClick={handleSelectAll}
                id="btn-select-all-stores"
              >
                Selecionar Todas
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '4px 10px', fontSize: '12px' }}
                onClick={handleDeselectAll}
                id="btn-deselect-all-stores"
              >
                Limpar Seleção
              </button>
            </div>
          </div>

          {/* Stores List */}
          {targetStores.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {targetStores.map((storeUrl) => {
                const isSelected = selectedStores.includes(storeUrl);
                const storeName = formatStoreName(storeUrl);

                return (
                  <div
                    key={storeUrl}
                    onClick={() => toggleStore(storeUrl)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      background: isSelected ? '#161616' : 'var(--bg-card)',
                      border: isSelected 
                        ? '1px solid #444444' 
                        : '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      transition: 'all 150ms ease-in-out'
                    }}
                    className="hover-card"
                    id={`store-item-${storeName.toLowerCase()}`}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ color: isSelected ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
                        {isSelected ? <CheckSquare size={20} /> : <Square size={20} />}
                      </div>

                      <div style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-surface)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-secondary)'
                      }}>
                        <Store size={18} />
                      </div>

                      <div>
                        <div style={{ 
                          fontSize: '14px', 
                          fontWeight: 600, 
                          color: isSelected ? '#FFFFFF' : 'var(--text-primary)' 
                        }}>
                          {storeName}
                        </div>
                        <div style={{ 
                          fontSize: '12px', 
                          color: 'var(--text-muted)',
                          maxWidth: '360px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {storeUrl}
                        </div>
                      </div>
                    </div>

                    <a
                      href={storeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        color: 'var(--text-muted)',
                        padding: '6px',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      title="Visitar loja"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '32px 16px',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--border-subtle)',
              marginBottom: '20px'
            }}>
              <Store size={36} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
              <h4 style={{ margin: '0 0 6px', fontSize: '15px', color: '#FFFFFF' }}>Nenhuma loja cadastrada neste perfil</h4>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                Adicione a URL de uma loja abaixo para incluí-la no garimpo.
              </p>
            </div>
          )}

          {/* Quick Add Store Form */}
          <div style={{
            padding: '14px 16px',
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF', marginBottom: '8px' }}>
              Adicionar qualquer loja ou produto para garimpar
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                placeholder="Cole qualquer URL de loja ou produto (Ex: pacecompany.com.br, carnan.com.br, link de produto...)"
                value={newStoreInput}
                onChange={(e) => {
                  setNewStoreInput(e.target.value);
                  if (inputError) setInputError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddStore();
                  }
                }}
                className="filter-input"
                style={{ flexGrow: 1, fontSize: '13px' }}
                id="input-quick-add-store"
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleAddStore}
                style={{ fontSize: '13px', padding: '8px 14px' }}
                id="btn-quick-add-store"
              >
                <Plus size={16} />
                <span>Adicionar</span>
              </button>
            </div>

            {inputError && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                color: 'var(--accent-danger)', 
                fontSize: '12px', 
                marginTop: '8px' 
              }}>
                <AlertCircle size={14} />
                <span>{inputError}</span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer" style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            id="btn-cancel-custom-hunt"
          >
            Cancelar
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleStartHunt}
            disabled={selectedStores.length === 0 || isHunting}
            id="btn-confirm-custom-hunt"
            style={{
              padding: '10px 24px',
              fontSize: '13px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}
          >
            {isHunting ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Garimpando...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Garimpar Lojas Selecionadas ({selectedStores.length})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
