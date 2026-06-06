import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../shared/models/user.model';
import { UserService } from './user.service';
import { UserFormDialogComponent } from './user-form-dialog.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly dialog = inject(MatDialog);

  protected readonly users = signal<User[]>([]);
  protected readonly filteredUsers = signal<User[]>([]);
  protected readonly loading = signal(true);
  protected readonly searchTerm = signal('');

  protected readonly displayedColumns = ['name', 'email', 'role', 'status', 'actions'];

  ngOnInit(): void {
    this.loadUsers();
  }

  protected loadUsers(): void {
    this.loading.set(true);
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users.set(data);
        this.applyFilter();
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected onSearch(term: string): void {
    this.searchTerm.set(term);
    this.applyFilter();
  }

  private applyFilter(): void {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) {
      this.filteredUsers.set(this.users());
      return;
    }
    this.filteredUsers.set(
      this.users().filter(
        (u) =>
          u.name.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term) ||
          u.role.toLowerCase().includes(term) ||
          (u.status ?? '').toLowerCase().includes(term),
      ),
    );
  }

  protected openCreate(): void {
    this.openDialog();
  }

  protected openEdit(user: User): void {
    this.openDialog(user);
  }

  private openDialog(user?: User): void {
    const ref = this.dialog.open(UserFormDialogComponent, {
      width: '560px',
      data: user ?? null,
    });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.loadUsers();
      }
    });
  }

  protected deleteUser(user: User): void {
    if (!user.id || !confirm(`Delete user "${user.name}"?`)) {
      return;
    }
    this.userService.delete(user.id).subscribe(() => this.loadUsers());
  }
}
