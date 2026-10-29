'use client';

import React from 'react';
import { X, Check, Sparkles } from 'lucide-react';
import { StyleProfile, DomainDefinition } from '@/types';
import { useStyleProfileForm } from '@/hooks/useStyleProfileForm';

// Componentes Modulares de Formulário
import { TagsInputField } from '@/components/profile/TagsInputField';
import { SizePicker } from '@/components/profile/SizePicker';
import { PriceRangeField } from '@/components/profile/PriceRangeField';
import { TargetStoresList } from '@/components/profile/TargetStoresList';

import { Modal, ModalHeader, ModalFooter } from '@/components/common/Modal';

interface StyleProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StyleProfile;
  domainDef: DomainDefinition;
  onSave: (updated: StyleProfile) => void;
}

/**
 * Modal estritamente de apresentação para o Perfil de Estilo & Garimpo.
 * Composto por subcomponentes desacoplados e orquestrado pelo hook useStyleProfileForm.
 */
export const StyleProfileModal: React.FC<StyleProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  domainDef,
  onSave
}) => {
  const {
    formData,
    sizeOptions,
    newKeyword,
    setNewKeyword,
    newStore,
    setNewStore,
    newForbidden,
    setNewForbidden,
    handleAddKeyword,
    handleRemoveKeyword,
    handleToggleSize,
    handleAddForbidden,
    handleRemoveForbidden,
    handleAddStore,
    handleRemoveStore,
    setMaxPrice,
    handleSubmit
  } = useStyleProfileForm({
    profile,
    domainDef,
    onSave,
    onClose,
    isOpen
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} id="modal-style-profile">
      {/* Cabeçalho */}
      <ModalHeader
        title={`Perfil de Estilo & Garimpo (${domainDef?.name || 'Personalizado'})`}
        icon={<Sparkles size={20} color="var(--accent-primary)" />}
        onClose={onClose}
        closeId="btn-close-modal"
      />

      {/* Formulário Declarativo */}
      <form onSubmit={handleSubmit}>
        {/* Palavras-chave de Estética */}
        <TagsInputField
          label="Palavras-chave de Estética & Caimento"
          placeholder="Ex: streetwear, corte boxy, linho, vintage..."
          tags={formData.aestheticKeywords || []}
          inputValue={newKeyword}
          onInputChange={setNewKeyword}
          onAddTag={handleAddKeyword}
          onRemoveTag={handleRemoveKeyword}
          idPrefix="keyword"
        />

        {/* Tamanhos de Preferência */}
        <SizePicker
          label="Seus Tamanhos de Preferência"
          availableSizes={sizeOptions}
          selectedSizes={formData.preferredSizes || []}
          onToggleSize={handleToggleSize}
        />

        {/* Limite de Preço Máximo */}
        <PriceRangeField
          label="Limite de Preço Máximo"
          value={formData.maxPrice}
          min={100}
          max={2000}
          step={50}
          onChange={setMaxPrice}
        />

        {/* Termos Proibidos / Descarte */}
        <TagsInputField
          label="Termos a Evitar (Descarte Automático)"
          placeholder="Ex: skinny, poliester 100%, infantil..."
          tags={formData.forbiddenTerms || []}
          inputValue={newForbidden}
          onInputChange={setNewForbidden}
          onAddTag={handleAddForbidden}
          onRemoveTag={handleRemoveForbidden}
          isDanger
          idPrefix="forbidden"
        />

        {/* Lojas & Marcas Alvo */}
        <TargetStoresList
          stores={formData.targetStores || []}
          inputValue={newStore}
          onInputChange={setNewStore}
          onAddStore={handleAddStore}
          onRemoveStore={handleRemoveStore}
        />

        {/* Rodapé e Ações */}
        <ModalFooter>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" id="btn-save-profile">
            <Check size={16} />
            Salvar Preferências
          </button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

