import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TransactionService } from '../services/transaction.service';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
  providers: [TransactionService]
})
export class FiltersComponent {
  fromDate: Date | null = null;
  toDate: Date | null = null;
  selectedOptionType = 'pmt';
  selectedOptionAccount = 'all';
  beneficiary = '';

  constructor(private transactionService: TransactionService) { }

  applyFilters(): void {
    const filters: any = {
      transactionKind: this.selectedOptionType,
      startDate: this.fromDate ? (this.fromDate instanceof Date ? this.fromDate.toISOString() : '') : '',
      endDate: this.toDate ? (this.toDate instanceof Date ? this.toDate.toISOString() : '') : '',
      page: 1,
      pageSize: 10,
      sortBy: '',
      sortOrder: 'asc'
    };

    console.log('Applying filters with:', filters);

    this.transactionService.fetchTransactions(filters).subscribe(
      (data) => {
        console.log('Transactions fetched successfully:', data);
        this.transactionService.updateTransactions(data);
      },
      (error) => {
        console.error('Error fetching transactions', error);
      }
    );
  }

  clearFilters(): void {
    this.fromDate = null;
    this.toDate = null;
    this.selectedOptionType = 'pmt';
    this.selectedOptionAccount = 'all';
    this.beneficiary = '';
    this.applyFilters();
  }
}
