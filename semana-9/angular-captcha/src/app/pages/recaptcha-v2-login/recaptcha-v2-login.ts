import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RecaptchaV2 } from '../../components/recaptcha-v2/recaptcha-v2';
import { RecaptchaService } from '../../services/recaptcha';

@Component({
  selector: 'app-recaptcha-v2-login',
  imports: [ReactiveFormsModule, RecaptchaV2],
  templateUrl: './recaptcha-v2-login.html',
})
export class RecaptchaV2Login {
  private recaptchaService = inject(RecaptchaService)
  private readonly fb = inject(FormBuilder);

  protected readonly submitted = signal(false);
  token = signal<string>('')

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

    this.recaptchaService.verify(this.token()).subscribe((result) => {
      if(result){
        // procedemos con auth http a supabase
      }else{
        // mostrar mensaje de error en la validacion de captcha
      }
    })




    // TODO: integrar reCAPTCHA v2 y enviar el token junto con las credenciales.
    console.log('recaptcha-v2 login', this.form.getRawValue());
  }

  onTokenSubmit(token: string){
    this.token.set(token)
  }
}
