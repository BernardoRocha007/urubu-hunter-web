'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * Componente Guard que bloqueia a visualização e execução de qualquer lógica
 * caso o usuário não esteja autenticado.
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const { estaAutenticado, estaCarregando } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!estaCarregando && !estaAutenticado) {
      router.replace('/login');
    }
  }, [estaCarregando, estaAutenticado, router]);

  // Enquanto valida o token/sessão, exibe tela de carregamento minimalista
  if (estaCarregando) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'radial-gradient(ellipse at 50% 0%, hsl(224, 71%, 10%) 0%, var(--bg-deep) 70%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px'
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid var(--accent-primary)',
            boxShadow: '0 0 24px rgba(0, 245, 160, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          className="animate-pulse"
        >
          <Image
            src="/urubu-icon.png"
            alt="Urubu Hunter"
            width={64}
            height={64}
            priority
          />
        </div>
        <div style={{ textAlign: 'center' }}>
          <p
            style={{
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--accent-primary)',
              margin: '0 0 4px'
            }}
          >
            Urubu Hunter
          </p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
            Verificando credenciais de acesso...
          </p>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, não renderiza nada até o router redirecionar
  if (!estaAutenticado) {
    return null;
  }

  return <>{children}</>;
}
