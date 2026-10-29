import { CuratedItem, FeedResponse, FilterParams } from '@/types/hunter';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5033/api';

/**
 * Busca o feed estático pré-calculado em cache de alta velocidade pelo C# (sub-1ms)
 * Utilizado por Server Components com Incremental Static Regeneration (ISR).
 */
export async function obterFeedEstatico(dominio: string = 'fashion'): Promise<FeedResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/feed/static?domain=${encodeURIComponent(dominio)}`, {
      next: { revalidate: 60 } // Revalida em segundo plano a cada 60s
    });

    if (!res.ok) {
      throw new Error(`Falha ao obter feed estático: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error('[API obterFeedEstatico Error]:', error);
    // Retorna fallback seguro se a API C# ainda não estiver rodando
    return {
      items: [],
      totalItems: 0,
      page: 1,
      totalPages: 1,
      availableCategories: [],
      generatedAt: new Date().toISOString()
    };
  }
}

/**
 * Consulta itens com filtros dinâmicos sob demanda
 */
export async function obterFeedFiltrado(parametros: FilterParams): Promise<FeedResponse> {
  const query = new URLSearchParams();
  if (parametros.domain) query.set('domain', parametros.domain);
  if (parametros.minScore !== undefined) query.set('minScore', parametros.minScore.toString());
  if (parametros.saleOnly) query.set('saleOnly', 'true');
  if (parametros.category) query.set('category', parametros.category);
  if (parametros.search) query.set('search', parametros.search);
  if (parametros.page) query.set('page', parametros.page.toString());
  if (parametros.limit) query.set('limit', parametros.limit.toString());

  const res = await fetch(`${API_BASE_URL}/feed?${query.toString()}`, {
    cache: 'no-store'
  });

  if (!res.ok) {
    throw new Error(`Falha ao filtrar feed: ${res.statusText}`);
  }

  return await res.json();
}

/**
 * Envia feedback (curtir, descurtir, salvar) em uma peça
 */
export async function enviarFeedback(id: string, feedback: 'liked' | 'disliked' | 'saved' | null): Promise<CuratedItem> {
  const res = await fetch(`${API_BASE_URL}/items/${encodeURIComponent(id)}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ feedback })
  });

  if (!res.ok) {
    throw new Error(`Falha ao salvar feedback: ${res.statusText}`);
  }

  return await res.json();
}

/**
 * Limpa itens dispensados do feed preservando os favoritos
 */
export async function limparFeed(dominio: string = 'fashion') {
  const res = await fetch(`${API_BASE_URL}/feed/clear?domain=${encodeURIComponent(dominio)}`, {
    method: 'POST'
  });

  if (!res.ok) {
    throw new Error(`Falha ao limpar feed: ${res.statusText}`);
  }

  return await res.json();
}

// Aliases para retrocompatibilidade
export const getStaticFeed = obterFeedEstatico;
export const getFilteredFeed = obterFeedFiltrado;
export const sendFeedback = enviarFeedback;
export const clearFeed = limparFeed;

// Classe e instância do serviço de API desacoplado
export { HunterApiService, hunterApi } from '@/services/hunter-api.service';

