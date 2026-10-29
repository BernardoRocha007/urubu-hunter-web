import { useState, useCallback, useRef, useEffect } from 'react';
import { DomainId, HuntStatus } from '@/types';
import { hunterApi } from '@/services/hunter-api.service';

interface UseHuntOptions {
  currentDomain: DomainId;
  showToast: (msg: string) => void;
  onHuntComplete: () => void;
}

/**
 * Hook para orquestrar disparos de garimpo (geral, customizado e por URL),
 * gerenciando o polling de status em background e o cancelamento seguro.
 */
export function useHunt({ currentDomain, showToast, onHuntComplete }: UseHuntOptions) {
  const [huntStatus, setHuntStatus] = useState<HuntStatus>({
    isRunning: false,
    domain: null,
    lastRun: null,
    itemsFound: 0,
    itemsCurated: 0
  });

  const [isCustomHuntOpen, setIsCustomHuntOpen] = useState(false);
  const [quickUrlInput, setQuickUrlInput] = useState('');
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Limpa o polling ao desmontar o componente
  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  // Inicia o polling com intervalo seguro
  const startPolling = useCallback(() => {
    stopPolling();

    pollingRef.current = setInterval(async () => {
      try {
        const status = await hunterApi.getHuntStatus();
        setHuntStatus(status);

        if (!status.isRunning) {
          stopPolling();
          onHuntComplete();
          showToast(`Garimpo concluído: ${status.itemsCurated} peças avaliadas.`);
        }
      } catch {
        stopPolling();
        setHuntStatus((prev) => ({ ...prev, isRunning: false }));
      }
    }, 1500);
  }, [stopPolling, onHuntComplete, showToast]);

  // Disparo de garimpo geral
  const triggerHunt = useCallback(async () => {
    setHuntStatus((prev) => ({ ...prev, isRunning: true }));
    try {
      await hunterApi.triggerHunt(currentDomain);
      showToast('Garimpo iniciado. Vasculhando lojas e avaliando peças...');
      startPolling();
    } catch (err) {
      console.error('Erro ao iniciar garimpo:', err);
      setHuntStatus((prev) => ({ ...prev, isRunning: false }));
      showToast('Erro ao iniciar garimpo.');
    }
  }, [currentDomain, showToast, startPolling]);

  // Disparo de garimpo personalizado para lojas selecionadas
  const triggerCustomHunt = useCallback(
    async (selectedStores: string[]) => {
      setIsCustomHuntOpen(false);
      setHuntStatus((prev) => ({ ...prev, isRunning: true }));
      try {
        await hunterApi.triggerHunt(currentDomain, selectedStores);
        showToast(`Garimpando ${selectedStores.length} lojas selecionadas...`);
        startPolling();
      } catch (err) {
        console.error('Erro ao iniciar garimpo personalizado:', err);
        setHuntStatus((prev) => ({ ...prev, isRunning: false }));
        showToast('Erro ao iniciar garimpo personalizado.');
      }
    },
    [currentDomain, showToast, startPolling]
  );

  // Disparo de garimpo por URL direta informada
  const triggerQuickUrlHunt = useCallback(async () => {
    let raw = quickUrlInput.trim();
    if (!raw || huntStatus.isRunning) return;

    if (!raw.startsWith('http://') && !raw.startsWith('https://')) {
      raw = 'https://' + raw;
    }

    setQuickUrlInput('');
    await triggerCustomHunt([raw]);
  }, [quickUrlInput, huntStatus.isRunning, triggerCustomHunt]);

  return {
    huntStatus,
    isCustomHuntOpen,
    setIsCustomHuntOpen,
    quickUrlInput,
    setQuickUrlInput,
    triggerHunt,
    triggerCustomHunt,
    triggerQuickUrlHunt
  };
}
