import { CuratedItem, FeedResponse, FilterParams } from '@/types/hunter';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5033/api';

/**
 * Busca o feed estÃ¡tico prÃ©-calculado em cache de alta velocidade pelo C# (sub-1ms)
 * Utilizado por Server Components com Incremental Static Regeneration (ISR).
 */
export async function getStaticFeed(domain: string = 'fashion'): Promise<FeedResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/feed/static?domain=${encodeURIComponent(domain)}`, {
      next: { revalidate: 60 } // Revalida em background a cada 60s
    });

    if (!res.ok) {
      throw new Error(`Falha ao obter feed estÃ¡tico: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error('[API getStaticFeed Error]:', error);
    // Retorna fallback seguro se a API C# ainda nÃ£o estiver rodando
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
 * Consulta itens com filtros dinÃ¢micos sob demanda
 */
export async function getFilteredFeed(params: FilterParams): Promise<FeedResponse> {
  const query = new URLSearchParams();
  if (params.domain) query.set('domain', params.domain);
  if (params.minScore !== undefined) query.set('minScore', params.minScore.toString());
  if (params.saleOnly) query.set('saleOnly', 'true');
  if (params.category) query.set('category', params.category);
  if (params.search) query.set('search', params.search);
  if (params.page) query.set('page', params.page.toString());
  if (params.limit) query.set('limit', params.limit.toString());

  const res = await fetch(`${API_BASE_URL}/feed?${query.toString()}`, {
    cache: 'no-store'
  });

  if (!res.ok) {
    throw new Error(`Falha ao filtrar feed: ${res.statusText}`);
  }

  return await res.json();
}

/**
 * Envia feedback (curtir, descurtir, salvar) em uma peÃ§a
 */
export async function sendFeedback(id: string, feedback: 'liked' | 'disliked' | 'saved' | null): Promise<CuratedItem> {
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
export async function clearFeed(domain: string = 'fashion') {
  const res = await fetch(`${API_BASE_URL}/feed/clear?domain=${encodeURIComponent(domain)}`, {
    method: 'POST'
  });

  if (!res.ok) {
    throw new Error(`Falha ao limpar feed: ${res.statusText}`);
  }

  return await res.json();
}
