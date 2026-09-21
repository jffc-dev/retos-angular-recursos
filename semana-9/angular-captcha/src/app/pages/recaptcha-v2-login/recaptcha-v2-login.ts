import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-recaptcha-v2-login',
  imports: [ReactiveFormsModule],
  templateUrl: './recaptcha-v2-login.html',
})
export class RecaptchaV2Login {
  private readonly fb = inject(FormBuilder);

  protected readonly submitted = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  protected get email() {
    return this.form.controls.email;
  }

  protected get password() {
    return this.form.controls.password;
  }

  protected onSubmit(): void {
    this.submitted.set(true);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // TODO: integrar reCAPTCHA v2 y enviar el token junto con las credenciales.
    console.log('recaptcha-v2 login', this.form.getRawValue());
  }
}
