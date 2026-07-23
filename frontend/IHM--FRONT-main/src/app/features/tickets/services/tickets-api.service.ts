import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';

import { API_CONFIG } from '../../../core/constants/api.config';
import { AssignTicketRequest } from '../models/assign-ticket-request.model';
import { CreateTicketRequest } from '../models/create-ticket-request.model';
import { Ticket } from '../models/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class TicketsApiService {
  private readonly http = inject(HttpClient);
  private readonly ticketsUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.tickets}`;

  listAll() {
    return this.http.get<unknown[]>(this.ticketsUrl).pipe(map((tickets) => tickets.map((ticket) => this.mapTicket(ticket))));
  }

  listMyAssigned() {
    return this.http
      .get<unknown[]>(`${this.ticketsUrl}/my-tickets`)
      .pipe(map((tickets) => tickets.map((ticket) => this.mapTicket(ticket))));
  }

  listMyCreated() {
    return this.http
      .get<unknown[]>(`${this.ticketsUrl}/my-tickets-created`)
      .pipe(map((tickets) => tickets.map((ticket) => this.mapTicket(ticket))));
  }

  create(payload: CreateTicketRequest) {
    return this.http.post<unknown>(this.ticketsUrl, payload).pipe(map((ticket) => this.mapTicket(ticket)));
  }

  assign(ticketId: number, payload: AssignTicketRequest) {
    return this.http.put(`${this.ticketsUrl}/${ticketId}/asignacion`, payload, { responseType: 'text' });
  }

  complete(ticketId: number) {
    return this.http.put(`${this.ticketsUrl}/${ticketId}/culminar`, {}, { responseType: 'text' });
  }

  delete(ticketId: number) {
    return this.http.delete<void>(`${this.ticketsUrl}/${ticketId}`);
  }

  private mapTicket(source: unknown): Ticket {
    const value = this.asRecord(source);
    const categoria = this.asRecord(value['categoria']);
    const creador = this.asRecord(value['usuarioCreador'] ?? value['creadoPor'] ?? value['usuario']);
    const asignado = this.asRecord(value['usuarioAsignado'] ?? value['tecnicoAsignado']);

    return {
      id: this.asNumber(value['id']),
      titulo: this.asString(value['titulo']),
      descripcion: this.asString(value['descripcion']),
      estado: this.asString(value['estado']),
      prioridad: this.asString(value['prioridad']),
      fechaCreacion:
        this.asOptionalString(value['fechaCreacion'] ?? value['fechaRegistro'] ?? value['createdAt']),
      categoriaNombre:
        this.asOptionalString(categoria['nombre']) ??
        this.asOptionalString(value['categoria']) ??
        this.asOptionalString(value['categoriaNombre']),
      creadorNombre:
        this.fullName(creador['nombre'], creador['apellido']) ??
        this.asOptionalString(value['creadoPor']) ??
        this.asOptionalString(value['creadorNombre']),
      asignadoNombre:
        this.fullName(asignado['nombre'], asignado['apellido']) ??
        this.asOptionalString(value['usuarioAsignado']) ??
        this.asOptionalString(value['asignadoNombre']),
      categoriaId: this.asOptionalNumber(categoria['id'] ?? value['categoriaId']),
      usuarioCreadorId: this.asOptionalNumber(creador['id'] ?? value['usuarioCreadorId']),
      usuarioAsignadoId: this.asOptionalNumber(asignado['id'] ?? value['usuarioAsignadoId'])
    };
  }

  private fullName(nombre: unknown, apellido: unknown): string | undefined {
    const firstName = this.asOptionalString(nombre) ?? '';
    const lastName = this.asOptionalString(apellido) ?? '';
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || undefined;
  }

  private asRecord(source: unknown): Record<string, unknown> {
    return source && typeof source === 'object' ? (source as Record<string, unknown>) : {};
  }

  private asString(source: unknown): string {
    if (typeof source === 'string') {
      return source;
    }

    if (source == null) {
      return '';
    }

    return String(source);
  }

  private asOptionalString(source: unknown): string | undefined {
    return typeof source === 'string' ? source : undefined;
  }

  private asNumber(source: unknown): number {
    return typeof source === 'number' ? source : 0;
  }

  private asOptionalNumber(source: unknown): number | undefined {
    return typeof source === 'number' ? source : undefined;
  }
}
