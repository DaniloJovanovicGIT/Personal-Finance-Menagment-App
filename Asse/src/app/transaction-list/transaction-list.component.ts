import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../services/transaction.service';
import { TransactionsResponse } from '../../types/interfaces';
import { CommonModule } from '@angular/common';
import { TransactionComponent } from '../transaction/transaction.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { Transaction } from '../../types/interfaces';

@Component({
  standalone: true,
  imports: [CommonModule, TransactionComponent, PaginationComponent],
  selector: 'app-transactions-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionsListComponent implements OnInit {
  transactions: TransactionsResponse | null = null;
  currentPage: number = 1;
  pageSize: number = 3;

  constructor(private transactionService: TransactionService) { }

  ngOnInit(): void {
    this.transactionService.fetchTransactionsFromApi().subscribe({
      next: () => {
        this.loadTransactions();
      },
      error: (error: any) => {
        console.error('Error loading transactions', error);
      }
    });

    this.transactionService.transactions$.subscribe({
      next: (data: TransactionsResponse | null) => {
        this.transactions = data;
        console.log(data);
      },
      error: (error: any) => {
        console.error('Error in transactions stream', error);
      }
    });
  }

  loadTransactions(): void {
    this.transactionService.getTransactions(this.currentPage, this.pageSize);
  }

  onPageChanged(page: number): void {
    this.currentPage = page;
    this.loadTransactions();
  }

  onTransactionModified(transaction: Transaction): void {
    this.transactionService.modifyTransaction(transaction);
    this.loadTransactions(); // Reload to reflect changes
  }
}
