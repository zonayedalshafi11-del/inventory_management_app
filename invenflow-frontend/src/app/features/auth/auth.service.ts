import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { TokenStorageService } from '../../core/services/token-storage.service';
import { AuthUser, LoginRequest } from '../../shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly tokenStorage = inject(TokenStorageService);
  private readonly router = inject(Router);

  private readonly currentUserSignal = signal<AuthUser | null>(this.tokenStorage.getUser());

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.currentUserSignal());
  readonly role = computed(() => this.currentUserSignal()?.role ?? null);

  login(credentials: LoginRequest): Observable<AuthUser> {
    return this.api.post<AuthUser>('/auth/login', credentials).pipe(
      tap((user) => {
        this.tokenStorage.saveSession(user);
        this.currentUserSignal.set(user);
      }),
    );
  }

  logout(): void {
    this.tokenStorage.clearSession();
    this.currentUserSignal.set(null);
    void this.router.navigate(['/login']);
  }

  hasPermission(permission: keyof AuthUser['permissions']): boolean {
    return !!this.currentUserSignal()?.permissions?.[permission];
  }
}
