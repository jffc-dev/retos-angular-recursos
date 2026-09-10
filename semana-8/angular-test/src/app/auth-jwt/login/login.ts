import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthJwtService } from '../auth-jwt.service';

@Component({
  selector: 'app-jwt-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthJwtService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);
    const { email, password } = this.form.getRawValue();

    this.auth.signIn(email, password).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigateByUrl('/jwt/dashboard');
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(
          err?.error?.error_description ?? err?.error?.msg ?? 'Error al iniciar sesión'
        );
      },
    });
  }
}
