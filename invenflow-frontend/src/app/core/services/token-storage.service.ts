import { Injectable } from '@angular/core';
import { AuthUser } from '../../shared/models/user.model';

const TOKEN_KEY = 'invenflow_token';
const USER_KEY = 'invenflow_user';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  saveSession(user: AuthUser): void {
    localStorage.setItem(TOKEN_KEY, user.token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getUser(): AuthUser | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }

  clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
