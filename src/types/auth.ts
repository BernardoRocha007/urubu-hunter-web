export interface Usuario {
  id: string;
  nome: string;
  email: string;
  whatsapp: string;
  ativo: boolean;
  role: string;
  politicas: string;
  criadoEm: string;
}

export interface RegistroUsuarioRequest {
  nome: string;
  email: string;
  whatsapp: string;
  senha: string;
}

export interface LoginUsuarioRequest {
  email: string;
  senha: string;
}

export interface CriarUsuarioAdminRequest {
  nome: string;
  email: string;
  whatsapp?: string;
  senha: string;
  role?: string;
  politicas?: string;
}

export interface AlternarStatusUsuarioRequest {
  ativo: boolean;
}

export interface AuthResponse {
  token: string;
  usuario: Usuario;
}

export interface TesteNotificacaoResposta {
  sucesso: boolean;
  mensagem: string;
  detalhe: string;
  destinatario: string;
  whatsappUrl?: string;
  enviadoEm: string;
}

export interface AtualizarPerfilRequest {
  nome?: string;
  whatsapp?: string;
}

