'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Lock,
  User,
  Phone,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

// Flag de controle: cadastro público desativado (criação de contas restrita a Administradores)
const CADASTRO_HABILITADO = false;

export default function LoginPage() {
  const router = useRouter();
  const { login, cadastro, estaAutenticado, estaCarregando: authCarregando } = useAuth();

  const [abaAtiva, setAbaAtiva] = useState<'login' | 'cadastro'>('login');
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  // Redireciona para a raiz caso já esteja autenticado
  useEffect(() => {
    if (!authCarregando && estaAutenticado) {
      router.replace('/');
    }
  }, [authCarregando, estaAutenticado, router]);

  // Estados de formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const handleSubmissao = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setSucesso(null);
    setCarregando(true);

    try {
      if (abaAtiva === 'login') {
        if (!email.trim() || !senha) {
          throw new Error('Preencha seu e-mail e senha.');
        }
        await login({ email: email.trim(), senha });
        setSucesso('Login efetuado com sucesso! Redirecionando...');
        setTimeout(() => router.replace('/'), 600);
      } else {
        if (!nome.trim() || !email.trim() || !senha) {
          throw new Error('Nome, e-mail e senha são obrigatórios.');
        }
        if (senha.length < 6) {
          throw new Error('A senha deve conter no mínimo 6 caracteres.');
        }
        if (senha !== confirmarSenha) {
          throw new Error('As senhas não coincidem.');
        }
        await cadastro({
          nome: nome.trim(),
          email: email.trim(),
          whatsapp: whatsapp.trim(),
          senha
        });
        setSucesso('Conta criada com sucesso! Redirecionando...');
        setTimeout(() => router.replace('/'), 600);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha na autenticação.';
      setErro(msg);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 50% 0%, hsl(224, 71%, 10%) 0%, var(--bg-deep) 70%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        position: 'relative'
      }}
    >
      {/* Card Central de Autenticação */}
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'rgba(20, 24, 33, 0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--border-highlight)',
          borderRadius: 'var(--radius-md)',
          padding: '32px 28px',
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.7)'
        }}
        id="auth-card"
      >
        {/* Cabeçalho do Card */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              display: 'inline-flex',
              padding: '4px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.02))',
              border: '1.5px solid var(--border-highlight)',
              marginBottom: '14px'
            }}
          >
            <Image
              src="/urubu-icon.png"
              alt="Urubu Hunter"
              width={64}
              height={64}
              priority
              style={{ borderRadius: '50%', objectFit: 'cover', display: 'block' }}
            />
          </div>
          <h2
            style={{
              fontSize: '20px',
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: 'var(--text-primary)',
              margin: '0 0 6px'
            }}
          >
            Urubu Hunter
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
            {abaAtiva === 'login'
              ? 'Acesse seu perfil de estilo e alertas de preço'
              : 'Cadastre-se para receber promoções no WhatsApp e E-mail'}
          </p>
        </div>

        {/* Abas Alternadoras - Se CADASTRO_HABILITADO for falso, oculta a opção de criar conta */}
        {CADASTRO_HABILITADO ? (
          <div
            style={{
              display: 'flex',
              background: 'var(--bg-deep)',
              padding: '4px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '20px'
            }}
            id="auth-tabs"
          >
            <button
              type="button"
              onClick={() => {
                setAbaAtiva('login');
                setErro(null);
              }}
              style={{
                flex: 1,
                padding: '8px 12px',
                fontSize: '13px',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                background: abaAtiva === 'login' ? 'var(--accent-primary)' : 'transparent',
                color: abaAtiva === 'login' ? '#000000' : 'var(--text-muted)',
                transition: 'all 150ms ease'
              }}
              id="tab-btn-login"
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => {
                setAbaAtiva('cadastro');
                setErro(null);
              }}
              style={{
                flex: 1,
                padding: '8px 12px',
                fontSize: '13px',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                background: abaAtiva === 'cadastro' ? 'var(--accent-primary)' : 'transparent',
                color: abaAtiva === 'cadastro' ? '#000000' : 'var(--text-muted)',
                transition: 'all 150ms ease'
              }}
              id="tab-btn-cadastro"
            >
              Criar Conta
            </button>
          </div>
        ) : (
          <div
            style={{
              padding: '6px 12px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '20px',
              textAlign: 'center',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--text-muted)',
              letterSpacing: '0.04em'
            }}
          >
            ACESSO EXCLUSIVO AO SISTEMA
          </div>
        )}

        {/* Mensagem de Erro ou Pendência de Liberação */}
        {erro && (
          erro.includes('pendente de liberação') ? (
            <div
              style={{
                padding: '12px 14px',
                background: 'rgba(255, 184, 0, 0.12)',
                border: '1px solid rgba(255, 184, 0, 0.4)',
                borderRadius: 'var(--radius-sm)',
                color: '#FFB800',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                marginBottom: '16px',
                lineHeight: 1.5
              }}
              id="auth-pending-message"
            >
              <Clock size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ display: 'block', marginBottom: '2px' }}>Aprovação Pendente</strong>
                <span>{erro}</span>
              </div>
            </div>
          ) : (
            <div
              style={{
                padding: '10px 14px',
                background: 'rgba(255, 51, 102, 0.12)',
                border: '1px solid rgba(255, 51, 102, 0.35)',
                borderRadius: 'var(--radius-sm)',
                color: '#FF4D6D',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px'
              }}
              id="auth-error-message"
            >
              <AlertCircle size={16} />
              <span>{erro}</span>
            </div>
          )
        )}

        {/* Mensagem de Sucesso */}
        {sucesso && (
          <div
            style={{
              padding: '10px 14px',
              background: 'rgba(0, 245, 160, 0.12)',
              border: '1px solid rgba(0, 245, 160, 0.35)',
              borderRadius: 'var(--radius-sm)',
              color: '#00F5A0',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px'
            }}
            id="auth-success-message"
          >
            <CheckCircle2 size={16} />
            <span>{sucesso}</span>
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmissao} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Nome (Apenas no Cadastro) */}
          {abaAtiva === 'cadastro' && (
            <div>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={13} color="var(--accent-primary)" />
                <span>Nome Completo</span>
              </label>
              <input
                type="text"
                placeholder="Ex: Bernardo Rocha"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="form-input"
                required={abaAtiva === 'cadastro'}
                id="input-nome"
              />
            </div>
          )}

          {/* E-mail */}
          <div>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={13} color="var(--accent-primary)" />
              <span>Seu E-mail</span>
            </label>
            <input
              type="email"
              placeholder="Ex: seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
              id="input-email"
            />
          </div>

          {/* WhatsApp / Celular (Apenas no Cadastro) */}
          {abaAtiva === 'cadastro' && (
            <div>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={13} color="#00F5A0" />
                <span>WhatsApp com DDD (Para alertas de promoção)</span>
              </label>
              <input
                type="tel"
                placeholder="Ex: 11999998888 ou (11) 99999-8888"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="form-input"
                id="input-whatsapp"
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                O robô avisa quando uma peça que você curtiu baixar de preço.
              </span>
            </div>
          )}

          {/* Senha */}
          <div>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={13} color="var(--accent-primary)" />
              <span>Senha</span>
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="form-input"
              required
              id="input-senha"
            />
          </div>

          {/* Confirmar Senha (Apenas no Cadastro) */}
          {abaAtiva === 'cadastro' && (
            <div>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lock size={13} color="var(--accent-primary)" />
                <span>Confirmar Senha</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                className="form-input"
                required={abaAtiva === 'cadastro'}
                id="input-confirmar-senha"
              />
            </div>
          )}

          {/* Botão de Envio: apenas texto ENTRAR sem nenhum ícone */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={carregando || authCarregando}
            style={{
              marginTop: '8px',
              height: '44px',
              fontSize: '14px',
              fontWeight: 700,
              letterSpacing: '0.05em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: carregando ? 'not-allowed' : 'pointer'
            }}
            id="btn-submeter-auth"
          >
            {abaAtiva === 'login'
              ? (carregando ? 'ENTRANDO...' : 'ENTRAR')
              : (carregando ? 'CRIANDO CONTA...' : 'CRIAR CONTA')}
          </button>
        </form>

        {/* Rodapé de Segurança */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            marginTop: '22px',
            fontSize: '12px',
            color: 'var(--text-muted)'
          }}
        >
          <ShieldCheck size={14} color="var(--accent-primary)" />
          <span>Senhas protegidas com criptografia PBKDF2</span>
        </div>
      </div>
    </div>
  );
}
