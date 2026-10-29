'use client';

import { useState, useEffect } from 'react';
import { WatchlistItem, UserNotificationConfig } from '@/types';

interface UseWatchlistModalProps {
  isOpen: boolean;
  onRefreshWatchlist: () => void;
  onShowToast: (msg: string) => void;
}

/**
 * Hook dedicado que gerencia o estado e as chamadas de rede da Watchlist
 * e das configurações de monitoramento de preços.
 */
export function useWatchlistModal({
  isOpen,
  onRefreshWatchlist,
  onShowToast
}: UseWatchlistModalProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'alerts'>('products');
  const [url, setUrl] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isTestingAlert, setIsTestingAlert] = useState(false);
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [notifConfig, setNotifConfig] = useState<UserNotificationConfig>({
    email: '',
    phone: '',
    notifyOnPriceDrop: true,
    notifyOnTargetMet: true,
    channels: {
      email: true,
      whatsapp: true,
      telegram: false,
      discord: false
    }
  });

  useEffect(() => {
    if (!isOpen) return;
    fetch('/api/notifications/config')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.channels) {
          setNotifConfig(data);
        }
      })
      .catch((err) => console.warn('Erro ao carregar notificações:', err));
  }, [isOpen]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !url.startsWith('http')) {
      setErrorMsg('Por favor, insira uma URL válida iniciando com http:// ou https://');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: url.trim(),
          targetPrice: targetPrice ? parseFloat(targetPrice) : undefined
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao analisar e cadastrar produto.');
      }

      onShowToast(`"${data.title}" adicionado ao monitoramento.`);
      setUrl('');
      setTargetPrice('');
      onRefreshWatchlist();
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    try {
      const res = await fetch(`/api/watchlist/${id}`, { method: 'DELETE' });
      if (res.ok) {
        onShowToast(`"${title}" removido do monitoramento.`);
        onRefreshWatchlist();
      }
    } catch (err) {
      console.error('Erro ao deletar item da watchlist:', err);
    }
  };

  const handleCheckNow = async () => {
    setIsChecking(true);
    try {
      const res = await fetch('/api/watchlist/check', { method: 'POST' });
      const data = await res.json();
      onRefreshWatchlist();
      if (data.priceDropsDetected > 0) {
        onShowToast(`${data.priceDropsDetected} queda(s) de preço detectada(s). Alerta enviado.`);
      } else {
        onShowToast('Preços verificados. Nenhuma nova alteração detectada.');
      }
    } catch (err) {
      console.error('Erro ao checar watchlist:', err);
    } finally {
      setIsChecking(false);
    }
  };

  const handleSaveAlerts = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingConfig(true);
    try {
      const res = await fetch('/api/notifications/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notifConfig)
      });
      if (res.ok) {
        onShowToast('Configurações de alerta salvas com sucesso.');
      }
    } catch (err) {
      console.error('Erro ao salvar config de notificação:', err);
    } finally {
      setIsSavingConfig(false);
    }
  };

  const handleTestAlert = async () => {
    setIsTestingAlert(true);
    try {
      const res = await fetch('/api/notifications/test', { method: 'POST' });
      if (res.ok) {
        onShowToast('Alerta de teste enviado com sucesso. Verifique seus canais.');
      }
    } catch (err) {
      console.error('Erro ao disparar teste:', err);
    } finally {
      setIsTestingAlert(false);
    }
  };

  return {
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
  };
}
