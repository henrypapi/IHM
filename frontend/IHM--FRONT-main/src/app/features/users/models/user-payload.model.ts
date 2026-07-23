export interface CreateUserPayload {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  celular?: string;
  roles: string[];
}

export interface UpdateUserPayload {
  nombre: string;
  apellido: string;
  celular?: string;
}
