import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthCookieService } from './auth-cookie.service';

export const cookieGuard: CanActivateFn = () => {
  const auth = inject(AuthCookieService);
  const router = inject(Router);

  return auth.me().pipe(
    map(() => true),
    catchError(() => of(router.parseUrl('/cookies/login')))
  );
};

// Para la ruta de login: si la cookie de sesión sigue siendo válida, saltamos al dashboard.
export const cookieGuestGuard: CanActivateFn = () => {
  const auth = inject(AuthCookieService);
  const router = inject(Router);

  return auth.me().pipe(
    map(() => router.parseUrl('/cookies/dashboard')),
    catchError(() => of(true))
  );
};
