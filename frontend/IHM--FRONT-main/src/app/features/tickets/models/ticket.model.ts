export interface Ticket {
  id: number;
  titulo: string;
  descripcion: string;
  estado: string;
  prioridad: string;
  fechaCreacion?: string;
  categoriaNombre?: string;
  creadorNombre?: string;
  asignadoNombre?: string;
  categoriaId?: number;
  usuarioCreadorId?: number;
  usuarioAsignadoId?: number;
}
