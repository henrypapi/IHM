export interface LoginResponse {
  token: string;
  accessToken?: string;
  jwt?: string;
  type?: string;
  roles?: string[];
  rol?: string;
  usuario?: {
    id?: number;
    nombre?: string;
    apellido?: string;
    email?: string;
    rol?: string;
    roles?: string[];
  };
}
