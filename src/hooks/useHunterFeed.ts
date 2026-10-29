import { useState, useEffect, useCallback } from 'react';
import { DomainId, CuratedItem } from '@/types';
import { hunterApi } from '@/services/hunter-api.service';

interface UseHunterFeedOptions {
  currentDomain: DomainId;
  showToast: (msg: string) => void;
  onConnectionError?: () => void;
  onConnectionRestored?: () => void;
}

/**
 * Hook para gerenciar estado, paginação server-side, filtros atômicos e feedback do Feed.
 */
export function useHunterFeed({
  currentDomain,
  showToast,
  onConnectionError,
  onConnectionRestored
}: UseHunterFeedOptions) {
  // Itens e paginação
  const [items, setItems] = useState<CuratedItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [isClearingFeed, setIsClearingFeed] = useState(false);

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [saleOnly, setSaleOnly] = useState(false);
  const [minScore, setMinScore] = useState<number | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  // Debounce na barra de pesquisa (280ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 280);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Carrega categorias do domínio
  const loadCategories = useCallback(async () => {
    try {
      const cats = await hunterApi.getCategories(currentDomain);
      if (Array.isArray(cats)) {
        setAvailableCategories(cats);
      }
    } catch (err) {
      console.warn('Erro ao carregar categorias:', err);
    }
  }, [currentDomain]);

  // Busca itens paginados no backend
  const fetchPage = useCallback(
    async (targetPage: number) => {
      setIsLoading(true);
      try {
        const data = await hunterApi.getItems({
          domain: currentDomain,
          page: targetPage,
          limit: 20,
          minScore,
          saleOnly,
          category: selectedCategory,
          search: debouncedSearch
        });

        setItems(data.items || []);
        setPage(data.page || targetPage);
        setTotalItems(data.total || 0);
        setTotalPages(data.totalPages || Math.ceil((data.total || 0) / 20) || 1);
        onConnectionRestored?.();
      } catch (err) {
        console.error('Erro ao carregar itens:', err);
        onConnectionError?.();
      } finally {
        setIsLoading(false);
      }
    },
    [currentDomain, minScore, saleOnly, selectedCategory, debouncedSearch, onConnectionError, onConnectionRestored]
  );

  // Recarrega categorias ao mudar de domínio
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Busca página 1 sempre que os filtros ou domínio mudam
  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  // Navegação entre páginas
  const goToPage = useCallback(
    (newPage: number) => {
      if (newPage < 1 || newPage > totalPages || newPage === page) return;
      fetchPage(newPage);
      document.getElementById('curated-items-grid')?.scrollIntoView({ behavior: 'smooth' });
    },
    [fetchPage, page, totalPages]
  );

  // Feedback otimista
  const handleFeedback = useCallback(
    async (id: string, feedback: 'liked' | 'disliked' | null) => {
      try {
        await hunterApi.sendFeedback(id, feedback);
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
      } catch (e) {
        console.error('Erro ao registrar feedback:', e);
        showToast('Erro ao registrar feedback.');
      }
    },
    [showToast]
  );

  // Limpa o feed mantendo favoritos
  const clearFeed = useCallback(async () => {
    if (isClearingFeed) return;
    setIsClearingFeed(true);
    try {
      const data = await hunterApi.clearFeed(currentDomain);
      const cleanMessage = data.message
        .replace(/[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
        .trim();
      showToast(cleanMessage);
      loadCategories();
      fetchPage(1);
    } catch (err) {
      console.error('Erro ao limpar feed:', err);
      showToast('Erro ao limpar o feed.');
    } finally {
      setIsClearingFeed(false);
    }
  }, [currentDomain, isClearingFeed, loadCategories, fetchPage, showToast]);

  return {
    items,
    page,
    totalPages,
    totalItems,
    isLoading,
    availableCategories,
    searchTerm,
    setSearchTerm,
    saleOnly,
    setSaleOnly,
    toggleSaleOnly: () => setSaleOnly((prev) => !prev),
    minScore,
    setMinScore,
    selectedCategory,
    setSelectedCategory,
    isClearingFeed,
    goToPage,
    handleFeedback,
    clearFeed,
    refetch: () => fetchPage(page),
    resetToFirstPage: () => fetchPage(1),
    loadCategories
  };
}
