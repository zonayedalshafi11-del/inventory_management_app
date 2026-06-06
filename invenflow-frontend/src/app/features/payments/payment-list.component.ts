import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { Payment } from '../../shared/models/payment.model';
import { PaymentService } from './payment.service';
import { PaymentFormDialogComponent } from './payment-form-dialog.component';

@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    CurrencyPipe,
    DatePipe,
  ],
  templateUrl: './payment-list.component.html',
  styleUrl: './payment-list.component.scss',
})
export class PaymentListComponent implements OnInit {
  private readonly paymentService = inject(PaymentService);
  private readonly dialog = inject(MatDialog);

  protected readonly payments = signal<Payment[]>([]);
  protected readonly filteredPayments = signal<Payment[]>([]);
  protected readonly loading = signal(true);
  protected readonly searchTerm = signal('');

  protected readonly displayedColumns = [
    'amount',
    'method',
    'paymentDate',
    'type',
    'reference',
    'actions',
  ];

  ngOnInit(): void {
    this.loadPayments();
  }

  protected loadPayments(): void {
    this.loading.set(true);
    this.paymentService.getAll().subscribe({
      next: (data) => {
        this.payments.set(data);
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
      this.filteredPayments.set(this.payments());
      return;
    }
    this.filteredPayments.set(
      this.payments().filter(
        (p) =>
          p.method.toLowerCase().includes(term) ||
          (p.type ?? '').toLowerCase().includes(term) ||
          (p.supplier ?? '').toLowerCase().includes(term) ||
          (p.customerName ?? '').toLowerCase().includes(term),
      ),
    );
  }

  protected getReference(payment: Payment): string {
    if (payment.purchaseOrderId) {
      return `PO #${payment.purchaseOrderId}`;
    }
    if (payment.salesOrderId) {
      return `SO #${payment.salesOrderId}`;
    }
    return '—';
  }

  protected openCreate(): void {
    const ref = this.dialog.open(PaymentFormDialogComponent, {
      width: '480px',
      data: null,
    });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.loadPayments();
      }
    });
  }

  protected deletePayment(payment: Payment): void {
    if (!confirm(`Delete payment of ${payment.amount}?`)) {
      return;
    }
    this.paymentService.delete(payment.id).subscribe(() => this.loadPayments());
  }
}
