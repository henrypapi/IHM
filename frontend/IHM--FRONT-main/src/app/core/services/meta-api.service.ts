import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { API_CONFIG } from '../constants/api.config';
import { ServerTime } from '../models/server-time.model';
import { TicketOptions } from '../models/ticket-options.model';

@Injectable({
  providedIn: 'root'
})
export class MetaApiService {
  private readonly http = inject(HttpClient);

  getServerTime() {
    return this.http.get<ServerTime>(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.serverTime}`);
  }

  getTicketOptions() {
    return this.http.get<TicketOptions>(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.metaTicketOptions}`);
  }
}
