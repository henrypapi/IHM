import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, NgZone, OnDestroy, ViewChild, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { ROLES } from '../../../../core/constants/roles.constants';
import { Category } from '../../../../core/models/category.model';
import { TicketOptions } from '../../../../core/models/ticket-options.model';
import { User } from '../../../../core/models/user.model';
import { CategoriesApiService } from '../../../../core/services/categories-api.service';
import { MetaApiService } from '../../../../core/services/meta-api.service';
import { AuthStateService } from '../../../../core/services/auth-state.service';
import { AssignTicketRequest } from '../../models/assign-ticket-request.model';
import { CreateTicketRequest } from '../../models/create-ticket-request.model';
import { Ticket } from '../../models/ticket.model';
import { TicketsApiService } from '../../services/tickets-api.service';
import { UsersApiService } from '../../../users/services/users-api.service';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import {
  ContextHelpComponent,
  ContextHelpLayout,
  ContextHelpStep
} from '../../../../shared/components/context-help/context-help.component';

type FilterOption = 'ALL' | string;

@Component({
  selector: 'app-tickets-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ContextHelpComponent, ModalComponent],
  templateUrl: './tickets-page.component.html',
  styleUrl: './tickets-page.component.scss'
})
export class TicketsPageComponent implements AfterViewInit, OnDestroy {
  private readonly authStateService = inject(AuthStateService);
  private readonly categoriesApiService = inject(CategoriesApiService);
  private readonly fb = inject(FormBuilder);
  private readonly metaApiService = inject(MetaApiService);
  private readonly ngZone = inject(NgZone);
  private readonly router = inject(Router);
  private readonly ticketsApiService = inject(TicketsApiService);
  private readonly usersApiService = inject(UsersApiService);
  private readonly removeWindowListeners: Array<() => void> = [];

  protected readonly currentUser = this.authStateService.currentUser;
  protected readonly isAdmin = computed(() => this.authStateService.hasAnyRole([ROLES.admin]));
  protected readonly isTech = computed(() => this.authStateService.hasAnyRole([ROLES.soporte]));
  protected readonly isUser = computed(() => this.authStateService.hasAnyRole([ROLES.usuario]));
  protected readonly canCreateTicket = computed(() => this.isUser() || this.isAdmin());

  protected readonly categories = signal<Category[]>([]);
  protected readonly options = signal<TicketOptions>({ prioridades: [], estados: [] });
  protected readonly tickets = signal<Ticket[]>([]);
  protected readonly technicians = signal<User[]>([]);
  protected readonly loading = signal(false);
  protected readonly submittingCreate = signal(false);
  protected readonly actionTicketId = signal<number | null>(null);
  protected readonly activeTicket = signal<Ticket | null>(null);
  protected readonly searchTerm = signal('');
  protected readonly statusFilter = signal<FilterOption>('ALL');
  protected readonly priorityFilter = signal<FilterOption>('ALL');
  protected readonly helpOpen = signal(false);
  protected readonly helpLayouts = signal<Record<string, ContextHelpLayout>>({});
  protected readonly errorMessage = signal('');
  protected readonly successMessage = signal('');

  @ViewChild('createModal') createModal!: ModalComponent;
  @ViewChild('assignModal') assignModal!: ModalComponent;
  @ViewChild('completeModal') completeModal!: ModalComponent;
  @ViewChild('deleteModal') deleteModal!: ModalComponent;

  protected readonly roleLabel = computed(() => {
    if (this.isAdmin()) return 'Administrador';
    if (this.isTech()) return 'Tecnico de soporte';
    return 'Usuario solicitante';
  });

  protected readonly roleDescription = computed(() => {
    if (this.isAdmin()) return 'Supervisas todo el ciclo del ticket: monitoreo, asignacion y seguimiento.';
    if (this.isTech()) return 'Atiendes tickets asignados, priorizas la respuesta y marcas el cierre.';
    return 'Reportas incidencias, revisas su avance y mantienes tu historial organizado.';
  });

  protected readonly pageTitle = computed(() => 'Centro de tickets accesible y ordenado');
  protected readonly pageDescription = computed(() => this.roleDescription());

  protected readonly requesterName = computed(() => {
    const user = this.currentUser();
    return user ? `${user.nombre} ${user.apellido}`.trim() : 'Usuario sin identificar';
  });

