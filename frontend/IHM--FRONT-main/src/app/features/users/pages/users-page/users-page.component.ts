import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { ROLES } from '../../../../core/constants/roles.constants';
import { User } from '../../../../core/models/user.model';
import { CreateUserPayload, UpdateUserPayload } from '../../models/user-payload.model';
import { UsersApiService } from '../../services/users-api.service';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.scss'
})
export class UsersPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly usersApiService = inject(UsersApiService);

  protected readonly ROLES = ROLES;
  protected readonly users = signal<User[]>([]);
  protected readonly loading = signal(false);
  protected readonly actionUserId = signal<number | null>(null);
  protected readonly errorMessage = signal('');
  protected readonly successMessage = signal('');
  
  protected readonly editingUser = signal<User | null>(null);
  protected readonly deletingUser = signal<User | null>(null);

  @ViewChild('createModal') createModal!: ModalComponent;
  @ViewChild('editModal') editModal!: ModalComponent;
  @ViewChild('deleteModal') deleteModal!: ModalComponent;

  protected readonly createForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    celular: ['', [Validators.pattern('^[0-9]{9}$')]],
    roles: [ROLES.usuario, Validators.required]
  });

  protected readonly editForm = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    celular: ['', [Validators.pattern('^[0-9]{9}$')]]
  });

  constructor() {
    this.loadUsers();
  }

  protected startCreate(): void {
    this.createForm.reset({
      email: '',
      password: '',
      nombre: '',
      apellido: '',
      celular: '',
      roles: ROLES.usuario
    });
    this.errorMessage.set('');
    this.successMessage.set('');
    this.createModal.open();
  }

  protected submitCreate(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const raw = this.createForm.getRawValue();
    const payload: CreateUserPayload = {
      ...raw,
      celular: raw.celular ? raw.celular : undefined,
      roles: [raw.roles]
    };

    this.usersApiService
      .create(payload)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.successMessage.set('Usuario creado correctamente.');
          this.createModal.close();
          this.loadUsers();
        },
        error: (error) => {
          this.errorMessage.set(error?.error?.message ?? 'No fue posible crear el usuario.');
        }
      });
  }

  protected startEdit(user: User): void {
    this.editingUser.set(user);
    this.editForm.setValue({
      nombre: user.nombre,
      apellido: user.apellido,
      celular: user.celular ?? ''
    });
    this.errorMessage.set('');
    this.successMessage.set('');
    this.editModal.open();
  }

  protected cancelEdit(): void {
    this.editingUser.set(null);
    this.editForm.reset();
    this.editModal.close();
  }

  protected submitEdit(): void {
    const user = this.editingUser();
    if (!user || this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.actionUserId.set(user.id);
    this.errorMessage.set('');
    this.successMessage.set('');

    const raw = this.editForm.getRawValue();
    const payload: UpdateUserPayload = {
      ...raw,
      celular: raw.celular ? raw.celular : undefined
    };

    this.usersApiService
      .update(user.id, payload)
      .pipe(finalize(() => this.actionUserId.set(null)))
      .subscribe({
        next: () => {
          this.successMessage.set('Usuario actualizado.');
          this.cancelEdit();
          this.loadUsers();
        },
        error: (error) => {
          this.errorMessage.set(error?.error?.message ?? 'No fue posible actualizar el usuario.');
        }
      });
  }

  protected startDelete(user: User): void {
    this.deletingUser.set(user);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.deleteModal.open();
  }

  protected cancelDelete(): void {
    this.deletingUser.set(null);
    this.deleteModal.close();
  }

  protected submitDelete(): void {
    const user = this.deletingUser();
    if (!user) return;

    this.actionUserId.set(user.id);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.usersApiService
      .delete(user.id)
      .pipe(finalize(() => this.actionUserId.set(null)))
      .subscribe({
        next: () => {
          this.successMessage.set('Usuario eliminado.');
          this.cancelDelete();
          this.loadUsers();
        },
        error: (error) => {
          this.errorMessage.set(error?.error?.message ?? 'No fue posible eliminar el usuario.');
        }
      });
  }

  private loadUsers(): void {
    this.loading.set(true);
    this.usersApiService
      .list()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (users) => this.users.set(users),
        error: (error) => {
          this.errorMessage.set(error?.error?.message ?? 'No fue posible cargar usuarios.');
        }
      });
  }
}
