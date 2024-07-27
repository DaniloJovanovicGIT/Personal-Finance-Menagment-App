import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TransactionService } from '../services/transaction.service';
import { TransactionsResponse, Transaction } from '../../types/interfaces';
import { CommonModule } from '@angular/common';
import { TransactionComponent } from '../transaction/transaction.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, TransactionComponent, PaginationComponent, FormsModule],
  selector: 'app-transactions-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionsListComponent implements OnInit, OnChanges {
  @Input() filterData: any = {};
  transactions: TransactionsResponse | null = null;
  currentPage: number = 1;
  pageSize: number = 3;

  constructor(private transactionService: TransactionService) { }

  ngOnInit(): void {
    this.loadTransactions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filterData']) {
      this.loadTransactions();
    }
  }

  loadTransactions(): void {
    this.transactionService.getTransactions(this.currentPage, this.pageSize, this.filterData);
    this.transactionService.transactions$.subscribe({
      next: (data: TransactionsResponse | null) => {
        this.transactions = data;
        console.log(data);
      },
      error: (error: any) => {
        console.error('Error loading transactions', error);
      }
    });
  }

  onPageChanged(page: number): void {
    this.currentPage = page;
    this.loadTransactions();
  }

  onTransactionModified(transaction: Transaction): void {
    this.transactionService.modifyTransaction(transaction);
  }
}
