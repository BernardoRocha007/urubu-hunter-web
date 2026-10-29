'use client';

import { useState, useEffect, useCallback } from 'react';
import { Usuario, LoginUsuarioRequest, RegistroUsuarioRequest } from '@/types/auth';
import { hunterApi } from '@/services/hunter-api.service';

/**
 * Hook para gerenciar estado de autenticação, sessão de usuário e tokens JWT.
 */
export function useAuth() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [estaCarregando, setEstaCarregando] = useState<boolean>(true);

  // Carrega usuário ao inicializar se houver token salvo
  const carregarSessao = useCallback(async () => {
    const savedToken = hunterApi.getToken();
    if (!savedToken) {
      setUsuario(null);
      setToken(null);
      setEstaCarregando(false);
      return;
    }

    setToken(savedToken);
    try {
      const dados = await hunterApi.getMe();
      setUsuario(dados);
    } catch (err) {
      console.warn('Sessão expirada ou inválida:', err);
      hunterApi.logout();
      setUsuario(null);
      setToken(null);
    } finally {
      setEstaCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarSessao();
  }, [carregarSessao]);

  const login = useCallback(async (dados: LoginUsuarioRequest) => {
    setEstaCarregando(true);
    try {
      const res = await hunterApi.login(dados);
      setToken(res.token);
      setUsuario(res.usuario);
      return res;
    } finally {
      setEstaCarregando(false);
    }
  }, []);

  const cadastro = useCallback(async (dados: RegistroUsuarioRequest) => {
    setEstaCarregando(true);
    try {
      const res = await hunterApi.register(dados);
      setToken(res.token);
      setUsuario(res.usuario);
      return res;
    } finally {
      setEstaCarregando(false);
    }
  }, []);

  const logout = useCallback(() => {
    hunterApi.logout();
    setUsuario(null);
    setToken(null);
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }, []);

  return {
    usuario,
    token,
    estaAutenticado: !!usuario,
    estaCarregando,
    login,
    cadastro,
    logout,
    recarregarSessao: carregarSessao
  };
}