  protected readonly requesterInitials = computed(() => {
    const user = this.currentUser();
    const source = [user?.nombre, user?.apellido].filter(Boolean).join(' ').trim();
    if (!source) return 'NA';
    return source.split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('');
  });

  protected readonly openingDateLabel = computed(() =>
    new Intl.DateTimeFormat('es-CO', { dateStyle: 'full', timeStyle: 'short' }).format(new Date())
  );

  protected readonly filteredTickets = computed(() => {
    const normalizedSearch = this.searchTerm().trim().toLowerCase();
    const selectedStatus = this.statusFilter();
    const selectedPriority = this.priorityFilter();

    return this.tickets().filter((ticket) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [ticket.titulo, ticket.descripcion, ticket.categoriaNombre, ticket.creadorNombre, ticket.asignadoNombre, ticket.estado, ticket.prioridad]
          .filter(Boolean)
          .some((value) => value?.toLowerCase().includes(normalizedSearch));
      const matchesStatus = selectedStatus === 'ALL' || ticket.estado === selectedStatus;
      const matchesPriority = selectedPriority === 'ALL' || ticket.prioridad === selectedPriority;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  });

  protected readonly availableStatuses = computed(() =>
    Array.from(new Set(this.tickets().map((ticket) => ticket.estado).filter(Boolean))).sort()
  );

  protected readonly featuredCategories = computed(() => this.categories().slice(0, 6));

  protected readonly selectedCategory = computed(
    () => this.categories().find((category) => category.id === this.createForm.controls.categoriaId.value) ?? null
  );

  protected readonly availablePriorities = computed(() =>
    Array.from(
      new Set(
        [
          ...this.options().prioridades,
          ...this.tickets().map((ticket) => ticket.prioridad).filter((priority): priority is string => Boolean(priority))
        ].filter(Boolean)
      )
    ).sort()
  );

  protected readonly stats = computed(() => {
    const tickets = this.tickets();
    const openStates = ['ABIERTO', 'PENDIENTE', 'EN_PROCESO', 'ASIGNADO'];
    const resolvedStates = ['RESUELTO', 'CULMINADO', 'CERRADO'];

    return [
      { label: 'Total visibles', value: this.filteredTickets().length, detail: `${tickets.length} ticket(s) cargado(s) desde la API.` },
      { label: 'Pendientes', value: tickets.filter((ticket) => openStates.includes(ticket.estado.toUpperCase())).length, detail: 'Casos que siguen requiriendo atencion.' },
      { label: 'Resueltos', value: tickets.filter((ticket) => resolvedStates.includes(ticket.estado.toUpperCase())).length, detail: 'Tickets que ya completaron el flujo.' },
      { label: 'Sin asignar', value: tickets.filter((ticket) => !ticket.asignadoNombre).length, detail: 'Util para repartir carga de trabajo.' }
    ];
  });

  protected readonly helpSteps = computed<ContextHelpStep[]>(() => {
    const steps: ContextHelpStep[] = [
      { id: 'overview', anchorId: 'tickets-overview', label: 'Resumen general', description: 'Muestra el rol activo y los indicadores principales para entender el estado de la mesa de ayuda.' },
      { id: 'table', anchorId: 'tickets-list', label: 'Bandeja de tickets', description: 'Aqui filtras, consultas y ejecutas acciones clave como asignar, culminar o eliminar.' }
    ];

    if (this.canCreateTicket()) {
      steps.push({ id: 'create', anchorId: 'tickets-create-btn', label: 'Registro de incidencia', description: 'Botón para describir el problema con categoria y detalle suficiente.' });
    }

    return steps;
  });

  protected readonly createForm = this.fb.nonNullable.group({
    titulo: ['', [Validators.required, Validators.minLength(5)]],
    descripcion: ['', [Validators.required, Validators.minLength(10)]],
    categoriaId: [0, [Validators.min(1)]]
  });

  protected readonly assignmentForm = this.fb.nonNullable.group({
    idUsuarioAsignado: [0, [Validators.min(1)]],
    prioridad: ['', Validators.required]
  });

  constructor() {
    this.loadSupportData();
    this.loadTickets();
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      const update = () => this.ngZone.run(() => this.updateHelpLayouts());
      window.addEventListener('resize', update, { passive: true });
      window.addEventListener('scroll', update, { passive: true });
      this.removeWindowListeners.push(() => window.removeEventListener('resize', update));
      this.removeWindowListeners.push(() => window.removeEventListener('scroll', update));
    });

