import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { User } from '../../shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly api = inject(ApiService);

  getAll(): Observable<User[]> {
    return this.api.get<User[]>('/users');
  }

  getById(id: number): Observable<User> {
    return this.api.get<User>(`/users/${id}`);
  }

  create(user: User): Observable<User> {
    return this.api.post<User>('/users', user);
  }

  update(id: number, user: User): Observable<User> {
    return this.api.put<User>(`/users/${id}`, user);
  }

  delete(id: number): Observable<void> {
    return this.api.delete(`/users/${id}`);
  }
}
