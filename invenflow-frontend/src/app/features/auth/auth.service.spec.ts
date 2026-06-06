import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { TokenStorageService } from '../../core/services/token-storage.service';
import { AuthUser } from '../../shared/models/user.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let tokenStorage: TokenStorageService;

  const mockUser: AuthUser = {
    id: 'u-1',
    name: 'admin',
    email: 'admin@invenflow.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: 'Just now',
    permissions: {
      manageProducts: true,
      manageOrders: true,
      viewReports: true,
      manageUsers: true,
    },
    token: 'fake-jwt-token-123',
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        TokenStorageService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: { navigate: vi.fn() } },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    tokenStorage = TestBed.inject(TokenStorageService);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should login and persist token', () => {
    service.login({ email: 'admin@invenflow.com', password: 'admin' }).subscribe((user) => {
      expect(user.token).toBe('fake-jwt-token-123');
      expect(tokenStorage.getToken()).toBe('fake-jwt-token-123');
      expect(service.isAuthenticated()).toBe(true);
    });

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockUser);
  });

  it('should clear session on logout', () => {
    tokenStorage.saveSession(mockUser);
    service.logout();
    expect(tokenStorage.getToken()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });
});
