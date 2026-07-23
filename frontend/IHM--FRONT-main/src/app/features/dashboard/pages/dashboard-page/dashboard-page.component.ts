import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { ROLES } from '../../../../core/constants/roles.constants';
import { AuthStateService } from '../../../../core/services/auth-state.service';
import { CategoriesApiService } from '../../../../core/services/categories-api.service';
import { MetaApiService } from '../../../../core/services/meta-api.service';
import { Ticket } from '../../../tickets/models/ticket.model';
import { TicketsApiService } from '../../../tickets/services/tickets-api.service';
import { DashboardStatCardComponent } from '../../components/dashboard-stat-card/dashboard-stat-card.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, RouterLink, DashboardStatCardComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent {
  private readonly authStateService = inject(AuthStateService);
  private readonly categoriesApiService = inject(CategoriesApiService);
  private readonly metaApiService = inject(MetaApiService);
  private readonly ticketsApiService = inject(TicketsApiService);

  protected readonly currentUser = this.authStateService.currentUser;
  protected readonly isAdmin = computed(() => this.authStateService.hasAnyRole([ROLES.admin]));
  protected readonly isTech = computed(() => this.authStateService.hasAnyRole([ROLES.soporte]));
  protected readonly categoriesCount = signal(0);
  protected readonly serverTime = signal('');
  protected readonly tickets = signal<Ticket[]>([]);
  protected readonly loading = signal(false);

  protected readonly stats = computed(() => [
    { title: 'Tickets cargados', value: String(this.tickets().length), tone: 'teal' as const },
    {
      title: 'En proceso',
      value: String(this.tickets().filter((ticket) => ticket.estado === 'EN_PROCESO').length),
      tone: 'blue' as const
    },
    {
      title: 'Resueltos',
      value: String(this.tickets().filter((ticket) => ticket.estado === 'RESUELTO').length),
      tone: 'amber' as const
    }
  ]);

  constructor() {
    this.loadMeta();
    this.loadTickets();
  }

  protected roleLabel(): string {
    if (this.isAdmin()) {
      return 'Administrador';
    }

    if (this.isTech()) {
      return 'Tecnico';
    }

    return 'Usuario';
  }

  private loadMeta(): void {
    this.metaApiService.getServerTime().subscribe({
      next: (response) => this.serverTime.set(response.now)
    });

    this.categoriesApiService.list().subscribe({
      next: (categories) => this.categoriesCount.set(categories.length)
    });
  }

  private loadTickets(): void {
    this.loading.set(true);

    const request = this.isAdmin()
      ? this.ticketsApiService.listAll()
      : this.isTech()
        ? this.ticketsApiService.listMyAssigned()
        : this.ticketsApiService.listMyCreated();

    request.pipe(finalize(() => this.loading.set(false))).subscribe({
      next: (tickets) => this.tickets.set(tickets),
      error: () => this.tickets.set([])
    });
  }
}
