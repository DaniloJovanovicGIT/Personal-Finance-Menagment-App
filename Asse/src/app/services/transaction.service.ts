import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Transaction, TransactionsResponse } from '../../types/interfaces';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private transactionsSubject = new BehaviorSubject<TransactionsResponse | null>(null);
  transactions$ = this.transactionsSubject.asObservable();

  private apiUrl = 'http://127.0.0.1:4010/transactions?page=728&page-size=309&sort-by=dolor&sort-order=asc';
  private localStorageKey = 'transactions';


  constructor(private http: HttpClient) { }

  fetchTransactionsFromApi(): Observable<TransactionsResponse> {
    return this.http.get<TransactionsResponse>(this.apiUrl).pipe(
      tap((response: TransactionsResponse) => {
        this.storeTransactions(response.items);
        this.updateTransactions();
      }),
      catchError((error) => {
        console.error('Error fetching transactions from API:', error);
        return throwError(() => new Error('Error fetching transactions'));
      })
    );
  }

  private storeTransactions(transactions: Transaction[]): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(transactions));
  }

  private getStoredTransactions(): Transaction[] {
    const storedTransactions = localStorage.getItem(this.localStorageKey);
    return storedTransactions ? JSON.parse(storedTransactions) : [];
  }

  updateTransactions(): void {
    const storedTransactions = this.getStoredTransactions();
    const transactionsResponse: TransactionsResponse = {
      items: storedTransactions,
      ['total-count']: storedTransactions.length,
      page: 1,
      'page-size': 10,
      'sort-by': '',
      'sort-order': ''
    };
    this.transactionsSubject.next(transactionsResponse);
  }

  getTransactions(page: number, pageSize: number): void {
    const storedTransactions = this.getStoredTransactions();
    const paginatedTransactions = storedTransactions.slice((page - 1) * pageSize, page * pageSize);
    const transactionsResponse: TransactionsResponse = {
      items: paginatedTransactions,
      ['total-count']: storedTransactions.length,
      page: page,
      'page-size': pageSize,
      'sort-by': '',
      'sort-order': ''
    };
    this.transactionsSubject.next(transactionsResponse);
  }

  modifyTransaction(transaction: Transaction): void {
    let storedTransactions = this.getStoredTransactions();
    const index = storedTransactions.findIndex(t => t.id === transaction.id);
    if (index !== -1) {
      storedTransactions[index] = transaction;
      this.storeTransactions(storedTransactions);
      this.updateTransactions();
    }
  }
}
