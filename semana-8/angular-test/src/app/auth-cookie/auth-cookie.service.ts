import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

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
        'http://localhost:3000/api/login',
        { email, password }
        // TODO: agregar { withCredentials: true } para que el navegador acepte la cookie httpOnly del login
      )
      .pipe(tap((user) => this.currentUser.set(user)));
  }

  logout(): Observable<void> {
    return this.http
      .post<void>(
        'http://localhost:3000/api/logout',
        {}
        // TODO: agregar { withCredentials: true } para que el navegador mande la cookie a borrar
      )
      .pipe(tap(() => this.currentUser.set(null)));
  }

  // El navegador manda la cookie httpOnly solo; esto sirve para
  // verificar la sesión al entrar a una ruta protegida o al refrescar.
  me(): Observable<CookieUser> {
    return this.http
      .get<CookieUser>(
        'http://localhost:3000/api/me'
        // TODO: agregar { withCredentials: true } para que el navegador envíe la cookie httpOnly
      )
      .pipe(tap((user) => this.currentUser.set(user)));
  }
}
