'use client';

import React from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { HunterApp } from '@/components/hunter/HunterApp';

/**
 * Rota raiz do Urubu Hunter.
 * Protegida estritamente por AuthGuard: sem login não entra, redirecionando para /login.
 */
export default function HomePage() {
  return (
    <AuthGuard>
      <HunterApp />
    </AuthGuard>
  );
}
