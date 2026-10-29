'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Users,
  UserPlus,
  Shield,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Mail,
  Lock,
  User,
  Phone,
  RefreshCw,
  Trash2,
  UserCheck,
  UserX,
  Clock,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { hunterApi } from '@/services/hunter-api.service';
import { Usuario, CriarUsuarioAdminRequest } from '@/types/auth';

export default function AdminUsuariosPage() {
  const router = useRouter();
  const { usuario, estaAutenticado, estaCarregando: authCarregando } = useAuth();

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<'todos' | 'pendentes' | 'ativos'>('todos');

  // Formulário de Criação
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [senha, setSenha] = useState('');
  const [role, setRole] = useState<'Usuario' | 'Admin'>('Usuario');
  const [politicas, setPoliticas] = useState('');

  const isAdmin = usuario?.role === 'Admin' || (usuario?.politicas && usuario.politicas.includes('GerenciamentoUsuarios'));

  const carregarUsuarios = useCallback(async () => {
    try {
      setCarregando(true);
      setErro(null);
      const lista = await hunterApi.listarUsuariosAdmin();
      setUsuarios(lista);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao carregar lista de usuários.';
      setErro(msg);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    if (!authCarregando) {
      if (!estaAutenticado) {
        router.replace('/login');
      } else if (isAdmin) {
        carregarUsuarios();
      }
    }
  }, [authCarregando, estaAutenticado, isAdmin, router, carregarUsuarios]);

  const handleCriarUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setSucesso(null);
    setEnviando(true);

    try {
      if (!nome.trim() || !email.trim() || !senha) {
        throw new Error('Nome, e-mail e senha são obrigatórios.');
      }
      if (senha.length < 6) {
        throw new Error('A senha deve ter no mínimo 6 caracteres.');
      }

      const dados: CriarUsuarioAdminRequest = {
        nome: nome.trim(),
        email: email.trim(),
        whatsapp: whatsapp.trim() || undefined,
        senha,
        role,
        politicas: role === 'Admin' && !politicas ? 'GerenciamentoUsuarios' : politicas.trim()
      };

      const novo = await hunterApi.criarUsuarioAdmin(dados);
      setSucesso(`Usuário "${novo.nome}" cadastrado com sucesso! Status inicial: PENDENTE (ainda sem permissão para entrar).`);
      
      // Limpa formulário
      setNome('');
      setEmail('');
      setWhatsapp('');
      setSenha('');
      setRole('Usuario');
      setPoliticas('');

      await carregarUsuarios();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao criar usuário.';
      setErro(msg);
    } finally {
      setEnviando(false);
    }
  };

  const handleAlternarStatus = async (userTarget: Usuario, novoStatus: boolean) => {
    setErro(null);
    setSucesso(null);

    try {
      await hunterApi.alternarStatusUsuarioAdmin(userTarget.id, novoStatus);
      const acao = novoStatus ? 'liberado para entrar no sistema' : 'bloqueado do sistema';
      setSucesso(`Status atualizado! O usuário ${userTarget.nome} foi ${acao}.`);
      await carregarUsuarios();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao alterar status do usuário.';
      setErro(msg);
    }
  };

  const handleExcluirUsuario = async (userTarget: Usuario) => {
    if (!confirm(`Deseja realmente excluir permanentemente o usuário "${userTarget.nome}" (${userTarget.email})?`)) {
      return;
    }

    setErro(null);
    setSucesso(null);

    try {
      await hunterApi.deletarUsuarioAdmin(userTarget.id);
      setSucesso(`Usuário "${userTarget.nome}" foi removido com sucesso.`);
      await carregarUsuarios();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao excluir usuário.';
      setErro(msg);
    }
  };

  if (authCarregando) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-deep)' }}>
        <RefreshCw size={24} className="animate-spin" color="var(--accent-primary)" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'var(--bg-deep)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}
      >
        <div
          style={{
            maxWidth: '480px',
            background: 'rgba(20, 24, 33, 0.9)',
            border: '1px solid rgba(255, 51, 102, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '32px',
            textAlign: 'center'
          }}
        >
          <ShieldAlert size={48} color="#FF4D6D" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Acesso Restrito
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: 1.5 }}>
            Você não possui a política <strong>GerenciamentoUsuarios</strong> necessária para acessar este painel. Solicite liberação ao administrador principal.
          </p>
          <Link href="/" className="btn btn-secondary">
            Voltar para o Início
          </Link>
        </div>
      </div>
    );
  }

  const usuariosFiltrados = usuarios.filter((u) => {
    if (filtro === 'pendentes') return !u.ativo;
    if (filtro === 'ativos') return u.ativo;
    return true;
  });

  const totalUsuarios = usuarios.length;
  const totalAtivos = usuarios.filter((u) => u.ativo).length;
  const totalPendentes = usuarios.filter((u) => !u.ativo).length;

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at 50% 0%, hsl(224, 71%, 10%) 0%, var(--bg-deep) 70%)', padding: '32px 16px 64px' }}>
      <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Topo / Navegação */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
          <Link
            href="/"
            className="btn btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}
          >
            <ArrowLeft size={15} />
            <span>Voltar ao Garimpo</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '100px',
                background: 'rgba(255, 184, 0, 0.12)',
                border: '1px solid rgba(255, 184, 0, 0.35)',
                color: '#FFB800',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.03em'
              }}
            >
              <Shield size={13} color="#FFB800" />
              Política Ativa: GerenciamentoUsuarios
            </span>
          </div>
        </div>

        {/* Título Principal */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-sm)',
                background: 'linear-gradient(135deg, rgba(0, 245, 160, 0.2), rgba(0, 217, 245, 0.1))',
                border: '1px solid var(--border-highlight)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Users size={22} color="var(--accent-primary)" />
            </div>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Gestão de Usuários & Acessos
              </h1>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                Cadastre novos usuários no sistema e controle quem tem permissão para logar e entrar.
              </p>
            </div>
          </div>
        </div>

        {/* Cards de Métricas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <div
            style={{
              background: 'rgba(20, 24, 33, 0.7)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '18px 20px'
            }}
          >
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Total de Usuários</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)' }}>{totalUsuarios}</div>
          </div>

          <div
            style={{
              background: 'rgba(20, 24, 33, 0.7)',
              border: '1px solid rgba(0, 245, 160, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '18px 20px'
            }}
          >
            <div style={{ fontSize: '12px', color: '#00F5A0', marginBottom: '4px' }}>Ativos no Sistema (Podem Logar)</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#00F5A0' }}>{totalAtivos}</div>
          </div>

          <div
            style={{
              background: 'rgba(20, 24, 33, 0.7)',
              border: '1px solid rgba(255, 184, 0, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '18px 20px'
            }}
          >
            <div style={{ fontSize: '12px', color: '#FFB800', marginBottom: '4px' }}>Pendentes de Liberação</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#FFB800' }}>{totalPendentes}</div>
          </div>
        </div>

        {/* Alertas */}
        {erro && (
          <div
            style={{
              padding: '12px 16px',
              background: 'rgba(255, 51, 102, 0.12)',
              border: '1px solid rgba(255, 51, 102, 0.35)',
              borderRadius: 'var(--radius-sm)',
              color: '#FF4D6D',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '24px'
            }}
          >
            <AlertCircle size={18} />
            <span>{erro}</span>
          </div>
        )}

        {sucesso && (
          <div
            style={{
              padding: '12px 16px',
              background: 'rgba(0, 245, 160, 0.12)',
              border: '1px solid rgba(0, 245, 160, 0.35)',
              borderRadius: 'var(--radius-sm)',
              color: '#00F5A0',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '24px'
            }}
          >
            <CheckCircle2 size={18} />
            <span>{sucesso}</span>
          </div>
        )}

        {/* Layout de 2 Colunas: Formulário à Esquerda / Lista à Direita */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 380px) 1fr', gap: '28px', alignItems: 'start' }}>
          {/* Card de Criação */}
          <div
            style={{
              background: 'rgba(20, 24, 33, 0.85)',
              backdropFilter: 'blur(16px)',
              border: '1px solid var(--border-highlight)',
              borderRadius: 'var(--radius-md)',
              padding: '24px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <UserPlus size={18} color="var(--accent-primary)" />
              <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Criar Novo Usuário
              </h2>
            </div>

            {/* Banner de Regra de Negócio */}
            <div
              style={{
                padding: '10px 12px',
                background: 'rgba(255, 184, 0, 0.08)',
                border: '1px solid rgba(255, 184, 0, 0.25)',
                borderRadius: 'var(--radius-sm)',
                color: '#FFB800',
                fontSize: '12px',
                lineHeight: 1.45,
                marginBottom: '18px',
                display: 'flex',
                gap: '8px'
              }}
            >
              <Clock size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>
                Ao criar, o usuário <strong>NÃO</strong> entra no sistema de imediato. Ele nascerá como <strong>PENDENTE</strong> e você poderá adicioná-lo ao sistema na lista ao lado quando desejar liberar o login.
              </span>
            </div>

            <form onSubmit={handleCriarUsuario} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={13} color="var(--accent-primary)" />
                  <span>Nome Completo *</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: João Silva"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={13} color="var(--accent-primary)" />
                  <span>E-mail de Acesso *</span>
                </label>
                <input
                  type="email"
                  placeholder="joao@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={13} color="#00F5A0" />
                  <span>WhatsApp com DDD</span>
                </label>
                <input
                  type="tel"
                  placeholder="11999998888"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Lock size={13} color="var(--accent-primary)" />
                  <span>Senha Inicial *</span>
                </label>
                <input
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label className="form-label">Papel (Role)</label>
                  <select
                    value={role}
                    onChange={(e) => {
                      const r = e.target.value as 'Usuario' | 'Admin';
                      setRole(r);
                      if (r === 'Admin') setPoliticas('GerenciamentoUsuarios');
                    }}
                    className="form-input"
                  >
                    <option value="Usuario">Usuário Padrão</option>
                    <option value="Admin">Administrador</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Políticas</label>
                  <input
                    type="text"
                    placeholder="GerenciamentoUsuarios"
                    value={politicas}
                    onChange={(e) => setPoliticas(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={enviando}
                style={{
                  marginTop: '8px',
                  height: '42px',
                  fontWeight: 700,
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {enviando ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>CRIANDO...</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={15} />
                    <span>CRIAR USUÁRIO (PENDENTE)</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Lista de Usuários */}
          <div
            style={{
              background: 'rgba(20, 24, 33, 0.85)',
              backdropFilter: 'blur(16px)',
              border: '1px solid var(--border-highlight)',
              borderRadius: 'var(--radius-md)',
              padding: '24px'
            }}
          >
            {/* Header da Lista e Filtros */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 4px', color: 'var(--text-primary)' }}>
                  Usuários Registrados ({usuariosFiltrados.length})
                </h2>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Gerencie a liberação de acesso ao sistema
                </span>
              </div>

              {/* Botões de Filtro */}
              <div style={{ display: 'flex', gap: '6px', background: 'var(--bg-deep)', padding: '3px', borderRadius: 'var(--radius-sm)' }}>
                <button
                  type="button"
                  onClick={() => setFiltro('todos')}
                  style={{
                    padding: '5px 10px',
                    fontSize: '11px',
                    fontWeight: 600,
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    cursor: 'pointer',
                    background: filtro === 'todos' ? 'var(--accent-primary)' : 'transparent',
                    color: filtro === 'todos' ? '#000000' : 'var(--text-muted)'
                  }}
                >
                  Todos ({totalUsuarios})
                </button>
                <button
                  type="button"
                  onClick={() => setFiltro('pendentes')}
                  style={{
                    padding: '5px 10px',
                    fontSize: '11px',
                    fontWeight: 600,
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    cursor: 'pointer',
                    background: filtro === 'pendentes' ? '#FFB800' : 'transparent',
                    color: filtro === 'pendentes' ? '#000000' : 'var(--text-muted)'
                  }}
                >
                  Pendentes ({totalPendentes})
                </button>
                <button
                  type="button"
                  onClick={() => setFiltro('ativos')}
                  style={{
                    padding: '5px 10px',
                    fontSize: '11px',
                    fontWeight: 600,
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    cursor: 'pointer',
                    background: filtro === 'ativos' ? '#00F5A0' : 'transparent',
                    color: filtro === 'ativos' ? '#000000' : 'var(--text-muted)'
                  }}
                >
                  Ativos ({totalAtivos})
                </button>
              </div>
            </div>

            {/* Listagem */}
            {carregando ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 8px' }} color="var(--accent-primary)" />
                <div>Carregando usuários...</div>
              </div>
            ) : usuariosFiltrados.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                Nenhum usuário encontrado para o filtro selecionado.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {usuariosFiltrados.map((u) => {
                  const ehAdmin = u.role === 'Admin';
                  const isCurrentUser = u.id === usuario?.id;

                  return (
                    <div
                      key={u.id}
                      style={{
                        padding: '16px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: u.ativo
                          ? '1px solid rgba(0, 245, 160, 0.25)'
                          : '1px solid rgba(255, 184, 0, 0.35)',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '16px',
                        flexWrap: 'wrap',
                        transition: 'all 150ms ease'
                      }}
                    >
                      {/* Avatar e Informações */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '220px' }}>
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            background: u.ativo ? 'rgba(0, 245, 160, 0.15)' : 'rgba(255, 184, 0, 0.15)',
                            border: u.ativo ? '1px solid #00F5A0' : '1px solid #FFB800',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                            fontWeight: 800,
                            color: u.ativo ? '#00F5A0' : '#FFB800'
                          }}
                        >
                          {u.nome.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                              {u.nome}
                            </span>
                            {isCurrentUser && (
                              <span style={{ fontSize: '10px', padding: '1px 6px', background: 'var(--bg-deep)', borderRadius: '4px', color: 'var(--accent-primary)' }}>
                                VOCÊ
                              </span>
                            )}
                            <span
                              style={{
                                fontSize: '11px',
                                fontWeight: 700,
                                padding: '2px 6px',
                                borderRadius: '4px',
                                background: ehAdmin ? 'rgba(255, 184, 0, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                                color: ehAdmin ? '#FFB800' : 'var(--text-muted)'
                              }}
                            >
                              {u.role.toUpperCase()}
                            </span>
                          </div>

                          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {u.email} {u.whatsapp && `• ${u.whatsapp}`}
                          </div>

                          {u.politicas && (
                            <div style={{ fontSize: '11px', color: 'var(--accent-primary)', marginTop: '2px' }}>
                              Políticas: {u.politicas}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Status & Botões de Ação */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {/* Badge de Status */}
                        {u.ativo ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '5px 10px',
                              borderRadius: '100px',
                              background: 'rgba(0, 245, 160, 0.12)',
                              border: '1px solid rgba(0, 245, 160, 0.35)',
                              color: '#00F5A0',
                              fontSize: '12px',
                              fontWeight: 700
                            }}
                          >
                            <UserCheck size={14} />
                            ATIVO NO SISTEMA
                          </span>
                        ) : (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '5px 10px',
                              borderRadius: '100px',
                              background: 'rgba(255, 184, 0, 0.12)',
                              border: '1px solid rgba(255, 184, 0, 0.35)',
                              color: '#FFB800',
                              fontSize: '12px',
                              fontWeight: 700
                            }}
                          >
                            <Clock size={14} />
                            PENDENTE (SEM ACESSO)
                          </span>
                        )}

                        {/* Botão de Alternar Acesso */}
                        {!u.ativo ? (
                          <button
                            type="button"
                            onClick={() => handleAlternarStatus(u, true)}
                            className="btn btn-primary"
                            style={{
                              padding: '6px 12px',
                              fontSize: '12px',
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              background: 'linear-gradient(135deg, #00F5A0, #00D9F5)',
                              color: '#000000'
                            }}
                            title="Liberar entrada do usuário no sistema"
                          >
                            <CheckCircle2 size={14} />
                            <span>Adicionar ao Sistema</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleAlternarStatus(u, false)}
                            disabled={isCurrentUser}
                            className="btn btn-secondary"
                            style={{
                              padding: '6px 12px',
                              fontSize: '12px',
                              fontWeight: 600,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              borderColor: 'rgba(255, 51, 102, 0.3)',
                              color: '#FF4D6D'
                            }}
                            title={isCurrentUser ? 'Você não pode desativar seu próprio acesso' : 'Suspender acesso deste usuário'}
                          >
                            <UserX size={14} />
                            <span>Desativar Acesso</span>
                          </button>
                        )}

                        {/* Botão de Excluir */}
                        {!isCurrentUser && (
                          <button
                            type="button"
                            onClick={() => handleExcluirUsuario(u)}
                            className="icon-btn"
                            title="Excluir Usuário"
                            style={{
                              color: 'var(--text-muted)',
                              padding: '6px',
                              cursor: 'pointer'
                            }}
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
