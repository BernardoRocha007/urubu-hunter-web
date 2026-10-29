import {
  DomainDefinition,
  DomainId,
  StyleProfile,
  WatchlistItem,
  PaginatedItemsResponse,
  HuntStatus,
  ClearFeedResponse
} from '@/types';
import {
  Usuario,
  RegistroUsuarioRequest,
  LoginUsuarioRequest,
  CriarUsuarioAdminRequest,
  AlternarStatusUsuarioRequest,
  AuthResponse,
  TesteNotificacaoResposta,
  AtualizarPerfilRequest
} from '@/types/auth';

export interface ItemFilterParams {
  domain: DomainId;
  page: number;
  limit?: number;
  minScore?: number;
  saleOnly?: boolean;
  category?: string;
  search?: string;
}

const TOKEN_STORAGE_KEY = 'urubu_auth_token';

/**
 * Cliente HTTP tipado para comunicação com a API do Urubu Hunter.
 * Centraliza tratamento de erros, serialização de query params, chamadas de rede e autorização JWT.
 */
export class HunterApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
    if (typeof window !== 'undefined') {
      try {
        this.token = localStorage.getItem(TOKEN_STORAGE_KEY);
      } catch {
        this.token = null;
      }
    }
  }

  /**
   * Define o token JWT de autorização e persiste no armazenamento local e cookies
   */
  setToken(token: string | null): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      try {
        if (token) {
          localStorage.setItem(TOKEN_STORAGE_KEY, token);
          document.cookie = `${TOKEN_STORAGE_KEY}=${encodeURIComponent(token)}; path=/; max-age=604800; SameSite=Lax`;
        } else {
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          document.cookie = `${TOKEN_STORAGE_KEY}=; path=/; max-age=0; SameSite=Lax`;
        }
      } catch {
        // Ignora erros de storage
      }
    }
  }

  getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      try {
        this.token = localStorage.getItem(TOKEN_STORAGE_KEY);
        if (!this.token) {
          const match = document.cookie.match(new RegExp('(^| )' + TOKEN_STORAGE_KEY + '=([^;]+)'));
          if (match) {
            this.token = decodeURIComponent(match[2]);
          }
        }
      } catch {
        this.token = null;
      }
    }
    return this.token;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options?.headers as Record<string, string>) || {})
    };

    const activeToken = this.getToken();
    if (activeToken) {
      headers['Authorization'] = `Bearer ${activeToken}`;
    }

    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers
    });

    if (!res.ok) {
      let erroDetalhe = res.statusText;
      try {
        const body = await res.json();
        if (body && body.error) erroDetalhe = body.error;
      } catch {
        // Fallback para statusText
      }
      throw new Error(erroDetalhe || `Erro na requisição ${endpoint} [HTTP ${res.status}]`);
    }

    return res.json() as Promise<T>;
  }

  // ==========================================
  // AUTENTICAÇÃO & USUÁRIO
  // ==========================================

  /**
   * Realiza o cadastro de um novo usuário
   */
  async register(dados: RegistroUsuarioRequest): Promise<AuthResponse> {
    const res = await this.request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(dados)
    });
    this.setToken(res.token);
    return res;
  }

  /**
   * Realiza login do usuário com e-mail e senha
   */
  async login(dados: LoginUsuarioRequest): Promise<AuthResponse> {
    const res = await this.request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(dados)
    });
    this.setToken(res.token);
    return res;
  }

  /**
   * Obtém os dados do usuário autenticado a partir do token
   */
  async getMe(): Promise<Usuario> {
    return this.request<Usuario>('/api/auth/me');
  }

  /**
   * Dispara um teste de notificação de alerta (WhatsApp / E-mail) para o usuário autenticado
   */
  async testNotification(): Promise<TesteNotificacaoResposta> {
    return this.request<TesteNotificacaoResposta>('/api/auth/test-notification', {
      method: 'POST'
    });
  }

  /**
   * Atualiza os dados de perfil (Nome e WhatsApp) do usuário autenticado
   */
  async updateProfile(dados: AtualizarPerfilRequest): Promise<Usuario> {
    return this.request<Usuario>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(dados)
    });
  }

  /**
   * Encerra a sessão do usuário
   */
  logout(): void {
    this.setToken(null);
  }

  // ==========================================
  // GESTÃO ADMINISTRATIVA DE USUÁRIOS
  // Requer política "GerenciamentoUsuarios"
  // ==========================================

  /**
   * Lista todos os usuários cadastrados no sistema (Requer permissão de Admin)
   */
  async listarUsuariosAdmin(): Promise<Usuario[]> {
    return this.request<Usuario[]>('/api/admin/usuarios');
  }

  /**
   * Cria um novo usuário pelo Admin com status inicial inativo/pendente
   */
  async criarUsuarioAdmin(dados: CriarUsuarioAdminRequest): Promise<Usuario> {
    return this.request<Usuario>('/api/admin/usuarios', {
      method: 'POST',
      body: JSON.stringify(dados)
    });
  }

  /**
   * Alterna a permissão de acesso/login do usuário (Adiciona ao sistema / Desativa)
   */
  async alternarStatusUsuarioAdmin(id: string, ativo: boolean): Promise<Usuario> {
    const body: AlternarStatusUsuarioRequest = { ativo };
    return this.request<Usuario>(`/api/admin/usuarios/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(body)
    });
  }

  /**
   * Exclui um usuário do sistema
   */
  async deletarUsuarioAdmin(id: string): Promise<{ sucesso: boolean; mensagem: string }> {
    return this.request<{ sucesso: boolean; mensagem: string }>(`/api/admin/usuarios/${id}`, {
      method: 'DELETE'
    });
  }

  // ==========================================
  // FEED & GARIMPO
  // ==========================================

  /**
   * Obtém os domínios suportados configurados na aplicação
   */
  async getDomains(): Promise<Record<string, DomainDefinition>> {
    return this.request<Record<string, DomainDefinition>>('/api/domains');
  }

  /**
   * Obtém os itens favoritados e monitorados na watchlist
   */
  async getWatchlist(): Promise<WatchlistItem[]> {
    return this.request<WatchlistItem[]>('/api/watchlist');
  }

  /**
   * Obtém as categorias distintas disponíveis para um determinado domínio
   */
  async getCategories(domain: DomainId): Promise<string[]> {
    return this.request<string[]>(`/api/categories?domain=${encodeURIComponent(domain)}`);
  }

  /**
   * Obtém o perfil de estilo e preferências de um domínio
   */
  async getProfile(domain: DomainId): Promise<StyleProfile> {
    return this.request<StyleProfile>(`/api/profile?domain=${encodeURIComponent(domain)}`);
  }

  /**
   * Salva as preferências de estilo do usuário
   */
  async saveProfile(profile: StyleProfile): Promise<void> {
    await this.request('/api/profile', {
      method: 'POST',
      body: JSON.stringify(profile)
    });
  }

  /**
   * Obtém itens filtrados com paginação server-side
   */
  async getItems(params: ItemFilterParams): Promise<PaginatedItemsResponse> {
    const query = new URLSearchParams();
    query.set('domain', params.domain);
    query.set('page', params.page.toString());
    query.set('limit', (params.limit ?? 20).toString());

    if (params.minScore !== undefined) query.set('minScore', params.minScore.toString());
    if (params.saleOnly) query.set('saleOnly', 'true');
    if (params.category) query.set('category', params.category);
    if (params.search?.trim()) query.set('search', params.search.trim());

    return this.request<PaginatedItemsResponse>(`/api/items?${query.toString()}`);
  }

  /**
   * Envia feedback (curtir/descurtir/remover) para um item específico
   */
  async sendFeedback(id: string, feedback: 'liked' | 'disliked' | null): Promise<void> {
    await this.request(`/api/items/${encodeURIComponent(id)}/feedback`, {
      method: 'POST',
      body: JSON.stringify({ feedback })
    });
  }

  /**
   * Dispara um ciclo de garimpo (geral ou lojas selecionadas)
   */
  async triggerHunt(domain: DomainId, targetStores?: string[]): Promise<void> {
    await this.request('/api/hunt', {
      method: 'POST',
      body: JSON.stringify({ domain, targetStores })
    });
  }

  /**
   * Consulta o status do ciclo atual de garimpo
   */
  async getHuntStatus(): Promise<HuntStatus> {
    return this.request<HuntStatus>('/api/hunt/status');
  }

  /**
   * Limpa itens dispensados do feed preservando os curtidos
   */
  async clearFeed(domain: DomainId): Promise<ClearFeedResponse> {
    return this.request<ClearFeedResponse>('/api/items/clear', {
      method: 'POST',
      body: JSON.stringify({ domain })
    });
  }
}

// Instância padrão para consumo direto
export const hunterApi = new HunterApiService();
