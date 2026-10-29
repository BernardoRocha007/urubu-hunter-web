'use client';

import { useState, useEffect, useMemo } from 'react';
import { StyleProfile, DomainDefinition } from '@/types';

interface UseStyleProfileFormProps {
  profile: StyleProfile;
  domainDef: DomainDefinition;
  onSave: (updated: StyleProfile) => void;
  onClose: () => void;
  isOpen: boolean;
}

/**
 * Hook dedicado que isola toda a regra de negócio, estados e manipulação
 * do formulário de Perfil de Estilo e Garimpo.
 */
export function useStyleProfileForm({
  profile,
  domainDef,
  onSave,
  onClose,
  isOpen
}: UseStyleProfileFormProps) {
  const [formData, setFormData] = useState<StyleProfile>(() => ({
    ...profile,
    aestheticKeywords: profile?.aestheticKeywords ?? [],
    preferredSizes: profile?.preferredSizes ?? [],
    forbiddenTerms: profile?.forbiddenTerms ?? [],
    targetStores: profile?.targetStores ?? []
  }));

  const [newKeyword, setNewKeyword] = useState('');
  const [newStore, setNewStore] = useState('');
  const [newForbidden, setNewForbidden] = useState('');

  // Sincroniza formulário sempre que o perfil mudar ou o modal for aberto
  useEffect(() => {
    if (profile && isOpen) {
      setFormData({
        ...profile,
        aestheticKeywords: profile.aestheticKeywords ?? [],
        preferredSizes: profile.preferredSizes ?? [],
        forbiddenTerms: profile.forbiddenTerms ?? [],
        targetStores: profile.targetStores ?? []
      });
    }
  }, [profile, isOpen]);

  // Lista de tamanhos únicos
  const sizeOptions = useMemo(
    () => Array.from(new Set(domainDef?.sizeOptions || [])),
    [domainDef?.sizeOptions]
  );

  const handleAddKeyword = () => {
    const kw = newKeyword.trim();
    if (!kw) return;
    const current = formData.aestheticKeywords || [];
    if (!current.includes(kw)) {
      setFormData((prev) => ({
        ...prev,
        aestheticKeywords: [...(prev.aestheticKeywords || []), kw]
      }));
    }
    setNewKeyword('');
  };

  const handleRemoveKeyword = (kw: string) => {
    setFormData((prev) => ({
      ...prev,
      aestheticKeywords: (prev.aestheticKeywords || []).filter((k) => k !== kw)
    }));
  };

  const handleToggleSize = (size: string) => {
    const current = formData.preferredSizes || [];
    const exists = current.includes(size);
    setFormData((prev) => ({
      ...prev,
      preferredSizes: exists
        ? current.filter((s) => s !== size)
        : [...current, size]
    }));
  };

  const handleAddForbidden = () => {
    const term = newForbidden.trim();
    if (!term) return;
    const current = formData.forbiddenTerms || [];
    if (!current.includes(term)) {
      setFormData((prev) => ({
        ...prev,
        forbiddenTerms: [...(prev.forbiddenTerms || []), term]
      }));
    }
    setNewForbidden('');
  };

  const handleRemoveForbidden = (term: string) => {
    setFormData((prev) => ({
      ...prev,
      forbiddenTerms: (prev.forbiddenTerms || []).filter((t) => t !== term)
    }));
  };

  const handleAddStore = () => {
    let url = newStore.trim();
    if (!url) return;
    if (!url.startsWith('http')) {
      url = 'https://' + url;
    }
    const current = formData.targetStores || [];
    if (!current.includes(url)) {
      setFormData((prev) => ({
        ...prev,
        targetStores: [...(prev.targetStores || []), url]
      }));
    }
    setNewStore('');
  };

  const handleRemoveStore = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      targetStores: (prev.targetStores || []).filter((s) => s !== url)
    }));
  };

  const setMaxPrice = (maxPrice: number) => {
    setFormData((prev) => ({ ...prev, maxPrice }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return {
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
  };
}
