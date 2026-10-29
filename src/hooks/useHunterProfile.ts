import { useState, useEffect, useCallback, useMemo } from 'react';
import { DomainId, DomainDefinition, StyleProfile, WatchlistItem } from '@/types';
import { hunterApi } from '@/services/hunter-api.service';

interface UseHunterProfileOptions {
  initialDomain?: DomainId;
  showToast: (msg: string) => void;
  onProfileUpdated?: () => void;
}

const DEFAULT_DOMAIN_DEF: DomainDefinition = {
  id: 'fashion',
  name: 'Moda Streetwear',
  description: 'Curadoria de streetwear, marcas de nicho do Instagram, cortes oversized e achados com desconto.',
  icon: 'STREET',
  defaultKeywords: [],
  sizeOptions: [],
  defaultStores: []
};

/**
 * Hook para gerenciar estado de domínios, perfil de estilo e watchlist do usuário.
 */
export function useHunterProfile({
  initialDomain = 'fashion',
  showToast,
  onProfileUpdated
}: UseHunterProfileOptions) {
  const [domains, setDomains] = useState<Record<string, DomainDefinition>>({});
  const [currentDomain, setCurrentDomain] = useState<DomainId>(initialDomain);
  const [profile, setProfile] = useState<StyleProfile | null>(null);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isOffline, setIsOffline] = useState(false);

  // Modais associados a perfil e watchlist
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);

  // Carrega lista de monitoramento (watchlist)
  const loadWatchlist = useCallback(async () => {
    try {
      const data = await hunterApi.getWatchlist();
      if (Array.isArray(data)) {
        setWatchlist(data);
      }
    } catch (err) {
      console.warn('Erro ao carregar watchlist:', err);
    }
  }, []);

  // Carrega domínios disponíveis
  const loadDomains = useCallback(async () => {
    try {
      const data = await hunterApi.getDomains();
      setDomains(data);
      setIsOffline(false);
    } catch (err) {
      console.error('Erro ao carregar domínios:', err);
      setIsOffline(true);
    }
  }, []);

  // Carrega perfil de estilo do domínio selecionado
  const loadProfile = useCallback(async () => {
    try {
      const data = await hunterApi.getProfile(currentDomain);
      setProfile(data);
      setIsOffline(false);
    } catch (err) {
      console.error('Erro ao carregar perfil:', err);
      setIsOffline(true);
    }
  }, [currentDomain]);

  // Inicialização
  useEffect(() => {
    loadDomains();
    loadWatchlist();
  }, [loadDomains, loadWatchlist]);

  // Recarrega perfil ao trocar domínio
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Salva preferências de perfil
  const saveProfile = useCallback(async (updated: StyleProfile) => {
    try {
      await hunterApi.saveProfile(updated);
      setProfile(updated);
      showToast('Preferências salvas com sucesso!');
      onProfileUpdated?.();
    } catch (e) {
      console.error('Erro ao salvar preferências:', e);
      showToast('Erro ao salvar preferências.');
    }
  }, [showToast, onProfileUpdated]);

  // Adiciona uma nova loja às lojas monitoradas do perfil
  const addStoreToProfile = useCallback(async (newStoreUrl: string) => {
    if (!profile) return;
    const currentStores = profile.targetStores || [];
    if (currentStores.includes(newStoreUrl)) return;

    const updated: StyleProfile = {
      ...profile,
      targetStores: [...currentStores, newStoreUrl]
    };
    await saveProfile(updated);
  }, [profile, saveProfile]);

  // Definição do domínio ativo
  const activeDomainDef = useMemo(() => {
    return domains[currentDomain] || {
      ...DEFAULT_DOMAIN_DEF,
      id: currentDomain
    };
  }, [domains, currentDomain]);

  return {
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
    loadProfile,
    saveProfile,
    addStoreToProfile,
    retryConnection: async () => {
      await loadDomains();
      await loadProfile();
      await loadWatchlist();
    }
  };
}
