export const ROLES = {
  admin: 'ROLE_ADMIN',
  soporte: 'ROLE_TI',
  usuario: 'ROLE_USER'
} as const;

export type AppRole = (typeof ROLES)[keyof typeof ROLES];
