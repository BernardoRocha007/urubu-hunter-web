'use client';

import React from 'react';
import { Sparkles, RefreshCw, Store } from 'lucide-react';
import { useCustomHuntForm } from '@/hooks/useCustomHuntForm';

// Componentes comuns e modulares
import { Modal, ModalHeader, ModalFooter } from '@/components/common/Modal';
import { CustomHuntActionBar } from '@/components/hunt/CustomHuntActionBar';
import { CustomHuntStoreItem } from '@/components/hunt/CustomHuntStoreItem';
import { CustomHuntAddStoreForm } from '@/components/hunt/CustomHuntAddStoreForm';

interface CustomHuntModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetStores: string[];
  domainName: string;
  onTriggerCustomHunt: (selectedStores: string[]) => void;
  isHunting: boolean;
  onAddNewStore?: (newStoreUrl: string) => void;
}

/**
 * Modal para acionamento de garimpo em lote em lojas específicas.
 * 100% modular, sem lógica de estado misturada com a view e sem divs desnecessárias.
 */
export const CustomHuntModal: React.FC<CustomHuntModalProps> = ({
  isOpen,
  onClose,
  targetStores,
  domainName,
  onTriggerCustomHunt,
  isHunting,
  onAddNewStore
}) => {
  const {
    selectedStores,
    newStoreInput,
    setNewStoreInput,
    inputError,
    toggleStore,
    handleSelectAll,
    handleDeselectAll,
    handleAddStore,
    handleStartHunt,
    formatStoreName
  } = useCustomHuntForm({
    isOpen,
    targetStores,
    isHunting,
    onTriggerCustomHunt,
    onAddNewStore
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} id="custom-hunt-modal" maxWidth="620px">
      {/* Cabeçalho */}
      <ModalHeader
        title="Garimpo Personalizado"
        subtitle={`Selecione quais lojas salvas em ${domainName} você deseja vasculhar agora`}
        icon={
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Sparkles size={18} color="var(--text-primary)" />
          </div>
        }
        onClose={onClose}
        closeId="btn-close-custom-hunt"
      />

      {/* Corpo da Modal */}
      <main style={{ padding: '0 0 16px', overflowY: 'auto' }}>
        {/* Barra de Ações Rápidas */}
        <CustomHuntActionBar
          selectedCount={selectedStores.length}
          totalCount={targetStores.length}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
        />

        {/* Lista de Lojas Cadastradas */}
        {targetStores.length > 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              marginBottom: '20px',
              maxHeight: '320px',
              overflowY: 'auto'
            }}
            role="list"
          >
            {targetStores.map((storeUrl) => (
              <CustomHuntStoreItem
                key={storeUrl}
                storeUrl={storeUrl}
                storeName={formatStoreName(storeUrl)}
                isSelected={selectedStores.includes(storeUrl)}
                onToggle={toggleStore}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '32px 16px',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--border-subtle)',
              marginBottom: '20px'
            }}
          >
            <Store size={36} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
            <h4 style={{ margin: '0 0 6px', fontSize: '15px', color: '#FFFFFF' }}>
              Nenhuma loja cadastrada neste perfil
            </h4>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
              Adicione a URL de uma loja abaixo para incluí-la no garimpo.
            </p>
          </div>
        )}

        {/* Formulário de Adição Rápida */}
        <CustomHuntAddStoreForm
          inputValue={newStoreInput}
          errorMsg={inputError}
          onInputChange={setNewStoreInput}
          onAddStore={handleAddStore}
        />
      </main>

      {/* Rodapé com Ações */}
      <ModalFooter style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
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
      </ModalFooter>
    </Modal>
  );
};
