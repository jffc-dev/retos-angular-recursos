import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthJwtService } from './auth-jwt.service';

export const jwtGuard: CanActivateFn = () => {
  const auth = inject(AuthJwtService);
  const router = inject(Router);

  return auth.verifySession().pipe(
    map(() => true),
    catchError(() => of(router.parseUrl('/jwt/login')))
  );
  return true
};

// Para la ruta de login: si ya hay una sesión válida, saltamos directo al dashboard.
export const jwtGuestGuard: CanActivateFn = () => {
  const auth = inject(AuthJwtService);
  const router = inject(Router);

  return auth.verifySession().pipe(
    map(() => router.parseUrl('/jwt/dashboard')),
    catchError(() => of(true))
  );
};
