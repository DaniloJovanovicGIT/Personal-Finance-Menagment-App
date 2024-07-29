import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import { TransactionService } from '../services/transaction.service';
import { CategoryService } from '../services/categories.service';
import {
  TransactionsResponse,
  Transaction,
  Category,
  CategoriesResponse,
} from '../../types/interfaces';
import { CommonModule } from '@angular/common';
import { TransactionComponent } from '../transaction/transaction.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AddCategoryModalComponent } from '../add-category-modal/add-category-modal.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TransactionComponent,
    PaginationComponent,
    FormsModule,
    AddCategoryModalComponent,
  ],
  selector: 'app-transactions-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss'],
})
export class TransactionsListComponent implements OnInit, OnChanges, OnDestroy {
  @Input() filterData: any = {};
  transactions: TransactionsResponse | null = null;
  categories: Category[] = [];
  currentPage: number = 1;
  pageSize: number = 3;
  private transactionsSub: Subscription | null = null;
  showCategoryModal: boolean = false;
  selectedTransactionId: string | null = null;
  isSelecting: boolean = false;
  selectedTransactionIds: string[] = [];

  constructor(
    private transactionService: TransactionService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
    this.loadCategories();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filterData']) {
      this.loadTransactions();
    }
  }

  ngOnDestroy(): void {
    if (this.transactionsSub) {
      this.transactionsSub.unsubscribe();
    }
  }

  loadCategories(): void {
    this.categoryService.fetchCategories({}).subscribe({
      next: (response: CategoriesResponse) => {
        this.categories = response.items;
        this.loadTransactions();
      },
      error: (error: any) => {
        console.error('Error loading categories', error);
      },
    });
  }

  loadTransactions(): void {
    if (this.transactionsSub) {
      this.transactionsSub.unsubscribe();
    }

    this.transactionService.getTransactions(
      this.currentPage,
      this.pageSize,
      this.filterData
    );
    this.transactionsSub = this.transactionService.transactions$.subscribe({
      next: (data: TransactionsResponse | null) => {
        if (data) {
          const sortedItems = data.items.sort((a, b) => {
            const dateComparison =
              new Date(b.date).getTime() - new Date(a.date).getTime();
            if (dateComparison !== 0) return dateComparison;

            if (a.catcode === undefined && b.catcode !== undefined) return 1;
            if (a.catcode !== undefined && b.catcode === undefined) return -1;
            if (a.catcode === undefined && b.catcode === undefined) return 0;
            return a.catcode.localeCompare(b.catcode);
          });

          this.transactions = {
            ...data,
            items: this.assignCategoriesToTransactions(sortedItems),
          };
        }
      },
      error: (error: any) => {
        console.error('Error loading transactions', error);
      },
    });
  }

  assignCategoriesToTransactions(transactions: Transaction[]): Transaction[] {
    const categoryMap = new Map(this.categories.map((cat) => [cat.code, cat]));
    return transactions.map((transaction) => ({
      ...transaction,
      category: categoryMap.get(transaction.catcode) || undefined,
    }));
  }

  onPageChanged(page: number): void {
    this.currentPage = page;
    this.loadTransactions();
  }

  onTransactionModified(transaction: Transaction): void {
    this.transactionService.modifyTransaction(transaction);
  }

  openCategoryModal(transactionId: string | string[]): void {
    if (Array.isArray(transactionId)) {
      this.selectedTransactionIds = transactionId;
    } else {
      this.selectedTransactionId = transactionId;
    }
    this.showCategoryModal = true;
  }

  closeCategoryModal(): void {
    this.showCategoryModal = false;
    this.selectedTransactionId = null;
    this.selectedTransactionIds = [];
  }

  startSelecting(): void {
    this.isSelecting = true;
  }

  cancelSelection(): void {
    this.isSelecting = false;
    this.selectedTransactionIds = [];
  }

  confirmSelection(): void {
    if (this.selectedTransactionIds.length > 0) {
      this.openCategoryModal(this.selectedTransactionIds);
    } else {
      alert('Please select transactions to categorize.');
    }
  }

  onTransactionSelected(transactionId: string): void {
    const index = this.selectedTransactionIds.indexOf(transactionId);
    if (index > -1) {
      this.selectedTransactionIds.splice(index, 1);
    } else {
      this.selectedTransactionIds.push(transactionId);
    }
  }

  handleCategoryAdded(
    event: { categoryCode: string; subCategoryCode: string | null }
  ): void {
    if (event) {
      this.selectedTransactionIds.forEach(transactionId => {
        const transaction = this.transactions?.items.find(
          (t) => t.id === transactionId
        );
        if (transaction) {
          transaction.catcode = event.categoryCode;
          this.onTransactionModified(transaction);
        }
      });
    }
    this.closeCategoryModal();
  }
}