    queueMicrotask(() => this.updateHelpLayouts());
  }

  ngOnDestroy(): void {
    this.removeWindowListeners.forEach((dispose) => dispose());
  }

  protected startCreate(): void {
    this.createForm.reset({ titulo: '', descripcion: '', categoriaId: 0 });
    this.errorMessage.set('');
    this.successMessage.set('');
    this.createModal.open();
  }

  protected submitCreate(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.submittingCreate.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const payload = this.createForm.getRawValue() as CreateTicketRequest;

    this.ticketsApiService
      .create(payload)
      .pipe(finalize(() => this.submittingCreate.set(false)))
      .subscribe({
        next: () => {
          this.successMessage.set('Ticket creado correctamente.');
          this.createModal.close();
          this.loadTickets();
        },
        error: (error) => {
          this.errorMessage.set(error?.error?.message ?? 'No fue posible crear el ticket.');
        }
      });
  }

  protected startAssign(ticket: Ticket): void {
    this.activeTicket.set(ticket);
    this.assignmentForm.reset({ idUsuarioAsignado: 0, prioridad: ticket.prioridad ?? this.options().prioridades[0] ?? '' });
    this.errorMessage.set('');
    this.successMessage.set('');
    this.assignModal.open();
  }

  protected submitAssign(): void {
    const ticket = this.activeTicket();
    if (!ticket) return;

    if (this.assignmentForm.invalid) {
      this.assignmentForm.markAllAsTouched();
      return;
    }

    this.actionTicketId.set(ticket.id);
    this.errorMessage.set('');
    this.successMessage.set('');

    const payload = this.assignmentForm.getRawValue() as AssignTicketRequest;

    this.ticketsApiService
      .assign(ticket.id, payload)
      .pipe(finalize(() => this.actionTicketId.set(null)))
      .subscribe({
        next: () => {
          this.successMessage.set(`Ticket #${ticket.id} asignado.`);
          this.assignModal.close();
          this.loadTickets();
        },
        error: (error) => {
          this.errorMessage.set(error?.error?.message ?? 'No fue posible asignar el ticket.');
        }
      });
  }

  protected startComplete(ticket: Ticket): void {
    this.activeTicket.set(ticket);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.completeModal.open();
  }

  protected submitComplete(): void {
    const ticket = this.activeTicket();
    if (!ticket) return;

    this.actionTicketId.set(ticket.id);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.ticketsApiService
      .complete(ticket.id)
      .pipe(finalize(() => this.actionTicketId.set(null)))
      .subscribe({
        next: () => {
          this.successMessage.set(`Ticket #${ticket.id} marcado como resuelto.`);
          this.completeModal.close();
          this.loadTickets();
        },
        error: (error) => {
          this.errorMessage.set(error?.error?.message ?? 'No fue posible culminar el ticket.');
        }
      });
  }

  protected startDelete(ticket: Ticket): void {
    this.activeTicket.set(ticket);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.deleteModal.open();
  }

  protected submitDelete(): void {
    const ticket = this.activeTicket();
    if (!ticket) return;

    this.actionTicketId.set(ticket.id);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.ticketsApiService
      .delete(ticket.id)
      .pipe(finalize(() => this.actionTicketId.set(null)))
      .subscribe({
        next: () => {
          this.successMessage.set(`Ticket #${ticket.id} eliminado.`);
          this.deleteModal.close();
          this.loadTickets();
        },
        error: (error) => {
          this.errorMessage.set(error?.error?.message ?? 'No fue posible eliminar el ticket.');
        }
      });
  }

  protected hasCreateFieldError(fieldName: 'titulo' | 'descripcion' | 'categoriaId'): boolean {
    const field = this.createForm.controls[fieldName];
    return field.invalid && (field.dirty || field.touched);
  }

  protected hasAssignmentFieldError(fieldName: 'idUsuarioAsignado' | 'prioridad'): boolean {
    const field = this.assignmentForm.controls[fieldName];
    return field.invalid && (field.dirty || field.touched);
  }

  protected selectCategory(categoryId: number): void {
    this.createForm.controls.categoriaId.setValue(categoryId);
    this.createForm.controls.categoriaId.markAsTouched();
  }

  protected toggleHelp(): void {
    this.helpOpen.update((value) => !value);
    queueMicrotask(() => this.updateHelpLayouts());
  }

  protected closeHelp(): void {
    this.helpOpen.set(false);
  }

  protected focusSection(sectionId: string): void {
    this.closeHelp();
    const target = document.getElementById(sectionId);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    target?.focus({ preventScroll: true });
    queueMicrotask(() => this.updateHelpLayouts());
  }

  protected updateSearchTerm(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    this.searchTerm.set(input?.value ?? '');
  }

  protected updateStatusFilter(value: string): void {
    this.statusFilter.set(value || 'ALL');
  }

  protected updatePriorityFilter(value: string): void {
    this.priorityFilter.set(value || 'ALL');
  }

  protected clearFilters(): void {
    this.searchTerm.set('');
    this.statusFilter.set('ALL');
    this.priorityFilter.set('ALL');
  }

  protected formatDate(value?: string): string {
    if (!value) return 'Sin fecha';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short' }).format(parsed);
  }

  protected statusClass(status: string): string {
    const normalized = this.normalizeValue(status);
    if (['RESUELTO', 'CULMINADO', 'CERRADO'].includes(normalized)) return 'ticket-badge--success';
    if (['PENDIENTE', 'ABIERTO'].includes(normalized)) return 'ticket-badge--warning';
    return 'ticket-badge--info';
  }

  protected priorityClass(priority: string): string {
    const normalized = this.normalizeValue(priority);
    if (['ALTA', 'CRITICA'].includes(normalized)) return 'ticket-badge--danger';
    if (['MEDIA'].includes(normalized)) return 'ticket-badge--warning';
    return 'ticket-badge--neutral';
  }

  protected isResolved(ticket: Ticket): boolean {
    return ['RESUELTO', 'CULMINADO', 'CERRADO'].includes(this.normalizeValue(ticket.estado));
  }

  protected canDelete(ticket: Ticket): boolean {
    if (this.isAdmin()) return true;
    if (!this.isUser()) return false;
    return ticket.usuarioCreadorId === this.currentUser()?.id;
  }

  private loadSupportData(): void {
    this.metaApiService.getTicketOptions().subscribe({
      next: (options) => {
        this.options.set(options);
        if (!this.assignmentForm.controls.prioridad.value && options.prioridades.length > 0) {
          this.assignmentForm.patchValue({ prioridad: options.prioridades[0] });
        }
      }
    });

    this.categoriesApiService.list().subscribe({
      next: (categories) => this.categories.set(categories)
    });

    if (this.isAdmin()) {
      this.usersApiService.list().subscribe({
        next: (users) => {
          this.technicians.set(users.filter((user) => user.roles.includes(ROLES.soporte)));
        }
      });
    }
  }

  private loadTickets(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    const request = this.isAdmin()
      ? this.ticketsApiService.listAll()
      : this.isTech()
        ? this.ticketsApiService.listMyAssigned()
        : this.ticketsApiService.listMyCreated();

    request.pipe(finalize(() => this.loading.set(false))).subscribe({
      next: (tickets) => this.tickets.set(tickets),
      error: (error) => {
        this.errorMessage.set(error?.error?.message ?? 'No fue posible cargar los tickets.');
      }
    });
  }

  private normalizeValue(value: string): string {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
  }

  private updateHelpLayouts(): void {
    if (!this.helpOpen()) return;

    const container = document.querySelector('.tickets-page');
    if (!(container instanceof HTMLElement)) return;

    const containerRect = container.getBoundingClientRect();
    const layouts = this.helpSteps().reduce<Record<string, ContextHelpLayout>>((accumulator, step, index) => {
      const anchor = document.getElementById(step.anchorId);
      if (!(anchor instanceof HTMLElement)) return accumulator;

      const anchorRect = anchor.getBoundingClientRect();
      const relativeTop = anchorRect.top - containerRect.top + container.scrollTop;
      const relativeLeft = anchorRect.left - containerRect.left;
      const relativeRight = containerRect.right - anchorRect.right;
      const placeRight = index % 2 === 0 ? relativeRight > 300 : relativeRight > 260;
      const top = Math.max(relativeTop + 16, 12);
      const left = placeRight
        ? Math.min(anchorRect.width + relativeLeft + 22, Math.max(container.clientWidth - 296, 16))
        : Math.max(relativeLeft - 302, 16);

      accumulator[step.id] = {
        arrowClass: placeRight ? 'context-help__arrow context-help__arrow--left' : 'context-help__arrow context-help__arrow--right',
        calloutStyles: { left: `${left}px`, top: `${top}px` }
      };

      return accumulator;
    }, {});

    this.helpLayouts.set(layouts);
  }
}

