import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthJwtService } from './auth-jwt.service';

// Adjunta el access_token de Supabase como Bearer a las peticiones salientes
// (útil para llamar a tu propia API o a Supabase Edge Functions con RLS).
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthJwtService);
  const token = auth.getAccessToken();

  if (!token) {
    return next(req);
  }

  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
