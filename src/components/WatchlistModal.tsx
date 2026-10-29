'use client';

import React from 'react';
import { Bell } from 'lucide-react';
import { WatchlistItem } from '@/types';
import { useWatchlistModal } from '@/hooks/useWatchlistModal';

// Componentes comuns e modulares de Watchlist
import { Modal, ModalHeader } from '@/components/common/Modal';
import { WatchlistTabs } from '@/components/watchlist/WatchlistTabs';
import { WatchlistAddForm } from '@/components/watchlist/WatchlistAddForm';
import { WatchlistSummaryBar } from '@/components/watchlist/WatchlistSummaryBar';
import { WatchlistEmptyState } from '@/components/watchlist/WatchlistEmptyState';
import { WatchlistProductCard } from '@/components/watchlist/WatchlistProductCard';
import { WatchlistAlertSettings } from '@/components/watchlist/WatchlistAlertSettings';

interface WatchlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  watchlist: WatchlistItem[];
  onRefreshWatchlist: () => void;
  onShowToast: (msg: string) => void;
}

/**
 * Modal estritamente de apresentação para o Monitor de Preços & Watchlist.
 * 100% desacoplado de lógica interna e sem excesso de divs inline.
 */
export const WatchlistModal: React.FC<WatchlistModalProps> = ({
  isOpen,
  onClose,
  watchlist,
  onRefreshWatchlist,
  onShowToast
}) => {
  const {
    activeTab,
    setActiveTab,
    url,
    setUrl,
    targetPrice,
    setTargetPrice,
    isSubmitting,
    isChecking,
    isTestingAlert,
    isSavingConfig,
    errorMsg,
    notifConfig,
    setNotifConfig,
    handleAddProduct,
    handleDelete,
    handleCheckNow,
    handleSaveAlerts,
    handleTestAlert
  } = useWatchlistModal({
    isOpen,
    onRefreshWatchlist,
    onShowToast
  });

  const safeWatchlist = Array.isArray(watchlist) ? watchlist : [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} id="watchlist-modal" maxWidth="740px">
      {/* Cabeçalho Semântico */}
      <ModalHeader
        title="Monitor de Preços & Alertas"
        subtitle="Cole qualquer link de produto. O Hunter vigia o preço e te avisa no celular ou e-mail!"
        icon={
          <div
            style={{
              background: 'linear-gradient(135deg, #FF3366, #FF6B00)',
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF'
            }}
          >
            <Bell size={20} />
          </div>
        }
        onClose={onClose}
        closeId="btn-close-watchlist-modal"
      />

      {/* Navegação entre Abas */}
      <WatchlistTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        count={safeWatchlist.length}
      />

      {/* ABA 1: PRODUTOS MONITORADOS */}
      {activeTab === 'products' && (
        <section aria-label="Produtos monitorados">
          {/* Formulário de Adição */}
          <WatchlistAddForm
            url={url}
            targetPrice={targetPrice}
            isSubmitting={isSubmitting}
            errorMsg={errorMsg}
            onUrlChange={setUrl}
            onTargetPriceChange={setTargetPrice}
            onSubmit={handleAddProduct}
          />

          {/* Barra de Status e Ação */}
          <WatchlistSummaryBar
            phone={notifConfig.phone}
            email={notifConfig.email}
            hasItems={safeWatchlist.length > 0}
            isChecking={isChecking}
            onCheckNow={handleCheckNow}
          />

          {/* Lista de Itens ou Estado Vazio */}
          {safeWatchlist.length === 0 ? (
            <WatchlistEmptyState />
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                maxHeight: '380px',
                overflowY: 'auto'
              }}
              role="feed"
              aria-label="Lista de produtos sob vigilância"
            >
              {safeWatchlist.map((item, idx) => (
                <WatchlistProductCard
                  key={item.id || `item-${idx}`}
                  item={item}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ABA 2: CONFIGURAÇÃO DE ALERTAS */}
      {activeTab === 'alerts' && (
        <section aria-label="Configuração de canais de notificação">
          <WatchlistAlertSettings
            notifConfig={notifConfig}
            isTestingAlert={isTestingAlert}
            isSavingConfig={isSavingConfig}
            onChangeConfig={setNotifConfig}
            onTestAlert={handleTestAlert}
            onSave={handleSaveAlerts}
          />
        </section>
      )}
    </Modal>
  );
};
