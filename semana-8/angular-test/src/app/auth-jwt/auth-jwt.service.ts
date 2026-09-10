import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, of, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SupabaseUser {
  id: string;
  email: string;
}

interface SupabaseAuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: SupabaseUser;
}

const STORAGE_KEY = 'sb-auth';

@Injectable({ providedIn: 'root' })
export class AuthJwtService {
  private readonly http = inject(HttpClient);
  private readonly authUrl = `${environment.supabaseUrl}/auth/v1`;

  readonly currentUser = signal<SupabaseUser | null>(this.readStoredSession()?.user ?? null);

  private get apiKeyHeaders(): HttpHeaders {
    return new HttpHeaders({ apikey: environment.supabaseAnonKey });
  }

  signIn(email: string, password: string): Observable<SupabaseAuthResponse> {
    return this.http
      .post<SupabaseAuthResponse>(
        `${this.authUrl}/token?grant_type=password`,
        { email, password },
        { headers: this.apiKeyHeaders }
      )
      .pipe(tap((res) => this.storeSession(res)));
  }

  signUp(email: string, password: string): Observable<SupabaseAuthResponse> {
    return this.http.post<SupabaseAuthResponse>(
      `${this.authUrl}/signup`,
      { email, password },
      { headers: this.apiKeyHeaders }
    );
  }

  signOut(): Observable<void> {
    const token = this.getAccessToken();
    if (!token) {
      this.clearSession();
      return of(void 0);
    }

    const headers = this.apiKeyHeaders.set('Authorization', `Bearer ${token}`);
    return this.http.post<void>(`${this.authUrl}/logout`, {}, { headers }).pipe(
      tap(() => this.clearSession()),
      catchError(() => {
        // aunque el server rechace el logout (token ya vencido, etc.), limpiamos localmente
        this.clearSession();
        return of(void 0);
      })
    );
  }

  // Revalida el access_token contra Supabase; úsalo en guards para confirmar
  // que la sesión guardada en localStorage sigue siendo válida.
  verifySession(): Observable<SupabaseUser> {
    const token = this.getAccessToken();
    if (!token) {
      return throwError(() => new Error('No hay sesión'));
    }

    const headers = this.apiKeyHeaders.set('Authorization', `Bearer ${token}`);
    return this.http.get<SupabaseUser>(`${this.authUrl}/user`, { headers }).pipe(
      tap((user) => this.currentUser.set(user)),
      catchError((err) => {
        this.clearSession();
        return throwError(() => err);
      })
    );
  }

  getAccessToken(): string | null {
    return this.readStoredSession()?.access_token ?? null;
  }

  private storeSession(res: SupabaseAuthResponse): void {
    // TODO: guardar `res` en localStorage (localStorage.setItem(STORAGE_KEY, JSON.stringify(res)))
    this.currentUser.set(res.user);
  }

  private clearSession(): void {
    // TODO: borrar la sesión de localStorage (localStorage.removeItem(STORAGE_KEY))
    this.currentUser.set(null);
  }

  private readStoredSession(): SupabaseAuthResponse | null {
    // TODO: leer y parsear la sesión desde localStorage (localStorage.getItem(STORAGE_KEY))
    return null;
  }
}
