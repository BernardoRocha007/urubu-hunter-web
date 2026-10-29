'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { FilterBar } from '@/components/FilterBar';
import { ItemCard } from '@/components/ItemCard';
import { StyleProfileModal } from '@/components/StyleProfileModal';
import { WatchlistModal } from '@/components/WatchlistModal';
import { CustomHuntModal } from '@/components/CustomHuntModal';

// Componentes Visuais Desacoplados
import { OfflineBanner } from '@/components/hunter/OfflineBanner';
import { QuickUrlHuntBar } from '@/components/hunter/QuickUrlHuntBar';
import { PaginationControls } from '@/components/hunter/PaginationControls';
import { EmptyState } from '@/components/hunter/EmptyState';
import { ToastNotification } from '@/components/common/ToastNotification';

// Hooks de Lógica de Negócio e Estado
import { useToast } from '@/hooks/useToast';
import { useHunterProfile } from '@/hooks/useHunterProfile';
import { useHunterFeed } from '@/hooks/useHunterFeed';
import { useHunt } from '@/hooks/useHunt';

/**
 * Componente principal da aplicação Urubu Hunter (Feed e Funcionalidades).
 * Acessível somente por usuários devidamente autenticados via AuthGuard.
 */
export function HunterApp() {
  const { toastMessage, showToast } = useToast();

  const {
    domains,
    currentDomain,
    setCurrentDomain,
    activeDomainDef,
    profile,
    watchlist,
    isOffline,
    isSettingsOpen,
    setIsSettingsOpen,
    isWatchlistOpen,
    setIsWatchlistOpen,
    loadWatchlist,
    saveProfile,
    addStoreToProfile,
    retryConnection
  } = useHunterProfile({
    showToast,
    onProfileUpdated: () => feed.resetToFirstPage()
  });

  const feed = useHunterFeed({
    currentDomain,
    showToast
  });

  const hunt = useHunt({
    currentDomain,
    showToast,
    onHuntComplete: () => {
      feed.loadCategories();
      feed.resetToFirstPage();
    }
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Cabeçalho */}
      <Header
        currentDomain={currentDomain}
        domains={domains}
        onSelectDomain={(id) => {
          setCurrentDomain(id);
          feed.setSelectedCategory(undefined);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenWatchlist={() => setIsWatchlistOpen(true)}
        onOpenCustomHunt={() => hunt.setIsCustomHuntOpen(true)}
        onTriggerHunt={hunt.triggerHunt}
        huntStatus={hunt.huntStatus}
        watchlistCount={watchlist.length}
      />

      {/* Alerta de Desconexão */}
      <OfflineBanner
        isOffline={isOffline}
        onReconnect={async () => {
          await retryConnection();
          feed.refetch();
        }}
      />

      <main className="container" style={{ flexGrow: 1, paddingBottom: '40px', paddingTop: '20px' }}>
        {/* Barra de Garimpo Universal por URL */}
        <QuickUrlHuntBar
          value={hunt.quickUrlInput}
          onChange={hunt.setQuickUrlInput}
          onSubmit={hunt.triggerQuickUrlHunt}
          isRunning={hunt.huntStatus.isRunning}
        />

        {/* Barra de Filtros */}
        <FilterBar
          searchTerm={feed.searchTerm}
          onSearchChange={feed.setSearchTerm}
          saleOnly={feed.saleOnly}
          onToggleSaleOnly={feed.toggleSaleOnly}
          minScore={feed.minScore}
          onSelectMinScore={feed.setMinScore}
          selectedCategory={feed.selectedCategory}
          onSelectCategory={feed.setSelectedCategory}
          availableCategories={feed.availableCategories}
          onClearFeed={feed.clearFeed}
          isClearingFeed={feed.isClearingFeed}
        />

        {/* Grade de Produtos ou Estado Vazio */}
        {feed.items.length > 0 ? (
          <>
            <div className="items-grid" id="curated-items-grid">
              {feed.items.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onFeedback={feed.handleFeedback}
                />
              ))}
            </div>

            <PaginationControls
              page={feed.page}
              totalPages={feed.totalPages}
              totalItems={feed.totalItems}
              isLoading={feed.isLoading}
              onGoToPage={feed.goToPage}
            />
          </>
        ) : (
          <EmptyState
            isLoading={feed.isLoading}
            onTriggerHunt={hunt.triggerHunt}
          />
        )}
      </main>

      {/* Modal de Perfil de Estilo */}
      {profile && (
        <StyleProfileModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          profile={profile}
          domainDef={activeDomainDef}
          onSave={saveProfile}
        />
      )}

      {/* Modal de Watchlist & Monitoramento de Preços */}
      <WatchlistModal
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlist={watchlist || []}
        onRefreshWatchlist={loadWatchlist}
        onShowToast={showToast}
      />

      {/* Modal de Garimpo Customizado */}
      <CustomHuntModal
        isOpen={hunt.isCustomHuntOpen}
        onClose={() => hunt.setIsCustomHuntOpen(false)}
        targetStores={profile?.targetStores || []}
        domainName={activeDomainDef.name}
        onTriggerCustomHunt={hunt.triggerCustomHunt}
        isHunting={hunt.huntStatus.isRunning}
        onAddNewStore={addStoreToProfile}
      />

      {/* Notificação Toast */}
      <ToastNotification message={toastMessage} />
    </div>
  );
}
