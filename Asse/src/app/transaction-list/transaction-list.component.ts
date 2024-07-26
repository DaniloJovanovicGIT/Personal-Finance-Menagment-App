import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../services/transaction.service';
import { CategoryService } from '../services/categories.service';
import { TransactionsResponse, CategoriesResponse, Transaction, Category } from '../../types/interfaces';
import { CommonModule } from '@angular/common';
import { TransactionComponent } from '../transaction/transaction.component';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  standalone: true,
  imports: [CommonModule, TransactionComponent, PaginationComponent],
  selector: 'app-transactions-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionsListComponent implements OnInit {

  transactions: TransactionsResponse | null = null;
  categories: Category[] = [];
 currentPage: number = 1;

  constructor(private transactionService: TransactionService, private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.transactionService.fetchTransactions({}).subscribe({
      next: (data: TransactionsResponse) => {
        this.transactions = data;
        this.assignCategoriesToTransactions();
        console.log(data);
      },
      error: (error: any) => {
        console.error('Error loading transactions', error);
      }
    });

    this.transactionService.transactions$.subscribe({
      next: (data: TransactionsResponse | null) => {
        this.transactions = data;
        this.assignCategoriesToTransactions();
        console.log(data);
      },
      error: (error: any) => {
        console.error('Error in transactions stream', error);
      }
    });

    this.fetchCategories();
  }

  fetchCategories(): void {
    this.categoryService.fetchCategories({}).subscribe({
      next: (data: CategoriesResponse) => {
        this.categories = data.items;
        this.assignCategoriesToTransactions();
      },
      error: (error: any) => {
        console.error('Error loading categories', error);
      }
    });
  }

  assignCategoriesToTransactions(): void {
    if (this.transactions && this.categories.length > 0) {
      this.transactions.items.forEach(transaction => {
        if (transaction.catcode) {
          const category = this.categories.find(cat => cat.code === transaction.catcode);
          if (category) {
            transaction.category = category;
          }
        }
      });
    }
  }

  onPageChanged(page: number): void {
    this.currentPage = page;
    this.fetchCategories();
  }
}
