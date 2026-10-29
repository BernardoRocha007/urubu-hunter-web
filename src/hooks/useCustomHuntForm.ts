'use client';

import { useState, useEffect } from 'react';

interface UseCustomHuntFormParams {
  isOpen: boolean;
  targetStores: string[];
  isHunting: boolean;
  onTriggerCustomHunt: (selectedStores: string[]) => void;
  onAddNewStore?: (newStoreUrl: string) => void;
}

/**
 * Hook de domínio que encapsula toda a lógica de seleção de lojas e adição rápida
 * para o Garimpo Personalizado.
 */
export function useCustomHuntForm({
  isOpen,
  targetStores,
  isHunting,
  onTriggerCustomHunt,
  onAddNewStore
}: UseCustomHuntFormParams) {
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [newStoreInput, setNewStoreInput] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedStores([...targetStores]);
      setNewStoreInput('');
      setInputError(null);
    }
  }, [isOpen, targetStores]);

  const toggleStore = (storeUrl: string) => {
    setSelectedStores((prev) =>
      prev.includes(storeUrl) ? prev.filter((url) => url !== storeUrl) : [...prev, storeUrl]
    );
  };

  const handleSelectAll = () => {
    setSelectedStores([...targetStores]);
  };

  const handleDeselectAll = () => {
    setSelectedStores([]);
  };

  const handleAddStore = () => {
    let trimmed = newStoreInput.trim();
    if (!trimmed) return;

    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      trimmed = `https://${trimmed}`;
    }

    try {
      const parsed = new URL(trimmed);
      trimmed =
        parsed.pathname === '/' || !parsed.pathname
          ? parsed.origin
          : `${parsed.origin}${parsed.pathname.replace(/\/+$/, '')}`;
    } catch {
      trimmed = trimmed.split('?')[0].replace(/\/+$/, '');
    }

    if (targetStores.includes(trimmed) || selectedStores.includes(trimmed)) {
      setInputError('Esta loja já está na sua lista.');
      return;
    }

    setInputError(null);
    if (onAddNewStore) {
      onAddNewStore(trimmed);
    }
    setSelectedStores((prev) => [...prev, trimmed]);
    setNewStoreInput('');
  };

  const handleStartHunt = () => {
    if (selectedStores.length === 0 || isHunting) return;
    onTriggerCustomHunt(selectedStores);
  };

  const formatStoreName = (url: string) => {
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.replace(/^www\./, '');
      const parts = host.split('.');
      const brand = parts[0];
      return brand.charAt(0).toUpperCase() + brand.slice(1);
    } catch {
      return url;
    }
  };

  return {
    selectedStores,
    newStoreInput,
    setNewStoreInput,
    inputError,
    setInputError,
    toggleStore,
    handleSelectAll,
    handleDeselectAll,
    handleAddStore,
    handleStartHunt,
    formatStoreName
  };
}
