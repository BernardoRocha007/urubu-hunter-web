---
name: nextjs-best-practices
description: Diretrizes oficiais e melhores práticas do Cursor Directory para Next.js (App Router, Server Components, Server Actions e Tailwind CSS).
---

# Next.js App Router & React Server Components Guidelines

## 1. Princípios Fundamentais (App Router)
- **Server Components por Padrão:** Trate todo componente em `src/app/` como React Server Component (RSC).
- **Diretiva `"use client"` Estrita:** Adicione `"use client"` apenas no topo dos arquivos que realmente exigem:
  - Hooks do React (`useState`, `useEffect`, `useCallback`, etc.).
  - Event listeners do DOM (`onClick`, `onChange`, `onSubmit`).
  - APIs exclusivas do navegador (`window`, `localStorage`, `IntersectionObserver`).
  - Mantenha os Client Components nas folhas da árvore de componentes (leaf nodes).
- **Server Actions:** Para mutações de dados (criação, edição, exclusão), utilize Server Actions (`"use server"`).

## 2. Estrutura de Arquivos e Roteamento
- Use a convenção padrão do App Router dentro de `src/app/`:
  - `layout.tsx`: Layouts compartilhados (persistentes entre navegações).
  - `page.tsx`: A rota pública e renderização da página.
  - `loading.tsx`: Suspense fallbacks automáticos com skeletons.
  - `error.tsx`: Error boundary da rota (sempre Client Component).
  - `not-found.tsx`: Página 404 contextual.
- Separe componentes reutilizáveis em `src/components/` (ex: `src/components/ui/` e `src/components/hunter/`).

## 3. Data Fetching & Performance
- **Zero Waterfalls:** Sempre que precisar carregar múltiplos recursos independentes, execute-os em paralelo com `Promise.all()`.
- **Caching & Revalidation:** Utilize tags de cache (`next: { tags: [...] }`) e revalidação sob demanda (`revalidateTag`, `revalidatePath`).
- **Comunicação com o Backend C# (`UrubuApi`):**
  - Crie uma camada de serviço tipada em `src/lib/api.ts`.
  - Tipos e DTOs espelhados entre C# e TypeScript para garantir type-safety ponta a ponta.

## 4. TypeScript e Validação
- Tipagem estrita: Proibido o uso de `any`. Utilize `unknown` ou generics quando o tipo não for conhecido previamente.
- Validação em runtime: Utilize `zod` para validar parâmetros de rotas, formulários e respostas de APIs externas.

## 5. Estilização & UI (Tailwind CSS)
- Utilize classes utilitárias do Tailwind CSS.
- Mantenha suporte nativo a Dark Mode (`class` ou CSS variables).
- Adote componentes acessíveis e consistentes (estilo Glassmorphism e Dark Luxury para o Urubu Hunter).
