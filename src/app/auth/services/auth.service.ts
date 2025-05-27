import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthResponse } from '@auth/interfaces/auth-response.interface';
import { User } from '@auth/interfaces/user.interface';
import { catchError, map, Observable, tap, of } from 'rxjs';
import { environment } from 'src/environments/environment.development';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

const baseUrl = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _authStatus = signal('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));

  private _http = inject(HttpClient);

  checkStatusResource = rxResource({
    loader: () => this.checkAuthStatus(),
  });

  authStatus = computed(() => {
    if (this._authStatus() == 'checking') return 'checking';
    if (this._user()) {
      return 'authenticated';
    }
    return 'not-authenticated';
  });

  user = computed<User | null>(() => this._user());
  token = computed(this._token);
  isAdmin = computed(() => this._user()?.roles.includes('admin') ?? false);

  login(email: string, password: string): Observable<boolean> {
    return this._http
      .post<AuthResponse>(`${baseUrl}/auth/login`, {
        email,
        password,
      })
      .pipe(
        map((resp) => this._handleAuthSuccess(resp)),
        catchError((error: any) => this._handleAuthError(error))
      );
  }

  checkAuthStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');

    if (!token) {
      this.logout();
      return of(false);
    }

    return this._http
      .get<AuthResponse>(`${baseUrl}/auth/check-status`)
      .pipe(
        tap((resp) => this._handleAuthSuccess(resp)),
        map(() => true),
        catchError((error: any) => this._handleAuthError(error))
      );
  }

  logout() {
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('not-authenticated');

    localStorage.clear();
  }

  private _handleAuthSuccess(resp: AuthResponse) {
    this._authStatus.set('authenticated');
    this._user.set(resp.user);
    this._token.set(resp.token);

    localStorage.setItem('token', resp.token);

    return true;
  }

  private _handleAuthError(error: any) {
    this.logout();
    return of(false);
  }
}
