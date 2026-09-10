import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CookieUser {
  username: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthCookieService {
  private readonly http = inject(HttpClient);

  readonly currentUser = signal<CookieUser | null>(null);

  login(email: string, password: string): Observable<CookieUser> {
    return this.http
      .post<CookieUser>(
        `${environment.apiUrl}/api/login`,
        { email, password },
        { withCredentials: true }
      )
      .pipe(tap((user) => this.currentUser.set(user)));
  }

  logout(): Observable<void> {
    return this.http
      .post<void>(`${environment.apiUrl}/api/logout`, {}, { withCredentials: true })
      .pipe(tap(() => this.currentUser.set(null)));
  }

  // El navegador manda la cookie httpOnly solo; esto sirve para
  // verificar la sesión al entrar a una ruta protegida o al refrescar.
  me(): Observable<CookieUser> {
    return this.http
      .get<CookieUser>(`${environment.apiUrl}/api/me`, { withCredentials: true })
      .pipe(tap((user) => this.currentUser.set(user)));
  }
}
