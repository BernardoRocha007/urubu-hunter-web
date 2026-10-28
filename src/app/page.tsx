'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { FilterBar } from '@/components/FilterBar';
import { ItemCard } from '@/components/ItemCard';
import { StyleProfileModal } from '@/components/StyleProfileModal';
import { WatchlistModal } from '@/components/WatchlistModal';
import { CustomHuntModal } from '@/components/CustomHuntModal';
import { DomainId, DomainDefinition, CuratedItem, StyleProfile, HuntStatus, WatchlistItem, PaginatedItemsResponse, ClearFeedResponse } from '@/types';
import { CheckCircle2, AlertTriangle, RefreshCw, Search, ChevronLeft, ChevronRight, Globe, Sparkles } from 'lucide-react';

export default function HomePage() {
  const [domains, setDomains] = useState<Record<string, DomainDefinition>>({});
  const [currentDomain, setCurrentDomain] = useState<DomainId>('fashion');
  const [profile, setProfile] = useState<StyleProfile | null>(null);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isOffline, setIsOffline] = useState(false);
  const [huntStatus, setHuntStatus] = useState<HuntStatus>({
    isRunning: false,
    domain: null,
    lastRun: null,
    itemsFound: 0,
    itemsCurated: 0
  });

  // Server-side paginated items state (Máximo 20 itens por página na memória do navegador - Consumo mínimo de RAM/CPU)
  const [items, setItems] = useState<CuratedItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [isCustomHuntOpen, setIsCustomHuntOpen] = useState(false);
  const [isClearingFeed, setIsClearingFeed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [saleOnly, setSaleOnly] = useState(false);
  const [minScore, setMinScore] = useState<number | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [quickUrlInput, setQuickUrlInput] = useState('');

  // Debounce na barra de pesquisa (280ms) para não sobrecarregar a digitação
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 280);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Carrega produtos da Watchlist
  const loadWatchlist = useCallback(() => {
    fetch('/api/watchlist')
      .then((res) => {
        if (!res.ok) throw new Error('Offline');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setWatchlist(data);
        }
      })
      .catch((err) => {
        console.warn('Erro ao carregar watchlist:', err);
      });
  }, []);

  // Carrega domínios disponíveis
  useEffect(() => {
    fetch('/api/domains')
      .then((res) => {
        if (!res.ok) throw new Error('Offline');
        return res.json();
      })
      .then((data) => {
        setDomains(data);
        setIsOffline(false);
      })
      .catch((err) => {
        console.error('Erro ao carregar domínios:', err);
        setIsOffline(true);
      });

    loadWatchlist();
  }, [loadWatchlist]);

  // Carrega categorias distintas do domínio direto da API (0.5ms no SQLite)
  const loadCategories = useCallback(() => {
    fetch(`/api/categories?domain=${currentDomain}`)
      .then((res) => {
        if (!res.ok) throw new Error('Offline');
        return res.json();
      })
      .then((cats: string[]) => {
        if (Array.isArray(cats)) {
          setAvailableCategories(cats);
        }
      })
      .catch((err) => {
        console.warn('Erro ao carregar categorias:', err);
      });
  }, [currentDomain]);

  // Carrega perfil de estilo
  const loadProfile = useCallback(() => {
    fetch(`/api/profile?domain=${currentDomain}`)
      .then((res) => {
        if (!res.ok) throw new Error('Offline');
        return res.json();
      })
      .then((data) => {
        setProfile(data);
        setIsOffline(false);
      })
      .catch((err) => {
        console.error('Erro ao carregar perfil:', err);
        setIsOffline(true);
      });
  }, [currentDomain]);

  // Busca página de itens no backend com filtragem atômica no SQLite
  const fetchPage = useCallback(
    async (targetPage: number) => {
      setIsLoading(true);
      const params = new URLSearchParams();
      params.set('domain', currentDomain);
      params.set('page', targetPage.toString());
      params.set('limit', '20');
      if (minScore !== undefined) params.set('minScore', minScore.toString());
      if (saleOnly) params.set('saleOnly', 'true');
      if (selectedCategory) params.set('category', selectedCategory);
      if (debouncedSearch.trim()) params.set('search', debouncedSearch.trim());

      try {
        const res = await fetch(`/api/items?${params.toString()}`);
        if (!res.ok) throw new Error('Offline');
        const data: PaginatedItemsResponse = await res.json();

        setItems(data.items || []);
        setPage(data.page || targetPage);
        setTotalItems(data.total || 0);
        setTotalPages(data.totalPages || Math.ceil((data.total || 0) / 20) || 1);
        setIsOffline(false);
      } catch (err) {
        console.error('Erro ao carregar itens:', err);
        setIsOffline(true);
      } finally {
        setIsLoading(false);
      }
    },
    [currentDomain, minScore, saleOnly, selectedCategory, debouncedSearch]
  );

  // Ao mudar de domínio: carrega perfil, categorias e reseta para a página 1
  useEffect(() => {
    loadProfile();
    loadCategories();
  }, [loadProfile, loadCategories]);

  // Ao alterar filtros ou busca com debounce: busca página 1
  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  // Troca de página
  const handleGoToPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    fetchPage(newPage);
    document.getElementById('curated-items-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Feedback no item (Like / Dislike)
  const handleFeedback = async (id: string, feedback: 'liked' | 'disliked' | null) => {
    try {
      const res = await fetch(`/api/items/${id}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback })
      });
      if (res.ok) {
        setItems((prev) =>
          prev.map((item) => (item.id === id ? { ...item, feedback } : item))
        );
        showToast(
          feedback === 'liked'
            ? 'Adicionado aos seus favoritos!'
            : feedback === 'disliked'
            ? 'Item marcado como fora do seu estilo.'
            : 'Feedback removido.'
        );
      }
    } catch (e) {
      console.error('Erro ao registrar feedback:', e);
    }
  };

  // Dispara garimpo geral
  const handleTriggerHunt = async () => {
    setHuntStatus((prev) => ({ ...prev, isRunning: true }));
    try {
      const res = await fetch('/api/hunt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: currentDomain })
      });
      if (!res.ok) {
        throw new Error('Falha ao disparar garimpo.');
      }

      showToast('Garimpo iniciado. Vasculhando lojas e avaliando peças...');

      // Polling de status
      const interval = setInterval(async () => {
        try {
          const statusRes = await fetch('/api/hunt/status');
          const statusData: HuntStatus = await statusRes.json();
          setHuntStatus(statusData);

          if (!statusData.isRunning) {
            clearInterval(interval);
            loadCategories();
            fetchPage(1);
            showToast(`Garimpo concluído: ${statusData.itemsCurated} peças avaliadas.`);
          }
        } catch {
          clearInterval(interval);
          setHuntStatus((prev) => ({ ...prev, isRunning: false }));
        }
      }, 1500);
    } catch (err) {
      setHuntStatus((prev) => ({ ...prev, isRunning: false }));
      showToast('Erro ao iniciar garimpo.');
    }
  };

  // Dispara garimpo personalizado de lojas selecionadas
  const handleTriggerCustomHunt = async (selectedStores: string[]) => {
    setIsCustomHuntOpen(false);
    setHuntStatus((prev) => ({ ...prev, isRunning: true }));
    try {
      const res = await fetch('/api/hunt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: currentDomain, targetStores: selectedStores })
      });
      if (!res.ok) {
        throw new Error('Falha ao disparar garimpo personalizado.');
      }

      showToast(`Garimpando ${selectedStores.length} lojas selecionadas...`);

      const interval = setInterval(async () => {
        try {
          const statusRes = await fetch('/api/hunt/status');
          const statusData: HuntStatus = await statusRes.json();
          setHuntStatus(statusData);

          if (!statusData.isRunning) {
            clearInterval(interval);
            loadCategories();
            fetchPage(1);
            showToast(`Garimpo concluído: ${statusData.itemsCurated} peças avaliadas.`);
          }
        } catch {
          clearInterval(interval);
          setHuntStatus((prev) => ({ ...prev, isRunning: false }));
        }
      }, 1500);
    } catch (err) {
      setHuntStatus((prev) => ({ ...prev, isRunning: false }));
      showToast('Erro ao iniciar garimpo personalizado.');
    }
  };

  // Garimpa qualquer URL informada diretamente (loja inteira ou peca individual)
  const handleQuickUrlHunt = async () => {
    let raw = quickUrlInput.trim();
    if (!raw || huntStatus.isRunning) return;

    if (!raw.startsWith('http://') && !raw.startsWith('https://')) {
      raw = "https://" + raw;
    }

    setQuickUrlInput('');
    await handleTriggerCustomHunt([raw]);
  };

  // Limpa feed mantendo favoritos
  const handleClearFeed = async () => {
    if (isClearingFeed) return;
    setIsClearingFeed(true);
    try {
      const res = await fetch('/api/items/clear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: currentDomain })
      });
      if (!res.ok) throw new Error('Falha ao limpar o feed');
      const data: ClearFeedResponse = await res.json();
      showToast(data.message.replace(/[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim());
      loadCategories();
      fetchPage(1);
    } catch (err) {
      console.error('Erro ao limpar feed:', err);
      showToast('Erro ao limpar o feed.');
    } finally {
      setIsClearingFeed(false);
    }
  };

  // Adiciona loja ao perfil a partir do garimpo customizado
  const handleAddNewStoreFromCustomHunt = (newStoreUrl: string) => {
    if (!profile) return;
    const currentStores = profile.targetStores || [];
    if (currentStores.includes(newStoreUrl)) return;

    const updated: StyleProfile = {
      ...profile,
      targetStores: [...currentStores, newStoreUrl]
    };
    handleSaveProfile(updated);
  };

  // Salva perfil de estilo
  const handleSaveProfile = async (updated: StyleProfile) => {
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        setProfile(updated);
        showToast('Preferências salvas com sucesso!');
        fetchPage(1);
      }
    } catch (e) {
      console.error('Erro ao salvar preferências:', e);
    }
  };

  const activeDomainDef = domains[currentDomain] || {
    id: currentDomain,
    name: 'Moda Streetwear',
    description: 'Curadoria de streetwear, marcas de nicho do Instagram, cortes oversized e achados com desconto.',
    icon: 'STREET',
    defaultKeywords: [],
    sizeOptions: [],
    defaultStores: []
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        currentDomain={currentDomain}
        domains={domains}
        onSelectDomain={(id) => {
          setCurrentDomain(id);
          setSelectedCategory(undefined);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenWatchlist={() => setIsWatchlistOpen(true)}
        onOpenCustomHunt={() => setIsCustomHuntOpen(true)}
        onTriggerHunt={handleTriggerHunt}
        huntStatus={huntStatus}
        watchlistCount={watchlist.length}
      />

      {isOffline && (
        <div
          style={{
            background: 'hsla(350, 89%, 60%, 0.15)',
            borderBottom: '1px solid hsla(350, 89%, 60%, 0.4)',
            padding: '12px 24px',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            fontSize: '13px'
          }}
          id="offline-banner"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={18} color="var(--accent-danger)" />
            <span>
              <strong>Backend Desconectado:</strong> O servidor Fastify não está rodando na porta 3001. 
              Inicie o backend rodando <code>pnpm dev</code> na raiz do projeto ou abra uma nova aba e rode <code>cd backend &amp;&amp; pnpm dev</code>.
            </span>
          </div>
          <button
            className="btn btn-secondary"
            style={{ padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}
            onClick={() => fetchPage(page)}
          >
            <RefreshCw size={12} />
            <span>Reconectar</span>
          </button>
        </div>
      )}

      <main className="container" style={{ flexGrow: 1, paddingBottom: '40px', paddingTop: '20px' }}>
        {/* Barra de Garimpo Universal por URL */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            background: 'var(--bg-surface)',
            padding: '12px 18px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '16px'
          }}
          id="quick-url-hunter-bar"
        >
          <div style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center' }}>
            <Globe size={18} />
          </div>
          <input
            type="text"
            placeholder="Cole qualquer URL de loja ou produto (ex: pacecompany.com.br, carnan.com.br, link de produto...)"
            value={quickUrlInput}
            onChange={(e) => setQuickUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleQuickUrlHunt();
              }
            }}
            className="filter-input"
            style={{ flexGrow: 1, fontSize: '13px' }}
            id="input-quick-hunt-url"
          />
          <button
            className="btn btn-primary"
            onClick={handleQuickUrlHunt}
            disabled={huntStatus.isRunning || !quickUrlInput.trim()}
            id="btn-quick-hunt-url"
            style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {huntStatus.isRunning ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>Garimpando...</span>
              </>
            ) : (
              <>
                <Sparkles size={14} />
                <span>Garimpar URL</span>
              </>
            )}
          </button>
        </div>

        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          saleOnly={saleOnly}
          onToggleSaleOnly={() => setSaleOnly(!saleOnly)}
          minScore={minScore}
          onSelectMinScore={setMinScore}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          availableCategories={availableCategories}
          onClearFeed={handleClearFeed}
          isClearingFeed={isClearingFeed}
        />

        {/* Items Grid */}
        {items.length > 0 ? (
          <>
            <div className="items-grid" id="curated-items-grid">
              {items.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onFeedback={handleFeedback}
                />
              ))}
            </div>

            {/* Controles de Paginação Server-Side (Máxima fluidez, consumo mínimo de RAM) */}
            {totalPages > 1 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px',
                  marginTop: '40px',
                  marginBottom: '20px',
                  padding: '16px 20px',
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)'
                }}
                id="pagination-controls"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    Mostrando <strong style={{ color: 'var(--text-primary)' }}>{(page - 1) * 20 + 1}</strong> a{' '}
                    <strong style={{ color: 'var(--text-primary)' }}>{Math.min(page * 20, totalItems)}</strong> de{' '}
                    <strong style={{ color: 'var(--text-primary)' }}>{totalItems}</strong> produtos
                  </div>

                  {totalItems >= 500 && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '3px 10px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(234, 179, 8, 0.12)',
                        color: '#FACC15',
                        border: '1px solid rgba(234, 179, 8, 0.35)',
                        letterSpacing: '0.01em'
                      }}
                      id="badge-max-items-reached"
                      title="Limite máximo de 500 itens atingido para garantir fluidez e economia de memória no seu computador."
                    >
                      <AlertTriangle size={13} />
                      <span>Limite máximo atingido (500)</span>
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleGoToPage(page - 1)}
                    disabled={page <= 1 || isLoading}
                    style={{
                      padding: '8px 14px',
                      fontSize: '12px',
                      borderRadius: 'var(--radius-sm)',
                      cursor: page <= 1 ? 'not-allowed' : 'pointer',
                      opacity: page <= 1 ? 0.4 : 1
                    }}
                    id="btn-prev-page"
                  >
                    <ChevronLeft size={14} />
                    <span>Anterior</span>
                  </button>

                  {/* Numeração de Páginas */}
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                      .map((p, idx, arr) => {
                        const showEllipsis = idx > 0 && p - arr[idx - 1] > 1;
                        return (
                          <React.Fragment key={p}>
                            {showEllipsis && (
                              <span style={{ padding: '6px 8px', color: 'var(--text-muted)', fontSize: '12px' }}>
                                ...
                              </span>
                            )}
                            <button
                              className={`btn ${p === page ? 'btn-primary' : 'btn-secondary'}`}
                              onClick={() => handleGoToPage(p)}
                              disabled={isLoading}
                              style={{
                                minWidth: '34px',
                                height: '34px',
                                padding: '0 8px',
                                fontSize: '12px',
                                fontWeight: p === page ? 700 : 500,
                                borderRadius: 'var(--radius-sm)',
                                background: p === page ? 'var(--accent-primary)' : 'var(--bg-card)',
                                borderColor: p === page ? 'var(--accent-primary)' : 'var(--border-subtle)',
                                color: p === page ? '#000000' : 'var(--text-primary)'
                              }}
                              id={`btn-page-${p}`}
                            >
                              {p}
                            </button>
                          </React.Fragment>
                        );
                      })}
                  </div>

                  <button
                    className="btn btn-secondary"
                    onClick={() => handleGoToPage(page + 1)}
                    disabled={page >= totalPages || isLoading}
                    style={{
                      padding: '8px 14px',
                      fontSize: '12px',
                      borderRadius: 'var(--radius-sm)',
                      cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                      opacity: page >= totalPages ? 0.4 : 1
                    }}
                    id="btn-next-page"
                  >
                    <span>Próxima</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-sm)',
              border: '1px dashed var(--border-subtle)',
              margin: '20px 0'
            }}
            id="empty-items-state"
          >
            <div style={{ marginBottom: '14px', display: 'flex', justifyContent: 'center' }}>
              <Search size={32} color="var(--text-muted)" strokeWidth={1.5} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
              {isLoading ? 'Buscando produtos...' : 'Nenhum achado encontrado com esses filtros'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '20px' }}>
              {isLoading ? 'Carregando os achados do banco de dados...' : 'Ajuste seus filtros ou clique em "Garimpar Tudo" para vasculhar as marcas cadastradas.'}
            </p>
            {!isLoading && (
              <button className="btn btn-primary" onClick={handleTriggerHunt}>
                Garimpar Tudo
              </button>
            )}
          </div>
        )}
      </main>

      {/* Style Profile Modal */}
      {profile && (
        <StyleProfileModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          profile={profile}
          domainDef={activeDomainDef}
          onSave={handleSaveProfile}
        />
      )}

      {/* Watchlist & Price Drop Monitor Modal */}
      <WatchlistModal
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlist={watchlist}
        onRefreshWatchlist={loadWatchlist}
        onShowToast={showToast}
      />

      {/* Custom Hunt Modal (Garimpo Personalizado de Lojas Salvas) */}
      <CustomHuntModal
        isOpen={isCustomHuntOpen}
        onClose={() => setIsCustomHuntOpen(false)}
        targetStores={profile?.targetStores || []}
        domainName={activeDomainDef.name}
        onTriggerCustomHunt={handleTriggerCustomHunt}
        isHunting={huntStatus.isRunning}
        onAddNewStore={handleAddNewStoreFromCustomHunt}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: 'hsl(224, 20%, 15%)',
            color: '#FFFFFF',
            border: '1px solid var(--border-highlight)',
            padding: '12px 20px',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            zIndex: 1000,
            fontSize: '14px',
            fontWeight: 500,
            animation: 'fadeIn 200ms ease-out'
          }}
          id="system-toast-notification"
        >
          <CheckCircle2 size={16} color="var(--accent-success)" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
