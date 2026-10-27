'use client';
import React, { useState } from 'react';
import { X, Plus, Trash2, Check, Sparkles } from 'lucide-react';
import { StyleProfile, DomainDefinition } from '@/types';

interface StyleProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StyleProfile;
  domainDef: DomainDefinition;
  onSave: (updated: StyleProfile) => void;
}

export const StyleProfileModal: React.FC<StyleProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  domainDef,
  onSave
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState<StyleProfile>({ ...profile });
  const [newKeyword, setNewKeyword] = useState('');
  const [newStore, setNewStore] = useState('');
  const [newForbidden, setNewForbidden] = useState('');

  const handleAddKeyword = () => {
    if (!newKeyword.trim()) return;
    if (!formData.aestheticKeywords.includes(newKeyword.trim())) {
      setFormData({
        ...formData,
        aestheticKeywords: [...formData.aestheticKeywords, newKeyword.trim()]
      });
    }
    setNewKeyword('');
  };

  const handleRemoveKeyword = (kw: string) => {
    setFormData({
      ...formData,
      aestheticKeywords: formData.aestheticKeywords.filter((k) => k !== kw)
    });
  };

  const handleToggleSize = (size: string) => {
    const exists = formData.preferredSizes.includes(size);
    setFormData({
      ...formData,
      preferredSizes: exists
        ? formData.preferredSizes.filter((s) => s !== size)
        : [...formData.preferredSizes, size]
    });
  };

  const handleAddForbidden = () => {
    if (!newForbidden.trim()) return;
    if (!formData.forbiddenTerms.includes(newForbidden.trim())) {
      setFormData({
        ...formData,
        forbiddenTerms: [...formData.forbiddenTerms, newForbidden.trim()]
      });
    }
    setNewForbidden('');
  };

  const handleRemoveForbidden = (term: string) => {
    setFormData({
      ...formData,
      forbiddenTerms: formData.forbiddenTerms.filter((t) => t !== term)
    });
  };

  const handleAddStore = () => {
    if (!newStore.trim()) return;
    let url = newStore.trim();
    if (!url.startsWith('http')) {
      url = 'https://' + url;
    }
    if (!formData.targetStores.includes(url)) {
      setFormData({
        ...formData,
        targetStores: [...formData.targetStores, url]
      });
    }
    setNewStore('');
  };

  const handleRemoveStore = (url: string) => {
    setFormData({
      ...formData,
      targetStores: formData.targetStores.filter((s) => s !== url)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} id="modal-style-profile-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} id="modal-style-profile">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="var(--accent-primary)" />
            <h3>Perfil de Estilo & Garimpo ({domainDef.name})</h3>
          </div>
          <button className="icon-btn" onClick={onClose} id="btn-close-modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Keywords */}
          <div className="form-group">
            <label className="form-label">
              Palavras-chave de Estética & Caimento
            </label>
            <div className="tags-input-container">
              {formData.aestheticKeywords.map((kw) => (
                <span key={kw} className="tag-badge-removable">
                  {kw}
                  <button type="button" onClick={() => handleRemoveKeyword(kw)}>
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: streetwear, corte boxy, linho, vintage..."
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddKeyword();
                  }
                }}
                id="input-add-keyword"
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleAddKeyword}
                id="btn-add-keyword"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Preferred Sizes */}
          <div className="form-group">
            <label className="form-label">Seus Tamanhos de Preferência</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {domainDef.sizeOptions.map((sz) => {
                const isSelected = formData.preferredSizes.includes(sz);
                return (
                  <button
                    key={sz}
                    type="button"
                    className={`filter-chip ${isSelected ? 'active' : ''}`}
                    onClick={() => handleToggleSize(sz)}
                    id={`size-toggle-${sz}`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Max Price */}
          <div className="form-group">
            <label className="form-label">
              Limite de Preço Máximo: R$ {formData.maxPrice}
            </label>
            <input
              type="range"
              min="100"
              max="2000"
              step="50"
              style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
              value={formData.maxPrice}
              onChange={(e) =>
                setFormData({ ...formData, maxPrice: parseInt(e.target.value, 10) })
              }
              id="range-max-price"
            />
          </div>

          {/* Forbidden Terms */}
          <div className="form-group">
            <label className="form-label">
              Termos a Evitar (Descarte Automático)
            </label>
            <div className="tags-input-container">
              {formData.forbiddenTerms.map((term) => (
                <span key={term} className="tag-badge-removable" style={{ borderColor: 'var(--accent-danger)' }}>
                  {term}
                  <button type="button" onClick={() => handleRemoveForbidden(term)}>
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: skinny, poliester 100%, infantil..."
                value={newForbidden}
                onChange={(e) => setNewForbidden(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddForbidden();
                  }
                }}
                id="input-add-forbidden"
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleAddForbidden}
                id="btn-add-forbidden"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Target Stores */}
          <div className="form-group">
            <label className="form-label">
              Lojas & Marcas Alvo (Instagram / Shopify URLs)
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '8px' }}>
              {formData.targetStores.map((store) => (
                <div
                  key={store}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--bg-deep)',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '13px'
                  }}
                >
                  <span style={{ color: 'var(--text-secondary)' }}>{store}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveStore(store)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: sufgang.com.br, pacecompany.com.br..."
                value={newStore}
                onChange={(e) => setNewStore(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddStore();
                  }
                }}
                id="input-add-store"
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleAddStore}
                id="btn-add-store"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" id="btn-save-profile">
              <Check size={16} />
              Salvar Preferências
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
