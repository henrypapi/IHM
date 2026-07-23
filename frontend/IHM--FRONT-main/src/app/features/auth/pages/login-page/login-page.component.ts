import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, finalize, of, switchMap } from 'rxjs';

import { AuthStateService } from '../../../../core/services/auth-state.service';
import { AuthApiService } from '../../services/auth-api.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authApiService = inject(AuthApiService);
  private readonly authStateService = inject(AuthStateService);
  private readonly router = inject(Router);

  protected readonly isSubmitting = signal(false);
  protected readonly serverError = signal('');

  protected readonly loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  protected submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.serverError.set('');
    this.isSubmitting.set(true);

    this.authApiService
      .login(this.loginForm.getRawValue())
      .pipe(
        switchMap((response) => {
          const token = response.token ?? response.accessToken ?? response.jwt;
          if (!token) {
            throw new Error('El backend no devolvio un token utilizable.');
          }

          this.authStateService.setSession(token, {
            id: response.usuario?.id,
            nombre: response.usuario?.nombre,
            apellido: response.usuario?.apellido,
            email: response.usuario?.email,
            roles: response.usuario?.roles ?? response.roles ?? response.usuario?.rol ?? response.rol ?? []
          });

          return this.authApiService.getCurrentUser().pipe(
            catchError(() => of(this.authStateService.getCurrentUser()))
          );
        }),
        finalize(() => this.isSubmitting.set(false))
      )
      .subscribe({
        next: (user) => {
          if (user) {
            this.authStateService.setCurrentUser(user);
          }

          void this.router.navigateByUrl('/dashboard');
        },
        error: (error) => {
          const message =
            error?.error?.message ??
            error?.message ??
            'No fue posible iniciar sesion. Revisa la URL del backend y el endpoint de login.';

          this.serverError.set(message);
        }
      });
  }

  protected hasFieldError(fieldName: 'email' | 'password'): boolean {
    const field = this.loginForm.controls[fieldName];
    return field.invalid && (field.dirty || field.touched);
  }
}
