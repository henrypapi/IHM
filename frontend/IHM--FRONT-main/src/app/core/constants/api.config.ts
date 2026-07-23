import { environment } from '../../../environments/environment';

export const API_CONFIG = {
  baseUrl: environment.apiUrl,
  endpoints: {
    login: '/api/auth/login',
    me: '/api/v1/usuario/me',
    metaTicketOptions: '/api/v1/meta/ticket-options',
    serverTime: '/api/v1/meta/server-time',
    categorias: '/api/v1/categoria',
    usuarios: '/api/v1/usuario',
    tickets: '/api/v1/ticket',
    incidencias: '/api/v1/ticket'
  }
} as const;
