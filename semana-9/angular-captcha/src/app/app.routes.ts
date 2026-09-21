import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'recaptcha-v2',
    title: 'reCAPTCHA v2',
    loadComponent: () =>
      import('./pages/recaptcha-v2-login/recaptcha-v2-login').then((m) => m.RecaptchaV2Login),
  },
  {
    path: 'turnstile',
    title: 'Turnstile',
    loadComponent: () =>
      import('./pages/turnstile-login/turnstile-login').then((m) => m.TurnstileLogin),
  },
  { path: '', pathMatch: 'full', redirectTo: 'recaptcha-v2' },
  { path: '**', redirectTo: 'recaptcha-v2' },
];
